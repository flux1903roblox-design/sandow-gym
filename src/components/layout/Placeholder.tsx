import { useTranslation } from 'react-i18next'
import { AppBar } from '@/components/ui/AppBar'

/** Temporary screen used until a feature screen is implemented. */
export function Placeholder({ title, back = false }: { title: string; back?: boolean }) {
  const { t } = useTranslation()
  return (
    <div className="min-h-full">
      <AppBar title={title} back={back} />
      <div className="grid place-items-center p-16 text-center text-muted">
        <p>
          {title} · {t('common.comingSoon')}
        </p>
      </div>
    </div>
  )
}
