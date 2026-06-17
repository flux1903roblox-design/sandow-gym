import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, Flame } from 'lucide-react'

/**
 * Mobile-first: the app is a phone-width column.
 *  - phones: fills the screen.
 *  - tablet/desktop: a centered device mockup over a subtle gradient backdrop.
 *  - large desktop: branding panel beside the device so the width reads as intentional.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const features = [t('desktop.f1'), t('desktop.f2'), t('desktop.f3')]

  return (
    <div
      className="relative flex min-h-dvh w-full justify-center sm:items-center sm:p-6 lg:gap-20"
      style={{ background: 'radial-gradient(1100px 700px at 50% -5%, #16181d 0%, #0A0B0D 58%)' }}
    >
      <aside className="hidden w-[320px] shrink-0 lg:block">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary shadow-glow">
            <Flame className="h-7 w-7 text-primary-fg" />
          </div>
          <div>
            <h1 className="text-3xl font-black leading-none">{t('app.name')}</h1>
            <p className="mt-1 text-muted">{t('app.tagline')}</p>
          </div>
        </div>
        <p className="text-lg leading-relaxed text-foreground/80">{t('desktop.hint')}</p>
        <ul className="mt-6 space-y-3">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-3 text-muted">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-success/15 text-success">
                <Check className="h-3.5 w-3.5" />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </aside>

      <div className="relative h-dvh w-full max-w-phone overflow-hidden bg-bg sm:h-[880px] sm:max-h-[94vh] sm:rounded-[2.75rem] sm:border-[7px] sm:border-surface-2 sm:shadow-[0_40px_120px_-24px_rgba(0,0,0,0.85)] sm:ring-1 sm:ring-white/10">
        {children}
      </div>
    </div>
  )
}
