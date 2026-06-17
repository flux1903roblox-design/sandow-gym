import { db } from '@/db'
import type { RouteTrack } from '@/db/types'

export async function listRoutes(): Promise<RouteTrack[]> {
  return db.routes.toArray()
}

export async function latestRoute(): Promise<RouteTrack | undefined> {
  return db.routes.toCollection().last()
}

export async function getRouteForSession(sessionId: string): Promise<RouteTrack | undefined> {
  return db.routes.where('sessionId').equals(sessionId).first()
}
