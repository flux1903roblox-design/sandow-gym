import '@/i18n'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/app/router'
import { QueryProvider } from '@/app/providers/QueryProvider'
import { DirectionProvider } from '@/app/providers/DirectionProvider'
import { AppBootstrap } from '@/app/bootstrap'
import { PhoneFrame } from '@/components/layout/PhoneFrame'

export default function App() {
  return (
    <QueryProvider>
      <AppBootstrap>
        <DirectionProvider>
          <PhoneFrame>
            <RouterProvider router={router} />
          </PhoneFrame>
        </DirectionProvider>
      </AppBootstrap>
    </QueryProvider>
  )
}
