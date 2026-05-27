'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Layers, Activity, Zap, Command, Settings2, LogOut, Cloud, Shield } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useAuth } from '@/context/auth-context'
import { useFeature } from '@/hooks/use-feature'

interface NavRailProps {
  onSearch: () => void
}

// ── Rail icon button ───────────────────────────────────

function RailButton({
  icon: Icon,
  label,
  active = false,
  onClick,
  href,
}: {
  icon: React.ElementType
  label: string
  active?: boolean
  onClick?: () => void
  href?: string
}) {
  const cls = cn(
    'relative group flex items-center justify-center w-9 h-9 rounded',
    'transition-colors duration-fast',
    active
      ? 'text-[var(--accent)] bg-[var(--accent-dim)]'
      : 'text-[var(--subtle)] hover:text-[var(--text-2)] hover:bg-[var(--surface-2)]',
  )

  const tooltip = (
    <span
      className={cn(
        'absolute left-full ml-3 px-2 py-1',
        'type-label text-[var(--text-2)] bg-[var(--surface-3)]',
        'border border-[var(--border)] rounded',
        'whitespace-nowrap pointer-events-none',
        'opacity-0 group-hover:opacity-100',
        'translate-x-1 group-hover:translate-x-0',
        'transition-all duration-fast',
        'z-tooltip',
      )}
    >
      {label}
    </span>
  )

  if (href) {
    return (
      <Link href={href} className={cls} aria-label={label}>
        <Icon size={15} strokeWidth={1.5} />
        {tooltip}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={cls} aria-label={label}>
      <Icon size={15} strokeWidth={1.5} />
      {tooltip}
    </button>
  )
}

// ── Nav rail ───────────────────────────────────────────

export function NavRail({ onSearch }: NavRailProps) {
  const pathname = usePathname()
  const { user, isAdmin, logout } = useAuth()
  const hasAws = useFeature('aws_integration')

  const initials = user?.username?.[0]?.toUpperCase() || '?'

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 bottom-0 z-float',
        'w-[52px] flex flex-col items-center justify-between',
        'py-5',
        'bg-[var(--surface)] border-r border-[var(--border)]',
      )}
      aria-label="Navigation rail"
    >
      {/* Top: logo + primary nav */}
      <div className="flex flex-col items-center gap-6">
        <Link
          href="/"
          className="type-label text-[var(--accent)] hover:text-[var(--accent-warm)] transition-colors duration-fast"
          aria-label="North — Home"
        >
          N
        </Link>

        <div className="w-5 h-px bg-[var(--border)]" />

        <nav className="flex flex-col items-center gap-1.5" aria-label="Primary navigation">
          <RailButton
            icon={Layers}
            label="Workspace"
            href="/dashboard"
            active={pathname === '/dashboard'}
          />
          <RailButton
            icon={Activity}
            label="Timeline"
            href="/dashboard/timeline"
            active={pathname === '/dashboard/timeline'}
          />
          <RailButton
            icon={Zap}
            label="Intelligence"
            href="/dashboard/intelligence"
            active={pathname === '/dashboard/intelligence'}
          />
          {hasAws && (
            <RailButton
              icon={Cloud}
              label="AWS Accounts"
              href="/dashboard/aws-accounts"
              active={pathname === '/dashboard/aws-accounts'}
            />
          )}
          {isAdmin && (
            <RailButton
              icon={Shield}
              label="Ops Dashboard"
              href="/dashboard/ops"
              active={pathname === '/dashboard/ops'}
            />
          )}
        </nav>

        {/* Search trigger */}
        <div className="flex flex-col items-center gap-1">
          <RailButton icon={Command} label="Search (⌘K)" onClick={onSearch} />
          <span className="type-label text-[var(--subtle)] opacity-50" style={{ fontSize: '9px' }}>⌘K</span>
        </div>
      </div>

      {/* Bottom: settings + user avatar + logout */}
      <div className="flex flex-col items-center gap-1.5">
        <RailButton
          icon={Settings2}
          label="Settings"
          href="/dashboard/settings"
          active={pathname === '/dashboard/settings'}
        />

        <div className="w-5 h-px bg-[var(--border)] my-1" />

        {/* User avatar */}
        <div className="relative group">
          <div
            className={cn(
              'flex items-center justify-center w-7 h-7 rounded-full cursor-default',
              'bg-[var(--accent-dim)] border border-[var(--border)]',
              'type-label text-[var(--accent)]',
            )}
            aria-label={user?.username || 'Profile'}
          >
            {initials}
          </div>
          {/* Username tooltip */}
          {user?.username && (
            <span
              className={cn(
                'absolute left-full ml-3 px-2 py-1',
                'type-label text-[var(--text-2)] bg-[var(--surface-3)]',
                'border border-[var(--border)] rounded',
                'whitespace-nowrap pointer-events-none',
                'opacity-0 group-hover:opacity-100',
                'translate-x-1 group-hover:translate-x-0',
                'transition-all duration-fast',
                'z-tooltip',
              )}
            >
              {user.username}
            </span>
          )}
        </div>

        {/* Logout */}
        <RailButton icon={LogOut} label="Sign out" onClick={logout} />
      </div>
    </aside>
  )
}
