import { useEffect, useRef, useState } from 'react'

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Smoothly counts from the previous value to the new one (respects reduced-motion). */
export function AnimatedNumber({
  value,
  durationMs = 1000,
  format,
  className,
}: {
  value: number
  durationMs?: number
  format?: (n: number) => string
  className?: string
}) {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  const rafRef = useRef(0)

  useEffect(() => {
    if (reduced()) {
      setDisplay(value)
      fromRef.current = value
      return
    }
    const a = fromRef.current
    const b = value
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(a + (b - a) * eased)
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
      else fromRef.current = b
    }
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value, durationMs])

  return <span className={className}>{format ? format(display) : Math.round(display).toLocaleString()}</span>
}
