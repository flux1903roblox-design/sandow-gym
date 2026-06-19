import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CalendarPlus, Heart, Phone, Star } from 'lucide-react'
import { AppBar } from '@/components/ui/AppBar'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { useTrainer, useReviews } from '@/data/hooks/useTrainers'
import { TRAINER_PHOTO } from '@/assets/img'
import { timeAgo } from '@/lib/date'
import { useUiStore } from '@/stores/ui.store'

export default function TrainerProfileScreen() {
  const { id } = useParams()
  const { t } = useTranslation()
  const locale = useUiStore((s) => s.locale)
  const trainer = useTrainer(id)
  const reviews = useReviews(id) ?? []

  if (!trainer) return null

  const stats = [
    { value: t('trainers.years', { n: trainer.experienceYears }), label: t('trainers.experience') },
    { value: `${trainer.clients}+`, label: t('trainers.clients') },
    { value: `${trainer.rating}`, label: t('trainers.rating') },
  ]

  return (
    <div className="min-h-full pb-8">
      <AppBar title="" />
      <div className="flex flex-col items-center px-5">
        <Avatar name={trainer.name} src={trainer.name === 'Farnese Vandimion' ? TRAINER_PHOTO : undefined} size="xl" />
        <h1 className="mt-4 flex items-center gap-2 text-2xl font-black">{trainer.name}</h1>
        <div className="mt-2 flex gap-2">
          {trainer.tags.map((tag) => (
            <Badge key={tag} tone="primary">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-5 flex gap-3">
          <button className="grid h-12 w-12 place-items-center rounded-2xl bg-surface-2 active:scale-95" aria-label="Favorite">
            <Heart className="h-5 w-5" />
          </button>
          <button className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-fg shadow-glow active:scale-95" aria-label="Call">
            <Phone className="h-5 w-5" />
          </button>
          <button className="grid h-12 w-12 place-items-center rounded-2xl bg-surface-2 active:scale-95" aria-label="Book">
            <CalendarPlus className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 grid w-full grid-cols-3 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1 rounded-2xl bg-surface p-3">
              <span className="text-lg font-extrabold tabular">{s.value}</span>
              <span className="text-xs text-muted">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between px-5">
        <h2 className="text-lg font-extrabold">{t('trainers.reviews')}</h2>
        <button className="text-sm font-semibold text-primary">{t('common.seeAll')}</button>
      </div>
      <div className="mt-3 space-y-3 px-5">
        {reviews.map((r) => (
          <Card key={r.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={r.authorName} size="sm" />
                <span className="font-semibold">{r.authorName}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted">
                <span className="flex items-center gap-1 text-warning">
                  <Star className="h-3.5 w-3.5 fill-warning" />
                  {r.rating}
                </span>
                <span>{timeAgo(r.createdAt, locale)}</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted">{r.text}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
