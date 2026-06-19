import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Check, ChevronLeft, ChevronRight, Plus, Timer, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useActiveWorkout } from '@/stores/activeWorkout.store'
import { useUser } from '@/data/hooks/useUser'
import { saveLoggedSession } from '@/db/repositories/loggedSessionRepo'
import { incrementToday } from '@/db/repositories/metricsRepo'
import { MUSCLE_LABELS, exerciseById, exerciseName } from '@/data/catalog'
import { base } from '@/db/util'
import { formatDuration } from '@/lib/format'
import { useUiStore } from '@/stores/ui.store'
import { cn } from '@/lib/cn'
import type { LoggedSession } from '@/db/engineTypes'

export default function ActiveWorkoutScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const locale = useUiStore((s) => s.locale)
  const user = useUser()
  const store = useActiveWorkout()
  const { status, startedAt, currentIndex, exercises, restEndsAt } = store
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (restEndsAt && now >= restEndsAt) store.clearRest()
  }, [now, restEndsAt, store])

  if (status !== 'active' || exercises.length === 0) {
    return (
      <div className="grid h-full place-items-center px-6 text-center text-muted">
        <div>
          <p>{t('active.noWorkout')}</p>
          <Button className="mt-4" onClick={() => navigate('/workout/build')}>
            {t('builder.title')}
          </Button>
        </div>
      </div>
    )
  }

  const elapsed = startedAt ? Math.floor((now - startedAt) / 1000) : 0
  const restRemain = restEndsAt ? Math.max(0, Math.ceil((restEndsAt - now) / 1000)) : 0
  const ex = exercises[currentIndex]
  const cat = exerciseById(ex.exerciseId)

  const finish = async () => {
    if (!user) return
    let totalVolume = 0
    let totalSets = 0
    exercises.forEach((e) =>
      e.sets.forEach((s) => {
        if (s.completed) {
          totalSets++
          totalVolume += (s.reps || 0) * (s.weight || 0)
        }
      }),
    )
    const session: LoggedSession = {
      ...base(),
      userId: user.id,
      startedAt: startedAt ?? Date.now(),
      endedAt: Date.now(),
      durationSeconds: elapsed,
      muscles: store.muscles,
      exercises: exercises.map((e) => ({ exerciseId: e.exerciseId, order: e.order, sets: e.sets })),
      totalVolume,
      totalSets,
    }
    await saveLoggedSession(session)
    await incrementToday(user.id, 'calories', Math.max(1, Math.round((elapsed / 60) * 6)), 'kcal')
    await incrementToday(user.id, 'activeMinutes', Math.max(1, Math.round(elapsed / 60)), 'min')
    store.discard()
    navigate('/workout/history', { replace: true })
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-start justify-between px-5 pt-safe-t">
        <button
          onClick={() => {
            store.discard()
            navigate('/home')
          }}
          aria-label={t('active.discard')}
          className="mt-3 grid h-10 w-10 place-items-center rounded-2xl bg-surface"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="mt-3 text-center">
          <div className="text-3xl font-black tabular leading-none">{formatDuration(elapsed)}</div>
          <div className="mt-1 text-xs text-muted">{t('active.progress', { n: currentIndex + 1, total: exercises.length })}</div>
        </div>
        <div className="mt-3 w-10" />
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 py-4">
        <h1 className="text-xl font-extrabold">{cat ? exerciseName(cat, locale) : ex.exerciseId}</h1>
        {cat && <p className="text-sm text-muted">{MUSCLE_LABELS[cat.primaryMuscle][locale]}</p>}

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-3 px-2 text-xs text-muted">
            <span className="w-8">{t('active.set')}</span>
            <span className="flex-1 text-center">{t('active.reps')}</span>
            <span className="flex-1 text-center">{t('active.kg')}</span>
            <span className="w-10" />
          </div>
          {ex.sets.map((s, i) => (
            <div key={i} className={cn('flex items-center gap-3 rounded-2xl p-2', s.completed ? 'bg-success/15' : 'bg-surface')}>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-2 text-sm font-bold">{i + 1}</span>
              <input
                type="number"
                inputMode="numeric"
                value={s.reps ?? ''}
                onChange={(e) => store.updateSet(currentIndex, i, { reps: e.target.value === '' ? undefined : Number(e.target.value) })}
                className="h-10 w-full flex-1 rounded-xl bg-surface-2 text-center outline-none focus:ring-2 focus:ring-primary/60"
              />
              <input
                type="number"
                inputMode="decimal"
                value={s.weight ?? ''}
                onChange={(e) => store.updateSet(currentIndex, i, { weight: e.target.value === '' ? undefined : Number(e.target.value) })}
                className="h-10 w-full flex-1 rounded-xl bg-surface-2 text-center outline-none focus:ring-2 focus:ring-primary/60"
              />
              <button
                onClick={() => store.toggleSetComplete(currentIndex, i)}
                aria-label="complete set"
                className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl', s.completed ? 'bg-success text-success-fg' : 'bg-surface-2 text-muted')}
              >
                <Check className="h-5 w-5" />
              </button>
            </div>
          ))}
          <button
            onClick={() => store.addSet(currentIndex)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-2.5 text-sm text-muted"
          >
            <Plus className="h-4 w-4" />
            {t('active.addSet')}
          </button>
        </div>

        <div className="mt-5">
          {restRemain > 0 ? (
            <div className="flex items-center justify-between rounded-2xl bg-secondary/15 px-4 py-3 text-secondary">
              <span className="flex items-center gap-2 font-semibold">
                <Timer className="h-4 w-4" />
                {t('active.restActive', { s: restRemain })}
              </span>
              <button onClick={() => store.clearRest()} className="text-sm font-semibold">
                ✕
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              {[60, 90, 120].map((sec) => (
                <button
                  key={sec}
                  onClick={() => store.startRest(sec)}
                  className="flex-1 rounded-2xl bg-surface-2 py-2.5 text-sm font-semibold text-muted"
                >
                  {t('active.rest')} {sec}s
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border bg-bg p-4 pb-safe-b">
        <div className="flex items-center gap-3">
          <button
            disabled={currentIndex === 0}
            onClick={() => store.goTo(currentIndex - 1)}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-surface-2 disabled:opacity-30"
            aria-label="previous"
          >
            <ChevronLeft className="h-5 w-5 rtl:-scale-x-100" />
          </button>
          {currentIndex < exercises.length - 1 ? (
            <Button block onClick={() => store.goTo(currentIndex + 1)}>
              {t('common.next')}
              <ChevronRight className="h-4 w-4 rtl:-scale-x-100" />
            </Button>
          ) : (
            <Button block variant="primary" onClick={finish}>
              {t('active.finish')}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
