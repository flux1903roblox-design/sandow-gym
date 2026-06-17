import { useLiveQuery } from 'dexie-react-hooks'
import { allHealthScores, getDeclaration, latestHealthScore } from '@/db/repositories/healthRepo'

export function useHealthScore() {
  return useLiveQuery(() => latestHealthScore())
}

export function useAllHealthScores() {
  return useLiveQuery(() => allHealthScores(), [], [])
}

export function useDeclaration(userId?: string) {
  return useLiveQuery(() => (userId ? getDeclaration(userId) : undefined), [userId])
}
