'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/auth-context'
import { duration, ease } from '@/lib/tokens'
import { cn } from '@/lib/cn'

const ACCOUNT_TYPES = [
  { value: 'individual', label: 'Individual' },
  { value: 'organization', label: 'Organization' },
]

const ENTITY_TYPES = [
  { value: 'individual', label: 'Individual' },
  { value: 'business', label: 'Business' },
  { value: 'enterprise', label: 'Enterprise' },
]

const inputCls =
  'w-full bg-[var(--surface)] border border-[var(--border)] rounded-md px-3.5 py-2.5 ' +
  'type-body-sm text-[var(--text)] placeholder:text-[var(--subtle)] ' +
  'focus:outline-none focus:border-[var(--border-focus)] transition-colors duration-fast'

export default function RegisterPage() {
  const [accountType, setAccountType] = useState<'individual' | 'organization'>('individual')
  const [orgName, setOrgName]         = useState('')
  const [username, setUsername]       = useState('')
  const [email, setEmail]             = useState('')
  const [entityType, setEntityType]   = useState('individual')
  const [password, setPassword]       = useState('')
  const [error, setError]             = useState('')
  const [submitting, setSubmitting]   = useState(false)

  const { register, user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard')
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (accountType === 'organization' && !orgName.trim()) {
      setError('Organization name is required')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await register(
        username, email, password, entityType,
        accountType === 'organization' ? orgName.trim() : '',
      )
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-dvh bg-[var(--bg)] flex items-center justify-center px-5 py-16 relative overflow-hidden noise">

      {/* Atmospheric bloom */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: '-15%',
          background: 'radial-gradient(ellipse 55% 40% at 50% 50%, rgba(214,210,196,0.04) 0%, transparent 65%)',
        }}
        aria-hidden
      />

      {/* Nav strip */}
      <div className="fixed top-0 inset-x-0 flex items-center px-6 md:px-10 h-14 z-float">
        <Link href="/" className="type-label text-[var(--accent)] hover:text-[var(--accent-warm)] transition-colors duration-fast">
          NORTH
        </Link>
      </div>

      {/* Card */}
      <motion.div
        className="relative z-10 w-full max-w-[420px]"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: duration.slow, ease: ease.cinematic }}
      >
        <div className="surface-glass rounded-xl p-8 shadow-[var(--shadow-xl)]">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-breath" aria-hidden />
              <span className="type-label text-[var(--accent)]">Create account</span>
            </div>
            <h1 className="type-headline mb-1.5">Join North</h1>
            <p className="type-body-sm text-[var(--subtle)]">Select your account type to get started</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-3.5 py-2.5 rounded-md border border-[var(--border)] bg-[var(--surface-2)]"
            >
              <p className="type-body-sm text-[var(--muted)]">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Account type toggle */}
            <div>
              <label className="type-label text-[var(--muted)] block mb-1.5">Account Type</label>
              <div className="flex rounded-md border border-[var(--border)] p-0.5 bg-[var(--surface)]">
                {ACCOUNT_TYPES.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setAccountType(opt.value as 'individual' | 'organization')}
                    className={cn(
                      'flex-1 py-2 rounded text-center type-body-sm transition-colors duration-fast',
                      accountType === opt.value
                        ? 'bg-[var(--surface-3)] text-[var(--text-2)] border border-[var(--border)]'
                        : 'text-[var(--subtle)] hover:text-[var(--muted)]',
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Org name (conditional) */}
            {accountType === 'organization' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: duration.fast, ease: ease.cinematic }}
              >
                <label className="type-label text-[var(--muted)] block mb-1.5">Organization Name</label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  required
                  placeholder="Your company or team name"
                  className={inputCls}
                />
              </motion.div>
            )}

            {/* Username */}
            <div>
              <label className="type-label text-[var(--muted)] block mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                autoComplete="username"
                placeholder="Choose a username"
                className={inputCls}
              />
            </div>

            {/* Email */}
            <div>
              <label className="type-label text-[var(--muted)] block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className={inputCls}
              />
            </div>

            {/* Entity type */}
            <div>
              <label className="type-label text-[var(--muted)] block mb-1.5">Entity Type</label>
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
                className={`${inputCls} cursor-pointer`}
              >
                {ENTITY_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="type-label text-[var(--muted)] block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Min 6 characters"
                className={inputCls}
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="group flex items-center gap-2 type-body-sm text-[var(--text-2)] hover:text-[var(--accent)] transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{submitting ? 'Creating account…' : 'Create account'}</span>
                {!submitting && (
                  <span className="inline-block group-hover:translate-x-1.5 transition-transform duration-fast" aria-hidden>→</span>
                )}
                {submitting && (
                  <span className="w-3 h-3 rounded-full border border-[var(--border)] border-t-[var(--accent)] animate-spin" aria-hidden />
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="my-7 h-px bg-[var(--border-subtle)]" />

          {/* Login link */}
          <p className="type-body-sm text-[var(--subtle)]">
            Already have an account?{' '}
            <Link href="/login" className="text-[var(--text-2)] hover:text-[var(--accent)] transition-colors duration-fast">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
