import type { ReactNode } from 'react'

interface ProgressRingProps {
  /** 0..1 */
  value: number
  size?: number
  stroke?: number
  color?: string
  trackColor?: string
  children?: ReactNode
  /** A second ring (e.g. distance vs calorie) drawn inside. */
  className?: string
}

/** Hand-rolled SVG ring — avoids forcing Recharts for a simple radial progress. */
export function ProgressRing({
  value,
  size = 160,
  stroke = 14,
  color = '#FF6A2B',
  trackColor = 'rgba(255,255,255,0.08)',
  children,
  className,
}: ProgressRingProps) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const clamped = Math.max(0, Math.min(1, value))
  const dash = c * clamped

  return (
    <div className={className} style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          style={{ transition: 'stroke-dasharray 700ms cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
      )}
    </div>
  )
}
