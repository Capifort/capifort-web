'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { UserPlus, X, Trash2 } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { apiFetch } from '@/lib/api'

interface Member {
  id: string
  user_id: string
  username: string
  email: string
  role: string
  created_at: string
}

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

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

export default function SettingsPage() {
  const { user } = useAuth()
  const domainId = user?.domain_id || user?.domain?.id || null

  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [tempCredentials, setTempCredentials] = useState<{ email: string; username?: string; temporary_password: string } | null>(null)
  const [form, setForm] = useState({ email: '', username: '', role: 'member' })

  const myMembership = useMemo(() => members.find((m) => m.user_id === user?.id) || null, [members, user?.id])
  const canManage = myMembership ? myMembership.role === 'owner' || myMembership.role === 'admin' : true

  const loadMembers = useCallback(async () => {
    if (!domainId) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const data = await apiFetch(`/api/domains/${domainId}/members`)
      setMembers(data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load members.')
    } finally {
      setLoading(false)
    }
  }, [domainId])

  useEffect(() => {
    loadMembers()
  }, [loadMembers])

  const clearBanners = () => {
    setError('')
    setSuccess('')
    setTempCredentials(null)
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    clearBanners()
    if (!form.email.trim()) {
      setError('Email is required.')
      return
    }
    setSubmitting(true)
    try {
      const body: Record<string, string> = { email: form.email.trim(), role: form.role }
      if (form.username.trim()) body.username = form.username.trim()
      const res = await apiFetch(`/api/domains/${domainId}/invitations`, {
        method: 'POST',
        body: JSON.stringify(body),
      })
      if (res?.created) {
        setTempCredentials({ email: form.email.trim(), username: res.member?.username, temporary_password: res.temporary_password })
        setSuccess('User created and added. Share the credentials securely.')
      } else {
        setSuccess('Existing user added to your organization.')
      }
      setForm({ email: '', username: '', role: 'member' })
      await loadMembers()
    } catch (err: any) {
      setError(err.message || 'Failed to add user.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRoleChange = async (member: Member, role: string) => {
    clearBanners()
    try {
      await apiFetch(`/api/domains/${domainId}/members/${member.user_id}`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      })
      setSuccess(`${member.username}'s permission updated to ${role}.`)
      await loadMembers()
    } catch (err: any) {
      setError(err.message || 'Failed to update permission.')
    }
  }

  const handleRemove = async (member: Member) => {
    if (!window.confirm(`Remove ${member.username} from this organization?`)) return
    clearBanners()
    try {
      await apiFetch(`/api/domains/${domainId}/members/${member.user_id}`, { method: 'DELETE' })
      setSuccess(`${member.username} removed.`)
      await loadMembers()
    } catch (err: any) {
      setError(err.message || 'Failed to remove user.')
    }
  }

  return (
    <div className="min-h-dvh">
      <div className="border-b border-slate-100 bg-white px-8 py-6">
        <h1 className="text-lg font-semibold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your organization's members and permissions.</p>
      </div>

      <div className="space-y-4 px-8 py-8">
        {error && <Banner tone="error" onClose={() => setError('')}>{error}</Banner>}
        {success && <Banner tone="success" onClose={() => setSuccess('')}>{success}</Banner>}

        {tempCredentials && (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-slate-900">Share these credentials</h2>
            <p className="mt-1 text-sm text-slate-500">We don't email invites yet — copy and share securely.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {[['Email', tempCredentials.email], ['Username', tempCredentials.username || '—'], ['Temporary password', tempCredentials.temporary_password]].map(([label, value]) => (
                <div key={label}>
                  <p className="mb-1 text-xs font-medium text-slate-400">{label}</p>
                  <code className="break-all text-sm text-slate-700">{value}</code>
                </div>
              ))}
            </div>
          </div>
        )}

        {!domainId ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-slate-900">No organization</h2>
            <p className="mt-1 text-sm text-slate-500">You're not part of an organization yet.</p>
          </div>
        ) : (
          <>
            {canManage && (
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <UserPlus size={16} strokeWidth={1.9} className="text-violet-600" />
                  Add user
                </h2>
                <p className="mt-1 text-sm text-slate-500">Add by email — creates a new account if none matches.</p>
                <form onSubmit={handleAddUser} className="mt-4 grid gap-4 sm:grid-cols-4">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      placeholder="alice@company.com"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">Username</label>
                    <input
                      type="text"
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      placeholder="alice"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">Permission</label>
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                      <option value="owner">Owner</option>
                    </select>
                  </div>
                  <div className="sm:col-span-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                    >
                      {submitting ? 'Adding…' : 'Add user'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">Members</h2>
                <span className="text-xs text-slate-400">{members.length} total</span>
              </div>

              {loading ? (
                <p className="text-sm text-slate-400">Loading…</p>
              ) : members.length === 0 ? (
                <p className="text-sm text-slate-400">No members yet.</p>
              ) : (
                <div className="-mx-2 overflow-x-auto">
                  <table className="w-full text-left" style={{ minWidth: 560 }}>
                    <thead>
                      <tr className="border-b border-slate-100 text-xs text-slate-400">
                        <th className="px-2 py-2 font-medium">User</th>
                        <th className="px-2 py-2 font-medium">Email</th>
                        <th className="px-2 py-2 font-medium">Permission</th>
                        <th className="px-2 py-2 font-medium">Joined</th>
                        <th className="px-2 py-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m) => {
                        const isMe = m.user_id === user?.id
                        return (
                          <tr key={m.id} className="border-b border-slate-50 text-sm">
                            <td className="px-2 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-violet-50 text-xs font-semibold text-violet-700">
                                  {m.username?.[0]?.toUpperCase() || '?'}
                                </div>
                                <span className="text-slate-700">{m.username}</span>
                                {isMe && <span className="text-xs text-slate-400">you</span>}
                              </div>
                            </td>
                            <td className="px-2 py-3 text-slate-500">{m.email}</td>
                            <td className="px-2 py-3">
                              {canManage && !isMe ? (
                                <select
                                  value={m.role}
                                  onChange={(e) => handleRoleChange(m, e.target.value)}
                                  className="rounded-lg border border-slate-200 px-2 py-1 text-sm text-slate-700 focus:border-violet-400 focus:outline-none"
                                >
                                  <option value="member">Member</option>
                                  <option value="admin">Admin</option>
                                  <option value="owner">Owner</option>
                                </select>
                              ) : (
                                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                                  {m.role}
                                </span>
                              )}
                            </td>
                            <td className="px-2 py-3 text-xs text-slate-400">{formatDate(m.created_at)}</td>
                            <td className="px-2 py-3 text-right">
                              {canManage && !isMe && (
                                <button
                                  onClick={() => handleRemove(m)}
                                  aria-label={`Remove ${m.username}`}
                                  className="text-slate-400 hover:text-red-600"
                                >
                                  <Trash2 size={15} strokeWidth={1.9} />
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
            </div>
          </>
        )}
      </div>
    </div>
  )
}
