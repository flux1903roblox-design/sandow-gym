import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Flame } from 'lucide-react'
import { AppBar } from '@/components/ui/AppBar'
import { Button } from '@/components/ui/Button'
import { useFoodScans } from '@/data/hooks/useNutrition'
import { formatInt } from '@/lib/format'
import { useUiStore } from '@/stores/ui.store'
import { cn } from '@/lib/cn'

export default function FoodResultScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const locale = useUiStore((s) => s.locale)
  const scans = useFoodScans() ?? []
  const scan = scans[0]
  if (!scan) return null

  const macros = [
    { label: t('scan.protein'), value: scan.macros.protein, color: 'bg-primary' },
    { label: t('scan.carbs'), value: scan.macros.carbs, color: 'bg-secondary' },
    { label: t('scan.fat'), value: scan.macros.fat, color: 'bg-success' },
  ]
  const maxMacro = Math.max(...macros.map((m) => m.value), 1)

  return (
    <div className="flex h-full flex-col">
      <div className="no-scrollbar flex-1 overflow-y-auto">
        <div className="relative h-64">
          {scan.imageDataUrl ? (
            <img src={scan.imageDataUrl} alt={scan.detectedName} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary to-orange-700" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent" />
          <AppBar transparent title="" />
        </div>

        <div className="relative -mt-10 px-5">
          <p className="text-xs uppercase tracking-wide text-muted">{t('scan.result')}</p>
          <h1 className="text-2xl font-black">{scan.detectedName}</h1>
          <div className="mt-2 flex items-center gap-2 text-primary">
            <Flame className="h-6 w-6" />
            <span className="text-3xl font-black tabular">{formatInt(scan.calories, locale)}</span>
            <span className="text-muted">{t('metrics.units.kcal')}</span>
          </div>

          <div className="mt-6 space-y-4">
            {macros.map((m) => (
              <div key={m.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{m.label}</span>
                  <span className="tabular text-muted">{m.value}g</span>
                </div>
                <div className="h-2 rounded-full bg-surface-2">
                  <div className={cn('h-full rounded-full', m.color)} style={{ width: `${(m.value / maxMacro) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border p-4 pb-safe-b">
        <Button block variant="primary" onClick={() => navigate('/home', { replace: true })}>
          {t('scan.addToDiary')}
        </Button>
      </div>
    </div>
  )
}
