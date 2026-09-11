'use client'

import { useEffect, useState } from 'react'
import { Building2, X } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { listAdminDomains, type Domain } from '@/lib/domain-api'
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

export function DomainTab() {
  const { user, switchDomain } = useAuth()
  const currentDomainId = user?.domain_id || user?.domain?.id || null

  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [switching, setSwitching] = useState(false)
  const [selectedDomainId, setSelectedDomainId] = useState('')

  useEffect(() => {
    let active = true
    listAdminDomains()
      .then((data) => {
        if (active) setDomains(data || [])
      })
      .catch((err: any) => {
        if (active) setLoadError(err.message || 'Failed to load domains.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (currentDomainId) setSelectedDomainId(currentDomainId)
  }, [currentDomainId])

  const handleSwitch = async () => {
    if (!selectedDomainId || selectedDomainId === currentDomainId) return
    setError('')
    setSuccess('')
    setSwitching(true)
    try {
      await switchDomain(selectedDomainId)
      const domainName = domains.find((d) => d.id === selectedDomainId)?.name
      setSuccess(`Switched to ${domainName || 'the selected domain'}.`)
    } catch (err: any) {
      setError(err.message || 'Failed to switch domain.')
    } finally {
      setSwitching(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && <Banner tone="error" onClose={() => setError('')}>{error}</Banner>}
      {success && <Banner tone="success" onClose={() => setSuccess('')}>{success}</Banner>}

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <Building2 size={16} strokeWidth={1.9} className="text-violet-600" />
          Switch domain
        </h2>
        <p className="mt-1 text-sm text-slate-500">Move your session to a different organization.</p>

        {loading ? (
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
            <Spinner size={15} />
            Loading domains…
          </div>
        ) : loadError ? (
          <p className="mt-4 text-sm text-slate-400">{loadError}</p>
        ) : domains.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400">No domains found.</p>
        ) : (
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <div className="min-w-[220px]">
              <label className="mb-1.5 block text-xs font-medium text-slate-500">Domain</label>
              <select
                value={selectedDomainId}
                onChange={(e) => setSelectedDomainId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none"
              >
                {domains.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSwitch}
              disabled={switching || !selectedDomainId || selectedDomainId === currentDomainId}
              className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {switching && <Spinner size={14} />}
              {switching ? 'Switching…' : 'Switch domain'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
