'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Bell, HelpCircle, ChevronDown, LogOut, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useAuth } from '@/context/auth-context'
import { useTheme } from '@/context/theme-context'

interface TopbarProps {
  title: string
  onSearch: () => void
  actions?: React.ReactNode
}

export function Topbar({ title, onSearch, actions }: TopbarProps) {
  const { user, logout } = useAuth()
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

  return (
    <div className="flex items-center gap-4 px-8 py-5 border-b border-[var(--border)]">
      <h1 className="dash-title text-[var(--text)] flex-shrink-0">{title}</h1>

      <button
        onClick={onSearch}
        className={cn(
          'flex-1 max-w-md flex items-center gap-2.5 px-3.5 py-2 rounded-md',
          'border border-[var(--border)] bg-[var(--surface-2)]',
          'dash-body text-[var(--muted)] hover:border-[var(--border-hover)]',
          'transition-colors duration-fast',
        )}
      >
        <Search size={14} strokeWidth={1.5} className="flex-shrink-0" />
        <span className="flex-1 text-left truncate">Search anything…</span>
        <kbd className="dash-small-label text-[var(--subtle)]">⌘K</kbd>
      </button>

      <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
        {actions}

        <button
          aria-label="Notifications"
          className="w-9 h-9 flex items-center justify-center rounded-md text-[var(--muted)] hover:text-[var(--text-2)] hover:bg-[var(--surface-2)] transition-colors duration-fast"
        >
          <Bell size={15} strokeWidth={1.5} />
        </button>
        <button
          aria-label="Help"
          className="w-9 h-9 flex items-center justify-center rounded-md text-[var(--muted)] hover:text-[var(--text-2)] hover:bg-[var(--surface-2)] transition-colors duration-fast"
        >
          <HelpCircle size={15} strokeWidth={1.5} />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 pl-1.5 pr-2 py-1.5 rounded-md hover:bg-[var(--surface-2)] transition-colors duration-fast"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--accent-dim)] border border-[var(--border)] dash-caption text-[var(--accent)] flex-shrink-0">
              {initials}
            </div>
            <span className="dash-sidebar text-[var(--text-2)] max-w-[120px] truncate">{user?.username || '—'}</span>
            <ChevronDown size={13} strokeWidth={1.5} className="text-[var(--subtle)] flex-shrink-0" />
          </button>

          {menuOpen && (
            <div
              className={cn(
                'absolute right-0 top-full mt-2 p-1.5 w-44',
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
    </div>
  )
}
