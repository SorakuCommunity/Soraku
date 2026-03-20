"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Play, ChevronDown, ChevronUp, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { getProgress } from "@/lib/continue-watching"

const SOURCES = [
  { id: "hianime",   name: "HiAnime",   lang: "Sub EN" },
  { id: "gogoanime", name: "GogoAnime", lang: "Sub EN" },
  { id: "animekai",  name: "Animekai",  lang: "Sub EN" },
  { id: "anibaru",   name: "AniBaru",   lang: "Sub ID" },
]

interface Episode {
  id: string; number: number; title: string | null; isFiller: boolean
}

interface Props {
  animeId: string
  animeTitle: string
  animeCover: string
}

export function EpisodeList({ animeId, animeTitle, animeCover }: Props) {
  const [source,   setSource]   = useState("hianime")
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)
  const [showAll,  setShowAll]  = useState(false)

  useEffect(() => {
    setLoading(true); setError(null); setEpisodes([])
    fetch(`/api/ext/stream/${encodeURIComponent(animeTitle.toLowerCase().replace(/\s+/g, "-"))}?anime=true&source=${source}&info=true`)
      .then(r => r.json())
      .then(d => {
        if (d?.data?.episodes) setEpisodes(d.data.episodes)
        else setError("Episode tidak tersedia dari sumber ini.")
      })
      .catch(() => setError("Gagal memuat episode."))
      .finally(() => setLoading(false))
  }, [source, animeTitle])

  const visible = showAll ? episodes : episodes.slice(0, 50)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white">Episode</h2>
        {episodes.length > 0 && (
          <span className="text-xs text-zinc-500">{episodes.length} episode</span>
        )}
      </div>

      {/* Source selector */}
      <div className="flex flex-wrap gap-2">
        {SOURCES.map(s => (
          <button key={s.id} onClick={() => setSource(s.id)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-all border",
              source === s.id
                ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-300"
                : "border-white/[.06] text-zinc-500 hover:text-zinc-300 hover:border-white/[.12] bg-transparent"
            )}>
            {s.name} <span className="opacity-50 text-[10px]">{s.lang}</span>
          </button>
        ))}
      </div>

      {/* Episode grid */}
      {loading ? (
        <div className="flex items-center gap-2 py-8 text-zinc-500 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" /> Memuat episode...
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 py-8 text-zinc-500 text-sm">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      ) : episodes.length === 0 ? (
        <p className="py-8 text-sm text-zinc-500">Tidak ada episode tersedia dari sumber ini.</p>
      ) : (
        <>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1.5">
            {visible.map(ep => {
              const progress = getProgress(ep.id)
              const watched  = progress > 0
              return (
                <Link key={ep.id}
                  href={`/watch/${animeId}?ep=${encodeURIComponent(ep.id)}&source=${source}&epNum=${ep.number}`}
                  title={ep.title ?? `Episode ${ep.number}`}
                  className={cn(
                    "relative flex h-10 items-center justify-center rounded-lg text-xs font-semibold transition-all border group",
                    ep.isFiller
                      ? "border-amber-500/20 bg-amber-500/5 text-amber-400/60 hover:bg-amber-500/15"
                      : watched
                      ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20"
                      : "border-white/[.06] bg-white/[.03] text-zinc-400 hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-300"
                  )}>
                  {ep.number}
                  {/* Progress dot */}
                  {watched && (
                    <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  )}
                </Link>
              )
            })}
          </div>

          {episodes.length > 50 && (
            <button onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              {showAll
                ? <><ChevronUp className="h-3.5 w-3.5" /> Tampilkan lebih sedikit</>
                : <><ChevronDown className="h-3.5 w-3.5" /> Tampilkan {episodes.length - 50} episode lainnya</>
              }
            </button>
          )}
        </>
      )}
    </div>
  )
}
