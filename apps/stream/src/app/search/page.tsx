"use client"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { AnimeCard } from "@/components/ui/AnimeCard"
import { Search, Loader2, TrendingUp, Zap, Star, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const SOURCES = [
  { id: "hianime",   name: "HiAnime",   lang: "Sub EN" },
  { id: "gogoanime", name: "GogoAnime", lang: "Sub EN" },
  { id: "animekai",  name: "Animekai",  lang: "Sub EN" },
  { id: "anibaru",   name: "AniBaru",   lang: "Sub ID" },
]

function SearchPageInner() {
  const sp     = useSearchParams()
  const router = useRouter()

  const [q,       setQ]       = useState(sp.get("q") ?? "")
  const [source,  setSource]  = useState("hianime")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    const term = sp.get("q")
    if (term) { setQ(term); doSearch(term, source) }
  }, [sp])

  const doSearch = async (term: string, src: string) => {
    if (!term.trim()) return
    setLoading(true); setError(null); setResults([])
    try {
      const res  = await fetch(`/api/ext/stream?anime=true&q=${encodeURIComponent(term)}&source=${src}`)
      const data = await res.json()
      if (Array.isArray(data?.data)) setResults(data.data)
      else setError("Tidak ada hasil.")
    } catch { setError("Gagal terhubung.") }
    finally { setLoading(false) }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) { router.push(`/search?q=${encodeURIComponent(q.trim())}`); doSearch(q, source) }
  }

  const handleSource = (s: string) => {
    setSource(s)
    if (q.trim()) doSearch(q, s)
  }

  // Normalize external result to AniList-like shape for AnimeCard
  const normalizeResult = (r: any) => ({
    id: r.id,
    title: { romaji: r.title, english: null, native: "" },
    coverImage: { large: r.cover ?? "", extraLarge: r.cover ?? "", color: null },
    bannerImage: null,
    description: null,
    genres: r.genres ?? [],
    averageScore: null,
    popularity: 0,
    episodes: r.totalEpisodes ?? null,
    status: r.status ?? "Unknown",
    season: null,
    seasonYear: null,
    format: null,
    nextAiringEpisode: null,
  })

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-white">Jelajahi Anime</h1>
        <p className="text-sm text-zinc-500">Cari dari berbagai sumber streaming</p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="Cari anime..."
            className="w-full rounded-lg bg-zinc-900 border border-white/[.06] py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-indigo-500/50 transition-all" />
        </div>
        <button type="submit" disabled={loading}
          className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 disabled:opacity-40 transition-colors">
          Cari
        </button>
      </form>

      {/* Source tabs */}
      <div className="flex flex-wrap gap-2">
        {SOURCES.map(s => (
          <button key={s.id} onClick={() => handleSource(s.id)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium border transition-all",
              source === s.id
                ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-300"
                : "border-white/[.06] text-zinc-500 hover:text-zinc-300"
            )}>
            {s.name} <span className="opacity-40 text-[10px] ml-0.5">{s.lang}</span>
          </button>
        ))}
      </div>

      {/* Results */}
      {loading && (
        <div className="flex items-center gap-2 py-10 text-zinc-500 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" /> Mencari...
        </div>
      )}
      {!loading && error && (
        <div className="flex items-center gap-2 py-10 text-zinc-500 text-sm">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}
      {!loading && !error && results.length > 0 && (
        <>
          <p className="text-xs text-zinc-500">{results.length} hasil dari {SOURCES.find(s => s.id === source)?.name}</p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {results.map((r: any) => {
              const norm = normalizeResult(r)
              return (
                <a key={r.id} href={`/watch/${encodeURIComponent(r.id)}?source=${source}&title=${encodeURIComponent(r.title)}&epNum=1`}
                  className="anime-card group relative block">
                  <div className="relative overflow-hidden rounded-md bg-zinc-900" style={{ aspectRatio: "2/3" }}>
                    {r.cover ? (
                      <img src={r.cover} alt={r.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-zinc-800 text-zinc-600 text-xs">No Cover</div>
                    )}
                    <div className="overlay absolute inset-0 bg-black/60 opacity-0 transition-opacity flex items-center justify-center">
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-500/90">
                        <span className="text-white ml-0.5">▶</span>
                      </div>
                    </div>
                    {r.status === "Ongoing" && (
                      <span className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold bg-indigo-500/80 text-white">
                        <span className="live-dot h-1.5 w-1.5 rounded-full bg-white" />Ongoing
                      </span>
                    )}
                    {r.totalEpisodes && (
                      <span className="absolute bottom-1.5 right-1.5 rounded px-1.5 py-0.5 text-[10px] bg-black/70 text-zinc-300">{r.totalEpisodes} ep</span>
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-medium text-zinc-200 line-clamp-2 leading-snug group-hover:text-white transition-colors">{r.title}</p>
                  </div>
                </a>
              )
            })}
          </div>
        </>
      )}
      {!loading && !error && results.length === 0 && q && (
        <div className="flex flex-col items-center py-16 gap-3 text-center">
          <Search className="h-10 w-10 text-zinc-700" />
          <p className="text-sm text-zinc-500">Tidak ada hasil untuk "{q}"</p>
          <p className="text-xs text-zinc-600">Coba kata kunci lain atau ganti sumber</p>
        </div>
      )}
      {!q && !loading && (
        <div className="flex flex-col items-center py-16 gap-3 text-center">
          <Search className="h-12 w-12 text-zinc-700" />
          <p className="text-sm text-zinc-500">Masukkan judul anime untuk mulai mencari</p>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-7 w-7 animate-spin text-indigo-400" />
      </div>
    }>
      <SearchPageInner />
    </Suspense>
  )
}
