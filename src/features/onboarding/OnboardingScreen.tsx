import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, ShieldCheck, Upload } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { db } from '@/db'
import { base } from '@/db/util'
import { getUser, updateUser } from '@/db/repositories/userRepo'
import { submitDeclaration } from '@/db/repositories/healthRepo'
import { patchSettings } from '@/db/repositories/settingsRepo'
import { requestPersistentStorage } from '@/platform/pwa/persistStorage'
import { useUser } from '@/data/hooks/useUser'
import { useUiStore } from '@/stores/ui.store'
import { cn } from '@/lib/cn'
import type { DeclarationAnswers, User } from '@/db/types'

const QUESTIONS: (keyof DeclarationAnswers)[] = [
  'heartDisease',
  'chestPain',
  'dizzinessFainting',
  'cardiacMedication',
  'familySuddenDeath',
  'supervisedExerciseOrPregnancy',
]

const schema = z.object({
  displayName: z.string().min(2),
  age: z.coerce.number().int().min(10).max(100),
  heightCm: z.coerce.number().min(120).max(230),
  weightKg: z.coerce.number().min(30).max(250),
  goal: z.string().min(1),
})
type ProfileForm = z.infer<typeof schema>

type Step = 'profile' | 'declaration' | 'certificate' | 'done'
type Answers = Record<keyof DeclarationAnswers, boolean | null>

const GOAL_KEYS = ['buildStrength', 'loseWeight', 'stayFit', 'endurance'] as const

