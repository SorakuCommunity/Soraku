import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: { default: 'Soraku – Anime & Manga Community', template: '%s | Soraku' },
  description: 'Platform komunitas Anime, Manga, dan Budaya Digital Jepang.',
  keywords: ['anime', 'manga', 'komunitas', 'soraku', 'japan', 'vtuber'],
  openGraph: {
    type: 'website', siteName: 'Soraku',
    title: 'Soraku – Anime & Manga Community',
    description: 'Platform komunitas Anime, Manga, dan Budaya Digital Jepang.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="dark">
      <body className="bg-soraku-dark text-soraku-text min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="bottom-right" theme="dark"
          toastOptions={{ style: { background: '#111827', border: '1px solid #1F2937', color: '#F9FAFB' } }} />
      </body>
    </html>
  )
}
