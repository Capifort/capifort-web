import { apiFetch } from './api'

export interface UploadRecord {
  id: string
  workspace_id: string
  file_id: string | null
  upload_id: string | null
  filename: string
  total_size: number | null
  uploaded_size: number
  total_parts: number | null
  uploaded_parts: number
  status: string
  progress_percent: number
  metadata: Record<string, any>
  created_by: string | null
  created_at: string | null
  completed_at: string | null
}

export const getUploadStatus = (workspaceId: string, uploadId: string): Promise<UploadRecord> =>
  apiFetch(`/api/workspaces/${workspaceId}/uploads/${uploadId}`)

export const listUploads = (workspaceId: string, status?: string): Promise<UploadRecord[]> =>
  apiFetch(`/api/workspaces/${workspaceId}/uploads/list${status ? `?status=${status}` : ''}`)
