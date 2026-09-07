'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Loader2 } from 'lucide-react'
import { joinWaitlist } from '@/lib/waitlist-api'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || isSubmitting) return

    setIsSubmitting(true)
    setError(null)
    try {
      await joinWaitlist(email)
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-black text-white">
      <Image
        src="/landing.png"
        alt="Earth seen from space with a lone figure standing on a mountain summit"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/20" />

      <div className="relative flex min-h-dvh flex-col px-6 py-8 sm:px-10 sm:py-10">
        <header className="flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">
            Capifort<sup className="ml-0.5 text-[10px] font-normal">TM</sup>
          </span>
          <span className="hidden text-xs font-medium tracking-[0.25em] text-white/80 sm:block">
            A MORE CAPABLE TOMORROW
          </span>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-xs font-semibold tracking-[0.3em] text-white/80">
            INFRASTRUCTURE
            <br />
            FOR WHAT&apos;S NEXT
          </p>

          <h1 className="mt-6 max-w-3xl text-5xl font-medium leading-[1.1] tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)] sm:text-6xl md:text-7xl">
            Higher ground
            <br />
            for builders.
          </h1>

          <p className="mt-6 max-w-md text-sm font-bold leading-relaxed text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] sm:text-base">
            Your company is telling you something.
            <br />
            Most of it is hiding in places no one thinks to look.
            <br />
            Soon, you&apos;ll be able to hear it.
          </p>

          <p className="mt-8 text-xs font-semibold tracking-[0.3em] text-white/80">
            COMING SOON
          </p>
        </main>

        <footer className="flex flex-col items-center gap-6">
          {submitted ? (
            <p className="text-sm font-medium text-white">You&apos;re on the list. We&apos;ll be in touch.</p>
          ) : (
            <div className="flex w-full max-w-sm flex-col items-center gap-2">
              <form onSubmit={handleSubmit} className="flex w-full items-center gap-2 rounded-full border border-white/30 bg-black/40 py-1.5 pl-5 pr-1.5 backdrop-blur-sm">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none disabled:opacity-60"
                />
                <button
                  type="submit"
                  aria-label="Submit email"
                  disabled={isSubmitting}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-black transition hover:bg-white/90 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <Loader2 size={16} strokeWidth={2.25} className="animate-spin" />
                  ) : (
                    <ArrowRight size={16} strokeWidth={2.25} />
                  )}
                </button>
              </form>
              {error && <p className="text-xs font-medium text-red-300">{error}</p>}
            </div>
          )}
          <p className="text-xs font-semibold tracking-[0.3em] text-white/80">BE THE FIRST TO KNOW</p>

          <div className="flex w-full items-end justify-between pt-4 text-[11px] font-semibold tracking-[0.2em] text-white/70">
            <div className="text-left leading-relaxed">
              <p>BUILD</p>
              <p>OPERATE</p>
              <p>ACCELERATE</p>
            </div>
            <div className="text-right leading-relaxed">
              <p>PEOPLE</p>
              <p>PRODUCTS</p>
              <p>POSSIBILITIES</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
