import { useTranslation } from 'react-i18next'
import { Flame, Footprints, MapPin, Play, Square, Timer } from 'lucide-react'
import { AppBar } from '@/components/ui/AppBar'
import { StatTile } from '@/components/ui/StatTile'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { BarTrend } from '@/components/charts/BarTrend'
import { useMetricSeries, useMetricValue } from '@/data/hooks/useMetrics'
import { useLiveTracking } from '@/data/hooks/useLiveTracking'
import { formatInt } from '@/lib/format'
import { formatDate } from '@/lib/date'
import { useUiStore } from '@/stores/ui.store'

export default function ActivityScreen() {
  const { t } = useTranslation()
  const locale = useUiStore((s) => s.locale)
  const steps = useMetricValue('steps')
  const distance = useMetricValue('distance')
  const activeMin = useMetricValue('activeMinutes')
  const stepsSeries = useMetricSeries('steps', 7) ?? []
  const { tracking, permission, sessionSteps, sessionKm, start, stop } = useLiveTracking()

  const activeKcal = Math.round(steps * 0.2246)
  const bars = stepsSeries.map((s) => ({ x: formatDate(s.timestamp, 'EEEEEE', locale), value: s.value }))

  return (
    <div className="min-h-full pb-6">
      <AppBar title={t('activity.title')} />
      <div className="flex flex-col items-center px-5 pt-6">
        <span className="text-6xl font-black tabular leading-none">{formatInt(steps, locale)}</span>
        <p className="mt-2 text-muted">{t('activity.totalSteps')}</p>
      </div>

      <Card className="mx-5 mt-6 p-4">
        {tracking ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-success">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/70" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
                </span>
                <span className="text-xs font-bold uppercase">{t('activity.live')}</span>
              </div>
              <p className="mt-1 text-lg font-extrabold tabular">{t('activity.sessionSteps', { n: sessionSteps })}</p>
              <p className="text-xs text-muted">
                {sessionKm.toFixed(2)} {t('metrics.units.km')}
              </p>
            </div>
            <Button variant="surface" onClick={stop}>
              <Square className="h-4 w-4" />
              {t('activity.stop')}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Button variant="primary" block onClick={() => void start()}>
              <Play className="h-4 w-4 fill-current" />
              {t('activity.startTracking')}
            </Button>
            <p className="text-center text-xs text-muted">{t('activity.trackingNote')}</p>
            {permission === 'denied' && <p className="text-center text-xs text-destructive">{t('activity.motionDenied')}</p>}
            {permission === 'unsupported' && <p className="text-center text-xs text-warning">{t('activity.motionUnsupported')}</p>}
          </div>
        )}
      </Card>

      <div className="mt-5 grid grid-cols-3 gap-3 px-5">
        <StatTile icon={Flame} value={formatInt(activeKcal, locale)} label={t('metrics.units.kcal')} tone="primary" />
        <StatTile icon={MapPin} value={distance.toFixed(1)} label={t('metrics.units.km')} tone="secondary" />
        <StatTile icon={Timer} value={formatInt(activeMin, locale)} label={t('metrics.units.min')} tone="success" />
      </div>

      <Card className="mx-5 mt-5 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted">
          <Footprints className="h-4 w-4" /> {t('metrics.steps')}
        </div>
        <BarTrend data={bars} />
      </Card>
    </div>
  )
}
