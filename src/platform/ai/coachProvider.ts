/**
 * Adapter seam for the AI coach. v1 returns context-aware canned replies; a real
 * LLM endpoint drops in behind the same interface with zero screen changes.
 */
export interface CoachReply {
  text: string
}

export interface CoachProvider {
  reply(prompt: string): Promise<CoachReply>
}

const GENERIC = [
  'Great choice — focus on form over weight today.',
  'Added to your plan. Want a 5-minute warmup first?',
  'Remember to hydrate and rest ~90s between sets.',
  'Nice consistency this week — your Sandow Score is climbing.',
  'Let’s keep your heart rate in zone 2 for this one.',
]

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const mockCoachProvider: CoachProvider = {
  async reply(prompt: string): Promise<CoachReply> {
    await sleep(650 + Math.floor(Math.random() * 500))
    const p = prompt.toLowerCase()
    if (/eat|food|diet|nutrition|meal|protein|אוכל|תזונה|דיאט|חלבון/.test(p))
      return { text: 'For your goal, target ~1.8g protein per kg and keep most carbs around training. Want a sample day?' }
    if (/tired|rest|sore|recover|sleep|כאב|עייף|מנוחה|שינה/.test(p))
      return { text: 'Recovery is where growth happens — take a rest day, hydrate, and aim for 7–8h sleep. Light mobility helps.' }
    if (/back|pull|גב|משיכ/.test(p))
      return { text: 'Queued a back session: pull-ups, barbell rows and deadlifts. Open Workouts → Back Workout to start.' }
    if (/leg|squat|רגל|סקוואט/.test(p))
      return { text: 'Leg day it is — squats, lunges and calf raises. Warm up the knees first.' }
    if (/cardio|run|jog|ריצה|קרדיו/.test(p))
      return { text: 'Let’s do 25 min of zone-2 cardio. Start a GPS run from the + button to track it.' }
    if (/lose|weight|fat|cut|לרדת|שומן|משקל/.test(p))
      return { text: 'A small deficit (~300–500 kcal), 8–10k steps, and 3 lifts a week works well. Track it in Activity.' }
    if (/^(hi|hey|hello|yo|שלום|היי|הי)\b/.test(p))
      return { text: 'Hey! Ready to train? Tell me your focus today — strength, cardio, or recovery.' }
    return { text: GENERIC[prompt.trim().length % GENERIC.length] }
  },
}
