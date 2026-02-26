'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause, SkipForward, SkipBack, Music } from 'lucide-react'
import type { SpotifyTrack } from '@/types'
import { formatDuration } from '@/lib/utils'

export function MusicPlayer({ tracks, compact }: { tracks: SpotifyTrack[]; compact?: boolean }) {
  const [idx, setIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const ref = useRef<HTMLAudioElement>(null)
  const track = tracks[idx]

  const play = useCallback(async () => {
    if (!ref.current) return
    try { await ref.current.play(); setPlaying(true) } catch { setPlaying(false) }
  }, [])

  // Load track when index changes
  useEffect(() => {
    if (!ref.current || !track?.preview_url) return
    ref.current.src = track.preview_url
    ref.current.load()
    if (playing) play()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, track?.preview_url])

  useEffect(() => {
    const audio = ref.current
    if (!audio) return

    const update = () => setProgress((audio.currentTime / audio.duration) * 100 || 0)
    const ended = () => {
      if (idx < tracks.length - 1) setIdx(i => i + 1)
      else setPlaying(false)
    }

    audio.addEventListener('timeupdate', update)
    audio.addEventListener('ended', ended)
    return () => {
      audio.removeEventListener('timeupdate', update)
      audio.removeEventListener('ended', ended)
    }
  }, [idx, tracks.length])

  const toggle = async () => {
    if (!ref.current || !track?.preview_url) return
    if (playing) {
      ref.current.pause()
      setPlaying(false)
    } else {
      await play()
    }
  }

  const prev = () => { setIdx(i => Math.max(0, i - 1)); setProgress(0) }
  const next = () => { setIdx(i => Math.min(tracks.length - 1, i + 1)); setProgress(0) }

  if (!tracks.length) return (
    <div className="glass rounded-2xl p-6 text-center">
      <Music className="w-10 h-10 text-soraku-sub mx-auto mb-3 opacity-40" />
      <p className="text-soraku-sub text-sm">Spotify tidak dikonfigurasi.</p>
    </div>
  )

  return (
    <div className="glass rounded-2xl p-5">
      <audio ref={ref} />

      {/* Album art */}
      <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-soraku-muted">
        {track?.album.images[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={track.album.images[0].url}
            alt={track.name}
            className="w-full h-full object-cover"
          />
        )}
        {playing && (
          <div className="absolute bottom-3 right-3 flex gap-0.5 items-end">
            {[3, 5, 4, 6, 3].map((h, i) => (
              <div
                key={i}
                className="w-1 bg-soraku-primary rounded-full animate-pulse"
                style={{ height: h * 2, animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Track info */}
      <div className="text-center mb-4">
        <p className="font-semibold text-sm line-clamp-1">{track?.name}</p>
        <p className="text-soraku-sub text-xs mt-0.5">
          {track?.artists.map(a => a.name).join(', ')}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-soraku-muted rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-soraku-gradient transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={prev}
          disabled={idx === 0}
          className="text-soraku-sub hover:text-soraku-text disabled:opacity-30 transition-colors"
          aria-label="Previous"
        >
          <SkipBack className="w-5 h-5" />
        </button>
        <button
          onClick={toggle}
          className="w-10 h-10 rounded-full bg-soraku-gradient flex items-center justify-center hover:opacity-90 shadow-lg transition-opacity"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing
            ? <Pause className="w-5 h-5 text-white" />
            : <Play className="w-5 h-5 text-white ml-0.5" />
          }
        </button>
        <button
          onClick={next}
          disabled={idx === tracks.length - 1}
          className="text-soraku-sub hover:text-soraku-text disabled:opacity-30 transition-colors"
          aria-label="Next"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Track list */}
      <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
        {tracks.map((t, i) => (
          <button
            key={t.id}
            onClick={() => {
              setIdx(i)
              setProgress(0)
              setTimeout(() => play(), 50)
            }}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition-colors ${
              i === idx
                ? 'bg-purple-500/20 text-purple-300'
                : 'hover:bg-white/5 text-soraku-sub'
            }`}
          >
            <span className="w-4 text-center shrink-0">
              {i === idx && playing ? '▶' : i + 1}
            </span>
            <span className="flex-1 line-clamp-1">{t.name}</span>
            <span className="shrink-0">{formatDuration(t.duration_ms)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
