import Link from 'next/link'
import Image from 'next/image'
import {
  Compass, ChevronDown, FileText, Database, AppWindow, Code2, Globe,
  Upload, ScanText, Grid3x3, Layers, Share2, Bot, Sparkles,
  BrainCircuit, Search, Zap, Wallet, Scale, Settings2, Users, TrendingUp,
  Cloud, ShieldCheck, KeyRound, FileClock, Lock, ServerCog, Blocks,
} from 'lucide-react'
import { BrandLogo, brandLabels, type BrandName } from '@/components/brand-logos'

const integrationCategories = [
  {
    icon: FileText,
    title: 'Documents & Files',
    logos: ['pdf', 'word', 'excel', 'powerpoint'] as BrandName[],
    more: '40+ formats',
    desc: 'Contracts, SOPs, policies, decks and spreadsheets, including scanned and handwritten files.',
  },
  {
    icon: Database,
    title: 'Databases & Warehouses',
    logos: ['postgres', 'mysql', 'snowflake', 'bigquery'] as BrandName[],
    more: 'Redshift',
    desc: 'Query live operational and analytical data alongside your documents in one answer.',
  },
  {
    icon: AppWindow,
    title: 'Business Applications',
    logos: ['slack', 'notion', 'confluence', 'drive'] as BrandName[],
    more: '80+ apps',
    desc: 'Every conversation, wiki page and shared drive your teams already work inside.',
  },
  {
    icon: Code2,
    title: 'Source Code & Wikis',
    logos: ['github', 'gitlab', 'bitbucket'] as BrandName[],
    more: 'Self hosted',
    desc: 'Repositories, pull requests, runbooks and internal engineering documentation.',
  },
  {
    icon: Cloud,
    title: 'Cloud Storage',
    logos: ['s3', 'azure', 'gcs', 'dropbox', 'box'] as BrandName[],
    more: 'SFTP',
    desc: 'Point Capifort at a bucket or folder and it stays continuously in sync.',
  },
  {
    icon: Globe,
    title: 'APIs & Core Systems',
    logos: ['salesforce', 'sap', 'microsoft', 'rest'] as BrandName[],
    more: 'Webhooks',
    desc: 'CRM, ERP and custom internal services through a first class API and event stream.',
  },
]

const integrationHighlights = [
  { value: '200+', label: 'Prebuilt enterprise connectors' },
  { value: '40+', label: 'Document and data formats' },
  { value: 'Zero', label: 'Data migration required' },
]

const sourceLogoWall: BrandName[] = [
  'pdf', 'word', 'excel', 'powerpoint', 'slack', 'notion', 'drive',
  'confluence', 'github', 'postgres', 'snowflake', 'salesforce',
]

const pipelineStages = [
  { icon: Upload, label: 'Ingest', note: 'Batch and streaming' },
  { icon: ScanText, label: 'OCR', note: 'Scans and images' },
  { icon: FileText, label: 'Parse', note: 'Layout aware' },
  { icon: Grid3x3, label: 'Chunk', note: 'Semantic splitting' },
  { icon: Layers, label: 'Embed', note: 'Vector encoding' },
  { icon: Database, label: 'Index', note: 'Hybrid retrieval' },
  { icon: Share2, label: 'Graph', note: 'Entity linking' },
  { icon: Bot, label: 'Agents', note: 'Tool execution' },
]

const intelligenceCapabilities = ['Knowledge Graph', 'Semantic Search', 'AI Agents', 'Automation']

const pipelineOutputs = [
  { icon: Sparkles, label: 'Ask Questions', desc: 'Cited answers in seconds' },
  { icon: FileText, label: 'Generate Reports', desc: 'Board ready documents' },
  { icon: Zap, label: 'Execute Workflows', desc: 'Actions across systems' },
  { icon: Grid3x3, label: 'Create Dashboards', desc: 'Live operational views' },
  { icon: Search, label: 'Discover Insights', desc: 'Risks and trends surfaced' },
]

const capabilities = [
  { icon: BrainCircuit, title: 'Organizational Memory', desc: 'Capture decades of knowledge from every source and make it instantly discoverable.' },
  { icon: Bot, title: 'AI Agents', desc: 'Agents that understand your business context and take actions across systems.' },
  { icon: Search, title: 'Enterprise Search', desc: 'Hybrid search across structured and unstructured data with semantic understanding.' },
  { icon: Zap, title: 'Automation', desc: 'Trigger workflows, approvals, and operations from natural language.' },
]

