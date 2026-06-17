import { useLiveQuery } from 'dexie-react-hooks'
import { getMainThread, listMessages } from '@/db/repositories/chatRepo'

export function useThread() {
  return useLiveQuery(() => getMainThread())
}

export function useMessages(threadId?: string) {
  return useLiveQuery(() => (threadId ? listMessages(threadId) : Promise.resolve([])), [threadId], [])
}
