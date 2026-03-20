"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  Settings, SkipForward, Loader2, AlertCircle, ChevronsRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDuration } from "@/lib/utils"
import { updateProgress } from "@/lib/continue-watching"

interface StreamSource { url: string; quality: string; isM3U8: boolean }
interface Subtitle { url: string; lang: string }

interface Props {
  src:       string
  sources?:  StreamSource[]
  subtitles?: Subtitle[]
  poster?:   string | null
  title?:    string
  intro?:    { start: number; end: number } | null
  outro?:    { start: number; end: number } | null
  onEnded?:  () => void
  onTimeUpdate?: (t: number) => void
  // Watch party sync
  syncTime?:  number | null
  syncPaused?: boolean | null
  onPlayPause?: (paused: boolean) => void
  onSeek?: (t: number) => void
  // Continue watching
  animeId?:     string
  animeTitle?:  string
  animeCover?:  string | null
  episodeId?:   string
  episodeNum?:  number
  episodeTitle?:string | null
  source?:      string
}

export function VideoPlayer({
  src, sources = [], subtitles = [], poster, title, intro, outro,
  onEnded, onTimeUpdate, syncTime, syncPaused, onPlayPause, onSeek,
  animeId, animeTitle, animeCover, episodeId, episodeNum, episodeTitle, source,
}: Props) {
  const videoRef    = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hlsRef      = useRef<any>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const saveTimer   = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const [playing,     setPlaying]     = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration,    setDuration]    = useState(0)
  const [buffered,    setBuffered]    = useState(0)
  const [volume,      setVolume]      = useState(1)
  const [muted,       setMuted]       = useState(false)
  const [fullscreen,  setFullscreen]  = useState(false)
  const [showCtrl,    setShowCtrl]    = useState(true)
  const [quality,     setQuality]     = useState("auto")
  const [levels,      setLevels]      = useState<string[]>([])
  const [showQMenu,   setShowQMenu]   = useState(false)
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState<string | null>(null)
  const [showSkipIntro, setShowSkipIntro] = useState(false)
  const [showSkipOutro, setShowSkipOutro] = useState(false)

  // ── Init HLS ─────────────────────────────────────────────────
  useEffect(() => {
    if (!src || !videoRef.current) return
    setError(null); setLoading(true)

    const init = async () => {
      const Hls = (await import("hls.js")).default
      const video = videoRef.current!
      if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null }

      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true, lowLatencyMode: false })
        hlsRef.current = hls
        hls.loadSource(src)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, (_: any, data: any) => {
          setLoading(false)
          setLevels(["auto", ...data.levels.map((l: any) => `${l.height}p`)])
        })
        hls.on(Hls.Events.ERROR, (_: any, data: any) => {
          if (data.fatal) setError("Stream gagal. Coba source lain.")
          setLoading(false)
        })
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src; setLoading(false)
      } else {
        setError("Browser tidak mendukung streaming."); setLoading(false)
      }
    }
    init()
    return () => { if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null } }
  }, [src])

  // ── Video events ─────────────────────────────────────────────
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onPlay     = () => setPlaying(true)
    const onPause    = () => setPlaying(false)
    const onDuration = () => setDuration(v.duration)
    const onWaiting  = () => setLoading(true)
    const onCanPlay  = () => setLoading(false)
    const onEnd      = () => { setPlaying(false); onEnded?.() }
    const onTime     = () => {
      const t = v.currentTime
      setCurrentTime(t)
      onTimeUpdate?.(t)
      if (v.buffered.length > 0) setBuffered(v.buffered.end(v.buffered.length - 1))
      // Skip intro/outro visibility
      setShowSkipIntro(!!(intro && t >= intro.start && t <= intro.end))
      setShowSkipOutro(!!(outro && t >= outro.start && t <= outro.end))
      // Save progress (debounced)
      clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        if (animeId && animeTitle && episodeId) {
          updateProgress({
            animeId, animeTitle, animeCover: animeCover ?? null,
            episodeId, episodeNum: episodeNum ?? 0,
            episodeTitle: episodeTitle ?? null,
            source: source ?? "hianime",
            progress: t, duration: v.duration || 0,
          })
        }
      }, 2000)
    }
    v.addEventListener("play",            onPlay)
    v.addEventListener("pause",           onPause)
    v.addEventListener("durationchange",  onDuration)
    v.addEventListener("waiting",         onWaiting)
    v.addEventListener("canplay",         onCanPlay)
    v.addEventListener("ended",           onEnd)
    v.addEventListener("timeupdate",      onTime)
    return () => {
      v.removeEventListener("play",           onPlay)
      v.removeEventListener("pause",          onPause)
      v.removeEventListener("durationchange", onDuration)
      v.removeEventListener("waiting",        onWaiting)
      v.removeEventListener("canplay",        onCanPlay)
      v.removeEventListener("ended",          onEnd)
      v.removeEventListener("timeupdate",     onTime)
    }
  }, [intro, outro, onEnded, onTimeUpdate, animeId, animeTitle, animeCover, episodeId, episodeNum, episodeTitle, source])

  // ── Watch party sync ─────────────────────────────────────────
  useEffect(() => {
    const v = videoRef.current; if (!v || syncTime === null || syncTime === undefined) return
    if (Math.abs(v.currentTime - syncTime) > 2) v.currentTime = syncTime
  }, [syncTime])

  useEffect(() => {
    const v = videoRef.current; if (!v || syncPaused === null || syncPaused === undefined) return
    if (syncPaused && !v.paused) v.pause()
    else if (!syncPaused && v.paused) v.play().catch(() => {})
  }, [syncPaused])

  const togglePlay = useCallback(() => {
    const v = videoRef.current; if (!v) return
    if (v.paused) { v.play().catch(() => {}); onPlayPause?.(false) }
    else { v.pause(); onPlayPause?.(true) }
  }, [onPlayPause])

  const seek = useCallback((t: number) => {
    const v = videoRef.current; if (!v) return
    v.currentTime = t; setCurrentTime(t); onSeek?.(t)
  }, [onSeek])

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    seek(((e.clientX - rect.left) / rect.width) * duration)
  }

  const showControls = () => {
    setShowCtrl(true)
    clearTimeout(controlsTimer.current)
    controlsTimer.current = setTimeout(() => { if (playing) setShowCtrl(false) }, 3000)
  }

  const toggleFullscreen = () => {
    const el = containerRef.current; if (!el) return
    if (!document.fullscreenElement) { el.requestFullscreen(); setFullscreen(true) }
    else { document.exitFullscreen(); setFullscreen(false) }
  }

  const setQualityLevel = (q: string) => {
    if (!hlsRef.current) return
    hlsRef.current.currentLevel = q === "auto" ? -1 : levels.indexOf(q) - 1
    setQuality(q); setShowQMenu(false)
  }

  const pct  = duration ? (currentTime / duration) * 100 : 0
  const bPct = duration ? (buffered / duration) * 100 : 0

  return (
    <div ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl bg-black group select-none"
      style={{ aspectRatio: "16/9" }}
      onMouseMove={showControls}
      onMouseLeave={() => playing && setShowCtrl(false)}
      onDoubleClick={toggleFullscreen}
      onClick={togglePlay}>

      <video ref={videoRef} poster={poster ?? undefined}
        className="h-full w-full" playsInline preload="metadata" />

      {/* Loading */}
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
          <Loader2 className="h-9 w-9 animate-spin text-indigo-400" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 text-center px-6 pointer-events-none">
          <AlertCircle className="h-10 w-10 text-red-400" />
          <p className="text-sm text-zinc-300">{error}</p>
        </div>
      )}

      {/* Big play */}
      {!playing && !loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-16 w-16 flex items-center justify-center rounded-full bg-indigo-500/80 shadow-xl shadow-indigo-500/30">
            <Play className="h-8 w-8 text-white fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Skip Intro */}
      {showSkipIntro && (
        <button onClick={e => { e.stopPropagation(); seek(intro!.end) }}
          className="skip-btn absolute bottom-16 right-4 flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/70 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 z-10">
          <ChevronsRight className="h-4 w-4" /> Skip Intro
        </button>
      )}

      {/* Skip Outro */}
      {showSkipOutro && (
        <button onClick={e => { e.stopPropagation(); onEnded?.() }}
          className="skip-btn absolute bottom-16 right-4 flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/70 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 z-10">
          <ChevronsRight className="h-4 w-4" /> Episode Berikutnya
        </button>
      )}

      {/* Controls */}
      <div className={cn(
        "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent px-4 pb-3 pt-12 transition-opacity duration-300 pointer-events-none",
        showCtrl || !playing ? "opacity-100 pointer-events-auto" : "opacity-0"
      )} onClick={e => e.stopPropagation()}>

        {title && <p className="mb-2 text-xs font-medium text-white/60 truncate">{title}</p>}

        {/* Progress */}
        <div ref={progressRef} className="relative mb-3 h-1 cursor-pointer group/progress"
          onClick={handleProgressClick}>
          <div className="absolute inset-0 rounded-full bg-white/10" />
          <div className="absolute inset-y-0 left-0 rounded-full bg-white/20" style={{ width: `${bPct}%` }} />
          <div className="absolute inset-y-0 left-0 rounded-full bg-indigo-400" style={{ width: `${pct}%` }} />
          <div className="absolute top-1/2 -translate-y-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-white shadow opacity-0 group-hover/progress:opacity-100 transition-opacity"
            style={{ left: `${pct}%` }} />
        </div>

        <div className="flex items-center gap-3">
          <button onClick={togglePlay} className="text-white/80 hover:text-white transition-colors">
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
          </button>
          <button onClick={() => seek(currentTime + 10)} className="text-white/60 hover:text-white transition-colors">
            <SkipForward className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5 group/vol">
            <button onClick={() => { const v = videoRef.current; if (v) { v.muted = !v.muted; setMuted(v.muted) } }}
              className="text-white/60 hover:text-white transition-colors">
              {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <input type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume}
              onChange={e => { const v = Number(e.target.value); videoRef.current && (videoRef.current.volume = v); setVolume(v); setMuted(v === 0) }}
              className="hidden group-hover/vol:block w-14 accent-indigo-400 cursor-pointer h-0.5" />
          </div>
          <span className="text-[11px] text-white/50 tabular-nums font-mono">
            {formatDuration(Math.floor(currentTime))} / {formatDuration(Math.floor(duration))}
          </span>

          <div className="ml-auto flex items-center gap-2">
            {levels.length > 1 && (
              <div className="relative">
                <button onClick={() => setShowQMenu(!showQMenu)}
                  className="flex items-center gap-1 text-[11px] text-white/60 hover:text-white transition-colors">
                  <Settings className="h-3.5 w-3.5" /> {quality}
                </button>
                {showQMenu && (
                  <div className="absolute bottom-7 right-0 rounded-lg border border-white/[.08] bg-zinc-900/95 p-1 min-w-[90px] shadow-xl z-10">
                    {levels.map((q: string) => (
                      <button key={q} onClick={() => setQualityLevel(q)}
                        className={cn("block w-full rounded px-3 py-1.5 text-left text-xs transition-colors",
                          quality === q ? "bg-indigo-500/20 text-indigo-300" : "text-zinc-400 hover:text-white hover:bg-white/[.05]")}>
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <button onClick={toggleFullscreen} className="text-white/60 hover:text-white transition-colors">
              {fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