const functions = [
  { icon: Wallet, label: 'Finance' },
  { icon: Scale, label: 'Legal' },
  { icon: Settings2, label: 'Operations' },
  { icon: Users, label: 'HR' },
  { icon: TrendingUp, label: 'Sales' },
  { icon: Code2, label: 'Engineering' },
]

const howItWorks = [
  { icon: Cloud, text: 'Connect your existing systems and data sources in minutes.' },
  { icon: Share2, text: 'Capifort builds your enterprise knowledge graph and understands relationships.' },
  { icon: Sparkles, text: 'AI understands context across everything your organization knows.' },
  { icon: Zap, text: 'Employees search, automate, and execute work with confidence.' },
]

const sampleQuestions = [
  'Summarize all vendor contracts expiring next quarter.',
  'Show revenue trends across Europe since 2023.',
  'Create an executive report for last month’s incidents.',
  'Which SOP changed after the last audit?',
]

const enterpriseBadges = [
  { icon: Users, label: 'Role Based Access' },
  { icon: KeyRound, label: 'SSO & SAML' },
  { icon: FileClock, label: 'Audit Logs' },
  { icon: Lock, label: 'Encryption In Transit & At Rest' },
  { icon: ShieldCheck, label: 'SOC 2 Ready' },
  { icon: ServerCog, label: 'Private Deployment' },
  { icon: Code2, label: 'API First' },
  { icon: Blocks, label: 'Scalable Architecture' },
]

const stats = [
  { value: '90%', label: 'less time searching for information' },
  { value: '3x', label: 'faster decision making' },
  { value: '100M+', label: 'documents processed every day' },
  { value: '99.9%', label: 'platform uptime SLA' },
]

const footerColumns = [
  { title: 'Product', links: ['Features', 'Integrations', 'Security', 'Roadmap'] },
  { title: 'Solutions', links: ['Finance', 'Legal', 'Operations', 'Engineering', 'HR', 'Sales'] },
  { title: 'Resources', links: ['Documentation', 'Blog', 'Case Studies', 'Help Center'] },
  { title: 'Company', links: ['About Us', 'Careers', 'Partners', 'Contact'] },
]

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-extrabold tracking-tight text-slate-900">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/20">
        <Compass size={17} strokeWidth={2.25} />
      </span>
      CAPIFORT
    </Link>
  )
}

function Eyebrow({ children, dark = false }: { children: string; dark?: boolean }) {
  if (dark) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-violet-200">
        <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
        {children}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-violet-700">
      <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
      {children}
    </span>
  )
}

