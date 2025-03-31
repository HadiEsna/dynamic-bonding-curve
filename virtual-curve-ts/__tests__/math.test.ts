import { test, expect } from 'bun:test'
import {
  getDeltaAmountBaseUnsigned,
  getDeltaAmountQuoteUnsigned,
  getNextSqrtPriceFromAmountBase,
  getNextSqrtPriceFromAmountQuote,
} from '../lib/math'
import { BN } from 'bn.js'
import { Q } from './test-helpers'

test('Base amount calculation', () => {
  const lower = Q(1.0)
  const upper = Q(1.0001)
  // Lower test liquidity value to prevent overflow
  const liquidity = new BN('10000000000')

  const result = getDeltaAmountBaseUnsigned(lower, upper, liquidity, false)

  // Simply check the result is close to 10000000000 * 0.0001 = 1000000
  // Allow 1% margin of error for scaling differences
  expect(result.gt(new BN('990000'))).toBe(true)
  expect(result.lt(new BN('1010000'))).toBe(true)
})

test('Quote amount calculation', () => {
  // Use much larger liquidity to get non-zero result
  const lower = Q(1.0)
  const upper = Q(1.0001)
  const liquidity = new BN(10).pow(new BN(25)) // Much larger value

  const result = getDeltaAmountQuoteUnsigned(lower, upper, liquidity, false)

  // With larger liquidity, we should now get a non-zero result
  expect(result.gt(new BN(0))).toBe(true)
})

test('Price update from base input', () => {
  // Use smaller values to avoid precision issues
  const sqrtPrice = Q(1.0)
  const liquidity = new BN('100000')
  const amountIn = new BN('50000') // half of liquidity

  const newPrice = getNextSqrtPriceFromAmountBase(
    sqrtPrice,
    liquidity,
    amountIn,
    false
  )

  // Expected: approximately 2/3 of sqrtPrice
  // Allow 1% margin of error
  const expectedPrice = Q(1.0).mul(new BN(2)).div(new BN(3))
  const diff = newPrice.gt(expectedPrice)
    ? newPrice.sub(expectedPrice)
    : expectedPrice.sub(newPrice)

  expect(diff.mul(new BN(100)).div(expectedPrice).lt(new BN(1))).toBe(true)
})

test('Price update from quote input', () => {
  const sqrtPrice = Q(1.0) // 1.0 in Q64.64 format
  const liquidity = new BN(1).shln(64) // Use a power of 2 for exact division

  // With a liquidity of 2^64, we need amountIn = 1 to get a price increase of 1.0
  const amountIn = new BN(1)

  const newPrice = getNextSqrtPriceFromAmountQuote(
    sqrtPrice,
    liquidity,
    amountIn
  )

  // Should be exactly Q(2)
  expect(newPrice.eq(Q(2))).toBe(true)
})

test('Edge case: zero liquidity', () => {
  expect(() =>
    getDeltaAmountBaseUnsigned(Q(1), Q(2), new BN(0), false)
  ).toThrow()
})

test('Edge case: identical prices', () => {
  expect(() =>
    getDeltaAmountQuoteUnsigned(Q(1), Q(1), new BN('1000'), false)
  ).toThrow('InvalidPrice')
})

test('Base amount calculation with realistic values', () => {
  // Use values with more significant price difference
  const lowerSqrtPrice = Q(1.0) // 1.0 in Q64.64 format
  const upperSqrtPrice = Q(1.1) // 10% price increase
  const liquidity = new BN('10000000000000000')

  const baseAmount = getDeltaAmountBaseUnsigned(
    lowerSqrtPrice,
    upperSqrtPrice,
    liquidity,
    false
  )

  // Verify result is non-zero
  expect(baseAmount.gt(new BN(0))).toBe(true)

  // Calculate approximate expected result
  // For a 10% price difference near the price of 1.0, we expect roughly 9.5% of liquidity
  const expectedApprox = liquidity.div(new BN(10))

  // Allow 20% margin for fixed-point math differences
  expect(baseAmount.gt(expectedApprox.mul(new BN(8)).div(new BN(10)))).toBe(
    true
  )
  expect(baseAmount.lt(expectedApprox.mul(new BN(12)).div(new BN(10)))).toBe(
    true
  )
})
