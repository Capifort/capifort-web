'use client'

import { useEffect, useState } from 'react'
import { ChevronRight, Folder as FolderIcon, FileText, Plus, Upload, X, ArrowLeft } from 'lucide-react'
import { listWorkspaces, createWorkspace, type Workspace } from '@/lib/workspace-api'
import { getRootFolder, getFolderContents, createFolder, uploadFile, type Folder, type FolderContents } from '@/lib/file-api'

function formatBytes(bytes: number | null) {
  if (!bytes) return '—'
  const units = ['B', 'KB', 'MB', 'GB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`
}

function NewFolderModal({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string) => Promise<void> }) {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await onCreate(name)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to create folder.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">New Folder</h2>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Folder name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              placeholder="e.g. Contracts"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {submitting ? 'Creating…' : 'Create Folder'}
          </button>
        </form>
      </div>
    </div>
  )
}

function CreateWorkspaceModal({ onClose, onCreated }: { onClose: () => void; onCreated: (w: Workspace) => void }) {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const workspace = await createWorkspace(name)
      onCreated(workspace)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to create workspace.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Create Workspace</h2>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Workspace name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              placeholder="e.g. Finance Workspace"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {submitting ? 'Creating…' : 'Create Workspace'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [workspacesStatus, setWorkspacesStatus] = useState<'loading' | 'error' | 'success'>('loading')
  const [createOpen, setCreateOpen] = useState(false)

  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null)
  const [breadcrumb, setBreadcrumb] = useState<Array<{ id: string; name: string }>>([])
  const [contents, setContents] = useState<FolderContents | null>(null)
  const [contentsStatus, setContentsStatus] = useState<'loading' | 'error' | 'success'>('loading')
  const [newFolderOpen, setNewFolderOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    listWorkspaces()
      .then((data) => {
        setWorkspaces(data)
        setWorkspacesStatus('success')
      })
      .catch(() => setWorkspacesStatus('error'))
  }, [])

  const loadContents = (workspaceId: string, folderId: string) => {
    setContentsStatus('loading')
    getFolderContents(workspaceId, folderId)
      .then((data) => {
        setContents(data)
        setContentsStatus('success')
      })
      .catch(() => setContentsStatus('error'))
  }

  const openWorkspace = async (workspace: Workspace) => {
    setSelectedWorkspace(workspace)
    setContentsStatus('loading')
    try {
      const root = await getRootFolder(workspace.id)
      setBreadcrumb([{ id: root.id, name: workspace.name }])
      loadContents(workspace.id, root.id)
    } catch {
      setContentsStatus('error')
    }
  }

  const openFolder = (folder: Folder) => {
    if (!selectedWorkspace) return
    setBreadcrumb((prev) => [...prev, { id: folder.id, name: folder.name }])
    loadContents(selectedWorkspace.id, folder.id)
  }

  const jumpToBreadcrumb = (index: number) => {
    if (!selectedWorkspace) return
    const next = breadcrumb.slice(0, index + 1)
    setBreadcrumb(next)
    loadContents(selectedWorkspace.id, next[next.length - 1].id)
  }

  const backToWorkspaces = () => {
    setSelectedWorkspace(null)
    setBreadcrumb([])
    setContents(null)
  }

  const currentFolderId = breadcrumb[breadcrumb.length - 1]?.id

  const handleCreateFolder = async (name: string) => {
    if (!selectedWorkspace || !currentFolderId) return
    await createFolder(selectedWorkspace.id, name, currentFolderId)
    loadContents(selectedWorkspace.id, currentFolderId)
  }

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !selectedWorkspace || !currentFolderId) return
    setUploadError('')
    setUploading(true)
    try {
      await uploadFile(selectedWorkspace.id, currentFolderId, file)
      loadContents(selectedWorkspace.id, currentFolderId)
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload file.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-dvh">
      <div className="flex items-center justify-between border-b border-slate-100 bg-white px-8 py-6">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Workspaces</h1>
          <p className="mt-1 text-sm text-slate-500">Browse and organize files across your workspaces.</p>
        </div>
        {selectedWorkspace && (
          <div className="flex items-center gap-3">
            <label
              className={`flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 ${
                uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'
              }`}
            >
              <Upload size={15} strokeWidth={2} />
              {uploading ? 'Uploading…' : 'Upload File'}
              <input type="file" onChange={handleUploadFile} disabled={uploading} className="hidden" />
            </label>
            <button
              onClick={() => setNewFolderOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              <Plus size={15} strokeWidth={2} />
              New Folder
            </button>
          </div>
        )}
        {!selectedWorkspace && (
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus size={15} strokeWidth={2} />
            Create Workspace
          </button>
        )}
      </div>

      {uploadError && (
        <div className="border-b border-red-100 bg-red-50 px-8 py-2 text-sm text-red-600">{uploadError}</div>
      )}

      {newFolderOpen && <NewFolderModal onClose={() => setNewFolderOpen(false)} onCreate={handleCreateFolder} />}
      {createOpen && (
        <CreateWorkspaceModal
          onClose={() => setCreateOpen(false)}
          onCreated={(w) => setWorkspaces((prev) => [w, ...prev])}
        />
      )}

      <div className="px-8 py-8">
        {!selectedWorkspace ? (
          <>
            {workspacesStatus === 'loading' && <p className="text-sm text-slate-400">Loading workspaces…</p>}
            {workspacesStatus === 'error' && <p className="text-sm text-red-600">Couldn&apos;t load workspaces.</p>}
            {workspacesStatus === 'success' && workspaces.length === 0 && (
              <p className="text-sm text-slate-400">No workspaces yet.</p>
            )}
            {workspacesStatus === 'success' && workspaces.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {workspaces.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => openWorkspace(w)}
                    className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-sm font-semibold text-violet-700">
                      {w.name.slice(0, 1).toUpperCase()}
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-900">{w.name}</p>
                    <p className="mt-1 text-xs text-slate-400">Updated {new Date(w.updated_at || w.created_at).toLocaleDateString()}</p>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-6 flex items-center gap-2 text-sm">
              <button onClick={backToWorkspaces} aria-label="All workspaces" className="flex items-center gap-1 text-slate-400 hover:text-slate-600">
                <ArrowLeft size={15} strokeWidth={1.9} />
              </button>
              {breadcrumb.map((crumb, i) => (
                <span key={crumb.id} className="flex items-center gap-2">
                  {i > 0 && <ChevronRight size={13} className="text-slate-300" />}
                  <button
                    onClick={() => jumpToBreadcrumb(i)}
                    className={i === breadcrumb.length - 1 ? 'font-semibold text-slate-900' : 'text-slate-500 hover:text-slate-700'}
                  >
                    {crumb.name}
                  </button>
                </span>
              ))}
            </div>

            {contentsStatus === 'loading' && <p className="text-sm text-slate-400">Loading…</p>}
            {contentsStatus === 'error' && <p className="text-sm text-red-600">Couldn&apos;t load folder contents.</p>}

            {contentsStatus === 'success' && contents && (
              <div className="rounded-xl border border-slate-200 bg-white">
                {contents.subfolders.length === 0 && contents.files.length === 0 && (
                  <p className="p-6 text-sm text-slate-400">This folder is empty.</p>
                )}
                <div className="divide-y divide-slate-50">
                  {contents.subfolders.map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => openFolder(folder)}
                      className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-slate-50"
                    >
                      <FolderIcon size={16} strokeWidth={1.75} className="flex-shrink-0 text-violet-500" />
                      <span className="min-w-0 flex-1 truncate text-sm text-slate-700">{folder.name}</span>
                      <ChevronRight size={14} className="flex-shrink-0 text-slate-300" />
                    </button>
                  ))}
                  {contents.files.map((file) => (
                    <div key={file.id} className="flex items-center gap-3 px-5 py-3">
                      <FileText size={16} strokeWidth={1.75} className="flex-shrink-0 text-slate-400" />
                      <span className="min-w-0 flex-1 truncate text-sm text-slate-700">{file.name}</span>
                      <span className="flex-shrink-0 text-xs text-slate-400">{formatBytes(file.size)}</span>
                      <span className="flex-shrink-0 text-xs text-slate-400">{file.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
