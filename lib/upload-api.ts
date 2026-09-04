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

export interface MultipartUploadInitiateOptions {
  filename: string
  totalSize: number
  folderId?: string | null
  mimeType?: string | null
  conflictPolicy?: string
  idempotencyKey?: string
}

export const initiateMultipartUpload = (
  workspaceId: string,
  options: MultipartUploadInitiateOptions
): Promise<UploadRecord> =>
  apiFetch(`/api/workspaces/${workspaceId}/uploads/multipart`, {
    method: 'POST',
    body: JSON.stringify({
      filename: options.filename,
      total_size: options.totalSize,
      folder_id: options.folderId ?? null,
      mime_type: options.mimeType ?? null,
      conflict_policy: options.conflictPolicy ?? 'version',
      idempotency_key: options.idempotencyKey ?? null,
    }),
  })

export const uploadMultipartPart = (
  workspaceId: string,
  uploadId: string,
  partNumber: number,
  part: Blob
): Promise<UploadRecord> =>
  apiFetch(`/api/workspaces/${workspaceId}/uploads/multipart/${uploadId}/parts/${partNumber}`, {
    method: 'PUT',
    body: part,
  })

export const completeMultipartUpload = (
  workspaceId: string,
  uploadId: string,
  changeLog?: string
): Promise<import('./file-api').FileItem> =>
  apiFetch(`/api/workspaces/${workspaceId}/uploads/multipart/${uploadId}/complete`, {
    method: 'POST',
    body: JSON.stringify({ change_log: changeLog ?? null }),
  })

export const abortMultipartUpload = (
  workspaceId: string,
  uploadId: string,
  reason?: string
): Promise<UploadRecord> =>
  apiFetch(`/api/workspaces/${workspaceId}/uploads/multipart/${uploadId}/abort`, {
    method: 'POST',
    body: JSON.stringify({ reason: reason ?? null }),
  })

export const getUploadStatus = (workspaceId: string, uploadId: string): Promise<UploadRecord> =>
  apiFetch(`/api/workspaces/${workspaceId}/uploads/${uploadId}`)

export const listUploads = (workspaceId: string, status?: string): Promise<UploadRecord[]> =>
  apiFetch(`/api/workspaces/${workspaceId}/uploads/list${status ? `?status=${status}` : ''}`)
