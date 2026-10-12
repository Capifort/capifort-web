'use client'

import { useEffect, useRef, useState } from 'react'
import { Building2, Check, ChevronDown, X } from 'lucide-react'
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
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const selectedDomain = domains.find((d) => d.id === selectedDomainId)

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

  useEffect(() => {
    if (!dropdownOpen) return
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [dropdownOpen])

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
                  <Building2 size={16} strokeWidth={1.9} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-900">
                    {selectedDomain ? selectedDomain.name : 'Select a domain'}
                  </span>
                  {selectedDomain && (
                    <span className="block truncate font-mono text-xs text-slate-500">{selectedDomain.id}</span>
                  )}
                </span>
                <ChevronDown size={16} className={`flex-shrink-0 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <ul
                  role="listbox"
                  className="absolute left-0 right-0 z-20 mt-2 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg"
                >
                  {domains.map((domain) => {
                    const isSelected = domain.id === selectedDomainId
                    const isCurrent = domain.id === currentDomainId
                    return (
                      <li key={domain.id} role="option" aria-selected={isSelected}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDomainId(domain.id)
                            setDropdownOpen(false)
                          }}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left ${
                            isSelected ? 'bg-violet-50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-slate-900">{domain.name}</span>
                            <span className="block truncate font-mono text-xs text-slate-500">{domain.id}</span>
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
              disabled={switching || !selectedDomainId || selectedDomainId === currentDomainId}
              className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
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
