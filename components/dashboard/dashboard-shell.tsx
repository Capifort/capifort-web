'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { NavRail } from './nav-rail'
import { SearchModal } from './search-modal'
import { CursorLight } from '@/motion'
import { useTheme } from '@/context/theme-context'
import { cn } from '@/lib/cn'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const { theme } = useTheme()

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

  // Sync html/body bg with dashboard theme to prevent dark overscroll bleed
  useEffect(() => {
    const bg = theme === 'light' ? '#f8f7f4' : '#060606'
    document.documentElement.style.backgroundColor = bg
    document.body.style.backgroundColor = bg
    return () => {
      document.documentElement.style.backgroundColor = ''
      document.body.style.backgroundColor = ''
    }
  }, [theme])

  return (
    <div className={cn('flex min-h-dvh bg-[var(--bg)] dashboard-main', theme === 'light' && 'light')}>
      <CursorLight size={500} intensity={0.03} />

      <NavRail onSearch={() => setSearchOpen(true)} />

      <main className="flex-1 ml-60 min-h-dvh overflow-y-auto overflow-x-hidden">
        {children}
      </main>

      <AnimatePresence>
        {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>
    </div>
  )
}
