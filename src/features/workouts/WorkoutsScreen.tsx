import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Dumbbell, History } from 'lucide-react'
import { AppBar } from '@/components/ui/AppBar'
import { Button } from '@/components/ui/Button'
import { ProgramCard } from '@/components/workouts/ProgramCard'
import { usePrograms } from '@/data/hooks/useWorkouts'
import { useTrainers } from '@/data/hooks/useTrainers'
import { LEVEL_LABELS, PLANS, planName } from '@/data/programs'
import { useUiStore } from '@/stores/ui.store'

export default function WorkoutsScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const locale = useUiStore((s) => s.locale)
  const programs = usePrograms() ?? []
  const trainers = useTrainers() ?? []
  const name = (id: string) => trainers.find((x) => x.id === id)?.name

  return (
    <div className="min-h-full">
      <AppBar title={t('workouts.title')} back={false} />
      <div className="flex gap-3 px-5 pb-4">
        <Button block onClick={() => navigate('/workout/build')}>
          <Dumbbell className="h-4 w-4" />
          {t('builder.title')}
        </Button>
        <Button variant="surface" onClick={() => navigate('/workout/history')} aria-label={t('history.title')}>
          <History className="h-5 w-5" />
        </Button>
      </div>

      {/* Guided multi-week training plans */}
      <h2 className="px-5 pb-2 text-lg font-bold">{t('plans.title')}</h2>
      <div className="no-scrollbar mb-6 flex gap-3 overflow-x-auto px-5 pb-1">
        {PLANS.map((p) => (
          <button
            key={p.id}
            onClick={() => navigate(`/workout/plan/${p.id}`)}
            className="relative h-44 w-64 shrink-0 overflow-hidden rounded-card text-start shadow-card transition-transform active:scale-[0.98]"
          >
            <img src={p.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <span className="absolute end-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-fg">
              {p.week.length} {t('plans.sessions')}
            </span>
            <div className="absolute inset-x-0 bottom-0 p-4">
              <div className="text-[11px] font-medium text-white/75">
                {t('plans.weeks', { n: p.weeks })} · {LEVEL_LABELS[p.level][locale]}
              </div>
              <div className="text-lg font-extrabold leading-tight text-white">{planName(p, locale)}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Single workouts */}
      <div className="space-y-3 px-5 pb-6">
        {programs.map((p) => (
          <ProgramCard key={p.id} program={p} trainerName={name(p.trainerId)} />
        ))}
      </div>
    </div>
  )
}
