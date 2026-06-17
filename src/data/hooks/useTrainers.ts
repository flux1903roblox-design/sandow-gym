import { useLiveQuery } from 'dexie-react-hooks'
import { getTrainer, listReviews, listTrainers } from '@/db/repositories/trainerRepo'

export function useTrainers() {
  return useLiveQuery(() => listTrainers(), [], [])
}

export function useTrainer(id?: string) {
  return useLiveQuery(() => (id ? getTrainer(id) : undefined), [id])
}

export function useReviews(trainerId?: string) {
  return useLiveQuery(() => (trainerId ? listReviews(trainerId) : Promise.resolve([])), [trainerId], [])
}
