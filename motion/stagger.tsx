'use client'

import { motion, type Variants } from 'framer-motion'
import { ease, duration } from '@/lib/tokens'

// ── Stagger container ──────────────────────────────────

interface StaggerProps {
  children: React.ReactNode
  staggerDelay?: number
  initialDelay?: number
  once?: boolean
  className?: string
}

export function Stagger({
  children,
  staggerDelay = 0.08,
  initialDelay = 0,
  once = true,
  className,
}: StaggerProps) {
  const containerVariants: Variants = {
    hidden:  {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-6%' }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  )
}

// ── Stagger item — must be a direct child of <Stagger> ─

export const staggerItemVariants: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.cinematic },
  },
}

interface StaggerItemProps {
  children: React.ReactNode
  className?: string
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div className={className} variants={staggerItemVariants}>
      {children}
    </motion.div>
  )
}
