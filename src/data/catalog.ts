/**
 * Static, offline exercise catalog (workout.cool parity, adapted).
 * Bilingual (he/en); attributes are unions filtered in JS. EN is the fallback.
 */
export type Muscle =
  | 'chest' | 'back' | 'lats' | 'shoulders' | 'biceps' | 'triceps' | 'forearms'
  | 'quads' | 'hamstrings' | 'glutes' | 'calves' | 'abs' | 'obliques' | 'lowerBack' | 'traps'
export type Equipment = 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight' | 'kettlebell' | 'bands' | 'ezBar'
export type ExerciseType = 'strength' | 'cardio' | 'stretching' | 'plyometrics'
export type Mechanics = 'compound' | 'isolation'

export interface CatalogExercise {
  id: string
  nameEn: string
  nameHe: string
  primaryMuscle: Muscle
  secondaryMuscles: Muscle[]
  equipment: Equipment
  type: ExerciseType
  mechanics: Mechanics
}

type L = { he: string; en: string }

export const MUSCLE_GROUPS: Muscle[] = [
  'chest', 'back', 'lats', 'shoulders', 'biceps', 'triceps', 'forearms',
  'quads', 'hamstrings', 'glutes', 'calves', 'abs', 'obliques', 'lowerBack', 'traps',
]
export const EQUIPMENT_LIST: Equipment[] = ['barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'kettlebell', 'bands', 'ezBar']

export const MUSCLE_LABELS: Record<Muscle, L> = {
  chest: { he: 'חזה', en: 'Chest' },
  back: { he: 'גב', en: 'Back' },
  lats: { he: 'רוחב גבי', en: 'Lats' },
  shoulders: { he: 'כתפיים', en: 'Shoulders' },
  biceps: { he: 'יד קדמית', en: 'Biceps' },
  triceps: { he: 'יד אחורית', en: 'Triceps' },
  forearms: { he: 'אמות', en: 'Forearms' },
  quads: { he: 'ארבע ראשי', en: 'Quads' },
  hamstrings: { he: 'ירך אחורי', en: 'Hamstrings' },
  glutes: { he: 'ישבן', en: 'Glutes' },
  calves: { he: 'תאומים', en: 'Calves' },
  abs: { he: 'בטן', en: 'Abs' },
  obliques: { he: 'אלכסונים', en: 'Obliques' },
  lowerBack: { he: 'גב תחתון', en: 'Lower back' },
  traps: { he: 'טרפזים', en: 'Traps' },
}

export const EQUIPMENT_LABELS: Record<Equipment, L> = {
  barbell: { he: 'מוט', en: 'Barbell' },
  dumbbell: { he: 'משקולות יד', en: 'Dumbbell' },
  machine: { he: 'מכונה', en: 'Machine' },
  cable: { he: 'כבל', en: 'Cable' },
  bodyweight: { he: 'משקל גוף', en: 'Bodyweight' },
  kettlebell: { he: 'קטלבל', en: 'Kettlebell' },
  bands: { he: 'גומיות', en: 'Bands' },
  ezBar: { he: 'מוט EZ', en: 'EZ bar' },
}

export const TYPE_LABELS: Record<ExerciseType, L> = {
  strength: { he: 'כוח', en: 'Strength' },
  cardio: { he: 'אירובי', en: 'Cardio' },
  stretching: { he: 'מתיחות', en: 'Stretching' },
  plyometrics: { he: 'פליאומטרי', en: 'Plyometrics' },
}

const ex = (
  id: string,
  nameEn: string,
  nameHe: string,
  primaryMuscle: Muscle,
  secondaryMuscles: Muscle[],
  equipment: Equipment,
  mechanics: Mechanics,
  type: ExerciseType = 'strength',
): CatalogExercise => ({ id, nameEn, nameHe, primaryMuscle, secondaryMuscles, equipment, mechanics, type })

export const CATALOG: CatalogExercise[] = [
  // Chest
  ex('bench-press', 'Barbell Bench Press', 'לחיצת חזה במוט', 'chest', ['triceps', 'shoulders'], 'barbell', 'compound'),
  ex('db-bench-press', 'Dumbbell Bench Press', 'לחיצת חזה במשקולות', 'chest', ['triceps', 'shoulders'], 'dumbbell', 'compound'),
  ex('incline-db-press', 'Incline Dumbbell Press', 'לחיצת חזה עליון בשיפוע', 'chest', ['shoulders', 'triceps'], 'dumbbell', 'compound'),
  ex('push-up', 'Push-up', 'שכיבות סמיכה', 'chest', ['triceps', 'shoulders', 'abs'], 'bodyweight', 'compound'),
  ex('cable-fly', 'Cable Fly', 'פרפר בכבל', 'chest', ['shoulders'], 'cable', 'isolation'),
  ex('machine-chest-press', 'Machine Chest Press', 'לחיצת חזה במכונה', 'chest', ['triceps'], 'machine', 'compound'),
  // Back / lats
  ex('pull-up', 'Pull-up', 'מתח', 'lats', ['biceps', 'back', 'forearms'], 'bodyweight', 'compound'),
  ex('lat-pulldown', 'Lat Pulldown', 'פולי עליון', 'lats', ['biceps', 'back'], 'cable', 'compound'),
  ex('barbell-row', 'Barbell Row', 'חתירה במוט', 'back', ['lats', 'biceps', 'lowerBack'], 'barbell', 'compound'),
  ex('seated-cable-row', 'Seated Cable Row', 'חתירה בכבל בישיבה', 'back', ['lats', 'biceps'], 'cable', 'compound'),
  ex('db-row', 'One-Arm Dumbbell Row', 'חתירה ביד אחת', 'back', ['lats', 'biceps'], 'dumbbell', 'compound'),
  ex('deadlift', 'Deadlift', 'דדליפט', 'back', ['glutes', 'hamstrings', 'lowerBack', 'traps'], 'barbell', 'compound'),
  ex('t-bar-row', 'T-Bar Row', 'חתירת T', 'back', ['lats', 'biceps'], 'barbell', 'compound'),
  // Shoulders
  ex('overhead-press', 'Overhead Press', 'לחיצת כתפיים במוט', 'shoulders', ['triceps', 'traps'], 'barbell', 'compound'),
  ex('db-shoulder-press', 'Dumbbell Shoulder Press', 'לחיצת כתפיים במשקולות', 'shoulders', ['triceps'], 'dumbbell', 'compound'),
  ex('lateral-raise', 'Lateral Raise', 'הרחקת כתפיים', 'shoulders', [], 'dumbbell', 'isolation'),
  ex('front-raise', 'Front Raise', 'הרמת כתף קדמית', 'shoulders', [], 'dumbbell', 'isolation'),
  ex('face-pull', 'Face Pull', 'משיכה לפנים', 'shoulders', ['traps', 'back'], 'cable', 'isolation'),
  ex('reverse-fly', 'Reverse Fly', 'פרפר הפוך', 'shoulders', ['traps'], 'dumbbell', 'isolation'),
  // Biceps
  ex('barbell-curl', 'Barbell Curl', 'כפיפת מרפק במוט', 'biceps', ['forearms'], 'barbell', 'isolation'),
  ex('db-curl', 'Dumbbell Curl', 'כפיפת מרפק במשקולות', 'biceps', ['forearms'], 'dumbbell', 'isolation'),
  ex('hammer-curl', 'Hammer Curl', 'כפיפת פטיש', 'biceps', ['forearms'], 'dumbbell', 'isolation'),
  ex('cable-curl', 'Cable Curl', 'כפיפת מרפק בכבל', 'biceps', ['forearms'], 'cable', 'isolation'),
  ex('preacher-curl', 'Preacher Curl', 'כפיפת מטיף', 'biceps', [], 'ezBar', 'isolation'),
  // Triceps
  ex('tricep-pushdown', 'Triceps Pushdown', 'פשיטת מרפק בכבל', 'triceps', [], 'cable', 'isolation'),
  ex('overhead-extension', 'Overhead Triceps Extension', 'פשיטת מרפק מעל הראש', 'triceps', [], 'dumbbell', 'isolation'),
  ex('close-grip-bench', 'Close-Grip Bench Press', 'לחיצה צרה', 'triceps', ['chest', 'shoulders'], 'barbell', 'compound'),
  ex('dips', 'Dips', 'מקבילים', 'triceps', ['chest', 'shoulders'], 'bodyweight', 'compound'),
  ex('skullcrusher', 'Skullcrusher', 'מכסחת', 'triceps', [], 'ezBar', 'isolation'),
  // Quads
  ex('back-squat', 'Back Squat', 'סקוואט', 'quads', ['glutes', 'hamstrings', 'lowerBack'], 'barbell', 'compound'),
  ex('front-squat', 'Front Squat', 'סקוואט קדמי', 'quads', ['glutes', 'abs'], 'barbell', 'compound'),
  ex('leg-press', 'Leg Press', 'לחיצת רגליים', 'quads', ['glutes', 'hamstrings'], 'machine', 'compound'),
  ex('leg-extension', 'Leg Extension', 'פשיטת ברך', 'quads', [], 'machine', 'isolation'),
  ex('lunge', 'Walking Lunge', 'מספריים', 'quads', ['glutes', 'hamstrings'], 'dumbbell', 'compound'),
  ex('goblet-squat', 'Goblet Squat', 'סקוואט גביע', 'quads', ['glutes'], 'kettlebell', 'compound'),
  // Hamstrings / glutes
  ex('rdl', 'Romanian Deadlift', 'דדליפט רומני', 'hamstrings', ['glutes', 'lowerBack'], 'barbell', 'compound'),
  ex('leg-curl', 'Leg Curl', 'כפיפת ברך', 'hamstrings', [], 'machine', 'isolation'),
  ex('good-morning', 'Good Morning', 'גוד מורנינג', 'hamstrings', ['glutes', 'lowerBack'], 'barbell', 'compound'),
  ex('hip-thrust', 'Hip Thrust', 'הרמת אגן', 'glutes', ['hamstrings'], 'barbell', 'compound'),
  ex('bulgarian-split-squat', 'Bulgarian Split Squat', 'סקוואט בולגרי', 'glutes', ['quads', 'hamstrings'], 'dumbbell', 'compound'),
  ex('cable-kickback', 'Glute Kickback', 'בעיטת ישבן בכבל', 'glutes', [], 'cable', 'isolation'),
  // Calves
  ex('standing-calf-raise', 'Standing Calf Raise', 'הרמת עקבים בעמידה', 'calves', [], 'machine', 'isolation'),
  ex('seated-calf-raise', 'Seated Calf Raise', 'הרמת עקבים בישיבה', 'calves', [], 'machine', 'isolation'),
  // Core
  ex('plank', 'Plank', 'פלאנק', 'abs', ['obliques', 'lowerBack'], 'bodyweight', 'isolation'),
  ex('hanging-leg-raise', 'Hanging Leg Raise', 'הרמת רגליים בתלייה', 'abs', ['obliques'], 'bodyweight', 'isolation'),
  ex('cable-crunch', 'Cable Crunch', 'כפיפת בטן בכבל', 'abs', [], 'cable', 'isolation'),
  ex('russian-twist', 'Russian Twist', 'טוויסט רוסי', 'obliques', ['abs'], 'bodyweight', 'isolation'),
  ex('ab-wheel', 'Ab Wheel Rollout', 'גלגל בטן', 'abs', ['obliques', 'shoulders'], 'bodyweight', 'compound'),
  // Cardio
  ex('treadmill', 'Treadmill Run', 'ריצה על הליכון', 'quads', ['calves', 'hamstrings'], 'machine', 'compound', 'cardio'),
  ex('rowing-machine', 'Rowing Machine', 'חתירה אירובית', 'back', ['lats', 'quads'], 'machine', 'compound', 'cardio'),
  ex('jump-rope', 'Jump Rope', 'קפיצה בחבל', 'calves', ['shoulders'], 'bodyweight', 'compound', 'cardio'),
  ex('burpee', 'Burpee', 'ברפי', 'chest', ['quads', 'abs', 'shoulders'], 'bodyweight', 'compound', 'plyometrics'),
]

export function exerciseById(id: string): CatalogExercise | undefined {
  return CATALOG.find((e) => e.id === id)
}

export function exerciseName(e: CatalogExercise, locale: 'he' | 'en'): string {
  return locale === 'he' ? e.nameHe : e.nameEn
}

/** workout.cool filter semantics: ANY selected equipment AND ANY selected muscle (primary or secondary). */
export function filterExercises(equipment: Equipment[], muscles: Muscle[]): CatalogExercise[] {
  return CATALOG.filter(
    (e) =>
      (equipment.length === 0 || equipment.includes(e.equipment)) &&
      (muscles.length === 0 || muscles.includes(e.primaryMuscle) || e.secondaryMuscles.some((m) => muscles.includes(m))),
  )
}
