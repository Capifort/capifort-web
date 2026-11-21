'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { AlertTriangle, ChevronLeft, FileText, Table2 } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { Spinner } from '@/components/spinner'
import { ClarifyCard, IntentCard, PlannerWorking, PlanReview } from '@/components/sherlock/ask-and-plan'
import {
  answerQuestions,
  approvePlan,
  cancelInvestigation,
  getInvestigation,
  retryPlanning,
  revisePlan,
  streamInvestigationEvents,
  TERMINAL_STATUSES,
  type InvestigationDetail,
  type InvestigationStep,
  type SearchPassage,
  type SearchSummary,
  type SherlockEvent,
} from '@/lib/sherlock-api'

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  interpreting: 'Reading your question',
  clarifying: 'Needs your answers',
  planning: 'Drafting the plan',
  awaiting_approval: 'Awaiting approval',
  starting: 'Starting',
  running: 'In progress',
  paused: 'Paused',
  in_review: 'Ready for review',
  completed: 'Completed',
  failed: 'Failed',
  cancelled: 'Cancelled',
  pending: 'Pending',
  after_review: 'After review',
}

const STATUS_DOTS: Record<string, string> = {
  interpreting: 'bg-sky-500 animate-pulse',
  planning: 'bg-sky-500 animate-pulse',
  clarifying: 'bg-amber-400',
  starting: 'bg-sky-500 animate-pulse',
  running: 'bg-sky-500 animate-pulse',
  completed: 'bg-emerald-500',
  in_review: 'bg-emerald-500',
  failed: 'bg-red-500',
  cancelled: 'bg-slate-400',
  paused: 'bg-amber-500',
  after_review: 'bg-amber-400',
  awaiting_approval: 'bg-amber-400',
}

const CANCELLABLE = ['starting', 'running', 'paused']
const PLANNER_WORKING = ['interpreting', 'planning']
// These events carry new intent, questions or plan versions, so the page reloads the detail
const PLANNER_EVENTS = ['intent.ready', 'plan.drafted']
const RECONNECT_MS = 2000
// Proxies such as the Next dev rewrite can hold back the event stream, so while
// Sherlock is working the page also reloads on a timer
const POLLED_STATUSES = ['interpreting', 'planning', 'starting', 'running']
const POLL_MS = 3000

