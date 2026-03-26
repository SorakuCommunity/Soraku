import type { Metadata, Viewport } from 'next'
import { Providers } from '@/components/providers'
import { TikTokPixel } from '@/components/analytics/TikTokPixel'
import '@/styles/globals.css'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.soraku.id'

export const metadata: Metadata = {
  title: { default: 'Soraku Community', template: '%s — Soraku Community' },
  description: 'Komunitas anime & budaya Jepang non-profit pop Indonesia. Est. 2023.',
  metadataBase: new URL(APP_URL),
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: APP_URL,
    siteName: 'Soraku Community',
    title: 'Soraku Community',
    description: 'Komunitas anime & budaya Jepang non-profit pop Indonesia.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Soraku Community' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@AppSoraa',
    creator: '@AppSoraa',
    title: 'Soraku Community',
    description: 'Komunitas anime & budaya Jepang non-profit pop Indonesia.',
  },
  keywords: ['soraku', 'anime', 'komunitas', 'indonesia', 'budaya jepang', 'vtuber'],
  authors: [{ name: 'Soraku Community', url: APP_URL }],
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#1c1e22' },
    { media: '(prefers-color-scheme: light)', color: '#f4f6f8' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="bg-background font-body min-h-screen antialiased">
        <Providers>{children}</Providers>
        <TikTokPixel />
      </body>
    </html>
  )
}
