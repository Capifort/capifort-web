'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Spinner } from '@/components/spinner'
import { listCases, type CaseList, type FindingSentence, type FindingsDraft } from '@/lib/sherlock-api'

const CASE_STATUS_LABELS: Record<string, string> = {
  evidence_backed: 'Conflict shown',
  needs_info: 'Needs info',
  candidate: 'Candidate',
}

const CASE_STATUS_STYLES: Record<string, string> = {
  evidence_backed: 'bg-red-50 text-red-700',
  needs_info: 'bg-amber-50 text-amber-700',
  candidate: 'bg-slate-100 text-slate-600',
}

const RISK_BAND_STYLES: Record<string, string> = {
  high: 'bg-red-50 text-red-700',
  medium: 'bg-amber-50 text-amber-700',
  low: 'bg-slate-100 text-slate-600',
}

// These columns get a pill or are already shown elsewhere in the row
const PILL_COLUMNS = ['case_status', 'risk_band']

function columnLabel(column: string) {
  return column.replace(/^match_/, 'change ').replace(/_/g, ' ')
}

function cellText(value: unknown) {
  if (value === null || value === undefined || value === '') return '—'
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—'
  return String(value)
}

function Pill({ text, className }: { text: string; className: string }) {
  return <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ${className}`}>{text}</span>
}

export function CaseReview({
  workspaceId,
  investigationId,
  submitting,
  onSubmit,
}: {
  workspaceId: string
  investigationId: string
  submitting: boolean
  onSubmit: (confirmedCaseIds: string[]) => void
}) {
  const [caseList, setCaseList] = useState<CaseList | null>(null)
  const [loadError, setLoadError] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    listCases(workspaceId, investigationId)
      .then(setCaseList)
      .catch((error: any) => setLoadError(error?.message || 'Could not load the cases.'))
  }, [workspaceId, investigationId])

  if (loadError) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
        <AlertTriangle size={14} /> {loadError}
      </div>
    )
  }
  if (!caseList) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
        <Spinner size={14} /> Loading the cases to review…
      </div>
    )
  }

  const caseIds = caseList.cases.map((row) => String(row.case_id))
  const allSelected = caseIds.length > 0 && selectedIds.length === caseIds.length
  const detailColumns = caseList.columns.filter((column) => column !== 'case_id' && !PILL_COLUMNS.includes(column))
  const toggle = (caseId: string) =>
    setSelectedIds((current) => (current.includes(caseId) ? current.filter((id) => id !== caseId) : [...current, caseId]))

  const submitLabel = selectedIds.length ? `Confirm ${selectedIds.length} of ${caseList.total} cases` : 'Finish with no findings'

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900">Review the cases</p>
        <p className="text-xs text-slate-400">
          {caseList.total} {caseList.total === 1 ? 'case' : 'cases'}
          {caseList.total > caseList.cases.length && ` · showing the ${caseList.cases.length} with the highest risk`}
        </p>
      </div>
      <p className="mb-3 text-xs text-slate-500">
        {caseList.total
          ? 'Tick the cases that are real exceptions. Sherlock drafts findings only from the cases you confirm.'
          : 'Sherlock found no cases. Finish the review to close this run with no findings.'}
      </p>

      {caseList.cases.length > 0 && (
        <div className="max-h-[28rem] overflow-auto rounded-lg border border-slate-100">
          <table className="w-full min-w-max border-collapse text-xs">
            <thead className="sticky top-0 bg-[#FBFAF7] text-left text-[11px] uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-3 py-2">
                  <input
                    id="select-all-cases"
                    type="checkbox"
                    aria-label="Select every case"
                    checked={allSelected}
                    onChange={() => setSelectedIds(allSelected ? [] : caseIds)}
                  />
                </th>
                <th className="px-3 py-2 font-medium">Case</th>
                <th className="px-3 py-2 font-medium">Status</th>
                {caseList.columns.includes('risk_band') && <th className="px-3 py-2 font-medium">Risk</th>}
                {detailColumns.map((column) => (
                  <th key={column} className="whitespace-nowrap px-3 py-2 font-medium">
                    {columnLabel(column)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {caseList.cases.map((row) => {
                const caseId = String(row.case_id)
                const status = String(row.case_status || '')
                const band = String(row.risk_band || '')
                return (
                  <tr key={caseId} className="border-t border-slate-100 hover:bg-[#FBFAF7]">
                    <td className="px-3 py-2">
                      <input
                        id={`case-${caseId}`}
                        type="checkbox"
                        aria-label={`Confirm case ${caseId}`}
                        checked={selectedIds.includes(caseId)}
                        onChange={() => toggle(caseId)}
                      />
                    </td>
                    <td className="px-3 py-2 font-mono text-[11px] text-slate-500">{caseId}</td>
                    <td className="px-3 py-2">
                      <Pill text={CASE_STATUS_LABELS[status] || status} className={CASE_STATUS_STYLES[status] || 'bg-slate-100 text-slate-600'} />
                    </td>
                    {caseList.columns.includes('risk_band') && (
                      <td className="px-3 py-2">
                        <Pill text={`${band} · ${cellText(row.risk_score)}`} className={RISK_BAND_STYLES[band] || 'bg-slate-100 text-slate-600'} />
                      </td>
                    )}
                    {detailColumns.map((column) => (
                      <td key={column} className="whitespace-nowrap px-3 py-2 tabular-nums text-slate-700">
                        {cellText(row[column])}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
        {confirming ? (
          <>
            <p className="mr-auto text-xs text-slate-600">
              {selectedIds.length
                ? `Draft findings from ${selectedIds.length} confirmed ${selectedIds.length === 1 ? 'case' : 'cases'}? The review can't be changed afterwards.`
                : "Close this run with no findings? The review can't be changed afterwards."}
            </p>
            <button
              onClick={() => setConfirming(false)}
              disabled={submitting}
              className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 disabled:opacity-40"
            >
              Back
            </button>
            <button
              onClick={() => onSubmit(selectedIds)}
              disabled={submitting}
              className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-40"
            >
              {submitting ? 'Submitting…' : selectedIds.length ? 'Draft findings' : 'Close with no findings'}
            </button>
          </>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
          >
            {submitLabel}
          </button>
        )}
      </div>
    </div>
  )
}

