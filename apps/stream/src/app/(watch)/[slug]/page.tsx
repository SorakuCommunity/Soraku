"use client"
import { useState, useEffect, useCallback, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { Play, Loader2, ArrowLeft, Users, AlertCircle, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { HLSPlayer } from "@/components/player/HLSPlayer"

interface Episode { id: string; number: number; title: string | null; isFiller: boolean }
interface AnimeDetail {
  id: string; title: string; cover: string | null; description: string | null;
  totalEpisodes: number | null; status: string; genres: string[];
  episodes: Episode[]; year: number | null; rating: number | null;
}
interface StreamSource { url: string; quality: string; isM3U8: boolean }

const SOURCES: Record<string, { name: string; lang: string }> = {
  hianime:   { name: "HiAnime",   lang: "Sub EN" },
  gogoanime: { name: "GogoAnime", lang: "Sub EN" },
  animekai:  { name: "Animekai",  lang: "Sub EN" },
  anibaru:   { name: "AniBaru",   lang: "Sub ID" },
}

function WatchPageInner() {
  const { slug }        = useParams<{ slug: string }>()
  const sp              = useSearchParams()
  const source          = sp.get("source") ?? "hianime"
  const titleParam      = sp.get("title") ?? ""

  const [detail,        setDetail]        = useState<AnimeDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(true)
  const [currentEp,     setCurrentEp]     = useState<Episode | null>(null)
  const [streamSrc,     setStreamSrc]     = useState<string | null>(null)
  const [streamLoading, setStreamLoading] = useState(false)
  const [streamError,   setStreamError]   = useState<string | null>(null)
  const [showAllEp,     setShowAllEp]     = useState(false)
  const [selectedQuality, setSelectedQuality] = useState("auto")

  const decodedSlug = decodeURIComponent(slug)

  // Load anime detail
  useEffect(() => {
    setDetailLoading(true)
    fetch(`/api/ext/stream/${encodeURIComponent(decodedSlug)}?anime=true&source=${source}&info=true`)
      .then(r => r.json())
      .then(d => { if (d.data) setDetail(d.data) })
      .catch(() => {})
      .finally(() => setDetailLoading(false))
  }, [decodedSlug, source])

  // Load episode stream
  const loadStream = useCallback(async (ep: Episode) => {
    setCurrentEp(ep)
    setStreamLoading(true)
    setStreamError(null)
    setStreamSrc(null)
    try {
      const res  = await fetch(`/api/ext/stream/${encodeURIComponent(ep.id)}?anime=true&source=${source}&quality=${selectedQuality}`)
      const data = await res.json()
      if (data?.data?.streams?.length > 0) {
        // Prefer M3U8
        const streams: StreamSource[] = data.data.streams
        const best = streams.find(s => s.isM3U8) ?? streams[0]
        setStreamSrc(best.url)
      } else {
        setStreamError("Stream tidak tersedia untuk episode ini.")
      }
    } catch { setStreamError("Gagal memuat stream.") }
    finally { setStreamLoading(false) }
  }, [source, selectedQuality])

  const visibleEps = showAllEp
    ? (detail?.episodes ?? [])
    : (detail?.episodes ?? []).slice(0, 24)

  return (
    <div className="mx-auto max-w-6xl px-4 pt-16 pb-16">
      {/* Back */}
      <div className="py-4">
        <Link href="/anime" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left: Player + Info */}
        <div className="space-y-5">
          {/* Player */}
          <div>
            {streamSrc ? (
              <HLSPlayer
                src={streamSrc}
                poster={detail?.cover}
                title={currentEp ? `Ep ${currentEp.number}${currentEp.title ? " — " + currentEp.title : ""}` : detail?.title ?? ""}
              />
            ) : (
              <div className="relative w-full overflow-hidden rounded-2xl bg-black/60 border border-border/40" style={{ aspectRatio: "16/9" }}>
                {detail?.cover && (
                  <Image src={detail.cover} alt={detail.title} fill className="object-cover opacity-30" unoptimized />
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-6">
                  {streamLoading ? (
                    <>
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                      <p className="text-sm text-white/60">Memuat stream...</p>
                    </>
                  ) : streamError ? (
                    <>
                      <AlertCircle className="h-10 w-10 text-red-400" />
                      <p className="text-sm text-white/70">{streamError}</p>
                    </>
                  ) : (
                    <>
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10">
                        <Play className="h-7 w-7 text-white fill-white ml-1" />
                      </div>
                      <p className="text-sm text-white/50">Pilih episode untuk mulai menonton</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Now playing info */}
          {currentEp && (
            <div className="glass-card rounded-2xl px-4 py-3 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-xs font-black text-primary">
                {currentEp.number}
              </div>
              <div>
                <p className="text-sm font-bold">{currentEp.title ?? `Episode ${currentEp.number}`}</p>
                <p className="text-[11px] text-muted-foreground/50">
                  {SOURCES[source]?.name} · {SOURCES[source]?.lang}
                </p>
              </div>
            </div>
          )}

          {/* Anime info */}
          {detailLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
              <Loader2 className="h-4 w-4 animate-spin" /> Memuat info anime...
            </div>
          ) : detail ? (
            <div className="glass-card rounded-2xl p-5 flex gap-4">
              {detail.cover && (
                <div className="relative h-28 w-20 flex-shrink-0 overflow-hidden rounded-xl">
                  <Image src={detail.cover} alt={detail.title} fill className="object-cover" unoptimized />
                </div>
              )}
              <div className="flex-1 min-w-0 space-y-2">
                <h1 className="text-lg font-black leading-tight">{detail.title}</h1>
                <div className="flex flex-wrap gap-1.5">
                  {detail.status === "Ongoing" && (
                    <span className="flex items-center gap-1 rounded-full bg-green-500/15 border border-green-500/30 px-2.5 py-0.5 text-[10px] font-bold text-green-400">
                      <span className="live-dot h-1.5 w-1.5 rounded-full bg-green-400" /> Ongoing
                    </span>
                  )}
                  {detail.year && (
                    <span className="rounded-full border border-border/50 px-2.5 py-0.5 text-[10px] text-muted-foreground/60">{detail.year}</span>
                  )}
                  {detail.totalEpisodes && (
                    <span className="rounded-full border border-border/50 px-2.5 py-0.5 text-[10px] text-muted-foreground/60">{detail.totalEpisodes} ep</span>
                  )}
                  {detail.genres.slice(0, 3).map(g => (
                    <span key={g} className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[10px] text-primary/80">{g}</span>
                  ))}
                </div>
                {detail.description && (
                  <p className="text-xs text-muted-foreground/60 leading-relaxed line-clamp-3">{detail.description}</p>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Right: Episode list */}
        <div className="space-y-4">
          {/* Watch Party CTA */}
          <Link href={`/watchparty?anime=${encodeURIComponent(decodedSlug)}&source=${source}&title=${encodeURIComponent(detail?.title ?? titleParam)}`}
            className="glass-card flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 hover:border-primary/40 transition-all">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/20">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-black">Watch Party</p>
              <p className="text-[11px] text-muted-foreground/60">Nonton bareng teman secara real-time</p>
            </div>
          </Link>

          {/* Episode list */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="border-b border-border/40 px-4 py-3 flex items-center justify-between">
              <h3 className="font-black text-sm">Episode</h3>
              {detail?.episodes.length && (
                <span className="text-xs text-muted-foreground/50">{detail.episodes.length} total</span>
              )}
            </div>
            <div className="max-h-[520px] overflow-y-auto">
              {detailLoading ? (
                <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground/50 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (detail?.episodes ?? []).length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground/40">
                  Tidak ada episode tersedia
                </div>
              ) : (
                <div>
                  {visibleEps.map(ep => (
                    <button key={ep.id} onClick={() => loadStream(ep)}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-3 text-left transition-all border-b border-border/20 last:border-0",
                        currentEp?.id === ep.id
                          ? "bg-primary/10 border-l-2 border-l-primary"
                          : "hover:bg-white/5"
                      )}>
                      <div className={cn(
                        "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-black",
                        currentEp?.id === ep.id ? "bg-primary text-white" : "bg-muted/50 text-muted-foreground/60"
                      )}>
                        {ep.isFiller ? "F" : ep.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-xs font-semibold truncate",
                          currentEp?.id === ep.id ? "text-primary" : ""
                        )}>
                          {ep.title ?? `Episode ${ep.number}`}
                        </p>
                        {ep.isFiller && (
                          <span className="text-[9px] text-amber-400/70 font-bold">Filler</span>
                        )}
                      </div>
                      {streamLoading && currentEp?.id === ep.id && (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary flex-shrink-0" />
                      )}
                    </button>
                  ))}

                  {(detail?.episodes ?? []).length > 24 && (
                    <button onClick={() => setShowAllEp(!showAllEp)}
                      className="flex w-full items-center justify-center gap-2 py-3 text-xs font-bold text-muted-foreground/50 hover:text-foreground transition-colors border-t border-border/20">
                      {showAllEp ? <><ChevronUp className="h-3.5 w-3.5" /> Tampilkan lebih sedikit</> : <><ChevronDown className="h-3.5 w-3.5" /> Tampilkan semua ({detail?.episodes.length} episode)</>}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function WatchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    }>
      <WatchPageInner />
    </Suspense>
  )
}
