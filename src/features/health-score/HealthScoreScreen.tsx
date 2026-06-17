import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react'
import { AppBar } from '@/components/ui/AppBar'
import { RadarChart } from '@/components/charts/RadarChart'
import { useAllHealthScores } from '@/data/hooks/useHealth'

export default function HealthScoreScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const all = useAllHealthScores() ?? []
  const sorted = [...all].sort((a, b) => b.computedAt - a.computedAt)
  const [idx, setIdx] = useState(0)
  const current = sorted[idx]

  const data = current
    ? [
        { axis: t('healthScore.axes.strength'), value: current.axes.strength },
        { axis: t('healthScore.axes.agility'), value: current.axes.agility },
        { axis: t('healthScore.axes.endurance'), value: current.axes.endurance },
        { axis: t('healthScore.axes.hydration'), value: current.axes.hydration },
        { axis: t('healthScore.axes.bpm'), value: current.axes.bpm },
        { axis: t('healthScore.axes.sleep'), value: current.axes.sleep },
      ]
    : []

  const legend = [
    { label: t('healthScore.axes.strength'), color: 'bg-primary' },
    { label: t('healthScore.axes.agility'), color: 'bg-secondary' },
    { label: t('healthScore.axes.endurance'), color: 'bg-success' },
  ]

  return (
    <div className="min-h-full">
      <AppBar
        title={t('healthScore.title')}
        end={
          <button onClick={() => navigate('/settings')} aria-label="Settings" className="grid h-11 w-11 place-items-center rounded-2xl hover:bg-surface-2">
            <Settings className="h-5 w-5" />
          </button>
        }
      />
      <div className="px-5">
        <div className="relative h-64">
          <RadarChart data={data} />
          <button
            onClick={() => setIdx((i) => Math.min(sorted.length - 1, i + 1))}
            disabled={idx >= sorted.length - 1}
            className="absolute start-0 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-surface-2 disabled:opacity-30"
            aria-label="Older"
          >
            <ChevronLeft className="h-5 w-5 rtl:-scale-x-100" />
          </button>
          <button
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            disabled={idx <= 0}
            className="absolute end-0 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-surface-2 disabled:opacity-30"
            aria-label="Newer"
          >
            <ChevronRight className="h-5 w-5 rtl:-scale-x-100" />
          </button>
        </div>

        <div className="mt-4 text-center">
          <div className="text-7xl font-black tabular leading-none">{current?.score ?? '—'}</div>
          <p className="mt-2 text-muted">{t('healthScore.subtitle')}</p>
        </div>

        <div className="mt-6 flex justify-center gap-5">
          {legend.map((l) => (
            <div key={l.label} className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${l.color}`} />
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
