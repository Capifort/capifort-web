'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/context/auth-context'
import { apiFetch } from '@/lib/api'
import { SystemLabel, Title, Body, MonoMeta } from '@/components/typography'
import { SpatialPanel } from '@/layouts/spatial-panel'
import { FadeIn } from '@/motion'
import { Container } from '@/layouts/container'
import { cn } from '@/lib/cn'

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function Badge({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'accent' }) {
  return (
    <span className={cn(
      'inline-flex items-center type-label border rounded-full px-2.5 py-0.5',
      tone === 'accent'
        ? 'text-[var(--accent)] border-[var(--border)] bg-[var(--accent-dim)]'
        : 'text-[var(--muted)] border-[var(--border)] bg-[var(--surface-2)]',
    )}>
      {children}
    </span>
  )
}

function Banner({ tone, children, onClose }: { tone: 'error' | 'success'; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-md border border-[var(--border)] bg-[var(--surface-2)]">
      <p className="type-body-sm text-[var(--muted)]">{children}</p>
      <button onClick={onClose} className="type-label text-[var(--subtle)] hover:text-[var(--muted)] transition-colors duration-fast flex-shrink-0" aria-label="Dismiss">×</button>
    </div>
  )
}

const inputCls =
  'w-full bg-[var(--surface)] border border-[var(--border)] rounded-md px-3.5 py-2.5 ' +
  'type-body-sm text-[var(--text)] placeholder:text-[var(--subtle)] ' +
  'focus:outline-none focus:border-[var(--border-focus)] transition-colors duration-fast'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Member {
  id: string; user_id: string; username: string; email: string; role: string; created_at: string
}

// ── Members Tab ───────────────────────────────────────────────────────────────

