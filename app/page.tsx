import { PageShell } from '@/layouts/page-shell'
import { Container } from '@/layouts/container'
import { SectionFrame } from '@/layouts/section-frame'
import { SpatialPanel } from '@/layouts/spatial-panel'
import { Hero } from '@/components/hero'
import {
  Display,
  SystemLabel,
  Body,
  Title,
  MonoMeta,
} from '@/components/typography'
import { FadeIn, Stagger, StaggerItem, Reveal } from '@/motion'

const philosophy = [
  {
    label: '01',
    title: 'Operational Clarity',
    body: 'North gives teams one unified place to access organizational knowledge, decisions, workflows, and context — without switching across disconnected tools.',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[var(--accent)]">
        <path d="M2 10l8-4.5 8 4.5-8 4.5L2 10z" />
        <path d="M2 13.5l8 4.5 8-4.5" />
        <path d="M2 6.5l8 4.5 8-4.5" />
      </svg>
    ),
  },
  {
    label: '02',
    title: 'Knowledge That Compounds',
    body: 'Every interaction, document, workflow, and decision strengthens organizational memory — making the company smarter over time.',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[var(--accent)]">
        <path d="M3 15l4.5-5 3 3 4.5-5.5" />
        <path d="M13 7.5h3.5V11" />
      </svg>
    ),
  },
  {
    label: '03',
    title: 'Collective Intelligence',
    body: 'North transforms fragmented information into a continuously evolving knowledge graph that helps teams coordinate, operate, and make better decisions together.',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[var(--accent)]">
        <circle cx="10" cy="10" r="2.25" />
        <circle cx="3.5" cy="4.5" r="1.5" />
        <circle cx="16.5" cy="4.5" r="1.5" />
        <circle cx="10" cy="17.5" r="1.5" />
        <line x1="9" y1="8.1" x2="4.8" y2="5.6" />
        <line x1="11" y1="8.1" x2="15.2" y2="5.6" />
        <line x1="10" y1="12.25" x2="10" y2="16" />
      </svg>
    ),
  },
]

const architecture = [
  {
    title: 'Upload Documents',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[var(--accent)]">
        <path d="M10 13V4M7 7l3-3 3 3" />
        <path d="M4 14v2a1 1 0 001 1h10a1 1 0 001-1v-2" />
      </svg>
    ),
  },
  {
    title: 'Extract Organizational Knowledge',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[var(--accent)]">
        <circle cx="9" cy="9" r="5" />
        <path d="M15.5 15.5l-3-3" />
        <path d="M7 9h4M9 7v4" />
      </svg>
    ),
  },
  {
    title: 'Auto-Connect Teams & Context',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[var(--accent)]">
        <circle cx="4.5" cy="10" r="2" />
        <circle cx="15.5" cy="10" r="2" />
        <path d="M6.5 10h7" />
        <path d="M10 4.5v11" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    title: 'Build Dynamic Knowledge Graphs',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[var(--accent)]">
        <circle cx="10" cy="10" r="2" />
        <circle cx="4" cy="5" r="1.5" />
        <circle cx="16" cy="5" r="1.5" />
        <circle cx="4" cy="15" r="1.5" />
        <circle cx="16" cy="15" r="1.5" />
        <line x1="8.3" y1="8.7" x2="5.3" y2="6.3" />
        <line x1="11.7" y1="8.7" x2="14.7" y2="6.3" />
        <line x1="8.3" y1="11.3" x2="5.3" y2="13.7" />
        <line x1="11.7" y1="11.3" x2="14.7" y2="13.7" />
      </svg>
    ),
  },
  {
    title: 'Search Institutional Memory',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[var(--accent)]">
        <circle cx="9" cy="9" r="5" />
        <path d="M15.5 15.5l-3-3" />
        <path d="M9 6.5v3l1.5 1.5" />
      </svg>
    ),
  },
  {
    title: 'Coordinate Operational Workflows',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[var(--accent)]">
        <rect x="3" y="4" width="5" height="3.5" rx="0.75" />
        <rect x="12" y="4" width="5" height="3.5" rx="0.75" />
        <rect x="7.5" y="12.5" width="5" height="3.5" rx="0.75" />
        <path d="M5.5 7.5v2.5h4.5v2.5" />
        <path d="M14.5 7.5v2.5h-4.5" />
      </svg>
    ),
  },
  {
    title: 'Generate AI-Powered Insights',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[var(--accent)]">
        <path d="M10 3v2M10 15v2M3 10h2M15 10h2" />
        <path d="M5.6 5.6l1.4 1.4M13 13l1.4 1.4M5.6 14.4l1.4-1.4M13 7l1.4-1.4" />
        <circle cx="10" cy="10" r="3" />
      </svg>
    ),
  },
  {
    title: 'Continuously Evolve Company Intelligence',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[var(--accent)]">
        <path d="M4.5 10a5.5 5.5 0 0110.7-1.7" />
        <path d="M15.5 10a5.5 5.5 0 01-10.7 1.7" />
        <path d="M13.5 6.5l1.7 1.8-1.8 1.7" />
        <path d="M6.5 13.5l-1.7-1.8 1.8-1.7" />
      </svg>
    ),
  },
]

