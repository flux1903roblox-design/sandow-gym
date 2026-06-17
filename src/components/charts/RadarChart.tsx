import { Radar, RadarChart as RC, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'

export interface RadarDatum {
  axis: string
  value: number
}

// Radial charts are direction-agnostic; only the axis labels localize.
export function RadarChart({ data, color = '#FF6A2B' }: { data: RadarDatum[]; color?: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RC data={data} outerRadius="72%">
        <PolarGrid stroke="rgba(255,255,255,0.10)" />
        <PolarAngleAxis dataKey="axis" tick={{ fill: '#8A8F98', fontSize: 11 }} />
        <Radar dataKey="value" stroke={color} strokeWidth={2} fill={color} fillOpacity={0.3} />
      </RC>
    </ResponsiveContainer>
  )
}
