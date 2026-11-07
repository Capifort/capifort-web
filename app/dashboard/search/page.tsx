'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertTriangle, ArrowUp, ChevronDown, Search, X } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { getDomainFileTree, type DomainFolderNode } from '@/lib/file-api'
import { searchWorkspace, type SearchKind, type SearchResponse } from '@/lib/search-api'
import { EntityCard, FactCard, PassageCard } from '@/components/search/result-cards'

const PROCESSES = [
  { id: 'P2P', label: 'Procure to pay' },
  { id: 'O2C', label: 'Order to cash' },
  { id: 'H2R', label: 'Hire to retire' },
]
const EXAMPLE_QUESTIONS = [
  'payment terms with the vendor',
  'who approved the purchase order',
  'promoters and their shareholding',
]
const KIND_LABELS: Record<SearchKind, string> = { passages: 'Passages', facts: 'Facts', entities: 'Entities' }

type SearchStatus = 'idle' | 'loading' | 'done' | 'error'
type FileOption = { id: string; name: string }

function workspaceFiles(folders: DomainFolderNode[], workspaceId: string): FileOption[] {
  const files: FileOption[] = []
  const visit = (folder: DomainFolderNode) => {
    if (folder.workspace_id === workspaceId) folder.files.forEach((file) => files.push({ id: file.id, name: file.name }))
    folder.children.forEach(visit)
  }
  folders.forEach(visit)
  return files.sort((a, b) => a.name.localeCompare(b.name))
}

