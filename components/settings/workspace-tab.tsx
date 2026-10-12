'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Layers, Plus, X } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { listWorkspaces, createWorkspace, type Workspace } from '@/lib/workspace-api'
import { Spinner } from '@/components/spinner'

function Banner({ tone, children, onClose }: { tone: 'error' | 'success'; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-sm ${
      tone === 'error' ? 'border-red-100 bg-red-50 text-red-600' : 'border-violet-100 bg-violet-50 text-violet-700'
    }`}>
      <p>{children}</p>
      <button onClick={onClose} aria-label="Dismiss" className="flex-shrink-0 opacity-60 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  )
}

export function WorkspaceTab() {
  const { user, switchWorkspace } = useAuth()
  const currentWorkspaceId = user?.current_workspace_id || null

  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [switching, setSwitching] = useState(false)
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const selectedWorkspace = workspaces.find((w) => w.id === selectedWorkspaceId)

  const [newWorkspaceName, setNewWorkspaceName] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  const loadWorkspaces = () => {
    setLoading(true)
    setLoadError('')
    listWorkspaces()
      .then((data) => setWorkspaces(data || []))
      .catch((err: any) => setLoadError(err.message || 'Failed to load workspaces.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadWorkspaces()
  }, [])

  useEffect(() => {
    if (currentWorkspaceId) setSelectedWorkspaceId(currentWorkspaceId)
  }, [currentWorkspaceId])

  useEffect(() => {
    if (!dropdownOpen) return
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [dropdownOpen])

  const handleSwitch = async () => {
    if (!selectedWorkspaceId || selectedWorkspaceId === currentWorkspaceId) return
    setError('')
    setSuccess('')
    setSwitching(true)
    try {
      await switchWorkspace(selectedWorkspaceId)
      const workspaceName = workspaces.find((w) => w.id === selectedWorkspaceId)?.name
      setSuccess(`Switched to ${workspaceName || 'the selected workspace'}.`)
    } catch (err: any) {
      setError(err.message || 'Failed to switch workspace.')
    } finally {
      setSwitching(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError('')
    setCreating(true)
    try {
      const workspace = await createWorkspace(newWorkspaceName)
      setWorkspaces((prev) => [workspace, ...prev])
      setNewWorkspaceName('')
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create workspace.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && <Banner tone="error" onClose={() => setError('')}>{error}</Banner>}
      {success && <Banner tone="success" onClose={() => setSuccess('')}>{success}</Banner>}

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <Plus size={16} strokeWidth={1.9} className="text-violet-600" />
          Create workspace
        </h2>
        <p className="mt-1 text-sm text-slate-500">Add a new workspace to your current domain.</p>

        <form onSubmit={handleCreate} className="mt-4 flex flex-wrap items-end gap-3">
          {createError && <p className="w-full text-sm text-red-600">{createError}</p>}
          <div className="min-w-[220px] flex-1">
            <label className="mb-1.5 block text-xs font-medium text-slate-500">Workspace name</label>
            <input
              type="text"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              required
              placeholder="e.g. Zomato"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {creating && <Spinner size={14} />}
            {creating ? 'Creating…' : 'Create workspace'}
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <Layers size={16} strokeWidth={1.9} className="text-violet-600" />
          Switch workspace
        </h2>
        <p className="mt-1 text-sm text-slate-500">Move your session to a different workspace.</p>

        {loading ? (
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
            <Spinner size={15} />
            Loading workspaces…
          </div>
        ) : loadError ? (
          <p className="mt-4 text-sm text-slate-400">{loadError}</p>
        ) : workspaces.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400">No workspaces yet.</p>
        ) : (
          <div className="mt-5 flex flex-wrap items-start gap-3">
            <div ref={dropdownRef} className="relative w-full max-w-xl flex-1">
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen}
                onClick={() => setDropdownOpen((open) => !open)}
                className={`flex w-full items-center gap-3 rounded-xl border bg-white px-4 py-3 text-left transition-colors ${
                  dropdownOpen ? 'border-violet-400' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                  <Layers size={16} strokeWidth={1.9} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-900">
                    {selectedWorkspace ? selectedWorkspace.name : 'Select a workspace'}
                  </span>
                  {selectedWorkspace && (
                    <span className="block truncate font-mono text-xs text-slate-500">{selectedWorkspace.id}</span>
                  )}
                </span>
                <ChevronDown size={16} className={`flex-shrink-0 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <ul
                  role="listbox"
                  className="absolute left-0 right-0 z-20 mt-2 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg"
                >
                  {workspaces.map((workspace) => {
                    const isSelected = workspace.id === selectedWorkspaceId
                    const isCurrent = workspace.id === currentWorkspaceId
                    return (
                      <li key={workspace.id} role="option" aria-selected={isSelected}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedWorkspaceId(workspace.id)
                            setDropdownOpen(false)
                          }}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left ${
                            isSelected ? 'bg-violet-50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-slate-900">{workspace.name}</span>
                            <span className="block truncate font-mono text-xs text-slate-500">{workspace.id}</span>
                          </span>
                          {isCurrent && (
                            <span className="flex-shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                              Current
                            </span>
                          )}
                          {isSelected && <Check size={16} className="flex-shrink-0 text-violet-600" />}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
            <button
              onClick={handleSwitch}
              disabled={switching || !selectedWorkspaceId || selectedWorkspaceId === currentWorkspaceId}
              className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {switching && <Spinner size={14} />}
              {switching ? 'Switching…' : 'Switch workspace'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
