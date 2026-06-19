import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Activity, Droplet, Heart, Plus, Square, type LucideIcon } from 'lucide-react'
import { AppBar } from '@/components/ui/AppBar'
import { Button } from '@/components/ui/Button'
import { useSessionStore } from '@/stores/session.store'
import { useUser } from '@/data/hooks/useUser'
import { activeSession, completeSession, startSession } from '@/db/repositories/workoutRepo'
import { heroForActivity } from '@/assets/img'
import { formatDuration } from '@/lib/format'
import { cn } from '@/lib/cn'

function VitalsCard({ icon: Icon, label, value, unit }: { icon: LucideIcon; label: string; value: string; unit: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <div className="text-xs opacity-70">{label}</div>
        <div className="font-bold tabular">
          {value} <span className="text-xs font-normal opacity-70">{unit}</span>
        </div>
      </div>
    </div>
  )
}

export default function LiveSessionScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const user = useUser()
  const sessionId = useSessionStore((s) => s.sessionId)
  const activity = useSessionStore((s) => s.activity)
  const elapsedSec = useSessionStore((s) => s.elapsedSec)
  const bpm = useSessionStore((s) => s.bpm)
  const start = useSessionStore((s) => s.start)
  const tick = useSessionStore((s) => s.tick)
  const setBpm = useSessionStore((s) => s.setBpm)
  const reset = useSessionStore((s) => s.reset)
  const [sets, setSets] = useState(0)
  const [resolvedId, setResolvedId] = useState<string | undefined>(sessionId)
  const initRef = useRef(false)

  // Resolve the session exactly once (ref guards React StrictMode's double-invoke):
  //  - arrived from a program "Start" → use the session it created;
  //  - arrived via quick action → reuse an existing active session, else create one.
  useEffect(() => {
    if (initRef.current) return
    if (sessionId) {
      initRef.current = true
      setResolvedId(sessionId)
      return
    }
    if (!user) return // wait for the user record to load
    initRef.current = true
    void (async () => {
      const existing = await activeSession()
      if (existing) {
        setResolvedId(existing.id)
        start(existing.id, existing.activity)
      } else {
        const s = await startSession(user.id, 'Boxing')
        setResolvedId(s.id)
        start(s.id, 'Boxing')
      }
    })()
  }, [sessionId, user, start])

  useEffect(() => {
    const iv = setInterval(() => {
      tick()
      const cur = useSessionStore.getState().bpm
      const next = Math.max(96, Math.min(154, cur + Math.round((Math.random() - 0.42) * 9)))
      setBpm(next)
    }, 1000)
    return () => clearInterval(iv)
  }, [tick, setBpm])

  const finish = async () => {
    const st = useSessionStore.getState()
    const id = resolvedId ?? st.sessionId ?? (await activeSession())?.id
    if (id) {
      await completeSession(
        id,
        { calories: 120 + Math.round(st.elapsedSec * 0.15), durationSec: st.elapsedSec, avgBpm: st.bpm },
        'Post Workout Stretch',
      )
    }
    reset()
    navigate(id ? `/session/${id}/summary` : '/home', { replace: true })
  }

  const act = activity || 'Boxing'

  return (
    <div className="relative h-full overflow-hidden text-white">
      <img src={heroForActivity(act)} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative flex h-full flex-col">
        <AppBar transparent title="" onBack={finish} />

        <div className="px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-4xl font-black">
            <Heart className="h-8 w-8 animate-pulse fill-primary text-primary" />
            <span className="tabular">{bpm}</span>
            <span className="text-lg font-semibold opacity-80">{t('metrics.units.bpm')}</span>
          </div>
          <p className="mt-2 opacity-80">{t('session.currentlyDoing', { activity: act })}</p>
          <p className="mt-1 text-sm tabular opacity-60">{formatDuration(elapsedSec)}</p>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <button
            onClick={() => setSets((s) => s + 1)}
            className="relative grid h-24 w-24 place-items-center rounded-full bg-primary text-primary-fg shadow-glow active:scale-95"
          >
            <span className="absolute inset-0 rounded-full bg-primary/60 animate-pulse-ring" />
            <Plus className="h-10 w-10" />
          </button>
          {sets > 0 && <p className="text-sm font-semibold opacity-80 tabular">{sets} × {t('workouts.sets')}</p>}
        </div>

        <div className="space-y-3 p-5 pb-safe-b">
          <div className="grid grid-cols-2 gap-3">
            <VitalsCard icon={Activity} label={t('session.pressure')} value="112" unit={t('metrics.units.mmHg')} />
            <VitalsCard icon={Droplet} label={t('session.oxygen')} value="95" unit={t('metrics.units.spo2')} />
          </div>
          <Button block variant="surface" onClick={finish}>
            <Square className="h-4 w-4" />
            {t('session.finish')}
          </Button>
        </div>
      </div>
    </div>
  )
}
