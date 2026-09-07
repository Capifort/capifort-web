'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Spinner } from '@/components/spinner'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Spinner size={16} />
          Loading…
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-[#FBFAF7]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
