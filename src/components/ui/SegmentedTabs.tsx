import { cn } from '@/lib/cn'

interface SegmentedTabsProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function SegmentedTabs<T extends string>({ options, value, onChange, className }: SegmentedTabsProps<T>) {
  return (
    <div className={cn('inline-flex rounded-2xl bg-surface-2 p-1', className)} role="tablist">
      {options.map((opt) => (
        <button
          key={opt.value}
          role="tab"
          aria-selected={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'min-w-[44px] rounded-xl px-3 py-1.5 text-sm font-semibold transition-colors',
            value === opt.value ? 'bg-primary text-primary-fg' : 'text-muted hover:text-foreground',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
