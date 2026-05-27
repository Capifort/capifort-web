import { FadeIn } from '@/motion'
import { cn } from '@/lib/cn'

const metrics = [
  { label: 'Uptime',        value: '99.97', suffix: '%',       note: '30-day rolling' },
  { label: 'P50 Latency',   value: '2.3',   suffix: 'ms',      note: '↑ 0.4ms from baseline' },
  { label: 'Events / 24h',  value: '1,847', suffix: '',        note: '12 requiring attention' },
  { label: 'Active Services',value: '42',   suffix: '',        note: '3 degraded' },
]

export function MetricsRow() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-[var(--border)]">
      {metrics.map((m, i) => (
        <FadeIn
          key={m.label}
          delay={0.08 * i}
          y={6}
          className={cn(
            'px-8 py-6',
            i < metrics.length - 1 && 'border-r border-[var(--border)]',
          )}
        >
          <p className="type-label mb-2.5 text-[var(--subtle)]">{m.label}</p>
          <p className="font-mono text-[var(--text)] tabular-nums leading-none mb-2"
            style={{ fontSize: 'var(--text-2xl)', fontWeight: 500 }}
          >
            {m.value}
            {m.suffix && (
              <span className="text-[var(--muted)] ml-1" style={{ fontSize: 'var(--text-sm)' }}>
                {m.suffix}
              </span>
            )}
          </p>
          <p className="type-label text-[var(--subtle)] opacity-70">{m.note}</p>
        </FadeIn>
      ))}
    </div>
  )
}