function SectionHeading({ eyebrow, title, subtitle, dark = false }: { eyebrow: string; title: string; subtitle?: string; dark?: boolean }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      <h2 className={`mt-6 text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl ${dark ? 'text-white' : 'text-slate-900'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mx-auto mt-5 max-w-2xl text-base leading-relaxed sm:text-lg ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

function LayerLabel({ step, title, note, dark = false }: { step: string; title: string; note: string; dark?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className={`flex h-7 items-center rounded-md px-2 text-[11px] font-black tracking-widest ${dark ? 'bg-white/10 text-violet-200' : 'bg-slate-900 text-white'}`}>
        {step}
      </span>
      <p className={`text-sm font-bold uppercase tracking-[0.14em] ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</p>
      <p className={`text-xs font-medium ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{note}</p>
    </div>
  )
}

function IconBadge({ icon: Icon }: { icon: React.ElementType }) {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 ring-1 ring-inset ring-violet-100">
      <Icon size={19} strokeWidth={1.9} />
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-white text-slate-900">

      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex">
            <Link href="#" className="transition-colors hover:text-slate-900">Product</Link>
            <span className="flex cursor-default items-center gap-1 transition-colors hover:text-slate-900">Solutions <ChevronDown size={14} /></span>
            <span className="flex cursor-default items-center gap-1 transition-colors hover:text-slate-900">Resources <ChevronDown size={14} /></span>
            <Link href="#" className="transition-colors hover:text-slate-900">Pricing</Link>
            <span className="flex cursor-default items-center gap-1 transition-colors hover:text-slate-900">Company <ChevronDown size={14} /></span>
          </nav>
          <div className="flex items-center gap-5">
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900">Log in</Link>
            <Link
              href="/login"
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-slate-900/10 transition hover:bg-slate-800 hover:shadow-md"
            >
              Request Demo
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" aria-hidden />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <Eyebrow>AI-native operating system for work</Eyebrow>
              <h1 className="mt-7 text-5xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
                AI Operating System<br />for Enterprise<br />
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Intelligence</span>
              </h1>
              <p className="mt-7 max-w-lg text-lg leading-relaxed text-slate-500">
                Capifort connects every source of your organizational knowledge, understands it deeply,
                and helps your team search, reason, automate, and execute with confidence.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/login"
                  className="rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl"
                >
                  Book a Demo &rarr;
                </Link>
                <button className="rounded-xl border-2 border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                  Watch 2 min Overview
                </button>
              </div>
              <div className="mt-16">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Trusted by forward-thinking companies</p>
                <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3 text-slate-400">
                  {['Ramp', 'Brex', 'Mercury', 'Vanta', 'Notion', 'Rippling'].map((name) => (
                    <span key={name} className="text-sm font-bold">{name}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-violet-100 via-white to-transparent blur-2xl" aria-hidden />
              <Image
                src="/hero-orbit.png"
                alt="Capifort knowledge graph connecting Slack, Google Drive, Excel, Word, Teams, Notion and other enterprise sources"
                width={1402}
                height={1122}
                priority
                className="h-auto w-full drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Connect your enterprise knowledge */}
      <section className="relative overflow-hidden bg-slate-950 py-28">
        {/* Blueprint grid + halo: no stock Tailwind utility covers either, so both are inline */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-[60rem] -translate-x-1/2 rounded-full bg-violet-600/25 blur-[110px]"
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl px-6">
          <SectionHeading
            dark
            eyebrow="Integrations"
            title="Connect your enterprise knowledge"
            subtitle="One knowledge layer across every system your company already uses. No migrations. No rip and replace."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {integrationCategories.map(({ icon: Icon, title, logos, more, desc }) => (
              <div
                key={title}
                className="group rounded-2xl border border-white/10 bg-white/[0.04] p-7 transition hover:-translate-y-1 hover:border-violet-400/40 hover:bg-white/[0.07]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-950/60">
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <p className="text-base font-bold tracking-tight text-white">{title}</p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2.5">
                  {logos.map((brand) => (
                    <div
                      key={brand}
                      title={brandLabels[brand]}
                      className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-md shadow-slate-950/40 ring-1 ring-white/10"
                    >
                      <BrandLogo brand={brand} className="h-[22px] w-[22px]" />
                    </div>
                  ))}
                  <span className="flex h-11 items-center rounded-xl border border-dashed border-white/20 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {more}
                  </span>
                </div>

                <p className="mt-6 text-sm leading-relaxed text-slate-400">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent px-8 py-9 sm:grid-cols-3">
            {integrationHighlights.map(({ value, label }) => (
              <div key={label} className="text-center sm:text-left">
                <p className="text-4xl font-black tracking-tight text-white">{value}</p>
                <p className="mt-2 text-sm font-medium text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Pipeline */}
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Under the hood"
            title="The AI Pipeline"
            subtitle="From raw files to answers. Automatically, continuously, and at enterprise scale."
          />

          <div className="mt-16 space-y-5">

            {/* Sources */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 sm:p-8">
              <LayerLabel step="01" title="Sources" note="200+ connectors, always in sync" />
              <div className="mt-6 flex flex-wrap gap-3">
                {sourceLogoWall.map((brand) => (
                  <div
                    key={brand}
                    title={brandLabels[brand]}
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <BrandLogo brand={brand} className="h-6 w-6" />
                  </div>
                ))}
                <span className="flex h-12 items-center rounded-xl border border-dashed border-slate-300 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  + 190 more
                </span>
              </div>
            </div>

            {/* Processing */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
              <LayerLabel step="02" title="Processing" note="Event driven and incremental, no full reindex" />
              <div className="relative mt-7">
                <div className="pointer-events-none absolute left-8 right-8 top-11 hidden h-0.5 bg-gradient-to-r from-violet-200 via-violet-400 to-indigo-300 lg:block" aria-hidden />
                <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
                  {pipelineStages.map(({ icon: Icon, label, note }, i) => (
                    <div
                      key={label}
                      className="relative rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg"
                    >
                      <span className="absolute right-2.5 top-2 text-[10px] font-black text-slate-300">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/25">
                        <Icon size={20} strokeWidth={2} />
                      </div>
                      <p className="mt-3.5 text-sm font-bold tracking-tight text-slate-900">{label}</p>
                      <p className="mt-1 text-[11px] font-medium leading-snug text-slate-500">{note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Intelligence layer */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-violet-950 p-7 shadow-xl shadow-slate-900/25 sm:p-8">
              <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-violet-500/25 blur-3xl" aria-hidden />
              <div className="relative">
                <LayerLabel step="03" title="Intelligence Layer" note="Where context is built and reasoning happens" dark />
                <div className="mt-6 flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-950/60">
                      <Compass size={26} strokeWidth={2.25} />
                    </div>
                    <div>
                      <p className="text-xl font-black tracking-tight text-white">Capifort Intelligence Layer</p>
                      <p className="mt-1 text-sm text-slate-400">One reasoning engine across every connected system</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2.5 lg:ml-auto">
                    {intelligenceCapabilities.map((capability) => (
                      <span
                        key={capability}
                        className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-white"
                      >
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Activation */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 sm:p-8">
              <LayerLabel step="04" title="Activation" note="What your teams actually do with it" />
              <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {pipelineOutputs.map(({ icon: Icon, label, desc }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 ring-1 ring-inset ring-violet-100">
                      <Icon size={18} strokeWidth={2} />
                    </div>
                    <p className="mt-3.5 text-sm font-bold tracking-tight text-slate-900">{label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Everything your team can do */}
      <section className="border-t border-slate-100 bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Capabilities"
            title="Everything your team can do with Capifort"
            subtitle="A single intelligence layer that captures, understands, and acts on everything your company knows."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"
              >
                <IconBadge icon={Icon} />
                <p className="mt-4 text-sm font-bold text-slate-900">{title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for every function */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="Every team" title="Built for every function" />
          <div className="mt-10 flex flex-wrap justify-center gap-3.5">
            {functions.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
              >
                <Icon size={16} strokeWidth={1.9} className="text-violet-600" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How Capifort works */}
      <section className="border-t border-slate-100 bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Onboarding"
            title="How Capifort works"
            subtitle="Live in days, not months, with zero disruption to how your team already works."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map(({ icon: Icon, text }, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <IconBadge icon={Icon} />
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">{i + 1}</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ask anything */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="Search & reasoning" title="Ask anything. Get reliable answers." />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {sampleQuestions.map((q) => (
              <div
                key={q}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"
              >
                <span className="text-3xl font-black leading-none text-violet-200">&ldquo;</span>
                <p className="mt-2 font-medium leading-relaxed">{q}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise ready */}
      <section className="border-t border-slate-100 bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Trust & security"
            title="Enterprise ready. By design."
            subtitle="Security and compliance built in from day one, not bolted on later."
          />
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {enterpriseBadges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm"
              >
                <Icon size={20} strokeWidth={1.9} className="text-violet-600" />
                <span className="text-xs font-semibold text-slate-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 rounded-3xl bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-10 sm:grid-cols-4 sm:p-14">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="bg-gradient-to-br from-violet-600 to-indigo-600 bg-clip-text text-4xl font-black text-transparent sm:text-5xl">{value}</p>
                <p className="mt-2 text-xs font-medium leading-relaxed text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-indigo-700 px-8 py-16 text-center shadow-2xl shadow-violet-900/20 sm:px-16">
          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-black/10 blur-3xl" aria-hidden />
          <h2 className="relative text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Your organization already has the answers.<br />Capifort helps everyone find them.
          </h2>
          <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/login" className="rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-violet-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-violet-50">
              Book a Demo
            </Link>
            <Link href="#" className="rounded-xl border-2 border-white/40 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-6">
            <div className="lg:col-span-2">
              <Logo />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
                The AI-native operating system for enterprise intelligence, work and execution.
              </p>
            </div>
            {footerColumns.map((col) => (
              <div key={col.title}>
                <p className="text-sm font-bold text-slate-900">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}><Link href="#" className="text-sm text-slate-500 hover:text-slate-900">{link}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="text-sm font-bold text-slate-900">Newsletter</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-500">Get insights on AI, knowledge management and enterprise productivity.</p>
              <form className="mt-4 flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none"
                />
                <button type="submit" className="flex-shrink-0 rounded-lg bg-slate-900 px-3.5 py-2.5 text-sm font-bold text-white hover:bg-slate-800">&rarr;</button>
              </form>
            </div>
          </div>
          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-7 sm:flex-row">
            <p className="text-xs text-slate-400">&copy; 2026 Capifort, Inc. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-slate-400">
              <Link href="#" className="hover:text-slate-600">Privacy Policy</Link>
              <Link href="#" className="hover:text-slate-600">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
