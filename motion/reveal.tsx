'use client'

import { motion, type Variants } from 'framer-motion'
import { ease, duration } from '@/lib/tokens'

type Direction = 'up' | 'down' | 'left' | 'right'

interface RevealProps {
  children: React.ReactNode
  direction?: Direction
  delay?: number
  dur?: number
  className?: string
}

const clipVariants: Record<Direction, Variants> = {
  up: {
    hidden:  { clipPath: 'inset(110% 0 -10% 0)', opacity: 0 },
    visible: { clipPath: 'inset(-10% 0 -10% 0)',  opacity: 1 },
  },
  down: {
    hidden:  { clipPath: 'inset(-10% 0 110% 0)', opacity: 0 },
    visible: { clipPath: 'inset(-10% 0 -10% 0)',  opacity: 1 },
  },
  left: {
    hidden:  { clipPath: 'inset(-10% 0 -10% 110%)', opacity: 0 },
    visible: { clipPath: 'inset(-10% 0 -10% -10%)',  opacity: 1 },
  },
  right: {
    hidden:  { clipPath: 'inset(-10% 110% -10% 0)', opacity: 0 },
    visible: { clipPath: 'inset(-10% -10% -10% 0)',  opacity: 1 },
  },
}

export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  dur = duration.cinematic,
  className,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      variants={clipVariants[direction]}
      transition={{ duration: dur, delay, ease: ease.reveal }}
    >
      {children}
    </motion.div>
  )
}
