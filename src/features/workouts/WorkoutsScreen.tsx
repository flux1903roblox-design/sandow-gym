import { useTranslation } from 'react-i18next'
import { AppBar } from '@/components/ui/AppBar'
import { ProgramCard } from '@/components/workouts/ProgramCard'
import { usePrograms } from '@/data/hooks/useWorkouts'
import { useTrainers } from '@/data/hooks/useTrainers'

export default function WorkoutsScreen() {
  const { t } = useTranslation()
  const programs = usePrograms() ?? []
  const trainers = useTrainers() ?? []
  const name = (id: string) => trainers.find((x) => x.id === id)?.name

  return (
    <div className="min-h-full">
      <AppBar title={t('workouts.title')} back={false} />
      <div className="space-y-3 px-5 pb-6">
        {programs.map((p) => (
          <ProgramCard key={p.id} program={p} trainerName={name(p.trainerId)} />
        ))}
      </div>
    </div>
  )
}
