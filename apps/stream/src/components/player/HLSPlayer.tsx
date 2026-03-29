"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  Settings, SkipForward, Loader2, AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDuration } from "@/lib/utils"

interface HLSPlayerProps {
  src: string
  poster?: string | null
  title?: string
  onEnded?: () => void
  onTimeUpdate?: (time: number) => void
  syncTime?: number | null         // Watch party: external time to sync to
  isPaused?: boolean | null        // Watch party: external pause state
  onPlayPause?: (paused: boolean) => void
  onSeek?: (time: number) => void
}

export function HLSPlayer({
  src, poster, title, onEnded,
  onTimeUpdate, syncTime, isPaused,
  onPlayPause, onSeek,
}: HLSPlayerProps) {
  const videoRef   = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hlsRef     = useRef<any>(null)
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const [playing,    setPlaying]    = useState(false)
  const [currentTime,setCurrentTime]= useState(0)
  const [duration,   setDuration]   = useState(0)
  const [buffered,   setBuffered]   = useState(0)
  const [volume,     setVolume]     = useState(1)
  const [muted,      setMuted]      = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [showControls,setShowControls] = useState(true)
  const [quality,    setQuality]    = useState("auto")
  const [levels,     setLevels]     = useState<string[]>([])
  const [showQuality,setShowQuality]= useState(false)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)

  // Init HLS
  useEffect(() => {
    if (!src || !videoRef.current) return
    setError(null); setLoading(true)

    const init = async () => {
      const Hls = (await import("hls.js")).default
      const video = videoRef.current!

      if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null }

      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90,
        })
        hlsRef.current = hls
        hls.loadSource(src)
        hls.attachMedia(video)

        hls.on(Hls.Events.MANIFEST_PARSED, (_: any, data: any) => {
          setLoading(false)
          setLevels(["auto", ...data.levels.map((l: any) => `${l.height}p`)])
        })

        hls.on(Hls.Events.ERROR, (_: any, data: any) => {
          if (data.fatal) setError("Stream gagal dimuat. Coba source lain.")
          setLoading(false)
        })
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari native HLS
        video.src = src
        setLoading(false)
      } else {
        setError("Browser tidak mendukung HLS streaming.")
        setLoading(false)
      }
    }

    init()
    return () => { if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null } }
  }, [src])

  // Watch party sync
  useEffect(() => {
    const video = videoRef.current
    if (!video || syncTime === null || syncTime === undefined) return
    const diff = Math.abs(video.currentTime - syncTime)
    if (diff > 2) video.currentTime = syncTime
  }, [syncTime])

  useEffect(() => {
    const video = videoRef.current
    if (!video || isPaused === null || isPaused === undefined) return
    if (isPaused && !video.paused) video.pause()
    if (!isPaused && video.paused) video.play().catch(() => {})
  }, [isPaused])

  // Video events
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onPlay     = () => setPlaying(true)
    const onPause    = () => setPlaying(false)
    const onTime     = () => {
      setCurrentTime(video.currentTime)
      onTimeUpdate?.(video.currentTime)
      if (video.buffered.length > 0) setBuffered(video.buffered.end(video.buffered.length - 1))
    }
    const onDuration = () => setDuration(video.duration)
    const onWaiting  = () => setLoading(true)
    const onCanPlay  = () => setLoading(false)
    const onEnd      = () => { setPlaying(false); onEnded?.() }

    video.addEventListener("play",         onPlay)
    video.addEventListener("pause",        onPause)
    video.addEventListener("timeupdate",   onTime)
    video.addEventListener("durationchange", onDuration)
    video.addEventListener("waiting",      onWaiting)
    video.addEventListener("canplay",      onCanPlay)
    video.addEventListener("ended",        onEnd)

    return () => {
      video.removeEventListener("play",           onPlay)
      video.removeEventListener("pause",          onPause)
      video.removeEventListener("timeupdate",     onTime)
      video.removeEventListener("durationchange", onDuration)
      video.removeEventListener("waiting",        onWaiting)
      video.removeEventListener("canplay",        onCanPlay)
      video.removeEventListener("ended",          onEnd)
    }
  }, [onEnded, onTimeUpdate])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) { video.play().catch(() => {}); onPlayPause?.(false) }
    else { video.pause(); onPlayPause?.(true) }
  }, [onPlayPause])

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const t = Number(e.target.value)
    if (videoRef.current) videoRef.current.currentTime = t
    setCurrentTime(t)
    onSeek?.(t)
  }, [onSeek])

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value)
    if (videoRef.current) { videoRef.current.volume = v; videoRef.current.muted = v === 0 }
    setVolume(v); setMuted(v === 0)
  }

  const toggleFullscreen = () => {
    const el = containerRef.current
    if (!el) return
    if (!document.fullscreenElement) { el.requestFullscreen(); setFullscreen(true) }
    else { document.exitFullscreen(); setFullscreen(false) }
  }

  const setQualityLevel = (q: string) => {
    if (!hlsRef.current) return
    if (q === "auto") hlsRef.current.currentLevel = -1
    else {
      const idx = levels.indexOf(q) - 1
      if (idx >= 0) hlsRef.current.currentLevel = idx
    }
    setQuality(q); setShowQuality(false)
  }

  const showCtrl = () => {
    setShowControls(true)
    clearTimeout(controlsTimer.current)
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000)
  }

  const progressPercent = duration ? (currentTime / duration) * 100 : 0
  const bufferedPercent  = duration ? (buffered / duration) * 100 : 0

  return (
    <div
      ref={containerRef}
      className="video-container relative w-full overflow-hidden rounded-2xl bg-black group"
      style={{ aspectRatio: "16/9" }}
      onMouseMove={showCtrl}
      onMouseLeave={() => playing && setShowControls(false)}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        poster={poster ?? undefined}
        className="h-full w-full object-contain"
        playsInline
        preload="metadata"
      />

      {/* Loading spinner */}
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 text-center px-6">
          <AlertCircle className="h-10 w-10 text-red-400" />
          <p className="text-sm text-white/80">{error}</p>
        </div>
      )}

      {/* Big play button (center) */}
      {!playing && !loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/80 shadow-2xl shadow-primary/40">
            <Play className="h-8 w-8 text-white fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Controls overlay */}
      <div className={cn(
        "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-4 pt-16 pb-3 transition-opacity duration-300",
        showControls || !playing ? "opacity-100" : "opacity-0 pointer-events-none"
      )} onClick={e => e.stopPropagation()}>

        {/* Title */}
        {title && <p className="mb-2 text-xs font-semibold text-white/70 truncate">{title}</p>}

        {/* Progress bar */}
        <div className="relative mb-3 h-1 group/progress cursor-pointer" onClick={e => {
          const rect = e.currentTarget.getBoundingClientRect()
          const ratio = (e.clientX - rect.left) / rect.width
          const t = ratio * duration
          if (videoRef.current) videoRef.current.currentTime = t
          setCurrentTime(t); onSeek?.(t)
        }}>
          <div className="absolute inset-0 rounded-full bg-white/20" />
          <div className="absolute inset-y-0 left-0 rounded-full bg-white/30" style={{ width: `${bufferedPercent}%` }} />
          <div className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${progressPercent}%` }} />
          <input type="range" min={0} max={duration || 100} value={currentTime}
            onChange={handleSeek} className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          {/* Thumb */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-primary opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-lg"
            style={{ left: `${progressPercent}%` }} />
        </div>

        {/* Bottom controls */}
        <div className="flex items-center gap-3">
          {/* Play/Pause */}
          <button onClick={togglePlay} className="text-white/80 hover:text-white transition-colors">
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
          </button>

          {/* Skip 10s */}
          <button onClick={() => { if (videoRef.current) videoRef.current.currentTime += 10 }}
            className="text-white/60 hover:text-white transition-colors">
            <SkipForward className="h-4 w-4" />
          </button>

          {/* Volume */}
          <div className="flex items-center gap-1.5 group/vol">
            <button onClick={toggleMute} className="text-white/80 hover:text-white transition-colors">
              {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <input type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume}
              onChange={handleVolume}
              className="hidden group-hover/vol:block w-16 h-1 accent-primary cursor-pointer"
            />
          </div>

          {/* Time */}
          <span className="text-xs text-white/60 tabular-nums">
            {formatDuration(Math.floor(currentTime))} / {formatDuration(Math.floor(duration))}
          </span>

          <div className="ml-auto flex items-center gap-2">
            {/* Quality */}
            {levels.length > 0 && (
              <div className="relative">
                <button onClick={() => setShowQuality(!showQuality)}
                  className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors">
                  <Settings className="h-4 w-4" />
                  {quality}
                </button>
                {showQuality && (
                  <div className="absolute bottom-8 right-0 rounded-xl border border-border/60 bg-card/95 p-1 min-w-[100px] shadow-xl">
                    {levels.map((q: string) => (
                      <button key={q} onClick={() => setQualityLevel(q)}
                        className={cn("block w-full rounded-lg px-3 py-1.5 text-left text-xs font-semibold transition-colors",
                          quality === q ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5")}>
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Fullscreen */}
            <button onClick={toggleFullscreen} className="text-white/60 hover:text-white transition-colors">
              {fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
