'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Layers, X } from 'lucide-react'
import { ease, duration } from '@/lib/tokens'
import { cn } from '@/lib/cn'
import { createWorkspace } from '@/lib/workspace-api'

const inputCls =
  'w-full bg-[var(--surface)] border border-[var(--border)] rounded-md px-3.5 py-2.5 ' +
  'type-body-sm text-[var(--text)] placeholder:text-[var(--subtle)] ' +
  'focus:outline-none focus:border-[var(--border-focus)] transition-colors duration-fast'

interface CreateWorkspaceModalProps {
  onClose: () => void
  onCreated?: (workspace: { id: string; name: string }) => void
}

export function CreateWorkspaceModal({ onClose, onCreated }: CreateWorkspaceModalProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 60)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Workspace name is required')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const workspace = await createWorkspace(trimmed)
      onCreated?.(workspace)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to create workspace')
      setSubmitting(false)
    }
  }

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
        onClick={submitting ? undefined : onClose}
        aria-hidden
      />

      {/* Panel */}
      <motion.div
        className="fixed z-modal top-[22%] left-1/2 -translate-x-1/2 w-full max-w-md px-4"
        initial={{ opacity: 0, scale: 0.97, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: -6 }}
        transition={{ duration: duration.normal, ease: ease.cinematic }}
        role="dialog"
        aria-modal
        aria-label="Create workspace"
      >
        <form
          onSubmit={handleSubmit}
          className="surface-glass rounded-lg overflow-hidden shadow-[var(--shadow-xl)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--accent-dim)] flex items-center justify-center text-[var(--accent)] flex-shrink-0">
                <Layers size={15} strokeWidth={1.5} />
              </div>
              <span className="dash-card-title text-[var(--text)]">Create Workspace</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-[var(--subtle)] hover:text-[var(--muted)] transition-colors duration-fast flex-shrink-0"
              aria-label="Close"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-5">
            <label className="dash-small-label text-[var(--muted)] block mb-2">
              Workspace name
            </label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError('') }}
              placeholder="e.g. Finance Workspace"
              disabled={submitting}
              className={inputCls}
            />
            {error && (
              <p className="dash-caption text-[var(--accent-warm)] mt-2">{error}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 px-5 py-4 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="dash-body dash-button px-4 py-2 rounded-md text-[var(--muted)] hover:text-[var(--text-2)] transition-colors duration-fast"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={cn(
                'dash-body dash-button px-4 py-2 rounded-md',
                'bg-[var(--text)] text-[var(--inverse)]',
                'hover:opacity-90 transition-opacity duration-fast',
                submitting && 'opacity-60 cursor-default',
              )}
            >
              {submitting ? 'Creating…' : 'Create Workspace'}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  )
}
