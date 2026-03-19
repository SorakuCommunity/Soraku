"use client";

import { useMusicPlayer } from "@/context/music-player";
import { Play, Pause, SkipForward, Volume2, VolumeX, X, Music2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

function formatTime(sec: number) {
  if (!sec || isNaN(sec)) return "0:00";
  return `${Math.floor(sec / 60)}:${Math.floor(sec % 60).toString().padStart(2, "0")}`;
}

export function PlayerBar() {
  const {
    playlist, currentIndex, isPlaying, isVisible,
    currentTime, duration,
    togglePlay, next, hidePlayer, setVolume, volume, isMuted, toggleMute, seek,
  } = useMusicPlayer();
  const [expanded, setExpanded] = useState(false);

  if (!isVisible) return null;
  const track = playlist[currentIndex];
  if (!track) return null;

  const pct = duration ? (currentTime / duration) * 100 : 0;

  /* ── Mini pill (default) ─────────────────────────────────────────────── */
  if (!expanded) {
    return (
      <div className="fixed bottom-5 right-5 z-50">
        <div className="flex items-center gap-2 rounded-full border border-primary/25 bg-background/90 px-3 py-2 shadow-lg shadow-black/20 backdrop-blur-xl">
          {/* Playing indicator / cover */}
          <button onClick={() => setExpanded(true)}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary hover:bg-primary/25 transition-colors text-base">
            {isPlaying
              ? <span className="flex gap-px">{[0,80,160].map(d=>(
                  <span key={d} className="inline-block h-3 w-0.5 rounded-full bg-primary animate-bounce" style={{animationDelay:`${d}ms`}}/>
                ))}</span>
              : <Music2 className="h-3.5 w-3.5" />
            }
          </button>

          {/* Title */}
          <button onClick={() => setExpanded(true)}
            className="max-w-[100px] text-left">
            <p className="text-xs font-semibold truncate leading-tight">{track.title}</p>
          </button>

          {/* Controls */}
          <button onClick={togglePlay}
            className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors">
            {isPlaying ? <Pause className="h-3 w-3" fill="currentColor" /> : <Play className="h-3 w-3" fill="currentColor" />}
          </button>
          <button onClick={next}
            className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors">
            <SkipForward className="h-3 w-3" />
          </button>
          <button onClick={hidePlayer}
            className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground/50 hover:text-muted-foreground transition-colors">
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  }

  /* ── Expanded card ───────────────────────────────────────────────────── */
  return (
    <div className="fixed bottom-5 right-5 z-50 w-72">
      <div className="rounded-2xl border border-border/60 bg-background/95 shadow-2xl backdrop-blur-xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <Music2 className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold">Soraku Radio</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setExpanded(false)}
              className="rounded-lg px-2 py-1 text-[10px] text-muted-foreground/50 hover:text-muted-foreground transition-colors">
              Perkecil
            </button>
            <button onClick={hidePlayer}
              className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground/40 hover:text-destructive transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Track info */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-border/50 bg-primary/8 text-xl">
              {track.cover}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">{track.title}</p>
              <p className="text-[11px] text-muted-foreground/60 truncate">
                {track.artist}{track.anime && <span className="text-primary/60"> · {track.anime}</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="px-4 pb-2">
          <div onClick={(e) => {
            if (!duration) return;
            const rect = e.currentTarget.getBoundingClientRect();
            seek(((e.clientX - rect.left) / rect.width) * duration);
          }} className="relative h-1 cursor-pointer rounded-full bg-border/60 overflow-hidden hover:h-1.5 transition-all">
            <div className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all"
              style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground/40 tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-4 pb-3">
          <button onClick={toggleMute}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors">
            {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <div className="flex items-center gap-2">
            <button onClick={togglePlay}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-md shadow-primary/30 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
              {isPlaying ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="h-4 w-4" fill="currentColor" />}
            </button>
            <button onClick={next}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors hover:bg-primary/8">
              <SkipForward className="h-4 w-4" />
            </button>
          </div>

          <input type="range" min={0} max={1} step={0.05}
            value={isMuted ? 0 : volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="w-16 h-1 cursor-pointer accent-primary" />
        </div>
      </div>
    </div>
  );
}
