import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Cable, Check, ChevronLeft, ChevronRight, Cog, Dumbbell, PersonStanding, Plus, Search, Shuffle, X, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { MuscleMap } from '@/components/workouts/MuscleMap'
import {
  EQUIPMENT_LABELS,
  EQUIPMENT_LIST,
  MUSCLE_LABELS,
  type Equipment,
  exerciseById,
  exerciseName,
  filterExercises,
} from '@/data/catalog'
import { useBuilderStore } from '@/stores/builder.store'
import { useActiveWorkout } from '@/stores/activeWorkout.store'
import { useUiStore } from '@/stores/ui.store'
import { cn } from '@/lib/cn'

const EQUIP_ICON: Record<Equipment, LucideIcon> = {
  barbell: Dumbbell,
  dumbbell: Dumbbell,
  machine: Cog,
  cable: Cable,
  bodyweight: PersonStanding,
  kettlebell: Dumbbell,
  bands: Cable,
  ezBar: Dumbbell,
}

export default function BuilderScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const locale = useUiStore((s) => s.locale)
  const { equipment, muscles, selected, toggleEquipment, toggleMuscle, toggleExercise, setSelected } = useBuilderStore()
  const start = useActiveWorkout((s) => s.start)
  const [step, setStep] = useState(0)
  const [q, setQ] = useState('')

  const results = filterExercises(equipment, muscles)
  const shown = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return results
    return results.filter((e) => e.nameHe.includes(q.trim()) || e.nameEn.toLowerCase().includes(query))
  }, [results, q])
  const stepLabels = [t('builder.equipment'), t('builder.muscles'), t('builder.exercises')]

  const autoBuild = () => {
    const ids = [...results].sort(() => Math.random() - 0.5).slice(0, 5).map((e) => e.id)
    setSelected(ids)
  }

  const onStart = () => {
    if (selected.length === 0) return
    const ms = Array.from(
      new Set(selected.flatMap((id) => {
        const e = exerciseById(id)
        return e ? [e.primaryMuscle, ...e.secondaryMuscles] : []
      })),
    )
    start(selected, ms)
    navigate('/workout/active')
  }

  const back = () => (step > 0 ? setStep(step - 1) : navigate(-1))

  return (
    <div className="flex h-full flex-col">
      <header className="px-5 pt-safe-t">
        <div className="flex items-center gap-2 pt-3">
          <button onClick={back} aria-label={t('builder.back')} className="grid h-10 w-10 -ms-2 place-items-center rounded-2xl hover:bg-surface-2">
            <ChevronLeft className="h-6 w-6 rtl:-scale-x-100" />
          </button>
          <h1 className="text-lg font-bold">{t('builder.title')}</h1>
        </div>
        <div className="mt-3 flex gap-2">
          {stepLabels.map((label, i) => (
            <button key={i} onClick={() => i < step && setStep(i)} className="flex flex-1 flex-col gap-1.5 text-start">
              <div className={cn('h-1.5 rounded-full transition-colors', i <= step ? 'bg-primary' : 'bg-surface-2')} />
              <span className={cn('text-xs', i === step ? 'font-semibold text-foreground' : 'text-muted')}>{label}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 py-4">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
            {step === 0 && (
              <div>
                <p className="mb-3 text-muted">{t('builder.chooseEquipment')}</p>
                <div className="grid grid-cols-3 gap-3">
                  {EQUIPMENT_LIST.map((e) => {
                    const Icon = EQUIP_ICON[e]
                    const on = equipment.includes(e)
                    return (
                      <button
                        key={e}
                        onClick={() => toggleEquipment(e)}
                        className={cn(
                          'flex flex-col items-center gap-2 rounded-2xl p-4 transition-all active:scale-95',
                          on ? 'bg-primary/15 ring-2 ring-primary' : 'bg-surface',
                        )}
                      >
                        <Icon className={cn('h-7 w-7', on ? 'text-primary' : 'text-muted')} />
                        <span className="text-center text-xs font-semibold leading-tight">{EQUIPMENT_LABELS[e][locale]}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <p className="mb-2 text-center text-muted">{t('builder.tapMuscles')}</p>
                <MuscleMap selected={muscles} onToggle={toggleMuscle} />
                {muscles.length > 0 && (
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {muscles.map((m) => (
                      <button
                        key={m}
                        onClick={() => toggleMuscle(m)}
                        className="flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1.5 text-sm font-semibold text-primary"
                      >
                        {MUSCLE_LABELS[m][locale]}
                        <X className="h-3.5 w-3.5" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="relative mb-3">
                  <Search className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted" style={{ insetInlineStart: '0.85rem' }} />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={t('builder.search')}
                    className="h-11 w-full rounded-2xl bg-surface ps-10 pe-4 text-sm outline-none placeholder:text-muted-2 focus:ring-2 focus:ring-primary/60"
                  />
                </div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-muted">
                    {shown.length} {t('builder.exercises')}
                  </span>
                  <button onClick={autoBuild} className="flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-sm font-semibold text-primary active:scale-95">
                    <Shuffle className="h-4 w-4" />
                    {t('builder.shuffle')}
                  </button>
                </div>
                {shown.length === 0 && <p className="text-sm text-muted">{t('builder.noResults')}</p>}
                <div className="space-y-2">
                  {shown.map((e) => {
                    const on = selected.includes(e.id)
                    return (
                      <button
                        key={e.id}
                        onClick={() => toggleExercise(e.id)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-2xl p-3 text-start transition-all active:scale-[0.99]',
                          on ? 'bg-primary/15 ring-1 ring-primary' : 'bg-surface',
                        )}
                      >
                        <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl', on ? 'bg-primary text-primary-fg' : 'bg-surface-2 text-muted')}>
                          {on ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-semibold">{exerciseName(e, locale)}</div>
                          <div className="text-xs text-muted">
                            {MUSCLE_LABELS[e.primaryMuscle][locale]} · {EQUIPMENT_LABELS[e.equipment][locale]}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
        </motion.div>
      </div>

      <div className="border-t border-border bg-bg p-4 pb-safe-b">
        {step < 2 ? (
          <Button block onClick={() => setStep(step + 1)}>
            {t('builder.next')}
            <ChevronRight className="h-4 w-4 rtl:-scale-x-100" />
          </Button>
        ) : (
          <Button block disabled={selected.length === 0} onClick={onStart}>
            <Dumbbell className="h-4 w-4" />
            {t('builder.start')} · {t('builder.selected', { n: selected.length })}
          </Button>
        )}
      </div>
    </div>
  )
}
