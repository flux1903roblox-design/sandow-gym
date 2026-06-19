import { db } from '@/db'
import type { LoggedSession } from '@/db/engineTypes'

export async function listLoggedSessions(): Promise<LoggedSession[]> {
  return db.loggedSessions.orderBy('startedAt').reverse().toArray()
}

export async function saveLoggedSession(session: LoggedSession): Promise<void> {
  await db.loggedSessions.put(session)
}
