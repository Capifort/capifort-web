'use client'

import { useAuth } from '@/context/auth-context'

export function useFeature(key: string): boolean {
  const { hasFeature } = useAuth()
  return hasFeature(key)
}

export function useFeatures() {
  const { features, plan, isAdmin, hasFeature } = useAuth()
  return { features, plan, isAdmin, hasFeature }
}
