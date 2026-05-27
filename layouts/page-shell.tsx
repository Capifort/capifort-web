import { Nav } from '@/components/nav'
import { CursorLight } from '@/motion'

/**
 * Root page wrapper.
 * Provides: floating nav, viewport cursor light, and a slot for page content.
 * Server component — children may be server or client.
 */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CursorLight />
      <Nav />
      <main className="relative">{children}</main>
    </>
  )
}
