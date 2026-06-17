import type { BaseEntity } from './types'

export const newId = () => crypto.randomUUID()
export const nowMs = () => Date.now()

/** Base fields for a new persisted entity. */
export function base(): BaseEntity {
  const t = nowMs()
  return { id: newId(), createdAt: t, updatedAt: t, syncStatus: 'local' }
}

/** Bump updatedAt + mark pending for a future sync engine. */
export function touch<T extends BaseEntity>(entity: T): T {
  return { ...entity, updatedAt: nowMs(), syncStatus: 'pending' }
}
