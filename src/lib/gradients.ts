/** Deterministic gradient classes for image-less hero blocks (offline-friendly). */
export function categoryGradient(category: string): string {
  const map: Record<string, string> = {
    back: 'from-primary to-orange-700',
    upper: 'from-secondary to-blue-700',
    boxing: 'from-rose-500 to-red-800',
    cardio: 'from-success to-emerald-700',
    legs: 'from-fuchsia-500 to-purple-800',
  }
  return map[category] ?? 'from-surface-3 to-surface'
}

export function activityGradient(activity: string): string {
  const key = activity.toLowerCase()
  if (key.includes('box')) return 'from-rose-500 to-red-800'
  if (key.includes('jog') || key.includes('run')) return 'from-success to-emerald-700'
  if (key.includes('back') || key.includes('strength')) return 'from-primary to-orange-700'
  return 'from-secondary to-blue-700'
}
