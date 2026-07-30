'use client'

import { AuthProvider } from '@/context/auth-context'

export function AppAuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
