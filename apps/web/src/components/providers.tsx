'use client'

import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'
import { MusicPlayerProvider } from '@/context/music-player'
import { PlayerBar } from '@/components/music-player/player-bar'
import { useEffect, useState } from 'react'

// Dynamic import RealtimeProvider agar tidak crash saat prerender
function RealtimeWrapper({ children }: { children: ReactNode }) {
  const [Provider, setProvider] = useState<React.ComponentType<{ children: ReactNode }> | null>(
    null
  )

  useEffect(() => {
    import('@upstash/realtime/client')
      .then((mod) =>
        setProvider(mod.RealtimeProvider as React.ComponentType<{ children: ReactNode }>)
      )
      .catch(() => null)
  }, [])

  if (!Provider) return <>{children}</>
  return <Provider>{children}</Provider>
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <RealtimeWrapper>
        <MusicPlayerProvider>
          {children}
          {/* PlayerBar persistent — tampil di semua halaman */}
          <PlayerBar />
        </MusicPlayerProvider>
      </RealtimeWrapper>
    </ThemeProvider>
  )
}
