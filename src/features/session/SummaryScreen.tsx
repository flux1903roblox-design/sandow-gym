import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Flame, Heart, MapPin, type LucideIcon } from 'lucide-react'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { Button } from '@/components/ui/Button'
import { useSession } from '@/data/hooks/useWorkouts'
import { formatInt } from '@/lib/format'
import { useUiStore } from '@/stores/ui.store'
import { cn } from '@/lib/cn'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'

export default function SummaryScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const locale = useUiStore((s) => s.locale)
  const session = useSession(id)

  if (!session) return null
  const totals = session.totals ?? { calories: 0, durationSec: 0 }

  const legend: { icon: LucideIcon; label: string; value: string; color: string }[] = [
    {
      icon: MapPin,
      label: t('session.distance'),
      value: totals.distanceKm ? `${totals.distanceKm} ${t('metrics.units.km')}` : '—',
      color: 'text-secondary',
    },
    { icon: Flame, label: t('session.calorie'), value: formatInt(totals.calories, locale), color: 'text-primary' },
    { icon: Heart, label: t('session.bpm'), value: totals.avgBpm ? `${totals.avgBpm}` : '—', color: 'text-success' },
  ]

  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-black">{t('session.completed', { activity: session.activity })}</h1>

      <div className="my-8">
        <ProgressRing value={0.85} size={224} stroke={18}>
          <div>
            <div className="text-5xl font-black tabular leading-none">
              <AnimatedNumber value={totals.calories} format={(n) => formatInt(n, locale)} />
            </div>
            <div className="mt-1 text-muted">{t('metrics.units.kcal')}</div>
          </div>
        </ProgressRing>
      </div>

      <div className="grid w-full grid-cols-3 gap-3">
        {legend.map((l) => (
          <div key={l.label} className="flex flex-col items-center gap-1 rounded-2xl bg-surface p-3">
            <l.icon className={cn('h-5 w-5', l.color)} />
            <span className="font-bold tabular">{l.value}</span>
            <span className="text-xs text-muted">{l.label}</span>
          </div>
        ))}
      </div>

      {session.followUp && (
        <div className="mt-5 w-full rounded-2xl bg-surface p-4 text-start">
          <p className="text-xs uppercase tracking-wide text-muted">{t('common.next')}</p>
          <p className="font-bold">{session.followUp}</p>
        </div>
      )}

      <Button block variant="primary" className="mt-8" onClick={() => navigate('/home', { replace: true })}>
        {t('common.done')}
      </Button>
    </div>
  )
}
