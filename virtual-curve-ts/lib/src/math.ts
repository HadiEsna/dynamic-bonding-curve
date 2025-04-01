import BN from 'bn.js'

const U64_MAX = new BN('FFFFFFFFFFFFFFFF', 16) // 2^64 - 1

// Add precise Q64.64 handling constants
const Q64 = new BN(1).shln(64)
const Q128 = Q64.mul(Q64)

// Δa = L * (√P_upper - √P_lower) / (√P_upper * √P_lower)
export function getDeltaAmountBaseUnsigned(
  lowerSqrtPrice: BN,
  upperSqrtPrice: BN,
  liquidity: BN,
  roundUp: boolean
): BN {
  if (liquidity.isZero()) throw new Error('MathOverflow')
  if (lowerSqrtPrice.gte(upperSqrtPrice)) throw new Error('InvalidPrice')

  const result = getDeltaAmountBaseUnchecked(
    lowerSqrtPrice,
    upperSqrtPrice,
    liquidity,
    roundUp
  )

  if (result.gt(U64_MAX)) throw new Error('MathOverflow')
  return result
}

/**
 * Calculate delta amount base unsigned, matching Rust's get_delta_amount_base_unsigned_unchecked
 * Formula: L * (√P_upper - √P_lower) / (√P_upper * √P_lower)
 */
function getDeltaAmountBaseUnchecked(
  lowerSqrtPrice: BN,
  upperSqrtPrice: BN,
  liquidity: BN,
  roundUp: boolean
): BN {
  if (lowerSqrtPrice.isZero() || upperSqrtPrice.isZero()) {
    throw new Error('DivisionByZero')
  }

  // Calculate (√P_upper - √P_lower)
  const deltaSqrtPrice = upperSqrtPrice.sub(lowerSqrtPrice)

  // Calculate denominator: √P_upper * √P_lower
  const denominator = upperSqrtPrice.mul(lowerSqrtPrice)

  if (denominator.isZero()) {
    throw new Error('DivisionByZero')
  }

  // L * (√P_upper - √P_lower)
  const numerator = liquidity.mul(deltaSqrtPrice)

  if (roundUp) {
    return numerator.add(denominator.subn(1)).div(denominator)
  }
  return numerator.div(denominator)
}

// Δb = L (√P_upper - √P_lower)
export function getDeltaAmountQuoteUnsigned(
  lowerSqrtPrice: BN,
  upperSqrtPrice: BN,
  liquidity: BN,
  roundUp: boolean
): BN {
  if (liquidity.isZero()) throw new Error('MathOverflow')
  if (lowerSqrtPrice.gte(upperSqrtPrice)) throw new Error('InvalidPrice')

  const result = getDeltaAmountQuoteUnchecked(
    lowerSqrtPrice,
    upperSqrtPrice,
    liquidity,
    roundUp
  )
  if (result.gt(U64_MAX)) throw new Error('MathOverflow')
  return result
}

// Direct implementation of Rust's get_delta_amount_quote_unsigned_unchecked
export function getDeltaAmountQuoteUnchecked(
  lowerSqrtPrice: BN,
  upperSqrtPrice: BN,
  liquidity: BN,
  roundUp: boolean
): BN {
  const deltaPrice = upperSqrtPrice.sub(lowerSqrtPrice)
  const result = liquidity.mul(deltaPrice)

  // Match Rust: shift by 128 bits (2*RESOLUTION)
  if (roundUp) {
    return result.add(new BN(1).shln(128).sub(new BN(1))).shrn(128)
  } else {
    return result.shrn(128)
  }
}

// √P' = √P * L / (L + Δx * √P)
export function getNextSqrtPriceFromAmountBase(
  sqrtPrice: BN,
  liquidity: BN,
  amountIn: BN,
  roundUp: boolean
): BN {
  if (liquidity.isZero()) throw new Error('MathOverflow')
  if (amountIn.isZero()) return sqrtPrice

  // In Rust they use:
  // liquidity * sqrtPrice / (liquidity + amount * sqrtPrice)

  // First multiply amount * sqrtPrice (preserving Q64.64)
  const product = amountIn.mul(sqrtPrice)

  // Add to liquidity
  const denominator = liquidity.add(product.div(Q64))

  // Calculate numerator
  const numerator = liquidity.mul(sqrtPrice)

  // Now perform the final division with correct scaling
  const result = numerator.div(denominator)

  return result
}

// √P' = √P + Δy / L
export function getNextSqrtPriceFromAmountQuote(
  sqrtPrice: BN,
  liquidity: BN,
  amountIn: BN
): BN {
  if (liquidity.isZero()) throw new Error('MathOverflow')

  // Match Rust: shift by 128 bits (2*RESOLUTION)
  const scaled = amountIn.shln(128)
  const quotient = scaled.div(liquidity)

  return sqrtPrice.add(quotient)
}

// Helper function for precise multiplication/division with rounding control
function mulDiv(a: BN, b: BN, c: BN, roundUp: boolean): BN {
  if (c.isZero()) throw new Error('DivisionByZero')

  // Calculate product
  const product = a.mul(b)

  // Apply rounding and divide
  if (roundUp) {
    return product.add(c.sub(new BN(1))).div(c)
  }
  return product.div(c)
}
