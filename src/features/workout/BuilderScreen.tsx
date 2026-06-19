import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Check, Dumbbell, Plus } from 'lucide-react'
import { AppBar } from '@/components/ui/AppBar'
import { Button } from '@/components/ui/Button'
import {
  EQUIPMENT_LABELS,
  EQUIPMENT_LIST,
  MUSCLE_GROUPS,
  MUSCLE_LABELS,
  exerciseById,
  exerciseName,
  filterExercises,
} from '@/data/catalog'
import { useBuilderStore } from '@/stores/builder.store'
import { useActiveWorkout } from '@/stores/activeWorkout.store'
import { useUiStore } from '@/stores/ui.store'
import { cn } from '@/lib/cn'

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full px-3.5 py-2 text-sm font-semibold transition-colors',
        active ? 'bg-primary text-primary-fg' : 'bg-surface-2 text-muted',
      )}
    >
      {children}
    </button>
  )
}

export default function BuilderScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const locale = useUiStore((s) => s.locale)
  const { equipment, muscles, selected, toggleEquipment, toggleMuscle, toggleExercise } = useBuilderStore()
  const start = useActiveWorkout((s) => s.start)

  const results = filterExercises(equipment, muscles)

  const onStart = () => {
    if (selected.length === 0) return
    const ms = Array.from(
      new Set(
        selected.flatMap((id) => {
          const e = exerciseById(id)
          return e ? [e.primaryMuscle, ...e.secondaryMuscles] : []
        }),
      ),
    )
    start(selected, ms)
    navigate('/workout/active')
  }

  return (
    <div className="flex h-full flex-col">
      <div className="no-scrollbar flex-1 overflow-y-auto">
        <AppBar title={t('builder.title')} />
        <div className="space-y-5 px-5 pb-4">
          <section>
            <h2 className="mb-2 text-sm font-bold text-muted">{t('builder.equipment')}</h2>
            <div className="flex flex-wrap gap-2">
              {EQUIPMENT_LIST.map((e) => (
                <Chip key={e} active={equipment.includes(e)} onClick={() => toggleEquipment(e)}>
                  {EQUIPMENT_LABELS[e][locale]}
                </Chip>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-2 text-sm font-bold text-muted">{t('builder.muscles')}</h2>
            <div className="flex flex-wrap gap-2">
              {MUSCLE_GROUPS.map((m) => (
                <Chip key={m} active={muscles.includes(m)} onClick={() => toggleMuscle(m)}>
                  {MUSCLE_LABELS[m][locale]}
                </Chip>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-2 text-sm font-bold text-muted">
              {t('builder.exercises')} · {results.length}
            </h2>
            {results.length === 0 && <p className="text-sm text-muted">{t('builder.noResults')}</p>}
            <div className="space-y-2">
              {results.map((e) => {
                const on = selected.includes(e.id)
                return (
                  <button
                    key={e.id}
                    onClick={() => toggleExercise(e.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-2xl p-3 text-start transition-colors',
                      on ? 'bg-primary/15 ring-1 ring-primary' : 'bg-surface',
                    )}
                  >
                    <span
                      className={cn(
                        'grid h-9 w-9 shrink-0 place-items-center rounded-xl',
                        on ? 'bg-primary text-primary-fg' : 'bg-surface-2 text-muted',
                      )}
                    >
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
          </section>
        </div>
      </div>

      <div className="border-t border-border bg-bg p-4 pb-safe-b">
        <Button block disabled={selected.length === 0} onClick={onStart}>
          <Dumbbell className="h-4 w-4" />
          {t('builder.start')} · {t('builder.selected', { n: selected.length })}
        </Button>
      </div>
    </div>
  )
}
