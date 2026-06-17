import { create } from 'zustand'
import type { Direction, Locale } from '@/db/types'
import { patchSettings } from '@/db/repositories/settingsRepo'

interface UiState {
  locale: Locale
  direction: Direction
  quickActionsOpen: boolean
  hydrate: (p: { locale: Locale; direction: Direction }) => void
  setLocale: (locale: Locale) => Promise<void>
  setQuickActionsOpen: (open: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  locale: 'he',
  direction: 'rtl',
  quickActionsOpen: false,
  hydrate: ({ locale, direction }) => set({ locale, direction }),
  setLocale: async (locale) => {
    const direction: Direction = locale === 'he' ? 'rtl' : 'ltr'
    set({ locale, direction })
    await patchSettings({ locale, direction })
  },
  setQuickActionsOpen: (quickActionsOpen) => set({ quickActionsOpen }),
}))
