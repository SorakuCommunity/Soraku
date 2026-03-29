'use client'

import { useMusicPlayer } from '@/context/music-player'
import { Play, Pause, SkipForward, Volume2, VolumeX, X, Music2 } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

function formatTime(sec: number) {
  if (!sec || isNaN(sec)) return '0:00'
  return `${Math.floor(sec / 60)}:${Math.floor(sec % 60)
    .toString()
    .padStart(2, '0')}`
}

export function PlayerBar() {
  const {
    playlist,
    currentIndex,
    isPlaying,
    isVisible,
    currentTime,
    duration,
    togglePlay,
    next,
    hidePlayer,
    setVolume,
    volume,
    isMuted,
    toggleMute,
    seek,
  } = useMusicPlayer()
  const [expanded, setExpanded] = useState(false)

  if (!isVisible) return null
  const track = playlist[currentIndex]
  if (!track) return null

  const pct = duration ? (currentTime / duration) * 100 : 0

  /* ── Mini pill (default) ─────────────────────────────────────────────── */
  if (!expanded) {
    return (
      <div className="fixed right-5 bottom-5 z-50">
        <div className="border-primary/25 bg-background/90 flex items-center gap-2 rounded-full border px-3 py-2 shadow-lg shadow-black/20 backdrop-blur-xl">
          {/* Playing indicator / cover */}
          <button
            onClick={() => setExpanded(true)}
            className="bg-primary/15 text-primary hover:bg-primary/25 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-base transition-colors"
          >
            {isPlaying ? (
              <span className="flex gap-px">
                {[0, 80, 160].map((d) => (
                  <span
                    key={d}
                    className="bg-primary inline-block h-3 w-0.5 animate-bounce rounded-full"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </span>
            ) : (
              <Music2 className="h-3.5 w-3.5" />
            )}
          </button>

          {/* Title */}
          <button onClick={() => setExpanded(true)} className="max-w-[100px] text-left">
            <p className="truncate text-xs leading-tight font-semibold">{track.title}</p>
          </button>

          {/* Controls */}
          <button
            onClick={togglePlay}
            className="text-muted-foreground hover:text-foreground flex h-6 w-6 items-center justify-center rounded-full transition-colors"
          >
            {isPlaying ? (
              <Pause className="h-3 w-3" fill="currentColor" />
            ) : (
              <Play className="h-3 w-3" fill="currentColor" />
            )}
          </button>
          <button
            onClick={next}
            className="text-muted-foreground hover:text-foreground flex h-6 w-6 items-center justify-center rounded-full transition-colors"
          >
            <SkipForward className="h-3 w-3" />
          </button>
          <button
            onClick={hidePlayer}
            className="text-muted-foreground/50 hover:text-muted-foreground flex h-6 w-6 items-center justify-center rounded-full transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    )
  }

  /* ── Expanded card ───────────────────────────────────────────────────── */
  return (
    <div className="fixed right-5 bottom-5 z-50 w-72">
      <div className="border-border/60 bg-background/95 overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <Music2 className="text-primary h-3.5 w-3.5" />
            <span className="text-xs font-bold">Soraku Radio</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setExpanded(false)}
              className="text-muted-foreground/50 hover:text-muted-foreground rounded-lg px-2 py-1 text-[10px] transition-colors"
            >
              Perkecil
            </button>
            <button
              onClick={hidePlayer}
              className="text-muted-foreground/40 hover:text-destructive flex h-6 w-6 items-center justify-center rounded-lg transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Track info */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="border-border/50 bg-primary/8 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border text-xl">
              {track.cover}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{track.title}</p>
              <p className="text-muted-foreground/60 truncate text-[11px]">
                {track.artist}
                {track.anime && <span className="text-primary/60"> · {track.anime}</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="px-4 pb-2">
          <div
            onClick={(e) => {
              if (!duration) return
              const rect = e.currentTarget.getBoundingClientRect()
              seek(((e.clientX - rect.left) / rect.width) * duration)
            }}
            className="bg-border/60 relative h-1 cursor-pointer overflow-hidden rounded-full transition-all hover:h-1.5"
          >
            <div
              className="bg-primary absolute top-0 left-0 h-full rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="text-muted-foreground/40 mt-1 flex justify-between text-[10px] tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-4 pb-3">
          <button
            onClick={toggleMute}
            className="text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="bg-primary shadow-primary/30 hover:bg-primary/90 flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md transition-all hover:scale-105 active:scale-95"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" fill="currentColor" />
              ) : (
                <Play className="h-4 w-4" fill="currentColor" />
              )}
            </button>
            <button
              onClick={next}
              className="text-muted-foreground hover:text-foreground hover:bg-primary/8 flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
            >
              <SkipForward className="h-4 w-4" />
            </button>
          </div>

          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="accent-primary h-1 w-16 cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}