function CitedSentences({
  label,
  sentences,
  references,
}: {
  label: string
  sentences: FindingSentence[]
  references: Record<string, string>
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <ul className="mt-1 space-y-1">
        {sentences.map((sentence, index) => (
          <li key={index} className="text-sm text-slate-800">
            {sentence.text}
            {sentence.refs.map((ref) => (
              <span
                key={ref}
                title={references[ref] || ref}
                className="ml-1 cursor-help rounded bg-slate-100 px-1 font-mono text-[10px] text-slate-500"
              >
                {ref}
              </span>
            ))}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function FindingsCard({ draft }: { draft: FindingsDraft }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900">Draft findings</p>
        <Pill text="Draft · needs reviewer sign-off" className="bg-amber-50 text-amber-700" />
      </div>
      {draft.findings.length === 0 && <p className="text-xs text-slate-500">No findings were drafted.</p>}
      <ol className="space-y-4">
        {draft.findings.map((finding) => (
          <li key={finding.group} className="space-y-3 rounded-lg border border-slate-100 p-3">
            <p className="text-sm font-semibold text-slate-900">
              <span className="mr-2 font-mono text-[11px] font-normal text-slate-400">{finding.group}</span>
              {finding.title}
            </p>
            <CitedSentences label="Condition" sentences={finding.condition} references={draft.references} />
            <CitedSentences label="Criteria" sentences={finding.criteria} references={draft.references} />
            <dl className="grid gap-2 text-sm sm:grid-cols-3">
              {(['cause', 'effect', 'recommendation'] as const).map((field) => (
                <div key={field}>
                  <dt className="text-[11px] uppercase tracking-[0.12em] text-slate-400">
                    {field}
                    {draft.suggested_fields.includes(field) && <span className="ml-1 normal-case tracking-normal">· suggested</span>}
                  </dt>
                  <dd className="mt-0.5 text-slate-700">{finding[field]}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ol>
    </div>
  )
}
