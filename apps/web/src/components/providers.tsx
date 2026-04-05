'use client'

import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'
import { MusicPlayerProvider } from '@/context/music-player'
import { PlayerBar } from '@/components/music-player/player-bar'

export function Providers({ children }: { children?: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <MusicPlayerProvider>
        {children}
        <PlayerBar />
      </MusicPlayerProvider>
    </ThemeProvider>
  )
}
