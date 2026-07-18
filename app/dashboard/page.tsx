'use client'

import { useState } from 'react'
import {
  Layers, FileText, Database, BrainCircuit, Bot, Plus,
  Check, Grid3x3, Share2, Upload as UploadIcon, MoreVertical,
  MessageSquare, Sparkles, ArrowUpRight, ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { SpatialPanel } from '@/layouts/spatial-panel'
import { FadeIn, Stagger, StaggerItem } from '@/motion'
import { Container } from '@/layouts/container'
import { Topbar } from '@/components/dashboard/topbar'
import { SearchModal } from '@/components/dashboard/search-modal'
import { CreateWorkspaceModal } from '@/components/dashboard/create-workspace-modal'
import { ActivityChart } from '@/components/dashboard/activity-chart'
import { cn } from '@/lib/cn'

// ── Mock data ──────────────────────────────────────────
// This page reflects the North workspace/knowledge product surface.
// Wire these up to real endpoints once the workspace API ships.

const workspaces = [
  { id: 'fin', initial: 'F', name: 'Finance Workspace',      files: '12,442 files', updated: 'Updated 2h ago',  status: 'Ready' },
  { id: 'acc', initial: 'A', name: 'Accounting Workspace',    files: '8,332 files',  updated: 'Updated 5h ago',  status: 'Processing' },
  { id: 'leg', initial: 'L', name: 'Legal Workspace',         files: '4,221 files',  updated: 'Updated 1d ago',  status: 'Ready' },
  { id: 'hr',  initial: 'H', name: 'HR Workspace',            files: '2,105 files',  updated: 'Updated 2d ago',  status: 'Ready' },
  { id: 'eng', initial: 'E', name: 'Engineering Workspace',   files: '34,223 files', updated: 'Updated 2d ago',  status: 'Processing' },
]

const pipelineSteps = [
  { key: 'upload',   label: 'Upload',         icon: Check,       count: '12,442', note: 'Completed',   done: true },
  { key: 'ocr',      label: 'OCR',            icon: FileText,    count: '1,205',  note: 'In Progress', done: false },
  { key: 'chunking', label: 'Chunking',       icon: Grid3x3,     count: '842',    note: 'In Progress', done: false },
  { key: 'embed',    label: 'Embedding',      icon: Layers,      count: '524',    note: 'In Progress', done: false },
  { key: 'graph',    label: 'Knowledge Graph',icon: Share2,      count: '92%',    note: 'Ready',       done: false },
]

const uploads = [
  { name: 'Q4_Financial_Report.pdf', meta: 'PDF · 24 MB',  status: 'Completed',  time: '2h ago' },
  { name: 'Vendor_Contracts.zip',    meta: 'ZIP · 1.2 GB', status: 'Processing', time: '3h ago' },
  { name: 'Invoices_Jan_2025.xlsx',  meta: 'XLSX · 18 MB', status: 'Completed',  time: '5h ago' },
  { name: 'Payroll_March_2025.pdf',  meta: 'PDF · 3.2 MB', status: 'Processing', time: '6h ago' },
  { name: 'Board_Meeting_Notes.docx',meta: 'DOCX · 2 MB',  status: 'Completed',  time: '8h ago' },
]

const activity = [
  { icon: UploadIcon,    text: 'Salman uploaded 245 files to Finance Workspace', time: '2h ago' },
  { icon: Check,         text: 'OCR completed for 128 files',                   time: '3h ago' },
  { icon: Share2,        text: 'Knowledge graph updated',                       time: '4h ago' },
  { icon: MessageSquare, text: 'Sarah asked "What were our expenses in Q4?"',   time: '5h ago' },
  { icon: Bot,           text: 'Financial Analyst Agent generated report',      time: '6h ago' },
]

const suggestedQuestions = [
  'What were our total expenses in Q4?',
  'Which vendors have the highest spend?',
  'Show me all contracts expiring this year.',
  'Compare revenue between 2023 and 2024.',
  'What are the outstanding invoices?',
]

// ── Small building blocks ──────────────────────────────

function StatusDot({ status }: { status: string }) {
  const ready = status === 'Ready' || status === 'Completed'
  return (
    <span className={cn('inline-flex items-center gap-1.5 dash-caption', ready ? 'text-[var(--accent)]' : 'text-[var(--muted)]')}>
      <span className={cn('w-1.5 h-1.5 rounded-full', ready ? 'bg-[var(--accent)]' : 'bg-[var(--muted)] animate-pulse')} />
      {status}
    </span>
  )
}

function StatCard({ icon: Icon, value, label, sublabel }: { icon: React.ElementType; value: string; label: string; sublabel: string }) {
  return (
    <SpatialPanel className="p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--accent-dim)] flex items-center justify-center flex-shrink-0 text-[var(--accent)]">
          <Icon size={15} strokeWidth={1.5} />
        </div>
        <span className="dash-metric-label text-[var(--muted)]">{label}</span>
      </div>
      <p className="dash-metric text-[var(--text)] mb-1.5">{value}</p>
      <p className="dash-caption text-[var(--muted)]">{sublabel}</p>
    </SpatialPanel>
  )
}

function PanelHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="dash-card-title text-[var(--text)]">{title}</h2>
      {action}
    </div>
  )
}

