'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause, SkipForward, SkipBack, Music } from 'lucide-react'
import type { SpotifyTrack } from '@/types'
import { formatDuration } from '@/lib/utils'

interface Props {
  tracks: SpotifyTrack[]
  compact?: boolean
}

export function MusicPlayer({ tracks, compact = false }: Props) {
  const [idx, setIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const track = tracks[idx]

  const playAudio = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    try { await audio.play(); setPlaying(true) }
    catch { setPlaying(false) }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !track?.preview_url) return
    const was = playing
    audio.pause()
    audio.src = track.preview_url
    audio.load()
    if (was) playAudio()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => { if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100) }
    const onEnd = () => {
      if (idx < tracks.length - 1) setIdx(i => i + 1)
      else { setPlaying(false); setProgress(0) }
    }
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnd)
    return () => { audio.removeEventListener('timeupdate', onTime); audio.removeEventListener('ended', onEnd) }
  }, [idx, tracks.length])

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio || !track?.preview_url) return
    if (playing) { audio.pause(); setPlaying(false) } else await playAudio()
  }

  if (!tracks.length) {
    return (
      <div className="glass rounded-2xl p-6 text-center">
        <Music className="w-8 h-8 text-soraku-sub mx-auto mb-2 opacity-30" />
        <p className="text-soraku-sub text-xs">Spotify belum dikonfigurasi.</p>
      </div>
    )
  }

  const albumArt = track?.album?.images?.[0]?.url

  /* ── COMPACT MODE (single row for blog header) ── */
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <audio ref={audioRef} preload="none" />
        <button onClick={() => idx > 0 && setIdx(i => i - 1)}
          disabled={idx === 0}
          className="text-soraku-sub hover:text-white disabled:opacity-30 transition-colors">
          <SkipBack className="w-4 h-4" />
        </button>
        <button onClick={toggle}
          className="w-8 h-8 rounded-full bg-soraku-gradient flex items-center justify-center hover:opacity-90 shrink-0">
          {playing ? <Pause className="w-3.5 h-3.5 text-white" /> : <Play className="w-3.5 h-3.5 text-white ml-0.5" />}
        </button>
        <button onClick={() => idx < tracks.length - 1 && setIdx(i => i + 1)}
          disabled={idx === tracks.length - 1}
          className="text-soraku-sub hover:text-white disabled:opacity-30 transition-colors">
          <SkipForward className="w-4 h-4" />
        </button>
        {/* Candle animation when playing */}
        {playing && (
          <div className="flex gap-0.5 items-end ml-1">
            {[3, 5, 4, 6, 3].map((h, i) => (
              <div key={i} className="w-0.5 bg-soraku-primary rounded-full animate-pulse"
                style={{ height: h * 2, animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        )}
        {/* Progress */}
        <div className="flex-1 h-0.5 bg-soraku-muted rounded-full overflow-hidden">
          <div className="h-full bg-soraku-gradient transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>
    )
  }

  /* ── FULL MODE ── */
  return (
    <div className="glass rounded-2xl p-5">
      <audio ref={audioRef} preload="none" />
      <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-soraku-muted">
        {albumArt ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={albumArt} alt={track?.album?.name ?? 'Album'} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music className="w-12 h-12 text-soraku-sub opacity-30" />
          </div>
        )}
        {playing && (
          <div className="absolute bottom-3 right-3 flex gap-0.5 items-end">
            {[3, 5, 4, 6, 3].map((h, i) => (
              <div key={i} className="w-1 bg-soraku-primary rounded-full animate-pulse"
                style={{ height: h * 2, animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        )}
      </div>
      <div className="text-center mb-4">
        <p className="font-semibold text-sm line-clamp-1">{track?.name}</p>
        <p className="text-soraku-sub text-xs mt-0.5">{track?.artists?.map(a => a.name).join(', ')}</p>
      </div>
      <div className="w-full h-1 bg-soraku-muted rounded-full mb-4 overflow-hidden">
        <div className="h-full bg-soraku-gradient transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex items-center justify-center gap-4 mb-4">
        <button onClick={() => idx > 0 && setIdx(i => i - 1)} disabled={idx === 0}
          className="text-soraku-sub hover:text-white disabled:opacity-30 transition-colors">
          <SkipBack className="w-5 h-5" />
        </button>
        <button onClick={toggle}
          className="w-10 h-10 rounded-full bg-soraku-gradient flex items-center justify-center hover:opacity-90 shadow-lg">
          {playing ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
        </button>
        <button onClick={() => idx < tracks.length - 1 && setIdx(i => i + 1)} disabled={idx === tracks.length - 1}
          className="text-soraku-sub hover:text-white disabled:opacity-30 transition-colors">
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
        {tracks.map((t, i) => (
          <button key={t.id} onClick={() => { setIdx(i); setProgress(0); setTimeout(() => playAudio(), 80) }}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition-colors ${
              i === idx ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-white/5 text-soraku-sub'}`}>
            <span className="w-4 text-center shrink-0">{i === idx && playing ? '▶' : i + 1}</span>
            <span className="flex-1 line-clamp-1">{t.name}</span>
            <span className="shrink-0 opacity-60">{formatDuration(t.duration_ms)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
