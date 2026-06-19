import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Scale, Settings } from 'lucide-react'
import { AppBar } from '@/components/ui/AppBar'
import { useUser } from '@/data/hooks/useUser'
import { bmiCategory } from '@/lib/format'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'

export default function BmiScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useUser()
  if (!user) return null

  const bmi = user.bmi
  const cat = bmiCategory(bmi)
  // Map BMI 15..40 onto 0..100% for the marker.
  const pct = Math.max(0, Math.min(100, ((bmi - 15) / (40 - 15)) * 100))

  return (
    <div className="min-h-full">
      <AppBar
        title={t('bmi.title')}
        end={
          <button onClick={() => navigate('/settings')} aria-label="Settings" className="grid h-11 w-11 place-items-center rounded-2xl hover:bg-surface-2">
            <Settings className="h-5 w-5" />
          </button>
        }
      />
      <div className="flex flex-col items-center px-6 pt-10">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-surface text-muted">
          <Scale className="h-7 w-7" />
        </span>
        <div className="mt-6 flex items-baseline gap-2">
          <AnimatedNumber value={bmi} format={(n) => n.toFixed(1)} className="text-7xl font-black tabular leading-none" />
          <span className="text-2xl font-bold text-muted">{t('metrics.units.pt')}</span>
        </div>
        <p className="mt-3 text-lg text-muted">{t(`bmi.status.${cat.key}`)}</p>

        <div className="mt-10 w-full">
          <div className="relative h-3 w-full rounded-full bg-gradient-to-r from-secondary via-success to-destructive" />
          <div className="relative">
            <div
              className="absolute -top-1.5 h-6 w-1.5 -translate-x-1/2 rounded-full bg-foreground shadow"
              style={{ insetInlineStart: `${pct}%` }}
            />
          </div>
          <div className="mt-4 flex justify-between text-[11px] text-muted-2">
            <span>15</span>
            <span>18.5</span>
            <span>25</span>
            <span>30</span>
            <span>40</span>
          </div>
        </div>
      </div>
    </div>
  )
}
