import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

type Tone = 'primary' | 'secondary' | 'surface'

const toneBg: Record<Tone, string> = {
  primary: 'bg-primary text-primary-fg',
  secondary: 'bg-secondary text-white',
  surface: 'bg-surface text-foreground',
}

function MiniBars({ values, tone }: { values: number[]; tone: Tone }) {
  const max = Math.max(...values, 1)
  const barColor = tone === 'surface' ? 'bg-primary' : 'bg-white/45'
  const lastColor = tone === 'surface' ? 'bg-primary' : 'bg-white'
  return (
    <div className="flex h-10 items-end gap-1">
      {values.map((v, i) => (
        <div
          key={i}
          className={cn('w-1.5 rounded-full', i === values.length - 1 ? lastColor : barColor)}
          style={{ height: `${Math.max(14, (v / max) * 100)}%` }}
        />
      ))}
    </div>
  )
}

interface MetricCardProps {
  label: string
  value: string
  unit?: string
  icon: LucideIcon
  tone?: Tone
  bars?: number[]
  onClick?: () => void
  className?: string
}

export function MetricCard({ label, value, unit, icon: Icon, tone = 'surface', bars, onClick, className }: MetricCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-[150px] shrink-0 flex-col gap-3 rounded-card p-4 text-start transition-transform active:scale-[0.97]',
        toneBg[tone],
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold opacity-90">{label}</span>
        <span
          className={cn(
            'grid h-8 w-8 place-items-center rounded-xl',
            tone === 'surface' ? 'bg-primary text-primary-fg' : 'bg-white/20',
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      {bars && bars.length > 0 && <MiniBars values={bars} tone={tone} />}
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-extrabold tabular leading-none">{value}</span>
        {unit && <span className="text-xs font-medium opacity-80">{unit}</span>}
      </div>
    </button>
  )
}