function MembersTab() {
  const { user, refreshAccess } = useAuth()
  const domainId = user?.domain_id || user?.domain?.id || null

  const [members, setMembers]           = useState<Member[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [success, setSuccess]           = useState('')
  const [submitting, setSubmitting]     = useState(false)
  const [tempPwd, setTempPwd]           = useState<{ email: string; username?: string; temporary_password: string } | null>(null)
  const [form, setForm]                 = useState({ email: '', username: '', role: 'member' })

  const myMembership = useMemo(() => members.find((m) => m.user_id === user?.id) || null, [members, user?.id])
  const canManage = myMembership && (myMembership.role === 'owner' || myMembership.role === 'admin')

  const loadMembers = useCallback(async () => {
    if (!domainId) { setLoading(false); return }
    try {
      const data = await apiFetch(`/api/domains/${domainId}/members`)
      setMembers(data || [])
    } catch (e: any) {
      setError(e.message || 'Failed to load members')
    } finally {
      setLoading(false)
    }
  }, [domainId])

  useEffect(() => { loadMembers() }, [loadMembers])

  const clear = () => { setError(''); setSuccess(''); setTempPwd(null) }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault(); clear()
    if (!form.email.trim()) { setError('Email is required'); return }
    setSubmitting(true)
    try {
      const body: Record<string, string> = { email: form.email.trim(), role: form.role }
      if (form.username.trim()) body.username = form.username.trim()
      const res = await apiFetch(`/api/domains/${domainId}/invitations`, { method: 'POST', body: JSON.stringify(body) })
      if (res?.created) {
        setTempPwd({ email: form.email.trim(), username: res.member?.username, temporary_password: res.temporary_password })
        setSuccess('User created and invited. Share the credentials securely.')
      } else {
        setSuccess('Existing user added to your domain.')
      }
      setForm({ email: '', username: '', role: 'member' })
      await loadMembers()
    } catch (e: any) {
      setError(e.message || 'Failed to invite user')
    } finally { setSubmitting(false) }
  }

  const handleRoleChange = async (member: Member, role: string) => {
    clear()
    try {
      await apiFetch(`/api/domains/${domainId}/members/${member.user_id}`, { method: 'PATCH', body: JSON.stringify({ role }) })
      setSuccess(`${member.username}'s role updated to ${role}.`)
      await loadMembers()
    } catch (e: any) { setError(e.message || 'Failed to update role') }
  }

  const handleRemove = async (member: Member) => {
    if (!window.confirm(`Remove ${member.username} from this domain?`)) return
    clear()
    try {
      await apiFetch(`/api/domains/${domainId}/members/${member.user_id}`, { method: 'DELETE' })
      setSuccess(`${member.username} removed.`)
      await loadMembers()
      if (member.user_id === user?.id) refreshAccess()
    } catch (e: any) { setError(e.message || 'Failed to remove member') }
  }

  if (!domainId) {
    return (
      <SpatialPanel>
        <Title as="h3" className="mb-3">No domain</Title>
        <Body>You're not part of a domain yet. Register to create one and invite teammates.</Body>
      </SpatialPanel>
    )
  }

  return (
    <div className="space-y-4">

      {error   && <Banner tone="error"   onClose={() => setError('')}>{error}</Banner>}
      {success && <Banner tone="success" onClose={() => setSuccess('')}>{success}</Banner>}

      {/* Temp credentials */}
      {tempPwd && (
        <SpatialPanel>
          <Title as="h3" className="mb-1">Share these credentials</Title>
          <Body className="mb-4">We don't email invites yet — copy and share securely.</Body>
          <div className="grid sm:grid-cols-3 gap-4">
            {[['Email', tempPwd.email], ['Username', tempPwd.username || '—'], ['Temp password', tempPwd.temporary_password]].map(([l, v]) => (
              <div key={l}>
                <p className="type-label text-[var(--subtle)] mb-1">{l}</p>
                <code className="type-mono text-[var(--text-2)] break-all">{v}</code>
              </div>
            ))}
          </div>
        </SpatialPanel>
      )}

      {/* Invite form */}
      {canManage && (
        <SpatialPanel>
          <Title as="h3" className="mb-1">Invite user</Title>
          <Body className="mb-5">Add by email — creates a new account if none matches.</Body>
          <form onSubmit={handleInvite}>
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="type-label text-[var(--subtle)] block mb-1.5">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="alice@acme.com" className={inputCls} />
              </div>
              <div>
                <label className="type-label text-[var(--subtle)] block mb-1.5">Username <span className="opacity-60">(optional)</span></label>
                <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="alice" className={inputCls} />
              </div>
              <div>
                <label className="type-label text-[var(--subtle)] block mb-1.5">Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={`${inputCls} cursor-pointer`}>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={submitting} className="group flex items-center gap-2 type-body-sm text-[var(--text-2)] hover:text-[var(--accent)] transition-colors duration-fast disabled:opacity-50">
              <span>{submitting ? 'Inviting…' : 'Invite user'}</span>
              {!submitting && <span className="group-hover:translate-x-1 transition-transform duration-fast" aria-hidden>→</span>}
            </button>
          </form>
        </SpatialPanel>
      )}

      {/* Members table */}
      <SpatialPanel>
        <div className="flex items-center justify-between mb-5">
          <Title as="h3">Members</Title>
          <MonoMeta className="text-[var(--subtle)]">{members.length} total</MonoMeta>
        </div>
        {loading ? (
          <Body className="text-[var(--subtle)]">Loading…</Body>
        ) : members.length === 0 ? (
          <Body className="text-[var(--subtle)]">No members yet.</Body>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left" style={{ minWidth: 500 }}>
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {['User', 'Email', 'Role', 'Joined', ''].map((h) => (
                    <th key={h} className="type-label text-[var(--subtle)] px-6 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map((m) => {
                  const isMe = m.user_id === user?.id
                  return (
                    <tr key={m.id} className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface-2)] transition-colors duration-fast">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-[var(--accent-dim)] border border-[var(--border)] flex items-center justify-center type-label text-[var(--accent)] flex-shrink-0">
                            {m.username?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="type-body-sm text-[var(--text-2)]">{m.username}</p>
                            {isMe && <span className="type-label text-[var(--subtle)]">you</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 type-body-sm text-[var(--muted)]">{m.email}</td>
                      <td className="px-6 py-3">
                        {canManage && !isMe ? (
                          <select value={m.role} onChange={(e) => handleRoleChange(m, e.target.value)} className="bg-[var(--surface)] border border-[var(--border)] rounded type-body-sm text-[var(--text-2)] px-2 py-1 focus:outline-none focus:border-[var(--border-focus)] transition-colors duration-fast cursor-pointer">
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                            <option value="owner">Owner</option>
                          </select>
                        ) : (
                          <Badge>{m.role}</Badge>
                        )}
                      </td>
                      <td className="px-6 py-3 type-label text-[var(--subtle)]">{formatDate(m.created_at)}</td>
                      <td className="px-6 py-3 text-right">
                        {canManage && !isMe && (
                          <button onClick={() => handleRemove(m)} className="type-label text-[var(--subtle)] hover:text-[var(--muted)] transition-colors duration-fast">
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </SpatialPanel>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  return (
    <div className="min-h-dvh">
      <div className="border-b border-[var(--border)] px-8 py-6">
        <FadeIn y={4}>
          <SystemLabel as="p" className="mb-1.5">Settings</SystemLabel>
          <h1 className="type-headline text-[var(--text)]">Domain & Members</h1>
        </FadeIn>
      </div>
      <Container className="py-10">
        <FadeIn y={8}>
          <MembersTab />
        </FadeIn>
      </Container>
    </div>
  )
}
