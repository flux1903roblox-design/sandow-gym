import back from '@/assets/img/back.webp'
import boxer from '@/assets/img/boxer.webp'
import runner from '@/assets/img/runner.webp'

/** Guided multi-week training plans (Technogym-style). A plan defines one week of
 * sessions that repeats for `weeks`; each session is a list of catalog exercise ids. */
export type Level = 'beginner' | 'intermediate' | 'advanced'

export interface PlanSession {
  id: string
  nameEn: string
  nameHe: string
  exerciseIds: string[]
}

export interface TrainingPlan {
  id: string
  nameEn: string
  nameHe: string
  descEn: string
  descHe: string
  weeks: number
  level: Level
  image: string
  week: PlanSession[]
}

const S = (id: string, nameEn: string, nameHe: string, exerciseIds: string[]): PlanSession => ({ id, nameEn, nameHe, exerciseIds })

export const LEVEL_LABELS: Record<Level, { he: string; en: string }> = {
  beginner: { he: 'מתחילים', en: 'Beginner' },
  intermediate: { he: 'מתקדמים', en: 'Intermediate' },
  advanced: { he: 'מתקדמים מאוד', en: 'Advanced' },
}

export const PLANS: TrainingPlan[] = [
  {
    id: 'full-body-foundations',
    nameEn: 'Full Body Foundations',
    nameHe: 'יסודות גוף מלא',
    descEn: 'Build a strong base with three full-body sessions a week.',
    descHe: 'בניית בסיס איתן עם שלושה אימוני גוף מלא בשבוע.',
    weeks: 4,
    level: 'beginner',
    image: back,
    week: [
      S('fb-a', 'Full Body A', 'גוף מלא A', ['bench-press', 'barbell-row', 'back-squat', 'db-shoulder-press', 'plank']),
      S('fb-b', 'Full Body B', 'גוף מלא B', ['deadlift', 'push-up', 'lunge', 'lat-pulldown', 'hanging-leg-raise']),
      S('fb-c', 'Full Body C', 'גוף מלא C', ['incline-db-press', 'seated-cable-row', 'leg-press', 'lateral-raise', 'cable-crunch']),
    ],
  },
  {
    id: 'push-pull-legs',
    nameEn: 'Push · Pull · Legs',
    nameHe: 'דחיפה · משיכה · רגליים',
    descEn: 'The classic 6-week PPL split for size and strength.',
    descHe: 'פיצול PPL קלאסי ל-6 שבועות לגודל וכוח.',
    weeks: 6,
    level: 'intermediate',
    image: boxer,
    week: [
      S('push', 'Push', 'דחיפה', ['bench-press', 'db-shoulder-press', 'incline-db-press', 'lateral-raise', 'tricep-pushdown']),
      S('pull', 'Pull', 'משיכה', ['pull-up', 'barbell-row', 'lat-pulldown', 'barbell-curl', 'face-pull']),
      S('legs', 'Legs', 'רגליים', ['back-squat', 'rdl', 'leg-press', 'leg-curl', 'standing-calf-raise']),
    ],
  },
  {
    id: 'lean-strong',
    nameEn: 'Lean & Strong',
    nameHe: 'רזה וחזק',
    descEn: 'Four weeks blending lifting with conditioning.',
    descHe: 'ארבעה שבועות שמשלבים כוח וכושר גופני.',
    weeks: 4,
    level: 'intermediate',
    image: runner,
    week: [
      S('upper', 'Upper', 'פלג גוף עליון', ['bench-press', 'barbell-row', 'db-shoulder-press', 'barbell-curl', 'tricep-pushdown']),
      S('lower', 'Lower', 'פלג גוף תחתון', ['back-squat', 'rdl', 'hip-thrust', 'leg-extension', 'standing-calf-raise']),
      S('cond', 'Conditioning', 'כושר גופני', ['burpee', 'jump-rope', 'rowing-machine', 'plank']),
    ],
  },
]

export function planById(id: string): TrainingPlan | undefined {
  return PLANS.find((p) => p.id === id)
}

export function planName(p: TrainingPlan, locale: 'he' | 'en') {
  return locale === 'he' ? p.nameHe : p.nameEn
}
export function sessionName(s: PlanSession, locale: 'he' | 'en') {
  return locale === 'he' ? s.nameHe : s.nameEn
}
