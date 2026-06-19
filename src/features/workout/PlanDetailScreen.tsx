import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, Play } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { LEVEL_LABELS, type PlanSession, planById, planName, sessionName } from '@/data/programs'
import { exerciseById } from '@/data/catalog'
import { useActiveWorkout } from '@/stores/activeWorkout.store'
import { useUiStore } from '@/stores/ui.store'

export default function PlanDetailScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const locale = useUiStore((s) => s.locale)
  const start = useActiveWorkout((s) => s.start)
  const plan = planById(id ?? '')
  if (!plan) return null

  const startSession = (s: PlanSession) => {
    const ms = Array.from(
      new Set(
        s.exerciseIds.flatMap((eid) => {
          const e = exerciseById(eid)
          return e ? [e.primaryMuscle, ...e.secondaryMuscles] : []
        }),
      ),
    )
    start(s.exerciseIds, ms)
    navigate('/workout/active')
  }

  return (
    <div className="flex h-full flex-col">
      <div className="no-scrollbar flex-1 overflow-y-auto pb-6">
        <div className="relative h-64 overflow-hidden">
          <img src={plan.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="absolute start-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-bg/70 backdrop-blur"
            style={{ top: 'calc(env(safe-area-inset-top) + 0.75rem)' }}
          >
            <ChevronLeft className="h-5 w-5 rtl:-scale-x-100" />
          </button>
          <div className="absolute inset-x-0 bottom-0 p-5">
            <div className="flex gap-2">
              <Badge tone="primary">{t('plans.weeks', { n: plan.weeks })}</Badge>
              <Badge tone="neutral">{LEVEL_LABELS[plan.level][locale]}</Badge>
            </div>
            <h1 className="mt-2 text-3xl font-black">{planName(plan, locale)}</h1>
            <p className="text-sm text-foreground/70">{locale === 'he' ? plan.descHe : plan.descEn}</p>
          </div>
        </div>

        <div className="space-y-5 px-5 py-4">
          {Array.from({ length: plan.weeks }, (_, w) => (
            <div key={w}>
              <h2 className="mb-2 text-sm font-bold text-muted">{t('plans.week', { n: w + 1 })}</h2>
              <div className="space-y-2">
                {plan.week.map((s) => (
                  <button
                    key={`${s.id}-${w}`}
                    onClick={() => startSession(s)}
                    className="flex w-full items-center gap-3 rounded-2xl bg-surface p-3 text-start transition-transform active:scale-[0.99]"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                      <Play className="h-5 w-5 fill-current" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold">{sessionName(s, locale)}</div>
                      <div className="text-xs text-muted">
                        {s.exerciseIds.length} {t('plans.exercises')}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
