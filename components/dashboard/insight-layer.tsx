import { FadeIn, MagneticButton } from '@/motion'
import { SystemLabel } from '@/components/typography'

const tags = ['High Priority', '12 services', 'Payment cluster', 'Causation mapped']

export function InsightLayer() {
  return (
    <div className="relative px-8 py-10 border-b border-[var(--border)]">

      {/* Accent left border — gradient, not flat */}
      <div
        className="absolute left-0 top-0 bottom-0 w-px pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, var(--accent) 30%, var(--accent) 70%, transparent 100%)',
          opacity: 0.45,
        }}
        aria-hidden
      />

      {/* Label */}
      <FadeIn delay={0.05}>
        <SystemLabel as="p" className="mb-5 text-[var(--accent)]">
          Intelligence — Active
        </SystemLabel>
      </FadeIn>

      {/* Main insight statement */}
      <FadeIn delay={0.12} y={12}>
        <h2 className="type-headline max-w-2xl mb-6 text-[var(--text)]">
          North detected cascading latency anomalies
          across payment infrastructure.
        </h2>
      </FadeIn>

      {/* Tag strip */}
      <FadeIn delay={0.22}>
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {tags.map((tag, i) => (
            <span
              key={tag}
              className="type-label px-2.5 py-1 rounded border border-[var(--border)] text-[var(--muted)]"
              style={{ opacity: i === 0 ? 1 : 0.7 }}
            >
              {i === 0 && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent)] mr-1.5 animate-pulse align-middle" aria-hidden />
              )}
              {tag}
            </span>
          ))}
          <span className="type-mono text-[var(--subtle)] ml-2">3 min ago</span>
        </div>
      </FadeIn>

      {/* Actions */}
      <FadeIn delay={0.3}>
        <div className="flex items-center gap-6">
          <MagneticButton
            strength={0.2}
            className="group flex items-center gap-2 type-body-sm text-[var(--text-2)] hover:text-[var(--accent)] transition-colors duration-fast"
          >
            <span>View full analysis</span>
            <span className="group-hover:translate-x-1 transition-transform duration-fast" aria-hidden>→</span>
          </MagneticButton>
          <button className="type-label text-[var(--subtle)] hover:text-[var(--muted)] transition-colors duration-fast">
            Dismiss
          </button>
        </div>
      </FadeIn>

    </div>
  )
}
