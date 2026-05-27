'use client'

import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'
import { color as c, spring } from '@/lib/tokens'

interface CursorLightProps {
  /**
   * RGB string without rgba(), e.g. "214, 210, 196"
   */
  color?: string
  /** Glow radius in px */
  size?: number
  /** Max glow opacity — keep very low (0.02–0.06) for subtlety */
  intensity?: number
}

/**
 * Full-viewport cursor light overlay.
 * Place once inside the root layout, as a sibling of <body> children.
 * Requires a parent with `position: relative` or place at viewport level.
 */
export function CursorLight({
  color = c.rgb.accent,
  size = 700,
  intensity = 0.04,
}: CursorLightProps) {
  // Start off-screen so the glow doesn't flash at 0,0 on mount
  const rawX = useMotionValue(-size)
  const rawY = useMotionValue(-size)
  const x = useSpring(rawX, spring.cursor)
  const y = useSpring(rawY, spring.cursor)

  const background = useMotionTemplate`radial-gradient(${size}px at ${x}px ${y}px, rgba(${color}, ${intensity}), transparent 80%)`

  useEffect(() => {
    const move = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [rawX, rawY])

  return (
    <motion.div
      className="pointer-events-none fixed inset-0"
      style={{ background, zIndex: 100 }}
      aria-hidden
    />
  )
}
