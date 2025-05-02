import {
  createAssociatedTokenAccountIdempotentInstruction,
  createSyncNativeInstruction,
  getAssociatedTokenAddressSync,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
  unpackAccount,
} from "@solana/spl-token";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { BN } from "bn.js";
import { expect } from "chai";
import { BanksClient, ProgramTestContext } from "solana-bankrun";
import {
  BaseFee,
  ConfigParameters,
  createConfig,
  CreateConfigParams,
  createPoolWithSplToken,
  swap,
  SwapParams,
} from "./instructions";
import {
  claimFeeLpCreatorDamm,
  claimFeeLpPartnerDamm,
  createMeteoraMetadata,
  creatorClaimLpDamm,
  lockLpForCreatorDamm,
  lockLpForPartnerDamm,
  MigrateMeteoraParams,
  migrateToMeteoraDamm,
  partnerClaimLpDamm,
} from "./instructions/meteoraMigration";
import {
  createDammConfig,
  createDammProgram,
  createVaultProgram,
  createVirtualCurveProgram,
  deriveDammPoolAddress,
  deriveLpMintAddress,
  derivePoolAuthority,
  fundSol,
  getDynamicVault,
  MAX_SQRT_PRICE,
  MIN_SQRT_PRICE,
  startTest,
  U64_MAX,
  VAULT_PROGRAM_ID,
} from "./utils";
import {
  getConfig,
  getLockEscrow,
  getMeteoraDammMigrationMetadata,
  getVirtualPool,
} from "./utils/fetcher";
import { DammPool, VirtualCurveProgram } from "./utils/types";

async function createPartnerConfig(
  payer: Keypair,
  owner: PublicKey,
  feeClaimer: PublicKey,
  banksClient: BanksClient,
  program: VirtualCurveProgram
): Promise<PublicKey> {
  const baseFee: BaseFee = {
    cliffFeeNumerator: new BN(2_500_000),
    numberOfPeriod: 0,
    reductionFactor: new BN(0),
    periodFrequency: new BN(0),
    feeSchedulerMode: 0,
  };

  const curves = [];

  for (let i = 1; i <= 16; i++) {
    if (i == 16) {
      curves.push({
        sqrtPrice: MAX_SQRT_PRICE,
        liquidity: U64_MAX.shln(30 + i),
      });
    } else {
      curves.push({
        sqrtPrice: MAX_SQRT_PRICE.muln(i * 5).divn(100),
        liquidity: U64_MAX.shln(30 + i),
      });
    }
  }

  const instructionParams: ConfigParameters = {
    poolFees: {
      baseFee,
      dynamicFee: null,
    },
    activationType: 0,
    collectFeeMode: 0,
    migrationOption: 0,
    tokenType: 0, // spl_token
    tokenDecimal: 6,
    migrationQuoteThreshold: new BN(LAMPORTS_PER_SOL * 5),
    partnerLpPercentage: 20,
    creatorLpPercentage: 20,
    partnerLockedLpPercentage: 55,
    creatorLockedLpPercentage: 5,
    sqrtStartPrice: MIN_SQRT_PRICE.shln(32),
    lockedVesting: {
      amountPerPeriod: new BN(0),
      cliffDurationFromMigrationTime: new BN(0),
      frequency: new BN(0),
      numberOfPeriod: new BN(0),
      cliffUnlockAmount: new BN(0),
    },
    migrationFeeOption: 0,
    tokenSupply: null,
    creatorTradingFeePercentage: 0,
    padding0: [],
    padding: [],
    curve: curves,
  };
  const params: CreateConfigParams = {
    payer,
    leftoverReceiver: owner,
    feeClaimer,
    quoteMint: NATIVE_MINT,
    instructionParams,
  };
  return createConfig(banksClient, program, params);
}

