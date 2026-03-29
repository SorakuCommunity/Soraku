"use client"
import { useState, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Loader2, Play, Filter, AlertCircle, Tv2 } from "lucide-react"
import { cn } from "@/lib/utils"

const SOURCES = [
  { id: "hianime",   name: "HiAnime",   lang: "Sub EN", color: "text-blue-400"   },
  { id: "gogoanime", name: "GogoAnime", lang: "Sub EN", color: "text-orange-400" },
  { id: "animekai",  name: "Animekai",  lang: "Sub EN", color: "text-purple-400" },
  { id: "anibaru",   name: "AniBaru",   lang: "Sub ID", color: "text-green-400"  },
]

interface AnimeResult {
  id: string; title: string; cover: string | null; source: string;
  totalEpisodes: number | null; status: string; genres: string[];
}

export default function AnimeBrowsePage({
  searchParams,
}: {
  searchParams?: { source?: string; q?: string }
}) {
  const defaultSource = (searchParams?.source as string) ?? "hianime"
  const [source,   setSource]   = useState(defaultSource)
  const [query,    setQuery]    = useState(searchParams?.q ?? "")
  const [results,  setResults]  = useState<AnimeResult[]>([])
  const [loading,  setLoading]  = useState(false)
  const [searched, setSearched] = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const lastQuery = useRef("")

  const doSearch = useCallback(async (q: string, src: string) => {
    if (!q.trim()) return
    if (q === lastQuery.current && src === source && searched) return
    lastQuery.current = q
    setLoading(true); setError(null); setSearched(true)
    try {
      const res  = await fetch(`/api/ext/stream?anime=true&q=${encodeURIComponent(q)}&source=${src}`)
      const data = await res.json()
      if (data?.data) setResults(data.data)
      else setError(data?.error ?? "Tidak ada hasil ditemukan.")
    } catch { setError("Gagal terhubung ke server.") }
    finally { setLoading(false) }
  }, [source, searched])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    doSearch(query, source)
  }

  const handleSource = (src: string) => {
    setSource(src)
    setResults([])
    setSearched(false)
    if (query.trim()) doSearch(query, src)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-20 pb-16">
      {/* Header */}
      <div className="py-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-1">Browse</p>
        <h1 className="text-3xl font-black">Cari Anime</h1>
      </div>

      {/* Source tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {SOURCES.map((s: typeof SOURCES[0]) => (
          <button key={s.id} onClick={() => handleSource(s.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all",
              source === s.id
                ? `border-primary/40 bg-primary/10 ${s.color}`
                : "border-border/50 text-muted-foreground/60 hover:text-foreground hover:border-border"
            )}>
            <Filter className="h-3 w-3" />
            {s.name}
            <span className="rounded-full bg-black/30 px-1.5 py-0.5 text-[9px] font-bold opacity-60">{s.lang}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <form onSubmit={handleSubmit} className="mb-8 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`Cari anime di ${SOURCES.find(s => s.id === source)?.name}...`}
            className="w-full rounded-2xl border border-border/50 bg-card/50 py-3 pl-11 pr-4 text-sm outline-none placeholder:text-muted-foreground/30 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
        <button type="submit" disabled={loading || !query.trim()}
          className="flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-40 transition-all">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Cari
        </button>
      </form>

      {/* Results */}
      {loading && (
        <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span>Mencari anime...</span>
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground/60">{error}</p>
        </div>
      )}

      {!loading && !error && searched && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <Tv2 className="h-10 w-10 text-muted-foreground/20" />
          <p className="text-sm text-muted-foreground/50">Anime tidak ditemukan. Coba kata kunci lain.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <p className="mb-4 text-xs text-muted-foreground/40">{results.length} hasil ditemukan</p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {results.map(anime => (
              <Link
                key={anime.id}
                href={`/watch/${encodeURIComponent(anime.id)}?source=${source}&title=${encodeURIComponent(anime.title)}`}
                className="anime-card glass-card group flex flex-col overflow-hidden rounded-xl border border-border/40 hover:border-primary/40">
                {/* Cover */}
                <div className="relative aspect-[3/4] overflow-hidden bg-muted/20">
                  {anime.cover ? (
                    <Image src={anime.cover} alt={anime.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Tv2 className="h-8 w-8 text-muted-foreground/20" />
                    </div>
                  )}
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/40">
                      <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  {/* Episode badge */}
                  {anime.totalEpisodes && (
                    <div className="absolute bottom-1.5 right-1.5 rounded-lg bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-white/80">
                      {anime.totalEpisodes} ep
                    </div>
                  )}
                  {/* Status */}
                  {anime.status === "Ongoing" && (
                    <div className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded-full bg-green-500/80 px-2 py-0.5 text-[9px] font-bold text-white">
                      <span className="live-dot h-1.5 w-1.5 rounded-full bg-white" />
                      Ongoing
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-2.5">
                  <p className="text-[11px] font-bold line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {anime.title}
                  </p>
                  {anime.genres.length > 0 && (
                    <p className="mt-1 text-[9px] text-muted-foreground/40 truncate">
                      {anime.genres.slice(0, 2).join(" · ")}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {!searched && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <Search className="h-12 w-12 text-muted-foreground/15" />
          <p className="text-sm text-muted-foreground/40">Ketik judul anime untuk mulai mencari</p>
          <p className="text-xs text-muted-foreground/25">Tersedia: Sub Indonesia & Sub English</p>
        </div>
      )}
    </div>
  )
}