function StatusDot({ status }: { status: string }) {
  return <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${STATUS_DOTS[status] || 'bg-slate-300'}`} />
}

function formatTime(value: string | null) {
  return value ? new Date(value).toLocaleTimeString() : '—'
}

function duration(step: InvestigationStep) {
  if (!step.started_at || !step.finished_at) return null
  const seconds = (new Date(step.finished_at).getTime() - new Date(step.started_at).getTime()) / 1000
  return `${seconds.toFixed(1)} s`
}

function applyEvent(detail: InvestigationDetail, event: SherlockEvent): InvestigationDetail {
  const payload = event.payload || {}
  if (event.type === 'status.changed') {
    return {
      ...detail,
      last_event_id: event.id,
      investigation: { ...detail.investigation, status: payload.status, error: payload.error || null },
    }
  }
  if (event.type === 'search.completed') {
    return { ...detail, search: payload as SearchSummary, last_event_id: event.id }
  }
  if (!event.type.startsWith('step.') || !payload.step_key) {
    return { ...detail, last_event_id: event.id }
  }
  const steps = detail.steps.map((step) => {
    if (step.key !== payload.step_key) return step
    const isStart = event.type === 'step.started'
    return {
      ...step,
      status: payload.status,
      attempt: payload.attempt ?? step.attempt,
      summary: isStart ? null : payload.summary ?? step.summary,
      error: isStart ? null : payload.error ?? step.error,
      started_at: isStart ? event.created_at : step.started_at,
      finished_at: isStart ? null : event.created_at,
    }
  })
  return { ...detail, steps, last_event_id: event.id }
}

function passageLocation(location: SearchPassage['location']) {
  if (location.sheet) return `${location.sheet} · rows ${location.row_start}–${location.row_end}`
  if (location.page) return `page ${location.page}`
  return ''
}

function SearchCard({ search }: { search: SearchSummary | null }) {
  if (!search) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-400">
        <StatusDot status="running" /> Searching the knowledge index…
      </div>
    )
  }
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900">Sources found first</p>
        <p className="text-xs text-slate-400">
          {search.counts.passages} passages · {search.counts.facts} facts · {search.counts.entities} entities ·{' '}
          {search.took_ms} ms
          {search.degraded.length > 0 && (
            <span className="ml-2 rounded-full bg-amber-50 px-1.5 text-[10px] font-medium leading-4 text-amber-700">
              degraded: {search.degraded.join(', ')}
            </span>
          )}
        </p>
      </div>
      {search.status === 'not_found' && (
        <p className="text-xs text-slate-500">Nothing in this workspace matches the question yet.</p>
      )}
      <ul className="flex flex-wrap gap-2">
        {search.sources.map((source) => (
          <li
            key={source.file_id}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-700"
          >
            {source.tabular ? (
              <Table2 size={12} strokeWidth={1.75} className="text-emerald-600" />
            ) : (
              <FileText size={12} strokeWidth={1.75} className="text-slate-400" />
            )}
            {source.file_name}
            <span className="text-slate-400">· {source.hits}</span>
          </li>
        ))}
      </ul>
      {search.passages.length > 0 && (
        <ol className="mt-3 space-y-2">
          {search.passages.slice(0, 3).map((passage) => (
            <li key={passage.chunk_id} className="rounded-lg bg-[#FBFAF7] px-3 py-2 text-xs">
              <p className="text-slate-400">
                {passage.file_name} · {passageLocation(passage.location)}
              </p>
              <p className="mt-0.5 line-clamp-2 text-slate-700">{passage.text}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

function StepDetail({ step }: { step: InvestigationStep }) {
  const rows: [string, string][] = [
    ['Agent', step.agent || '—'],
    ['Status', STATUS_LABELS[step.status] || step.status],
    ['Attempt', step.attempt ? String(step.attempt) : '—'],
    ['Started', formatTime(step.started_at)],
    ['Finished', formatTime(step.finished_at)],
    ['Duration', duration(step) || '—'],
    ['Records', step.records_in != null ? `${step.records_in} in → ${step.records_out ?? 0} out` : '—'],
    ['Depends on', step.after.length ? step.after.join(', ') : '—'],
  ]
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900">
          {step.key} · {step.title}
        </p>
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <StatusDot status={step.status} />
          {STATUS_LABELS[step.status] || step.status}
        </span>
      </div>
      <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-xs">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-slate-400">{label}</dt>
            <dd className="tabular-nums text-slate-700">{value}</dd>
          </div>
        ))}
      </dl>
      {step.summary && <p className="mt-3 rounded-lg bg-[#FBFAF7] px-3 py-2 text-xs text-slate-700">{step.summary}</p>}
      {step.error?.message && (
        <p className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">{step.error.message}</p>
      )}
    </div>
  )
}

export default function InvestigationPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const workspaceId = user?.current_workspace_id || null

  const [detail, setDetail] = useState<InvestigationDetail | null>(null)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [cancelling, setCancelling] = useState(false)
  const [approving, setApproving] = useState(false)
  const [answering, setAnswering] = useState(false)
  const [revising, setRevising] = useState(false)
  const [followAttempt, setFollowAttempt] = useState(0)
  const lastEventId = useRef(0)

  const load = useCallback(async () => {
    if (!workspaceId || !id) return null
    const loaded = await getInvestigation(workspaceId, id)
    lastEventId.current = loaded.last_event_id
    setDetail(loaded)
    return loaded
  }, [workspaceId, id])

  useEffect(() => {
    if (!workspaceId || !id) return
    const controller = new AbortController()
    let stopped = false

    const follow = async () => {
      try {
        const loaded = await load()
        if (!loaded || TERMINAL_STATUSES.includes(loaded.investigation.status)) return
        while (!stopped) {
          const outcome = await streamInvestigationEvents(
            workspaceId,
            id,
            lastEventId.current,
            (event) => {
              lastEventId.current = event.id
              setDetail((current) => (current ? applyEvent(current, event) : current))
              if (PLANNER_EVENTS.includes(event.type)) load()
            },
            controller.signal
          )
          if (outcome === 'ended') return
          await new Promise((resolve) => setTimeout(resolve, RECONNECT_MS))
        }
      } catch (error: any) {
        if (error?.name === 'AbortError') return
        setErrorMessage(error?.message || 'Could not load this investigation.')
      }
    }

    follow()
    return () => {
      stopped = true
      controller.abort()
    }
  }, [workspaceId, id, load, followAttempt])

  const currentStatus = detail?.investigation.status
  useEffect(() => {
    if (!currentStatus || !POLLED_STATUSES.includes(currentStatus)) return
    const timer = setInterval(() => {
      load().catch(() => {})
    }, POLL_MS)
    return () => clearInterval(timer)
  }, [currentStatus, load])

  const approve = async (version: number) => {
    if (!workspaceId || !id) return
    setApproving(true)
    setErrorMessage('')
    try {
      await approvePlan(workspaceId, id, version)
    } catch (error: any) {
      setErrorMessage(error?.message || 'Approval failed.')
    } finally {
      setApproving(false)
    }
  }

  const submitAnswers = async (answers: Record<string, string>) => {
    if (!workspaceId || !id) return
    setAnswering(true)
    setErrorMessage('')
    try {
      setDetail(await answerQuestions(workspaceId, id, answers))
    } catch (error: any) {
      setErrorMessage(error?.message || 'Could not send your answers.')
    } finally {
      setAnswering(false)
    }
  }

  const requestRevision = async (version: number, instruction: string) => {
    if (!workspaceId || !id) return
    setRevising(true)
    setErrorMessage('')
    try {
      setDetail(await revisePlan(workspaceId, id, version, instruction))
    } catch (error: any) {
      setErrorMessage(error?.message || 'Could not request the revision.')
    } finally {
      setRevising(false)
    }
  }

  const retryPlanner = async () => {
    if (!workspaceId || !id) return
    setErrorMessage('')
    try {
      setDetail(await retryPlanning(workspaceId, id))
      // A failed investigation closed its event stream; open a new one
      setFollowAttempt((attempt) => attempt + 1)
    } catch (error: any) {
      setErrorMessage(error?.message || 'Could not restart planning.')
    }
  }

  const cancel = async () => {
    if (!workspaceId || !id) return
    setCancelling(true)
    try {
      await cancelInvestigation(workspaceId, id)
    } catch (error: any) {
      setErrorMessage(error?.message || 'Cancel failed.')
    } finally {
      setCancelling(false)
    }
  }

  if (!workspaceId) {
    return <p className="px-8 py-8 text-sm text-slate-400">Select a workspace to see its investigations.</p>
  }
  if (!detail) {
    return (
      <div className="flex items-center gap-2 px-8 py-8 text-sm text-slate-400">
        {errorMessage ? errorMessage : (<><Spinner size={16} /> Loading…</>)}
      </div>
    )
  }

  const { investigation, plan, steps } = detail
  const finished = steps.filter((step) => step.status === 'completed').length
  const selected = steps.find((step) => step.key === selectedKey) || steps.find((step) => step.status === 'running') || steps[0]

  return (
    <div className="min-h-dvh">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 bg-white px-5 py-6 sm:px-8">
        <div className="min-w-0">
          <Link
            href="/dashboard/investigations"
            className="mb-2 inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900"
          >
            <ChevronLeft size={13} strokeWidth={1.75} />
            Casebook
          </Link>
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Sherlock investigation</p>
          <h1 className="mt-1 text-lg font-semibold text-slate-900">{investigation.question}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
            <StatusDot status={investigation.status} />
            {STATUS_LABELS[investigation.status] || investigation.status}
            {plan && <span className="text-slate-400">· plan v{plan.version} · {finished} of {steps.length} steps done</span>}
          </p>
        </div>
        {CANCELLABLE.includes(investigation.status) && (
          <button
            onClick={cancel}
            disabled={cancelling}
            className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 disabled:opacity-40"
          >
            {cancelling ? 'Cancelling…' : 'Cancel run'}
          </button>
        )}
      </div>

      <div className="space-y-4 px-5 py-6 sm:px-8">
        {(errorMessage || investigation.error?.message) && (
          <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertTriangle size={14} />
            {errorMessage || investigation.error?.message}
            {investigation.error?.code === 'planner' && investigation.status === 'failed' && (
              <button
                onClick={retryPlanner}
                className="ml-auto rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-medium text-red-700 hover:border-red-300"
              >
                Try again
              </button>
            )}
          </div>
        )}

        {PLANNER_WORKING.includes(investigation.status) && <PlannerWorking status={investigation.status} />}

        {investigation.intent?.understood && ['interpreting', 'clarifying', 'planning', 'awaiting_approval'].includes(investigation.status) && (
          <IntentCard intent={investigation.intent} />
        )}

        {investigation.status === 'clarifying' && investigation.intent?.questions && (
          <ClarifyCard questions={investigation.intent.questions} submitting={answering} onSubmit={submitAnswers} />
        )}

        {investigation.status === 'awaiting_approval' && plan && (
          <PlanReview
            plan={plan}
            approving={approving}
            revising={revising}
            onApprove={() => approve(plan.version)}
            onRevise={(instruction) => requestRevision(plan.version, instruction)}
          />
        )}

        {(detail.search || ['starting', 'running'].includes(investigation.status)) && (
          <SearchCard search={detail.search} />
        )}

        {!plan && investigation.status === 'draft' && (
          <p className="text-sm text-slate-400">This investigation has no plan yet.</p>
        )}

        {plan && !['awaiting_approval', 'planning'].includes(investigation.status) && (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <ol className="rounded-xl border border-slate-200 bg-white py-1.5">
              {steps.map((step, index) => (
                <li key={step.key}>
                  <button
                    onClick={() => setSelectedKey(step.key)}
                    className={`grid w-full grid-cols-[10px_22px_minmax(0,1fr)_auto] items-start gap-2.5 px-4 py-2.5 text-left hover:bg-[#FBFAF7] ${
                      selected?.key === step.key ? 'bg-[#FBFAF7] shadow-[inset_2px_0_0_#0f172a]' : ''
                    }`}
                  >
                    <span className="mt-1.5"><StatusDot status={step.status} /></span>
                    <span className="pt-0.5 text-[11px] tabular-nums text-slate-400">{String(index + 1).padStart(2, '0')}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-slate-900">{step.title}</span>
                      <span className="block truncate text-xs text-slate-400">{step.agent || step.type || step.key}</span>
                    </span>
                    <span className="pt-0.5 text-xs text-slate-400">{STATUS_LABELS[step.status] || step.status}</span>
                  </button>
                </li>
              ))}
            </ol>
            {selected && <StepDetail step={selected} />}
          </div>
        )}
      </div>
    </div>
  )
}
