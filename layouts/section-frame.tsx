import { cn } from '@/lib/cn'

interface SectionFrameProps {
  children: React.ReactNode
  /**
   * sm — compact section spacing
   * md — standard section spacing  (default)
   * lg — cinematic breathing room (hero-scale)
   */
  size?: 'sm' | 'md' | 'lg'
  id?: string
  className?: string
  as?: 'section' | 'div' | 'article'
}

export function SectionFrame({
  children,
  size = 'md',
  id,
  className,
  as: Tag = 'section',
}: SectionFrameProps) {
  return (
    <Tag
      id={id}
      className={cn(
        size === 'sm' && 'section-frame-sm',
        size === 'md' && 'section-frame',
        size === 'lg' && 'py-[clamp(128px,18vh,320px)]',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
