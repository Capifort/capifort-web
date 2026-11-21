import { BarChart3 } from 'lucide-react'

export default function ReportsPage() {
  return (
    <div className="min-h-dvh">
      <div className="border-b border-amber-100 bg-amber-50 px-8 py-2 text-center text-xs font-medium text-amber-700">
        Reports is coming soon
      </div>

      <div className="flex flex-col items-center justify-center px-8 py-32 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <BarChart3 size={20} strokeWidth={1.75} className="text-slate-400" />
        </div>
        <h1 className="mt-4 text-lg font-semibold text-slate-900">Reports</h1>
        <p className="mt-1 max-w-sm text-sm text-slate-500">Generate and share audit reports from your investigations.</p>
        <span className="mt-4 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">Coming soon</span>
      </div>
    </div>
  )
}
