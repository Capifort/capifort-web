'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, FlaskConical } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { Spinner } from '@/components/spinner'
import { addPlan, createInvestigation, listInvestigations, type Investigation } from '@/lib/sherlock-api'

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  awaiting_approval: 'Awaiting approval',
  starting: 'Starting',
  running: 'In progress',
  paused: 'Paused',
  in_review: 'Ready for review',
  completed: 'Completed',
  failed: 'Failed',
  cancelled: 'Cancelled',
}

const STATUS_DOTS: Record<string, string> = {
  starting: 'bg-sky-500',
  running: 'bg-sky-500',
  in_review: 'bg-emerald-500',
  completed: 'bg-emerald-500',
  failed: 'bg-red-500',
  cancelled: 'bg-slate-400',
  paused: 'bg-amber-500',
  awaiting_approval: 'bg-amber-400',
}

const SHOW_TEST_BUTTON = process.env.NODE_ENV === 'development'

const TEST_QUESTION = 'Test: vendor bank changes paid within 72 hours'
const TEST_STEPS = [
  { key: 's1', title: 'Retrieve payments', type: 'retrieve_population', agent: 'data_investigator' },
  { key: 's2', title: 'Retrieve bank changes', type: 'retrieve_population', agent: 'data_investigator' },
  { key: 's3', title: 'Correlate payments and changes', type: 'correlate', agent: 'control_tester', after: ['s1', 's2'] },
  {
    key: 's4',
    title: 'Draft findings',
    type: 'draft_findings',
    agent: 'finding_generator',
    after: ['s3'],
    gate: 'after_review',
  },
]

function timeAgo(value: string) {
  const minutes = Math.round((Date.now() - new Date(value).getTime()) / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} h ago`
  return new Date(value).toLocaleDateString()
}

export default function InvestigationsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const workspaceId = user?.current_workspace_id || null

  const [investigations, setInvestigations] = useState<Investigation[] | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!workspaceId) return
    listInvestigations(workspaceId, 50)
      .then(setInvestigations)
      .catch((error) => setErrorMessage(error?.message || 'Could not load investigations.'))
  }, [workspaceId])

  const createTestInvestigation = async () => {
    if (!workspaceId) return
    setCreating(true)
    setErrorMessage('')
    try {
      const investigation = await createInvestigation(workspaceId, TEST_QUESTION)
      await addPlan(workspaceId, investigation.id, TEST_STEPS)
      router.push(`/dashboard/investigations/${investigation.id}`)
    } catch (error: any) {
      setErrorMessage(error?.message || 'Could not create the test investigation.')
      setCreating(false)
    }
  }

  if (!workspaceId) {
    return <p className="px-8 py-8 text-sm text-slate-400">Select a workspace to see its investigations.</p>
  }

  return (
    <div className="min-h-dvh">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 bg-white px-5 py-6 sm:px-8">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Casebook</h1>
          <p className="mt-1 text-sm text-slate-500">Every Sherlock investigation in this workspace.</p>
        </div>
        {SHOW_TEST_BUTTON && (
          <button
            onClick={createTestInvestigation}
            disabled={creating}
            className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-40"
          >
            {creating ? <Spinner size={13} /> : <FlaskConical size={14} strokeWidth={1.75} />}
            New test investigation
          </button>
        )}
      </div>

      <div className="space-y-3 px-5 py-6 sm:px-8">
        {errorMessage && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>
        )}

        {investigations === null && !errorMessage && (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Spinner size={16} /> Loading…
          </div>
        )}

        {investigations?.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-14 text-center">
            <span className="h-12 w-12 rounded-full border border-dashed border-slate-300" />
            <p className="text-sm font-semibold text-slate-900">Your casebook is empty</p>
            <p className="max-w-md text-sm text-slate-500">
              {SHOW_TEST_BUTTON
                ? 'Create a test investigation to watch Sherlock run a plan.'
                : 'Investigations you start will appear here.'}
            </p>
          </div>
        )}

        {investigations?.map((investigation) => (
          <Link
            key={investigation.id}
            href={`/dashboard/investigations/${investigation.id}`}
            className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3.5 hover:border-slate-300"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">{investigation.question}</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOTS[investigation.status] || 'bg-slate-300'}`} />
                {STATUS_LABELS[investigation.status] || investigation.status}
                <span className="text-slate-400">· {timeAgo(investigation.created_at)}</span>
              </p>
            </div>
            <ChevronRight size={14} strokeWidth={1.75} className="flex-shrink-0 text-slate-300 group-hover:text-slate-500" />
          </Link>
        ))}
      </div>
    </div>
  )
}
