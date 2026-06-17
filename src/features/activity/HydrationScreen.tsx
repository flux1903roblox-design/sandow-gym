import { useTranslation } from 'react-i18next'
import { Droplet } from 'lucide-react'
import { AppBar } from '@/components/ui/AppBar'
import { Button } from '@/components/ui/Button'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { useUser } from '@/data/hooks/useUser'
import { useMetricValue } from '@/data/hooks/useMetrics'
import { incrementToday } from '@/db/repositories/metricsRepo'
import { formatInt } from '@/lib/format'
import { useUiStore } from '@/stores/ui.store'

const GOAL = 2500

export default function HydrationScreen() {
  const { t } = useTranslation()
  const locale = useUiStore((s) => s.locale)
  const user = useUser()
  const hydration = useMetricValue('hydration')

  const add = (ml: number) => {
    if (user) void incrementToday(user.id, 'hydration', ml, 'ml')
  }

  return (
    <div className="min-h-full">
      <AppBar title={t('hydration.title')} />
      <div className="flex flex-col items-center px-5 pt-8">
        <ProgressRing value={hydration / GOAL} size={224} stroke={18} color="#3B82F6">
          <div className="flex flex-col items-center">
            <Droplet className="mb-1 h-6 w-6 text-secondary" />
            <span className="text-5xl font-black tabular leading-none">{formatInt(hydration, locale)}</span>
            <span className="mt-1 text-sm text-muted">{t('metrics.units.ml')}</span>
          </div>
        </ProgressRing>

        <p className="mt-7 text-muted">
          {t('hydration.dailyGoal')}: {formatInt(GOAL, locale)} {t('metrics.units.ml')}
        </p>

        <div className="mt-6 flex gap-3">
          <Button variant="secondary" onClick={() => add(250)}>
            {t('hydration.addAmount', { n: 250 })}
          </Button>
          <Button variant="surface" onClick={() => add(500)}>
            {t('hydration.addAmount', { n: 500 })}
          </Button>
        </div>
      </div>
    </div>
  )
}
