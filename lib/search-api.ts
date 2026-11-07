import { apiFetch } from './api'

export type SearchKind = 'passages' | 'facts' | 'entities'
export type MatchedBy = 'meaning' | 'keywords'

export interface SearchLocation {
  page?: number
  sheet?: string
  row_start?: number | null
  row_end?: number | null
}

export interface PassageResult {
  chunk_id: string
  file_id: string
  file_version_id: string
  file_name: string
  location: SearchLocation
  type: string
  text: string
  score: number
  matched_by: MatchedBy[]
}

export interface FactResult {
  fact_id: string
  entity_id: string
  entity_type: string
  entity_name: string
  key: string
  key_label: string
  value: string
  quote: string
  file_id: string | null
  file_version_id: string | null
  file_name: string | null
  location: SearchLocation
  score: number
  matched_by: MatchedBy[]
}

export interface EntityResult {
  entity_id: string
  type: string
  name: string
  canonical_key: string
  processes: string[]
  fact_count: number
  file_count: number
  score: number
  matched_by: MatchedBy[]
}

export interface SearchRequest {
  query: string
  processes?: string[]
  file_ids?: string[]
  kinds?: SearchKind[]
}

export interface SearchResponse {
  query: string
  terms: string[]
  status: 'found' | 'not_found'
  // "embedding": keyword search only; "qdrant": full-text passages only
  degraded: string[]
  took_ms: number
  passages: PassageResult[]
  facts: FactResult[]
  entities: EntityResult[]
}

export const searchWorkspace = (
  workspaceId: string,
  request: SearchRequest,
  signal?: AbortSignal
): Promise<SearchResponse> =>
  apiFetch(`/api/workspaces/${workspaceId}/search`, {
    method: 'POST',
    body: JSON.stringify(request),
    signal,
  })
