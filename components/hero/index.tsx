'use client'

import { motion, useTransform } from 'framer-motion'
import { useMousePosition } from '@/hooks/use-mouse-position'
import { MagneticButton } from '@/motion'
import { duration, ease } from '@/lib/tokens'
import { cn } from '@/lib/cn'

const FEATURES = [
  { title: 'Unified Knowledge Layer',  desc: 'Every document, conversation, and process connected' },
  { title: 'Organizational Memory',    desc: 'Knowledge compounds instead of disappearing' },
  { title: 'Knowledge Graph',          desc: 'Relationships between teams, workflows, and information' },
  { title: 'AI-Powered Operations',    desc: 'Turn information into coordinated execution' },
  { title: 'Decision Intelligence',    desc: 'Capture context behind every organizational decision' },
]

const D = { headline: 5, panel: -10, atmosphere: -12 } as const

function Appear({
  children,
  delay = 0,
  y = 16,
  className,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.slow, delay, ease: ease.cinematic }}
    >
      {children}
    </motion.div>
  )
}

export function Hero() {
  const mouse = useMousePosition()

  const hlX  = useTransform(mouse.x, [-1, 1], [-D.headline,   D.headline])
  const hlY  = useTransform(mouse.y, [-1, 1], [-D.headline,   D.headline])
  const pnX  = useTransform(mouse.x, [-1, 1], [-D.panel,      D.panel])
  const pnY  = useTransform(mouse.y, [-1, 1], [-D.panel,      D.panel])
  const atmX = useTransform(mouse.x, [-1, 1], [D.atmosphere, -D.atmosphere])
  const atmY = useTransform(mouse.y, [-1, 1], [D.atmosphere, -D.atmosphere])

  return (
    <section className="relative min-h-dvh overflow-hidden bg-[var(--bg)] noise">

      {/* ── Atmospheric bloom ─────────────────────────────── */}
      <motion.div
        className="absolute pointer-events-none select-none"
        style={{ x: atmX, y: atmY, inset: '-15%' }}
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 55% 50% at 72% 48%, rgba(214,210,196,0.042) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 25%, rgba(0,0,0,0.55) 100%)',
          }}
        />
      </motion.div>

      {/* ── Ghost coordinate lines ─────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block" aria-hidden>
        {[35, 68].map((pct) => (
          <div
            key={pct}
            className="absolute left-0 right-0 h-px"
            style={{
              top: `${pct}%`,
              background:
                'linear-gradient(to right, transparent 0%, var(--border-subtle) 20%, var(--border-subtle) 80%, transparent 100%)',
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      {/* ── Two-column layout ──────────────────────────────── */}
      <div className="container-editorial relative min-h-dvh flex items-center">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center w-full pt-32 pb-24">

          {/* Left — Copy ────────────────────────────────────── */}
          <div>

            {/* Status badge */}
            <Appear delay={0.15}>
              <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--accent-dim)] mb-10">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-breath flex-shrink-0"
                  aria-hidden
                />
                <span className="type-label text-[var(--accent)]">
                  Knowledge Operating System
                </span>
              </div>
            </Appear>

            {/* Headline */}
            <motion.h1
              className="type-display"
              style={{ x: hlX, y: hlY }}
            >
              {['Knowledge', 'becomes'].map((line, i) => (
                <span key={line} className="block overflow-hidden leading-[1.05] pb-[0.15em] mb-[-0.15em]">
                  <motion.span
                    className="block"
                    initial={{ y: '105%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    transition={{
                      duration: duration.cinematic,
                      delay: 0.28 + i * 0.15,
                      ease: ease.cinematic,
                    }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
              <span className="block overflow-hidden leading-[1.05] pb-[0.15em]">
                <motion.span
                  className="block text-gradient-accent"
                  initial={{ y: '105%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{
                    duration: duration.cinematic,
                    delay: 0.58,
                    ease: ease.cinematic,
                  }}
                >
                  Operational
                </motion.span>
              </span>
            </motion.h1>

            {/* Body */}
            <Appear delay={0.74} y={12}>
              <div className="mt-10 space-y-4 max-w-md">
                <p className="type-body leading-relaxed">
                  Most organizations drown in disconnected knowledge. SOPs buried in PDFs.
                  Decisions lost in meetings. Critical context disappearing every day.
                </p>
                <p className="type-body leading-relaxed">
                  North transforms scattered knowledge into one continuously evolving
                  intelligence system — the living brain of your organization.
                </p>
              </div>
            </Appear>

            {/* CTAs */}
            <Appear delay={0.92} y={10}>
              <div className="mt-10 flex items-center gap-8">
                <MagneticButton
                  strength={0.3}
                  className={cn(
                    'group flex items-center gap-2',
                    'type-body-sm text-[var(--text-2)]',
                    'hover:text-[var(--accent)] transition-colors duration-fast',
                  )}
                  onClick={() => (window.location.href = '/login')}
                >
                  <span>Dive in</span>
                  <span
                    className="inline-block group-hover:translate-x-1.5 transition-transform duration-fast"
                    aria-hidden
                  >
                    →
                  </span>
                </MagneticButton>

                <button className="type-body-sm text-[var(--subtle)] hover:text-[var(--muted)] transition-colors duration-fast">
                  Explore journey{' '}
                  <span className="opacity-60" aria-hidden>↗</span>
                </button>
              </div>
            </Appear>

            {/* Stats row */}
            <Appear delay={1.12} y={8}>
              <div className="mt-14 pt-8 border-t border-[var(--border)] grid grid-cols-3 gap-6">
                {[
                  ['Upload Knowledge',  'PDFs, Docs, SOPs'],
                  ['Connect Context',   'Teams & Workflows'],
                  ['Build Memory',      'Living Knowledge Graph'],
                ].map(([title, sub]) => (
                  <div key={title}>
                    <p className="type-body-sm text-[var(--text-2)] mb-1.5">{title}</p>
                    <p className="type-label text-[var(--subtle)]">{sub}</p>
                  </div>
                ))}
              </div>
            </Appear>
          </div>

          {/* Right — Feature panel ───────────────────────────── */}
          <motion.div className="relative hidden lg:block" style={{ x: pnX, y: pnY }}>
            <Appear delay={0.46} y={24}>
              {/* Ambient haze behind panel */}
              <div
                className="absolute -inset-8 rounded-full pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(214,210,196,0.02) 0%, transparent 70%)',
                }}
                aria-hidden
              />

              <div className="relative surface-glass rounded-xl p-6 shadow-[var(--shadow-xl)]">

                {/* Panel header */}
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <span className="type-label text-[var(--subtle)] block mb-2">North Core</span>
                    <h3 className="type-headline leading-snug">
                      The Operating System<br />For Organizations
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-lg border border-[var(--border)] bg-[var(--accent-dim)] flex items-center justify-center flex-shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-breath" aria-hidden />
                  </div>
                </div>

                {/* Feature list */}
                <div className="space-y-2">
                  {FEATURES.map(({ title, desc }) => (
                    <div
                      key={title}
                      className="group border-lift rounded-md bg-[var(--surface)] p-4 hover:bg-[var(--surface-2)] transition-colors duration-fast cursor-default"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="type-body-sm text-[var(--text-2)] mb-1">{title}</p>
                          <p className="type-label text-[var(--subtle)]">{desc}</p>
                        </div>
                        <span
                          className="type-body-sm text-[var(--subtle)] group-hover:text-[var(--accent)] transition-colors duration-fast flex-shrink-0 leading-none"
                          aria-hidden
                        >
                          ↗
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </Appear>
          </motion.div>

        </div>
      </div>

      {/* ── Scroll indicator ───────────────────────────────── */}
      <div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center gap-1.5"
        aria-hidden
      >
        <Appear delay={1.45} y={0}>
          <div className="flex flex-col items-center gap-1.5 opacity-30">
            <div className="w-px h-7 bg-gradient-to-b from-[var(--accent)] to-transparent" />
            <div className="w-1 h-1 rounded-full bg-[var(--subtle)] animate-breath" />
          </div>
        </Appear>
      </div>

    </section>
  )
}
