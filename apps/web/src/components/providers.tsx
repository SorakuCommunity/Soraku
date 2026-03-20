"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { MusicPlayerProvider } from "@/context/music-player";
import { PlayerBar } from "@/components/music-player/player-bar";
import { RealtimeProvider } from "@upstash/realtime/client";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <RealtimeProvider>
        <MusicPlayerProvider>
          {children}
          {/* PlayerBar persistent — tampil di semua halaman */}
          <PlayerBar />
        </MusicPlayerProvider>
      </RealtimeProvider>
    </ThemeProvider>
  );
}
