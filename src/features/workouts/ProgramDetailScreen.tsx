import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Clock, FileText, Flame, Layers, type LucideIcon } from 'lucide-react'
import { AppBar } from '@/components/ui/AppBar'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useExercises, useProgram } from '@/data/hooks/useWorkouts'
import { useTrainer } from '@/data/hooks/useTrainers'
import { useUser } from '@/data/hooks/useUser'
import { startSession } from '@/db/repositories/workoutRepo'
import { useSessionStore } from '@/stores/session.store'
import { categoryGradient } from '@/lib/gradients'
import { cn } from '@/lib/cn'

function Stat({ icon: Icon, value, label }: { icon: LucideIcon; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-surface p-3">
      <Icon className="h-5 w-5 text-primary" />
      <span className="text-lg font-extrabold tabular">{value}</span>
      <span className="text-xs text-muted">{label}</span>
    </div>
  )
}

export default function ProgramDetailScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const program = useProgram(id)
  const exercises = useExercises(id) ?? []
  const trainer = useTrainer(program?.trainerId)
  const user = useUser()
  const startLive = useSessionStore((s) => s.start)

  if (!program) return null

  const onStart = async () => {
    if (!user) return
    const session = await startSession(user.id, program.title, program.id)
    startLive(session.id, program.title)
    navigate('/session/live')
  }

  return (
    <div className="flex h-full flex-col">
      <div className="no-scrollbar flex-1 overflow-y-auto">
        <div className={cn('relative h-72 bg-gradient-to-br', categoryGradient(program.category))}>
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
          <AppBar transparent title="" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <Badge tone="primary">
              {program.totalExercises} {t('workouts.total')}
            </Badge>
            <h1 className="mt-2 text-3xl font-black">{program.title}</h1>
            {trainer && <p className="text-foreground/70">{t('workouts.withTrainer', { name: trainer.name })}</p>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 px-5 py-5">
          <Stat icon={Clock} value={`${program.durationMin}`} label={t('workouts.time')} />
          <Stat icon={Flame} value={`${program.calories}`} label={t('workouts.calorie')} />
          <Stat icon={Layers} value={`${program.sets || program.totalExercises}`} label={t('workouts.sets')} />
        </div>

        <div className="space-y-2 px-5 pb-4">
          {exercises.map((e, i) => (
            <div key={e.id} className="flex items-center gap-3 rounded-2xl bg-surface p-3">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-surface-2 text-sm font-bold">{i + 1}</span>
              <span className="flex-1 font-medium">{e.name}</span>
              <span className="text-sm text-muted tabular">
                {e.sets}×{e.reps}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border bg-bg p-4 pb-safe-b">
        <div className="flex gap-3">
          <Button variant="surface" className="flex-1">
            <FileText className="h-4 w-4" />
            {t('workouts.details')}
          </Button>
          <Button variant="primary" className="flex-[2]" onClick={onStart}>
            {t('workouts.start')}
          </Button>
        </div>
      </div>
    </div>
  )
}
