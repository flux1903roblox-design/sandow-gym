interface SectionHeaderProps {
  title: string
  actionLabel?: string
  onAction?: () => void
}

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 pb-3 pt-6">
      <h2 className="text-lg font-extrabold">{title}</h2>
      {actionLabel && (
        <button onClick={onAction} className="text-sm font-semibold text-primary active:opacity-70">
          {actionLabel}
        </button>
      )}
    </div>
  )
}
