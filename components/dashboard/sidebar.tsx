'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Compass, LayoutDashboard, Folder, FileText, BrainCircuit, Bot,
  MessageSquare, Activity, Users, Settings, LogOut,
} from 'lucide-react'
import { useAuth } from '@/context/auth-context'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/workspaces', label: 'Workspaces', icon: Folder },
  { href: '/dashboard/files', label: 'Files', icon: FileText },
  { href: '/dashboard/knowledge', label: 'Knowledge', icon: BrainCircuit },
  { href: '/dashboard/agents', label: 'Agents', icon: Bot },
  { href: '/dashboard/chat', label: 'Chat', icon: MessageSquare },
  { href: '/dashboard/activity', label: 'Activity', icon: Activity },
  { href: '/dashboard/members', label: 'Members', icon: Users },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <aside className="flex h-full w-60 flex-shrink-0 flex-col border-r border-slate-100 bg-white">
      <div className="flex h-16 items-center gap-2 px-6 font-semibold text-slate-900">
        <Compass size={20} strokeWidth={2} />
        CAPIFORT
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                active ? 'bg-violet-50 font-medium text-violet-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon size={17} strokeWidth={1.75} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            {(user?.username || 'U').slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-slate-900">{user?.username || 'User'}</p>
            <p className="truncate text-xs text-slate-400">{user?.email || ''}</p>
          </div>
          <button onClick={logout} aria-label="Log out" className="text-slate-400 hover:text-slate-600">
            <LogOut size={16} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </aside>
  )
}
