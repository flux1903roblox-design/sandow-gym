import { db } from '@/db'
import type { Review, Trainer } from '@/db/types'

export async function listTrainers(): Promise<Trainer[]> {
  return db.trainers.orderBy('rating').reverse().toArray()
}

export async function getTrainer(id: string): Promise<Trainer | undefined> {
  return db.trainers.get(id)
}

export async function listReviews(trainerId: string): Promise<Review[]> {
  return db.reviews.where('trainerId').equals(trainerId).reverse().sortBy('createdAt')
}
