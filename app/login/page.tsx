'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Apple } from 'lucide-react'
import { useAuth } from '@/context/auth-context'

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29A11.97 11.97 0 0 0 0 12c0 1.93.46 3.76 1.29 5.38l3.98-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  )
}

function MicrosoftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
      <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
    </svg>
  )
}

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
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
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Left — hero image */}
      <div className="relative hidden lg:block">
        <Image src="/login-hero.png" alt="Capifort — Truth has a source." fill priority className="object-cover object-left" />
      </div>

      {/* Right — form */}
      <div className="flex min-h-dvh flex-col px-6 py-10 sm:px-12 lg:px-16">
        <div className="flex items-center justify-end gap-3">
          <span className="text-sm text-slate-400">New to Capifort?</span>
          <Link
            href="/register"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
          >
            Create an account
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center">
          <h1 className="font-serif text-4xl text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to continue your investigations.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-900">Email</label>
              <div className="relative">
                <Mail size={16} strokeWidth={1.75} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="you@company.com"
                  className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-3 text-sm placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-900">Password</label>
                <Link href="#" className="text-xs text-slate-500 underline hover:text-slate-700">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock size={16} strokeWidth={1.75} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-10 text-sm placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
              {!submitting && <ArrowRight size={16} strokeWidth={2} />}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[11px] font-medium tracking-wide text-slate-400">OR CONTINUE WITH</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
              <GoogleIcon />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
              <MicrosoftIcon />
              Microsoft
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
              <Apple size={16} strokeWidth={1.75} />
              Apple
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-8 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-4">
            <Link href="#" className="hover:text-slate-600">Help</Link>
            <Link href="#" className="hover:text-slate-600">Privacy</Link>
            <Link href="#" className="hover:text-slate-600">Terms</Link>
          </div>
          <span>&copy; 2026 Capifort. All rights reserved.</span>
        </div>
      </div>
    </div>
  )
}
