'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { User, Lock, Eye, EyeOff, ArrowRight, FileText, Waypoints, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { Spinner } from '@/components/spinner'

const highlights = [
  {
    icon: FileText,
    title: 'Connected evidence',
    description: 'Bring documents, transactions, policies and supporting records together.',
  },
  {
    icon: Waypoints,
    title: 'Intelligent investigation',
    description: 'Trace process flows, test controls and uncover discrepancies across operations.',
  },
  {
    icon: ShieldCheck,
    title: 'Defensible findings',
    description: 'Turn identified risks into explainable findings, backed by source evidence and a clear audit trail.',
  },
]

function CapifortLogo() {
  return (
    <div className="flex items-center gap-4">
      <span className="h-9 w-9 rounded-full border-4 border-current" />
      <span className="text-lg font-medium tracking-[0.26em]">CAPIFORT</span>
    </div>
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
    <div className="grid min-h-dvh bg-white lg:grid-cols-[57fr_43fr]">
      {/* Left: product story, hidden on small screens */}
      <section className="relative hidden overflow-hidden bg-[#081626] text-white lg:block">
        <Image
          src="/login-art.png"
          alt=""
          width={482}
          height={748}
          priority
          className="absolute bottom-0 right-0 h-auto w-1/2 max-w-[560px]"
        />
        {/* Keeps the text readable and hides the artwork's left edge */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_8%_24%,#081626_52%,transparent_100%)]" />

        <div className="relative flex h-full flex-col px-10 py-9 xl:px-14">
          <CapifortLogo />

          <p className="mt-8 text-[11px] font-semibold tracking-[0.42em] text-slate-200">
            INTELLIGENT AUDIT INVESTIGATION
          </p>
          <span className="mt-4 h-px w-8 bg-slate-400" />
          <h1 className="mt-5 font-serif text-4xl leading-tight xl:text-5xl xl:leading-tight">
            From transaction to finding.
            <br />
            <em className="text-[#c3e0fb]">Every step evidenced.</em>
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-7 text-slate-300 2xl:max-w-lg">
            Capifort helps audit and finance teams investigate complex business processes across P2P, O2C and H2R.
            Connect records, test controls, trace exceptions and turn fragmented information into evidence-backed
            findings.
          </p>

          <ul className="mt-6 max-w-[22rem] space-y-4 [@media(max-height:800px)]:space-y-2">
            {highlights.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-center gap-4">
                <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-white/5">
                  <Icon size={24} strokeWidth={1.5} />
                </span>
                <span>
                  <span className="block text-base font-semibold">{title}</span>
                  <span className="mt-1 block text-[13px] leading-5 text-slate-400">{description}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-6 [@media(max-height:800px)]:hidden">
            <span className="block h-px w-8 bg-slate-400" />
            <p className="mt-5 text-[11px] font-semibold tracking-[0.4em] text-slate-200">
              BUILT FOR CLARITY. GROUNDED IN EVIDENCE.
            </p>
          </div>
        </div>
      </section>

      {/* Right: sign-in form */}
      <main className="flex min-h-dvh flex-col px-6 py-8 sm:px-11">
        <div className="mb-8 text-slate-950 lg:hidden">
          <CapifortLogo />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-4">
          <span className="text-[15px] text-slate-500">New to Capifort?</span>
          <Link
            href="/register"
            className="rounded-full border border-slate-200 px-5 py-2.5 text-[15px] font-semibold text-slate-950 hover:bg-slate-50"
          >
            Create an account
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h2 className="font-serif text-4xl text-slate-950">Welcome back</h2>
          <p className="mt-3 text-[15px] text-slate-500">Sign in to continue your investigations.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <div role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* The API signs users in by username, not email */}
            <div>
              <label htmlFor="username" className="mb-2.5 block text-[15px] font-medium text-slate-950">
                Username
              </label>
              <div className="flex items-center gap-3 rounded-xl bg-[#ebf0fc] px-4 focus-within:ring-2 focus-within:ring-slate-950">
                <User size={18} strokeWidth={1.75} className="flex-shrink-0 text-slate-500" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="Enter your username"
                  className="h-[52px] min-w-0 flex-1 bg-transparent text-[15px] text-slate-950 placeholder:text-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="mb-2.5 flex items-center justify-between gap-3">
                <label htmlFor="password" className="text-[15px] font-medium text-slate-950">
                  Password
                </label>
                <Link href="#" className="text-sm text-slate-600 underline hover:text-slate-900">
                  Forgot password?
                </Link>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-[#ebf0fc] px-4 focus-within:ring-2 focus-within:ring-slate-950">
                <Lock size={18} strokeWidth={1.75} className="flex-shrink-0 text-slate-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="h-[52px] min-w-0 flex-1 bg-transparent text-[15px] text-slate-950 placeholder:text-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="flex-shrink-0 text-slate-500 hover:text-slate-800"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={19} strokeWidth={1.75} /> : <Eye size={19} strokeWidth={1.75} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex h-[54px] w-full items-center justify-center gap-3 rounded-xl bg-[#070d1f] text-[15px] font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && <Spinner size={16} />}
              {submitting ? 'Signing in…' : 'Sign in'}
              {!submitting && <ArrowRight size={19} strokeWidth={2} />}
            </button>
          </form>
        </div>

        <footer className="flex flex-col gap-3 text-[13px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-5">
            <Link href="#" className="hover:text-slate-800">Help</Link>
            <Link href="#" className="hover:text-slate-800">Privacy</Link>
            <Link href="#" className="hover:text-slate-800">Terms</Link>
          </div>
          <span>&copy; 2026 Capifort. All rights reserved.</span>
        </footer>
      </main>
    </div>
  )
}
