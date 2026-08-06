'use client'

import { useEffect, useState } from 'react'
import {
  Search, Bell, HelpCircle, ChevronDown, Plus, Layers, FileText, Database,
  BrainCircuit, Bot, MoreVertical, Check, Grid3x3, Share2, Sparkles,
  Upload as UploadIcon, MessageSquare, ArrowUpRight, X, LogOut,
} from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { listWorkspaces, createWorkspace, type Workspace } from '@/lib/workspace-api'

const pipelineSteps = [
  { key: 'upload', label: 'Upload', icon: Check, count: '12,442', note: 'Completed' },
  { key: 'ocr', label: 'OCR', icon: FileText, count: '1,205', note: 'In Progress' },
  { key: 'chunking', label: 'Chunking', icon: Grid3x3, count: '842', note: 'In Progress' },
  { key: 'embed', label: 'Embedding', icon: Layers, count: '524', note: 'In Progress' },
  { key: 'graph', label: 'Knowledge Graph', icon: Share2, count: '92%', note: 'Ready' },
]

const uploads = [
  { name: 'Q4_Financial_Report.pdf', meta: 'PDF · 24 MB', status: 'Completed', time: '2h ago' },
  { name: 'Vendor_Contracts.zip', meta: 'ZIP · 1.2 GB', status: 'Processing', time: '3h ago' },
  { name: 'Invoices_Jan_2025.xlsx', meta: 'XLSX · 18 MB', status: 'Completed', time: '5h ago' },
  { name: 'Payroll_March_2025.pdf', meta: 'PDF · 3.2 MB', status: 'Processing', time: '6h ago' },
]

const activity = [
  { icon: UploadIcon, text: 'You uploaded 245 files to Finance Workspace', time: '2h ago' },
  { icon: Check, text: 'OCR completed for 128 files', time: '3h ago' },
  { icon: Share2, text: 'Knowledge graph updated', time: '4h ago' },
  { icon: Bot, text: 'Financial Analyst Agent generated a report', time: '6h ago' },
]

const suggestedQuestions = [
  'What were our total expenses in Q4?',
  'Which vendors have the highest spend?',
  'Show me all contracts expiring this year.',
  'What are the outstanding invoices?',
]

const weeklyActivity = [40, 55, 48, 62, 58, 70, 66]

