import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Bell, ChevronRight, Pencil, Settings, Share2, Stethoscope, Users, type LucideIcon } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { BarTrend } from '@/components/charts/BarTrend'
import { useUser } from '@/data/hooks/useUser'
import { DAY_MS, formatDate, startOfDayMs } from '@/lib/date'
import { useUiStore } from '@/stores/ui.store'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { USER_PHOTO } from '@/assets/img'

export default function ProfileScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const locale = useUiStore((s) => s.locale)
  const user = useUser()
  if (!user) return null

  const todayStart = startOfDayMs(Date.now())
  const n = user.weeklyScores.length
  const bars = user.weeklyScores.map((v, i) => ({
    x: formatDate(todayStart - (n - 1 - i) * DAY_MS, 'EEEEEE', locale),
    value: v,
  }))

  const links: { icon: LucideIcon; label: string; to: string }[] = [
    { icon: Settings, label: t('settings.title'), to: '/settings' },
    { icon: Bell, label: t('notifications.title'), to: '/notifications' },
    { icon: Users, label: t('trainers.title'), to: '/trainers' },
    { icon: Stethoscope, label: t('settings.healthDeclaration'), to: '/onboarding/health-declaration' },
  ]

  return (
    <div className="min-h-full pb-6">
      <div className="flex justify-end px-5 pt-safe-t">
        <button onClick={() => navigate('/settings')} aria-label="Settings" className="mt-3 grid h-10 w-10 place-items-center rounded-2xl bg-surface">
          <Settings className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-col items-center px-5">
        <Avatar name={user.displayName} src={USER_PHOTO} size="xl" />
        <h1 className="mt-4 text-2xl font-black">{user.displayName}</h1>
        <p className="text-muted">{user.location}</p>
        <div className="mt-2">
          <Badge tone={user.membershipTier === 'pro' ? 'primary' : 'neutral'}>
            {user.membershipTier === 'pro' ? t('profile.proMember') : t('profile.basicMember')}
          </Badge>
        </div>
        <div className="mt-4 flex gap-3">
          <button className="flex items-center gap-2 rounded-2xl bg-surface-2 px-4 py-2 text-sm font-semibold active:scale-95">
            <Pencil className="h-4 w-4" />
            {t('profile.edit')}
          </button>
          <button className="flex items-center gap-2 rounded-2xl bg-surface-2 px-4 py-2 text-sm font-semibold active:scale-95">
            <Share2 className="h-4 w-4" />
            {t('profile.share')}
          </button>
        </div>
      </div>

      <Card className="mx-5 mt-6 p-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-muted">{t('profile.sandowScore')}</p>
            <p className="text-4xl font-black tabular text-primary">
              <AnimatedNumber value={user.sandowScore} format={(n) => String(Math.round(n))} />
            </p>
          </div>
          <Badge tone="neutral">{t('profile.weekly')}</Badge>
        </div>
        <div className="mt-3">
          <BarTrend data={bars} />
        </div>
      </Card>

      <div className="mt-6 space-y-2 px-5">
        {links.map((l) => (
          <button
            key={l.to}
            onClick={() => navigate(l.to)}
            className="flex w-full items-center gap-3 rounded-2xl bg-surface p-4 text-start transition-transform active:scale-[0.99]"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-surface-2 text-primary">
              <l.icon className="h-5 w-5" />
            </span>
            <span className="flex-1 font-medium">{l.label}</span>
            <ChevronRight className="h-5 w-5 text-muted rtl:-scale-x-100" />
          </button>
        ))}
      </div>
    </div>
  )
}
