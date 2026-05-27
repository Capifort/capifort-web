import { TimeDisplay } from './time-display'

export function StatusBar() {
  return (
    <header className="sticky top-0 z-raised flex items-center justify-between px-8 h-10 border-b border-[var(--border)] bg-[var(--bg)]">

      {/* Left — context breadcrumb */}
      <div className="flex items-center gap-4">
        <span className="type-label text-[var(--accent)]">NORTH</span>
        <span className="text-[var(--border)] select-none">·</span>
        <span className="type-label text-[var(--subtle)]">Workspace</span>
      </div>

      {/* Right — system status + time */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-breath flex-shrink-0"
            aria-hidden
          />
          <span className="type-label hidden md:block">All systems operational</span>
        </div>
        <TimeDisplay />
      </div>

    </header>
  )
}
