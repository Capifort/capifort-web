import { apiFetch } from './api'

const BASE = '/api/workspaces'

export interface Workspace {
  id: string
  name: string
  domain_id: string
  created_at: string
  updated_at: string | null
}

export interface SwitchWorkspaceResult {
  access_token: string
  token_type: string
  user: {
    id: string
    username: string
    email: string
    role?: string
    domain_id: string
    current_workspace_id: string | null
    current_workspace: Workspace | null
    [key: string]: unknown
  }
}

export const listWorkspaces = (): Promise<Workspace[]> => apiFetch(BASE)

export const createWorkspace = (name: string): Promise<Workspace> =>
  apiFetch(BASE, { method: 'POST', body: JSON.stringify({ name }) })

export const switchWorkspace = (workspaceId: string): Promise<SwitchWorkspaceResult> =>
  apiFetch(`${BASE}/${workspaceId}/switch`, { method: 'POST' })
