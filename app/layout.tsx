import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AppAuthProvider } from '@/providers/auth-provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Capifort — AI Operating System for Enterprise Intelligence',
    template: '%s — Capifort',
  },
  description: 'Capifort connects every source of your organizational knowledge and helps your team search, reason, automate, and execute with confidence.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased text-slate-900 bg-white">
        <AppAuthProvider>{children}</AppAuthProvider>
      </body>
    </html>
  )
}
