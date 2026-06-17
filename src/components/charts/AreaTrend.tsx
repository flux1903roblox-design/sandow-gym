import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useUiStore } from '@/stores/ui.store'

export interface TrendPoint {
  x: string
  value: number
}

interface AreaTrendProps {
  data: TrendPoint[]
  color?: string
  /** index -> label, drawn as a pill callout above the point (e.g. "1,978"). */
  markers?: { index: number; label: string }[]
  height?: number
  showAxis?: boolean
}

interface DotProps {
  cx?: number
  cy?: number
  index?: number
}

export function AreaTrend({ data, color = '#FF6A2B', markers = [], height = 200, showAxis = true }: AreaTrendProps) {
  const direction = useUiStore((s) => s.direction)
  const rtl = direction === 'rtl'
  const markerMap = new Map(markers.map((m) => [m.index, m.label]))

  const renderDot = (props: DotProps) => {
    const { cx, cy, index } = props
    const label = index != null ? markerMap.get(index) : undefined
    if (label == null || cx == null || cy == null) return <g />
    return (
      <g>
        <rect x={cx - 28} y={cy - 36} rx={9} ry={9} width={56} height={23} fill={color} />
        <text x={cx} y={cy - 20} textAnchor="middle" fill="#0A0B0D" fontSize="12" fontWeight="800">
          {label}
        </text>
        <circle cx={cx} cy={cy} r={5} fill={color} stroke="#0A0B0D" strokeWidth={2.5} />
      </g>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 36, right: 12, left: 12, bottom: 0 }}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.45} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="x"
          reversed={rtl}
          hide={!showAxis}
          tick={{ fill: '#5E636E', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          orientation={rtl ? 'right' : 'left'}
          hide={!showAxis}
          tick={{ fill: '#5E636E', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={36}
        />
        <Tooltip
          cursor={{ stroke: 'rgba(255,255,255,0.15)' }}
          contentStyle={{
            background: '#16181D',
            border: '1px solid #26282F',
            borderRadius: 12,
            color: '#F4F5F7',
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={3}
          fill="url(#areaFill)"
          dot={renderDot as never}
          activeDot={{ r: 5, fill: color }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
