import { apiFetch } from './api'

export interface Domain {
  id: string
  name: string
  slug: string
  entity_type: string
  created_at: string
}

export interface SwitchDomainResult {
  access_token: string
  token_type: string
  user: {
    id: string
    username: string
    email: string
    role?: string
    domain_id: string
    domain: Domain
    [key: string]: unknown
  }
}

export const listAdminDomains = (): Promise<Domain[]> => apiFetch('/api/domains/admin')

export const switchDomain = (domainId: string): Promise<SwitchDomainResult> =>
  apiFetch('/api/auth/switch-domain', {
    method: 'POST',
    body: JSON.stringify({ domain_id: domainId }),
  })
