'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-dvh bg-[var(--bg)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-breath" aria-hidden />
          <span className="type-label text-[var(--subtle)]">Loading…</span>
        </div>
      </div>
    )
  }

  if (!user) return null

  return <>{children}</>
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  )
}
