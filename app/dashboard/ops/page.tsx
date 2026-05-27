'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/auth-context'
import { SystemLabel, Title, Body, MonoMeta } from '@/components/typography'
import { SpatialPanel } from '@/layouts/spatial-panel'
import { FadeIn } from '@/motion'
import { Container } from '@/layouts/container'
import { cn } from '@/lib/cn'
import {
  listFeatures, createFeature, deleteFeature,
  listPlans, createPlan, updatePlan, setPlanFeatures, deletePlan,
  listUsers, getUser, assignUserPlan, upsertFeatureOverride, deleteFeatureOverride,
} from '@/lib/admin-api'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Feature  { key: string; name: string; description?: string }
interface Plan     { id: string; key: string; name: string; description?: string; price_cents: number; billing_interval: string; is_active: boolean; is_default: boolean; sort_order: number; features: Feature[] }
interface Override { id: string; feature_key: string; allow: boolean; reason?: string }
interface OpsUser  { id: string; username: string; email: string; role: string; plan?: Plan; feature_keys?: string[]; overrides?: Override[] }

// ── Shared primitives ─────────────────────────────────────────────────────────

const inputCls =
  'w-full bg-[var(--surface)] border border-[var(--border)] rounded-md px-3.5 py-2.5 ' +
  'type-body-sm text-[var(--text)] placeholder:text-[var(--subtle)] ' +
  'focus:outline-none focus:border-[var(--border-focus)] transition-colors duration-fast'

function Badge({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'accent' | 'muted' }) {
  return (
    <span className={cn(
      'inline-flex items-center type-label border rounded-full px-2.5 py-0.5',
      tone === 'accent' ? 'text-[var(--accent)] border-[var(--border)] bg-[var(--accent-dim)]'
      : tone === 'muted' ? 'text-[var(--muted)] border-[var(--border)] bg-[var(--surface-2)]'
      : 'text-[var(--subtle)] border-[var(--border)] bg-transparent',
    )}>
      {children}
    </span>
  )
}

function Banner({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-md border border-[var(--border)] bg-[var(--surface-2)]">
      <p className="type-body-sm text-[var(--muted)]">{children}</p>
      <button onClick={onClose} className="type-label text-[var(--subtle)] hover:text-[var(--muted)] transition-colors duration-fast flex-shrink-0">×</button>
    </div>
  )
}

function Btn({
  children, onClick, variant = 'primary', size = 'md',
  disabled = false, type = 'button',
}: {
  children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'ghost' | 'danger'
  size?: 'md' | 'sm'; disabled?: boolean; type?: 'button' | 'submit'
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'transition-colors duration-fast disabled:opacity-40 disabled:cursor-not-allowed rounded',
        size === 'sm' ? 'type-label px-2.5 py-1' : 'type-body-sm px-4 py-2',
        variant === 'primary' && 'text-[var(--text-2)] border border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-hover)] hover:text-[var(--accent)]',
        variant === 'ghost'   && 'text-[var(--subtle)] hover:text-[var(--muted)]',
        variant === 'danger'  && 'text-[var(--subtle)] border border-[var(--border)] hover:text-red-400 hover:border-red-400/40',
      )}
    >
      {children}
    </button>
  )
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg surface-glass rounded-xl p-6 shadow-[var(--shadow-xl)] overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <Title as="h3">{title}</Title>
          <button onClick={onClose} className="type-label text-[var(--subtle)] hover:text-[var(--muted)] transition-colors duration-fast">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="type-label text-[var(--subtle)] block mb-1.5">{label}</label>
      {children}
    </div>
  )
}

// ── Features Tab ──────────────────────────────────────────────────────────────

