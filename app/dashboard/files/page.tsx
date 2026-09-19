'use client'

import { useEffect, useState } from 'react'
import { ChevronRight, Folder as FolderIcon, Plus, Upload, X } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import {
  getRootFolder,
  getFolderContents,
  createFolder,
  uploadFile,
  type Folder,
  type FolderContents,
} from '@/lib/file-api'
import { Spinner } from '@/components/spinner'

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

const FILE_TYPE_STYLES: Record<string, string> = {
  pdf: 'bg-red-100 text-red-700',
  doc: 'bg-blue-100 text-blue-700',
  docx: 'bg-blue-100 text-blue-700',
  xls: 'bg-emerald-100 text-emerald-700',
  xlsx: 'bg-emerald-100 text-emerald-700',
  csv: 'bg-emerald-100 text-emerald-700',
  ppt: 'bg-orange-100 text-orange-700',
  pptx: 'bg-orange-100 text-orange-700',
  png: 'bg-purple-100 text-purple-700',
  jpg: 'bg-purple-100 text-purple-700',
  jpeg: 'bg-purple-100 text-purple-700',
  gif: 'bg-purple-100 text-purple-700',
  svg: 'bg-purple-100 text-purple-700',
  webp: 'bg-purple-100 text-purple-700',
  zip: 'bg-slate-200 text-slate-700',
  rar: 'bg-slate-200 text-slate-700',
  '7z': 'bg-slate-200 text-slate-700',
  mp4: 'bg-pink-100 text-pink-700',
  mov: 'bg-pink-100 text-pink-700',
  mp3: 'bg-amber-100 text-amber-700',
  wav: 'bg-amber-100 text-amber-700',
  txt: 'bg-slate-100 text-slate-600',
  md: 'bg-slate-100 text-slate-600',
}

function FileTypeBadge({ extension }: { extension: string | null }) {
  const ext = (extension || '').toLowerCase()
  const className = FILE_TYPE_STYLES[ext] || 'bg-slate-100 text-slate-500'
  const label = ext ? ext.slice(0, 4).toUpperCase() : 'FILE'
  return (
    <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${className}`}>
      {label}
    </div>
  )
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
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {submitting && <Spinner size={16} />}
            {submitting ? 'Creating…' : 'Create Folder'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function FilesPage() {
  const { user } = useAuth()
  const workspaceId = user?.current_workspace_id || null

  const [breadcrumb, setBreadcrumb] = useState<Array<{ id: string; name: string }>>([])
  const [contents, setContents] = useState<FolderContents | null>(null)
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading')
  const [newFolderOpen, setNewFolderOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const loadContents = (folderId: string) => {
    if (!workspaceId) return
    setStatus('loading')
    getFolderContents(workspaceId, folderId)
      .then((data) => {
        setContents(data)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }

  useEffect(() => {
    if (!workspaceId) {
      setStatus('error')
      return
    }
    getRootFolder(workspaceId)
      .then((root) => {
        setBreadcrumb([{ id: root.id, name: root.name }])
        loadContents(root.id)
      })
      .catch(() => setStatus('error'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId])

  const openFolder = (folder: Folder) => {
    setBreadcrumb((prev) => [...prev, { id: folder.id, name: folder.name }])
    loadContents(folder.id)
  }

  const jumpToBreadcrumb = (index: number) => {
    const next = breadcrumb.slice(0, index + 1)
    setBreadcrumb(next)
    loadContents(next[next.length - 1].id)
  }

  const currentFolderId = breadcrumb[breadcrumb.length - 1]?.id

  const handleCreateFolder = async (name: string) => {
    if (!workspaceId || !currentFolderId) return
    await createFolder(workspaceId, name, currentFolderId)
    loadContents(currentFolderId)
  }

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !workspaceId || !currentFolderId) return
    setUploadError('')
    setUploading(true)
    try {
      await uploadFile(workspaceId, currentFolderId, file)
      loadContents(currentFolderId)
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload file.')
    } finally {
      setUploading(false)
    }
  }

  if (!workspaceId) {
    return (
      <div className="min-h-dvh">
        <div className="border-b border-slate-100 bg-white px-8 py-6">
          <h1 className="text-lg font-semibold text-slate-900">Documents</h1>
          <p className="mt-1 text-sm text-slate-500">Manage folders and files in your workspace.</p>
        </div>
        <div className="px-8 py-8">
          <p className="text-sm text-slate-400">
            No workspace selected yet. Create or switch to one from Settings → Workspace.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh">
      <div className="flex items-center justify-between border-b border-slate-100 bg-white px-8 py-6">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Documents</h1>
          <p className="mt-1 text-sm text-slate-500">Manage folders and files in your workspace.</p>
        </div>
        <div className="flex items-center gap-3">
          <label
            className={`flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 ${
              uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'
            }`}
          >
            {uploading ? <Spinner size={15} /> : <Upload size={15} strokeWidth={2} />}
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
      </div>

      {uploadError && (
        <div className="border-b border-red-100 bg-red-50 px-8 py-2 text-sm text-red-600">{uploadError}</div>
      )}

      {newFolderOpen && <NewFolderModal onClose={() => setNewFolderOpen(false)} onCreate={handleCreateFolder} />}

      <div className="px-8 py-8">
        <div className="mb-6 flex items-center gap-2 text-sm">
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

        {status === 'loading' && (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Spinner size={15} />
            Loading…
          </div>
        )}
        {status === 'error' && <p className="text-sm text-red-600">Couldn&apos;t load folder contents.</p>}

        {status === 'success' && contents && (
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
                  <FileTypeBadge extension={file.extension} />
                  <span className="min-w-0 flex-1 truncate text-sm text-slate-700">{file.name}</span>
                  <span className="flex-shrink-0 text-xs text-slate-400">{formatBytes(file.size)}</span>
                  <span className="flex flex-shrink-0 items-center gap-1.5 text-xs text-slate-400">
                    {(file.status === 'pending' || file.status === 'uploading') && <Spinner size={12} />}
                    {file.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
