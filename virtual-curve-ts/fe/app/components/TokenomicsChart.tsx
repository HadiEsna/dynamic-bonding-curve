import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from 'recharts'

interface TokenomicsChartProps {
  liquidityPoints?: Array<{ sqrtPrice: string; liquidity: string }>
  sqrtStartPrice?: string
  height?: number
  quoteDecimals?: number
  baseDecimals?: number
  showLiquidity?: boolean
  showPrice?: boolean
  lineColor?: string
  showAnalytics?: boolean
  showExplanation?: boolean
}

interface ChartDataPoint {
  label: string
  liquidity: number
  price: number
  sqrtPrice: string
  rawLiquidity?: string
}

interface PoolAnalytics {
  initialPrice: number
  finalPrice: number
  priceGrowthMultiple: number
  totalLiquidity: number
  pointCount: number
}

export default function TokenomicsChart({
  liquidityPoints = [],
  sqrtStartPrice = '4295048016',
  height = 250,
  quoteDecimals = 9,
  baseDecimals = 6,
  showLiquidity = true,
  showPrice = true,
  lineColor = '#3b82f6',
  showAnalytics = true,
  showExplanation = true,
}: TokenomicsChartProps) {
  // Check if we have any data to display
  if (liquidityPoints.length === 0) {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <div className="flex items-center justify-center h-full text-gray-400">
          No data to display
        </div>
      </ResponsiveContainer>
    )
  }

  // Process data once for both chart and analytics
  const { chartData, analytics: poolAnalytics } = processPoolData(
    liquidityPoints,
    sqrtStartPrice,
    quoteDecimals,
    baseDecimals
  )

  // Format liquidity with base decimals
  const formatLiquidityValue = (value: number) =>
    formatLiquidity(value, baseDecimals)

  return (
    <div className="w-full">
      {/* Analytics overlay */}
      {showAnalytics && poolAnalytics && (
        <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-center">
          <div className="bg-white/5 p-2 rounded">
            <div className="text-gray-400">Initial Price</div>
            <div className="font-bold truncate">
              {formatPrice(poolAnalytics.initialPrice)}
            </div>
          </div>
          <div className="bg-white/5 p-2 rounded">
            <div className="text-gray-400">Price Range</div>
            <div className="font-bold truncate">
              {poolAnalytics.priceGrowthMultiple > 0
                ? formatPriceRange(poolAnalytics.priceGrowthMultiple)
                : 'N/A'}
            </div>
          </div>
          <div className="bg-white/5 p-2 rounded">
            <div className="text-gray-400">Total Liquidity</div>
            <div className="font-bold truncate">
              {formatLiquidityValue(poolAnalytics.totalLiquidity)}
            </div>
          </div>
        </div>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            <linearGradient id="liquidityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={lineColor} stopOpacity={0.8} />
              <stop offset="95%" stopColor={lineColor} stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(255,255,255,0.1)"
          />
          <XAxis
            dataKey="label"
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
            tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          />
          {showLiquidity && (
            <YAxis
              yAxisId="left"
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
              tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              tickFormatter={(value) => formatLiquidityValue(value)}
              width={50}
              label={{
                value: 'Liquidity',
                angle: -90,
                position: 'insideLeft',
                offset: 10,
                fill: 'rgba(255,255,255,0.6)',
                fontSize: 10,
              }}
            />
          )}
          {showPrice && (
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
              tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              tickFormatter={(value) => formatPrice(value)}
              width={50}
              label={{
                value: 'Price',
                angle: 90,
                position: 'insideRight',
                offset: 10,
                fill: 'rgba(255,255,255,0.6)',
                fontSize: 10,
              }}
            />
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(13, 17, 28, 0.8)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              padding: '8px 12px',
            }}
            itemStyle={{ color: 'white' }}
            labelStyle={{
              color: 'white',
              fontWeight: 'bold',
              marginBottom: '5px',
            }}
            formatter={(value: number, name: string) => {
              if (name === 'liquidity') {
                return [formatLiquidityValue(value), 'Liquidity']
              }
              return [formatPrice(value), 'Price']
            }}
            labelFormatter={(label) => `Position: ${label}`}
          />
          {showLiquidity && (
            <Bar
              yAxisId="left"
              dataKey="liquidity"
              fill="url(#liquidityGradient)"
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
          )}
          {showPrice && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="price"
              stroke={lineColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 1 }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      {/* Optional explanation */}
      {showExplanation && (
        <div className="mt-3 text-xs text-gray-400 overflow-hidden">
          <p className="text-wrap break-words">
            Each point represents a segment in your liquidity curve. Higher
            liquidity at a price point means more tokens available at that
            price.
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * Convert sqrt price to actual price with proper decimal handling
 */
function sqrtPriceToPrice(
  sqrtPrice: string,
  quoteDecimals: number = 9,
  baseDecimals: number = 6
): number {
  try {
    const decimalDifference = quoteDecimals + baseDecimals
    // Convert to BigInt for calculation
    const sqrtPriceBigInt = BigInt(sqrtPrice) / 10n ** BigInt(decimalDifference)

    // Square the sqrt price
    const priceSquared = sqrtPriceBigInt * sqrtPriceBigInt

    return Number(priceSquared)
  } catch (e) {
    console.error('Error converting sqrt price:', e)
    return 0
  }
}

/**
 * Normalize liquidity values with respect to base token decimals
 */
function normalizeLiquidity(
  liquidityStr: string,
  baseDecimals: number = 6
): number {
  try {
    // First, parse the liquidity as a BigInt
    const liquidityBigInt = BigInt(liquidityStr)

    // Token decimal adjustment
    const decimalDivisor = BigInt(10) ** BigInt(baseDecimals)

    // Return the fully normalized value
    return Number(liquidityBigInt / decimalDivisor)
  } catch (e) {
    console.error('Error normalizing liquidity:', e)
    // Fallback to simple conversion
    return Number(liquidityStr)
  }
}

/**
 * Process data for chart and analytics in one place
 */
function processPoolData(
  liquidityPoints: Array<{ sqrtPrice: string; liquidity: string }>,
  sqrtStartPrice: string,
  quoteDecimals: number,
  baseDecimals: number
): {
  chartData: ChartDataPoint[]
  analytics: PoolAnalytics | null
} {
  // Initialize return data
  const chartData: ChartDataPoint[] = []
  let analytics: PoolAnalytics | null = null

  if (!liquidityPoints || liquidityPoints.length === 0) {
    return { chartData, analytics }
  }

  try {
    // Calculate initial price
    const initialPrice = sqrtPriceToPrice(
      sqrtStartPrice,
      quoteDecimals,
      baseDecimals
    )

    // Add starting point with zero liquidity
    chartData.push({
      label: 'P₀',
      liquidity: 0,
      price: initialPrice,
      sqrtPrice: sqrtStartPrice,
    })

    // Process each point for chart data
    let totalLiquidity = 0

    liquidityPoints.forEach((point, index) => {
      if (point.liquidity === '0' || !point.sqrtPrice) return

      try {
        const actualPrice = sqrtPriceToPrice(
          point.sqrtPrice,
          quoteDecimals,
          baseDecimals
        )

        const normalizedLiquidity = normalizeLiquidity(
          point.liquidity,
          baseDecimals
        )

        // Add to total liquidity sum
        totalLiquidity += normalizedLiquidity

        chartData.push({
          label: `P${index + 1}`,
          liquidity: normalizedLiquidity,
          price: actualPrice,
          sqrtPrice: point.sqrtPrice,
          rawLiquidity: point.liquidity,
        })
      } catch (e) {
        console.error(`Error processing point ${index}:`, e)
      }
    })

    // Calculate analytics
    if (liquidityPoints.length > 0) {
      const lastPoint = liquidityPoints[liquidityPoints.length - 1]
      const finalPrice = sqrtPriceToPrice(
        lastPoint.sqrtPrice,
        quoteDecimals,
        baseDecimals
      )

      const priceGrowthMultiple =
        initialPrice > 0 ? finalPrice / initialPrice : 0

      analytics = {
        initialPrice,
        finalPrice,
        priceGrowthMultiple,
        totalLiquidity,
        pointCount: liquidityPoints.length,
      }
    }
  } catch (e) {
    console.error('Error processing pool data:', e)
  }

  return { chartData, analytics }
}

/**
 * Format price for display
 */
function formatPrice(value: number): string {
  if (value === 0) return '0'

  // For very small numbers, use scientific notation
  if (value < 0.0000001) {
    return value.toExponential(6)
  }

  // For normal size numbers
  return value.toLocaleString('en-US', {
    maximumFractionDigits: value < 0.01 ? 8 : 4,
  })
}

/**
 * Format liquidity for display
 */
function formatLiquidity(value: number, baseDecimals: number = 6): string {
  if (value === 0) return '0'

  // For very small amounts
  if (value < 0.0001) {
    return value.toExponential(4)
  }

  // Handle large values with appropriate suffixes
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`
  }

  // For normal values, show appropriate decimal places
  const decimalPlaces = value < 1 ? Math.min(baseDecimals, 6) : 2
  return value.toFixed(decimalPlaces)
}

/**
 * Format price growth multiple for display
 */
function formatPriceRange(multiple: number): string {
  if (multiple > 1000000) {
    return `${(multiple / 1000000).toFixed(2)}M×`
  }
  if (multiple > 1000) {
    return `${(multiple / 1000).toFixed(2)}K×`
  }
  return `${multiple.toFixed(1)}×`
}

/**
 * Format sqrtPrice for display
 */
function formatSqrtPrice(sqrtPrice: string): string {
  try {
    // Convert to number for display purposes
    const sqrtPriceNum = Number(sqrtPrice) / 1e9

    // For very large or small numbers, use scientific notation
    if (sqrtPriceNum > 1000000 || sqrtPriceNum < 0.001) {
      return sqrtPriceNum.toExponential(4)
    }

    return sqrtPriceNum.toLocaleString('en-US', {
      maximumFractionDigits: 4,
    })
  } catch (e) {
    console.error('Error formatting sqrt price:', e)
    return sqrtPrice
  }
}
