'use client'

import { AuthProvider } from '@/context/auth-context'
import { UpgradeToast } from '@/components/upgrade-toast'

export function AppAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <UpgradeToast />
    </AuthProvider>
  )
}
