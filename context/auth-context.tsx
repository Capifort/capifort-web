'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { apiFetch, setStoredToken } from '@/lib/api'

// ── Types ──────────────────────────────────────────────────────────────────

export interface Feature { key: string; name: string }
export interface Plan { id: string; key: string; name: string; price_cents: number; billing_interval: string }
export interface Domain { id: string; name: string }

export interface User {
  id: string
  username: string
  email: string
  role: string
  entity_type: 'business' | 'enterprise'
  domain?: Domain
  domain_id?: string
  permissions: Array<{ key: string; name: string }>
  features: Feature[]
  plan: Plan | null
  created_at: string
}

interface AuthContextValue {
  user: User | null
  token: string | null
  loading: boolean
  plan: Plan | null
  features: Feature[]
  isAdmin: boolean
  hasFeature: (key: string) => boolean
  refreshAccess: () => void
  login: (username: string, password: string) => Promise<void>
  register: (
    username: string,
    email: string,
    password: string,
    entityType: 'business' | 'enterprise',
    domainName: string,
  ) => Promise<void>
  logout: () => void
}

// ── Context ────────────────────────────────────────────────────────────────

const TOKEN_KEY = 'consumer_token'
const AuthContext = createContext<AuthContextValue | null>(null)

// ── Provider ───────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [plan, setPlan]       = useState<Plan | null>(null)
  const [features, setFeatures] = useState<Feature[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [token, setTokenState] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(TOKEN_KEY)
  })
  const [loading, setLoading] = useState(
    typeof window !== 'undefined' && !!localStorage.getItem(TOKEN_KEY),
  )

  const setToken = useCallback((newToken: string | null) => {
    if (newToken) {
      setStoredToken(newToken)
      setTokenState(newToken)
    } else {
      setStoredToken(null)
      setTokenState(null)
      setUser(null)
      setPlan(null)
      setFeatures([])
      setIsAdmin(false)
    }
  }, [])

  const loadAccess = useCallback(async () => {
    const data = await apiFetch('/api/access/me')
    setUser({
      ...data.user,
      permissions: data.permissions || [],
      features: data.features || [],
      plan: data.plan || null,
    })
    setPlan(data.plan || null)
    setFeatures(data.features || [])
    setIsAdmin(!!data.is_admin)
    return data
  }, [])

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    loadAccess()
      .catch(() => setToken(null))
      .finally(() => setLoading(false))
  }, [token, loadAccess, setToken])

  const login = async (username: string, password: string) => {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    setToken(data.access_token)
    await loadAccess()
  }

  const register = async (
    username: string,
    email: string,
    password: string,
    entityType: 'business' | 'enterprise',
    domainName: string,
  ) => {
    const body = {
      username,
      email,
      password,
      entity_type: entityType,
      domain_name: domainName,
    }
    const data = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    })
    setToken(data.access_token)
    await loadAccess()
  }

  const logout = () => setToken(null)

  const hasFeature = useCallback(
    (key: string) => isAdmin || features.some((f) => f.key === key),
    [features, isAdmin],
  )

  const refreshAccess = useCallback(
    () => loadAccess().catch(() => {}),
    [loadAccess],
  )

  return (
    <AuthContext.Provider
      value={{ user, token, loading, plan, features, isAdmin, hasFeature, refreshAccess, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
