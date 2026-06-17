import { Bar, BarChart, Cell, ResponsiveContainer, XAxis } from 'recharts'
import { useUiStore } from '@/stores/ui.store'

export interface BarDatum {
  x: string
  value: number
}

export function BarTrend({
  data,
  color = '#FF6A2B',
  highlightLast = true,
  height = 140,
}: {
  data: BarDatum[]
  color?: string
  highlightLast?: boolean
  height?: number
}) {
  const direction = useUiStore((s) => s.direction)
  const rtl = direction === 'rtl'
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }} barCategoryGap="28%">
        <XAxis
          dataKey="x"
          reversed={rtl}
          tick={{ fill: '#5E636E', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Bar dataKey="value" radius={[8, 8, 8, 8]}>
          {data.map((d, i) => (
            <Cell
              key={i}
              fill={highlightLast && i === data.length - 1 ? color : 'rgba(255,255,255,0.12)'}
              opacity={d.value / max > 0.0 ? 1 : 0.4}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
