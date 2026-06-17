import { useLiveQuery } from 'dexie-react-hooks'
import { listFoodScans } from '@/db/repositories/nutritionRepo'

export function useFoodScans() {
  return useLiveQuery(() => listFoodScans(), [], [])
}
