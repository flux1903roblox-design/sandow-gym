import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface ActiveSet {
  setIndex: number
  reps?: number
  weight?: number
  durationSeconds?: number
  completed: boolean
}
export interface ActiveExercise {
  exerciseId: string
  order: number
  sets: ActiveSet[]
}

interface ActiveWorkoutState {
  status: 'idle' | 'active'
  startedAt?: number // epoch ms — elapsed is derived from this (survives backgrounding/reload)
  currentIndex: number
  exercises: ActiveExercise[]
  muscles: string[]
  restEndsAt?: number
  restSeconds?: number
  start: (exerciseIds: string[], muscles: string[]) => void
  addSet: (exIdx: number) => void
  updateSet: (exIdx: number, setIdx: number, patch: Partial<ActiveSet>) => void
  toggleSetComplete: (exIdx: number, setIdx: number) => void
  goTo: (idx: number) => void
  swap: (exIdx: number, newId: string) => void
  startRest: (seconds: number) => void
  addRestTime: (seconds: number) => void
  clearRest: () => void
  discard: () => void
}

const newSet = (i: number): ActiveSet => ({ setIndex: i, completed: false })

export const useActiveWorkout = create<ActiveWorkoutState>()(
  persist(
    (set) => ({
      status: 'idle',
      currentIndex: 0,
      exercises: [],
      muscles: [],
      start: (ids, muscles) =>
        set({
          status: 'active',
          startedAt: Date.now(),
          currentIndex: 0,
          muscles,
          restEndsAt: undefined,
          exercises: ids.map((exerciseId, order) => ({ exerciseId, order, sets: [newSet(0), newSet(1), newSet(2)] })),
        }),
      addSet: (exIdx) =>
        set((s) => {
          const exercises = s.exercises.map((e, i) => (i === exIdx ? { ...e, sets: [...e.sets, newSet(e.sets.length)] } : e))
          return { exercises }
        }),
      updateSet: (exIdx, setIdx, patch) =>
        set((s) => {
          const exercises = s.exercises.map((e, i) =>
            i === exIdx ? { ...e, sets: e.sets.map((st, j) => (j === setIdx ? { ...st, ...patch } : st)) } : e,
          )
          return { exercises }
        }),
      toggleSetComplete: (exIdx, setIdx) =>
        set((s) => {
          const exercises = s.exercises.map((e, i) =>
            i === exIdx
              ? { ...e, sets: e.sets.map((st, j) => (j === setIdx ? { ...st, completed: !st.completed } : st)) }
              : e,
          )
          return { exercises }
        }),
      goTo: (idx) => set({ currentIndex: idx }),
      swap: (exIdx, newId) =>
        set((s) => ({ exercises: s.exercises.map((e, i) => (i === exIdx ? { ...e, exerciseId: newId } : e)) })),
      startRest: (seconds) => set({ restEndsAt: Date.now() + seconds * 1000, restSeconds: seconds }),
      addRestTime: (seconds) =>
        set((s) => (s.restEndsAt ? { restEndsAt: s.restEndsAt + seconds * 1000, restSeconds: (s.restSeconds || 0) + seconds } : s)),
      clearRest: () => set({ restEndsAt: undefined, restSeconds: undefined }),
      discard: () =>
        set({ status: 'idle', startedAt: undefined, currentIndex: 0, exercises: [], muscles: [], restEndsAt: undefined }),
    }),
    { name: 'sandow-active-workout', storage: createJSONStorage(() => localStorage) },
  ),
)
