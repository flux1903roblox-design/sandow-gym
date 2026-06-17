import { useEffect, useState, type ReactNode } from 'react'
import { db } from '@/db'
import { seedDatabase } from '@/db/seed/seed'
import { getSettings } from '@/db/repositories/settingsRepo'
import { useUiStore } from '@/stores/ui.store'

function BootSplash({ message }: { message?: string }) {
  return (
    <div className="min-h-dvh grid place-items-center bg-bg text-foreground">
      <div className="flex flex-col items-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-primary shadow-glow animate-pulse" />
        <p className="text-sm text-muted">{message}</p>
      </div>
    </div>
  )
}

/**
 * Opens the local DB, runs the idempotent seed, loads settings into the UI store,
 * then renders the app. This gate guarantees router loaders always have data.
 */
export function AppBootstrap({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hydrate = useUiStore((s) => s.hydrate)

  useEffect(() => {
    let active = true
    void (async () => {
      try {
        await db.open()
        await seedDatabase()
        const settings = await getSettings()
        if (!active) return
        hydrate({ locale: settings.locale, direction: settings.direction })
        setReady(true)
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : String(e))
      }
    })()
    return () => {
      active = false
    }
  }, [hydrate])

  if (error) return <BootSplash message={error} />
  if (!ready) return <BootSplash message="Sandow" />
  return <>{children}</>
}
