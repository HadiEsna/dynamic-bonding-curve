import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface CurveChartProps {
  curveType: 'exponential' | 'linear' | 'custom'
  initialPrice: number
  maxSupply: number
  customPoints?: Array<{ x: number; y: number }>
  height?: number
}

export default function CurveChart({
  curveType,
  initialPrice,
  maxSupply,
  customPoints = [],
  height = 200,
}: CurveChartProps) {
  // Generate points based on curve type
  const data = generateCurvePoints(
    curveType,
    initialPrice,
    maxSupply,
    customPoints
  )

  // Get curve color based on curve type
  const curveColor = getCurveColor(curveType)

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient
            id={`gradient-${curveType}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="5%" stopColor={curveColor} stopOpacity={0.8} />
            <stop offset="95%" stopColor={curveColor} stopOpacity={0.2} />
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
          tickFormatter={(value) => value}
        />
        <YAxis
          tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
          tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          tickFormatter={(value) => value.toFixed(4)}
          width={40}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(13, 17, 28, 0.8)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
          }}
          itemStyle={{ color: 'white' }}
          labelStyle={{ color: 'white' }}
          formatter={(value: number) => [value.toFixed(6), 'Price']}
          labelFormatter={(label) => `Supply: ${label}`}
        />
        <Line
          type="monotone"
          dataKey="y"
          stroke={curveColor}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 1 }}
          fill={`url(#gradient-${curveType})`}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// Helper function to generate curve points based on curve type
function generateCurvePoints(
  curveType: string,
  initialPrice: number,
  maxSupply: number,
  customPoints: Array<{ x: number; y: number }>
): Array<{ x: number; y: number; label: string }> {
  const points: Array<{ x: number; y: number; label: string }> = []

  // For a cleaner chart, generate fewer points (20 points)
  const pointCount = 20
  const step = 100 / pointCount

  // Variables for calculations to avoid linter errors
  let k: number
  let finalPrice: number
  let slope: number
  let lowerPoint: { x: number; y: number }
  let upperPoint: { x: number; y: number }
  let ratio: number

  // Generate points for the curve
  for (let i = 0; i <= 100; i += step) {
    let price: number

    switch (curveType) {
      case 'exponential':
        // Exponential curve: y = initialPrice * e^(kx)
        k = 0.05
        price = initialPrice * Math.exp(k * i)
        break

      case 'linear':
        // Linear curve: y = initialPrice + (slope * x)
        finalPrice = initialPrice * 10 // 10x increase at 100%
        slope = (finalPrice - initialPrice) / 100
        price = initialPrice + slope * i
        break

      case 'custom':
        if (customPoints.length > 0) {
          // Find the closest custom points and interpolate
          lowerPoint = customPoints.find((p) => p.x <= i) || {
            x: 0,
            y: initialPrice,
          }
          upperPoint = customPoints.find((p) => p.x > i) ||
            customPoints[customPoints.length - 1] || {
              x: 100,
              y: initialPrice * 10,
            }

          if (lowerPoint.x === i) {
            price = lowerPoint.y
          } else if (upperPoint.x === i) {
            price = upperPoint.y
          } else {
            // Linear interpolation between points
            ratio = (i - lowerPoint.x) / (upperPoint.x - lowerPoint.x)
            price = lowerPoint.y + ratio * (upperPoint.y - lowerPoint.y)
          }
        } else {
          // Fallback to exponential if no custom points
          price = initialPrice * Math.exp(0.04 * i)
        }
        break

      default:
        price = initialPrice
    }

    // Format the label based on percentage
    const label =
      i === 0 ? '0%' : i === 100 ? '100%' : i % 25 === 0 ? `${i}%` : ''

    points.push({ x: i, y: price, label })
  }

  return points
}

// Helper function to get curve color based on curve type
function getCurveColor(curveType: string): string {
  switch (curveType) {
    case 'exponential':
      return '#ec4899' // pink-500
    case 'linear':
      return '#3b82f6' // blue-500
    case 'custom':
      return '#a855f7' // purple-500
    default:
      return '#ffffff'
  }
}
