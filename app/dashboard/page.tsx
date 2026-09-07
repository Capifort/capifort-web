'use client'

import { useState } from 'react'
import {
  Paperclip, ArrowUp, ChevronDown, Plus, FileText, ChevronRight,
} from 'lucide-react'

const selectedDocuments = [
  { name: 'Annual 2025', color: 'bg-amber-50 text-amber-600' },
  { name: 'Q4 Financials', color: 'bg-sky-50 text-sky-600' },
  { name: 'Investor Deck', color: 'bg-slate-100 text-slate-500' },
]

const recentInvestigations = [
  {
    status: 'Completed',
    dotColor: 'bg-emerald-500',
    time: '2h ago',
    title: 'Revenue decline — FY2025',
    meta: '3 documents · 7 key findings',
  },
  {
    status: 'In progress',
    dotColor: 'bg-sky-500',
    time: '12 min',
    title: 'Margin analysis',
    meta: '4 documents · 3 findings so far',
  },
  {
    status: 'Draft',
    dotColor: 'bg-slate-300',
    time: '',
    title: 'Customer concentration risk',
    meta: '2 documents',
  },
]

export default function DashboardPage() {
  const [query, setQuery] = useState('Why did revenue decline in FY2025?')

  return (
    <div className="flex min-h-full flex-col px-10 py-8 lg:px-16">
      <div className="flex flex-1 flex-col items-center justify-center py-16">
        <div
          className="mb-8 h-28 w-28 rounded-full shadow-[0_30px_60px_-15px_rgba(15,23,42,0.35)]"
          style={{ background: 'radial-gradient(circle at 34% 30%, #52525b, #09090b 68%)' }}
        />

        <h1 className="text-center font-serif text-4xl text-slate-900 sm:text-5xl">
          What do you want to uncover?
        </h1>
        <p className="mt-4 text-xs tracking-[0.3em] text-slate-400">
          YOUR DOCUMENTS. A DEEPER TRUTH.
        </p>

        <div className="mt-10 flex w-full max-w-2xl items-center gap-3 rounded-full border border-slate-200 bg-white py-3 pl-6 pr-3 shadow-sm">
          <Paperclip size={16} strokeWidth={1.75} className="flex-shrink-0 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Why did revenue decline in FY2025?"
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            aria-label="Submit question"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-slate-800"
          >
            <ArrowUp size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
          <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-600 hover:border-slate-300">
            <FileText size={14} strokeWidth={1.75} className="text-slate-400" />
            {selectedDocuments.length} documents selected
            <ChevronDown size={13} strokeWidth={1.75} className="text-slate-400" />
          </button>

          {selectedDocuments.map((doc) => (
            <div
              key={doc.name}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-2 pl-2 pr-4"
            >
              <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${doc.color}`}>
                <FileText size={13} strokeWidth={1.75} />
              </div>
              <span className="text-xs text-slate-700">{doc.name}</span>
            </div>
          ))}

          <button
            aria-label="Add document"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-600"
          >
            <Plus size={15} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_260px]">
          <div>
            <h2 className="mb-4 text-sm font-medium text-slate-900">Recent investigations</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {recentInvestigations.map((item) => (
                <button
                  key={item.title}
                  className="group rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-slate-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className={`h-1.5 w-1.5 rounded-full ${item.dotColor}`} />
                      {item.status}
                      {item.time && <span className="text-slate-400">· {item.time}</span>}
                    </span>
                    <ChevronRight size={14} strokeWidth={1.75} className="text-slate-300 group-hover:text-slate-500" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-900">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.meta}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="border-slate-200 pt-1 lg:border-l lg:pl-8 lg:pt-0">
            <p className="font-serif text-lg leading-relaxed text-slate-800">
              &ldquo;Better questions create a more certain tomorrow.&rdquo;
            </p>
            <p className="mt-3 text-xs tracking-[0.2em] text-slate-400">— CAPIFORT</p>
          </div>
        </div>
      </div>
    </div>
  )
}
