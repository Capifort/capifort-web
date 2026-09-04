import { apiFetch } from './api'

export interface Activity {
  id: string
  workspace_id: string
  resource_type: string
  resource_id: string | null
  action: string
  performed_by: string | null
  metadata: Record<string, any>
  created_at: string | null
}

export const listWorkspaceActivities = (workspaceId: string, limit = 50, offset = 0): Promise<Activity[]> =>
  apiFetch(`/api/workspaces/${workspaceId}/activities?limit=${limit}&offset=${offset}`)

export const listResourceActivities = (
  workspaceId: string,
  resourceType: 'workspace' | 'folder' | 'file' | 'upload',
  resourceId: string,
  limit = 50
): Promise<Activity[]> =>
  apiFetch(`/api/workspaces/${workspaceId}/activities/${resourceType}/${resourceId}?limit=${limit}`)
