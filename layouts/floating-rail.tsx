'use client'

import { cn } from '@/lib/cn'

interface FloatingRailProps {
  children: React.ReactNode
  side?: 'left' | 'right'
  className?: string
}

/**
 * Thin vertical navigation rail for the dashboard workspace.
 * Floats over content — not a sidebar. No labels. Icons or symbols only.
 *
 * Position: fixed, inset on the left or right, with vertical padding.
 */
export function FloatingRail({ children, side = 'left', className }: FloatingRailProps) {
  return (
    <aside
      className={cn(
        'fixed top-0 bottom-0 z-float',
        'flex flex-col items-center justify-between',
        'py-6 w-[52px]',
        'surface-glass',
        'border-y-0',
        side === 'left'
          ? 'left-4 border-r border-l-0 rounded-r-lg'
          : 'right-4 border-l border-r-0 rounded-l-lg',
        className,
      )}
      aria-label="Navigation rail"
    >
      {children}
    </aside>
  )
}

// Rail section dividers — use to group icon clusters
export function RailSection({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col items-center gap-1 w-full', className)}>
      {children}
    </div>
  )
}

// Individual rail item — icon button with hover state
interface RailItemProps {
  children: React.ReactNode
  active?: boolean
  label: string
  onClick?: () => void
}

export function RailItem({ children, active, label, onClick }: RailItemProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'flex items-center justify-center',
        'w-8 h-8 rounded',
        'transition-colors duration-fast',
        active
          ? 'text-[var(--accent)] bg-[var(--accent-dim)]'
          : 'text-[var(--subtle)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]',
      )}
    >
      {children}
    </button>
  )
}
