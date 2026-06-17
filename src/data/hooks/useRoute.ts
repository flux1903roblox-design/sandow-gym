import { useLiveQuery } from 'dexie-react-hooks'
import { getRouteForSession, latestRoute } from '@/db/repositories/routeRepo'

export function useLatestRoute() {
  return useLiveQuery(() => latestRoute())
}

export function useRouteForSession(sessionId?: string) {
  return useLiveQuery(() => (sessionId ? getRouteForSession(sessionId) : undefined), [sessionId])
}
