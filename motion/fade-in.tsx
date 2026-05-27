'use client'

import { motion, type Variants, type HTMLMotionProps } from 'framer-motion'
import { ease, duration } from '@/lib/tokens'

interface FadeInProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'whileInView' | 'variants'> {
  children: React.ReactNode
  delay?: number
  dur?: number
  y?: number
  x?: number
  once?: boolean
  className?: string
}

export function FadeIn({
  children,
  delay = 0,
  dur = duration.slow,
  y = 20,
  x = 0,
  once = true,
  className,
  ...props
}: FadeInProps) {
  const variants: Variants = {
    hidden:  { opacity: 0, y, x },
    visible: { opacity: 1, y: 0, x: 0 },
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-8%' }}
      variants={variants}
      transition={{ duration: dur, delay, ease: ease.cinematic }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
