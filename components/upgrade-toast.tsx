'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { onFeatureBlocked, FeatureNotEnabledError } from '@/lib/api'
import Link from 'next/link'
import { ease, duration } from '@/lib/tokens'

export function UpgradeToast() {
  const [event, setEvent] = useState<{ feature: string; message: string } | null>(null)

  useEffect(() => {
    return onFeatureBlocked((err: FeatureNotEnabledError) => {
      setEvent({ feature: err.feature, message: err.message })
    })
  }, [])

  useEffect(() => {
    if (!event) return
    const t = setTimeout(() => setEvent(null), 6000)
    return () => clearTimeout(t)
  }, [event])

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-toast max-w-[340px]"
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: duration.normal, ease: ease.cinematic }}
        >
          <div className="surface-glass rounded-xl p-4 flex items-start gap-3 shadow-[var(--shadow-xl)]">
            {/* Lock icon */}
            <div className="w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--accent-dim)] flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <p className="type-body-sm text-[var(--text-2)] mb-0.5">Feature locked</p>
              <p className="type-label text-[var(--subtle)] leading-relaxed">{event.message}</p>
              <div className="flex items-center gap-4 mt-3">
                <Link
                  href="/pricing"
                  className="type-label text-[var(--accent)] hover:text-[var(--accent-warm)] transition-colors duration-fast"
                >
                  View plans →
                </Link>
                <button
                  type="button"
                  onClick={() => setEvent(null)}
                  className="type-label text-[var(--subtle)] hover:text-[var(--muted)] transition-colors duration-fast"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
