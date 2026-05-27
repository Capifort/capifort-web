'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ParallaxLayerProps {
  children: React.ReactNode
  /**
   * Parallax speed multiplier.
   * Positive = moves slower than scroll (foreground feel).
   * Negative = moves faster than scroll (background feel).
   * Range: -1 to 1. Typical values: 0.2–0.5.
   */
  speed?: number
  className?: string
}

export function ParallaxLayer({ children, speed = 0.3, className }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const yRange = speed * 120
  const y = useTransform(scrollYProgress, [0, 1], [`${-yRange}px`, `${yRange}px`])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ''}`}>
      <motion.div style={{ y }} className="will-transform">
        {children}
      </motion.div>
    </div>
  )
}
