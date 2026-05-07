'use client'

import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Track {
  id: string
  title: string
  artist: string
  anime?: string
  cover: string // emoji or URL
  src: string // audio URL — ganti dengan real URL setelah backend ready
  duration?: number
}

interface MusicPlayerState {
  playlist: Track[]
  currentIndex: number
  isPlaying: boolean
  isVisible: boolean
  isMinimized: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
}

interface MusicPlayerActions {
  play: () => void
  pause: () => void
  togglePlay: () => void
  next: () => void
  prev: () => void
  playTrack: (index: number) => void
  setVolume: (v: number) => void
  toggleMute: () => void
  seek: (time: number) => void
  showPlayer: () => void
  hidePlayer: () => void
  toggleMinimize: () => void
  setPlaylist: (tracks: Track[]) => void
}

type MusicPlayerCtx = MusicPlayerState & MusicPlayerActions

// ─── Default playlist ─────────────────────────────────────────────────────────
// Gunakan free/public domain audio. Ganti src dengan streaming URL real saat backend ready.

export const DEFAULT_PLAYLIST: Track[] = [
  {
    id: '1',
    title: 'Silhouette',
    artist: 'KANA-BOON',
    anime: 'Naruto Shippuden OP16',
    cover: '🍃',
    src: 'https://jumpshare.com/share/x4ugZlhwOqxKa6EORZn0', // TODO: isi URL audio
  },
  {
    id: '2',
    title: 'Gurenge',
    artist: 'LiSA',
    anime: 'Kimetsu no Yaiba OP',
    cover: '🔥',
    src: '',
  },
  {
    id: '3',
    title: 'Unravel',
    artist: 'TK from Ling Tosite Sigure',
    anime: 'Tokyo Ghoul OP',
    cover: '🌑',
    src: '',
  },
  {
    id: '4',
    title: 'Again',
    artist: 'YUI',
    anime: 'Fullmetal Alchemist Brotherhood OP1',
    cover: '⚗️',
    src: '',
  },
  {
    id: '5',
    title: 'Renai Circulation',
    artist: 'Kana Hanazawa',
    anime: 'Bakemonogatari ED',
    cover: '🌸',
    src: '',
  },
]

// ─── Context ──────────────────────────────────────────────────────────────────

const MusicPlayerContext = createContext<MusicPlayerCtx | null>(null)

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [playlist, setPlaylistState] = useState<Track[]>(DEFAULT_PLAYLIST)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)

  // Init audio element
  useEffect(() => {
    const audio = new Audio()
    audio.volume = volume
    audioRef.current = audio

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onDurationChange = () => setDuration(audio.duration || 0)
    const onEnded = () => {
      setCurrentIndex((i) => (i + 1) % DEFAULT_PLAYLIST.length)
    }
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load new track when index changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const track = playlist[currentIndex]
    if (!track) return

    if (track.src) {
      audio.src = track.src
      audio.load()
      if (isPlaying) audio.play().catch(() => {})
    } else {
      // No src yet (mock) — just update state
      setCurrentTime(0)
      setDuration(0)
      setIsPlaying(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, playlist])

  // Sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  // ─── Actions ────────────────────────────────────────────────────────────────

  const play = useCallback(() => {
    const track = playlist[currentIndex]
    if (!track?.src) {
      setIsPlaying(true)
      return
    }
    audioRef.current?.play().catch(() => {})
  }, [playlist, currentIndex])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }, [])

  const togglePlay = useCallback(() => {
    if (isPlaying) pause()
    else play()
  }, [isPlaying, play, pause])

  const next = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % playlist.length)
    setIsPlaying(true)
  }, [playlist.length])

  const prev = useCallback(() => {
    if (currentTime > 3) {
      audioRef.current && (audioRef.current.currentTime = 0)
      return
    }
    setCurrentIndex((i) => (i - 1 + playlist.length) % playlist.length)
    setIsPlaying(true)
  }, [currentTime, playlist.length])

  const playTrack = useCallback((index: number) => {
    setCurrentIndex(index)
    setIsPlaying(true)
  }, [])

  const setVolume = useCallback((v: number) => {
    setVolumeState(v)
    setIsMuted(v === 0)
  }, [])

  const toggleMute = useCallback(() => setIsMuted((m) => !m), [])

  const seek = useCallback((time: number) => {
    if (audioRef.current) audioRef.current.currentTime = time
    setCurrentTime(time)
  }, [])

  const showPlayer = useCallback(() => setIsVisible(true), [])
  const hidePlayer = useCallback(() => setIsVisible(false), [])
  const toggleMinimize = useCallback(() => setIsMinimized((m) => !m), [])

  const setPlaylist = useCallback((tracks: Track[]) => {
    setPlaylistState(tracks)
    setCurrentIndex(0)
  }, [])

  const value: MusicPlayerCtx = {
    playlist,
    currentIndex,
    isPlaying,
    isVisible,
    isMinimized,
    currentTime,
    duration,
    volume,
    isMuted,
    play,
    pause,
    togglePlay,
    next,
    prev,
    playTrack,
    setVolume,
    toggleMute,
    seek,
    showPlayer,
    hidePlayer,
    toggleMinimize,
    setPlaylist,
  }

  return <MusicPlayerContext.Provider value={value}>{children}</MusicPlayerContext.Provider>
}

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext)
  if (!ctx) throw new Error('useMusicPlayer must be used within MusicPlayerProvider')
  return ctx
}
