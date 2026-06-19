import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Clock, Dumbbell, Flame, Layers } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { heroForCategory } from '@/assets/img'
import type { WorkoutProgram } from '@/db/types'

const intensityTone = { intense: 'primary', moderate: 'secondary', light: 'neutral' } as const

export function ProgramCard({ program, trainerName }: { program: WorkoutProgram; trainerName?: string }) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <Card interactive onClick={() => navigate(`/workouts/${program.id}`)} className="flex items-center gap-4 p-3">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
        <img src={heroForCategory(program.category)} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-bold">{program.title}</h3>
        <p className="truncate text-xs text-muted">
          {trainerName ? t('workouts.withTrainer', { name: trainerName }) : t(`intensity.${program.intensity}`)}
        </p>
        <div className="mt-2 flex items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {program.durationMin} {t('metrics.units.min')}
          </span>
          <span className="flex items-center gap-1">
            <Flame className="h-3.5 w-3.5" />
            {program.calories}
          </span>
          <span className="flex items-center gap-1">
            <Layers className="h-3.5 w-3.5" />
            {program.totalExercises}
          </span>
        </div>
      </div>
      <Badge tone={intensityTone[program.intensity]}>{t(`intensity.${program.intensity}`)}</Badge>
    </Card>
  )
}
