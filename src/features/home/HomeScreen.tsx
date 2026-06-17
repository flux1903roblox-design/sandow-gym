import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Activity, Bell, Droplet, Flame, Footprints, Heart, Scale } from 'lucide-react'
import { useUser } from '@/data/hooks/useUser'
import { useHealthScore } from '@/data/hooks/useHealth'
import { useMetricSeries, useMetricValue } from '@/data/hooks/useMetrics'
import { usePrograms } from '@/data/hooks/useWorkouts'
import { useTrainers } from '@/data/hooks/useTrainers'
import { useUnreadCount } from '@/data/hooks/useNotifications'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { MetricCard } from '@/components/ui/MetricCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { StatTile } from '@/components/ui/StatTile'
import { ProgramCard } from '@/components/workouts/ProgramCard'
import { formatHeaderDate } from '@/lib/date'
import { formatInt } from '@/lib/format'
import { useUiStore } from '@/stores/ui.store'

export default function HomeScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const locale = useUiStore((s) => s.locale)

  const user = useUser()
  const score = useHealthScore()
  const hydration = useMetricValue('hydration')
  const calories = useMetricValue('calories')
  const steps = useMetricValue('steps')
  const calorieSeries = useMetricSeries('calories', 7) ?? []
  const hydrationSeries = useMetricSeries('hydration', 7) ?? []
  const programs = usePrograms() ?? []
  const trainers = useTrainers() ?? []
  const unread = useUnreadCount() ?? 0

  if (!user) return null
  const trainerName = (id: string) => trainers.find((tr) => tr.id === id)?.name

  return (
    <div className="min-h-full pb-8">
      <div className="px-5 pt-safe-t">
        <div className="flex items-center justify-between pt-4">
          <button onClick={() => navigate('/profile')} className="flex items-center gap-3 text-start">
            <Avatar name={user.displayName} size="md" />
            <div>
              <p className="text-xs text-muted">{formatHeaderDate(Date.now(), locale)}</p>
              <h1 className="text-xl font-extrabold leading-tight">
                {t('home.greeting', { name: user.displayName.split(' ')[0] })}
              </h1>
            </div>
          </button>
          <button
            onClick={() => navigate('/notifications')}
            aria-label="Notifications"
            className="relative grid h-11 w-11 place-items-center rounded-2xl bg-surface"
          >
            <Bell className="h-5 w-5" />
            {unread > 0 && <span className="absolute end-2.5 top-2.5 h-2 w-2 rounded-full bg-primary" />}
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Badge tone="success">
            <Heart className="h-3 w-3" /> {t('home.healthy', { percent: user.healthPercent })}
          </Badge>
          {user.membershipTier === 'pro' && <Badge tone="primary">{t('home.pro')}</Badge>}
        </div>
      </div>

      <SectionHeader
        title={t('home.fitnessMetrics')}
        actionLabel={t('common.seeAll')}
        onAction={() => navigate('/health-score')}
      />
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-5 pb-1">
        <MetricCard
          tone="primary"
          label={t('metrics.score')}
          value={`${score?.score ?? user.healthPercent}%`}
          icon={Activity}
          bars={user.weeklyScores}
          onClick={() => navigate('/health-score')}
        />
        <MetricCard
          tone="secondary"
          label={t('metrics.hydration')}
          value={formatInt(hydration, locale)}
          unit={t('metrics.units.ml')}
          icon={Droplet}
          bars={hydrationSeries.map((s) => s.value)}
          onClick={() => navigate('/activity/hydration')}
        />
        <MetricCard
          tone="surface"
          label={t('metrics.calorie')}
          value={formatInt(calories, locale)}
          unit={t('metrics.units.kcal')}
          icon={Flame}
          bars={calorieSeries.map((s) => s.value)}
          onClick={() => navigate('/activity/calorie')}
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 px-5">
        <button onClick={() => navigate('/activity')}>
          <StatTile icon={Footprints} value={formatInt(steps, locale)} label={t('metrics.steps')} tone="primary" />
        </button>
        <button onClick={() => navigate('/bmi')}>
          <StatTile icon={Scale} value={user.bmi.toFixed(1)} label={t('metrics.bmi')} tone="secondary" />
        </button>
        <button onClick={() => navigate('/health-score')}>
          <StatTile icon={Heart} value={`${score?.score ?? user.healthPercent}`} label={t('metrics.healthScore')} tone="success" />
        </button>
      </div>

      <SectionHeader
        title={`${t('home.workouts')} (${programs.length})`}
        actionLabel={t('common.seeAll')}
        onAction={() => navigate('/workouts')}
      />
      <div className="space-y-3 px-5">
        {programs.slice(0, 4).map((p) => (
          <ProgramCard key={p.id} program={p} trainerName={trainerName(p.trainerId)} />
        ))}
      </div>
    </div>
  )
}
