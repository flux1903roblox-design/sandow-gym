import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Camera, Droplet, Dumbbell, MapPin, type LucideIcon } from 'lucide-react'
import { Sheet } from '@/components/ui/Sheet'
import { useUiStore } from '@/stores/ui.store'
import { cn } from '@/lib/cn'

export function QuickActionSheet() {
  const open = useUiStore((s) => s.quickActionsOpen)
  const setOpen = useUiStore((s) => s.setQuickActionsOpen)
  const navigate = useNavigate()
  const { t } = useTranslation()

  const go = (path: string) => {
    setOpen(false)
    navigate(path)
  }

  const actions: { icon: LucideIcon; label: string; to: string; tone: string }[] = [
    { icon: Dumbbell, label: t('quickActions.startWorkout'), to: '/session/live', tone: 'bg-primary text-primary-fg' },
    { icon: Camera, label: t('quickActions.scanFood'), to: '/scan', tone: 'bg-secondary text-secondary-fg' },
    { icon: Droplet, label: t('quickActions.logWater'), to: '/activity/hydration', tone: 'bg-secondary text-secondary-fg' },
    { icon: MapPin, label: t('quickActions.startRun'), to: '/route', tone: 'bg-success text-success-fg' },
  ]

  return (
    <Sheet open={open} onClose={() => setOpen(false)} title={t('quickActions.title')}>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((a) => (
          <button
            key={a.to}
            onClick={() => go(a.to)}
            className="flex flex-col items-start gap-3 rounded-3xl bg-surface-2 p-4 text-start transition-transform active:scale-95"
          >
            <span className={cn('grid h-11 w-11 place-items-center rounded-2xl', a.tone)}>
              <a.icon className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold">{a.label}</span>
          </button>
        ))}
      </div>
    </Sheet>
  )
}
