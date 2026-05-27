import { cn } from '@/lib/cn'

interface ContainerProps {
  children: React.ReactNode
  /**
   * editorial — 1440px max, generous fluid padding  (default)
   * tight     —  960px max, tighter padding (articles, forms)
   * full      — no max-width, only horizontal padding
   */
  size?: 'editorial' | 'tight' | 'full'
  className?: string
}

export function Container({ children, size = 'editorial', className }: ContainerProps) {
  return (
    <div
      className={cn(
        size === 'editorial' && 'container-editorial',
        size === 'tight'    && 'container-tight',
        size === 'full'     && 'container-full',
        className,
      )}
    >
      {children}
    </div>
  )
}
