import { db } from '@/db'
import { nowMs } from '@/db/util'
import type { AppNotification } from '@/db/types'

export async function listNotifications(): Promise<AppNotification[]> {
  return db.notifications.orderBy('createdAt').reverse().toArray()
}

export async function unreadCount(): Promise<number> {
  // Booleans aren't valid IndexedDB keys, so filter in JS rather than via an index.
  return db.notifications.filter((n) => !n.read).count()
}

export async function markRead(id: string): Promise<void> {
  await db.notifications.update(id, { read: true, updatedAt: nowMs() })
}

export async function markAllRead(): Promise<void> {
  const unread = await db.notifications.filter((n) => !n.read).toArray()
  await Promise.all(unread.map((n) => db.notifications.update(n.id, { read: true, updatedAt: nowMs() })))
}
