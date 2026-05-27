'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/auth-context'
import { FeatureGate } from '@/components/feature-gate'
import { SystemLabel, Title, Body, MonoMeta } from '@/components/typography'
import { SpatialPanel } from '@/layouts/spatial-panel'
import { FadeIn } from '@/motion'
import { Container } from '@/layouts/container'
import { cn } from '@/lib/cn'

const inputCls =
  'w-full bg-[var(--surface)] border border-[var(--border)] rounded-md px-3.5 py-2.5 ' +
  'type-body-sm text-[var(--text)] placeholder:text-[var(--subtle)] ' +
  'focus:outline-none focus:border-[var(--border-focus)] transition-colors duration-fast'

// ── Types ─────────────────────────────────────────────────────────────────────

interface AwsRegion   { code: string; name: string }
interface AwsAccount  {
  id: string; accountAlias: string; awsAccountId: string; roleArnMasked: string
  region: string; status: 'active' | 'invalid' | 'disconnected'; lastValidatedAt?: string
  sessionDuration: number
}

const STATUS_MAP = {
  active:       { label: 'Active',        cls: 'text-[var(--accent)] border-[var(--border)] bg-[var(--accent-dim)]' },
  invalid:      { label: 'Invalid',       cls: 'text-[var(--muted)] border-[var(--border)] bg-[var(--surface-2)]' },
  disconnected: { label: 'Disconnected',  cls: 'text-[var(--subtle)] border-[var(--border)] bg-transparent' },
}

function StatusBadge({ status }: { status: AwsAccount['status'] }) {
  const s = STATUS_MAP[status] || STATUS_MAP.disconnected
  return (
    <span className={cn('inline-flex type-label border rounded-full px-2.5 py-0.5', s.cls)}>
      {s.label}
    </span>
  )
}

