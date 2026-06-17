import { create } from 'zustand'

/** Ephemeral live-workout state (the actual session row lives in Dexie). */
interface SessionState {
  sessionId?: string
  activity: string
  elapsedSec: number
  bpm: number
  paused: boolean
  start: (sessionId: string, activity: string) => void
  tick: () => void
  setBpm: (bpm: number) => void
  setPaused: (paused: boolean) => void
  reset: () => void
}

export const useSessionStore = create<SessionState>((set) => ({
  sessionId: undefined,
  activity: '',
  elapsedSec: 0,
  bpm: 96,
  paused: false,
  start: (sessionId, activity) => set({ sessionId, activity, elapsedSec: 0, bpm: 98, paused: false }),
  tick: () => set((s) => (s.paused ? s : { elapsedSec: s.elapsedSec + 1 })),
  setBpm: (bpm) => set({ bpm }),
  setPaused: (paused) => set({ paused }),
  reset: () => set({ sessionId: undefined, activity: '', elapsedSec: 0, bpm: 96, paused: false }),
}))
