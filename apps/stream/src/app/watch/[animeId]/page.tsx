"use client"
import { useState, useEffect, useCallback, Suspense } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Loader2, AlertCircle, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { VideoPlayer } from "@/components/player/VideoPlayer"

interface Episode { id: string; number: number; title: string | null; isFiller: boolean }
interface StreamSrc  { url: string; quality: string; isM3U8: boolean }
interface Subtitle   { url: string; lang: string }
interface AnimeInfo  {
  id: string; title: string; cover: string | null;
  episodes: Episode[]; source: string;
}

const SOURCES = [
  { id: "hianime",   name: "HiAnime",   lang: "Sub EN" },
  { id: "gogoanime", name: "GogoAnime", lang: "Sub EN" },
  { id: "animekai",  name: "Animekai",  lang: "Sub EN" },
  { id: "anibaru",   name: "AniBaru",   lang: "Sub ID" },
]

function WatchPageInner() {
  const { animeId } = useParams<{ animeId: string }>()
  const sp          = useSearchParams()
  const router      = useRouter()

  const initEpId     = sp.get("ep") ?? ""
  const initSource   = sp.get("source") ?? "hianime"
  const initEpNum    = Number(sp.get("epNum") ?? "1")

  const [source,    setSource]    = useState(initSource)
  const [anime,     setAnime]     = useState<AnimeInfo | null>(null)
  const [streamSrc, setStreamSrc] = useState<string | null>(null)
  const [subtitles, setSubtitles] = useState<Subtitle[]>([])
  const [intro,     setIntro]     = useState<{ start: number; end: number } | null>(null)
  const [outro,     setOutro]     = useState<{ start: number; end: number } | null>(null)
  const [currentEp, setCurrentEp] = useState<Episode | null>(null)
  const [loading,   setLoading]   = useState(true)
  const [epLoading, setEpLoading] = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const [showAllEp, setShowAllEp] = useState(false)

  // Load anime detail
  useEffect(() => {
    setLoading(true); setError(null)
    const slug = sp.get("title")
      ? sp.get("title")!.toLowerCase().replace(/\s+/g, "-")
      : animeId
    fetch(`/api/ext/stream/${encodeURIComponent(slug)}?anime=true&source=${source}&info=true`)
      .then(r => r.json())
      .then(d => {
        if (d?.data) {
          const { id, title, cover, episodes } = d.data
          setAnime({ id, title: typeof title === "object" ? (title.english ?? title.romaji) : title, cover, episodes: episodes ?? [], source })
          // Auto load first/requested episode
          const ep = episodes?.find((e: Episode) => e.id === initEpId) ?? episodes?.[initEpNum - 1] ?? episodes?.[0]
          if (ep) loadStream(ep, source)
          else setLoading(false)
        } else { setError("Anime tidak ditemukan."); setLoading(false) }
      })
      .catch(() => { setError("Gagal memuat data anime."); setLoading(false) })
  }, [source, animeId])

  const loadStream = useCallback(async (ep: Episode, src: string) => {
    setCurrentEp(ep); setEpLoading(true); setStreamSrc(null)
    try {
      const res  = await fetch(`/api/ext/stream/${encodeURIComponent(ep.id)}?anime=true&source=${src}`)
      const data = await res.json()
      if (data?.data?.streams?.length > 0) {
        const best: StreamSrc = data.data.streams.find((s: StreamSrc) => s.isM3U8) ?? data.data.streams[0]
        setStreamSrc(best.url)
        setSubtitles(data.data.subtitles ?? [])
        setIntro(data.data.intro ?? null)
        setOutro(data.data.outro ?? null)
      } else { setError("Stream tidak tersedia.") }
    } catch { setError("Gagal memuat stream.") }
    finally { setEpLoading(false); setLoading(false) }
  }, [])

  const handleNext = useCallback(() => {
    if (!anime || !currentEp) return
    const idx  = anime.episodes.findIndex(e => e.id === currentEp.id)
    const next = anime.episodes[idx + 1]
    if (next) loadStream(next, source)
  }, [anime, currentEp, source, loadStream])

  const handlePrev = useCallback(() => {
    if (!anime || !currentEp) return
    const idx  = anime.episodes.findIndex(e => e.id === currentEp.id)
    const prev = anime.episodes[idx - 1]
    if (prev) loadStream(prev, source)
  }, [anime, currentEp, source, loadStream])

  const visibleEps  = showAllEp ? (anime?.episodes ?? []) : (anime?.episodes ?? []).slice(0, 100)
  const currentIdx  = anime?.episodes.findIndex(e => e.id === currentEp?.id) ?? -1
  const hasPrev     = currentIdx > 0
  const hasNext     = anime ? currentIdx < anime.episodes.length - 1 : false

  const title = currentEp
    ? `Ep ${currentEp.number}${currentEp.title ? " — " + currentEp.title : ""}`
    : anime?.title ?? ""

  return (
    <div className="space-y-5">
      {/* Back */}
      <Link href={`/anime/${animeId}`}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors">
        <ChevronLeft className="h-4 w-4" /> {anime?.title ?? "Kembali"}
      </Link>

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        {/* ── Left: Player + info ── */}
        <div className="space-y-4">
          {/* Player */}
          {streamSrc && anime ? (
            <VideoPlayer
              src={streamSrc}
              subtitles={subtitles}
              poster={anime.cover}
              title={title}
              intro={intro}
              outro={outro}
              onEnded={handleNext}
              animeId={animeId}
              animeTitle={anime.title}
              animeCover={anime.cover}
              episodeId={currentEp?.id}
              episodeNum={currentEp?.number}
              episodeTitle={currentEp?.title}
              source={source}
            />
          ) : (
            <div className="w-full bg-zinc-900 rounded-xl flex items-center justify-center" style={{ aspectRatio: "16/9" }}>
              {loading || epLoading ? (
                <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
              ) : error ? (
                <div className="flex flex-col items-center gap-2 text-center px-6">
                  <AlertCircle className="h-8 w-8 text-red-400" />
                  <p className="text-sm text-zinc-400">{error}</p>
                </div>
              ) : null}
            </div>
          )}

          {/* Nav row */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <button onClick={handlePrev} disabled={!hasPrev}
              className="flex items-center gap-1.5 rounded-lg border border-white/[.06] px-3 py-2 text-xs text-zinc-400 hover:text-white hover:border-white/[.12] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronLeft className="h-3.5 w-3.5" /> Episode Sebelumnya
            </button>
            {currentEp && (
              <span className="text-sm font-medium text-zinc-300">
                Ep {currentEp.number}{currentEp.title ? ` — ${currentEp.title}` : ""}
              </span>
            )}
            <button onClick={handleNext} disabled={!hasNext}
              className="flex items-center gap-1.5 rounded-lg border border-white/[.06] px-3 py-2 text-xs text-zinc-400 hover:text-white hover:border-white/[.12] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              Episode Berikutnya <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Watch Party CTA */}
          <Link href={`/watchparty?anime=${encodeURIComponent(animeId)}&source=${source}&title=${encodeURIComponent(anime?.title ?? "")}`}
            className="flex items-center gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-4 py-3 hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex-shrink-0">
              <Users className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Watch Party</p>
              <p className="text-xs text-zinc-500">Nonton bareng teman secara real-time</p>
            </div>
          </Link>

          {/* Source selector */}
          <div className="space-y-2">
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Sumber</p>
            <div className="flex flex-wrap gap-2">
              {SOURCES.map(s => (
                <button key={s.id} onClick={() => setSource(s.id)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium border transition-all",
                    source === s.id
                      ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-300"
                      : "border-white/[.06] text-zinc-500 hover:text-zinc-300 hover:border-white/[.12]"
                  )}>
                  {s.name} <span className="opacity-50 text-[10px]">{s.lang}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Episode list ── */}
        <div className="rounded-xl border border-white/[.06] bg-zinc-900/50 overflow-hidden">
          <div className="border-b border-white/[.06] px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-bold text-white">Episode</span>
            <span className="text-xs text-zinc-500">{anime?.episodes.length ?? 0} total</span>
          </div>
          <div className="ep-scroll overflow-y-auto" style={{ maxHeight: "520px" }}>
            {loading && !anime ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
              </div>
            ) : (
              <>
                {visibleEps.map((ep: Episode) => (
                  <button key={ep.id} onClick={() => loadStream(ep, source)}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-3 text-left border-b border-white/[.04] last:border-0 transition-all",
                      currentEp?.id === ep.id
                        ? "bg-indigo-500/10 border-l-2 border-l-indigo-500"
                        : "hover:bg-white/[.03]"
                    )}>
                    <div className={cn(
                      "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[11px] font-bold",
                      ep.isFiller ? "bg-amber-500/10 text-amber-400/70"
                        : currentEp?.id === ep.id ? "bg-indigo-500 text-white"
                        : "bg-zinc-800 text-zinc-400"
                    )}>
                      {ep.number}
                    </div>
                    <span className={cn("text-xs font-medium flex-1 truncate",
                      currentEp?.id === ep.id ? "text-indigo-300" : "text-zinc-400"
                    )}>
                      {ep.title ?? `Episode ${ep.number}`}
                    </span>
                    {epLoading && currentEp?.id === ep.id && (
                      <Loader2 className="h-3 w-3 animate-spin text-indigo-400 flex-shrink-0" />
                    )}
                  </button>
                ))}
                {(anime?.episodes.length ?? 0) > 100 && (
                  <button onClick={() => setShowAllEp(!showAllEp)}
                    className="flex w-full items-center justify-center gap-1.5 py-3 text-xs text-zinc-500 hover:text-zinc-300 border-t border-white/[.04] transition-colors">
                    {showAllEp ? <><ChevronUp className="h-3.5 w-3.5" /> Lebih sedikit</> : <><ChevronDown className="h-3.5 w-3.5" /> Tampilkan semua</>}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function WatchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    }>
      <WatchPageInner />
    </Suspense>
  )
}