function FilterMenu({
  label,
  options,
  selected,
  onApply,
}: {
  label: string
  options: { id: string; label: string }[]
  selected: string[]
  onApply: (ids: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<string[]>(selected)
  const summary = selected.length === 0 ? 'any' : selected.length === 1 ? options.find((o) => o.id === selected[0])?.id.slice(0, 18) : `${selected.length}`

  return (
    <div className="relative">
      <button
        onClick={() => { setDraft(selected); setOpen((isOpen) => !isOpen) }}
        className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs ${
          selected.length ? 'border-slate-900 bg-slate-900 text-white' : 'border-dashed border-slate-300 bg-white text-slate-500'
        }`}
      >
        {label}: {summary} <ChevronDown size={12} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10 bg-slate-900/20 sm:bg-transparent" onClick={() => setOpen(false)} />
          {/* A bottom sheet on phones, a dropdown from sm up */}
          <div className="fixed inset-x-0 bottom-0 z-20 max-h-[70vh] overflow-y-auto rounded-t-2xl border border-slate-200 bg-white p-2 shadow-lg sm:absolute sm:inset-x-auto sm:bottom-auto sm:left-0 sm:top-9 sm:w-64 sm:rounded-xl">
            {options.length === 0 && <p className="px-2 py-2 text-xs text-slate-400">Nothing to choose from yet.</p>}
            {options.map((option) => (
              <label key={option.id} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-slate-700 hover:bg-[#FBFAF7]">
                <input
                  type="checkbox"
                  checked={draft.includes(option.id)}
                  onChange={() => setDraft((ids) => (ids.includes(option.id) ? ids.filter((id) => id !== option.id) : [...ids, option.id]))}
                  className="accent-slate-900"
                />
                <span className="min-w-0 truncate">{option.label}</span>
              </label>
            ))}
            <div className="mt-1 flex justify-between border-t border-slate-100 px-2 pb-1 pt-2 text-xs">
              <button onClick={() => setDraft([])} className="text-slate-500 hover:text-slate-900">Clear</button>
              <button onClick={() => { onApply(draft); setOpen(false) }} className="font-medium text-slate-900">Apply</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function LoadingCards() {
  return (
    <div className="space-y-2">
      {[0, 1, 2].map((index) => (
        <div key={index} className="space-y-2 rounded-xl border border-slate-200 bg-white px-4 py-4">
          <div className="h-2.5 w-1/2 animate-pulse rounded bg-slate-100" />
          <div className="h-2.5 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-2.5 w-4/5 animate-pulse rounded bg-slate-100" />
        </div>
      ))}
    </div>
  )
}

function SearchView() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const workspaceId = user?.current_workspace_id || null
  const domainId = user?.domain_id || user?.domain?.id || null

  const [queryInput, setQueryInput] = useState(searchParams.get('q') || '')
  const [processes, setProcesses] = useState<string[]>([])
  const [fileIds, setFileIds] = useState<string[]>([])
  const [kindTab, setKindTab] = useState<'all' | SearchKind>('all')
  const [status, setStatus] = useState<SearchStatus>('idle')
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [fileOptions, setFileOptions] = useState<FileOption[]>([])
  const pendingRequest = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!domainId || !workspaceId) return
    getDomainFileTree(domainId)
      .then((folders) => setFileOptions(workspaceFiles(folders, workspaceId)))
      .catch(() => setFileOptions([]))
  }, [domainId, workspaceId])

  const runSearch = async (query: string, nextProcesses = processes, nextFileIds = fileIds) => {
    const trimmed = query.trim()
    if (!workspaceId || trimmed.length < 2) return
    // A newer search cancels the older one, so a slow answer never overwrites it
    pendingRequest.current?.abort()
    const controller = new AbortController()
    pendingRequest.current = controller
    setStatus('loading')
    setErrorMessage('')
    router.replace(`/dashboard/search?q=${encodeURIComponent(trimmed)}`)
    try {
      const response = await searchWorkspace(workspaceId, { query: trimmed, processes: nextProcesses, file_ids: nextFileIds }, controller.signal)
      setSearchResults(response)
      setStatus('done')
    } catch (error: any) {
      if (error?.name === 'AbortError') return
      setErrorMessage(error?.message || 'Search failed.')
      setStatus('error')
    }
  }

  useEffect(() => {
    const initialQuery = searchParams.get('q')
    if (initialQuery && workspaceId) runSearch(initialQuery)
    // Runs once per workspace: later searches go through runSearch directly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId])

  const searchFor = (query: string) => {
    setQueryInput(query)
    runSearch(query)
  }

  if (!workspaceId) {
    return <p className="px-8 py-8 text-sm text-slate-400">Select a workspace to search its documents.</p>
  }

  const counts = {
    passages: searchResults?.passages.length || 0,
    facts: searchResults?.facts.length || 0,
    entities: searchResults?.entities.length || 0,
  }
  const total = counts.passages + counts.facts + counts.entities
  const showGroup = (kind: SearchKind) => kindTab === 'all' || kindTab === kind
  const terms = searchResults?.terms || []

  return (
    <div className="min-h-dvh">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 bg-white px-5 py-6 sm:px-8">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Search</h1>
          <p className="mt-1 text-sm text-slate-500">Find evidence across this workspace&apos;s documents.</p>
        </div>
        <span className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-500">
          Workspace: {user?.current_workspace?.name || 'current'}
        </span>
      </div>

      <div className="space-y-4 px-5 py-6 sm:px-8">
        <form
          onSubmit={(event) => { event.preventDefault(); runSearch(queryInput) }}
          className="flex items-center gap-3 rounded-full border border-slate-200 bg-white py-2 pl-5 pr-2 shadow-sm"
        >
          <Search size={15} strokeWidth={1.75} className="flex-shrink-0 text-slate-400" />
          <input
            id="search-query"
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
            placeholder="Search invoices, contracts, approvals…"
            maxLength={500}
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Search"
            disabled={status === 'loading' || queryInput.trim().length < 2}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40"
          >
            <ArrowUp size={15} strokeWidth={2} />
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {(['all', 'passages', 'facts', 'entities'] as const).map((kind) => (
            <button
              key={kind}
              onClick={() => setKindTab(kind)}
              className={`rounded-full border px-3 py-1 ${kindTab === kind ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-600'}`}
            >
              {kind === 'all' ? 'All' : `${KIND_LABELS[kind]}${searchResults ? ` ${counts[kind]}` : ''}`}
            </button>
          ))}
          <span className="w-2" />
          <FilterMenu
            label="Process"
            options={PROCESSES.map((process) => ({ id: process.id, label: `${process.id} · ${process.label}` }))}
            selected={processes}
            onApply={(ids) => { setProcesses(ids); runSearch(queryInput, ids, fileIds) }}
          />
          <FilterMenu
            label="Files"
            options={fileOptions.map((file) => ({ id: file.id, label: file.name }))}
            selected={fileIds}
            onApply={(ids) => { setFileIds(ids); runSearch(queryInput, processes, ids) }}
          />
          {(processes.length > 0 || fileIds.length > 0) && (
            <button
              onClick={() => { setProcesses([]); setFileIds([]); runSearch(queryInput, [], []) }}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-900"
            >
              <X size={12} /> Clear filters
            </button>
          )}
          {status === 'done' && searchResults && (
            <span className="ml-auto text-slate-400">
              {total} results · {(searchResults.took_ms / 1000).toFixed(2)} s
            </span>
          )}
        </div>

        {status === 'idle' && (
          <div className="space-y-3 pt-4">
            <p className="text-xs text-slate-400">Try</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_QUESTIONS.map((question) => (
                <button key={question} onClick={() => searchFor(question)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 hover:border-slate-300">
                  {question}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400">{fileOptions.length} files in this workspace</p>
          </div>
        )}

        {status === 'loading' && <LoadingCards />}

        {status === 'error' && (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            Search failed: {errorMessage}
            <button onClick={() => runSearch(queryInput)} className="rounded-full border border-red-200 bg-white px-3 py-1 text-xs text-red-700">
              Try again
            </button>
          </div>
        )}

        {status === 'done' && searchResults?.status === 'not_found' && (
          <div className="flex flex-col items-center gap-2 py-14 text-center">
            <span className="h-12 w-12 rounded-full border border-dashed border-slate-300" />
            <p className="text-sm font-semibold text-slate-900">No evidence found</p>
            <p className="max-w-md text-sm text-slate-500">
              Nothing in this workspace matches “{searchResults.query}”. Searched passages, facts and entities.
            </p>
          </div>
        )}

        {status === 'done' && searchResults?.status === 'found' && (
          <>
            {searchResults.degraded.length > 0 && (
              <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-800">
                <AlertTriangle size={14} />
                {searchResults.degraded.includes('qdrant')
                  ? 'Showing a basic text match over passages only. The search index is unavailable right now.'
                  : 'Keyword search only. Meaning search is unavailable right now, so results may miss rephrased matches.'}
              </div>
            )}
            <div className={kindTab === 'all' ? 'grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]' : ''}>
              {showGroup('passages') && (
                <section className="min-w-0 space-y-2">
                  <h2 className="flex justify-between text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                    Passages <span className="normal-case tracking-normal text-slate-500">ranked by RRF score</span>
                  </h2>
                  {searchResults.passages.length === 0 && <p className="text-xs text-slate-400">No matching passages.</p>}
                  {searchResults.passages.map((passage) => (
                    <PassageCard key={passage.chunk_id} passage={passage} terms={terms} workspaceId={workspaceId} />
                  ))}
                </section>
              )}
              <div className="min-w-0 space-y-6">
                {showGroup('facts') && (
                  <section className="space-y-2">
                    <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">Facts</h2>
                    {searchResults.facts.length === 0 && <p className="text-xs text-slate-400">No matching facts.</p>}
                    {searchResults.facts.map((fact) => (
                      <FactCard key={fact.fact_id} fact={fact} workspaceId={workspaceId} />
                    ))}
                  </section>
                )}
                {showGroup('entities') && (
                  <section className="space-y-2">
                    <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">Entities</h2>
                    {searchResults.entities.length === 0 && <p className="text-xs text-slate-400">No matching entities.</p>}
                    {searchResults.entities.map((entity) => (
                      <EntityCard key={entity.entity_id} entity={entity} onSelect={() => searchFor(entity.name)} />
                    ))}
                  </section>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// useSearchParams needs a Suspense boundary in the app router
export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchView />
    </Suspense>
  )
}