function StatusDot({ status }: { status: string }) {
  const ready = status === 'Ready' || status === 'Completed'
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${ready ? 'text-violet-600' : 'text-slate-400'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${ready ? 'bg-violet-600' : 'bg-slate-400 animate-pulse'}`} />
      {status}
    </span>
  )
}

function StatCard({ icon: Icon, value, label, sublabel }: { icon: React.ElementType; value: string; label: string; sublabel: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-violet-50 text-violet-600">
          <Icon size={15} strokeWidth={1.75} />
        </div>
        <span className="text-xs font-medium text-slate-500">{label}</span>
      </div>
      <p className="text-xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{sublabel}</p>
    </div>
  )
}

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  )
}

function ViewAllLink({ children = 'View all' }: { children?: string }) {
  return (
    <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-violet-600">
      {children}
      <ArrowUpRight size={11} strokeWidth={1.75} />
    </button>
  )
}

function CreateWorkspaceModal({ onClose, onCreated }: { onClose: () => void; onCreated: (w: Workspace) => void }) {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const workspace = await createWorkspace(name)
      onCreated(workspace)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to create workspace.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Create Workspace</h2>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Workspace name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              placeholder="e.g. Finance Workspace"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {submitting ? 'Creating…' : 'Create Workspace'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [createOpen, setCreateOpen] = useState(false)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading')
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const loadWorkspaces = () => {
    setStatus('loading')
    listWorkspaces()
      .then((data) => {
        setWorkspaces(data)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }

  useEffect(() => {
    loadWorkspaces()
  }, [])

  const greetingHour = new Date().getHours()
  const greeting = greetingHour < 12 ? 'Good morning' : greetingHour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-dvh">
      {/* Topbar */}
      <div className="flex h-16 items-center justify-between border-b border-slate-100 bg-white px-8">
        <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
        <div className="relative hidden max-w-md flex-1 sm:block">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-12 text-sm placeholder:text-slate-400 focus:border-violet-400 focus:outline-none"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">⌘K</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <button aria-label="Notifications" className="hover:text-slate-600"><Bell size={18} strokeWidth={1.75} /></button>
          <button aria-label="Help" className="hover:text-slate-600"><HelpCircle size={18} strokeWidth={1.75} /></button>
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen((open) => !open)}
              className="flex items-center gap-1.5 text-sm text-slate-700"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                {(user?.username || 'U').slice(0, 1).toUpperCase()}
              </div>
              {user?.username}
              <ChevronDown size={14} />
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
                  >
                    <LogOut size={14} strokeWidth={1.75} />
                    Log out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {/* Greeting */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{greeting}, {user?.username || 'there'} 👋</h2>
            <p className="mt-1 text-sm text-slate-500">Here&apos;s what&apos;s happening across your workspaces.</p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex flex-shrink-0 items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus size={15} strokeWidth={2} />
            Create Workspace
          </button>
        </div>

        {createOpen && (
          <CreateWorkspaceModal
            onClose={() => setCreateOpen(false)}
            onCreated={(w) => setWorkspaces((prev) => [w, ...prev])}
          />
        )}

        {/* Stat cards */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard icon={Layers} value={String(workspaces.length)} label="Workspaces" sublabel="Live count" />
          <StatCard icon={FileText} value="128,442" label="Files" sublabel="+3,284 this week" />
          <StatCard icon={Database} value="2.34 TB" label="Storage Used" sublabel="23% of 10 TB" />
          <StatCard icon={BrainCircuit} value="92%" label="Knowledge Base" sublabel="Overall readiness" />
          <StatCard icon={Bot} value="14" label="Agents" sublabel="6 active" />
        </div>

        {/* Row 1 */}
        <div className="mb-4 grid gap-4 lg:grid-cols-3">
          <Panel title="Recent Workspaces" action={<ViewAllLink />}>
            {status === 'loading' && <p className="text-sm text-slate-400">Loading workspaces…</p>}
            {status === 'error' && <p className="text-sm text-red-600">Couldn&apos;t load workspaces.</p>}
            {status === 'success' && workspaces.length === 0 && (
              <p className="text-sm text-slate-400">No workspaces yet. Create your first one.</p>
            )}
            {status === 'success' && workspaces.length > 0 && (
              <div className="divide-y divide-slate-100">
                {workspaces.map((w) => (
                  <div key={w.id} className="group flex items-center gap-3 py-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-xs text-slate-500">
                      {w.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-slate-700">{w.name}</p>
                      <p className="text-xs text-slate-400">Updated {new Date(w.updated_at || w.created_at).toLocaleDateString()}</p>
                    </div>
                    <button aria-label="More" className="flex-shrink-0 text-slate-300 opacity-0 group-hover:opacity-100 hover:text-slate-500">
                      <MoreVertical size={14} strokeWidth={1.75} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setCreateOpen(true)}
              className="mt-3 flex w-full items-center justify-center gap-1.5 border-t border-slate-100 pt-3 text-xs text-slate-400 hover:text-violet-600"
            >
              <Plus size={12} strokeWidth={1.75} />
              Create New Workspace
            </button>
          </Panel>

          <Panel title="Knowledge Pipeline" action={<ViewAllLink>View pipeline</ViewAllLink>}>
            <div className="mb-6 flex items-start justify-between">
              {pipelineSteps.map((s) => (
                <div key={s.key} className="flex flex-1 flex-col items-center gap-2">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full border ${s.note === 'Ready' || s.note === 'Completed' ? 'border-violet-600 text-violet-600' : 'border-slate-200 text-slate-400'}`}>
                    <s.icon size={14} strokeWidth={1.75} />
                  </div>
                  <span className="text-center text-[11px] text-slate-500">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="mb-6 grid grid-cols-5 gap-1 text-center">
              {pipelineSteps.map((s) => (
                <div key={s.key}>
                  <p className="text-sm font-semibold text-slate-900">{s.count}</p>
                  <p className="text-[11px] text-slate-400">{s.note}</p>
                </div>
              ))}
            </div>
            <div className="mt-auto flex items-center gap-2.5 rounded-lg border border-violet-100 bg-violet-50 p-3.5">
              <Sparkles size={14} strokeWidth={1.75} className="mt-0.5 flex-shrink-0 text-violet-600" />
              <div>
                <p className="text-sm text-slate-700">Your knowledge base is 92% ready</p>
                <p className="text-xs text-slate-400">Keep uploading files to improve coverage.</p>
              </div>
            </div>
          </Panel>

          <Panel title="Recent Uploads" action={<ViewAllLink />}>
            <div className="divide-y divide-slate-100">
              {uploads.map((u) => (
                <div key={u.name} className="flex items-center gap-3 py-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-400">
                    <FileText size={14} strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-slate-700">{u.name}</p>
                    <p className="text-xs text-slate-400">{u.meta}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <StatusDot status={u.status} />
                    <p className="mt-0.5 text-xs text-slate-400">{u.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Row 2 */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Panel title="Recent Activity" action={<ViewAllLink />}>
            <div className="space-y-4">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400">
                    <a.icon size={13} strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-700">{a.text}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="AI Suggested Questions" action={<ViewAllLink>Ask all</ViewAllLink>}>
            <div className="space-y-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  className="group flex w-full items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-left hover:border-violet-200"
                >
                  <MessageSquare size={13} strokeWidth={1.75} className="flex-shrink-0 text-slate-300" />
                  <span className="min-w-0 flex-1 truncate text-sm text-slate-700">{q}</span>
                  <ArrowUpRight size={12} strokeWidth={1.75} className="flex-shrink-0 text-slate-300 opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Workspace Activity" action={<span className="text-xs text-slate-400">Last 7 Days</span>}>
            <div className="flex h-full items-end gap-2">
              {weeklyActivity.map((value, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-sm bg-violet-500" style={{ height: `${value}px` }} />
                  <span className="text-[10px] text-slate-400">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
