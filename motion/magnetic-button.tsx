'use client'

import { useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, type HTMLMotionProps } from 'framer-motion'
import { spring as springTokens } from '@/lib/tokens'

interface MagneticButtonProps extends Omit<HTMLMotionProps<'button'>, 'style'> {
  children: React.ReactNode
  /**
   * How strongly the button follows the cursor.
   * 0 = no pull. 0.3 = subtle. 0.6 = strong.
   */
  strength?: number
  className?: string
}

/**
 * A button that magnetically pulls toward the cursor on hover.
 * Wrap any button content — size/styling is purely the className.
 */
export function MagneticButton({
  children,
  strength = 0.35,
  className,
  onClick,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [hovered, setHovered] = useState(false)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, springTokens.magnetic)
  const y = useSpring(rawY, springTokens.magnetic)

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      rawX.set((e.clientX - (rect.left + rect.width  / 2)) * strength)
      rawY.set((e.clientY - (rect.top  + rect.height / 2)) * strength)
    },
    [rawX, rawY, strength],
  )

  const onLeave = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
    setHovered(false)
  }, [rawX, rawY])

  return (
    <motion.button
      ref={ref}
      className={className}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      onClick={onClick}
      data-hovered={hovered}
      {...props}
    >
      {children}
    </motion.button>
  )
}
