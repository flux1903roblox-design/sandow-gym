import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

type Tone = 'primary' | 'secondary' | 'success'

const toneClasses: Record<Tone, string> = {
  primary: 'bg-primary text-primary-fg',
  secondary: 'bg-secondary text-secondary-fg',
  success: 'bg-success text-success-fg',
}

export function StatTile({
  icon: Icon,
  value,
  label,
  tone = 'primary',
  className,
}: {
  icon: LucideIcon
  value: string
  label: string
  tone?: Tone
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center gap-2 rounded-3xl bg-surface p-4 text-center', className)}>
      <span className={cn('grid h-11 w-11 place-items-center rounded-2xl', toneClasses[tone])}>
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-2xl font-extrabold tabular leading-none">{value}</span>
      <span className="text-xs text-muted">{label}</span>
    </div>
  )
}
