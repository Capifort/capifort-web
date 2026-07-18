'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutGrid, Layers, FileText, BrainCircuit, Bot, MessageSquare,
  Activity, Users, Settings2, LogOut, Cloud, Shield, Sun, Moon,
  Search, ChevronDown, HardDrive,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { useAuth } from '@/context/auth-context'
import { useFeature } from '@/hooks/use-feature'
import { useTheme } from '@/context/theme-context'

interface NavRailProps {
  onSearch: () => void
}

// ── Nav item ───────────────────────────────────────────

function NavItem({
  icon: Icon,
  label,
  href,
  active = false,
  disabled = false,
}: {
  icon: React.ElementType
  label: string
  href: string
  active?: boolean
  disabled?: boolean
}) {
  const cls = cn(
    'flex items-center gap-2.5 px-3 py-2 rounded-md',
    'dash-sidebar transition-colors duration-fast',
    active
      ? 'bg-[var(--accent-dim)] text-[var(--text)]'
      : disabled
        ? 'text-[var(--subtle)] cursor-default'
        : 'text-[var(--muted)] hover:text-[var(--text-2)] hover:bg-[var(--surface-2)]',
  )

  const content = (
    <>
      <Icon size={15} strokeWidth={1.5} className="flex-shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      {disabled && (
        <span className="dash-small-label text-[var(--subtle)]">Soon</span>
      )}
    </>
  )

  if (disabled) {
    return <div className={cls} aria-disabled>{content}</div>
  }

  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  )
}

// ── Nav rail ───────────────────────────────────────────

export function NavRail({ onSearch }: NavRailProps) {
  const pathname = usePathname()
  const { user, isAdmin, logout } = useAuth()
  const hasAws = useFeature('aws_integration')
  const { theme, toggle } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const initials = user?.username?.[0]?.toUpperCase() || '?'

  const primaryNav = [
    { icon: LayoutGrid,    label: 'Dashboard',  href: '/dashboard' },
    { icon: Layers,        label: 'Workspaces', href: '/dashboard/workspaces', disabled: true },
    { icon: FileText,      label: 'Files',      href: '/dashboard/files',      disabled: true },
    { icon: BrainCircuit,  label: 'Knowledge',  href: '/dashboard/knowledge',  disabled: true },
    { icon: Bot,           label: 'Agents',     href: '/dashboard/agents',     disabled: true },
    { icon: MessageSquare, label: 'Chat',       href: '/dashboard/chat',       disabled: true },
    { icon: Activity,      label: 'Activity',   href: '/dashboard/activity',   disabled: true },
    { icon: Users,         label: 'Members',    href: '/dashboard/settings' },
  ]

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 bottom-0 z-float',
        'w-60 flex flex-col justify-between',
        'py-5 px-3',
        'bg-[var(--surface)] border-r border-[var(--border)]',
      )}
      aria-label="Navigation rail"
    >
      {/* Top: wordmark + primary nav */}
      <div className="flex flex-col gap-6 min-h-0">
        <Link href="/" className="flex items-center gap-2 px-1" aria-label="North — Home">
          <span className="text-[var(--accent)]" style={{ fontSize: '15px' }}>✧</span>
          <span className="dash-card-title text-[var(--text)]" style={{ fontSize: '15px' }}>
            NORTH
          </span>
        </Link>

        {/* Search trigger */}
        <button
          onClick={onSearch}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-md',
            'border border-[var(--border)] bg-[var(--bg)]',
            'dash-body text-[var(--muted)] hover:border-[var(--border-hover)]',
            'transition-colors duration-fast',
          )}
        >
          <Search size={14} strokeWidth={1.5} className="flex-shrink-0" />
          <span className="flex-1 text-left truncate">Search anything…</span>
          <kbd className="dash-small-label text-[var(--subtle)]">⌘K</kbd>
        </button>

        <nav className="flex flex-col gap-0.5 overflow-y-auto" aria-label="Primary navigation">
          {primaryNav.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={pathname === item.href}
              disabled={item.disabled}
            />
          ))}

          {(hasAws || isAdmin) && (
            <div className="w-full h-px bg-[var(--border-subtle)] my-2" />
          )}

          {hasAws && (
            <NavItem icon={Cloud} label="AWS Accounts" href="/dashboard/aws-accounts" active={pathname === '/dashboard/aws-accounts'} />
          )}
          {isAdmin && (
            <NavItem icon={Shield} label="Ops Dashboard" href="/dashboard/ops" active={pathname === '/dashboard/ops'} />
          )}
        </nav>
      </div>

      {/* Bottom: storage + profile */}
      <div className="flex flex-col gap-3">
        <NavItem icon={Settings2} label="Settings" href="/dashboard/settings" active={pathname === '/dashboard/settings'} />

        {/* Storage widget */}
        <div className="px-3 py-3 rounded-md border border-[var(--border)] bg-[var(--bg)]">
          <div className="flex items-center gap-1.5 mb-2">
            <HardDrive size={12} strokeWidth={1.5} className="text-[var(--subtle)]" />
            <span className="dash-small-label text-[var(--muted)]">Storage used</span>
          </div>
          <p className="dash-card-title text-[var(--text-2)] mb-1.5" style={{ fontSize: '18px' }}>2.34 TB <span className="dash-caption text-[var(--muted)]">/ 10 TB</span></p>
          <div className="h-1 rounded-full bg-[var(--border)] overflow-hidden mb-2">
            <div className="h-full bg-[var(--accent)] rounded-full" style={{ width: '23%' }} />
          </div>
          <Link href="/dashboard/settings" className="dash-button dash-caption text-[var(--accent)] hover:text-[var(--accent-warm)] transition-colors duration-fast">
            Manage storage
          </Link>
        </div>

        {/* Profile row */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className={cn(
              'w-full flex items-center gap-2.5 px-2 py-2 rounded-md',
              'hover:bg-[var(--surface-2)] transition-colors duration-fast',
            )}
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--accent-dim)] border border-[var(--border)] dash-caption text-[var(--accent)] flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="dash-sidebar text-[var(--text-2)] truncate leading-tight">{user?.username || '—'}</p>
              <p className="dash-caption text-[var(--muted)] truncate">{user?.email || ''}</p>
            </div>
            <ChevronDown size={14} strokeWidth={1.5} className="text-[var(--subtle)] flex-shrink-0" />
          </button>

          {menuOpen && (
            <div
              className={cn(
                'absolute bottom-full left-0 right-0 mb-2 p-1.5',
                'bg-[var(--surface-3)] border border-[var(--border)] rounded-md',
                'shadow-[var(--shadow-md)] z-tooltip',
              )}
            >
              <button
                onClick={toggle}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded dash-caption text-[var(--text-2)] hover:bg-[var(--surface-2)] transition-colors duration-fast"
              >
                {theme === 'dark' ? <Sun size={14} strokeWidth={1.5} /> : <Moon size={14} strokeWidth={1.5} />}
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </button>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded dash-caption text-[var(--text-2)] hover:bg-[var(--surface-2)] transition-colors duration-fast"
              >
                <LogOut size={14} strokeWidth={1.5} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