function formatDateTime(d?: string) {
  if (!d) return 'Never'
  return new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// ── API hook ──────────────────────────────────────────────────────────────────

function useAwsApi() {
  const { token } = useAuth()
  return useCallback(async (path: string, options: RequestInit = {}) => {
    const res = await fetch(`/api/aws${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...((options.headers as Record<string, string>) || {}) },
      credentials: 'include',
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || data.message || 'Request failed')
    return data
  }, [token])
}

// ── Main content ──────────────────────────────────────────────────────────────

function AwsAccountsContent() {
  const api = useAwsApi()

  const [accounts, setAccounts]     = useState<AwsAccount[]>([])
  const [regions, setRegions]       = useState<AwsRegion[]>([])
  const [loading, setLoading]       = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState('')
  const [editingId, setEditingId]   = useState<string | null>(null)
  const [editForm, setEditForm]     = useState<{ accountAlias: string; region: string; sessionDuration: number }>({ accountAlias: '', region: 'us-east-1', sessionDuration: 900 })

  const [form, setForm] = useState({ roleArn: '', accountAlias: '', region: 'us-east-1', externalId: '', sessionDuration: 900 })

  const loadData = useCallback(async () => {
    try {
      const [accRes, regRes] = await Promise.all([api('/accounts'), api('/accounts/regions')])
      setAccounts(accRes.accounts || [])
      setRegions(regRes.regions || [])
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }, [api])

  useEffect(() => { loadData() }, [loadData])

  const clear = () => { setError(''); setSuccess('') }

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault(); clear(); setSubmitting(true)
    try {
      await api('/accounts/connect', { method: 'POST', body: JSON.stringify(form) })
      setSuccess('AWS account connected.')
      setForm({ roleArn: '', accountAlias: '', region: 'us-east-1', externalId: '', sessionDuration: 900 })
      await loadData()
    } catch (e: any) { setError(e.message) }
    finally { setSubmitting(false) }
  }

  const handleValidate  = async (id: string) => { clear(); try { await api(`/accounts/${id}/validate`, { method: 'POST' }); setSuccess('Validated.'); await loadData() } catch (e: any) { setError(e.message) } }
  const handleDisconnect = async (id: string) => { clear(); try { await api(`/accounts/${id}`, { method: 'DELETE' }); setSuccess('Disconnected.'); await loadData() } catch (e: any) { setError(e.message) } }
  const openEdit = (a: AwsAccount) => { setEditingId(a.id); setEditForm({ accountAlias: a.accountAlias, region: a.region, sessionDuration: a.sessionDuration }) }
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault(); clear()
    try { await api(`/accounts/${editingId}`, { method: 'PUT', body: JSON.stringify(editForm) }); setSuccess('Updated.'); setEditingId(null); await loadData() }
    catch (e: any) { setError(e.message) }
  }

  return (
    <div className="space-y-4">

      {error   && (
        <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-md border border-[var(--border)] bg-[var(--surface-2)]">
          <p className="type-body-sm text-[var(--muted)]">{error}</p>
          <button onClick={() => setError('')} className="type-label text-[var(--subtle)] flex-shrink-0">×</button>
        </div>
      )}
      {success && (
        <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-md border border-[var(--border)] bg-[var(--surface-2)]">
          <p className="type-body-sm text-[var(--muted)]">{success}</p>
          <button onClick={() => setSuccess('')} className="type-label text-[var(--subtle)] flex-shrink-0">×</button>
        </div>
      )}

      {/* Connect form */}
      <SpatialPanel>
        <Title as="h3" className="mb-5">Connect AWS Account</Title>
        <form onSubmit={handleConnect}>
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="type-label text-[var(--subtle)] block mb-1.5">Role ARN *</label>
              <input type="text" value={form.roleArn} onChange={(e) => setForm({ ...form, roleArn: e.target.value })} placeholder="arn:aws:iam::123456789012:role/RoleName" required className={inputCls} />
              <p className="type-label text-[var(--subtle)] mt-1 opacity-70">Cross-account IAM role for North to assume</p>
            </div>
            <div>
              <label className="type-label text-[var(--subtle)] block mb-1.5">Account Alias *</label>
              <input type="text" value={form.accountAlias} onChange={(e) => setForm({ ...form, accountAlias: e.target.value })} placeholder="Production" required className={inputCls} />
            </div>
            <div>
              <label className="type-label text-[var(--subtle)] block mb-1.5">AWS Region *</label>
              <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className={`${inputCls} cursor-pointer`}>
                {regions.length > 0 ? regions.map((r) => <option key={r.code} value={r.code}>{r.name} ({r.code})</option>) : <option value="us-east-1">US East (N. Virginia)</option>}
              </select>
            </div>
            <div>
              <label className="type-label text-[var(--subtle)] block mb-1.5">External ID <span className="opacity-60">(optional)</span></label>
              <input type="text" value={form.externalId} onChange={(e) => setForm({ ...form, externalId: e.target.value })} placeholder="Optional" className={inputCls} />
            </div>
            <div>
              <label className="type-label text-[var(--subtle)] block mb-1.5">Session Duration</label>
              <select value={form.sessionDuration} onChange={(e) => setForm({ ...form, sessionDuration: parseInt(e.target.value) })} className={`${inputCls} cursor-pointer`}>
                <option value={900}>15 minutes</option>
                <option value={1800}>30 minutes</option>
                <option value={3600}>1 hour</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={submitting} className="group flex items-center gap-2 type-body-sm text-[var(--text-2)] hover:text-[var(--accent)] transition-colors duration-fast disabled:opacity-50">
            <span>{submitting ? 'Connecting…' : 'Connect Account'}</span>
            {!submitting && <span className="group-hover:translate-x-1 transition-transform duration-fast" aria-hidden>→</span>}
          </button>
        </form>
      </SpatialPanel>

      {/* Accounts table */}
      <SpatialPanel>
        <div className="flex items-center justify-between mb-5">
          <Title as="h3">Connected Accounts</Title>
          <MonoMeta className="text-[var(--subtle)]">{accounts.length} total</MonoMeta>
        </div>
        {loading ? (
          <Body className="text-[var(--subtle)]">Loading…</Body>
        ) : accounts.length === 0 ? (
          <div className="text-center py-12">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--subtle)" strokeWidth="1" className="mx-auto mb-4">
              <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.99 5.99 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
            </svg>
            <Body className="text-[var(--subtle)]">Connect your first AWS account to begin.</Body>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left" style={{ minWidth: 700 }}>
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {['Alias', 'Account ID', 'Region', 'Status', 'Last Validated', ''].map((h) => (
                    <th key={h} className="type-label text-[var(--subtle)] px-6 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {accounts.map((acct) => (
                  <tr key={acct.id} className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface-2)] transition-colors duration-fast">
                    {editingId === acct.id ? (
                      <td colSpan={6} className="px-6 py-4">
                        <form onSubmit={handleUpdate} className="flex flex-wrap gap-3 items-end">
                          <div>
                            <label className="type-label text-[var(--subtle)] block mb-1">Alias</label>
                            <input value={editForm.accountAlias} onChange={(e) => setEditForm({ ...editForm, accountAlias: e.target.value })} className={`${inputCls} w-40`} />
                          </div>
                          <div>
                            <label className="type-label text-[var(--subtle)] block mb-1">Region</label>
                            <select value={editForm.region} onChange={(e) => setEditForm({ ...editForm, region: e.target.value })} className={`${inputCls} w-44 cursor-pointer`}>
                              {regions.map((r) => <option key={r.code} value={r.code}>{r.name}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="type-label text-[var(--subtle)] block mb-1">Session</label>
                            <select value={editForm.sessionDuration} onChange={(e) => setEditForm({ ...editForm, sessionDuration: parseInt(e.target.value) })} className={`${inputCls} cursor-pointer`}>
                              <option value={900}>15 min</option>
                              <option value={1800}>30 min</option>
                              <option value={3600}>1 hr</option>
                            </select>
                          </div>
                          <button type="submit" className="type-body-sm text-[var(--text-2)] hover:text-[var(--accent)] transition-colors duration-fast">Save</button>
                          <button type="button" onClick={() => setEditingId(null)} className="type-body-sm text-[var(--subtle)] hover:text-[var(--muted)] transition-colors duration-fast">Cancel</button>
                        </form>
                      </td>
                    ) : (
                      <>
                        <td className="px-6 py-3">
                          <p className="type-body-sm text-[var(--text-2)]">{acct.accountAlias}</p>
                          <p className="type-label text-[var(--subtle)]">{acct.roleArnMasked}</p>
                        </td>
                        <td className="px-6 py-3 font-mono type-body-sm text-[var(--muted)]">{acct.awsAccountId}</td>
                        <td className="px-6 py-3"><span className="type-label border border-[var(--border)] rounded-full px-2.5 py-0.5 text-[var(--muted)]">{acct.region}</span></td>
                        <td className="px-6 py-3"><StatusBadge status={acct.status} /></td>
                        <td className="px-6 py-3 type-label text-[var(--subtle)]">{formatDateTime(acct.lastValidatedAt)}</td>
                        <td className="px-6 py-3">
                          {acct.status !== 'disconnected' && (
                            <div className="flex items-center gap-4">
                              <button onClick={() => handleValidate(acct.id)} className="type-label text-[var(--subtle)] hover:text-[var(--muted)] transition-colors duration-fast" title="Re-validate">↺</button>
                              <button onClick={() => openEdit(acct)} className="type-label text-[var(--subtle)] hover:text-[var(--muted)] transition-colors duration-fast" title="Edit">Edit</button>
                              <button onClick={() => handleDisconnect(acct.id)} className="type-label text-[var(--subtle)] hover:text-[var(--muted)] transition-colors duration-fast" title="Disconnect">Remove</button>
                            </div>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SpatialPanel>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AwsAccountsPage() {
  return (
    <FeatureGate feature="aws_integration">
      <div className="min-h-dvh">
        <div className="border-b border-[var(--border)] px-8 py-6">
          <FadeIn y={4}>
            <SystemLabel as="p" className="mb-1.5">Integrations</SystemLabel>
            <h1 className="type-headline text-[var(--text)]">AWS Accounts</h1>
          </FadeIn>
        </div>
        <Container className="py-10">
          <FadeIn y={8}>
            <AwsAccountsContent />
          </FadeIn>
        </Container>
      </div>
    </FeatureGate>
  )
}
