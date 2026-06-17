import { useCallback, useEffect, useRef, useState } from 'react'

export type CameraState = 'idle' | 'requesting' | 'active' | 'denied' | 'unsupported'

/**
 * getUserMedia wrapper with a graceful mock fallback. iOS requires a secure
 * context (HTTPS/localhost) + a user gesture to start the stream — hence the
 * explicit start() rather than auto-start, and the denied/unsupported states
 * that let the scan screen fall back to a mock.
 */
export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [state, setState] = useState<CameraState>('idle')

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setState('unsupported')
      return
    }
    setState('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => {})
      }
      setState('active')
    } catch {
      setState('denied')
    }
  }, [])

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }, [])

  const capture = useCallback((): string | undefined => {
    const v = videoRef.current
    if (!v || !v.videoWidth) return undefined
    const canvas = document.createElement('canvas')
    canvas.width = v.videoWidth
    canvas.height = v.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', 0.8)
  }, [])

  useEffect(() => () => stop(), [stop])

  return { videoRef, state, start, stop, capture }
}
