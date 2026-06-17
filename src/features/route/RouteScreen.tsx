import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CircleMarker, MapContainer, Polyline, TileLayer } from 'react-leaflet'
import { ArrowLeft, Flame, Heart, MapPin, Pause, type LucideIcon } from 'lucide-react'
import { useLatestRoute } from '@/data/hooks/useRoute'
import { formatDuration, formatInt } from '@/lib/format'
import { useUiStore } from '@/stores/ui.store'
import 'leaflet/dist/leaflet.css'
import type { LatLngExpression } from 'leaflet'

function Stat({ icon: Icon, value, label }: { icon: LucideIcon; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-surface p-3">
      <Icon className="h-5 w-5 text-primary" />
      <span className="font-bold tabular">{value}</span>
      <span className="text-xs text-muted">{label}</span>
    </div>
  )
}

export default function RouteScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const locale = useUiStore((s) => s.locale)
  const route = useLatestRoute()

  if (!route || route.points.length === 0) return null
  const positions: LatLngExpression[] = route.points.map((p) => [p.lat, p.lng])
  const mid = route.points[Math.floor(route.points.length / 2)]
  const center: LatLngExpression = [mid.lat, mid.lng]

  return (
    <div className="relative h-full">
      <MapContainer center={center} zoom={15} zoomControl={false} attributionControl={false} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline positions={positions} pathOptions={{ color: '#FF6A2B', weight: 5 }} />
        <CircleMarker center={positions[0]} radius={7} pathOptions={{ color: '#fff', fillColor: '#22C55E', fillOpacity: 1, weight: 2 }} />
        <CircleMarker
          center={positions[positions.length - 1]}
          radius={7}
          pathOptions={{ color: '#fff', fillColor: '#FF6A2B', fillOpacity: 1, weight: 2 }}
        />
      </MapContainer>

      <button
        onClick={() => navigate(-1)}
        aria-label="Back"
        className="absolute start-4 z-[1000] grid h-10 w-10 place-items-center rounded-full bg-bg/80 backdrop-blur"
        style={{ top: 'calc(env(safe-area-inset-top) + 0.75rem)' }}
      >
        <ArrowLeft className="h-5 w-5 rtl:-scale-x-100" />
      </button>

      <div className="absolute inset-x-0 bottom-0 z-[1000] rounded-t-[2rem] border-t border-border bg-bg/95 p-5 pb-safe-b backdrop-blur">
        <div className="text-center">
          <div className="text-5xl font-black tabular leading-none">{formatDuration(route.durationSec)}</div>
          <p className="mt-1 text-muted">{t('route.duration')}</p>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <Stat icon={Flame} value={formatInt(route.calories, locale)} label={t('metrics.units.kcal')} />
          <Stat icon={MapPin} value={`${route.distanceKm}`} label={t('metrics.units.km')} />
          <Stat icon={Heart} value={`${route.avgBpm}`} label={t('metrics.units.bpm')} />
        </div>
        <div className="mt-5 flex justify-center">
          <button
            onClick={() => navigate(-1)}
            aria-label={t('route.pause')}
            className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-fg shadow-glow active:scale-95"
          >
            <Pause className="h-7 w-7 fill-current" />
          </button>
        </div>
      </div>
    </div>
  )
}
