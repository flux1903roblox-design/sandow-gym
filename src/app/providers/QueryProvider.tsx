import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'

// TanStack Query is wired now but unused for reads (Dexie useLiveQuery handles those).
// When a backend lands, mutations + server cache route through here without screen changes.
export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, retry: 1 } } }),
  )
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
