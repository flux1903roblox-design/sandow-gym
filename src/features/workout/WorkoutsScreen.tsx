import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Dumbbell, History } from 'lucide-react'
import { AppBar } from '@/components/ui/AppBar'
import { Button } from '@/components/ui/Button'
import { ProgramCard } from '@/components/workouts/ProgramCard'
import { usePrograms } from '@/data/hooks/useWorkouts'
import { useTrainers } from '@/data/hooks/useTrainers'

export default function WorkoutsScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const programs = usePrograms() ?? []
  const trainers = useTrainers() ?? []
  const name = (id: string) => trainers.find((x) => x.id === id)?.name

  return (
    <div className="min-h-full">
      <AppBar title={t('workouts.title')} back={false} />
      <div className="flex gap-3 px-5 pb-3">
        <Button block onClick={() => navigate('/workout/build')}>
          <Dumbbell className="h-4 w-4" />
          {t('builder.title')}
        </Button>
        <Button variant="surface" onClick={() => navigate('/workout/history')} aria-label={t('history.title')}>
          <History className="h-5 w-5" />
        </Button>
      </div>
      <div className="space-y-3 px-5 pb-6">
        {programs.map((p) => (
          <ProgramCard key={p.id} program={p} trainerName={name(p.trainerId)} />
        ))}
      </div>
    </div>
  )
}
