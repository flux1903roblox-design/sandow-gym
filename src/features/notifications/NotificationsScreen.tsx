import { useTranslation } from 'react-i18next'
import { Bell, Bot, Droplet, Dumbbell, Trophy, type LucideIcon } from 'lucide-react'
import { AppBar } from '@/components/ui/AppBar'
import { useNotifications } from '@/data/hooks/useNotifications'
import { markAllRead, markRead } from '@/db/repositories/notificationRepo'
import { timeAgo } from '@/lib/date'
import { useUiStore } from '@/stores/ui.store'
import { cn } from '@/lib/cn'
import type { NotificationKind } from '@/db/types'

const ICONS: Record<NotificationKind, LucideIcon> = {
  workout: Dumbbell,
  hydration: Droplet,
  coach: Bot,
  achievement: Trophy,
  system: Bell,
}

export default function NotificationsScreen() {
  const { t } = useTranslation()
  const locale = useUiStore((s) => s.locale)
  const items = useNotifications() ?? []

  return (
    <div className="min-h-full">
      <AppBar
        title={t('notifications.title')}
        end={
          <button onClick={() => void markAllRead()} className="px-2 text-xs font-semibold text-primary">
            {t('notifications.markAllRead')}
          </button>
        }
      />
      <div className="space-y-2 px-5 pb-6">
        {items.length === 0 && <p className="py-16 text-center text-muted">{t('notifications.empty')}</p>}
        {items.map((nft) => {
          const Icon = ICONS[nft.kind] ?? Bell
          return (
            <button
              key={nft.id}
              onClick={() => void markRead(nft.id)}
              className={cn('flex w-full items-start gap-3 rounded-2xl p-4 text-start', nft.read ? 'bg-surface' : 'bg-surface-2')}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{nft.title}</span>
                  {!nft.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                </div>
                <p className="text-sm text-muted">{nft.body}</p>
                <p className="mt-1 text-xs text-muted-2">{timeAgo(nft.createdAt, locale)}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
