import { useTranslation } from 'react-i18next'
import type { Muscle } from '@/data/catalog'

const ACCENT = '#FF6A2B'
const BASE = '#20242C'
const EDGE = '#3A404B'
const LIMB = '#171A20'

type Ellipse = [cx: number, cy: number, rx: number, ry: number]
interface Zone {
  m: Muscle
  shapes: Ellipse[]
}

// Front view (centered x≈78) and back view (centered x≈242), muscle groups as tappable blobs.
const FRONT: Zone[] = [
  { m: 'shoulders', shapes: [[58, 66, 13, 9], [98, 66, 13, 9]] },
  { m: 'chest', shapes: [[67, 85, 13, 11], [89, 85, 13, 11]] },
  { m: 'biceps', shapes: [[47, 97, 8, 15], [109, 97, 8, 15]] },
  { m: 'forearms', shapes: [[39, 128, 7, 16], [117, 128, 7, 16]] },
  { m: 'abs', shapes: [[78, 110, 12, 19]] },
  { m: 'obliques', shapes: [[61, 112, 6, 15], [95, 112, 6, 15]] },
  { m: 'quads', shapes: [[67, 175, 13, 29], [89, 175, 13, 29]] },
  { m: 'calves', shapes: [[67, 230, 9, 21], [89, 230, 9, 21]] },
]
const BACK: Zone[] = [
  { m: 'traps', shapes: [[242, 64, 18, 9]] },
  { m: 'back', shapes: [[229, 87, 12, 15], [255, 87, 12, 15]] },
  { m: 'lats', shapes: [[219, 104, 6, 13], [265, 104, 6, 13]] },
  { m: 'triceps', shapes: [[207, 98, 8, 15], [277, 98, 8, 15]] },
  { m: 'lowerBack', shapes: [[242, 117, 13, 11]] },
  { m: 'glutes', shapes: [[231, 142, 13, 12], [253, 142, 13, 12]] },
  { m: 'hamstrings', shapes: [[231, 181, 12, 27], [253, 181, 12, 27]] },
  { m: 'calves', shapes: [[231, 232, 9, 21], [253, 232, 9, 21]] },
]

export function MuscleMap({ selected, onToggle }: { selected: Muscle[]; onToggle: (m: Muscle) => void }) {
  const { t } = useTranslation()
  const renderZones = (zones: Zone[]) =>
    zones.map((z) => {
      const on = selected.includes(z.m)
      return (
        <g key={z.m} onClick={() => onToggle(z.m)} style={{ cursor: 'pointer' }}>
          {z.shapes.map((s, i) => (
            <ellipse
              key={i}
              cx={s[0]}
              cy={s[1]}
              rx={s[2]}
              ry={s[3]}
              fill={on ? ACCENT : BASE}
              stroke={on ? ACCENT : EDGE}
              strokeWidth={1.5}
              style={{ transition: 'fill 0.2s' }}
            />
          ))}
        </g>
      )
    })

  return (
    <svg viewBox="0 0 320 290" className="w-full" role="img" aria-label="Muscle selector">
      {/* faint torso + limbs so the blobs read as a figure */}
      {[78, 242].map((cx) => (
        <g key={cx} fill={LIMB}>
          <rect x={cx - 22} y={56} width={44} height={84} rx={18} />
          <rect x={cx - 30} y={58} width={12} height={74} rx={6} />
          <rect x={cx + 18} y={58} width={12} height={74} rx={6} />
          <rect x={cx - 18} y={150} width={14} height={108} rx={7} />
          <rect x={cx + 4} y={150} width={14} height={108} rx={7} />
        </g>
      ))}
      {/* heads */}
      <circle cx={78} cy={34} r={14} fill={BASE} stroke={EDGE} strokeWidth={1.5} />
      <circle cx={242} cy={34} r={14} fill={BASE} stroke={EDGE} strokeWidth={1.5} />
      {renderZones(FRONT)}
      {renderZones(BACK)}
      <text x={78} y={282} textAnchor="middle" fill="#8A8F98" fontSize="12" fontWeight="600">
        {t('builder.front')}
      </text>
      <text x={242} y={282} textAnchor="middle" fill="#8A8F98" fontSize="12" fontWeight="600">
        {t('builder.rear')}
      </text>
    </svg>
  )
}
