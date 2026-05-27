'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { MagneticButton } from '@/motion'
import { cn } from '@/lib/cn'

const NAV_LINKS = [
  { label: 'Philosophy',   href: '#philosophy' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Vision',       href: '#vision' },
]

const navVariants = {
  top: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    backdropFilter:  'blur(0px) saturate(1)',
    borderColor:     'rgba(255, 255, 255, 0)',
    boxShadow:       '0 0 0 0 rgba(0,0,0,0)',
  },
  scrolled: {
    backgroundColor: 'rgba(13, 13, 13, 0.82)',
    backdropFilter:  'blur(20px) saturate(1.4)',
    borderColor:     'rgba(255, 255, 255, 0.07)',
    boxShadow:       '0 1px 0 0 rgba(255,255,255,0.04)',
  },
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed top-0 inset-x-0 z-float flex items-start justify-center pt-5 px-5 md:px-8 pointer-events-none">
      <motion.div
        className={cn(
          'w-full max-w-6xl',
          'flex items-center justify-between',
          'px-5 py-3 rounded-full',
          'border pointer-events-auto',
        )}
        variants={navVariants}
        animate={scrolled ? 'scrolled' : 'top'}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="type-label text-[var(--accent)] hover:text-[var(--accent-warm)] transition-colors duration-fast"
        >
          NORTH
        </Link>

        {/* Center nav links */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="type-body-sm text-reveal"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link href="/login">
          <MagneticButton
            strength={0.2}
            className={cn(
              'hidden md:flex items-center gap-1.5',
              'type-label text-[var(--subtle)] hover:text-[var(--accent)]',
              'transition-colors duration-fast',
            )}
            aria-label="Dive in"
          >
            <span>Dive in</span>
            <span aria-hidden>→</span>
          </MagneticButton>
        </Link>

        {/* Mobile menu hint */}
        <button
          className="md:hidden type-label text-[var(--subtle)]"
          aria-label="Open menu"
        >
          ——
        </button>
      </motion.div>
    </header>
  )
}
