/**
 * Adapter seam for the AI coach. v1 returns canned replies; a real LLM endpoint
 * drops in behind the same interface with zero screen changes.
 */
export interface CoachReply {
  text: string
}

export interface CoachProvider {
  reply(prompt: string): Promise<CoachReply>
}

const REPLIES = [
  'Great choice — focus on form over weight today.',
  'Added to your plan. Want a 5-minute warmup first?',
  'Remember to hydrate and rest ~90s between sets.',
  'Nice consistency this week — your Sandow Score is climbing.',
  'Let’s keep your heart rate in zone 2 for this one.',
]

export const mockCoachProvider: CoachProvider = {
  async reply(prompt: string): Promise<CoachReply> {
    await new Promise((r) => setTimeout(r, 500))
    const idx = prompt.trim().length % REPLIES.length
    return { text: REPLIES[idx] }
  },
}
