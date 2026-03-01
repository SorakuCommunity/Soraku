import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from 'sonner'
import { createClient } from '@/lib/supabase/server'
import { loadThemePalette, resolveThemeClass, DEFAULT_PALETTE } from '@/lib/theme'
import type { ThemeMode } from '@/lib/theme'

export const metadata: Metadata = {
  title: { default: 'Soraku – Anime & Manga Community', template: '%s | Soraku' },
  description: 'Platform komunitas Anime, Manga, dan Budaya Digital Jepang.',
  keywords: ['anime', 'manga', 'komunitas', 'soraku', 'japan', 'vtuber'],
  openGraph: {
    type: 'website',
    siteName: 'Soraku',
    title: 'Soraku – Anime & Manga Community',
    description: 'Platform komunitas Anime, Manga, dan Budaya Digital Jepang.',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // ── Server-side theme resolution (no hydration mismatch) ──────────────────
  let palette = DEFAULT_PALETTE
  let siteThemeMode: ThemeMode = 'dark'
  let userThemeMode: ThemeMode | null = null

  try {
    const supabase = await createClient()
    palette = await loadThemePalette(supabase)
    siteThemeMode = palette.theme_mode

    // Check authenticated user preference
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('theme_mode')
        .eq('id', user.id)
        .single()
      if (profile?.theme_mode) {
        userThemeMode = profile.theme_mode as ThemeMode
      }
    }
  } catch {
    // Use defaults on error
  }

  const effectiveMode = resolveThemeClass(userThemeMode, siteThemeMode)

  return (
    <html
      lang="id"
      className={effectiveMode}
      data-theme-mode={userThemeMode ?? siteThemeMode}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen flex flex-col overflow-x-hidden"
        style={{
          backgroundColor: 'var(--bg)',
          color: 'var(--text)',
        }}
      >
        <ThemeProvider initialPalette={palette} initialMode={effectiveMode} />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster
          position="bottom-right"
          theme={effectiveMode}
          toastOptions={{
            style: {
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            },
          }}
        />
      </body>
    </html>
  )
}