export default function Home() {
  return (
    <PageShell>

      {/* ── Hero ────────────────────────────────────────── */}
      <Hero />

      {/* ── Philosophy ──────────────────────────────────── */}
      <SectionFrame id="philosophy">
        <Container>

          <FadeIn>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 mb-16">
              <div>
                <SystemLabel as="p" className="mb-5 text-[var(--accent)]">
                  Philosophy
                </SystemLabel>
                <Display as="h2" className="max-w-2xl [font-size:clamp(var(--text-2xl),3.5vw,var(--text-4xl))]">
                  Every organization deserves a brain.
                </Display>
              </div>
              <Body className="max-w-sm lg:pt-[3.75rem]">
                Three core principles that govern how we think about organizational
                knowledge and why it changes everything.
              </Body>
            </div>
          </FadeIn>

          <Stagger className="grid md:grid-cols-3 gap-4">
            {philosophy.map((item) => (
              <StaggerItem key={item.label} className="h-full">
                <div className="hover:-translate-y-1.5 transition-transform duration-slow ease-cinematic h-full">
                  <SpatialPanel glow className="h-full flex flex-col justify-between min-h-[280px]">
                    <div>
                      <div className="flex items-start justify-between mb-8">
                        <div className="w-10 h-10 rounded-lg border border-[var(--border)] bg-[var(--accent-dim)] flex items-center justify-center">
                          {item.icon}
                        </div>
                        <MonoMeta className="text-[var(--subtle)]">{item.label}</MonoMeta>
                      </div>
                      <Title as="h3" className="mb-4">{item.title}</Title>
                      <Body className="leading-relaxed">{item.body}</Body>
                    </div>
                    <div className="mt-8 h-px bg-[var(--border)]" />
                  </SpatialPanel>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

        </Container>
      </SectionFrame>

      {/* ── Divider ─────────────────────────────────────── */}
      <Container>
        <div className="h-px bg-[var(--border-subtle)]" />
      </Container>

      {/* ── Architecture ────────────────────────────────── */}
      <SectionFrame id="architecture">
        <Container>

          <FadeIn>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 mb-16">
              <div>
                <SystemLabel as="p" className="mb-5 text-[var(--accent)]">
                  Architecture
                </SystemLabel>
                <Display as="h2" className="max-w-2xl [font-size:clamp(var(--text-2xl),3.5vw,var(--text-4xl))]">
                  From fragmented information<br />to organizational intelligence.
                </Display>
              </div>
              <Body className="max-w-sm lg:pt-[3.75rem]">
                One intelligent interface for capturing knowledge, retrieving context,
                onboarding teams, and making decisions together.
              </Body>
            </div>
          </FadeIn>

          <Stagger className="grid lg:grid-cols-4 md:grid-cols-2 gap-3">
            {architecture.map((item) => (
              <StaggerItem key={item.title}>
                <div className="group surface border-lift rounded-md p-7 hover:bg-[var(--surface-2)] transition-colors duration-fast cursor-default min-h-[210px] flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-md border border-[var(--border)] bg-[var(--accent-dim)] flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity duration-fast">
                    {item.icon}
                  </div>
                  <Title as="h3" className="mt-auto leading-snug">
                    {item.title}
                  </Title>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

        </Container>
      </SectionFrame>

      {/* ── Divider ─────────────────────────────────────── */}
      <Container>
        <div className="h-px bg-[var(--border-subtle)]" />
      </Container>

      {/* ── Vision ──────────────────────────────────────── */}
      <SectionFrame id="vision" size="md">
        <Container>

          {/* Eyebrow — label + extending rule */}
          <FadeIn y={0} dur={0.5} className="flex items-center gap-5 mb-10 lg:mb-12">
            <SystemLabel as="p" className="text-[var(--accent)] flex-shrink-0">
              Vision
            </SystemLabel>
            <div className="h-px flex-1 bg-[var(--border-subtle)]" aria-hidden />
          </FadeIn>

          {/* Headline — three lines, each clip-revealed individually */}
          <div className="mb-10 lg:mb-14">
            <Reveal direction="up" delay={0.05} dur={1.1}>
              <Display as="p" className="[font-size:clamp(var(--text-3xl),5.5vw,var(--text-5xl))]">The next generation</Display>
            </Reveal>
            <Reveal direction="up" delay={0.18} dur={1.1}>
              <Display as="p" className="[font-size:clamp(var(--text-3xl),5.5vw,var(--text-5xl))]">of organizations</Display>
            </Reveal>
            <Reveal direction="up" delay={0.31} dur={1.1}>
              <Display as="p" className="[font-size:clamp(var(--text-3xl),5.5vw,var(--text-5xl))]">will think collectively.</Display>
            </Reveal>
          </div>

          {/* Rule + content */}
          <div className="border-t border-[var(--border-subtle)] pt-10 lg:pt-14">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 lg:gap-20">

              {/* Body — left */}
              <FadeIn delay={0.35} y={12}>
                <div className="space-y-5 max-w-xl">
                  <p className="type-subtitle text-[var(--text-2)]">
                    The future of work is not more dashboards.
                  </p>
                  <Body>
                    It is organizations that remember, reason, coordinate, and
                    evolve intelligently. North is building the operating system
                    for organizational knowledge.
                  </Body>
                </div>
              </FadeIn>

              {/* CTA — right */}
              <FadeIn delay={0.5} y={8}>
                <button className="group flex items-center gap-2.5 type-body-sm text-[var(--text-2)] hover:text-[var(--accent)] transition-colors duration-fast whitespace-nowrap">
                  <span>Build with North</span>
                  <span
                    className="inline-block group-hover:translate-x-1.5 transition-transform duration-fast"
                    aria-hidden
                  >
                    →
                  </span>
                </button>
              </FadeIn>

            </div>
          </div>

        </Container>
      </SectionFrame>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="border-t border-[var(--border-subtle)] py-10">
        <Container>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="type-label text-[var(--accent)] mb-2">NORTH</p>
              <p className="type-body-sm text-[var(--subtle)]">
                The Operating System For Organizational Knowledge.
              </p>
            </div>
            <div className="flex items-center gap-8">
              {['Knowledge', 'Memory', 'Intelligence', 'Operations'].map((label) => (
                <span key={label} className="type-label text-[var(--subtle)]">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </footer>

    </PageShell>
  )
}
