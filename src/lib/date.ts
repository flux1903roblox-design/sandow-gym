import { format, formatDistanceToNowStrict } from 'date-fns'
import { he, enUS } from 'date-fns/locale'
import type { Locale } from '@/db/types'

const locales = { he, en: enUS }

export function formatDate(ts: number, pattern: string, locale: Locale = 'he') {
  return format(ts, pattern, { locale: locales[locale] })
}

/** e.g. "JUN 25, 2025" style header. */
export function formatHeaderDate(ts: number, locale: Locale = 'he') {
  return format(ts, locale === 'he' ? 'd בMMMM yyyy' : 'MMM d, yyyy', { locale: locales[locale] })
}

/** "2d", "5h" style relative timestamp for reviews / chat. */
export function timeAgo(ts: number, locale: Locale = 'he') {
  return formatDistanceToNowStrict(ts, { locale: locales[locale], addSuffix: true })
}

export function dayKey(ts: number) {
  return `day:${format(ts, 'yyyy-MM-dd')}`
}

/** Start of day (local) in epoch ms. */
export function startOfDayMs(ts: number) {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export const DAY_MS = 24 * 60 * 60 * 1000
export const TWO_YEARS_MS = 2 * 365 * DAY_MS
