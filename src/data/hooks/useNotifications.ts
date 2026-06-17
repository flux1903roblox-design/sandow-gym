import { useLiveQuery } from 'dexie-react-hooks'
import { listNotifications, unreadCount } from '@/db/repositories/notificationRepo'

export function useNotifications() {
  return useLiveQuery(() => listNotifications(), [], [])
}

export function useUnreadCount() {
  return useLiveQuery(() => unreadCount(), [], 0)
}
