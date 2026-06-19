import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { AppBar } from '@/components/ui/AppBar'
import { Card } from '@/components/ui/Card'
import { useLoggedSessions } from '@/data/hooks/useLoggedSessions'
import { exerciseById, exerciseName } from '@/data/catalog'
import { formatDuration, formatInt } from '@/lib/format'
import { DAY_MS, formatHeaderDate, startOfDayMs } from '@/lib/date'
import { useUiStore } from '@/stores/ui.store'
import { cn } from '@/lib/cn'

function StatTile({ value, label, suffix }: { value: ReactNode; label: string; suffix?: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-surface p-3 text-center">
      <span className="text-2xl font-extrabold tabular leading-none">
        {value}
        {suffix && <span className="text-xs font-medium text-muted"> {suffix}</span>}
      </span>
      <span className="text-xs text-muted">{label}</span>
    </div>
  )
}

export default function HistoryScreen() {
  const { t } = useTranslation()
  const locale = useUiStore((s) => s.locale)
  const sessions = useLoggedSessions() ?? []

  const today = startOfDayMs(Date.now())
  const countByDay = new Map<number, number>()
  sessions.forEach((s) => {
    const d = startOfDayMs(s.startedAt)
    countByDay.set(d, (countByDay.get(d) || 0) + 1)
  })

  // Streak = consecutive days with ≥1 workout, ending today (or yesterday if none today).
  let streak = 0
  let i = (countByDay.get(today) || 0) === 0 ? 1 : 0
  for (; ; i++) {
    if ((countByDay.get(today - i * DAY_MS) || 0) > 0) streak++
    else break
  }

  const thisWeek = sessions.filter((s) => s.startedAt >= today - 6 * DAY_MS).length
  const totalVolume = sessions.reduce((a, s) => a + s.totalVolume, 0)

  // Contribution heatmap — last 112 days, 7-day columns.
  const DAYS = 112
  const days = Array.from({ length: DAYS }, (_, k) => today - (DAYS - 1 - k) * DAY_MS)
  const columns: number[][] = []
  for (let c = 0; c < DAYS / 7; c++) columns.push(days.slice(c * 7, c * 7 + 7))
  const cell = (n: number) => (n === 0 ? 'bg-surface-2' : n === 1 ? 'bg-primary/40' : n === 2 ? 'bg-primary/70' : 'bg-primary')

  return (
    <div className="min-h-full pb-6">
      <AppBar title={t('history.title')} />

      <div className="grid grid-cols-3 gap-3 px-5">
        <StatTile value={streak} label={t('history.streak')} suffix={t('history.days')} />
        <StatTile value={thisWeek} label={t('history.thisWeek')} />
        <StatTile value={formatInt(totalVolume, locale)} label={t('history.volume')} suffix="kg" />
      </div>

      <Card className="mx-5 mt-4 p-4">
        <div className="no-scrollbar flex justify-end gap-1 overflow-x-auto">
          {columns.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-1">
              {col.map((d, di) => (
                <div key={di} className={cn('h-3.5 w-3.5 rounded-sm', cell(countByDay.get(d) || 0))} />
              ))}
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-5 space-y-3 px-5">
        {sessions.length === 0 && <p className="py-12 text-center text-muted">{t('history.empty')}</p>}
        {sessions.map((s) => (
          <Card key={s.id} className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-bold">{formatHeaderDate(s.startedAt, locale)}</span>
              <span className="text-sm tabular text-muted">{formatDuration(s.durationSeconds)}</span>
            </div>
            <div className="mt-1 flex flex-wrap gap-x-2 text-xs text-muted">
              <span>
                {s.exercises.length} {t('history.exercises')}
              </span>
              <span>
                · {s.totalSets} {t('history.sets')}
              </span>
              <span>· {formatInt(s.totalVolume, locale)} kg</span>
            </div>
            <p className="mt-2 truncate text-sm text-muted">
              {s.exercises
                .map((e) => {
                  const c = exerciseById(e.exerciseId)
                  return c ? exerciseName(c, locale) : e.exerciseId
                })
                .join(' · ')}
            </p>
          </Card>
        ))}
      </div>
    </div>
  )
}
