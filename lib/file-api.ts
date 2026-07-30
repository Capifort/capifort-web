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

export interface DomainFileNode {
  id: string
  name: string
  path: string
  workspace_id: string
  workspace_name: string | null
  folder_id: string
  extension: string | null
  mime_type: string | null
  size: number | null
  status: string
  created_at: string | null
}

interface DomainFolderNode {
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

export const listAllDomainFiles = async (domainId: string): Promise<DomainFileNode[]> => {
  const tree: DomainContentEntry[] = await apiFetch(`/api/file-system/domains/${domainId}/content`)
  const files: DomainFileNode[] = []
  const walk = (folder: DomainFolderNode) => {
    files.push(...folder.files)
    folder.children.forEach(walk)
  }
  tree.forEach((entry) => walk(entry.folder))
  return files
}
