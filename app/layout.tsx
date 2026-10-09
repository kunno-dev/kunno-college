import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Figtree, Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const figtree = Figtree({ subsets: ['latin'], variable: '--font-figtree' })

export const metadata: Metadata = {
  title: 'Kunno College — Aprende, practica y vende mejor',
  description:
    'La plataforma de aprendizaje del ecosistema Kunno: habilidades comerciales, liderazgo, Real Estate, inversión y product readiness para equipos inmobiliarios.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0E1520',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${figtree.variable} bg-background`}>
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <Toaster position="top-center" richColors={false} toastOptions={{ className: 'font-sans' }} />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
