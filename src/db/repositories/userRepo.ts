import { db } from '@/db'
import { touch } from '@/db/util'
import type { User } from '@/db/types'

export async function getUser(): Promise<User | undefined> {
  return db.users.toCollection().first()
}

export async function updateUser(patch: Partial<User>): Promise<User | undefined> {
  const user = await getUser()
  if (!user) return undefined
  const next = touch({ ...user, ...patch })
  await db.users.put(next)
  return next
}
