import { apiFetch, getToken } from './api'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export type InvestigationStatus =
  | 'draft'
  | 'interpreting'
  | 'clarifying'
  | 'planning'
  | 'awaiting_approval'
  | 'starting'
  | 'running'
  | 'paused'
  | 'in_review'
  | 'completed'
  | 'failed'
  | 'cancelled'

export type StepStatus = 'pending' | 'after_review' | 'running' | 'completed' | 'failed' | 'cancelled'

export interface PlannerQuestion {
  id: string
  param: string
  affects: 'population' | 'criteria' | 'classification'
  text: string
  why: string
  options: { value: string; label: string }[]
  suggested: string
}

export interface InvestigationIntent {
  understood?: string
  objective?: string
  process?: string
  entities_needed?: string[]
  conditions?: { id: string; description: string }[]
  scope?: { period_start: string; period_end: string; legal_entities: string[]; other: string }
  assumptions?: { key: string; value: string }[]
  questions?: PlannerQuestion[]
  answers?: Record<string, string>
  sources?: { file_id: string; file_name: string; tabular: boolean }[]
}

export interface PlanStep {
  key: string
  title?: string
  type?: string
  agent?: string
  why?: string
  after?: string[]
  inputs?: Record<string, string>
  params?: Record<string, unknown>
  outputs?: string[]
  gate?: string
}

export interface PlanValidationError {
  code: string
  step_key: string | null
  message: string
}

export interface Investigation {
  id: string
  workspace_id: string
  question: string
  intent: InvestigationIntent | null
  status: InvestigationStatus
  current_plan_id: string | null
  approved_plan_id: string | null
  workflow_id: string | null
  error: { message?: string; code?: string } | null
  created_at: string
  updated_at: string | null
}

export interface Plan {
  id: string
  version: number
  body: {
    steps: PlanStep[]
    objective?: string
    understood?: string
    assumptions?: { key: string; value: string }[]
    answers?: { question: string; answer: string }[]
    [key: string]: unknown
  }
  validation: { valid?: boolean; errors?: PlanValidationError[] } | null
  approved_by: string | null
  approved_at: string | null
}

export interface InvestigationStep {
  key: string
  title: string
  type: string
  agent: string | null
  after: string[]
  gate: string | null
  status: StepStatus
  attempt: number | null
  records_in: number | null
  records_out: number | null
  summary: string | null
  error: { message?: string } | null
  started_at: string | null
  finished_at: string | null
}

export interface SearchSource {
  file_id: string
  file_version_id: string
  file_name: string
  tabular: boolean
  hits: number
  score: number
}

export interface SearchPassage {
  chunk_id: string
  file_name: string
  location: { page?: number; sheet?: string; row_start?: number; row_end?: number }
  text: string
  score: number
}

export interface SearchSummary {
  query: string
  status: 'found' | 'not_found'
  degraded: string[]
  took_ms: number
  counts: { passages: number; facts: number; entities: number }
  sources: SearchSource[]
  passages: SearchPassage[]
}

export interface InvestigationDetail {
  investigation: Investigation
  plan: Plan | null
  steps: InvestigationStep[]
  search: SearchSummary | null
  last_event_id: number
}

export interface SherlockEvent {
  id: number
  type: string
  payload: Record<string, any>
  created_at: string
}

export const TERMINAL_STATUSES: InvestigationStatus[] = ['in_review', 'completed', 'failed', 'cancelled']

const base = (workspaceId: string) => `/api/workspaces/${workspaceId}/sherlock/investigations`

export const listInvestigations = (workspaceId: string, limit = 20): Promise<Investigation[]> =>
  apiFetch(`${base(workspaceId)}?limit=${limit}`)

export const getInvestigation = (workspaceId: string, investigationId: string): Promise<InvestigationDetail> =>
  apiFetch(`${base(workspaceId)}/${investigationId}`)

export const cancelInvestigation = (workspaceId: string, investigationId: string): Promise<InvestigationDetail> =>
  apiFetch(`${base(workspaceId)}/${investigationId}/cancel`, { method: 'POST' })

export const createInvestigation = (workspaceId: string, question: string, autoPlan = true): Promise<Investigation> =>
  apiFetch(base(workspaceId), { method: 'POST', body: JSON.stringify({ question, auto_plan: autoPlan }) })

export const answerQuestions = (
  workspaceId: string,
  investigationId: string,
  answers: Record<string, string>
): Promise<InvestigationDetail> =>
  apiFetch(`${base(workspaceId)}/${investigationId}/answers`, { method: 'POST', body: JSON.stringify({ answers }) })

export const revisePlan = (
  workspaceId: string,
  investigationId: string,
  version: number,
  instruction: string
): Promise<InvestigationDetail> =>
  apiFetch(`${base(workspaceId)}/${investigationId}/plans/${version}/revise`, {
    method: 'POST',
    body: JSON.stringify({ instruction }),
  })

export const retryPlanning = (workspaceId: string, investigationId: string): Promise<InvestigationDetail> =>
  apiFetch(`${base(workspaceId)}/${investigationId}/retry-planning`, { method: 'POST' })

export const addPlan = (workspaceId: string, investigationId: string, steps: unknown[]): Promise<Plan> =>
  apiFetch(`${base(workspaceId)}/${investigationId}/plans`, {
    method: 'POST',
    body: JSON.stringify({ body: { steps } }),
  })

export const approvePlan = (workspaceId: string, investigationId: string, version: number): Promise<InvestigationDetail> =>
  apiFetch(`${base(workspaceId)}/${investigationId}/plans/${version}/approve`, { method: 'POST' })

export async function streamInvestigationEvents(
  workspaceId: string,
  investigationId: string,
  afterId: number,
  onEvent: (event: SherlockEvent) => void,
  signal: AbortSignal
): Promise<'ended' | 'closed'> {
  const token = getToken()
  const response = await fetch(`${API_URL}${base(workspaceId)}/${investigationId}/events?after=${afterId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: 'include',
    signal,
  })
  if (!response.ok || !response.body) {
    throw new Error(`Live updates failed (${response.status})`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { value, done } = await reader.read()
    if (done) return 'closed'
    buffer += decoder.decode(value, { stream: true })
    const blocks = buffer.split('\n\n')
    buffer = blocks.pop() || ''
    for (const block of blocks) {
      const lines = block.split('\n')
      const eventName = lines.find((line) => line.startsWith('event: '))?.slice(7)
      const dataLine = lines.find((line) => line.startsWith('data: '))
      if (eventName === 'end') return 'ended'
      if (dataLine) onEvent(JSON.parse(dataLine.slice(6)))
    }
  }
}
