import { apiFetch } from './api'

export interface Folder {
  id: string
  workspace_id: string
  parent_id: string | null
  name: string
  path: string
  depth: number
  created_at: string | null
  updated_at: string | null
}

export interface FileItem {
  id: string
  workspace_id: string
  folder_id: string
  name: string
  extension: string | null
  mime_type: string | null
  size: number | null
  status: string
  created_at: string | null
  updated_at: string | null
}

export interface FolderContents {
  folder: Folder
  subfolders: Folder[]
  files: FileItem[]
}

export const getRootFolder = (workspaceId: string): Promise<Folder> =>
  apiFetch(`/api/workspaces/${workspaceId}/folders/root`)

export const getFolderContents = (workspaceId: string, folderId: string): Promise<FolderContents> =>
  apiFetch(`/api/workspaces/${workspaceId}/folders/${folderId}?limit=100&offset=0`)

export const createFolder = (workspaceId: string, name: string, parentId: string | null): Promise<Folder> =>
  apiFetch(`/api/workspaces/${workspaceId}/folders`, {
    method: 'POST',
    body: JSON.stringify({ name, parent_id: parentId, metadata: {} }),
  })

export const uploadFile = (workspaceId: string, folderId: string, file: File): Promise<FileItem> => {
  const formData = new FormData()
  formData.append('upload', file)
  formData.append('folder_id', folderId)
  formData.append('conflict_policy', 'version')
  formData.append('change_log', '')
  return apiFetch(`/api/workspaces/${workspaceId}/files`, {
    method: 'POST',
    body: formData,
  })
}

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
