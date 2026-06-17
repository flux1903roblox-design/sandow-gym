import { db, SETTINGS_ID } from '@/db'
import type { AppSettings } from '@/db/types'

export const DEFAULT_SETTINGS: AppSettings = {
  id: SETTINGS_ID,
  seedVersion: 0,
  onboardingComplete: false,
  locale: 'he',
  direction: 'rtl',
  units: 'metric',
  notifications: { workouts: true, hydration: true, coach: true },
  privacy: { shareData: false },
  deviceSync: { healthKitEnabled: false, healthConnectEnabled: false },
  storagePersisted: false,
}

export async function getSettings(): Promise<AppSettings> {
  return (await db.settings.get(SETTINGS_ID)) ?? DEFAULT_SETTINGS
}

export async function patchSettings(patch: Partial<AppSettings>): Promise<AppSettings> {
  const current = await getSettings()
  const next: AppSettings = { ...current, ...patch, id: SETTINGS_ID }
  await db.settings.put(next)
  return next
}
