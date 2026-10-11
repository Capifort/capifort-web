import { apiFetch } from './api'

export interface IngestionJob {
  job_id: string
  file_id: string
  file_version_id: string
  file_name: string
  workspace_id: string
  status: string
  current_stage: string | null
  parsed_uri: string | null
  validation_result: {
    page_count?: number
    document_type?: string
    language?: string
    requires_ocr?: boolean
    warnings?: string[]
    failed_checks?: string[]
    file_metadata?: { file_size_bytes?: number }
  } | null
  error: string | null
  started_at: string | null
  completed_at: string | null
}

export interface IngestionJobList {
  domain_id: string
  limit: number
  offset: number
  count: number
  jobs: IngestionJob[]
}

export interface ParseFileDownload {
  job_id: string
  filename: string
  download_url: string
  expires_in_seconds: number
}

export const listIngestionJobs = (domainId: string, limit = 50, offset = 0): Promise<IngestionJobList> =>
  apiFetch(`/api/admin/ingestion-jobs?domain_id=${domainId}&limit=${limit}&offset=${offset}`)

export const getParseFileDownload = (jobId: string): Promise<ParseFileDownload> =>
  apiFetch(`/api/admin/ingestion-jobs/${jobId}/parse-file`)
