import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pause, Play, Send } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { useThread, useMessages } from '@/data/hooks/useCoach'
import { appendMessage, decrementChatsLeft } from '@/db/repositories/chatRepo'
import { mockCoachProvider } from '@/platform/ai/coachProvider'
import { formatDuration } from '@/lib/format'
import { cn } from '@/lib/cn'
import type { ChatMessage } from '@/db/types'

function VoiceBubble({ message }: { message: ChatMessage }) {
  const { t } = useTranslation()
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    if (!playing) return
    const id = setTimeout(() => setPlaying(false), 4200)
    return () => clearTimeout(id)
  }, [playing])

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setPlaying((p) => !p)}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-fg"
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
      </button>
      <div className="flex h-7 items-end gap-0.5">
        {(message.waveform ?? []).map((h, i) => (
          <span
            key={i}
            className={cn('w-0.5 rounded-full bg-current opacity-80', playing && 'animate-pulse')}
            style={{ height: `${Math.max(12, h * 100)}%`, animationDelay: playing ? `${i * 0.04}s` : undefined }}
          />
        ))}
      </div>
      <span className="text-xs tabular opacity-70">{formatDuration(message.audioDurationSec ?? 0)}</span>
      {message.read && <span className="text-[10px] uppercase opacity-50">{t('coach.read')}</span>}
    </div>
  )
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-1.5">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  )
}

export default function CoachScreen() {
  const { t } = useTranslation()
  const thread = useThread()
  const messages = useMessages(thread?.id) ?? []
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, sending])

  const send = async () => {
    const text = draft.trim()
    if (!text || !thread || sending) return
    setDraft('')
    setSending(true)
    await appendMessage(thread.id, 'user', 'text', { text })
    await decrementChatsLeft(thread.id)
    const reply = await mockCoachProvider.reply(text)
    await appendMessage(thread.id, 'assistant', 'text', { text: reply.text })
    setSending(false)
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-bg/90 px-5 pt-safe-t pb-3 backdrop-blur">
        <div className="pt-3">
          <Avatar name={thread?.agentName ?? 'AI'} size="md" />
        </div>
        <div className="flex-1 pt-3">
          <h1 className="font-bold leading-tight">{thread?.agentName ?? t('coach.title')}</h1>
          <div className="flex items-center gap-2 text-xs text-muted">
            <Badge tone="primary">{thread?.model ?? 'GPT-6'}</Badge>
            {thread && <span>{t('coach.chatsLeft', { n: thread.chatsLeft })}</span>}
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-3 px-4 py-4">
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[78%] rounded-3xl px-4 py-2.5 text-sm',
                m.role === 'user' ? 'bg-primary text-primary-fg' : 'bg-surface text-foreground',
              )}
            >
              {m.kind === 'voice' ? <VoiceBubble message={m} /> : m.text}
            </div>
          </motion.div>
        ))}
        <AnimatePresence>
          {sending && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="rounded-3xl bg-surface px-4 py-2">
                <TypingDots />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-0 flex items-center gap-2 bg-bg/90 px-4 py-3 backdrop-blur">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder={t('coach.placeholder')}
          className="h-11 flex-1 rounded-2xl bg-surface px-4 text-sm outline-none placeholder:text-muted-2 focus:ring-2 focus:ring-primary/60"
        />
        <button
          onClick={send}
          disabled={!draft.trim() || sending}
          aria-label="Send"
          className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-fg transition-transform active:scale-95 disabled:opacity-40"
        >
          <Send className="h-5 w-5 rtl:-scale-x-100" />
        </button>
      </div>
    </div>
  )
}
