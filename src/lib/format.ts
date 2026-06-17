import type { Locale } from '@/db/types'

const localeTag: Record<Locale, string> = { he: 'he-IL', en: 'en-US' }

export function formatNumber(value: number, locale: Locale = 'he', opts?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(localeTag[locale], opts).format(value)
}

export function formatInt(value: number, locale: Locale = 'he') {
  return formatNumber(Math.round(value), locale, { maximumFractionDigits: 0 })
}

/** "45:25" from seconds, or "1:05:30" past an hour. */
export function formatDuration(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const pad = (n: number) => n.toString().padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`
}

export function bmiCategory(bmi: number): { key: string; tone: 'success' | 'warning' | 'destructive' } {
  if (bmi < 18.5) return { key: 'underweight', tone: 'warning' }
  if (bmi < 25) return { key: 'normal', tone: 'success' }
  if (bmi < 30) return { key: 'overweight', tone: 'warning' }
  return { key: 'obese', tone: 'destructive' }
}