function ViewAllLink({ children = 'View all' }: { children?: React.ReactNode }) {
  return (
    <button className="dash-caption dash-button text-[var(--muted)] hover:text-[var(--accent)] transition-colors duration-fast flex items-center gap-1">
      {children}
      <ChevronRight size={11} strokeWidth={1.5} />
    </button>
  )
}

// ── Page ───────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)
  const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false)

  const greetingTime = new Date().getHours()
  const greeting = greetingTime < 12 ? 'Good morning' : greetingTime < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-dvh">
      <Topbar title="Dashboard" onSearch={() => setSearchOpen(true)} />
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      {createWorkspaceOpen && (
        <CreateWorkspaceModal onClose={() => setCreateWorkspaceOpen(false)} />
      )}

      <Container size="full" className="py-8">

        {/* Greeting + primary action */}
        <FadeIn y={4} className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="dash-section text-[var(--text)] mb-1">
              {greeting}, {user?.username || 'there'} 👋
            </h2>
            <p className="dash-body text-[var(--muted)]">Here&apos;s what&apos;s happening across your workspaces.</p>
          </div>
          <button
            onClick={() => setCreateWorkspaceOpen(true)}
            className={cn(
              'flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-md',
              'bg-[var(--text)] text-[var(--inverse)]',
              'dash-body dash-button hover:opacity-90 transition-opacity duration-fast',
            )}
          >
            <Plus size={15} strokeWidth={2} />
            Create Workspace
          </button>
        </FadeIn>

        {/* Stat cards */}
        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6" staggerDelay={0.04}>
          <StaggerItem>
            <StatCard icon={Layers} value="6" label="Workspaces" sublabel="2 active this week" />
          </StaggerItem>
          <StaggerItem>
            <StatCard icon={FileText} value="128,442" label="Files" sublabel="+3,284 this week" />
          </StaggerItem>
          <StaggerItem>
            <StatCard icon={Database} value="2.34 TB" label="Storage Used" sublabel="23% of 10 TB" />
          </StaggerItem>
          <StaggerItem>
            <StatCard icon={BrainCircuit} value="92%" label="Knowledge Base" sublabel="Overall readiness" />
          </StaggerItem>
          <StaggerItem>
            <StatCard icon={Bot} value="14" label="Agents" sublabel="6 active" />
          </StaggerItem>
        </Stagger>

        {/* Row 1: Recent Workspaces / Knowledge Pipeline / Recent Uploads */}
        <div className="grid lg:grid-cols-3 gap-4 mb-4">

          {/* Recent Workspaces */}
          <FadeIn y={8} delay={0.1}>
            <SpatialPanel className="h-full">
              <PanelHeader title="Recent Workspaces" action={<ViewAllLink />} />
              <div className="divide-y divide-[var(--border-subtle)]">
                {workspaces.map((w) => (
                  <div key={w.id} className="flex items-center gap-3 py-3 group">
                    <div className="w-8 h-8 rounded-md bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center dash-caption text-[var(--muted)] flex-shrink-0">
                      {w.initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="dash-table text-[var(--text-2)] truncate">{w.name}</p>
                      <p className="dash-caption text-[var(--muted)]">{w.files} · {w.updated}</p>
                    </div>
                    <StatusDot status={w.status} />
                    <button className="text-[var(--subtle)] opacity-0 group-hover:opacity-100 transition-opacity duration-fast flex-shrink-0" aria-label="More">
                      <MoreVertical size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setCreateWorkspaceOpen(true)}
                className="w-full mt-3 pt-3 border-t border-[var(--border-subtle)] dash-caption dash-button text-[var(--muted)] hover:text-[var(--accent)] transition-colors duration-fast flex items-center justify-center gap-1.5"
              >
                <Plus size={12} strokeWidth={1.5} />
                Create New Workspace
              </button>
            </SpatialPanel>
          </FadeIn>

          {/* Knowledge Pipeline */}
          <FadeIn y={8} delay={0.16}>
            <SpatialPanel className="h-full flex flex-col">
              <PanelHeader title="Knowledge Pipeline" action={<ViewAllLink>View pipeline</ViewAllLink>} />
              <div className="flex items-start justify-between mb-6 relative">
                <div className="absolute left-0 right-0 top-[18px] h-px bg-[var(--border)]" style={{ marginInline: '10%' }} aria-hidden />
                {pipelineSteps.map((s) => (
                  <div key={s.key} className="relative flex flex-col items-center gap-2 flex-1">
                    <div
                      className={cn(
                        'w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0 bg-[var(--surface)]',
                        s.done ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-[var(--border)] text-[var(--muted)]',
                      )}
                    >
                      <s.icon size={14} strokeWidth={1.5} />
                    </div>
                    <span className="dash-small-label text-[var(--muted)] text-center">{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-5 gap-1 mb-6 text-center">
                {pipelineSteps.map((s) => (
                  <div key={s.key}>
                    <p className="dash-metric-label text-[var(--text)]">{s.count}</p>
                    <p className="dash-small-label text-[var(--muted)]">{s.note}</p>
                  </div>
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between gap-3 p-3.5 rounded-md border border-[var(--border)] bg-[var(--accent-dim)]">
                <div className="flex items-start gap-2.5 min-w-0">
                  <Sparkles size={14} strokeWidth={1.5} className="text-[var(--accent)] flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="dash-body text-[var(--text-2)]">Your knowledge base is 92% ready</p>
                    <p className="dash-caption text-[var(--muted)]">Keep uploading files to improve coverage.</p>
                  </div>
                </div>
                <button className="dash-caption dash-button text-[var(--accent)] hover:text-[var(--accent-warm)] transition-colors duration-fast flex-shrink-0">
                  View Details
                </button>
              </div>
            </SpatialPanel>
          </FadeIn>

          {/* Recent Uploads */}
          <FadeIn y={8} delay={0.22}>
            <SpatialPanel className="h-full">
              <PanelHeader title="Recent Uploads" action={<ViewAllLink />} />
              <div className="divide-y divide-[var(--border-subtle)]">
                {uploads.map((u) => (
                  <div key={u.name} className="flex items-center gap-3 py-3">
                    <div className="w-8 h-8 rounded-md bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] flex-shrink-0">
                      <FileText size={14} strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="dash-table text-[var(--text-2)] truncate">{u.name}</p>
                      <p className="dash-caption text-[var(--muted)]">{u.meta}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <StatusDot status={u.status} />
                      <p className="dash-caption text-[var(--muted)] mt-0.5">{u.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SpatialPanel>
          </FadeIn>
        </div>

        {/* Row 2: Recent Activity / AI Suggested Questions / Workspace Activity */}
        <div className="grid lg:grid-cols-3 gap-4">

          {/* Recent Activity */}
          <FadeIn y={8} delay={0.1}>
            <SpatialPanel className="h-full">
              <PanelHeader title="Recent Activity" action={<ViewAllLink />} />
              <div className="space-y-4">
                {activity.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] flex-shrink-0">
                      <a.icon size={13} strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="dash-body text-[var(--text-2)]">{a.text}</p>
                      <p className="dash-caption text-[var(--muted)] mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SpatialPanel>
          </FadeIn>

          {/* AI Suggested Questions */}
          <FadeIn y={8} delay={0.16}>
            <SpatialPanel className="h-full">
              <PanelHeader title="AI Suggested Questions" action={<ViewAllLink>Ask all</ViewAllLink>} />
              <div className="space-y-2">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-md text-left',
                      'border border-[var(--border)] bg-[var(--surface-2)]',
                      'hover:border-[var(--border-hover)] transition-colors duration-fast group',
                    )}
                  >
                    <MessageSquare size={13} strokeWidth={1.5} className="text-[var(--subtle)] flex-shrink-0" />
                    <span className="dash-body text-[var(--text-2)] flex-1 min-w-0 truncate">{q}</span>
                    <ArrowUpRight size={12} strokeWidth={1.5} className="text-[var(--subtle)] opacity-0 group-hover:opacity-100 transition-opacity duration-fast flex-shrink-0" />
                  </button>
                ))}
              </div>
            </SpatialPanel>
          </FadeIn>

          {/* Workspace Activity */}
          <FadeIn y={8} delay={0.22}>
            <SpatialPanel className="h-full">
              <PanelHeader
                title="Workspace Activity"
                action={<span className="dash-caption text-[var(--muted)]">Last 7 Days</span>}
              />
              <ActivityChart />
            </SpatialPanel>
          </FadeIn>
        </div>

      </Container>
    </div>
  )
}
