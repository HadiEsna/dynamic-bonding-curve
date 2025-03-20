import type {
  Program,
  IdlTypes,
  IdlAccounts,
  Accounts,
} from '@coral-xyz/anchor'
import { type VirtualCurve as IDL } from './idl'

export type VirtualCurveProgram = Program<IDL>

// ix accounts
export type CreateClaimFeeOperatorAccounts = Accounts<
  IDL['instructions']['3']
>['createClaimFeeOperator']
export type CloseClaimFeeOperatorAccounts = Accounts<
  IDL['instructions']['2']
>['closeClaimFeeOperator']
export type ClaimProtocolFeeAccounts = Accounts<
  IDL['instructions']['0']
>['claimProtocolFee']
export type ClaimTradingFeeAccounts = Accounts<
  IDL['instructions']['1']
>['claimTradingFee']
export type CreateConfigAccounts = Accounts<
  IDL['instructions']['4']
>['createConfig']
export type InitializeVirtualPoolWithSplTokenAccounts = Accounts<
  IDL['instructions']['5']
>['initializeVirtualPoolWithSplToken']
export type InitializeVirtualPoolWithToken2022Accounts = Accounts<
  IDL['instructions']['6']
>['initializeVirtualPoolWithToken2022']
export type MigrateMeteoraDammAccounts = Accounts<
  IDL['instructions']['7']
>['migrateMeteoraDamm']
export type MigrateMeteoraDammLockLpTokenForCreatorAccounts = Accounts<
  IDL['instructions']['8']
>['migrateMeteoraDammLockLpTokenForCreator']
export type MigrateMeteoraDammLockLpTokenForPartnerAccounts = Accounts<
  IDL['instructions']['9']
>['migrateMeteoraDammLockLpTokenForPartner']
export type MigrationMeteoraDammCreateMetadataAccounts = Accounts<
  IDL['instructions']['10']
>['migrationMeteoraDammCreateMetadata']
export type PartnerWithdrawSurplusAccounts = Accounts<
  IDL['instructions']['11']
>['partnerWithdrawSurplus']
export type ProtocolWithdrawSurplusAccounts = Accounts<
  IDL['instructions']['12']
>['protocolWithdrawSurplus']
export type SwapAccounts = Accounts<IDL['instructions']['13']>['swap']

// types
export type InitializePoolParameters = IdlTypes<IDL>['initializePoolParameters']
export type SwapParameters = IdlTypes<IDL>['swapParameters']
export type ConfigParameters = IdlTypes<IDL>['configParameters']
export type PoolFeeParamters = IdlTypes<IDL>['poolFeeParamters']
export type BaseFeeParameters = IdlTypes<IDL>['baseFeeConfig']
export type DynamicFeeParameters = IdlTypes<IDL>['dynamicFeeParameters']
export type LiquidityDistributionParameters =
  IdlTypes<IDL>['liquidityDistributionParameters']
export type PoolFeesConfig = IdlTypes<IDL>['poolFees']
export type BaseFeeConfig = IdlTypes<IDL>['baseFeeConfig']
export type DynamicFeeConfig = IdlTypes<IDL>['dynamicFeeParameters']
export type LiquidityDistributionConfig =
  IdlTypes<IDL>['liquidityDistributionParameters']
export type PoolFeesStruct = IdlTypes<IDL>['poolFees']
export type BaseFeeStruct = IdlTypes<IDL>['baseFeeConfig']
export type DynamicFeeStruct = IdlTypes<IDL>['dynamicFeeParameters']
export type PoolMetrics = IdlTypes<IDL>['poolMetrics']
export type SwapResult = IdlTypes<IDL>['swapResult']

// accounts
export type ClaimFeeOperator = IdlAccounts<IDL>['claimFeeOperator']
export type Config = IdlAccounts<IDL>['config']
export type MeteoraDammMigrationMetadata =
  IdlAccounts<IDL>['meteoraDammMigrationMetadata']
export type VirtualPool = IdlAccounts<IDL>['virtualPool']
