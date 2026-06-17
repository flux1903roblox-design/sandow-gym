import Dexie from 'dexie'
import { db } from '@/db'
import { base } from '@/db/util'
import type { MetricSample, MetricType } from '@/db/types'
import { DAY_MS, startOfDayMs } from '@/lib/date'

/** Samples of a type within [fromTs, toTs], ascending by time. */
export async function series(type: MetricType, fromTs: number, toTs: number): Promise<MetricSample[]> {
  return db.metricSamples
    .where('[type+timestamp]')
    .between([type, fromTs], [type, toTs])
    .toArray()
}

export async function seriesLastNDays(type: MetricType, days: number): Promise<MetricSample[]> {
  const to = startOfDayMs(Date.now()) + DAY_MS
  const from = to - days * DAY_MS
  return series(type, from, to)
}

/** Most recent sample of a type (today, given daily rollups). */
export async function latest(type: MetricType): Promise<MetricSample | undefined> {
  const arr = await db.metricSamples
    .where('[type+timestamp]')
    .between([type, Dexie.minKey], [type, Dexie.maxKey])
    .reverse()
    .limit(1)
    .toArray()
  return arr[0]
}

export async function latestValue(type: MetricType, fallback = 0): Promise<number> {
  return (await latest(type))?.value ?? fallback
}

export async function addSample(
  userId: string,
  type: MetricType,
  value: number,
  unit: string,
  timestamp = Date.now(),
  extra?: Partial<MetricSample>,
): Promise<MetricSample> {
  const sample: MetricSample = { ...base(), userId, type, value, unit, timestamp, source: 'manual', ...extra }
  await db.metricSamples.put(sample)
  return sample
}

/** Add to today's rollup sample (e.g. logging water), creating it if missing. */
export async function incrementToday(
  userId: string,
  type: MetricType,
  delta: number,
  unit: string,
): Promise<void> {
  const dayStart = startOfDayMs(Date.now())
  const existing = (await series(type, dayStart, dayStart + DAY_MS))[0]
  if (existing) {
    await db.metricSamples.update(existing.id, { value: existing.value + delta, updatedAt: Date.now() })
  } else {
    await addSample(userId, type, delta, unit, dayStart + DAY_MS / 2)
  }
}
