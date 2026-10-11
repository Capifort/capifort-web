'use client'

import { useEffect, useState } from 'react'
import { Download, RefreshCw } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { Spinner } from '@/components/spinner'
import { listIngestionJobs, getParseFileDownload, type IngestionJob } from '@/lib/ingestion-api'

const STATUS_STYLES: Record<string, string> = {
  completed: 'bg-emerald-50 text-emerald-700',
  failed: 'bg-red-50 text-red-600',
  running: 'bg-violet-50 text-violet-700',
}

function formatFileSize(bytes?: number): string {
  if (bytes === undefined) return '—'
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDuration(startedAt: string | null, completedAt: string | null): string {
  if (!startedAt || !completedAt) return '—'
  const seconds = Math.round((new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s`
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
}

function formatDate(value: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export function IngestionTab() {
  const { user } = useAuth()
  const domainId = user?.domain_id || user?.domain?.id || null

  const [jobs, setJobs] = useState<IngestionJob[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [downloadError, setDownloadError] = useState('')
  const [downloadingJobId, setDownloadingJobId] = useState<string | null>(null)

  const loadJobs = async () => {
    if (!domainId) return
    setLoading(true)
    setLoadError('')
    try {
      const result = await listIngestionJobs(domainId)
      setJobs(result.jobs || [])
    } catch (err: any) {
      setLoadError(err.message || 'Failed to load ingestion jobs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadJobs()
  }, [domainId])

  const downloadParsedFile = async (job: IngestionJob) => {
    setDownloadError('')
    setDownloadingJobId(job.job_id)
    try {
      const { download_url } = await getParseFileDownload(job.job_id)
      window.open(download_url, '_blank', 'noopener')
    } catch (err: any) {
      setDownloadError(err.message || 'Failed to download the parsed file.')
    } finally {
      setDownloadingJobId(null)
    }
  }

  return (
    <div className="space-y-4">
      {downloadError && (
        <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{downloadError}</p>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Ingestion jobs</h2>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400">{jobs.length} total</span>
            <button
              onClick={loadJobs}
              disabled={loading}
              aria-label="Refresh ingestion jobs"
              className="text-slate-400 hover:text-slate-700 disabled:opacity-50"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
            <Spinner size={15} />
            Loading ingestion jobs…
          </div>
        ) : loadError ? (
          <p className="mt-4 text-sm text-red-500">{loadError}</p>
        ) : jobs.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400">No ingestion jobs yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-400">
                  <th className="pb-3 font-normal">File</th>
                  <th className="pb-3 font-normal">Status</th>
                  <th className="pb-3 font-normal">Stage</th>
                  <th className="pb-3 font-normal">Pages</th>
                  <th className="pb-3 font-normal">Size</th>
                  <th className="pb-3 font-normal">Started</th>
                  <th className="pb-3 font-normal">Duration</th>
                  <th className="pb-3 text-right font-normal">Parsed file</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => {
                  const hasParsedFile = Boolean(job.parsed_uri)
                  const isDownloading = downloadingJobId === job.job_id
                  return (
                    <tr key={job.job_id} className="border-b border-slate-50 last:border-0">
                      <td className="max-w-[280px] py-3 pr-4">
                        <p className="truncate font-medium text-slate-800" title={job.file_name}>{job.file_name}</p>
                        {job.error && <p className="mt-0.5 truncate text-xs text-red-500" title={job.error}>{job.error}</p>}
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs ${STATUS_STYLES[job.status] || 'bg-slate-100 text-slate-600'}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-500">{job.current_stage || '—'}</td>
                      <td className="py-3 pr-4 text-slate-500">{job.validation_result?.page_count ?? '—'}</td>
                      <td className="py-3 pr-4 text-slate-500">
                        {formatFileSize(job.validation_result?.file_metadata?.file_size_bytes)}
                      </td>
                      <td className="py-3 pr-4 text-slate-500">{formatDate(job.started_at)}</td>
                      <td className="py-3 pr-4 text-slate-500">{formatDuration(job.started_at, job.completed_at)}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => downloadParsedFile(job)}
                          disabled={!hasParsedFile || isDownloading}
                          title={hasParsedFile ? 'Download parsed markdown' : 'No parsed file available'}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {isDownloading ? <Spinner size={12} /> : <Download size={12} />}
                          .md
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
