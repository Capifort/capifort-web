'use client'

import { useEffect } from 'react'
import { useMotionValue, useSpring, type MotionValue } from 'framer-motion'

interface MousePosition {
  x: MotionValue<number>  // normalized: -1 (left) to +1 (right)
  y: MotionValue<number>  // normalized: -1 (top)  to +1 (bottom)
}

/**
 * Returns spring-smoothed normalized mouse coordinates.
 * -1 to +1 across each axis, centered at viewport midpoint.
 *
 * Each depth layer calls useTransform(x, [-1,1], [-depth, depth])
 * with its own depth coefficient to create the parallax effect.
 */
export function useMousePosition(): MousePosition {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const x = useSpring(rawX, { stiffness: 35, damping: 25, mass: 1 })
  const y = useSpring(rawY, { stiffness: 35, damping: 25, mass: 1 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth  - 0.5) * 2)
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [rawX, rawY])

  return { x, y }
}
