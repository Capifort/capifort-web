'use client'

import { useEffect, useState } from 'react'
import { Layers, Plus, X } from 'lucide-react'
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
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <div className="min-w-[220px]">
              <label className="mb-1.5 block text-xs font-medium text-slate-500">Workspace</label>
              <select
                value={selectedWorkspaceId}
                onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none"
              >
                {workspaces.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSwitch}
              disabled={switching || !selectedWorkspaceId || selectedWorkspaceId === currentWorkspaceId}
              className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
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
