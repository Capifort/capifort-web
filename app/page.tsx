import { PageShell } from '@/layouts/page-shell'
import { Container } from '@/layouts/container'
import { SectionFrame } from '@/layouts/section-frame'
import { SpatialPanel } from '@/layouts/spatial-panel'
import { Hero } from '@/components/hero'
import {
  Display,
  DisplayXL,
  EditorialStatement,
  SystemLabel,
  Body,
  Title,
  MonoMeta,
} from '@/components/typography'
import { FadeIn, Stagger, StaggerItem } from '@/motion'

const philosophy = [
  {
    label: '01',
    title: 'Operational Clarity',
    body: 'North gives teams one unified place to access organizational knowledge, decisions, workflows, and context — without switching across disconnected tools.',
  },
  {
    label: '02',
    title: 'Knowledge That Compounds',
    body: 'Every interaction, document, workflow, and decision strengthens organizational memory — making the company smarter over time.',
  },
  {
    label: '03',
    title: 'Collective Intelligence',
    body: 'North transforms fragmented information into a continuously evolving knowledge graph that helps teams coordinate, operate, and make better decisions together.',
  },
]

const architecture = [
  'Upload Documents',
  'Extract Organizational Knowledge',
  'Auto-Connect Teams & Context',
  'Build Dynamic Knowledge Graphs',
  'Search Institutional Memory',
  'Coordinate Operational Workflows',
  'Generate AI-Powered Insights',
  'Continuously Evolve Company Intelligence',
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
            <SystemLabel as="p" className="mb-6 text-[var(--accent)]">
              Philosophy
            </SystemLabel>
            <Display as="h2" className="mb-20 max-w-3xl">
              Every organization deserves a brain.
            </Display>
          </FadeIn>

          <Stagger className="grid md:grid-cols-3 gap-4">
            {philosophy.map((item) => (
              <StaggerItem key={item.label}>
                <div className="hover:-translate-y-1.5 transition-transform duration-slow ease-cinematic h-full">
                  <SpatialPanel glow className="h-full flex flex-col justify-between min-h-[280px]">
                    <div>
                      <div className="flex items-start justify-between mb-8">
                        <div className="w-10 h-10 rounded-lg border border-[var(--border)] bg-[var(--accent-dim)]" />
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
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-16">
              <div>
                <SystemLabel as="p" className="mb-5 text-[var(--accent)]">
                  Architecture
                </SystemLabel>
                <Display as="h2" className="max-w-3xl">
                  From fragmented information<br />to organizational intelligence.
                </Display>
              </div>
              <Body className="max-w-sm">
                One intelligent interface for capturing knowledge, retrieving context,
                onboarding teams, and making decisions together.
              </Body>
            </div>
          </FadeIn>

          <Stagger className="grid lg:grid-cols-4 md:grid-cols-2 gap-3">
            {architecture.map((item) => (
              <StaggerItem key={item}>
                <div className="group surface border-lift rounded-md p-6 hover:bg-[var(--surface-2)] transition-colors duration-fast cursor-default min-h-[160px] flex flex-col justify-between">
                  <div
                    className="w-2 h-2 rounded-full bg-[var(--accent)] opacity-40 group-hover:opacity-100 transition-opacity duration-fast"
                    aria-hidden
                  />
                  <Title as="h3" className="mt-auto leading-snug">
                    {item}
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
      <SectionFrame id="vision" size="lg">
        <Container size="tight">
          <FadeIn y={32}>

            <SystemLabel as="p" className="mb-8 text-center text-[var(--accent)]">
              Vision
            </SystemLabel>

            <DisplayXL as="h2" className="text-center mb-12">
              The next generation<br />
              of organizations<br />
              will think collectively.
            </DisplayXL>

            <EditorialStatement className="text-center max-w-2xl mx-auto mb-16">
              The future of work is not more dashboards.
              It is organizations that remember, reason, coordinate, and evolve intelligently.
              North is building the operating system for organizational knowledge.
            </EditorialStatement>

            <div className="flex justify-center">
              <button className="group flex items-center gap-2.5 type-body-sm text-[var(--text-2)] hover:text-[var(--accent)] transition-colors duration-fast">
                <span>Build with North</span>
                <span
                  className="inline-block group-hover:translate-x-1.5 transition-transform duration-fast"
                  aria-hidden
                >
                  →
                </span>
              </button>
            </div>

          </FadeIn>
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
