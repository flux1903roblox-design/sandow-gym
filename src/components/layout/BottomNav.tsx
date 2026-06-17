import { NavLink } from 'react-router-dom'
import { Bot, Dumbbell, Home, Plus, User, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useUiStore } from '@/stores/ui.store'
import { cn } from '@/lib/cn'

export function BottomNav() {
  const { t } = useTranslation()
  const openQuick = useUiStore((s) => s.setQuickActionsOpen)

  const Tab = ({ to, icon: Icon, k }: { to: string; icon: LucideIcon; k: string }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex flex-col items-center gap-1 py-1 text-[11px] font-medium transition-colors',
          isActive ? 'text-primary' : 'text-muted hover:text-foreground',
        )
      }
    >
      <Icon className="h-6 w-6" />
      <span>{t(`nav.${k}`)}</span>
    </NavLink>
  )

  return (
    <nav className="shrink-0 border-t border-border bg-bg/95 backdrop-blur pb-safe-b">
      <div className="grid grid-cols-5 items-end px-2 pt-2">
        <Tab to="/home" icon={Home} k="home" />
        <Tab to="/workouts" icon={Dumbbell} k="workouts" />
        <div className="flex justify-center">
          <button
            aria-label={t('quickActions.title')}
            onClick={() => openQuick(true)}
            className="-mt-7 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-fg shadow-glow transition-transform active:scale-95"
          >
            <Plus className="h-7 w-7" />
          </button>
        </div>
        <Tab to="/coach" icon={Bot} k="coach" />
        <Tab to="/profile" icon={User} k="profile" />
      </div>
    </nav>
  )
}
