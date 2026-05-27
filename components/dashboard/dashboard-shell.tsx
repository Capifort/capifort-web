'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { NavRail } from './nav-rail'
import { SearchModal } from './search-modal'
import { CursorLight } from '@/motion'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="flex min-h-dvh bg-[var(--bg)]">
      <CursorLight size={500} intensity={0.03} />

      <NavRail onSearch={() => setSearchOpen(true)} />

      {/* Workspace — offset by rail width */}
      <main className="flex-1 ml-[52px] min-h-dvh overflow-y-auto overflow-x-hidden">
        {children}
      </main>

      <AnimatePresence>
        {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>
    </div>
  )
}
