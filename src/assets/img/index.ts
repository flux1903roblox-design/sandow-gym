import boxer from './boxer.webp'
import back from './back.webp'
import runner from './runner.webp'
import trainer from './trainer.webp'
import user from './user.webp'

const CATEGORY: Record<string, string> = {
  back,
  upper: back,
  boxing: boxer,
  cardio: runner,
  legs: boxer,
}

export function heroForCategory(category: string): string {
  return CATEGORY[category] ?? boxer
}

export function heroForActivity(activity: string): string {
  const k = activity.toLowerCase()
  if (/box/.test(k)) return boxer
  if (/jog|run/.test(k)) return runner
  if (/back|strength|upper/.test(k)) return back
  return boxer
}

export const TRAINER_PHOTO = trainer
export const USER_PHOTO = user
