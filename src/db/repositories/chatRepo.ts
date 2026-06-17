import { db } from '@/db'
import { base, nowMs } from '@/db/util'
import type { ChatMessage, ChatThread, MessageKind } from '@/db/types'

export async function getMainThread(): Promise<ChatThread | undefined> {
  return db.chatThreads.toCollection().first()
}

export async function listMessages(threadId: string): Promise<ChatMessage[]> {
  return db.chatMessages.where('threadId').equals(threadId).sortBy('createdAt')
}

export async function appendMessage(
  threadId: string,
  role: ChatMessage['role'],
  kind: MessageKind,
  payload: { text?: string; audioDurationSec?: number; waveform?: number[] },
): Promise<ChatMessage> {
  const message: ChatMessage = { ...base(), threadId, role, kind, read: role === 'user', ...payload }
  await db.chatMessages.put(message)
  await db.chatThreads.update(threadId, { updatedAt: nowMs() })
  return message
}

export async function decrementChatsLeft(threadId: string): Promise<void> {
  const thread = await db.chatThreads.get(threadId)
  if (thread && thread.chatsLeft > 0) {
    await db.chatThreads.update(threadId, { chatsLeft: thread.chatsLeft - 1, updatedAt: nowMs() })
  }
}
