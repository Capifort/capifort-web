'use client'

import { useAuth } from '@/context/auth-context'
import { SystemLabel, Title, Body, MonoMeta } from '@/components/typography'
import { SpatialPanel } from '@/layouts/spatial-panel'
import { FadeIn, Stagger, StaggerItem } from '@/motion'
import { Container } from '@/layouts/container'

function formatDate(d: string | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center type-label text-[var(--accent)] border border-[var(--border)] bg-[var(--accent-dim)] rounded-full px-2.5 py-0.5">
      {children}
    </span>
  )
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <SpatialPanel className="flex items-center gap-4 p-5 min-h-[80px]">
      <div className="w-10 h-10 rounded-lg border border-[var(--border)] bg-[var(--accent-dim)] flex items-center justify-center flex-shrink-0 text-[var(--accent)]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="type-mono-lg text-[var(--text)] truncate">{value}</p>
        <p className="type-label text-[var(--subtle)] mt-0.5">{label}</p>
      </div>
    </SpatialPanel>
  )
}

export default function DashboardPage() {
  const { user, plan } = useAuth()

  const profileRows: [string, React.ReactNode][] = [
    ['Username',    <span className="type-body-sm text-[var(--text-2)]">{user?.username}</span>],
    ['Email',       <span className="type-body-sm text-[var(--text-2)]">{user?.email}</span>],
    ['ID',          <span className="type-mono text-[var(--muted)]">{user?.id}</span>],
    ['Role',        <Badge>{user?.role}</Badge>],
    ['Entity',      <Badge>{user?.entity_type || 'individual'}</Badge>],
    ...(user?.organization ? [['Organization', <Badge key="org">{user.organization.name}</Badge>] as [string, React.ReactNode]] : []),
    ...(plan ? [['Plan', <Badge key="plan">{plan.name}</Badge>] as [string, React.ReactNode]] : []),
    ['Member since', <span className="type-body-sm text-[var(--muted)]">{formatDate(user?.created_at)}</span>],
  ]

  return (
    <div className="min-h-dvh">
      {/* Page header */}
      <div className="border-b border-[var(--border)] px-8 py-6">
        <FadeIn y={4}>
          <SystemLabel as="p" className="mb-1.5">Overview</SystemLabel>
          <h1 className="type-headline text-[var(--text)]">
            Welcome back, {user?.username}.
          </h1>
        </FadeIn>
      </div>

      <Container className="py-10">

        {/* Stats */}
        <FadeIn y={8}>
          <SystemLabel as="p" className="mb-4">At a glance</SystemLabel>
        </FadeIn>

        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10" staggerDelay={0.05}>

          <StaggerItem>
            <StatCard
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              }
              value={String(user?.permissions?.length ?? 0)}
              label="Permissions"
            />
          </StaggerItem>

          <StaggerItem>
            <StatCard
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              }
              value={(user?.entity_type || 'individual').toUpperCase()}
              label="Entity Type"
            />
          </StaggerItem>

          <StaggerItem>
            <StatCard
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              }
              value="Active"
              label="Status"
            />
          </StaggerItem>

          {user?.organization ? (
            <StaggerItem>
              <StatCard
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                }
                value={user.organization.name}
                label="Organization"
              />
            </StaggerItem>
          ) : (
            <StaggerItem>
              <StatCard
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
                  </svg>
                }
                value={plan?.name || 'No plan'}
                label="Current Plan"
              />
            </StaggerItem>
          )}
        </Stagger>

        {/* Two-column cards */}
        <div className="grid md:grid-cols-2 gap-4">

          {/* Profile */}
          <FadeIn y={8} delay={0.15}>
            <SpatialPanel className="h-full">
              <div className="flex items-center justify-between mb-5">
                <Title as="h2">Profile</Title>
              </div>
              <div className="divide-y divide-[var(--border-subtle)]">
                {profileRows.map(([label, value]) => (
                  <div key={label} className="flex items-center gap-4 py-3">
                    <span className="type-label text-[var(--subtle)] w-28 flex-shrink-0">{label}</span>
                    <div className="min-w-0 flex-1">{value}</div>
                  </div>
                ))}
              </div>
            </SpatialPanel>
          </FadeIn>

          {/* Permissions */}
          <FadeIn y={8} delay={0.22}>
            <SpatialPanel className="h-full">
              <div className="flex items-center justify-between mb-5">
                <Title as="h2">Permissions</Title>
                <MonoMeta className="text-[var(--subtle)]">
                  {user?.permissions?.length ?? 0} total
                </MonoMeta>
              </div>
              {user?.permissions?.length ? (
                <div className="flex flex-wrap gap-2">
                  {user.permissions.map((p) => (
                    <Badge key={p.key}>{p.name || p.key}</Badge>
                  ))}
                </div>
              ) : (
                <Body className="text-[var(--subtle)]">No permissions assigned yet.</Body>
              )}
            </SpatialPanel>
          </FadeIn>
        </div>

      </Container>
    </div>
  )
}
