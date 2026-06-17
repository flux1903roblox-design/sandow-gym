import { useLiveQuery } from 'dexie-react-hooks'
import {
  activeSession,
  getExercises,
  getProgram,
  getSession,
  listPrograms,
  listSessions,
} from '@/db/repositories/workoutRepo'

export function usePrograms() {
  return useLiveQuery(() => listPrograms(), [], [])
}

export function useProgram(id?: string) {
  return useLiveQuery(() => (id ? getProgram(id) : undefined), [id])
}

export function useExercises(programId?: string) {
  return useLiveQuery(() => (programId ? getExercises(programId) : Promise.resolve([])), [programId], [])
}

export function useSessions() {
  return useLiveQuery(() => listSessions(), [], [])
}

export function useSession(id?: string) {
  return useLiveQuery(() => (id ? getSession(id) : undefined), [id])
}

export function useActiveSession() {
  return useLiveQuery(() => activeSession())
}
