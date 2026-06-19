import type { BaseEntity } from './types'

export interface LoggedSet {
  setIndex: number
  reps?: number
  weight?: number
  durationSeconds?: number
  completed: boolean
}

export interface LoggedExercise {
  exerciseId: string // catalog id
  order: number
  sets: LoggedSet[]
}

/** A completed workout from the engine (stored as one nested doc per session). */
export interface LoggedSession extends BaseEntity {
  userId: string
  startedAt: number
  endedAt?: number
  durationSeconds: number
  muscles: string[]
  exercises: LoggedExercise[]
  totalVolume: number // Σ reps × weight (kg)
  totalSets: number
}
