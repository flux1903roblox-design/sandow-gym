import { BottomNav } from './BottomNav'
import { ScreenTransition } from './ScreenTransition'

/** Layout for the primary tab screens: scrollable content + bottom nav. */
export function TabShell() {
  return (
    <div className="flex h-full flex-col">
      <main className="no-scrollbar flex-1 overflow-y-auto">
        <ScreenTransition />
      </main>
      <BottomNav />
    </div>
  )
}
