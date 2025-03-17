import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface LiquidityPoint {
  sqrtPrice: number
  liquidity: number
}

interface LiquidityDistributionChartProps {
  liquidityPoints: LiquidityPoint[]
  height?: number
}

export default function LiquidityDistributionChart({
  liquidityPoints,
  height = 250,
}: LiquidityDistributionChartProps) {
  // Process the data for the chart
  const data = processLiquidityPoints(liquidityPoints)

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
      >
        <defs>
          <linearGradient id="liquidityGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#a855f7" stopOpacity={0.2} />
          </linearGradient>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
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
        <YAxis
          yAxisId="left"
          tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
          tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          tickFormatter={(value) => formatYAxisTick(value)}
          width={50}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
          tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          tickFormatter={(value) => formatYAxisTick(value)}
          width={50}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(13, 17, 28, 0.8)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
          }}
          itemStyle={{ color: 'white' }}
          labelStyle={{ color: 'white' }}
          formatter={(value: number, name: string) => {
            if (name === 'liquidity') {
              return [formatLiquidity(value), 'Liquidity']
            }
            return [value.toFixed(6), 'Price']
          }}
          labelFormatter={(label) => `Position: ${label}`}
        />
        <Legend
          iconType="circle"
          wrapperStyle={{
            paddingTop: 5,
            color: 'rgba(255,255,255,0.6)',
            fontSize: 12,
          }}
        />
        <Bar
          yAxisId="left"
          dataKey="liquidity"
          fill="url(#liquidityGradient)"
          name="Liquidity"
          barSize={20}
          opacity={0.8}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="price"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#priceGradient)"
          dot={false}
          name="Price"
          activeDot={{ r: 4, strokeWidth: 1 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

// Convert liquidity points to chart data format
function processLiquidityPoints(liquidityPoints: LiquidityPoint[]) {
  if (!liquidityPoints || liquidityPoints.length === 0) {
    return []
  }

  return liquidityPoints.map((point, index) => {
    // Calculate the price from sqrt price
    const price = point.sqrtPrice * point.sqrtPrice
    const liquidity = point.liquidity

    // Create a percentage-based label for readability
    const percentage = Math.round((index / (liquidityPoints.length - 1)) * 100)
    const label =
      index === 0
        ? '0%'
        : index === liquidityPoints.length - 1
        ? '100%'
        : percentage % 25 === 0
        ? `${percentage}%`
        : ''

    return {
      index,
      label,
      price,
      liquidity,
    }
  })
}

// Format large numbers for axis ticks
function formatYAxisTick(value: number): string {
  if (value === 0) return '0'
  if (value < 1) return value.toFixed(4)
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toFixed(1)
}

// Format liquidity values for tooltip
function formatLiquidity(value: number): string {
  if (value === 0) return '0'
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`
  return value.toFixed(2)
}
