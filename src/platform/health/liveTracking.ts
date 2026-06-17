/**
 * Real device-sensor tracking for the PWA (no Apple Health — that needs native).
 *  - Steps: peak-detection on the accelerometer (DeviceMotion). Foreground only.
 *  - Distance: real GPS via Geolocation.watchPosition.
 * Both require HTTPS + a user gesture (iOS also needs an explicit motion permission prompt).
 */

export type MotionPermission = 'granted' | 'denied' | 'unsupported'

type DMEWithPermission = {
  requestPermission?: () => Promise<'granted' | 'denied'>
}

export async function requestMotionPermission(): Promise<MotionPermission> {
  const DME = (typeof window !== 'undefined' ? window.DeviceMotionEvent : undefined) as
    | (typeof DeviceMotionEvent & DMEWithPermission)
    | undefined
  if (!DME) return 'unsupported'
  if (typeof DME.requestPermission === 'function') {
    try {
      const res = await DME.requestPermission()
      return res === 'granted' ? 'granted' : 'denied'
    } catch {
      return 'denied'
    }
  }
  return 'granted' // Android / desktop: no explicit prompt needed
}

/** Attach a step detector; returns a cleanup function. */
export function createStepDetector(onStep: () => void): () => void {
  let lastPeakAt = 0
  let lastMag = 0
  let rising = false
  const THRESHOLD = 11.2 // m/s² — above resting gravity (~9.8)
  const MIN_GAP_MS = 280 // ignore peaks closer than a fast stride

  const handler = (e: DeviceMotionEvent) => {
    const a = e.accelerationIncludingGravity
    if (!a) return
    const mag = Math.sqrt((a.x ?? 0) ** 2 + (a.y ?? 0) ** 2 + (a.z ?? 0) ** 2)
    const now = performance.now()
    if (mag > lastMag) {
      rising = true
    } else if (rising && mag < lastMag) {
      if (lastMag > THRESHOLD && now - lastPeakAt > MIN_GAP_MS) {
        lastPeakAt = now
        onStep()
      }
      rising = false
    }
    lastMag = mag
  }

  window.addEventListener('devicemotion', handler)
  return () => window.removeEventListener('devicemotion', handler)
}

/** Watch GPS; returns a cleanup function. */
export function startGeo(onPoint: (lat: number, lng: number) => void): () => void {
  if (typeof navigator === 'undefined' || !navigator.geolocation) return () => {}
  const id = navigator.geolocation.watchPosition(
    (pos) => onPoint(pos.coords.latitude, pos.coords.longitude),
    () => {},
    { enableHighAccuracy: true, maximumAge: 1000, timeout: 12000 },
  )
  return () => navigator.geolocation.clearWatch(id)
}

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}
