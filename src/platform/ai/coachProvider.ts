/**
 * Adapter seam for the AI coach. v1 returns varied, context-aware canned replies
 * (Hebrew + English); a real LLM endpoint drops in behind the same interface later.
 */
export interface CoachReply {
  text: string
}

export interface CoachProvider {
  reply(prompt: string): Promise<CoachReply>
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]

const REPLIES = {
  greet: [
    'Hey! Ready to train? Tell me your focus — strength, cardio, or recovery.',
    'Hi Makise! What are we working on today?',
    'Hey 👊 Let’s make today count. What’s the goal?',
    'Good to see you! Strength, cardio, or mobility today?',
  ],
  nutrition: [
    'For your goal, aim for ~1.8g protein per kg and keep most carbs around training. Want a sample day?',
    'Protein at every meal + hydration is the base. Want me to draft a quick meal plan?',
    'Don’t skip carbs around workouts — they fuel your lifts. I can build a day of meals if you like.',
  ],
  recovery: [
    'Recovery is where growth happens — rest, hydrate, and aim for 7–8h sleep tonight.',
    'Sore is normal. Do 10 min of mobility, hydrate well, and we’ll go lighter tomorrow.',
    'Listen to your body — a rest day now beats an injury later. Light walk + stretch today.',
  ],
  back: [
    'Queued a back session: pull-ups, barbell rows and deadlifts. Open Workouts → Back Workout.',
    'Back day! Focus on squeezing the lats. I lined up rows, pull-ups and deadlifts for you.',
  ],
  legs: [
    'Leg day: squats, lunges and calf raises. Warm up the knees first.',
    'Let’s build those legs — squats and lunges today. Control the descent.',
  ],
  cardio: [
    'Let’s do 25 min of zone-2 cardio. Tap + → Start run to track it with GPS.',
    'Cardio time! Keep it conversational pace. Start a GPS run from the + button.',
  ],
  weight: [
    'A ~300–500 kcal deficit, 8–10k steps and 3 lifts a week works great. Track it in Activity.',
    'Fat loss = small deficit + steps + lifting to keep muscle. Let’s track your steps daily.',
  ],
  generic: [
    'Got it. Focus on form over weight today — quality reps win.',
    'Nice. I’ll factor that into your plan. Want a quick warmup first?',
    'Love the consistency. Rest ~90s between sets and keep the tempo controlled.',
    'On it. Let’s keep your heart rate steady and finish strong.',
    'Good thinking — progressive overload plus sleep is the magic combo.',
    'Noted! Tell me your target muscle group and I’ll build the session.',
  ],
}

export const mockCoachProvider: CoachProvider = {
  async reply(prompt: string): Promise<CoachReply> {
    await sleep(600 + Math.floor(Math.random() * 500))
    const p = prompt.toLowerCase().trim()
    if (/eat|food|diet|nutrition|meal|protein|אוכל|תזונה|דיאט|חלבון|לאכול/.test(p)) return { text: pick(REPLIES.nutrition) }
    if (/tired|rest|sore|recover|sleep|כאב|עייף|מנוחה|שינה|התאושש/.test(p)) return { text: pick(REPLIES.recovery) }
    if (/back|pull|גב|משיכ/.test(p)) return { text: pick(REPLIES.back) }
    if (/leg|squat|רגל|רגליים|סקוואט/.test(p)) return { text: pick(REPLIES.legs) }
    if (/cardio|run|jog|ריצה|קרדיו|לרוץ/.test(p)) return { text: pick(REPLIES.cardio) }
    if (/lose|weight|fat|cut|לרדת|שומן|לרזות/.test(p)) return { text: pick(REPLIES.weight) }
    if (/\b(hi|hey|hello|yo|sup)\b/.test(p) || /שלום|היי|אהלן|מה נשמע|מה קורה/.test(p) || p === 'הי') return { text: pick(REPLIES.greet) }
    return { text: pick(REPLIES.generic) }
  },
}
