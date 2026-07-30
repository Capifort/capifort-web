'use client'

import { useEffect, useState } from 'react'
import { FileText } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { listAllDomainFiles, type DomainFileNode } from '@/lib/file-api'

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

export default function FilesPage() {
  const { user } = useAuth()
  const domainId = user?.domain_id || user?.domain?.id || null

  const [files, setFiles] = useState<DomainFileNode[]>([])
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading')

  useEffect(() => {
    if (!domainId) {
      setStatus('error')
      return
    }
    listAllDomainFiles(domainId)
      .then((data) => {
        setFiles(data)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [domainId])

  return (
    <div className="min-h-dvh">
      <div className="border-b border-slate-100 bg-white px-8 py-6">
        <h1 className="text-lg font-semibold text-slate-900">Files</h1>
        <p className="mt-1 text-sm text-slate-500">Every file across every workspace in your organization.</p>
      </div>

      <div className="px-8 py-8">
        <div className="rounded-xl border border-slate-200 bg-white">
          {status === 'loading' && <p className="p-6 text-sm text-slate-400">Loading files…</p>}
          {status === 'error' && <p className="p-6 text-sm text-red-600">Couldn&apos;t load files.</p>}
          {status === 'success' && files.length === 0 && (
            <p className="p-6 text-sm text-slate-400">No files yet.</p>
          )}
          {status === 'success' && files.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left" style={{ minWidth: 640 }}>
                <thead>
                  <tr className="border-b border-slate-100 text-xs text-slate-400">
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Workspace</th>
                    <th className="px-5 py-3 font-medium">Path</th>
                    <th className="px-5 py-3 font-medium">Size</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr key={file.id} className="border-b border-slate-50 text-sm">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <FileText size={15} strokeWidth={1.75} className="flex-shrink-0 text-slate-400" />
                          <span className="truncate text-slate-700">{file.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-500">{file.workspace_name || '—'}</td>
                      <td className="px-5 py-3 text-xs text-slate-400">{file.path}</td>
                      <td className="px-5 py-3 text-xs text-slate-400">{formatBytes(file.size)}</td>
                      <td className="px-5 py-3 text-xs text-slate-400">{file.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
