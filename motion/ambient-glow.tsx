'use client'

import { useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'
import { color as c, spring } from '@/lib/tokens'

interface AmbientGlowProps {
  children: React.ReactNode
  /**
   * RGB string without rgba(), e.g. "214, 210, 196"
   */
  color?: string
  /** Glow radius in px */
  size?: number
  /** Max glow opacity (0–1) */
  intensity?: number
  className?: string
}

export function AmbientGlow({
  children,
  color = c.rgb.accent,
  size = 480,
  intensity = 0.08,
  className,
}: AmbientGlowProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, spring.smooth)
  const y = useSpring(rawY, spring.smooth)

  const background = useMotionTemplate`radial-gradient(${size}px at ${x}px ${y}px, rgba(${color}, ${intensity}), transparent 70%)`

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      rawX.set(e.clientX - rect.left)
      rawY.set(e.clientY - rect.top)
    },
    [rawX, rawY],
  )

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className ?? ''}`}
      onMouseMove={onMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
        style={{ background }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden
      />
      {children}
    </div>
  )
}
