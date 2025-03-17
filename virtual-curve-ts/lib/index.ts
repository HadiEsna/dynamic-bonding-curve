import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from '@solana/web3.js'
import { Program, AnchorProvider } from '@coral-xyz/anchor'
import { Idl } from './idl'
import {
  type VirtualCurveProgram,
  type InitializePoolParameters,
  type SwapParameters,
  type ConfigParameters,
  type CreateClaimFeeOperatorAccounts,
  type CloseClaimFeeOperatorAccounts,
  type ClaimProtocolFeeAccounts,
  type CreateConfigAccounts,
  type ClaimTradingFeeAccounts,
  type InitializeVirtualPoolWithSplTokenAccounts,
  type InitializeVirtualPoolWithToken2022Accounts,
  type SwapAccounts,
  type MigrationMeteoraDammCreateMetadataAccounts,
  type MigrateMeteoraDammAccounts,
  type MigrateMeteoraDammLockLpTokenForCreatorAccounts,
  type MigrateMeteoraDammLockLpTokenForPartnerAccounts,
} from './types'
import { BN } from 'bn.js'

// Define a type for accounts that might have optional fields
type AccountsWithOptionalFields<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? T[P] | null : T[P]
}

export class VirtualCurveSDK {
  private program: VirtualCurveProgram
  private connection: Connection
  private provider: AnchorProvider

  constructor(connection: Connection) {
    this.connection = connection
    this.provider = new AnchorProvider(connection, null as any, {
      commitment: 'confirmed',
    })
    this.program = new Program(
      Idl,
      new PublicKey(Idl.metadata.address),
      this.provider
    )
  }

  private getEventAuthority(): PublicKey {
    const [eventAuthority] = PublicKey.findProgramAddressSync(
      [Buffer.from('__event_authority')],
      this.program.programId
    )
    return eventAuthority
  }

  // Admin Functions
  async createClaimFeeOperator(
    params: Omit<CreateClaimFeeOperatorAccounts, 'program' | 'eventAuthority'>
  ) {
    const accounts = {
      ...params,
      eventAuthority: this.getEventAuthority(),
      program: this.program.programId,
    }

    const ix = await this.program.methods
      .createClaimFeeOperator()
      .accounts(accounts)
      .instruction()

    return ix
  }

  async closeClaimFeeOperator(
    params: Omit<CloseClaimFeeOperatorAccounts, 'program' | 'eventAuthority'>
  ) {
    const accounts = {
      ...params,
      eventAuthority: this.getEventAuthority(),
      program: this.program.programId,
    }

    const ix = await this.program.methods
      .closeClaimFeeOperator()
      .accounts(accounts)
      .instruction()

    return ix
  }

  // Partner Functions
  async createConfig(
    params: Omit<CreateConfigAccounts, 'program' | 'eventAuthority'> & {
      configParameters: ConfigParameters
    }
  ) {
    const { configParameters, ...rest } = params
    const accounts = {
      ...rest,
      eventAuthority: this.getEventAuthority(),
      program: this.program.programId,
    }

    const ix = await this.program.methods
      .createConfig(configParameters)
      .accounts(accounts)
      .instruction()

    return ix
  }

  async migrationMeteoraDammCreateMetadata(
    params: Omit<
      MigrationMeteoraDammCreateMetadataAccounts,
      'program' | 'eventAuthority'
    >
  ) {
    const accounts = {
      ...params,
      eventAuthority: this.getEventAuthority(),
      program: this.program.programId,
    }

    const ix = await this.program.methods
      .migrationMeteoraDammCreateMetadata()
      .accounts(accounts)
      .instruction()

    return ix
  }

  async migrateMeteoraDamm(
    params: Omit<MigrateMeteoraDammAccounts, 'program' | 'eventAuthority'>
  ) {
    const accounts = {
      ...params,
      eventAuthority: this.getEventAuthority(),
      program: this.program.programId,
    }

    const ix = await this.program.methods
      .migrateMeteoraDamm()
      .accounts(accounts)
      .instruction()

    return ix
  }

  async migrateMeteoraDammLockLpTokenForCreator(
    params: Omit<
      MigrateMeteoraDammLockLpTokenForCreatorAccounts,
      'program' | 'eventAuthority'
    >
  ) {
    const accounts = {
      ...params,
      eventAuthority: this.getEventAuthority(),
      program: this.program.programId,
    }

    const ix = await this.program.methods
      .migrateMeteoraDammLockLpTokenForCreator()
      .accounts(accounts)
      .instruction()

    return ix
  }

