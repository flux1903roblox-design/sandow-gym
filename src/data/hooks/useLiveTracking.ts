import { useEffect, useRef, useState } from 'react'
import {
  createStepDetector,
  haversineKm,
  requestMotionPermission,
  startGeo,
  type MotionPermission,
} from '@/platform/health/liveTracking'
import { incrementToday } from '@/db/repositories/metricsRepo'
import { useUser } from './useUser'

/** Drives real step + distance tracking and writes the deltas into today's metrics. */
export function useLiveTracking() {
  const user = useUser()
  const [tracking, setTracking] = useState(false)
  const [permission, setPermission] = useState<'idle' | MotionPermission>('idle')
  const [sessionSteps, setSessionSteps] = useState(0)
  const [sessionKm, setSessionKm] = useState(0)

  const cleanups = useRef<(() => void)[]>([])
  const lastPoint = useRef<{ lat: number; lng: number } | null>(null)
  const stepBuffer = useRef(0)

  const flushSteps = () => {
    if (user && stepBuffer.current > 0) {
      void incrementToday(user.id, 'steps', stepBuffer.current, 'steps')
      stepBuffer.current = 0
    }
  }

  const start = async () => {
    const perm = await requestMotionPermission()
    setPermission(perm)
    if (perm === 'denied') return

    const offStep = createStepDetector(() => {
      setSessionSteps((s) => s + 1)
      stepBuffer.current += 1
      if (stepBuffer.current >= 5) flushSteps()
    })
    const offGeo = startGeo((lat, lng) => {
      if (lastPoint.current) {
        const d = haversineKm(lastPoint.current, { lat, lng })
        if (d > 0.002 && d < 0.1) {
          setSessionKm((k) => k + d)
          if (user) void incrementToday(user.id, 'distance', Number(d.toFixed(3)), 'km')
        }
      }
      lastPoint.current = { lat, lng }
    })
    cleanups.current = [offStep, offGeo]
    setTracking(true)
  }

  const stop = () => {
    cleanups.current.forEach((fn) => fn())
    cleanups.current = []
    flushSteps()
    lastPoint.current = null
    setTracking(false)
  }

  useEffect(() => () => cleanups.current.forEach((fn) => fn()), [])

  return { tracking, permission, sessionSteps, sessionKm, start, stop }
}
