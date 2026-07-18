import { cn } from '@/lib/cn'
import { AmbientGlow } from '@/motion'

interface SpatialPanelProps {
  children: React.ReactNode
  /**
   * Enables ambient cursor glow on hover — costs one extra div.
   * Use for interactive or featured panels only.
   */
  glow?: boolean
  /** Use glass morphism surface instead of flat surface */
  glass?: boolean
  className?: string
}

/**
 * Modular spatial panel — the building block of the dashboard and
 * editorial content sections. Not a card. Not a tile. A panel.
 *
 * Resists the urge to add rounded corners, shadows, and padding
 * uniformly. Use className to control spacing contextually.
 */
export function SpatialPanel({ children, glow = false, glass = false, className }: SpatialPanelProps) {
  const panel = (
    <div
      className={cn(
        glass ? 'surface-glass' : 'surface',
        'p-6',
        glow && 'transition-[border-color] duration-normal ease-cinematic',
        className,
      )}
    >
      {children}
    </div>
  )

  if (glow) {
    return <AmbientGlow className={cn(glass ? 'rounded-md' : 'rounded', className)}>{panel}</AmbientGlow>
  }

  return panel
}