export default function OnboardingScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const locale = useUiStore((s) => s.locale)
  const user = useUser()

  const [step, setStep] = useState<Step>(location.pathname.includes('health-declaration') ? 'declaration' : 'profile')
  const [profile, setProfile] = useState<ProfileForm | null>(null)
  const [answers, setAnswers] = useState<Answers>({
    heartDisease: null,
    chestPain: null,
    dizzinessFainting: null,
    cardiacMedication: null,
    familySuddenDeath: null,
    supervisedExerciseOrPregnancy: null,
  })
  const [certName, setCertName] = useState<string>()

  const { register, handleSubmit, formState } = useForm<ProfileForm>({
    resolver: zodResolver(schema),
    values: {
      displayName: user?.displayName ?? '',
      age: user?.age ?? 28,
      heightCm: user?.heightCm ?? 175,
      weightKg: user?.weightKg ?? 75,
      goal: user?.goal ?? 'stayFit',
    },
  })

  const allAnswered = QUESTIONS.every((q) => answers[q] !== null)
  const anyYes = QUESTIONS.some((q) => answers[q] === true)
  const progress = { profile: 0.34, declaration: 0.67, certificate: 0.85, done: 1 }[step]

  const finalize = async (certificateFileName?: string) => {
    const existing = await getUser()
    let userId = existing?.id

    if (profile) {
      const bmi = Number((profile.weightKg / Math.pow(profile.heightCm / 100, 2)).toFixed(1))
      if (existing) {
        await updateUser({
          displayName: profile.displayName,
          age: profile.age,
          heightCm: profile.heightCm,
          weightKg: profile.weightKg,
          goal: profile.goal,
          bmi,
        })
      } else {
        const u: User = {
          ...base(),
          displayName: profile.displayName,
          locale,
          membershipTier: 'free',
          age: profile.age,
          heightCm: profile.heightCm,
          weightKg: profile.weightKg,
          goal: profile.goal,
          bmi,
          sandowScore: 0,
          healthPercent: 60,
          weeklyScores: [60, 60, 60, 60, 60, 60, 60],
        }
        await db.users.put(u)
        userId = u.id
      }
    }
    if (!userId) {
      setStep('profile')
      return
    }

    const finalAnswers = QUESTIONS.reduce((acc, q) => {
      acc[q] = answers[q] === true
      return acc
    }, {} as DeclarationAnswers)

    await submitDeclaration(userId, finalAnswers, profile?.displayName ?? existing?.displayName ?? 'User', certificateFileName)
    await patchSettings({ onboardingComplete: true })
    const persisted = await requestPersistentStorage()
    await patchSettings({ storagePersisted: persisted })
    setStep('done')
  }

  const onProfile = handleSubmit((data) => {
    setProfile(data)
    setStep('declaration')
  })

  const inputClass = 'h-12 w-full rounded-2xl bg-surface px-4 outline-none focus:ring-2 focus:ring-primary/60'

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pt-safe-t">
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 py-6">
        {step === 'profile' && (
          <form id="profile-form" onSubmit={onProfile} className="space-y-4">
            <div>
              <h1 className="text-2xl font-black">{t('onboarding.profileTitle')}</h1>
              <p className="text-muted">{t('onboarding.profileSubtitle')}</p>
            </div>
            <label className="block">
              <span className="mb-1 block text-sm text-muted">{t('onboarding.name')}</span>
              <input className={inputClass} {...register('displayName')} />
            </label>
            <div className="grid grid-cols-3 gap-3">
              <label className="block">
                <span className="mb-1 block text-sm text-muted">{t('onboarding.age')}</span>
                <input type="number" inputMode="numeric" className={inputClass} {...register('age')} />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-muted">{t('onboarding.height')}</span>
                <input type="number" inputMode="numeric" className={inputClass} {...register('heightCm')} />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-muted">{t('onboarding.weight')}</span>
                <input type="number" inputMode="numeric" className={inputClass} {...register('weightKg')} />
              </label>
            </div>
            <label className="block">
              <span className="mb-1 block text-sm text-muted">{t('onboarding.goal')}</span>
              <select className={inputClass} {...register('goal')}>
                {GOAL_KEYS.map((g) => (
                  <option key={g} value={g}>
                    {t(`onboarding.goals.${g}`)}
                  </option>
                ))}
              </select>
            </label>
            {!formState.isValid && formState.isSubmitted && (
              <p className="text-sm text-destructive">—</p>
            )}
          </form>
        )}

        {step === 'declaration' && (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-black">{t('onboarding.declarationTitle')}</h1>
              <p className="mt-1 text-sm text-muted">{t('onboarding.declarationIntro')}</p>
            </div>
            {QUESTIONS.map((q) => (
              <div key={q} className="rounded-2xl bg-surface p-4">
                <p className="text-sm">{t(`onboarding.questions.${q}`)}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setAnswers((a) => ({ ...a, [q]: true }))}
                    className={cn(
                      'flex-1 rounded-xl py-2 text-sm font-bold',
                      answers[q] === true ? 'bg-primary text-primary-fg' : 'bg-surface-2 text-muted',
                    )}
                  >
                    {t('onboarding.yes')}
                  </button>
                  <button
                    onClick={() => setAnswers((a) => ({ ...a, [q]: false }))}
                    className={cn(
                      'flex-1 rounded-xl py-2 text-sm font-bold',
                      answers[q] === false ? 'bg-success text-success-fg' : 'bg-surface-2 text-muted',
                    )}
                  >
                    {t('onboarding.no')}
                  </button>
                </div>
              </div>
            ))}
            <p className="text-center text-xs text-muted-2">{t('onboarding.validityNote')}</p>
          </div>
        )}

        {step === 'certificate' && (
          <div className="space-y-5">
            <div className="flex flex-col items-center text-center">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-warning/15 text-warning">
                <ShieldCheck className="h-8 w-8" />
              </span>
              <h1 className="mt-4 text-2xl font-black">{t('onboarding.certificateTitle')}</h1>
              <p className="mt-1 text-sm text-muted">{t('onboarding.certificateIntro')}</p>
            </div>
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-surface p-8 text-center">
              <Upload className="h-6 w-6 text-primary" />
              <span className="text-sm font-semibold">{t('onboarding.uploadCertificate')}</span>
              {certName && <span className="text-xs text-muted">{t('onboarding.fileChosen', { name: certName })}</span>}
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => setCertName(e.target.files?.[0]?.name)}
              />
            </label>
          </div>
        )}

        {step === 'done' && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-success/15 text-success">
              <CheckCircle2 className="h-10 w-10" />
            </span>
            <h1 className="mt-5 text-2xl font-black">{t('onboarding.approvedTitle')}</h1>
            <p className="mt-1 text-muted">{t('onboarding.approvedSubtitle')}</p>
          </div>
        )}
      </div>

      <div className="border-t border-border p-4 pb-safe-b">
        {step === 'profile' && (
          <Button block type="submit" form="profile-form">
            {t('onboarding.continue')}
          </Button>
        )}
        {step === 'declaration' && (
          <Button block disabled={!allAnswered} onClick={() => (anyYes ? setStep('certificate') : void finalize())}>
            {t('onboarding.continue')}
          </Button>
        )}
        {step === 'certificate' && (
          <Button block disabled={!certName} onClick={() => void finalize(certName)}>
            {t('onboarding.continue')}
          </Button>
        )}
        {step === 'done' && (
          <Button block onClick={() => navigate('/home', { replace: true })}>
            {t('onboarding.finish')}
          </Button>
        )}
      </div>
    </div>
  )
}
