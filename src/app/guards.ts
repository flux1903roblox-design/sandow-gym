import { redirect } from 'react-router-dom'
import { getSettings } from '@/db/repositories/settingsRepo'
import { getUser } from '@/db/repositories/userRepo'
import { getDeclaration } from '@/db/repositories/healthRepo'

/**
 * Gate every in-app route behind a completed onboarding + an approved (or
 * certificate-pending-resolved) health declaration. Runs in a loader so it is
 * robust against deep-links and refreshes.
 */
export async function rootLoader() {
  const settings = await getSettings()
  if (!settings.onboardingComplete) return redirect('/onboarding')

  const user = await getUser()
  if (user) {
    const declaration = await getDeclaration(user.id)
    if (declaration && declaration.status === 'pending_certificate') {
      return redirect('/onboarding/certificate')
    }
  }
  return null
}
