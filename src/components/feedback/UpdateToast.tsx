import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useServiceWorkerUpdate } from '@/platform/pwa/useServiceWorkerUpdate'

export function UpdateToast() {
  const { t } = useTranslation()
  const { needRefresh, update } = useServiceWorkerUpdate()

  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed inset-x-0 bottom-24 z-[2000] mx-auto flex max-w-phone items-center justify-between gap-3 rounded-2xl border border-border bg-surface-2 px-4 py-3 shadow-xl"
        >
          <span className="text-sm">{t('common.updateAvailable')}</span>
          <button onClick={update} className="rounded-xl bg-primary px-3 py-1.5 text-sm font-bold text-primary-fg">
            {t('common.refresh')}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
