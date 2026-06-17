import { Outlet } from 'react-router-dom'
import { QuickActionSheet } from './QuickActionSheet'
import { UpdateToast } from '@/components/feedback/UpdateToast'

/** App root inside the router: renders the active route + global overlays. */
export function RootLayout() {
  return (
    <>
      <Outlet />
      <QuickActionSheet />
      <UpdateToast />
    </>
  )
}
