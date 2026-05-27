export default function NorthLandingPage() {
  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-hidden selection:bg-cyan-400 selection:text-black">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10rem] left-[-10rem] w-[40rem] h-[40rem] bg-cyan-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-[-15rem] right-[-10rem] w-[45rem] h-[45rem] bg-blue-700/20 blur-3xl rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20" />
      </div>

      {/* Navbar */}
      <header className="relative z-50 border-b border-white/10 backdrop-blur-xl bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-700 flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.5)]">
              <span className="text-black font-black text-xl">N</span>
            </div>
            <div>
              <h1 className="font-black text-2xl tracking-tight">North</h1>
              <p className="text-xs text-white/50 tracking-[0.3em] uppercase">
                Intelligence Infrastructure
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-10 text-sm text-white/70">
            <a href="#vision" className="hover:text-white transition">Vision</a>
            <a href="#stack" className="hover:text-white transition">Stack</a>
            <a href="#philosophy" className="hover:text-white transition">Philosophy</a>
            <a href="#future" className="hover:text-white transition">Future</a>
          </nav>

          <button className="px-5 py-3 rounded-2xl bg-white text-black font-semibold hover:scale-105 transition shadow-2xl shadow-white/20">
            Join The Mission
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-24">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 mb-8 backdrop-blur-xl">
              <div className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse" />
              <span className="text-sm text-cyan-100 tracking-wide">
                The Knowledge Operating System For Modern Organizations
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-[0.92] tracking-[-0.06em]">
              Knowledge
              <br />
              becomes
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500">
                {' '}Operational
              </span>
            </h1>

            <p className="mt-10 text-xl text-white/65 leading-relaxed max-w-2xl">
              Most organizations are drowning in disconnected knowledge.
              <br /><br />
              SOPs buried in PDFs.
              Decisions lost in meetings.
              Processes trapped inside people.
              Teams repeating the same questions.
              Critical context disappearing every day.
              <br /><br />
              North transforms scattered organizational knowledge into one continuously evolving intelligence system.
              <br /><br />
              Upload documents. Connect workflows. Capture decisions. Build organizational memory automatically.
              <br /><br />
              North becomes the living brain of your company.
            </p>

            <div className="mt-12 flex flex-wrap gap-5">
              <button className="px-8 py-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 font-bold text-lg text-black hover:scale-[1.03] transition shadow-[0_0_80px_rgba(34,211,238,0.45)]">
                Enter North
              </button>

              <button className="px-8 py-5 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl text-lg hover:bg-white/10 transition">
                Explore Journey
              </button>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-8 max-w-2xl">
              {[
                ['Upload Knowledge', 'PDFs, Docs, SOPs, Calls'],
                ['Connect Context', 'Teams, Workflows, Decisions'],
                ['Build Memory', 'Living Knowledge Graph'],
              ].map(([title, subtitle]) => (
                <div key={title}>
                  <h3 className="font-semibold text-lg">{title}</h3>
                  <p className="text-sm text-white/45 mt-2">{subtitle}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-[140px] rounded-full" />

            <div className="relative rounded-[2.5rem] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-sm text-white/40 uppercase tracking-[0.3em]">North Core</p>
                  <h3 className="text-3xl font-bold mt-2">The Operating System For Organizations</h3>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-cyan-400/20 border border-cyan-300/20 flex items-center justify-center backdrop-blur-xl">
                  <div className="w-6 h-6 rounded-full bg-cyan-300 animate-pulse" />
                </div>
              </div>

              <div className="space-y-5">
                {[
                  ['Unified Knowledge Layer', 'Every document, conversation, and process connected'],
                  ['Organizational Memory', 'Knowledge compounds instead of disappearing'],
                  ['Knowledge Graph', 'Relationships between teams, workflows, and information'],
                  ['AI-Powered Operations', 'Turn information into coordinated execution'],
                  ['Decision Intelligence', 'Capture context behind every organizational decision'],
                ].map(([title, desc]) => (
                  <div
                    key={title}
                    className="group rounded-2xl border border-white/10 bg-black/30 p-5 hover:border-cyan-300/30 hover:bg-cyan-400/5 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-lg">{title}</h4>
                        <p className="text-white/50 mt-2 text-sm leading-relaxed">
                          {desc}
                        </p>
                      </div>

                      <div className="opacity-30 group-hover:opacity-100 transition">
                        ↗
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section id="philosophy" className="relative z-10 border-t border-white/10 py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-cyan-300 uppercase tracking-[0.3em] text-sm mb-6">
              Philosophy
            </p>

            <h2 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-[-0.05em]">
              Every organization deserves a brain.
            </h2>
          </div>

          <div className="mt-20 grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Operational Clarity',
                desc: 'North gives teams one unified place to access organizational knowledge, decisions, workflows, and context without switching across disconnected tools.',
              },
              {
                title: 'Knowledge That Compounds',
                desc: 'Every interaction, document, workflow, and decision strengthens the organizational memory — making the company smarter over time.',
              },
              {
                title: 'Collective Intelligence',
                desc: 'North transforms fragmented information into a continuously evolving knowledge graph that helps teams coordinate, operate, and make better decisions together.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-8 hover:-translate-y-2 transition duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-300/30 to-blue-700/20 border border-white/10 mb-8" />
                <h3 className="text-2xl font-bold mb-5">{item.title}</h3>
                <p className="text-white/55 leading-relaxed text-lg">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack */}
      <section id="stack" className="relative z-10 py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
            <div>
              <p className="text-cyan-300 uppercase tracking-[0.3em] text-sm mb-5">
                Architecture
              </p>
              <h2 className="text-5xl md:text-7xl font-black tracking-[-0.05em] max-w-4xl leading-[0.95]">
                From fragmented information to organizational intelligence.
              </h2>
            </div>

            <p className="text-white/50 max-w-xl text-lg leading-relaxed">
              North simplifies how organizations capture knowledge, retrieve context, onboard teams, coordinate operations, and make decisions — all through one intelligent interface.
            </p>
          </div>

          <div className="mt-20 grid lg:grid-cols-4 md:grid-cols-2 gap-6">
            {[
              'Upload Documents',
              'Extract Organizational Knowledge',
              'Auto-Connect Teams & Context',
              'Build Dynamic Knowledge Graphs',
              'Search Institutional Memory',
              'Coordinate Operational Workflows',
              'Generate AI-Powered Insights',
              'Continuously Evolve Company Intelligence',
            ].map((item) => (
              <div
                key={item}
                className="group relative rounded-[2rem] border border-white/10 bg-black/30 p-8 overflow-hidden hover:border-cyan-400/30 transition"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-cyan-500/10 to-transparent" />
                <div className="relative z-10">
                  <div className="w-3 h-3 rounded-full bg-cyan-300 mb-8" />
                  <h3 className="text-2xl font-semibold leading-snug">
                    {item}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="relative z-10 border-t border-white/10 py-32">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-cyan-300 uppercase tracking-[0.4em] text-sm mb-8">
            Vision
          </p>

          <h2 className="text-6xl md:text-8xl font-black leading-[0.92] tracking-[-0.06em] max-w-5xl mx-auto">
            The next generation of organizations will think collectively.
          </h2>

          <p className="mt-12 text-xl text-white/55 leading-relaxed max-w-4xl mx-auto">
            The future of work is not more dashboards.
            <br /><br />
            It is organizations that can remember, reason, coordinate, and evolve intelligently.
            <br /><br />
            North is building the operating system for organizational knowledge.
          </p>

          <div className="mt-16 flex justify-center">
            <button className="px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-300 to-blue-600 text-black font-black text-lg hover:scale-105 transition shadow-[0_0_80px_rgba(34,211,238,0.4)]">
              Build With North
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-10 bg-black/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-black text-2xl">North</h3>
            <p className="text-white/40 mt-2">
              The Operating System For Organizational Knowledge.
            </p>
          </div>

          <div className="flex items-center gap-10 text-sm text-white/40">
            <span>Observability</span>
            <span>Execution</span>
            <span>Infrastructure</span>
            <span>Intelligence</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
