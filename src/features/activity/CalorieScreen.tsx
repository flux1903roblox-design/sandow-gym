import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Flame, Settings } from 'lucide-react'
import { AppBar } from '@/components/ui/AppBar'
import { SegmentedTabs } from '@/components/ui/SegmentedTabs'
import { AreaTrend } from '@/components/charts/AreaTrend'
import { useMetricSeries, useMetricValue } from '@/data/hooks/useMetrics'
import { formatInt } from '@/lib/format'
import { formatDate } from '@/lib/date'
import { useUiStore } from '@/stores/ui.store'

type Range = 'd' | 'w' | 'm' | 'a'
const RANGE_DAYS: Record<Range, number> = { d: 7, w: 14, m: 30, a: 35 }
const BASE_BURN = 1500 // resting energy baseline added to active calories for the chart
const GOAL = 568

export default function CalorieScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const locale = useUiStore((s) => s.locale)
  const [range, setRange] = useState<Range>('w')

  const calories = useMetricValue('calories')
  const series = useMetricSeries('calories', RANGE_DAYS[range]) ?? []
  const left = Math.max(0, GOAL - calories)

  const { data, markers } = useMemo(() => {
    const points = series.map((s) => ({ x: formatDate(s.timestamp, 'dd/MM', locale), value: BASE_BURN + s.value }))
    if (points.length === 0) return { data: points, markers: [] as { index: number; label: string }[] }
    let maxIdx = 0
    points.forEach((p, i) => {
      if (p.value > points[maxIdx].value) maxIdx = i
    })
    const lastIdx = points.length - 1
    const set = new Map<number, string>()
    set.set(maxIdx, formatInt(points[maxIdx].value, locale))
    set.set(lastIdx, formatInt(points[lastIdx].value, locale))
    return { data: points, markers: [...set].map(([index, label]) => ({ index, label })) }
  }, [series, locale])

  return (
    <div className="min-h-full">
      <AppBar
        title={t('calorie.title')}
        end={
          <button onClick={() => navigate('/settings')} aria-label="Settings" className="grid h-11 w-11 place-items-center rounded-2xl hover:bg-surface-2">
            <Settings className="h-5 w-5" />
          </button>
        }
      />
      <div className="px-5 pt-2">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-primary">
            <Flame className="h-6 w-6" />
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black tabular leading-none">{formatInt(calories, locale)}</span>
            <span className="text-xl font-bold text-muted">{t('metrics.units.kcal')}</span>
          </div>
        </div>
        <p className="mt-3 text-muted">{t('calorie.burnLeft', { n: formatInt(left, locale) })}</p>
      </div>

      <div className="mt-6">
        <AreaTrend data={data} markers={markers} height={230} />
      </div>

      <div className="mt-4 flex justify-center">
        <SegmentedTabs
          value={range}
          onChange={setRange}
          options={[
            { value: 'd', label: '1D' },
            { value: 'w', label: '1W' },
            { value: 'm', label: '1M' },
            { value: 'a', label: 'All' },
          ]}
        />
      </div>
    </div>
  )
}
