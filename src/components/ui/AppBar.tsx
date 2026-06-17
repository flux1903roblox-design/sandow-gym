import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/cn'

interface AppBarProps {
  title?: ReactNode
  /** Show a back button (defaults to history back). */
  onBack?: () => void
  back?: boolean
  end?: ReactNode
  className?: string
  transparent?: boolean
}

export function AppBar({ title, onBack, back = true, end, className, transparent }: AppBarProps) {
  const navigate = useNavigate()
  return (
    <header
      className={cn(
        'sticky top-0 z-20 pt-safe-t',
        transparent ? 'bg-transparent' : 'bg-bg/85 backdrop-blur-md',
        className,
      )}
    >
      <div className="flex h-14 items-center justify-between gap-2 px-4">
        <div className="flex w-11 justify-start">
          {back && (
            <button
              aria-label="Back"
              onClick={() => (onBack ? onBack() : navigate(-1))}
              className="grid h-11 w-11 -ms-2 place-items-center rounded-2xl text-foreground active:scale-95 hover:bg-surface-2"
            >
              <ChevronLeft className="h-6 w-6 rtl:-scale-x-100" />
            </button>
          )}
        </div>
        <h1 className="truncate text-center text-base font-bold">{title}</h1>
        <div className="flex w-11 items-center justify-end gap-1">{end}</div>
      </div>
    </header>
  )
}