  async migrateMeteoraDammLockLpTokenForPartner(
    params: Omit<
      MigrateMeteoraDammLockLpTokenForPartnerAccounts,
      'program' | 'eventAuthority'
    >
  ) {
    const accounts = {
      ...params,
      eventAuthority: this.getEventAuthority(),
      program: this.program.programId,
    }

    const ix = await this.program.methods
      .migrateMeteoraDammLockLpTokenForPartner()
      .accounts(accounts)
      .instruction()

    return ix
  }

  // User Functions
  async initializeVirtualPoolWithSplToken(
    params: Omit<
      InitializeVirtualPoolWithSplTokenAccounts,
      'program' | 'eventAuthority'
    > & {
      initializeParams: InitializePoolParameters
    }
  ) {
    const { initializeParams, ...rest } = params
    const accounts = {
      ...rest,
      eventAuthority: this.getEventAuthority(),
      program: this.program.programId,
    }

    const ix = await this.program.methods
      .initializeVirtualPoolWithSplToken(initializeParams)
      .accounts(accounts)
      .instruction()

    return ix
  }

  async initializeVirtualPoolWithToken2022(
    params: Omit<
      InitializeVirtualPoolWithToken2022Accounts,
      'program' | 'eventAuthority'
    > & {
      initializeParams: InitializePoolParameters
    }
  ) {
    const { initializeParams, ...rest } = params
    const accounts = {
      ...rest,
      eventAuthority: this.getEventAuthority(),
      program: this.program.programId,
    }

    const ix = await this.program.methods
      .initializeVirtualPoolWithToken2022(initializeParams)
      .accounts(accounts)
      .instruction()

    return ix
  }

  async swap(
    params: Omit<
      SwapAccounts,
      'program' | 'eventAuthority' | 'referralTokenAccount'
    > & {
      referralTokenAccount?: PublicKey
      swapParams: SwapParameters
    }
  ) {
    const { swapParams, referralTokenAccount, ...rest } = params

    // Create a base accounts object
    const baseAccounts: any = {
      ...rest,
      eventAuthority: this.getEventAuthority(),
      program: this.program.programId,
    }

    // Add referralTokenAccount if provided
    if (referralTokenAccount) {
      baseAccounts.referralTokenAccount = referralTokenAccount
    }

    const ix = await this.program.methods
      .swap(swapParams)
      .accounts(baseAccounts)
      .instruction()

    return ix
  }

  // Fee Management
  async claimProtocolFee(
    params: Omit<ClaimProtocolFeeAccounts, 'program' | 'eventAuthority'>
  ) {
    const accounts = {
      ...params,
      eventAuthority: this.getEventAuthority(),
      program: this.program.programId,
    }

    const ix = await this.program.methods
      .claimProtocolFee()
      .accounts(accounts)
      .instruction()

    return ix
  }

  async claimTradingFee(
    params: Omit<ClaimTradingFeeAccounts, 'program' | 'eventAuthority'> & {
      maxAmountA: typeof BN | string | number
      maxAmountB: typeof BN | string | number
    }
  ) {
    const { maxAmountA, maxAmountB, ...rest } = params
    const accounts = {
      ...rest,
      eventAuthority: this.getEventAuthority(),
      program: this.program.programId,
    }

    // Convert to BN if needed
    const amountA =
      maxAmountA instanceof BN ? maxAmountA : new BN(maxAmountA.toString())
    const amountB =
      maxAmountB instanceof BN ? maxAmountB : new BN(maxAmountB.toString())

    const ix = await this.program.methods
      .claimTradingFee(amountA, amountB)
      .accounts(accounts)
      .instruction()

    return ix
  }

  // Account fetching
  async getPool(poolAddress: PublicKey | string) {
    const address =
      typeof poolAddress === 'string' ? new PublicKey(poolAddress) : poolAddress
    return await this.program.account.VirtualPool.fetch(address)
  }

  async getConfig(configAddress: PublicKey | string) {
    const address =
      typeof configAddress === 'string'
        ? new PublicKey(configAddress)
        : configAddress
    return await this.program.account.Config.fetch(address)
  }

  async getClaimFeeOperator(operatorAddress: PublicKey | string) {
    const address =
      typeof operatorAddress === 'string'
        ? new PublicKey(operatorAddress)
        : operatorAddress
    return await this.program.account.ClaimFeeOperator.fetch(address)
  }

  async getMeteoraDammMigrationMetadata(metadataAddress: PublicKey | string) {
    const address =
      typeof metadataAddress === 'string'
        ? new PublicKey(metadataAddress)
        : metadataAddress
    return await this.program.account.MeteoraDammMigrationMetadata.fetch(
      address
    )
  }
}
