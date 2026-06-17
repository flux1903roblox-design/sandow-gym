import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Star } from 'lucide-react'
import { AppBar } from '@/components/ui/AppBar'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { useTrainers } from '@/data/hooks/useTrainers'

export default function TrainersScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const trainers = useTrainers() ?? []

  return (
    <div className="min-h-full">
      <AppBar title={t('trainers.title')} />
      <div className="space-y-3 px-5 pb-6">
        {trainers.map((tr) => (
          <Card key={tr.id} interactive onClick={() => navigate(`/trainers/${tr.id}`)} className="flex items-center gap-4 p-4">
            <Avatar name={tr.name} size="lg" />
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-bold">{tr.name}</h3>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {tr.tags.map((tag) => (
                  <Badge key={tag} tone="neutral">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs text-muted">
                <span className="flex items-center gap-1 text-warning">
                  <Star className="h-3.5 w-3.5 fill-warning" />
                  {tr.rating}
                </span>
                <span>
                  {tr.clients} {t('trainers.clients')}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
