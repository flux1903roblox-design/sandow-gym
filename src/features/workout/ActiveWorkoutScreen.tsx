import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronLeft, ChevronRight, Minus, Plus, Timer, X } from 'lucide-react'
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

const REP_DEFAULT = 10
const WEIGHT_DEFAULT = 20
const REST_SECONDS = 90

function Stepper({ value, onChange, step }: { value: number; onChange: (v: number) => void; step: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => onChange(Math.max(0, Math.round((value - step) * 10) / 10))}
        className="grid h-9 w-9 place-items-center rounded-full bg-surface-2 active:scale-90"
        aria-label="decrease"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-11 text-center text-xl font-extrabold tabular">{value}</span>
      <button
        onClick={() => onChange(Math.round((value + step) * 10) / 10)}
        className="grid h-9 w-9 place-items-center rounded-full bg-surface-2 active:scale-90"
        aria-label="increase"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}

export default function ActiveWorkoutScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const locale = useUiStore((s) => s.locale)
  const user = useUser()
  const store = useActiveWorkout()
  const { status, startedAt, currentIndex, exercises, restEndsAt, restSeconds } = store
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

  const onComplete = (i: number) => {
    const wasDone = ex.sets[i].completed
    store.toggleSetComplete(currentIndex, i)
    if (!wasDone) {
      store.startRest(REST_SECONDS)
      const next = ex.sets[i + 1]
      if (next && next.reps == null) {
        store.updateSet(currentIndex, i + 1, {
          reps: ex.sets[i].reps ?? REP_DEFAULT,
          weight: ex.sets[i].weight ?? WEIGHT_DEFAULT,
        })
      }
    }
  }

  const finish = async () => {
    if (!user) return
    let totalVolume = 0
    let totalSets = 0
    exercises.forEach((e) =>
      e.sets.forEach((s) => {
        if (s.completed) {
          totalSets++
          totalVolume += (s.reps ?? 0) * (s.weight ?? 0)
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

  const completedSets = ex.sets.filter((s) => s.completed).length

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
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
            <div className="flex items-baseline justify-between">
              <h1 className="text-xl font-extrabold">{cat ? exerciseName(cat, locale) : ex.exerciseId}</h1>
              <span className="text-sm text-muted tabular">
                {completedSets}/{ex.sets.length}
              </span>
            </div>
            {cat && <p className="text-sm text-muted">{MUSCLE_LABELS[cat.primaryMuscle][locale]}</p>}

            <div className="mt-4 space-y-2.5">
              {ex.sets.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={cn(
                    'flex items-center gap-2 rounded-2xl p-2.5 transition-colors',
                    s.completed ? 'bg-success/15 ring-1 ring-success/40' : 'bg-surface',
                  )}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-2 text-sm font-bold">{i + 1}</span>
                  <div className="flex flex-1 flex-col items-center gap-0.5">
                    <span className="text-[10px] uppercase tracking-wide text-muted">{t('active.reps')}</span>
                    <Stepper value={s.reps ?? REP_DEFAULT} step={1} onChange={(v) => store.updateSet(currentIndex, i, { reps: v })} />
                  </div>
                  <div className="flex flex-1 flex-col items-center gap-0.5">
                    <span className="text-[10px] uppercase tracking-wide text-muted">{t('active.kg')}</span>
                    <Stepper value={s.weight ?? WEIGHT_DEFAULT} step={2.5} onChange={(v) => store.updateSet(currentIndex, i, { weight: v })} />
                  </div>
                  <button
                    onClick={() => onComplete(i)}
                    aria-label="complete set"
                    className={cn(
                      'grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-transform active:scale-90',
                      s.completed ? 'bg-success text-success-fg' : 'bg-surface-2 text-muted',
                    )}
                  >
                    <Check className="h-5 w-5" />
                  </button>
                </motion.div>
              ))}
              <button
                onClick={() => store.addSet(currentIndex)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-2.5 text-sm text-muted"
              >
                <Plus className="h-4 w-4" />
                {t('active.addSet')}
              </button>
            </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {restRemain > 0 && (
          <motion.div
            initial={{ y: 70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 70, opacity: 0 }}
            className="mx-4 mb-2 rounded-2xl bg-secondary p-4 text-white shadow-glow-blue"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold">
                <Timer className="h-4 w-4" />
                {t('active.rest')}
              </span>
              <span className="text-2xl font-black tabular">{restRemain}s</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/25">
              <div className="h-full rounded-full bg-white transition-all duration-1000 ease-linear" style={{ width: `${(restRemain / (restSeconds || REST_SECONDS)) * 100}%` }} />
            </div>
            <div className="mt-2.5 flex gap-2">
              <button onClick={() => store.addRestTime(15)} className="flex-1 rounded-xl bg-white/20 py-1.5 text-sm font-semibold">
                {t('active.plus15')}
              </button>
              <button onClick={() => store.clearRest()} className="flex-1 rounded-xl bg-white/20 py-1.5 text-sm font-semibold">
                {t('active.skip')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              {t('active.nextExercise')}
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
