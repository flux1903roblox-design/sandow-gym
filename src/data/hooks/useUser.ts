import { useLiveQuery } from 'dexie-react-hooks'
import { getUser } from '@/db/repositories/userRepo'
import { getSettings } from '@/db/repositories/settingsRepo'

export function useUser() {
  return useLiveQuery(() => getUser())
}

export function useSettings() {
  return useLiveQuery(() => getSettings())
}