async function setupPrerequisite(
  banksClient: BanksClient,
  program: VirtualCurveProgram,
  payer: Keypair,
  poolCreator: Keypair,
  swapInitiator: Keypair,
  admin: Keypair,
  config: PublicKey
): Promise<{
  virtualPool: PublicKey;
  dammConfig: PublicKey;
  migrationMetadata: PublicKey;
  dammPoolAddress: PublicKey;
}> {
  const virtualPool = await createPoolWithSplToken(banksClient, program, {
    payer,
    poolCreator,
    quoteMint: NATIVE_MINT,
    config,
    instructionParams: {
      name: "test token spl",
      symbol: "TEST",
      uri: "abc.com",
    },
  });

  const virtualPoolState = await getVirtualPool(
    banksClient,
    program,
    virtualPool
  );

  const params: SwapParams = {
    config,
    payer: swapInitiator,
    pool: virtualPool,
    inputTokenMint: NATIVE_MINT,
    outputTokenMint: virtualPoolState.baseMint,
    amountIn: new BN(LAMPORTS_PER_SOL * 5.5),
    minimumAmountOut: new BN(0),
    referralTokenAccount: null,
  };

  await swap(banksClient, program, params);

  const migrationMetadata = await createMeteoraMetadata(banksClient, program, {
    payer: admin,
    virtualPool,
    config,
  });

  const poolAuthority = derivePoolAuthority();
  const dammConfig = await createDammConfig(banksClient, admin, poolAuthority);
  const migrationParams: MigrateMeteoraParams = {
    payer: admin,
    virtualPool,
    dammConfig,
  };

  const dammPoolAddress = await migrateToMeteoraDamm(
    banksClient,
    program,
    migrationParams
  );

  return {
    virtualPool,
    dammConfig,
    migrationMetadata,
    dammPoolAddress,
  };
}

async function startTestContext(): Promise<{
  context: ProgramTestContext;
  admin: Keypair;
  operator: Keypair;
  partner: Keypair;
  user: Keypair;
  poolCreator: Keypair;
  program: VirtualCurveProgram;
}> {
  const context = await startTest();
  const admin = context.payer;
  const operator = Keypair.generate();
  const partner = Keypair.generate();
  const user = Keypair.generate();
  const poolCreator = Keypair.generate();
  const receivers = [
    operator.publicKey,
    partner.publicKey,
    user.publicKey,
    poolCreator.publicKey,
  ];
  await fundSol(context.banksClient, admin, receivers);
  const program = createVirtualCurveProgram();

  return {
    context,
    admin,
    operator,
    partner,
    user,
    poolCreator,
    program,
  };
}

async function generateSwapFeesOnDamm(
  banksClient: BanksClient,
  pool: PublicKey,
  userKeypair: Keypair
) {
  const dammProgram = createDammProgram();

  const poolAccount = await banksClient.getAccount(pool);

  const poolState: DammPool = dammProgram.coder.accounts.decode(
    "pool",
    Buffer.from(poolAccount.data)
  );

  const vaultAState = await getDynamicVault(banksClient, poolState.aVault);
  const vaultBState = await getDynamicVault(banksClient, poolState.bVault);

  const swapDirection = [1, 0];

  for (const direction of swapDirection) {
    const bToA = direction == 1;

    const [
      userSourceToken,
      sourceMint,
      userDestinationToken,
      destinationMint,
      protocolTokenFee,
    ] = bToA
      ? [
          getAssociatedTokenAddressSync(
            poolState.tokenBMint,
            userKeypair.publicKey
          ),
          poolState.tokenBMint,
          getAssociatedTokenAddressSync(
            poolState.tokenAMint,
            userKeypair.publicKey
          ),
          poolState.tokenAMint,
          poolState.protocolTokenBFee,
        ]
      : [
          getAssociatedTokenAddressSync(
            poolState.tokenAMint,
            userKeypair.publicKey
          ),
          poolState.tokenAMint,
          getAssociatedTokenAddressSync(
            poolState.tokenBMint,
            userKeypair.publicKey
          ),
          poolState.tokenBMint,
          poolState.protocolTokenAFee,
        ];

    const initUserSourceIx = createAssociatedTokenAccountIdempotentInstruction(
      userKeypair.publicKey,
      userSourceToken,
      userKeypair.publicKey,
      sourceMint,
      TOKEN_PROGRAM_ID
    );

    const initUserDestinationIx =
      createAssociatedTokenAccountIdempotentInstruction(
        userKeypair.publicKey,
        userDestinationToken,
        userKeypair.publicKey,
        destinationMint,
        TOKEN_PROGRAM_ID
      );

    const preInstructions = [initUserSourceIx, initUserDestinationIx];

    let inAmount = new BN(0);
    if (bToA) {
      inAmount = new BN(100_000_000);
      preInstructions.push(
        SystemProgram.transfer({
          fromPubkey: userKeypair.publicKey,
          toPubkey: userSourceToken,
          lamports: BigInt(inAmount.toString()),
        }),
        createSyncNativeInstruction(userSourceToken)
      );
    } else {
      const sourceTokenAccount = await banksClient.getAccount(userSourceToken);
      const sourceTokenState = unpackAccount(
        userSourceToken,
        sourceTokenAccount as any
      );

      inAmount = new BN(sourceTokenState.amount.toString());
    }

    const swapIx = await dammProgram.methods
      .swap(inAmount, new BN(0))
      .accountsPartial({
        pool,
        user: userKeypair.publicKey,
        aVault: poolState.aVault,
        bVault: poolState.bVault,
        aVaultLp: poolState.aVaultLp,
        bVaultLp: poolState.bVaultLp,
        aTokenVault: vaultAState.tokenVault,
        bTokenVault: vaultBState.tokenVault,
        aVaultLpMint: vaultAState.lpMint,
        bVaultLpMint: vaultBState.lpMint,
        userSourceToken,
        userDestinationToken,
        protocolTokenFee,
        tokenProgram: TOKEN_PROGRAM_ID,
        vaultProgram: VAULT_PROGRAM_ID,
      })
      .instruction();

    let transaction = new Transaction();
    const [recentBlockhash] = await banksClient.getLatestBlockhash();
    transaction.recentBlockhash = recentBlockhash;
    transaction.add(...preInstructions, swapIx);
    transaction.sign(userKeypair);

    await banksClient.processTransaction(transaction);
  }
}

