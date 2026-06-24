import type { Metadata, Viewport } from 'next'
import { Providers } from '@/components/providers'
import { TikTokPixel } from '@/components/analytics/TikTokPixel'
import Script from 'next/script'
import '@/styles/globals.css'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.soraku.id'

export const metadata: Metadata = {
  title: { default: 'Soraku', template: '%s | Soraku' },
  description: 'Komunitas anime & budaya Jepang non-profit pop Indonesia. Est. 2023.',
  metadataBase: new URL(APP_URL),
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: APP_URL,
    siteName: 'Soraku',
    title: 'Soraku',
    description: 'Komunitas anime & budaya Jepang non-profit pop Indonesia.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Soraku' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@AppSoraa',
    creator: '@AppSoraa',
    title: 'Soraku',
    description: 'Komunitas anime & budaya Jepang non-profit pop Indonesia.',
  },
  keywords: [
    'soraku', 'anime', 'komunitas', 'indonesia', 'budaya jepang',
    'vtuber', 'belajar', 'berkembang', 'jepang',
    'indonesian anime', 'indonesian pop', 'indonesian culture',
    'indonesian vtuber',     'indonesian anime community',
  ],
  authors: [{ name: 'Soraku', url: APP_URL }],
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
    other: { rel: 'apple-touch-icon', sizes: '180x180', url: '/apple-touch-icon.png' },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0b1120' },
    { media: '(prefers-color-scheme: light)', color: '#0b1120' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-Y5TB7WK9M8" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-Y5TB7WK9M8');
            `,
          }}
        />
        <Script defer src="https://cloud.umami.is/script.js" data-website-id="ba55e75f-b8b7-4f68-807f-77f7073bc23f" />
      </head>
      <body className="bg-background font-body min-h-screen antialiased">
        <Providers>{children}</Providers>
        <TikTokPixel />
      </body>
    </html>
  )
}
