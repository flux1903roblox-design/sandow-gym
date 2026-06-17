import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Camera, X } from 'lucide-react'
import { useCamera } from '@/platform/camera/useCamera'
import { useUser } from '@/data/hooks/useUser'
import { addFoodScan } from '@/db/repositories/nutritionRepo'
import { cn } from '@/lib/cn'

const MOCK_RESULTS = [
  { name: 'Fresh Orange', calories: 62, macros: { protein: 1, carbs: 15, fat: 0 } },
  { name: 'Grilled Chicken Salad', calories: 340, macros: { protein: 38, carbs: 12, fat: 16 } },
  { name: 'Avocado Toast', calories: 290, macros: { protein: 8, carbs: 30, fat: 16 } },
]

export default function FoodScanScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const user = useUser()
  const { videoRef, state, start, capture } = useCamera()
  const [scanning, setScanning] = useState(false)

  const onCapture = async () => {
    if (scanning || !user) return
    setScanning(true)
    const img = capture()
    const pick = MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)]
    await new Promise((r) => setTimeout(r, 1600))
    await addFoodScan(user.id, pick.name, pick.calories, pick.macros, img)
    setScanning(false)
    navigate('/scan/result', { replace: true })
  }

  const active = state === 'active'

  return (
    <div className="relative h-full bg-black text-white">
      {active ? (
        <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-surface-2 to-black" />
      )}

      <div className="absolute inset-0 flex flex-col">
        <div className="flex items-center justify-between p-4 pt-safe-t">
          <button onClick={() => navigate(-1)} className="grid h-10 w-10 place-items-center rounded-full bg-black/40" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
          {scanning && (
            <span className="animate-pulse rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-fg">
              {t('scan.scanning')}
            </span>
          )}
          <span className="w-10" />
        </div>

        <div className="flex flex-1 items-center justify-center p-10">
          <div className={cn('relative h-64 w-64 overflow-hidden rounded-3xl border-2', scanning ? 'border-primary' : 'border-white/40')}>
            {scanning && <div className="absolute inset-x-0 top-0 h-1 animate-pulse bg-primary" />}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 p-6 pb-safe-b">
          {!active && state !== 'requesting' && (
            <button onClick={start} className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
              {t('scan.enableCamera')}
            </button>
          )}
          <button
            onClick={onCapture}
            disabled={scanning}
            aria-label={t('scan.capture')}
            className="grid h-[72px] w-[72px] place-items-center rounded-full bg-white text-black ring-4 ring-white/30 transition-transform active:scale-95 disabled:opacity-60"
          >
            <Camera className="h-7 w-7" />
          </button>
        </div>
      </div>
    </div>
  )
}
