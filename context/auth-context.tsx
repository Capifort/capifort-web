'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { apiFetch, setStoredToken } from '@/lib/api'

export interface User {
  id: string
  username: string
  email: string
  role?: string
  domain_id?: string
  domain?: { id: string; name: string; slug: string; entity_type: string }
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const TOKEN_KEY = 'consumer_token'
const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
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
    }
  }, [])

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    apiFetch('/api/access/me')
      .then((data) => setUser(data.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false))
  }, [token, setToken])

  const login = async (username: string, password: string) => {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    setToken(data.access_token)
    const me = await apiFetch('/api/access/me')
    setUser(me.user)
  }

  const logout = () => setToken(null)

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
