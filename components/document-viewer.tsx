'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Download, X } from 'lucide-react'
import { getFileDownloadUrl, getFileViewUrl } from '@/lib/file-api'
import { Spinner } from '@/components/spinner'
import type { ViewerFocus } from '@/components/pdf-pages'

const PdfPages = dynamic(() => import('@/components/pdf-pages'), { ssr: false })

type ViewerStatus = 'loading' | 'not_ready' | 'error' | 'success'

export function DocumentViewer({
  workspaceId,
  file,
  focus,
  onClose,
}: {
  workspaceId: string
  file: { id: string; name: string }
  focus?: ViewerFocus
  onClose: () => void
}) {
  const [viewUrl, setViewUrl] = useState('')
  const [shownVersionId, setShownVersionId] = useState<string | null>(null)
  const [status, setStatus] = useState<ViewerStatus>('loading')
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    import('@/components/pdf-pages')
    setStatus('loading')
    getFileViewUrl(workspaceId, file.id)
      .then((fileView) => {
        setViewUrl(fileView.view_url)
        setShownVersionId(fileView.version_id)
        setStatus('success')
      })
      .catch((error) => setStatus(error.status === 409 ? 'not_ready' : 'error'))
  }, [workspaceId, file.id])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  const downloadOriginal = async () => {
    setDownloading(true)
    try {
      const download = await getFileDownloadUrl(workspaceId, file.id)
      window.location.href = download.download_url
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/60 p-4 sm:p-8" onClick={onClose}>
      <div
        className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-3">
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-900">{file.name}</span>
          <button
            onClick={downloadOriginal}
            disabled={downloading}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {downloading ? <Spinner size={13} /> : <Download size={13} strokeWidth={2} />}
            Download
          </button>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center bg-slate-50">
          {status === 'loading' && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Spinner size={15} />
              Opening document…
            </div>
          )}
          {status === 'not_ready' && (
            <p className="px-6 text-center text-sm text-slate-500">
              This document is still being prepared for viewing. You can download the original meanwhile.
            </p>
          )}
          {status === 'error' && <p className="text-sm text-red-600">Couldn&apos;t open this document.</p>}
          {/* The PDF is linearised, so pdf.js streams it with range requests
              and shows the first pages before the whole file has downloaded. */}
          {status === 'success' && <PdfPages url={viewUrl} focus={focus} shownVersionId={shownVersionId} />}
        </div>
      </div>
    </div>
  )
}
