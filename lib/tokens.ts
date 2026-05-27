/**
 * NORTH — JS/TS Design Tokens
 *
 * Mirror of styles/tokens.css for runtime use.
 * Required for Framer Motion (can't use CSS vars in animation values)
 * and any canvas/WebGL rendering.
 */

// ── Easing ─────────────────────────────────────────────
// Cubic-bezier tuples for use in Framer Motion's transition.ease

export const ease = {
  smooth:    [0.25, 0.10, 0.25, 1.00] as const,
  cinematic: [0.16, 1.00, 0.30, 1.00] as const,  // primary ease — decelerate hard
  swift:     [0.40, 0.00, 0.20, 1.00] as const,
  reveal:    [0.77, 0.00, 0.175, 1.00] as const,  // clip-path reveals
  spring:    [0.34, 1.56, 0.64, 1.00] as const,   // slight overshoot
  out:       [0.00, 0.00, 0.20, 1.00] as const,
  in:        [0.40, 0.00, 1.00, 1.00] as const,
} as const

export type EaseName = keyof typeof ease


// ── Duration ───────────────────────────────────────────
// Seconds — Framer Motion uses seconds, CSS uses ms.

export const duration = {
  instant:   0.08,
  fast:      0.18,
  normal:    0.36,
  slow:      0.64,
  cinematic: 1.10,
  epic:      2.00,
} as const

export type DurationName = keyof typeof duration


// ── Spring configs ─────────────────────────────────────
// Ready-to-spread into Framer Motion transition objects

export const spring = {
  gentle:   { type: 'spring', stiffness:  60, damping: 20, mass: 1.0 } as const,
  smooth:   { type: 'spring', stiffness:  80, damping: 20, mass: 0.8 } as const,
  snappy:   { type: 'spring', stiffness: 150, damping: 15, mass: 0.1 } as const,
  magnetic: { type: 'spring', stiffness: 150, damping: 15, mass: 0.1 } as const,
  cursor:   { type: 'spring', stiffness:  50, damping: 20, mass: 1.0 } as const,
} as const

export type SpringName = keyof typeof spring


// ── Colors ─────────────────────────────────────────────
// Hex/rgba values for canvas, WebGL, and dynamic gradient generation

export const color = {
  bg:          '#060606',
  surface:     '#0d0d0d',
  surface2:    '#111111',
  surface3:    '#161616',
  text:        '#f3f3f1',
  text2:       '#c8c8c4',
  muted:       '#9d9d98',
  subtle:      '#5a5a56',
  accent:      '#d6d2c4',
  accentWarm:  '#e8e0cc',
  accentCool:  '#b8c4cc',

  // RGB component strings for use in rgba() constructions
  rgb: {
    accent:     '214, 210, 196',
    accentWarm: '232, 224, 204',
    text:       '243, 243, 241',
    subtle:     '90, 90, 86',
  },
} as const


// ── Spacing ────────────────────────────────────────────
// Pixel values for runtime calculations (viewport math, etc.)

export const space = {
  1:  4,
  2:  8,
  3:  12,
  4:  16,
  5:  20,
  6:  24,
  8:  32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
  40: 160,
  48: 192,
  64: 256,
} as const


// ── Z-Index ────────────────────────────────────────────

export const zIndex = {
  base:    0,
  raised:  10,
  float:   20,
  overlay: 30,
  modal:   40,
  toast:   50,
  cursor:  100,
} as const


// ── Motion variant presets ─────────────────────────────
// Reusable Framer Motion variant objects

export const variants = {
  fadeIn: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: duration.normal, ease: ease.cinematic } },
  },
  fadeUp: {
    hidden:  { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.cinematic } },
  },
  fadeDown: {
    hidden:  { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.cinematic } },
  },
  revealUp: {
    hidden:  { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
    visible: { clipPath: 'inset(0% 0 0 0)', opacity: 1, transition: { duration: duration.cinematic, ease: ease.reveal } },
  },
  scaleIn: {
    hidden:  { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1, transition: { duration: duration.normal, ease: ease.cinematic } },
  },
  staggerContainer: (staggerDelay = 0.08, delayChildren = 0) => ({
    hidden:  {},
    visible: { transition: { staggerChildren: staggerDelay, delayChildren } },
  }),
} as const
