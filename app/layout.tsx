import type { Metadata, Viewport } from 'next'
import { Manrope, IBM_Plex_Mono } from 'next/font/google'
import { SmoothScrollProvider } from '@/providers/smooth-scroll'
import { AppAuthProvider } from '@/providers/auth-provider'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: {
    default: 'North — Operational Intelligence',
    template: '%s — North',
  },
  description: 'Direction for intelligent systems.',
  metadataBase: new URL('https://north.so'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'North — Operational Intelligence',
    description: 'Direction for intelligent systems.',
    siteName: 'North',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'North — Operational Intelligence',
    description: 'Direction for intelligent systems.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#060606',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <AppAuthProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </AppAuthProvider>
      </body>
    </html>
  )
}
