import { useLiveQuery } from 'dexie-react-hooks'
import { latest, seriesLastNDays } from '@/db/repositories/metricsRepo'
import type { MetricType } from '@/db/types'

export function useMetricLatest(type: MetricType) {
  return useLiveQuery(() => latest(type), [type])
}

export function useMetricValue(type: MetricType, fallback = 0) {
  const sample = useMetricLatest(type)
  return sample?.value ?? fallback
}

export function useMetricSeries(type: MetricType, days: number) {
  return useLiveQuery(() => seriesLastNDays(type, days), [type, days], [])
}
