import { useEffect, type ReactNode } from 'react'
import i18n from '@/i18n'
import { useUiStore } from '@/stores/ui.store'

/** Single source of truth for RTL/dir — applies dir/lang to <html> and syncs i18next. */
export function DirectionProvider({ children }: { children: ReactNode }) {
  const locale = useUiStore((s) => s.locale)
  const direction = useUiStore((s) => s.direction)

  useEffect(() => {
    const el = document.documentElement
    el.lang = locale
    el.dir = direction
    if (i18n.language !== locale) void i18n.changeLanguage(locale)
  }, [locale, direction])

  return <>{children}</>
}
