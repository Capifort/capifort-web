'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { apiFetch, setStoredToken } from '@/lib/api'
import { switchDomain as switchDomainRequest } from '@/lib/domain-api'
import { switchWorkspace as switchWorkspaceRequest, type Workspace } from '@/lib/workspace-api'

export interface User {
  id: string
  username: string
  email: string
  role?: string
  domain_id?: string
  domain?: { id: string; name: string; entity_type: string }
  current_workspace_id?: string | null
  current_workspace?: Workspace | null
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (params: {
    username: string
    email: string
    password: string
    domain_name: string
    entity_type: 'business' | 'enterprise'
  }) => Promise<void>
  logout: () => void
  switchDomain: (domainId: string) => Promise<void>
  switchWorkspace: (workspaceId: string) => Promise<void>
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

  const register = async (params: {
    username: string
    email: string
    password: string
    domain_name: string
    entity_type: 'business' | 'enterprise'
  }) => {
    const data = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(params),
    })
    setToken(data.access_token)
    const me = await apiFetch('/api/access/me')
    setUser(me.user)
  }

  const logout = () => setToken(null)

  const switchDomain = async (domainId: string) => {
    const data = await switchDomainRequest(domainId)
    setToken(data.access_token)
    setUser(data.user as User)
  }

  const switchWorkspace = async (workspaceId: string) => {
    const data = await switchWorkspaceRequest(workspaceId)
    setToken(data.access_token)
    setUser(data.user as User)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, switchDomain, switchWorkspace }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
