import BN from 'bn.js'
import { type VirtualPool } from '../lib/types'

// Q64.64 format helper
export const Q = (n: number) => {
  const bigIntValue = BigInt(Math.floor(n * 2 ** 64))
  return new BN(bigIntValue.toString())
}

/**
 * Creates a mock pool for testing with customizable reserves and price
 */
export function createMockPool(params?: {
  baseReserve?: BN
  quoteReserve?: BN
  sqrtPrice?: BN
  poolType?: number
  cliffFeeNumerator?: BN
  protocolFeePercent?: number
}): VirtualPool {
  return {
    poolFees: {
      baseFee: {
        cliffFeeNumerator: params?.cliffFeeNumerator || new BN(0),
        feeSchedulerMode: 0,
        padding0: [],
        numberOfPeriod: 0,
        periodFrequency: new BN(0),
        reductionFactor: new BN(0),
        padding1: new BN(0),
      },
      protocolFeePercent: params?.protocolFeePercent || 0,
      referralFeePercent: 0,
      dynamicFee: {
        binStep: 0,
        decayPeriod: 0,
        filterPeriod: 0,
        initialized: 0,
        maxVolatilityAccumulator: 0,
        padding: [],
        binStepU128: new BN(0),
        lastUpdateTimestamp: new BN(0),
        reductionFactor: 0,
        sqrtPriceReference: new BN(0),
        variableFeeControl: 0,
        volatilityAccumulator: new BN(0),
        volatilityReference: new BN(0),
      },
      padding0: [],
      padding1: [],
    },
    baseReserve: params?.baseReserve || new BN('1000000000000'),
    quoteReserve: params?.quoteReserve || new BN('1000000000000'),
    sqrtPrice: params?.sqrtPrice || Q(1.0), // Default price of 1.0
    config: {} as any,
    creator: {} as any,
    baseMint: {} as any,
    baseVault: {} as any,
    quoteVault: {} as any,
    protocolBaseFee: new BN(0),
    protocolQuoteFee: new BN(0),
    tradingBaseFee: new BN(0),
    tradingQuoteFee: new BN(0),
    activationPoint: new BN(0),
    isMigrated: 0,
    isPartnerWithdrawSurplus: 0,
    isProcotolWithdrawSurplus: 0,
    metrics: {
      totalProtocolBaseFee: new BN(0),
      totalProtocolQuoteFee: new BN(0),
      totalTradingBaseFee: new BN(0),
      totalTradingQuoteFee: new BN(0),
    },
    poolType: params?.poolType || 0,
    padding0: [],
    padding1: [],
  }
}

/**
 * Common test pool configurations
 */
export const TestPools = {
  /**
   * Creates a balanced pool with equal reserves
   */
  createBalancedPool: (reserveAmount: BN = new BN('1000000000000')) =>
    createMockPool({
      baseReserve: reserveAmount,
      quoteReserve: reserveAmount,
      sqrtPrice: Q(1.0),
    }),

  /**
   * Creates an imbalanced pool with specified ratio
   */
  createImbalancedPool: (ratio: number = 2) => {
    const baseReserve = new BN('1000000000000')
    const quoteReserve = baseReserve.mul(new BN(ratio))
    return createMockPool({
      baseReserve,
      quoteReserve,
      sqrtPrice: Q(ratio),
    })
  },

  /**
   * Creates a pool with fees
   */
  createPoolWithFees: (feePercent: number = 0.3) =>
    createMockPool({
      cliffFeeNumerator: new BN(Math.floor(feePercent * 100)),
      protocolFeePercent: 20, // 20% of trading fees go to protocol
    }),
}
