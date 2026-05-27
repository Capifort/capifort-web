'use client'

import { Stagger, StaggerItem } from '@/motion'
import { cn } from '@/lib/cn'

// ── Event data ──────────────────────────────────────────

type EventStatus = 'active' | 'investigating' | 'resolved'
type EventSeverity = 'high' | 'medium' | 'low'

interface TimelineEvent {
  id: string
  status: EventStatus
  service: string
  type: string
  time: string
  detail: string
  severity: EventSeverity
}

const events: TimelineEvent[] = [
  {
    id: '001',
    status: 'active',
    service: 'payment-gateway-prod',
    type: 'Latency spike',
    time: '14:23:41',
    detail: '+340ms above baseline',
    severity: 'high',
  },
  {
    id: '002',
    status: 'investigating',
    service: 'cdn-edge-node-3',
    type: 'Error rate elevated',
    time: '14:23:38',
    detail: '2.3% — threshold 1%',
    severity: 'medium',
  },
  {
    id: '003',
    status: 'resolved',
    service: 'db-replica-us-east',
    type: 'Replication lag',
    time: '14:22:15',
    detail: 'Resolved in 2m 14s',
    severity: 'low',
  },
  {
    id: '004',
    status: 'resolved',
    service: 'auth-service-prod',
    type: 'Token validation',
    time: '14:20:03',
    detail: 'Resolved in 45s',
    severity: 'low',
  },
  {
    id: '005',
    status: 'resolved',
    service: 'webhook-processor',
    type: 'Queue depth',
    time: '14:18:47',
    detail: 'Resolved in 1m 32s',
    severity: 'medium',
  },
  {
    id: '006',
    status: 'resolved',
    service: 'object-store-primary',
    type: 'Throughput drop',
    time: '14:12:20',
    detail: 'Resolved in 8m 44s',
    severity: 'low',
  },
]

// ── Status indicator ───────────────────────────────────

function StatusDot({ status }: { status: EventStatus }) {
  return (
    <span
      className={cn(
        'inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1',
        status === 'active'        && 'bg-[var(--accent)] animate-pulse',
        status === 'investigating' && 'bg-[var(--accent)] opacity-60 animate-breath',
        status === 'resolved'      && 'bg-[var(--subtle)]',
      )}
      aria-hidden
    />
  )
}

// ── Single event row ───────────────────────────────────

function EventRow({ event }: { event: TimelineEvent }) {
  const dimmed = event.status === 'resolved'

  return (
    <div
      className={cn(
        'grid gap-x-6 items-start px-8 py-4 border-b border-[var(--border-subtle)]',
        'hover:bg-[var(--surface)] transition-colors duration-fast cursor-pointer',
        'grid-cols-[16px_80px_1fr_auto]',
        dimmed && 'opacity-50 hover:opacity-70',
      )}
    >
      {/* Status dot */}
      <StatusDot status={event.status} />

      {/* Time */}
      <span className="type-mono text-[var(--subtle)] tabular-nums">
        {event.time}
      </span>

      {/* Service + event */}
      <div className="min-w-0">
        <span className="type-body-sm text-[var(--text-2)] font-medium truncate block">
          {event.service}
        </span>
        <span className="type-body-sm text-[var(--subtle)] truncate block">
          {event.type}
        </span>
      </div>

      {/* Detail */}
      <span className="type-mono text-[var(--subtle)] text-right whitespace-nowrap hidden md:block">
        {event.detail}
      </span>
    </div>
  )
}

// ── Timeline ───────────────────────────────────────────

export function Timeline() {
  return (
    <div>
      {/* Header */}
      <div className="px-8 py-4 border-b border-[var(--border)] grid grid-cols-[16px_80px_1fr_auto] gap-x-6">
        <span />
        <span className="type-label text-[var(--subtle)]">Time</span>
        <span className="type-label text-[var(--subtle)]">Service / Event</span>
        <span className="type-label text-[var(--subtle)] hidden md:block">Detail</span>
      </div>

      {/* Event rows */}
      <Stagger staggerDelay={0.04} initialDelay={0.15}>
        {events.map((event) => (
          <StaggerItem key={event.id}>
            <EventRow event={event} />
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  )
}
