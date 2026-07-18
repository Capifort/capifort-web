import { apiFetch } from './api'

const BASE = '/api/access/admin'

// ── Features ──────────────────────────────────────────────────────────────────

export const listFeatures = () => apiFetch(`${BASE}/features`)

export const createFeature = (payload: { key: string; name: string; description?: string }) =>
  apiFetch(`${BASE}/features`, { method: 'POST', body: JSON.stringify(payload) })

export const deleteFeature = (featureKey: string) =>
  apiFetch(`${BASE}/features/${featureKey}`, { method: 'DELETE' })

// ── Plans ─────────────────────────────────────────────────────────────────────

export const listPlans = () => apiFetch(`${BASE}/plans`)

export const createPlan = (payload: Record<string, unknown>) =>
  apiFetch(`${BASE}/plans`, { method: 'POST', body: JSON.stringify(payload) })

export const updatePlan = (planId: string, payload: Record<string, unknown>) =>
  apiFetch(`${BASE}/plans/${planId}`, { method: 'PATCH', body: JSON.stringify(payload) })

export const setPlanFeatures = (planId: string, featureKeys: string[]) =>
  apiFetch(`${BASE}/plans/${planId}/features`, {
    method: 'PUT',
    body: JSON.stringify({ feature_keys: featureKeys }),
  })

export const deletePlan = (planId: string) =>
  apiFetch(`${BASE}/plans/${planId}`, { method: 'DELETE' })

// ── Users ─────────────────────────────────────────────────────────────────────

export const listUsers = () => apiFetch(`${BASE}/users`)

export const getUser = (userId: string) => apiFetch(`${BASE}/users/${userId}`)

export const assignUserPlan = (userId: string, planKey: string, expiresAt: string | null = null) =>
  apiFetch(`${BASE}/users/${userId}/plan`, {
    method: 'POST',
    body: JSON.stringify({ plan_key: planKey, expires_at: expiresAt }),
  })

export const upsertFeatureOverride = (
  userId: string,
  featureKey: string,
  allow: boolean,
  reason: string | null = null,
) =>
  apiFetch(`${BASE}/users/${userId}/overrides`, {
    method: 'POST',
    body: JSON.stringify({ feature_key: featureKey, allow, reason }),
  })

export const deleteFeatureOverride = (userId: string, featureKey: string) =>
  apiFetch(`${BASE}/users/${userId}/overrides/${featureKey}`, { method: 'DELETE' })
