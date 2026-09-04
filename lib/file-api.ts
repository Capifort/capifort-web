import { apiFetch } from './api'

export interface Folder {
  id: string
  domain_id: string
  workspace_id: string
  parent_id: string | null
  name: string
  path: string
  depth: number
  metadata: Record<string, any>
  created_by: string | null
  created_at: string | null
  updated_at: string | null
}

export interface FileItem {
  id: string
  domain_id: string
  workspace_id: string
  folder_id: string
  latest_version_id: string | null
  name: string
  extension: string | null
  mime_type: string | null
  size: number | null
  checksum: string | null
  status: string
  object_key: string | null
  storage_provider: string
  metadata: Record<string, any>
  pipeline: Record<string, any>
  tags: any[]
  permissions: Record<string, any>
  created_by: string | null
  created_at: string | null
  updated_at: string | null
}

export interface FileVersion {
  id: string
  file_id: string
  version_number: number
  object_key: string
  size: number | null
  checksum: string | null
  change_log: string | null
  metadata: Record<string, any>
  created_by: string | null
  created_at: string | null
}

export interface FileDownload {
  file_id: string
  name: string
  mime_type: string | null
  size: number | null
  download_url: string
  expires_in_seconds: number
}

export interface FolderContents {
  folder: Folder
  subfolders: Folder[]
  files: FileItem[]
}

// ── Folders ──────────────────────────────────────────────────────────────

export const getRootFolder = (workspaceId: string): Promise<Folder> =>
  apiFetch(`/api/workspaces/${workspaceId}/folders/root`)

export const listFolders = (workspaceId: string, parentId?: string | null): Promise<Folder[]> =>
  apiFetch(`/api/workspaces/${workspaceId}/folders/list${parentId ? `?parent_id=${parentId}` : ''}`)

export const getFolderContents = (
  workspaceId: string,
  folderId: string,
  limit = 100,
  offset = 0
): Promise<FolderContents> =>
  apiFetch(`/api/workspaces/${workspaceId}/folders/${folderId}?limit=${limit}&offset=${offset}`)

export const getFolderSubtree = (workspaceId: string, folderId: string): Promise<Folder[]> =>
  apiFetch(`/api/workspaces/${workspaceId}/folders/${folderId}/subtree`)

export const createFolder = (workspaceId: string, name: string, parentId: string | null): Promise<Folder> =>
  apiFetch(`/api/workspaces/${workspaceId}/folders/create`, {
    method: 'POST',
    body: JSON.stringify({ name, parent_id: parentId, metadata: {} }),
  })

export const updateFolder = (
  workspaceId: string,
  folderId: string,
  changes: { name?: string; parent_id?: string | null }
): Promise<Folder> =>
  apiFetch(`/api/workspaces/${workspaceId}/folders/${folderId}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  })

export const deleteFolder = (workspaceId: string, folderId: string): Promise<Folder> =>
  apiFetch(`/api/workspaces/${workspaceId}/folders/${folderId}`, { method: 'DELETE' })

// ── Files ────────────────────────────────────────────────────────────────

export const uploadFile = (workspaceId: string, folderId: string, file: File): Promise<FileItem> => {
  const formData = new FormData()
  formData.append('upload', file)
  formData.append('folder_id', folderId)
  formData.append('conflict_policy', 'version')
  formData.append('change_log', '')
  return apiFetch(`/api/workspaces/${workspaceId}/files/upload`, {
    method: 'POST',
    body: formData,
  })
}

export const listFiles = (workspaceId: string, folderId: string, status?: string): Promise<FileItem[]> =>
  apiFetch(`/api/workspaces/${workspaceId}/files/list?folder_id=${folderId}${status ? `&status=${status}` : ''}`)

export const getFile = (workspaceId: string, fileId: string): Promise<FileItem> =>
  apiFetch(`/api/workspaces/${workspaceId}/files/${fileId}`)

export const getFileDownloadUrl = (
  workspaceId: string,
  fileId: string,
  versionId?: string
): Promise<FileDownload> =>
  apiFetch(`/api/workspaces/${workspaceId}/files/${fileId}/download${versionId ? `?version_id=${versionId}` : ''}`)

export const listFileVersions = (workspaceId: string, fileId: string): Promise<FileVersion[]> =>
  apiFetch(`/api/workspaces/${workspaceId}/files/${fileId}/versions`)

export const updateFile = (
  workspaceId: string,
  fileId: string,
  changes: { name?: string; folder_id?: string }
): Promise<FileItem> =>
  apiFetch(`/api/workspaces/${workspaceId}/files/${fileId}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  })

export const deleteFile = (workspaceId: string, fileId: string): Promise<FileItem> =>
  apiFetch(`/api/workspaces/${workspaceId}/files/${fileId}`, { method: 'DELETE' })

// ── Full tree (domain-wide) ──────────────────────────────────────────────

export interface DomainFileNode {
  id: string
  name: string
  path: string
  workspace_id: string
  folder_id: string
  extension: string | null
  mime_type: string | null
  size: number | null
  status: string
  created_at: string | null
}

export interface DomainFolderNode {
  id: string
  name: string
  path: string
  workspace_id: string
  workspace_name: string | null
  children: DomainFolderNode[]
  files: DomainFileNode[]
}

interface DomainContentEntry {
  folder: DomainFolderNode
}

export const getDomainFileTree = async (domainId: string): Promise<DomainFolderNode[]> => {
  const tree: DomainContentEntry[] = await apiFetch(`/api/file-system/domains/${domainId}/content`)
  return tree.map((entry) => entry.folder)
}
