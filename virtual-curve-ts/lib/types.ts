import type {
  Program,
  IdlTypes,
  IdlAccounts,
  Accounts,
} from '@coral-xyz/anchor'
import { type IDL } from './idl'

export type VirtualCurveProgram = Program<IDL>

// ix accounts
export type CreateClaimFeeOperatorAccounts = Accounts<
  IDL['instructions']['0']
>['createClaimFeeOperator']
export type CloseClaimFeeOperatorAccounts = Accounts<
  IDL['instructions']['1']
>['closeClaimFeeOperator']
export type ClaimProtocolFeeAccounts = Accounts<
  IDL['instructions']['2']
>['claimProtocolFee']
export type CreateConfigAccounts = Accounts<
  IDL['instructions']['3']
>['createConfig']
export type ClaimTradingFeeAccounts = Accounts<
  IDL['instructions']['4']
>['claimTradingFee']
export type InitializeVirtualPoolWithSplTokenAccounts = Accounts<
  IDL['instructions']['5']
>['initializeVirtualPoolWithSplToken']
export type InitializeVirtualPoolWithToken2022Accounts = Accounts<
  IDL['instructions']['6']
>['initializeVirtualPoolWithToken2022']
export type SwapAccounts = Accounts<IDL['instructions']['7']>['swap']
export type MigrationMeteoraDammCreateMetadataAccounts = Accounts<
  IDL['instructions']['8']
>['migrationMeteoraDammCreateMetadata']
export type MigrateMeteoraDammAccounts = Accounts<
  IDL['instructions']['9']
>['migrateMeteoraDamm']
export type MigrateMeteoraDammLockLpTokenForCreatorAccounts = Accounts<
  IDL['instructions']['10']
>['migrateMeteoraDammLockLpTokenForCreator']
export type MigrateMeteoraDammLockLpTokenForPartnerAccounts = Accounts<
  IDL['instructions']['11']
>['migrateMeteoraDammLockLpTokenForPartner']

// types
export type InitializePoolParameters = IdlTypes<IDL>['InitializePoolParameters']
export type SwapParameters = IdlTypes<IDL>['SwapParameters']
export type ConfigParameters = IdlTypes<IDL>['ConfigParameters']
export type PoolFeeParamters = IdlTypes<IDL>['PoolFeeParamters']
export type BaseFeeParameters = IdlTypes<IDL>['BaseFeeParameters']
export type DynamicFeeParameters = IdlTypes<IDL>['DynamicFeeParameters']
export type LiquidityDistributionParameters =
  IdlTypes<IDL>['LiquidityDistributionParameters']
export type PoolFeesConfig = IdlTypes<IDL>['PoolFeesConfig']
export type BaseFeeConfig = IdlTypes<IDL>['BaseFeeConfig']
export type DynamicFeeConfig = IdlTypes<IDL>['DynamicFeeConfig']
export type LiquidityDistributionConfig =
  IdlTypes<IDL>['LiquidityDistributionConfig']
export type PoolFeesStruct = IdlTypes<IDL>['PoolFeesStruct']
export type BaseFeeStruct = IdlTypes<IDL>['BaseFeeStruct']
export type DynamicFeeStruct = IdlTypes<IDL>['DynamicFeeStruct']
export type PoolMetrics = IdlTypes<IDL>['PoolMetrics']
export type SwapResult = IdlTypes<IDL>['SwapResult']

// enums
export type Rounding = IdlTypes<IDL>['Rounding']
export type TradeDirection = IdlTypes<IDL>['TradeDirection']
export type MigrationOption = IdlTypes<IDL>['MigrationOption']
export type TokenType = IdlTypes<IDL>['TokenType']
export type FeeSchedulerMode = IdlTypes<IDL>['FeeSchedulerMode']
export type MigrationMeteoraDammProgress =
  IdlTypes<IDL>['MigrationMeteoraDammProgress']
export type CollectFeeMode = IdlTypes<IDL>['CollectFeeMode']
export type PoolType = IdlTypes<IDL>['PoolType']
export type ActivationType = IdlTypes<IDL>['ActivationType']
export type TokenProgramFlags = IdlTypes<IDL>['TokenProgramFlags']

// accounts
export type ClaimFeeOperator = IdlAccounts<IDL>['ClaimFeeOperator']
export type Config = IdlAccounts<IDL>['Config']
export type MeteoraDammMigrationMetadata =
  IdlAccounts<IDL>['MeteoraDammMigrationMetadata']
export type VirtualPool = IdlAccounts<IDL>['VirtualPool']
