'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/auth-context'
import { duration, ease } from '@/lib/tokens'

const inputCls =
  'w-full bg-[var(--surface)] border border-[var(--border)] rounded-md px-3.5 py-2.5 ' +
  'type-body-sm text-[var(--text)] placeholder:text-[var(--subtle)] ' +
  'focus:outline-none focus:border-[var(--border-focus)] transition-colors duration-fast'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { login, user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard')
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(username, password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-dvh bg-[var(--bg)] flex items-center justify-center px-5 relative overflow-hidden noise">

      {/* Atmospheric bloom */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: '-15%',
          background: 'radial-gradient(ellipse 55% 40% at 50% 50%, rgba(214,210,196,0.04) 0%, transparent 65%)',
        }}
        aria-hidden
      />

      {/* Ghost grid lines */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block" aria-hidden>
        {[33, 66].map((pct) => (
          <div key={pct} className="absolute left-0 right-0 h-px" style={{
            top: `${pct}%`,
            background: 'linear-gradient(to right, transparent, var(--border-subtle) 20%, var(--border-subtle) 80%, transparent)',
            opacity: 0.5,
          }} />
        ))}
      </div>

      {/* Nav strip */}
      <div className="fixed top-0 inset-x-0 flex items-center px-6 md:px-10 h-14 z-float">
        <Link href="/" className="type-label text-[var(--accent)] hover:text-[var(--accent-warm)] transition-colors duration-fast">
          NORTH
        </Link>
      </div>

      {/* Card */}
      <motion.div
        className="relative z-10 w-full max-w-[400px]"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: duration.slow, ease: ease.cinematic }}
      >
        <div className="surface-glass rounded-xl p-8 shadow-[var(--shadow-xl)]">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-breath" aria-hidden />
              <span className="type-label text-[var(--accent)]">Welcome back</span>
            </div>
            <h1 className="type-headline mb-1.5">Sign in to North</h1>
            <p className="type-body-sm text-[var(--subtle)]">Enter your credentials to continue</p>
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

            {/* Username */}
            <div>
              <label className="type-label text-[var(--muted)] block mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="your_username"
                className={inputCls}
              />
            </div>

            {/* Password */}
            <div>
              <label className="type-label text-[var(--muted)] block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`${inputCls} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 type-label text-[var(--subtle)] hover:text-[var(--muted)] transition-colors duration-fast"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? '●' : '○'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="group flex items-center gap-2 type-body-sm text-[var(--text-2)] hover:text-[var(--accent)] transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{submitting ? 'Signing in…' : 'Sign in'}</span>
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

          {/* Register link */}
          <p className="type-body-sm text-[var(--subtle)]">
            No account?{' '}
            <Link href="/register" className="text-[var(--text-2)] hover:text-[var(--accent)] transition-colors duration-fast">
              Create one free
            </Link>
          </p>

        </div>

        {/* Tagline */}
        <motion.p
          className="text-center type-label text-[var(--subtle)] mt-5 opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: duration.slow, delay: 0.5 }}
        >
          Knowledge Operating System · North
        </motion.p>
      </motion.div>
    </div>
  )
}
