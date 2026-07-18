import { apiFetch } from './api'

const BASE = '/api/workspaces'

export interface Workspace {
  id: string
  name: string
  slug: string
  domain_id: string
  created_at: string
  updated_at: string | null
}

export const listWorkspaces = (): Promise<Workspace[]> => apiFetch(BASE)

export const createWorkspace = (name: string): Promise<Workspace> =>
  apiFetch(BASE, { method: 'POST', body: JSON.stringify({ name }) })
