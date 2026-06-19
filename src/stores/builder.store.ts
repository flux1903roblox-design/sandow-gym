import { create } from 'zustand'
import type { Equipment, Muscle } from '@/data/catalog'

/** Transient state for the equipment → muscles → exercises builder funnel. */
interface BuilderState {
  equipment: Equipment[]
  muscles: Muscle[]
  selected: string[] // chosen exercise ids (the workout being built)
  toggleEquipment: (e: Equipment) => void
  toggleMuscle: (m: Muscle) => void
  toggleExercise: (id: string) => void
  setSelected: (ids: string[]) => void
  removeExercise: (id: string) => void
  swapExercise: (oldId: string, newId: string) => void
  reset: () => void
}

const toggle = <T>(arr: T[], v: T): T[] => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])

export const useBuilderStore = create<BuilderState>((set) => ({
  equipment: [],
  muscles: [],
  selected: [],
  toggleEquipment: (e) => set((s) => ({ equipment: toggle(s.equipment, e) })),
  toggleMuscle: (m) => set((s) => ({ muscles: toggle(s.muscles, m) })),
  toggleExercise: (id) => set((s) => ({ selected: toggle(s.selected, id) })),
  setSelected: (ids) => set({ selected: ids }),
  removeExercise: (id) => set((s) => ({ selected: s.selected.filter((x) => x !== id) })),
  swapExercise: (oldId, newId) =>
    set((s) => ({ selected: s.selected.map((x) => (x === oldId ? newId : x)) })),
  reset: () => set({ equipment: [], muscles: [], selected: [] }),
}))
