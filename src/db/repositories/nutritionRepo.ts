import { db } from '@/db'
import { base } from '@/db/util'
import type { FoodScan, Macros } from '@/db/types'

export async function listFoodScans(): Promise<FoodScan[]> {
  return db.foodScans.orderBy('scannedAt').reverse().toArray()
}

export async function addFoodScan(
  userId: string,
  detectedName: string,
  calories: number,
  macros: Macros,
  imageDataUrl?: string,
): Promise<FoodScan> {
  const scan: FoodScan = {
    ...base(),
    userId,
    detectedName,
    calories,
    macros,
    imageDataUrl,
    scannedAt: Date.now(),
    source: 'mock',
  }
  await db.foodScans.put(scan)
  return scan
}
