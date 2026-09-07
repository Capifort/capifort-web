'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, BarChart3, Database, Building2, ChevronsUpDown, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/context/auth-context'

const navItems = [
  { href: '/dashboard', label: 'Investigate', subtitle: 'Ask. Discover. Decide.' },
  { href: '/dashboard/files', label: 'Documents', icon: FileText },
  { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
  { href: '/dashboard/memory', label: 'Memory', icon: Database },
  { href: '/dashboard/workspaces', label: 'Workspace', icon: Building2 },
]

function CapifortMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="url(#capifort-mark-gradient)" strokeWidth="2.5" strokeDasharray="38 18" strokeLinecap="round" />
      <defs>
        <linearGradient id="capifort-mark-gradient" x1="3" y1="3" x2="21" y2="21">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function AccountMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const domainId = user?.domain_id || user?.domain?.id || null

  return (
    <div className="relative">
      {open && <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />}

      {open && (
        <div className="absolute bottom-full left-0 z-20 mb-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
          <div className="space-y-3 px-2.5 py-2">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Domain ID</p>
              <p className="mt-0.5 break-all text-sm text-slate-700">{domainId || '—'}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">User ID</p>
              <p className="mt-0.5 break-all text-sm text-slate-700">{user?.id || '—'}</p>
            </div>
          </div>

          <div className="my-1.5 border-t border-slate-100" />

          <Link
            href="/dashboard/settings"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            <Settings size={15} strokeWidth={1.75} className="text-slate-400" />
            Settings
          </Link>

          <div className="my-1.5 border-t border-slate-100" />

          <button
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            <LogOut size={15} strokeWidth={1.75} className="text-slate-400" />
            Log out
          </button>
        </div>
      )}

      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-2.5 text-left">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
          {(user?.username || 'U').slice(0, 1).toUpperCase()}
        </div>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-slate-900">{user?.username || 'Account'}</span>
          <span className="block truncate text-xs text-slate-400">{user?.domain?.name || 'Workspace'}</span>
        </span>
        <ChevronsUpDown size={14} strokeWidth={1.75} className="flex-shrink-0 text-slate-300" />
      </button>
    </div>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-60 flex-shrink-0 flex-col justify-between border-r border-black/5 bg-[#F6F5F1] px-6 py-6">
      <div>
        <div className="mb-10 flex items-center gap-2.5">
          <CapifortMark />
          <span className="text-sm font-semibold tracking-[0.2em] text-slate-900">CAPIFORT</span>
        </div>

        <nav className="space-y-5">
          {navItems.map(({ href, label, subtitle, icon: Icon }) => {
            const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href)
            return (
              <Link key={href} href={href} className="flex items-start gap-3">
                {Icon ? (
                  <Icon size={16} strokeWidth={1.75} className={active ? 'mt-0.5 text-slate-900' : 'mt-0.5 text-slate-400'} />
                ) : (
                  <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${active ? 'bg-slate-900' : 'bg-slate-300'}`} />
                )}
                <span>
                  <span className={`block text-sm ${active ? 'font-medium text-slate-900' : 'text-slate-500'}`}>
                    {label}
                  </span>
                  {subtitle && <span className="block text-xs text-slate-400">{subtitle}</span>}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>

      <AccountMenu />
    </aside>
  )
}