function FeaturesTab({ features, onRefresh }: { features: Feature[]; onRefresh: () => void }) {
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ key: '', name: '', description: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<{ key: string; message: string } | null>(null)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('')
    try {
      await createFeature(form)
      setShowCreate(false); setForm({ key: '', name: '', description: '' }); onRefresh()
    } catch (err: any) { setError(err.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (f: Feature) => {
    if (!window.confirm(`Delete feature "${f.key}"? This cannot be undone.`)) return
    setDeleting(f.key); setDeleteError(null)
    try { await deleteFeature(f.key); onRefresh() }
    catch (err: any) { setDeleteError({ key: f.key, message: err.message }) }
    finally { setDeleting(null) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <Title as="h3">Features</Title>
          <MonoMeta className="text-[var(--subtle)] mt-0.5">{features.length} registered</MonoMeta>
        </div>
        <Btn onClick={() => setShowCreate(true)}>+ New Feature</Btn>
      </div>

      {deleteError && (
        <div className="mb-4">
          <Banner onClose={() => setDeleteError(null)}>
            Could not delete "{deleteError.key}": {deleteError.message}
          </Banner>
        </div>
      )}

      <div className="overflow-x-auto -mx-6">
        <table className="w-full text-left" style={{ minWidth: 560 }}>
          <thead>
            <tr className="border-b border-[var(--border)]">
              {['Key', 'Name', 'Description', ''].map((h) => (
                <th key={h} className="type-label text-[var(--subtle)] px-6 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-10 text-center type-body-sm text-[var(--subtle)]">No features yet.</td></tr>
            )}
            {features.map((f) => (
              <tr key={f.key} className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface-2)] transition-colors duration-fast">
                <td className="px-6 py-3"><code className="type-mono text-[var(--muted)]">{f.key}</code></td>
                <td className="px-6 py-3 type-body-sm text-[var(--text-2)]">{f.name}</td>
                <td className="px-6 py-3 type-body-sm text-[var(--subtle)]">{f.description || '—'}</td>
                <td className="px-6 py-3">
                  <Btn variant="danger" size="sm" disabled={deleting === f.key} onClick={() => handleDelete(f)}>
                    {deleting === f.key ? '…' : 'Delete'}
                  </Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <Modal title="Create Feature" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate}>
            {error && <div className="mb-4"><Banner onClose={() => setError('')}>{error}</Banner></div>}
            <FieldGroup label="Key (snake_case)">
              <input className={inputCls} value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} placeholder="e.g. ai_reports" required />
            </FieldGroup>
            <FieldGroup label="Name">
              <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. AI Reports" required />
            </FieldGroup>
            <FieldGroup label="Description">
              <input className={inputCls} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description" />
            </FieldGroup>
            <div className="flex items-center justify-end gap-3 mt-5">
              <Btn variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Btn>
              <Btn type="submit" disabled={saving}>{saving ? 'Creating…' : 'Create Feature'}</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

// ── Plans Tab ─────────────────────────────────────────────────────────────────

const blankPlanForm = { key: '', name: '', description: '', price_cents: 0, billing_interval: 'monthly', is_active: true, is_default: false, sort_order: 0, feature_keys: [] as string[] }

function PlansTab({ plans, features, onRefresh }: { plans: Plan[]; features: Feature[]; onRefresh: () => void }) {
  const [showCreate, setShowCreate] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [form, setForm] = useState(blankPlanForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const resetForm = () => setForm(blankPlanForm)

  const openEdit = (plan: Plan) => {
    setEditingPlan(plan)
    setForm({ key: plan.key, name: plan.name, description: plan.description || '', price_cents: plan.price_cents, billing_interval: plan.billing_interval, is_active: plan.is_active, is_default: plan.is_default, sort_order: plan.sort_order, feature_keys: plan.features.map((f) => f.key) })
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('')
    try { await createPlan(form); setShowCreate(false); resetForm(); onRefresh() }
    catch (err: any) { setError(err.message) }
    finally { setSaving(false) }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('')
    try {
      const { key: _key, feature_keys, ...patchable } = form
      await updatePlan(editingPlan!.id, patchable)
      await setPlanFeatures(editingPlan!.id, feature_keys)
      setEditingPlan(null); resetForm(); onRefresh()
    } catch (err: any) { setError(err.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (plan: Plan) => {
    if (!window.confirm(`Delete plan "${plan.name}"? This cannot be undone.`)) return
    setDeleting(plan.id)
    try { await deletePlan(plan.id); onRefresh() }
    catch (err: any) { alert(err.message) }
    finally { setDeleting(null) }
  }

  const toggleFeature = (key: string) => {
    setForm((prev) => ({
      ...prev,
      feature_keys: prev.feature_keys.includes(key) ? prev.feature_keys.filter((k) => k !== key) : [...prev.feature_keys, key],
    }))
  }

  const PlanForm = ({ onSubmit, isEdit = false }: { onSubmit: (e: React.FormEvent) => void; isEdit?: boolean }) => (
    <form onSubmit={onSubmit}>
      {error && <div className="mb-4"><Banner onClose={() => setError('')}>{error}</Banner></div>}
      <div className="grid sm:grid-cols-2 gap-x-4">
        <FieldGroup label="Key">
          <input className={inputCls} value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} placeholder="e.g. pro" required disabled={isEdit} />
        </FieldGroup>
        <FieldGroup label="Name">
          <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Pro Plan" required />
        </FieldGroup>
        <FieldGroup label="Price (cents)">
          <input className={inputCls} type="number" value={form.price_cents} onChange={(e) => setForm({ ...form, price_cents: Number(e.target.value) })} min={0} />
        </FieldGroup>
        <FieldGroup label="Billing Interval">
          <select className={`${inputCls} cursor-pointer`} value={form.billing_interval} onChange={(e) => setForm({ ...form, billing_interval: e.target.value })}>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="one_time">One Time</option>
          </select>
        </FieldGroup>
        <FieldGroup label="Sort Order">
          <input className={inputCls} type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
        </FieldGroup>
      </div>
      <FieldGroup label="Description">
        <input className={inputCls} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description" />
      </FieldGroup>
      <div className="flex items-center gap-6 mb-4">
        {[['Active', 'is_active'], ['Default', 'is_default']].map(([label, key]) => (
          <label key={key} className="flex items-center gap-2 type-body-sm text-[var(--muted)] cursor-pointer">
            <input type="checkbox" checked={form[key as 'is_active' | 'is_default']} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} className="accent-[var(--accent)]" />
            {label}
          </label>
        ))}
      </div>
      <FieldGroup label="Features">
        <div className="flex flex-wrap gap-2 mt-1">
          {features.length === 0 && <span className="type-label text-[var(--subtle)]">No features available.</span>}
          {features.map((f) => (
            <label key={f.key} className={cn('flex items-center gap-1.5 type-label border rounded-full px-2.5 py-0.5 cursor-pointer transition-colors duration-fast', form.feature_keys.includes(f.key) ? 'text-[var(--accent)] border-[var(--border)] bg-[var(--accent-dim)]' : 'text-[var(--subtle)] border-[var(--border)] hover:border-[var(--border-hover)]')}>
              <input type="checkbox" className="sr-only" checked={form.feature_keys.includes(f.key)} onChange={() => toggleFeature(f.key)} />
              {f.name}
            </label>
          ))}
        </div>
      </FieldGroup>
      <div className="flex items-center justify-end gap-3 mt-5">
        <Btn variant="ghost" onClick={() => { setShowCreate(false); setEditingPlan(null); resetForm() }}>Cancel</Btn>
        <Btn type="submit" disabled={saving}>{saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Plan'}</Btn>
      </div>
    </form>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <Title as="h3">Plans</Title>
          <MonoMeta className="text-[var(--subtle)] mt-0.5">{plans.length} configured</MonoMeta>
        </div>
        <Btn onClick={() => { resetForm(); setShowCreate(true) }}>+ New Plan</Btn>
      </div>

      {plans.length === 0 && <Body className="text-[var(--subtle)]">No plans yet.</Body>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {plans.map((plan) => (
          <div key={plan.id} className="border border-[var(--border)] rounded-lg p-4 bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors duration-fast">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="type-body-sm text-[var(--text-2)] font-medium">{plan.name}</p>
                <code className="type-mono text-[var(--subtle)]">{plan.key}</code>
              </div>
              <div className="flex gap-1.5">
                {plan.is_default && <Badge tone="accent">Default</Badge>}
                <Badge tone={plan.is_active ? 'muted' : 'default'}>{plan.is_active ? 'Active' : 'Inactive'}</Badge>
              </div>
            </div>
            <p className="type-label text-[var(--muted)] mb-3">
              {plan.price_cents === 0 ? 'Free' : `$${(plan.price_cents / 100).toFixed(2)} / ${plan.billing_interval}`}
            </p>
            {plan.description && <p className="type-label text-[var(--subtle)] mb-3">{plan.description}</p>}
            <div className="flex flex-wrap gap-1 mb-4 min-h-[24px]">
              {plan.features.length === 0
                ? <span className="type-label text-[var(--subtle)]">No features</span>
                : plan.features.map((f) => <Badge key={f.key}>{f.key}</Badge>)}
            </div>
            <div className="flex items-center gap-2">
              <Btn variant="ghost" size="sm" onClick={() => openEdit(plan)}>Edit</Btn>
              <Btn variant="danger" size="sm" disabled={deleting === plan.id} onClick={() => handleDelete(plan)}>
                {deleting === plan.id ? '…' : 'Delete'}
              </Btn>
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <Modal title="Create Plan" onClose={() => { setShowCreate(false); resetForm() }}>
          <PlanForm onSubmit={handleCreate} />
        </Modal>
      )}
      {editingPlan && (
        <Modal title={`Edit Plan: ${editingPlan.name}`} onClose={() => { setEditingPlan(null); resetForm() }}>
          <PlanForm onSubmit={handleUpdate} isEdit />
        </Modal>
      )}
    </div>
  )
}

// ── Users Tab ─────────────────────────────────────────────────────────────────

function UsersTab({ users, plans, features, onRefresh }: { users: OpsUser[]; plans: Plan[]; features: Feature[]; onRefresh: () => void }) {
  const [selectedUser, setSelectedUser] = useState<OpsUser | null>(null)
  const [assignPlanKey, setAssignPlanKey] = useState('')
  const [overrideKey, setOverrideKey] = useState('')
  const [overrideAllow, setOverrideAllow] = useState(true)
  const [overrideReason, setOverrideReason] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const refreshSelected = async (userId: string) => {
    const updated = await getUser(userId)
    setSelectedUser(updated)
  }

  const openUser = (u: OpsUser) => {
    setSelectedUser(u); setAssignPlanKey(u.plan?.key || ''); setOverrideKey(''); setOverrideAllow(true); setOverrideReason(''); setError('')
  }

  const handleAssignPlan = async () => {
    if (!assignPlanKey || !selectedUser) return
    setSaving(true); setError('')
    try { await assignUserPlan(selectedUser.id, assignPlanKey); onRefresh(); await refreshSelected(selectedUser.id) }
    catch (err: any) { setError(err.message) }
    finally { setSaving(false) }
  }

  const handleAddOverride = async () => {
    if (!overrideKey || !selectedUser) return
    setSaving(true); setError('')
    try {
      await upsertFeatureOverride(selectedUser.id, overrideKey, overrideAllow, overrideReason || null)
      await refreshSelected(selectedUser.id); setOverrideKey(''); setOverrideReason(''); onRefresh()
    } catch (err: any) { setError(err.message) }
    finally { setSaving(false) }
  }

  const handleRemoveOverride = async (featureKey: string) => {
    if (!selectedUser) return
    setSaving(true); setError('')
    try { await deleteFeatureOverride(selectedUser.id, featureKey); await refreshSelected(selectedUser.id); onRefresh() }
    catch (err: any) { setError(err.message) }
    finally { setSaving(false) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <Title as="h3">Users</Title>
          <MonoMeta className="text-[var(--subtle)] mt-0.5">{users.length} total</MonoMeta>
        </div>
      </div>

      <div className="overflow-x-auto -mx-6">
        <table className="w-full text-left" style={{ minWidth: 600 }}>
          <thead>
            <tr className="border-b border-[var(--border)]">
              {['User', 'Role', 'Plan', 'Features', ''].map((h) => (
                <th key={h} className="type-label text-[var(--subtle)] px-6 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-10 text-center type-body-sm text-[var(--subtle)]">No users found.</td></tr>
            )}
            {users.map((u) => (
              <tr key={u.id} className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface-2)] transition-colors duration-fast">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[var(--accent-dim)] border border-[var(--border)] flex items-center justify-center type-label text-[var(--accent)] flex-shrink-0">
                      {u.username?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="type-body-sm text-[var(--text-2)]">{u.username}</p>
                      <p className="type-label text-[var(--subtle)]">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3"><Badge tone={u.role === 'admin' ? 'accent' : 'default'}>{u.role}</Badge></td>
                <td className="px-6 py-3">{u.plan ? <Badge tone="muted">{u.plan.name}</Badge> : <span className="type-label text-[var(--subtle)]">None</span>}</td>
                <td className="px-6 py-3 type-label text-[var(--subtle)]">{u.feature_keys?.length || 0} features</td>
                <td className="px-6 py-3">
                  <Btn variant="ghost" size="sm" onClick={() => openUser(u)}>Manage</Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <Modal title={`Manage: ${selectedUser.username}`} onClose={() => setSelectedUser(null)}>
          {error && <div className="mb-4"><Banner onClose={() => setError('')}>{error}</Banner></div>}

          {/* Plan */}
          <div className="mb-6">
            <p className="type-label text-[var(--subtle)] mb-2">Current Plan</p>
            <div className="flex items-center gap-3">
              <select className={`${inputCls} flex-1`} value={assignPlanKey} onChange={(e) => setAssignPlanKey(e.target.value)}>
                <option value="">— No Plan —</option>
                {plans.map((p) => <option key={p.key} value={p.key}>{p.name}</option>)}
              </select>
              <Btn onClick={handleAssignPlan} disabled={saving || !assignPlanKey}>{saving ? '…' : 'Assign'}</Btn>
            </div>
          </div>

          {/* Active features */}
          <div className="mb-6">
            <p className="type-label text-[var(--subtle)] mb-2">Active Features</p>
            <div className="flex flex-wrap gap-1.5">
              {(selectedUser.feature_keys || []).length === 0
                ? <span className="type-label text-[var(--subtle)]">None</span>
                : (selectedUser.feature_keys || []).map((k) => <Badge key={k}>{k}</Badge>)}
            </div>
          </div>

          {/* Overrides */}
          <div className="mb-6">
            <p className="type-label text-[var(--subtle)] mb-2">Feature Overrides</p>
            {(selectedUser.overrides || []).length === 0
              ? <p className="type-label text-[var(--subtle)]">No overrides.</p>
              : (
                <div className="space-y-2 mb-4">
                  {selectedUser.overrides!.map((ov) => (
                    <div key={ov.id} className="flex items-center gap-3 px-3 py-2 rounded border border-[var(--border)] bg-[var(--surface-2)]">
                      <code className="type-mono text-[var(--muted)] flex-1">{ov.feature_key}</code>
                      <Badge tone={ov.allow ? 'accent' : 'muted'}>{ov.allow ? 'Grant' : 'Revoke'}</Badge>
                      {ov.reason && <span className="type-label text-[var(--subtle)]">{ov.reason}</span>}
                      <Btn variant="danger" size="sm" disabled={saving} onClick={() => handleRemoveOverride(ov.feature_key)}>Remove</Btn>
                    </div>
                  ))}
                </div>
              )}

            <p className="type-label text-[var(--subtle)] mb-2">Add Override</p>
            <div className="flex items-center gap-3 mb-2">
              <select className={`${inputCls} flex-1`} value={overrideKey} onChange={(e) => setOverrideKey(e.target.value)}>
                <option value="">Select feature…</option>
                {features.map((f) => <option key={f.key} value={f.key}>{f.name} ({f.key})</option>)}
              </select>
              <select className={`${inputCls} w-32`} value={overrideAllow ? 'grant' : 'revoke'} onChange={(e) => setOverrideAllow(e.target.value === 'grant')}>
                <option value="grant">Grant</option>
                <option value="revoke">Revoke</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input className={`${inputCls} flex-1`} value={overrideReason} onChange={(e) => setOverrideReason(e.target.value)} placeholder="Reason (optional)" />
              <Btn onClick={handleAddOverride} disabled={saving || !overrideKey}>{saving ? '…' : 'Add'}</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

const TABS = ['Features', 'Plans', 'Users'] as const
type Tab = typeof TABS[number]

export default function OpsDashboardPage() {
  const { isAdmin } = useAuth()

  const [activeTab, setActiveTab] = useState<Tab>('Features')
  const [features, setFeatures] = useState<Feature[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [users, setUsers] = useState<OpsUser[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const loadAll = useCallback(async () => {
    setLoading(true); setLoadError('')
    try {
      const [f, p, u] = await Promise.all([listFeatures(), listPlans(), listUsers()])
      setFeatures(f); setPlans(p); setUsers(u)
    } catch (err: any) { setLoadError(err.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  if (!isAdmin) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-center">
          <Body className="text-[var(--subtle)]">Access restricted to administrators.</Body>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh">
      <div className="border-b border-[var(--border)] px-8 py-6">
        <FadeIn y={4}>
          <SystemLabel as="p" className="mb-1.5">Admin</SystemLabel>
          <h1 className="type-headline text-[var(--text)]">Ops Dashboard</h1>
        </FadeIn>
      </div>

      <Container className="py-10">
        <FadeIn y={8}>

          {/* Tab bar */}
          <div className="flex items-center gap-1 mb-6 border-b border-[var(--border)]">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'type-body-sm px-4 py-2.5 border-b-2 transition-colors duration-fast -mb-px',
                  activeTab === tab
                    ? 'border-[var(--accent)] text-[var(--accent)]'
                    : 'border-transparent text-[var(--subtle)] hover:text-[var(--muted)]',
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <SpatialPanel>
            {loading && <Body className="text-[var(--subtle)]">Loading…</Body>}
            {loadError && <Banner onClose={() => setLoadError('')}>{loadError}</Banner>}
            {!loading && !loadError && (
              <>
                {activeTab === 'Features' && <FeaturesTab features={features} onRefresh={loadAll} />}
                {activeTab === 'Plans'    && <PlansTab plans={plans} features={features} onRefresh={loadAll} />}
                {activeTab === 'Users'   && <UsersTab users={users} plans={plans} features={features} onRefresh={loadAll} />}
              </>
            )}
          </SpatialPanel>

        </FadeIn>
      </Container>
    </div>
  )
}
