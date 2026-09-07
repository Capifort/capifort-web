'use client'

import { useEffect, useState } from 'react'
import { ChevronRight, Folder as FolderIcon } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { getDomainFileTree, type DomainFolderNode } from '@/lib/file-api'
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

export default function FilesPage() {
  const { user } = useAuth()
  const domainId = user?.domain_id || user?.domain?.id || null

  const [tree, setTree] = useState<DomainFolderNode[]>([])
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading')
  const [stack, setStack] = useState<DomainFolderNode[]>([])

  useEffect(() => {
    if (!domainId) {
      setStatus('error')
      return
    }
    getDomainFileTree(domainId)
      .then((data) => {
        setTree(data)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [domainId])

  const openFolder = (folder: DomainFolderNode) => setStack((prev) => [...prev, folder])

  const jumpToBreadcrumb = (index: number) => {
    // index -1 means the "All Workspaces" root
    setStack((prev) => prev.slice(0, index + 1))
  }

  const currentFolder = stack[stack.length - 1] || null
  const subfolders = currentFolder ? currentFolder.children : tree
  const files = currentFolder ? currentFolder.files : []

  return (
    <div className="min-h-dvh">
      <div className="border-b border-slate-100 bg-white px-8 py-6">
        <h1 className="text-lg font-semibold text-slate-900">Files</h1>
        <p className="mt-1 text-sm text-slate-500">Every folder and file across every workspace in your organization.</p>
      </div>

      <div className="px-8 py-8">
        <div className="mb-6 flex items-center gap-2 text-sm">
          <button
            onClick={() => jumpToBreadcrumb(-1)}
            className={stack.length === 0 ? 'font-semibold text-slate-900' : 'text-slate-500 hover:text-slate-700'}
          >
            All Workspaces
          </button>
          {stack.map((folder, i) => (
            <span key={folder.id} className="flex items-center gap-2">
              <ChevronRight size={13} className="text-slate-300" />
              <button
                onClick={() => jumpToBreadcrumb(i)}
                className={i === stack.length - 1 ? 'font-semibold text-slate-900' : 'text-slate-500 hover:text-slate-700'}
              >
                {folder.name}
              </button>
            </span>
          ))}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white">
          {status === 'loading' && (
            <div className="flex items-center gap-2 p-6 text-sm text-slate-400">
              <Spinner size={15} />
              Loading files…
            </div>
          )}
          {status === 'error' && <p className="p-6 text-sm text-red-600">Couldn&apos;t load files.</p>}
          {status === 'success' && subfolders.length === 0 && files.length === 0 && (
            <p className="p-6 text-sm text-slate-400">This folder is empty.</p>
          )}
          {status === 'success' && (subfolders.length > 0 || files.length > 0) && (
            <div className="divide-y divide-slate-50">
              {subfolders.map((folder) => (
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
              {files.map((file) => (
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
          )}
        </div>
      </div>
    </div>
  )
}
