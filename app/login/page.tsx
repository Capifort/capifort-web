'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Compass, Mail, Lock, Eye, EyeOff, FileText, Database, Folder,
  BrainCircuit, Users, TrendingUp, ShieldCheck, Lock as LockIcon, Cloud, Zap,
} from 'lucide-react'
import { useAuth } from '@/context/auth-context'

const featureBadges = [
  { icon: ShieldCheck, title: 'Enterprise Ready', desc: 'SOC 2 ready, SSO, and role-based access' },
  { icon: LockIcon, title: 'Secure by Design', desc: 'End-to-end encryption and data protection' },
  { icon: Cloud, title: 'Private or Cloud', desc: 'Deploy in your cloud or on-premise' },
  { icon: Zap, title: 'Built for Scale', desc: 'Handle millions of files and complex workflows' },
]

const satellites = [
  { icon: FileText, angle: -90 },
  { icon: Folder, angle: -30 },
  { icon: TrendingUp, angle: 30 },
  { icon: Users, angle: 90 },
  { icon: BrainCircuit, angle: -150 },
  { icon: Database, angle: 150 },
]

function OrbitGraphic() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm">
      <div className="absolute inset-0 rounded-full border border-white/10" />
      <div className="absolute inset-10 rounded-full border border-white/10" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-xl font-bold text-white shadow-lg shadow-violet-900/50">
          N
        </div>
      </div>
      {satellites.map(({ icon: Icon, angle }, i) => {
        const radius = 46
        const x = 50 + radius * Math.cos((angle * Math.PI) / 180)
        const y = 50 + radius * Math.sin((angle * Math.PI) / 180)
        return (
          <div
            key={i}
            className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-violet-300"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <Icon size={18} strokeWidth={1.75} />
          </div>
        )
      })}
    </div>
  )
}

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
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

      {/* Left — form */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <Compass size={20} strokeWidth={2} />
          CAPIFORT
        </Link>

        <div className="mx-auto mt-16 w-full max-w-sm">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            Welcome back <span aria-hidden>👋</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to continue to Capifort</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email address</label>
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="name@company.com"
                  className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm placeholder:text-slate-400 focus:border-violet-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <Link href="#" className="text-xs font-medium text-violet-600 hover:text-violet-700">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-10 text-sm placeholder:text-slate-400 focus:border-violet-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-400"
              />
              Remember me
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <Link
            href="/register"
            className="mt-6 block w-full rounded-lg border border-slate-200 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Register
          </Link>
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-12 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; 2026 Capifort, Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-slate-600">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-600">Terms of Service</Link>
          </div>
        </div>
      </div>

      {/* Right — dark panel */}
      <div className="relative hidden flex-col justify-center overflow-hidden bg-slate-950 px-16 py-12 lg:flex">
        <OrbitGraphic />
        <h2 className="mt-10 text-3xl font-bold leading-snug text-white">
          Capifort is the operating system<br />
          <span className="text-violet-400">for enterprise intelligence.</span>
        </h2>
        <p className="mt-4 max-w-md text-sm text-slate-400">
          Connect your knowledge, empower your teams, and turn information into action.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-6">
          {featureBadges.map(({ icon: Icon, title, desc }) => (
            <div key={title}>
              <Icon size={18} strokeWidth={1.75} className="text-violet-400" />
              <p className="mt-2 text-sm font-medium text-white">{title}</p>
              <p className="mt-0.5 text-xs text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
