import { test, expect } from 'bun:test'
import {
  getFeeInPeriod,
  pow,
  getTotalTradingFee,
  getCurrentBaseFeeNumerator,
  getDynamicFee,
  ONE,
  BASIS_POINT_MAX,
} from '../lib/fee_math'
import BN from 'bn.js'

test('getFeeInPeriod calculation', () => {
  // Test case 1: No reduction
  const result1 = getFeeInPeriod(
    new BN(1000), // cliff fee
    new BN(0), // reduction factor
    new BN(1) // period
  )
  expect(result1.eq(new BN(1000))).toBe(true)

  // Test case 2: With reduction
  const result2 = getFeeInPeriod(
    new BN(1000), // cliff fee
    new BN(100), // 1% reduction factor
    new BN(1) // period
  )
  expect(result2.gt(new BN(989))).toBe(true)
  expect(result2.lt(new BN(991))).toBe(true)
})

test('pow function', () => {
  // Test basic cases
  expect(pow(ONE, 0)?.eq(ONE)).toBe(true)
  expect(pow(ONE, 1)?.eq(ONE)).toBe(true)

  // Test with actual values
  const base = ONE.sub(new BN(100).shln(64).div(BASIS_POINT_MAX)) // 0.99 in Q64.64
  const result = pow(base, 2)
  expect(result).not.toBeNull()
  // Result should be approximately 0.9801
})

// Add more tests for getTotalTradingFee, getCurrentBaseFeeNumerator, and getDynamicFee
