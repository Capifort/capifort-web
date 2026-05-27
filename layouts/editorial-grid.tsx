import { cn } from '@/lib/cn'

interface EditorialGridProps {
  children: React.ReactNode
  className?: string
}

/**
 * 12-column asymmetrical grid with fluid gap.
 * Use Tailwind col-span-* on children to set column widths.
 *
 * Common asymmetric layouts:
 *   7/5   — dominant left, supporting right
 *   5/7   — supporting left, dominant right
 *   8/4   — wide content, narrow sidebar
 *   6/6   — balanced split (use sparingly)
 *   12    — full-width (editorials, statements)
 */
export function EditorialGrid({ children, className }: EditorialGridProps) {
  return (
    <div className={cn('grid-editorial', className)}>
      {children}
    </div>
  )
}

// Preset column spans as named exports for common layouts

export const col = {
  full:    'col-span-12',
  half:    'col-span-12 md:col-span-6',
  third:   'col-span-12 md:col-span-4',
  twoThird:'col-span-12 md:col-span-8',
  quarter: 'col-span-12 md:col-span-3',
  dominant:'col-span-12 md:col-span-7',
  support: 'col-span-12 md:col-span-5',
  wide:    'col-span-12 md:col-span-8',
  narrow:  'col-span-12 md:col-span-4',
} as const
