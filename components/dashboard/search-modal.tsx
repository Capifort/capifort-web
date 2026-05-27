'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search, Activity, Zap, Settings2, ArrowRight } from 'lucide-react'
import { ease, duration } from '@/lib/tokens'
import { cn } from '@/lib/cn'

// ── Static command data ───────────────────────────────

const recent = [
  { icon: Activity, label: 'payment-gateway-prod',        sub: 'Open service' },
  { icon: Zap,      label: 'INC-0847 — Latency anomaly',  sub: 'Open incident' },
  { icon: Activity, label: 'auth-service-prod',           sub: 'Open service' },
]

const commands = [
  { icon: Activity,  label: 'View operational timeline',   shortcut: 'T' },
  { icon: Zap,       label: 'Open intelligence layer',      shortcut: 'I' },
  { icon: Settings2, label: 'Configure alerting',           shortcut: ',' },
]

// ── Result row ────────────────────────────────────────

function ResultRow({
  icon: Icon,
  label,
  sub,
  shortcut,
  className,
}: {
  icon: React.ElementType
  label: string
  sub?: string
  shortcut?: string
  className?: string
}) {
  return (
    <button
      className={cn(
        'w-full flex items-center gap-3 px-4 py-2.5 rounded',
        'text-left group',
        'hover:bg-[var(--surface-3)] transition-colors duration-fast',
        className,
      )}
    >
      <Icon
        size={14}
        strokeWidth={1.5}
        className="text-[var(--subtle)] group-hover:text-[var(--muted)] transition-colors flex-shrink-0"
      />
      <span className="flex-1 min-w-0">
        <span className="type-body-sm text-[var(--text-2)] block truncate">{label}</span>
        {sub && (
          <span className="type-label text-[var(--subtle)] block">{sub}</span>
        )}
      </span>
      {shortcut && (
        <kbd className="type-label text-[var(--subtle)] bg-[var(--surface)] border border-[var(--border)] px-1.5 py-0.5 rounded flex-shrink-0">
          {shortcut}
        </kbd>
      )}
      {!shortcut && (
        <ArrowRight
          size={12}
          className="text-[var(--subtle)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          aria-hidden
        />
      )}
    </button>
  )
}

// ── Search modal ──────────────────────────────────────

interface SearchModalProps {
  onClose: () => void
}

export function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Small delay so the animation settles before focus
    const t = setTimeout(() => inputRef.current?.focus(), 60)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-overlay"
        style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: duration.fast, ease: ease.smooth }}
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <motion.div
        className="fixed z-modal top-[18%] left-1/2 -translate-x-1/2 w-full max-w-lg px-4"
        initial={{ opacity: 0, scale: 0.97, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: -6 }}
        transition={{ duration: duration.normal, ease: ease.cinematic }}
        role="dialog"
        aria-modal
        aria-label="Search"
      >
        <div className="surface-glass rounded-lg overflow-hidden shadow-[var(--shadow-xl)]">

          {/* Input row */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border)]">
            <Search size={15} strokeWidth={1.5} className="text-[var(--subtle)] flex-shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search or jump to…"
              className="flex-1 bg-transparent type-body-sm text-[var(--text)] placeholder:text-[var(--subtle)] outline-none"
            />
            <kbd className="type-label text-[var(--subtle)] border border-[var(--border)] px-1.5 py-0.5 rounded flex-shrink-0">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="p-2 max-h-[380px] overflow-y-auto">

            {/* Recent */}
            <p className="type-label text-[var(--subtle)] px-4 py-2 mt-1">Recent</p>
            {recent.map((item) => (
              <ResultRow
                key={item.label}
                icon={item.icon}
                label={item.label}
                sub={item.sub}
              />
            ))}

            {/* Divider */}
            <div className="h-px bg-[var(--border-subtle)] mx-4 my-2" />

            {/* Commands */}
            <p className="type-label text-[var(--subtle)] px-4 py-2">Commands</p>
            {commands.map((cmd) => (
              <ResultRow
                key={cmd.label}
                icon={cmd.icon}
                label={cmd.label}
                shortcut={cmd.shortcut}
              />
            ))}

          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-[var(--border)]">
            <div className="flex items-center gap-4">
              <span className="type-label text-[var(--subtle)] flex items-center gap-1.5">
                <kbd className="border border-[var(--border)] px-1 rounded" style={{ fontSize: '9px' }}>↑</kbd>
                <kbd className="border border-[var(--border)] px-1 rounded" style={{ fontSize: '9px' }}>↓</kbd>
                Navigate
              </span>
              <span className="type-label text-[var(--subtle)] flex items-center gap-1.5">
                <kbd className="border border-[var(--border)] px-1 rounded" style={{ fontSize: '9px' }}>↵</kbd>
                Open
              </span>
            </div>
            <span className="type-label text-[var(--subtle)]">North Search</span>
          </div>

        </div>
      </motion.div>
    </>
  )
}
