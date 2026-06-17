import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AppBar } from '@/components/ui/AppBar'
import { Toggle } from '@/components/ui/Toggle'
import { SegmentedTabs } from '@/components/ui/SegmentedTabs'
import { Button } from '@/components/ui/Button'
import { useSettings } from '@/data/hooks/useUser'
import { patchSettings } from '@/db/repositories/settingsRepo'
import { useUiStore } from '@/stores/ui.store'
import { useInstallPrompt } from '@/platform/pwa/useInstallPrompt'
import { requestPersistentStorage } from '@/platform/pwa/persistStorage'
import type { Locale } from '@/db/types'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="px-5">
      <h2 className="mb-2 mt-5 text-xs font-bold uppercase tracking-wide text-muted">{title}</h2>
      <div className="divide-y divide-border overflow-hidden rounded-2xl bg-surface">{children}</div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <span className="text-sm">{label}</span>
      {children}
    </div>
  )
}

export default function SettingsScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const settings = useSettings()
  const setLocale = useUiStore((s) => s.setLocale)
  const { canInstall, isIos, isStandalone, promptInstall } = useInstallPrompt()
  if (!settings) return null

  const protect = async () => {
    const ok = await requestPersistentStorage()
    await patchSettings({ storagePersisted: ok })
  }
  const redo = async () => {
    await patchSettings({ onboardingComplete: false })
    navigate('/onboarding')
  }

  return (
    <div className="min-h-full pb-10">
      <AppBar title={t('settings.title')} />

      <Section title={t('settings.appearance')}>
        <Row label={t('settings.language')}>
          <SegmentedTabs
            value={settings.locale}
            onChange={(v) => void setLocale(v as Locale)}
            options={[
              { value: 'he', label: 'עברית' },
              { value: 'en', label: 'EN' },
            ]}
          />
        </Row>
        <Row label={t('settings.units')}>
          <SegmentedTabs
            value={settings.units}
            onChange={(v) => void patchSettings({ units: v })}
            options={[
              { value: 'metric', label: t('settings.metric') },
              { value: 'imperial', label: t('settings.imperial') },
            ]}
          />
        </Row>
      </Section>

      <Section title={t('settings.deviceSync')}>
        <Row label={t('settings.healthKit')}>
          <Toggle
            checked={settings.deviceSync.healthKitEnabled}
            onChange={(v) => void patchSettings({ deviceSync: { ...settings.deviceSync, healthKitEnabled: v } })}
          />
        </Row>
        <Row label={t('settings.healthConnect')}>
          <Toggle
            checked={settings.deviceSync.healthConnectEnabled}
            onChange={(v) => void patchSettings({ deviceSync: { ...settings.deviceSync, healthConnectEnabled: v } })}
          />
        </Row>
      </Section>

      <Section title={t('settings.notifications')}>
        <Row label={t('nav.workouts')}>
          <Toggle
            checked={settings.notifications.workouts}
            onChange={(v) => void patchSettings({ notifications: { ...settings.notifications, workouts: v } })}
          />
        </Row>
        <Row label={t('metrics.hydration')}>
          <Toggle
            checked={settings.notifications.hydration}
            onChange={(v) => void patchSettings({ notifications: { ...settings.notifications, hydration: v } })}
          />
        </Row>
        <Row label={t('coach.title')}>
          <Toggle
            checked={settings.notifications.coach}
            onChange={(v) => void patchSettings({ notifications: { ...settings.notifications, coach: v } })}
          />
        </Row>
      </Section>

      <Section title={t('settings.privacy')}>
        <Row label={t('settings.shareData')}>
          <Toggle checked={settings.privacy.shareData} onChange={(v) => void patchSettings({ privacy: { shareData: v } })} />
        </Row>
        <Row label={t('settings.storage')}>
          <button onClick={protect} className="text-sm font-semibold text-primary">
            {settings.storagePersisted ? t('settings.storageProtected') : t('settings.storageBestEffort')}
          </button>
        </Row>
      </Section>

      {!isStandalone && (
        <div className="mt-5 px-5">
          {canInstall ? (
            <Button block variant="surface" onClick={promptInstall}>
              {t('settings.installApp')}
            </Button>
          ) : isIos ? (
            <p className="rounded-2xl bg-surface p-4 text-center text-sm text-muted">{t('settings.iosInstallHint')}</p>
          ) : null}
        </div>
      )}

      <Section title={t('settings.account')}>
        <button onClick={() => void redo()} className="w-full px-4 py-3 text-start text-sm">
          {t('settings.redoOnboarding')}
        </button>
        <button onClick={() => navigate('/onboarding/health-declaration')} className="w-full px-4 py-3 text-start text-sm">
          {t('settings.healthDeclaration')}
        </button>
      </Section>
    </div>
  )
}
