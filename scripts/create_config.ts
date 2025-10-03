import { readFile } from "fs/promises";
import path from "path";
import { AnchorProvider, BN, Program, Wallet, Idl } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";

async function loadKeypair(keyPath: string): Promise<Keypair> {
  const absolutePath = path.resolve(keyPath);
  const secret = JSON.parse(await readFile(absolutePath, "utf8"));
  const secretKey = Uint8Array.from(secret);
  return Keypair.fromSecretKey(secretKey);
}

async function loadIdl(idlPath: string) {
  const absolutePath = path.resolve(idlPath);
  const contents = await readFile(absolutePath, "utf8");
  return JSON.parse(contents);
}

function toBN(value: string | number | bigint): BN {
  return new BN(value.toString());
}

async function main() {
  const walletPath = process.env.WALLET ?? path.join(__dirname, "../keys/devnet/deployer.json");
  const idlPath = process.env.IDL_PATH ?? path.join(__dirname, "../target/idl/dynamic_bonding_curve.json");
  const rpcUrl = process.env.RPC_URL ?? "https://api.devnet.solana.com";

  const feeClaimerAddress = process.env.FEE_CLAIMER ?? "7iP6tKxvovkSTKggrYVYhkQgHLvT1CqKxop16wbK5jE9";
  const leftoverReceiverAddress = process.env.LEFTOVER_RECEIVER ?? feeClaimerAddress;
  const quoteMintAddress = process.env.QUOTE_MINT ?? "So11111111111111111111111111111111111111112";

  const migrationOption = Number(process.env.MIGRATION_OPTION ?? 1); // Damm V2
  const migrationFeeOption = Number(process.env.MIGRATION_FEE_OPTION ?? 2); // FixedBps100 (1%)
  const collectFeeMode = Number(process.env.COLLECT_FEE_MODE ?? 1); // collect in both tokens
  const activationType = Number(process.env.ACTIVATION_TYPE ?? 0); // slot based
  const tokenType = Number(process.env.TOKEN_TYPE ?? 0); // SPL token
  const tokenDecimal = Number(process.env.TOKEN_DECIMAL ?? 9);
  const partnerLpPercentage = Number(process.env.PARTNER_LP_PERCENTAGE ?? 20);
  const partnerLockedLpPercentage = Number(process.env.PARTNER_LOCKED_LP_PERCENTAGE ?? 0);
  const creatorLpPercentage = Number(process.env.CREATOR_LP_PERCENTAGE ?? 80);
  const creatorLockedLpPercentage = Number(process.env.CREATOR_LOCKED_LP_PERCENTAGE ?? 0);
  const creatorTradingFeePercentage = Number(process.env.CREATOR_TRADING_FEE_PERCENTAGE ?? 50);
  const tokenUpdateAuthority = Number(process.env.TOKEN_UPDATE_AUTHORITY ?? 0);

  const migrationQuoteThreshold = toBN(process.env.MIGRATION_QUOTE_THRESHOLD ?? "1000000000");
  const sqrtStartPrice = toBN("4295048016000000");
  const firstSqrtPrice = toBN("4295048016000000000");

  const providerConnection = new Connection(rpcUrl, "confirmed");
  const payerKeypair = await loadKeypair(walletPath);
  const wallet = new Wallet(payerKeypair);
  const provider = new AnchorProvider(providerConnection, wallet, {
    commitment: "confirmed",
  });

  const idl = await loadIdl(idlPath);
  const program = new Program(idl as Idl, provider);
  if (!program.programId) {
    throw new Error("Program ID missing in IDL metadata");
  }

  const feeClaimer = new PublicKey(feeClaimerAddress);
  const leftoverReceiver = new PublicKey(leftoverReceiverAddress);
  const quoteMint = new PublicKey(quoteMintAddress);

  const configKeypair = Keypair.generate();

  const instructionParams = {
    poolFees: {
      baseFee: {
        cliffFeeNumerator: toBN("5000000"),
        firstFactor: 0,
        secondFactor: toBN(0),
        thirdFactor: toBN(0),
        baseFeeMode: 0,
      },
      dynamicFee: null,
    },
    collectFeeMode,
    migrationOption,
    activationType,
    tokenType,
    tokenDecimal,
    migrationQuoteThreshold,
    partnerLpPercentage,
    partnerLockedLpPercentage,
    creatorLpPercentage,
    creatorLockedLpPercentage,
    sqrtStartPrice,
    lockedVesting: {
      amountPerPeriod: toBN(0),
      cliffDurationFromMigrationTime: toBN(0),
      frequency: toBN(0),
      numberOfPeriod: toBN(0),
      cliffUnlockAmount: toBN(0),
    },
    migrationFeeOption,
    tokenSupply: null,
    creatorTradingFeePercentage,
    tokenUpdateAuthority,
    migrationFee: {
      feePercentage: Number(process.env.MIGRATION_FEE_PERCENTAGE ?? 0),
      creatorFeePercentage: Number(process.env.MIGRATION_CREATOR_FEE_PERCENTAGE ?? 0),
    },
    migratedPoolFee: {
      poolFeeBps: Number(process.env.MIGRATED_POOL_FEE_BPS ?? 0),
      collectFeeMode: Number(process.env.MIGRATED_POOL_COLLECT_FEE_MODE ?? 0),
      dynamicFee: Number(process.env.MIGRATED_POOL_DYNAMIC_FEE ?? 0),
    },
    padding: Array.from({ length: 7 }, () => toBN(0)),
    curve: [
      {
        sqrtPrice: firstSqrtPrice,
        liquidity: toBN("79305979500567546804382630723"),
      },
    ],
  } as const;

  console.log(
    JSON.stringify(
      {
        quoteMint: quoteMint.toBase58(),
        feeClaimer: feeClaimer.toBase58(),
        leftoverReceiver: leftoverReceiver.toBase58(),
        migrationOption,
        migrationFeeOption,
        collectFeeMode,
        activationType,
        tokenType,
        tokenDecimal,
        migrationQuoteThreshold: migrationQuoteThreshold.toString(),
        creatorTradingFeePercentage,
        curve: instructionParams.curve.map((point) => ({
          sqrtPrice: point.sqrtPrice.toString(),
          liquidity: point.liquidity.toString(),
        })),
      },
      null,
      2
    )
  );

  const signature = await program.methods
    .createConfig(instructionParams as any)
    .accounts({
      config: configKeypair.publicKey,
      feeClaimer,
      leftoverReceiver,
      quoteMint,
      payer: payerKeypair.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([configKeypair])
    .rpc({ commitment: "confirmed" });

  console.log(JSON.stringify({
    configAddress: configKeypair.publicKey.toBase58(),
    transactionSignature: signature,
    feeClaimer: feeClaimer.toBase58(),
    leftoverReceiver: leftoverReceiver.toBase58(),
    quoteMint: quoteMint.toBase58(),
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
