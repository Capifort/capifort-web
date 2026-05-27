'use client'

import Link from 'next/link'
import { useFeature } from '@/hooks/use-feature'
import { useAuth } from '@/context/auth-context'

function LockedFallback({ feature, planName }: { feature: string; planName?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-8">
      <div className="surface rounded-xl p-10 text-center max-w-sm shadow-[var(--shadow-lg)]">
        <div className="w-14 h-14 rounded-full border border-[var(--border)] bg-[var(--accent-dim)] flex items-center justify-center mx-auto mb-6">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h2 className="type-headline mb-3">Feature not available</h2>
        <p className="type-body mb-6">
          <strong className="text-[var(--text-2)]">{feature}</strong> is gated
          {planName ? ` on your ${planName} plan` : ''}. Upgrade to unlock it.
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 type-body-sm text-[var(--text-2)] hover:text-[var(--accent)] transition-colors duration-fast"
        >
          <span>View plans</span>
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  )
}

interface FeatureGateProps {
  feature: string
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function FeatureGate({ feature, fallback, children }: FeatureGateProps) {
  const allowed = useFeature(feature)
  const { plan } = useAuth()
  if (allowed) return <>{children}</>
  if (fallback !== undefined) return <>{fallback}</>
  return <LockedFallback feature={feature} planName={plan?.name} />
}
