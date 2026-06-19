import { useLiveQuery } from 'dexie-react-hooks'
import { listLoggedSessions } from '@/db/repositories/loggedSessionRepo'

export function useLoggedSessions() {
  return useLiveQuery(() => listLoggedSessions(), [], [])
}