describe.only("Claim fee lp on meteora dammm", () => {
  let context: ProgramTestContext;
  let admin: Keypair;
  let operator: Keypair;
  let partner: Keypair;
  let user: Keypair;
  let poolCreator: Keypair;
  let program: VirtualCurveProgram;
  let config: PublicKey;
  let virtualPool: PublicKey;
  let dammConfig: PublicKey;
  let migrationMetadata: PublicKey;
  let dammPoolAddress: PublicKey;

  describe("Self partnered creator", () => {
    before(async () => {
      const {
        context: innerContext,
        admin: innerAdmin,
        operator: innerOperator,
        user: innerUser,
        poolCreator: innerPoolCreator,
        partner: innerPartner,
        program: innerProgram,
      } = await startTestContext();

      context = innerContext;
      admin = innerAdmin;
      operator = innerOperator;
      partner = innerPartner;
      user = innerUser;
      poolCreator = innerPoolCreator;
      program = innerProgram;

      config = await createPartnerConfig(
        admin,
        poolCreator.publicKey,
        poolCreator.publicKey,
        context.banksClient,
        program
      );

      const {
        dammConfig: innerDammConfig,
        virtualPool: innerVirtualPool,
        migrationMetadata: innerMigrationMetadata,
        dammPoolAddress: innerDammPoolAddress,
      } = await setupPrerequisite(
        context.banksClient,
        program,
        admin,
        poolCreator,
        user,
        admin,
        config
      );

      dammConfig = innerDammConfig;
      virtualPool = innerVirtualPool;
      migrationMetadata = innerMigrationMetadata;
      dammPoolAddress = innerDammPoolAddress;

      await generateSwapFeesOnDamm(context.banksClient, dammPoolAddress, user);
    });

    it("Self partnered creator lock LP", async () => {
      let beforeMigrationMetadata = await getMeteoraDammMigrationMetadata(
        context.banksClient,
        program,
        migrationMetadata
      );

      const lockEscrowKey = await lockLpForPartnerDamm(
        context.banksClient,
        program,
        {
          payer: partner, // Partner or creator it's fine
          dammConfig,
          virtualPool,
        }
      );

      let afterMigrationMetadata = await getMeteoraDammMigrationMetadata(
        context.banksClient,
        program,
        migrationMetadata
      );

      expect(beforeMigrationMetadata.creatorLockedStatus).equal(Number(false));
      expect(beforeMigrationMetadata.partnerLockedStatus).equal(Number(false));

      expect(afterMigrationMetadata.creatorLockedStatus).equal(Number(true));
      expect(afterMigrationMetadata.partnerLockedStatus).equal(Number(true));

      const lockEscrowState = await getLockEscrow(
        context.banksClient,
        createDammProgram(),
        lockEscrowKey
      );

      expect(beforeMigrationMetadata.actualCreatorLockedLp.isZero()).to.be.true;
      expect(beforeMigrationMetadata.actualPartnerLockedLp.isZero()).to.be.true;

      expect(
        afterMigrationMetadata.actualCreatorLockedLp.gt(
          beforeMigrationMetadata.actualCreatorLockedLp
        )
      ).to.be.true;

      expect(
        afterMigrationMetadata.actualPartnerLockedLp.gt(
          beforeMigrationMetadata.actualPartnerLockedLp
        )
      ).to.be.true;

      expect(afterMigrationMetadata.creatorClaimFeeLp).equal(Number(false));
      expect(afterMigrationMetadata.partnerClaimFeeLp).equal(Number(false));

      const expectedTotalLockLp =
        afterMigrationMetadata.actualCreatorLockedLp.add(
          afterMigrationMetadata.actualPartnerLockedLp
        );
      const totalLockLp = lockEscrowState.totalLockedAmount;

      expect(expectedTotalLockLp.toString()).equal(totalLockLp.toString());

      const lpMint = deriveLpMintAddress(dammPoolAddress);
      const creatorLpAta = getAssociatedTokenAddressSync(
        lpMint,
        afterMigrationMetadata.poolCreator
      );

      const beforeCreatorLpAccount = await context.banksClient.getAccount(
        creatorLpAta
      );

      beforeMigrationMetadata = afterMigrationMetadata;

      await claimFeeLpCreatorDamm(context.banksClient, program, {
        payer: user,
        virtualPool,
        dammConfig,
      });

      const afterCreatorLpAccount = await context.banksClient.getAccount(
        creatorLpAta
      );

      afterMigrationMetadata = await getMeteoraDammMigrationMetadata(
        context.banksClient,
        program,
        migrationMetadata
      );

      const beforeLpAmount = beforeCreatorLpAccount
        ? unpackAccount(creatorLpAta, beforeCreatorLpAccount as any).amount
        : BigInt(0);

      const afterLpAmount = unpackAccount(
        creatorLpAta,
        afterCreatorLpAccount as any
      ).amount;

      const claimedFeeLpAmount = new BN(
        (afterLpAmount - beforeLpAmount).toString()
      );

      const totalLpAmount = afterMigrationMetadata.creatorLockedLp.add(
        afterMigrationMetadata.partnerLockedLp
      );

      const totalActualLockedLpAmount =
        afterMigrationMetadata.actualCreatorLockedLp.add(
          afterMigrationMetadata.actualPartnerLockedLp
        );

      expect(claimedFeeLpAmount.toString()).eq(
        totalLpAmount.sub(totalActualLockedLpAmount).toString()
      );

      expect(afterMigrationMetadata.creatorClaimFeeLp).equal(Number(true));
      expect(afterMigrationMetadata.partnerClaimFeeLp).equal(Number(true));
    });

    it("Self partnered creator claim LP", async () => {
      const configState = await getConfig(context.banksClient, program, config);

      const virtualPoolState = await getVirtualPool(
        context.banksClient,
        program,
        virtualPool
      );

      const dammPool = deriveDammPoolAddress(
        dammConfig,
        virtualPoolState.baseMint,
        configState.quoteMint
      );

      const lpMint = deriveLpMintAddress(dammPool);
      const creatorLpAta = getAssociatedTokenAddressSync(
        lpMint,
        poolCreator.publicKey
      );

      const beforeMigrationMetadata = await getMeteoraDammMigrationMetadata(
        context.banksClient,
        program,
        migrationMetadata
      );

      const beforeCreatorLpTokenAccount = await context.banksClient.getAccount(
        creatorLpAta
      );

      await creatorClaimLpDamm(context.banksClient, program, {
        payer: poolCreator,
        dammConfig,
        virtualPool,
      });

      const afterMigrationMetadata = await getMeteoraDammMigrationMetadata(
        context.banksClient,
        program,
        migrationMetadata
      );

      const afterCreatorLpTokenAccount = await context.banksClient.getAccount(
        creatorLpAta
      );

      const beforeCreatorLpTokenState = unpackAccount(
        creatorLpAta,
        beforeCreatorLpTokenAccount as any // TODO: find a better way
      );

      const afterCreatorLpTokenState = unpackAccount(
        creatorLpAta,
        afterCreatorLpTokenAccount as any // TODO: find a better way
      );

      const lpAmountClaimed = new BN(
        (
          afterCreatorLpTokenState.amount - beforeCreatorLpTokenState.amount
        ).toString()
      );

      expect(beforeMigrationMetadata.creatorClaimStatus).equal(Number(false));
      expect(beforeMigrationMetadata.partnerClaimStatus).equal(Number(false));

      expect(afterMigrationMetadata.creatorClaimStatus).equal(Number(true));
      expect(afterMigrationMetadata.partnerClaimStatus).equal(Number(true));

      const expectedLpToClaim = beforeMigrationMetadata.creatorLp.add(
        beforeMigrationMetadata.partnerLp
      );

      expect(expectedLpToClaim.toString()).equal(lpAmountClaimed.toString());
    });
  });

  describe("Separated partner and creator", () => {
    before(async () => {
      const {
        context: innerContext,
        admin: innerAdmin,
        operator: innerOperator,
        user: innerUser,
        poolCreator: innerPoolCreator,
        partner: innerPartner,
        program: innerProgram,
      } = await startTestContext();

      context = innerContext;
      admin = innerAdmin;
      operator = innerOperator;
      partner = innerPartner;
      user = innerUser;
      poolCreator = innerPoolCreator;
      program = innerProgram;

      config = await createPartnerConfig(
        admin,
        poolCreator.publicKey,
        partner.publicKey,
        context.banksClient,
        program
      );

      const {
        dammConfig: innerDammConfig,
        virtualPool: innerVirtualPool,
        migrationMetadata: innerMigrationMetadata,
        dammPoolAddress: innerDammPoolAddress,
      } = await setupPrerequisite(
        context.banksClient,
        program,
        operator,
        poolCreator,
        user,
        admin,
        config
      );

      dammConfig = innerDammConfig;
      virtualPool = innerVirtualPool;
      migrationMetadata = innerMigrationMetadata;
      dammPoolAddress = innerDammPoolAddress;

      await generateSwapFeesOnDamm(context.banksClient, dammPoolAddress, user);
    });

    it("Creator lock LP", async () => {
      let beforeMigrationMetadata = await getMeteoraDammMigrationMetadata(
        context.banksClient,
        program,
        migrationMetadata
      );

      const lockEscrowKey = await lockLpForCreatorDamm(
        context.banksClient,
        program,
        {
          payer: poolCreator,
          dammConfig,
          virtualPool,
        }
      );

      let afterMigrationMetadata = await getMeteoraDammMigrationMetadata(
        context.banksClient,
        program,
        migrationMetadata
      );

      expect(beforeMigrationMetadata.creatorLockedStatus).equal(Number(false));
      expect(afterMigrationMetadata.creatorLockedStatus).equal(Number(true));
      expect(afterMigrationMetadata.creatorClaimFeeLp).equal(Number(false));

      expect(beforeMigrationMetadata.partnerLockedStatus).equals(
        afterMigrationMetadata.partnerLockedStatus
      );

      const lockEscrowState = await getLockEscrow(
        context.banksClient,
        createDammProgram(),
        lockEscrowKey
      );

      const expectedTotalLockLp = afterMigrationMetadata.actualCreatorLockedLp;
      const totalLockLp = lockEscrowState.totalLockedAmount;

      expect(expectedTotalLockLp.toString()).equal(totalLockLp.toString());

      beforeMigrationMetadata = afterMigrationMetadata;

      const lpMint = deriveLpMintAddress(dammPoolAddress);
      const creatorLpAta = getAssociatedTokenAddressSync(
        lpMint,
        beforeMigrationMetadata.poolCreator
      );

      const beforeCreatorLpAccount = await context.banksClient.getAccount(
        creatorLpAta
      );

      await claimFeeLpCreatorDamm(context.banksClient, program, {
        payer: user,
        virtualPool,
        dammConfig,
      });

      const afterCreatorLpAccount = await context.banksClient.getAccount(
        creatorLpAta
      );

      const beforeCreatorLpAmount = beforeCreatorLpAccount
        ? unpackAccount(creatorLpAta, beforeCreatorLpAccount as any).amount
        : BigInt(0);

      const afterCreatorLpTokenState = unpackAccount(
        creatorLpAta,
        afterCreatorLpAccount as any
      ).amount;

      afterMigrationMetadata = await getMeteoraDammMigrationMetadata(
        context.banksClient,
        program,
        migrationMetadata
      );

      const expectedFeeLpToClaim = afterMigrationMetadata.creatorLockedLp.sub(
        afterMigrationMetadata.actualCreatorLockedLp
      );

      expect(expectedFeeLpToClaim.toString()).equal(
        new BN(
          (afterCreatorLpTokenState - beforeCreatorLpAmount).toString()
        ).toString()
      );

      expect(afterMigrationMetadata.creatorClaimFeeLp).equals(Number(true));
      expect(afterMigrationMetadata.partnerClaimFeeLp).equal(Number(false));
    });

    it("Partner lock LP", async () => {
      let beforeMigrationMetadata = await getMeteoraDammMigrationMetadata(
        context.banksClient,
        program,
        migrationMetadata
      );

      const lockEscrowKey = await lockLpForPartnerDamm(
        context.banksClient,
        program,
        {
          payer: partner,
          dammConfig,
          virtualPool,
        }
      );

      let afterMigrationMetadata = await getMeteoraDammMigrationMetadata(
        context.banksClient,
        program,
        migrationMetadata
      );

      expect(beforeMigrationMetadata.partnerLockedStatus).equal(Number(false));
      expect(afterMigrationMetadata.partnerLockedStatus).equal(Number(true));
      expect(afterMigrationMetadata.partnerClaimFeeLp).equals(Number(false));

      expect(beforeMigrationMetadata.creatorLockedStatus).equals(
        afterMigrationMetadata.creatorLockedStatus
      );

      const lockEscrowState = await getLockEscrow(
        context.banksClient,
        createDammProgram(),
        lockEscrowKey
      );

      const expectedTotalLockLp = afterMigrationMetadata.actualPartnerLockedLp;
      const totalLockLp = lockEscrowState.totalLockedAmount;

      expect(expectedTotalLockLp.toString()).equal(totalLockLp.toString());

      beforeMigrationMetadata = afterMigrationMetadata;

      const lpMint = deriveLpMintAddress(dammPoolAddress);
      const partnerLpAta = getAssociatedTokenAddressSync(
        lpMint,
        beforeMigrationMetadata.partner
      );

      const beforePartnerLpAccount = await context.banksClient.getAccount(
        partnerLpAta
      );

      await claimFeeLpPartnerDamm(context.banksClient, program, {
        payer: user,
        virtualPool,
        dammConfig,
      });

      const afterPartnerLpAccount = await context.banksClient.getAccount(
        partnerLpAta
      );

      const beforePartnerLpAmount = beforePartnerLpAccount
        ? unpackAccount(partnerLpAta, beforePartnerLpAccount as any).amount
        : BigInt(0);

      const afterPartnerLpTokenState = unpackAccount(
        partnerLpAta,
        afterPartnerLpAccount as any
      ).amount;

      afterMigrationMetadata = await getMeteoraDammMigrationMetadata(
        context.banksClient,
        program,
        migrationMetadata
      );

      const expectedFeeLpToClaim = afterMigrationMetadata.partnerLockedLp.sub(
        afterMigrationMetadata.actualPartnerLockedLp
      );

      expect(expectedFeeLpToClaim.toString()).equal(
        new BN(
          (afterPartnerLpTokenState - beforePartnerLpAmount).toString()
        ).toString()
      );
    });

    it("Creator claim LP", async () => {
      const configState = await getConfig(context.banksClient, program, config);

      const virtualPoolState = await getVirtualPool(
        context.banksClient,
        program,
        virtualPool
      );

      const dammPool = deriveDammPoolAddress(
        dammConfig,
        virtualPoolState.baseMint,
        configState.quoteMint
      );

      const lpMint = deriveLpMintAddress(dammPool);
      const creatorLpAta = getAssociatedTokenAddressSync(
        lpMint,
        poolCreator.publicKey
      );

      const beforeMigrationMetadata = await getMeteoraDammMigrationMetadata(
        context.banksClient,
        program,
        migrationMetadata
      );

      const beforeLpTokenAccount = await context.banksClient.getAccount(
        creatorLpAta
      );

      await creatorClaimLpDamm(context.banksClient, program, {
        payer: poolCreator,
        dammConfig,
        virtualPool,
      });

      const afterMigrationMetadata = await getMeteoraDammMigrationMetadata(
        context.banksClient,
        program,
        migrationMetadata
      );

      const afterLpTokenAccount = await context.banksClient.getAccount(
        creatorLpAta
      );

      const beforeLpTokenState = unpackAccount(
        creatorLpAta,
        beforeLpTokenAccount as any // TODO: find a better way
      );

      const afterLpTokenState = unpackAccount(
        creatorLpAta,
        afterLpTokenAccount as any // TODO: find a better way
      );

      expect(beforeMigrationMetadata.creatorClaimStatus).equal(Number(false));
      expect(afterMigrationMetadata.creatorClaimStatus).equal(Number(true));

      expect(beforeMigrationMetadata.partnerClaimStatus).equal(
        afterMigrationMetadata.partnerClaimStatus
      );

      const expectedLpToClaim = beforeMigrationMetadata.creatorLp;
      const claimedLpAmount = new BN(
        (afterLpTokenState.amount - beforeLpTokenState.amount).toString()
      );

      expect(expectedLpToClaim.toString()).equal(claimedLpAmount.toString());
    });

    it("Partner claim LP", async () => {
      const configState = await getConfig(context.banksClient, program, config);

      const virtualPoolState = await getVirtualPool(
        context.banksClient,
        program,
        virtualPool
      );

      const dammPool = deriveDammPoolAddress(
        dammConfig,
        virtualPoolState.baseMint,
        configState.quoteMint
      );

      const lpMint = deriveLpMintAddress(dammPool);
      const partnerLpAta = getAssociatedTokenAddressSync(
        lpMint,
        partner.publicKey
      );

      const beforeMigrationMetadata = await getMeteoraDammMigrationMetadata(
        context.banksClient,
        program,
        migrationMetadata
      );

      const beforePartnerLpAccount = await context.banksClient.getAccount(
        partnerLpAta
      );

      await partnerClaimLpDamm(context.banksClient, program, {
        payer: partner,
        dammConfig,
        virtualPool,
      });

      const afterMigrationMetadata = await getMeteoraDammMigrationMetadata(
        context.banksClient,
        program,
        migrationMetadata
      );

      const afterPartnerLpAccount = await context.banksClient.getAccount(
        partnerLpAta
      );

      const beforePartnerLpTokenState = unpackAccount(
        partnerLpAta,
        beforePartnerLpAccount as any // TODO: find a better way
      );

      const afterPartnerLpTokenState = unpackAccount(
        partnerLpAta,
        afterPartnerLpAccount as any // TODO: find a better way
      );

      expect(beforeMigrationMetadata.partnerClaimStatus).equal(Number(false));
      expect(afterMigrationMetadata.partnerClaimStatus).equal(Number(true));

      expect(beforeMigrationMetadata.creatorClaimStatus).equal(
        afterMigrationMetadata.creatorClaimStatus
      );

      const expectedLpToClaim = beforeMigrationMetadata.partnerLp;
      const claimedLpAmount = new BN(
        (
          afterPartnerLpTokenState.amount - beforePartnerLpTokenState.amount
        ).toString()
      );

      expect(expectedLpToClaim.toString()).equal(claimedLpAmount.toString());
    });
  });
});
