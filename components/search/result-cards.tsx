'use client'

import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { getFileDownloadUrl } from '@/lib/file-api'
import type {
  EntityResult,
  FactResult,
  MatchedBy,
  PassageResult,
  SearchLocation,
} from '@/lib/search-api'

const FILE_BADGES: Record<string, { label: string; className: string }> = {
  pdf: { label: 'PDF', className: 'bg-red-50 text-red-700' },
  xlsx: { label: 'XLS', className: 'bg-emerald-50 text-emerald-700' },
  xls: { label: 'XLS', className: 'bg-emerald-50 text-emerald-700' },
  csv: { label: 'CSV', className: 'bg-emerald-50 text-emerald-700' },
  docx: { label: 'DOC', className: 'bg-sky-50 text-sky-700' },
  doc: { label: 'DOC', className: 'bg-sky-50 text-sky-700' },
}

export function locationLabel(location: SearchLocation, short = false) {
  if (location.sheet) {
    const rows = location.row_start != null ? ` rows ${location.row_start}–${location.row_end}` : ''
    return `sheet ${location.sheet}${rows}`
  }
  if (location.page != null) return short ? `p. ${location.page}` : `page ${location.page}`
  return ''
}

// The presigned URL arrives after a request; opening the tab first keeps
// popup blockers from treating it as an unrequested popup.
export async function openSource(
  workspaceId: string,
  fileId: string,
  versionId: string | null,
  location: SearchLocation
) {
  const sourceTab = window.open('', '_blank')
  try {
    const download = await getFileDownloadUrl(workspaceId, fileId, versionId || undefined)
    const pageAnchor = location.page != null ? `#page=${location.page}` : ''
    if (sourceTab) sourceTab.location.href = `${download.download_url}${pageAnchor}`
  } catch {
    sourceTab?.close()
  }
}

function HighlightedText({ text, terms }: { text: string; terms: string[] }) {
  if (!terms.length) return <>{text}</>
  const escapedTerms = terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const matcher = new RegExp(`(${escapedTerms.join('|')})`, 'gi')
  return (
    <>
      {text.split(matcher).map((part, index) =>
        index % 2 === 1 ? (
          <mark key={index} className="rounded bg-amber-100 px-0.5 text-slate-900">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  )
}

function FileBadge({ fileName }: { fileName: string | null }) {
  const extension = (fileName || '').split('.').pop()?.toLowerCase() || ''
  const badge = FILE_BADGES[extension] || { label: 'FILE', className: 'bg-slate-100 text-slate-500' }
  return (
    <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded text-[8px] font-bold ${badge.className}`}>
      {badge.label}
    </span>
  )
}

export function MatchedByPill({ matchedBy }: { matchedBy: MatchedBy[] }) {
  const both = matchedBy.length > 1
  const label = both ? 'meaning + keywords' : matchedBy[0] || 'keywords'
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[11px] ${
        both ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-[#FBFAF7] text-slate-500'
      }`}
    >
      {label}
    </span>
  )
}

function ScoreLabel({ score }: { score: number }) {
  return <span className="text-[11px] tabular-nums text-slate-400">RRF {score.toFixed(4)}</span>
}

export function PassageCard({
  passage,
  terms,
  workspaceId,
}: {
  passage: PassageResult
  terms: string[]
  workspaceId: string
}) {
  const [expanded, setExpanded] = useState(false)
  const isLong = passage.text.length > 420
  const where = locationLabel(passage.location)

  return (
    <article className="rounded-xl border border-slate-200 bg-white px-4 py-3.5">
      <div className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
        <FileBadge fileName={passage.file_name} />
        <span className="min-w-0 truncate font-medium text-slate-900" title={passage.file_name}>
          {passage.file_name}
        </span>
        <span className="flex-shrink-0">
          {where && `· ${where} `}· {passage.type.replace('_', ' ')}
        </span>
      </div>

      <p
        className={`mt-2 whitespace-pre-line break-words text-[13.5px] leading-relaxed text-slate-700 ${
          expanded ? '' : 'line-clamp-4'
        }`}
      >
        <HighlightedText text={passage.text} terms={terms} />
      </p>

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <MatchedByPill matchedBy={passage.matched_by} />
        <ScoreLabel score={passage.score} />
        {isLong && (
          <button onClick={() => setExpanded((open) => !open)} className="text-xs text-slate-500 hover:text-slate-900">
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
        <button
          onClick={() => openSource(workspaceId, passage.file_id, passage.file_version_id, passage.location)}
          className="ml-auto flex items-center gap-1 text-xs font-medium text-slate-900 hover:underline"
        >
          {passage.location.page != null ? `Open page ${passage.location.page}` : 'Open file'}
          <ArrowUpRight size={13} strokeWidth={1.75} />
        </button>
      </div>
    </article>
  )
}

export function FactCard({ fact, workspaceId }: { fact: FactResult; workspaceId: string }) {
  const canOpen = Boolean(fact.file_id)
  return (
    <article
      onClick={() => canOpen && openSource(workspaceId, fact.file_id!, fact.file_version_id, fact.location)}
      className={`group rounded-xl border border-slate-200 bg-white px-4 py-3 ${canOpen ? 'cursor-pointer hover:border-slate-300' : ''}`}
    >
      <div className="flex items-start justify-between gap-3 text-[11.5px] text-slate-400">
        <span className="min-w-0 truncate">
          {fact.entity_type.toLowerCase().replace('_', ' ')} · {fact.entity_name}
        </span>
        <span className="flex-shrink-0">{locationLabel(fact.location, true)}</span>
      </div>
      <p className="mt-1 break-words text-sm font-medium text-slate-900">
        {fact.key_label}: {fact.value}
      </p>
      {fact.quote && (
        <p className="mt-2 hidden rounded-lg bg-[#FBFAF7] px-2.5 py-2 text-xs text-slate-500 group-hover:block">
          “{fact.quote}”
        </p>
      )}
      <div className="mt-2 flex items-center gap-2">
        <MatchedByPill matchedBy={fact.matched_by} />
        <ScoreLabel score={fact.score} />
      </div>
    </article>
  )
}

export function EntityCard({ entity, onSelect }: { entity: EntityResult; onSelect: () => void }) {
  return (
    <article
      onClick={onSelect}
      className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 hover:border-slate-300"
    >
      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-900">
        {entity.type.slice(0, 1)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-medium text-slate-900">{entity.name}</span>
        <span className="block text-xs text-slate-500">
          {entity.type.toLowerCase().replace('_', ' ')}
          {entity.processes.length > 0 && ` · ${entity.processes.join(', ')}`} · {entity.fact_count} facts ·{' '}
          {entity.file_count} {entity.file_count === 1 ? 'file' : 'files'}
        </span>
        <span className="mt-1.5 flex items-center gap-2">
          <MatchedByPill matchedBy={entity.matched_by} />
          <ScoreLabel score={entity.score} />
        </span>
      </span>
    </article>
  )
}
