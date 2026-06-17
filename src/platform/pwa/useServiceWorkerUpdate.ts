import { useRegisterSW } from 'virtual:pwa-register/react'

/** registerType:'prompt' — surface an "update available" toast instead of silently swapping assets. */
export function useServiceWorkerUpdate() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({ immediate: true })

  return {
    needRefresh,
    update: () => updateServiceWorker(true),
    dismiss: () => setNeedRefresh(false),
  }
}
