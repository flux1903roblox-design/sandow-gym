import { db } from '@/db'
import { base, nowMs } from '@/db/util'
import type { Exercise, SessionTotals, WorkoutProgram, WorkoutSession } from '@/db/types'

export async function listPrograms(): Promise<WorkoutProgram[]> {
  return db.workoutPrograms.toArray()
}

export async function getProgram(id: string): Promise<WorkoutProgram | undefined> {
  return db.workoutPrograms.get(id)
}

export async function getExercises(programId: string): Promise<Exercise[]> {
  return db.exercises.where('programId').equals(programId).sortBy('order')
}

export async function listSessions(): Promise<WorkoutSession[]> {
  return db.workoutSessions.orderBy('startedAt').reverse().toArray()
}

export async function getSession(id: string): Promise<WorkoutSession | undefined> {
  return db.workoutSessions.get(id)
}

export async function activeSession(): Promise<WorkoutSession | undefined> {
  return db.workoutSessions.where('status').anyOf('active', 'paused').first()
}

export async function startSession(
  userId: string,
  activity: string,
  programId?: string,
): Promise<WorkoutSession> {
  const session: WorkoutSession = {
    ...base(),
    userId,
    programId,
    activity,
    status: 'active',
    startedAt: nowMs(),
    liveBpm: 96,
    systolic: 118,
    diastolic: 78,
    spo2: 97,
  }
  await db.workoutSessions.put(session)
  return session
}

export async function updateSession(id: string, patch: Partial<WorkoutSession>): Promise<void> {
  await db.workoutSessions.update(id, { ...patch, updatedAt: nowMs() })
}

export async function completeSession(id: string, totals: SessionTotals, followUp?: string): Promise<void> {
  await db.workoutSessions.update(id, {
    status: 'completed',
    endedAt: nowMs(),
    totals,
    followUp,
    updatedAt: nowMs(),
  })
}
