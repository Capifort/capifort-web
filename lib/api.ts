const TOKEN_KEY = 'consumer_token'

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export const setStoredToken = (t: string | null): void => {
  if (typeof window === 'undefined') return
  if (t) localStorage.setItem(TOKEN_KEY, t)
  else localStorage.removeItem(TOKEN_KEY)
}

// ── Feature-not-enabled error ──────────────────────────────────────────────

export class FeatureNotEnabledError extends Error {
  feature: string
  code: string

  constructor(feature: string, message?: string) {
    super(message || `Feature '${feature}' is not enabled on your plan.`)
    this.name = 'FeatureNotEnabledError'
    this.feature = feature
    this.code = 'feature_not_enabled'
  }
}

type FeatureBlockedListener = (err: FeatureNotEnabledError) => void
let featureBlockedListener: FeatureBlockedListener | null = null

export const onFeatureBlocked = (fn: FeatureBlockedListener): (() => void) => {
  featureBlockedListener = fn
  return () => {
    if (featureBlockedListener === fn) featureBlockedListener = null
  }
}

// ── Core fetch ─────────────────────────────────────────────────────────────
// All paths are relative (e.g. /api/auth/login).
// In development, Next.js rewrites /api/* → backend via next.config.ts.
// In production, set NEXT_PUBLIC_API_URL to prefix absolute requests.

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export async function apiFetch(path: string, options: RequestInit = {}): Promise<any> {
  const token = getToken()
  // FormData bodies must not set Content-Type — the browser needs to add its own multipart boundary.
  const isFormData = options.body instanceof FormData
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...((options.headers as Record<string, string>) || {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  let data: any = null
  const text = await res.text()
  if (text) {
    try { data = JSON.parse(text) } catch { data = { detail: text } }
  }

  if (res.status === 403) {
    const detail = data?.detail
    if (detail && typeof detail === 'object' && detail.code === 'feature_not_enabled') {
      const err = new FeatureNotEnabledError(detail.feature, detail.message)
      if (featureBlockedListener) {
        try { featureBlockedListener(err) } catch { /* ignore listener errors */ }
      }
      throw err
    }
  }

  if (!res.ok) {
    const detail = data?.detail
    const message =
      typeof detail === 'string' ? detail
        : detail?.message || data?.message || `Request failed (${res.status})`
    const err = Object.assign(new Error(message), { status: res.status, data })
    throw err
  }

  return data
}
