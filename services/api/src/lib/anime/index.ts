/**
 * services/api/src/lib/anime — Anime Streaming Adapter
 *
 * Strategi sumber data:
 * ├── Consumet API (self-hosted / public)   → GogoAnime, HiAnime, Animekai
 * └── Direct scraper fallback               → AniBaru (sub ID)
 *
 * Semua response dinormalisasi ke tipe @soraku/types:
 *   AnimeSearchResult, AnimeDetail, AnimeStreamResult
 *
 * Setup Consumet (opsional, strongly recommended):
 *   docker run -p 3000:3000 ghcr.io/consumet/consumet-api
 *   Atau pakai public: https://api.consumet.org
 *   Set CONSUMET_API_URL di .env
 */

import type {
  AnimeSource, AnimeSearchResult, AnimeDetail,
  AnimeStreamResult, AnimeStreamSource,
} from "@soraku/types"
import { env } from "@/env"

// ── Base Consumet URL ─────────────────────────────────────────
const CONSUMET = env.CONSUMET_API_URL ?? "https://api.consumet.org"

// Map: AnimeSource → Consumet provider name
const CONSUMET_PROVIDER: Partial<Record<AnimeSource, string>> = {
  gogoanime: "gogoanime",
  hianime:   "zoro",      // HiAnime = Zoro di Consumet
  animekai:  "animekai",
}

// ── Generic Consumet fetcher ──────────────────────────────────

async function consumetFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${CONSUMET}${path}`, {
      next: { revalidate: 60 }, // cache 60s di Next.js
      headers: { "Accept": "application/json" },
    })
    if (!res.ok) return null
    return res.json() as Promise<T>
  } catch {
    return null
  }
}

// ── Search ────────────────────────────────────────────────────

export async function searchAnime(
  query: string,
  source: AnimeSource = "hianime",
  page = 1
): Promise<AnimeSearchResult[]> {
  const provider = CONSUMET_PROVIDER[source]

  // Consumet-based sources
  if (provider) {
    const data = await consumetFetch<{ results: ConsumetSearchItem[] }>(
      `/anime/${provider}/${encodeURIComponent(query)}?page=${page}`
    )
    return (data?.results ?? []).map(r => normalizeSearch(r, source))
  }

  // Sub Indonesia fallback (AniBaru)
  if (source === "anibaru") return searchAniBaru(query)

  return []
}

// ── Anime Detail ──────────────────────────────────────────────

export async function getAnimeDetail(
  animeId: string,
  source: AnimeSource = "hianime"
): Promise<AnimeDetail | null> {
  const provider = CONSUMET_PROVIDER[source]

  if (provider) {
    const data = await consumetFetch<ConsumetDetail>(
      `/anime/${provider}/info?id=${encodeURIComponent(animeId)}`
    )
    if (!data) return null
    return normalizeDetail(data, source)
  }

  if (source === "anibaru") return getAniBaruDetail(animeId)

  return null
}

// ── Episode Streaming Sources ─────────────────────────────────

export async function getEpisodeStream(
  episodeId: string,
  source: AnimeSource = "hianime",
  quality: "auto" | "1080p" | "720p" | "360p" = "auto"
): Promise<AnimeStreamResult | null> {
  const provider = CONSUMET_PROVIDER[source]

  if (provider) {
    const data = await consumetFetch<ConsumetStream>(
      `/anime/${provider}/watch?episodeId=${encodeURIComponent(episodeId)}`
    )
    if (!data) return null

    // Filter quality
    const streams: AnimeStreamSource[] = (data.sources ?? [])
      .filter(s => quality === "auto" || s.quality === quality || s.quality === "default")
      .map(s => ({
        url:     s.url,
        quality: s.quality ?? "default",
        isM3U8:  s.isM3U8 ?? s.url.includes(".m3u8"),
        isDASH:  s.url.includes(".mpd"),
      }))

    // Sort: HLS first, then by quality desc
    streams.sort((a, b) => {
      if (a.isM3U8 !== b.isM3U8) return a.isM3U8 ? -1 : 1
      const qOrder = ["1080p", "720p", "480p", "360p", "default"]
      return qOrder.indexOf(a.quality) - qOrder.indexOf(b.quality)
    })

    return {
      episodeId,
      source,
      streams,
      subtitles: (data.subtitles ?? []).map(s => ({ url: s.url, lang: s.lang })),
      intro: data.intro ?? null,
      outro: data.outro ?? null,
    }
  }

  return null
}

// ── Source availability check ─────────────────────────────────

export async function getAvailableSources(): Promise<{
  source: AnimeSource
  name: string
  lang: string
  status: "online" | "degraded" | "offline"
  url: string
}[]> {
  const checks = await Promise.allSettled([
    ping("gogoanime"),
    ping("hianime"),
    ping("animekai"),
    pingAniBaru(),
  ])

  return [
    { source: "gogoanime", name: "GogoAnime",   lang: "Sub English",     url: "https://gogoanime3.net",    status: checkPing(checks[0]) },
    { source: "hianime",   name: "HiAnime",     lang: "Sub English",     url: "https://hianime.to",        status: checkPing(checks[1]) },
    { source: "animekai",  name: "Animekai",    lang: "Sub English",     url: "https://animekai.bz",       status: checkPing(checks[2]) },
    { source: "anibaru",   name: "AniBaru",     lang: "Sub Indonesia",   url: "https://anibaru.id",        status: checkPing(checks[3]) },
  ]
}

async function ping(provider: string): Promise<boolean> {
  const res = await consumetFetch<object>(`/anime/${provider}/trending`)
  return res !== null
}

async function pingAniBaru(): Promise<boolean> {
  try {
    const res = await fetch("https://anibaru.id", { method: "HEAD" })
    return res.ok
  } catch { return false }
}

function checkPing(result: PromiseSettledResult<boolean>): "online" | "degraded" | "offline" {
  if (result.status === "fulfilled") return result.value ? "online" : "degraded"
  return "offline"
}

// ── AniBaru (Sub Indonesia) ───────────────────────────────────
// AniBaru tidak punya API resmi — pakai RSS/scraping minimal

async function searchAniBaru(query: string): Promise<AnimeSearchResult[]> {
  try {
    // AniBaru mendukung query via URL pattern
    const res = await fetch(
      `https://anibaru.id/?s=${encodeURIComponent(query)}`,
      { headers: { "User-Agent": "SorakuBot/1.0" } }
    )
    if (!res.ok) return []

    const html = await res.text()
    return parseAniBaruSearch(html)
  } catch { return [] }
}

async function getAniBaruDetail(animeId: string): Promise<AnimeDetail | null> {
  try {
    const res = await fetch(`https://anibaru.id/${animeId}/`, {
      headers: { "User-Agent": "SorakuBot/1.0" }
    })
    if (!res.ok) return null
    const html = await res.text()
    return parseAniBaruDetail(html, animeId)
  } catch { return null }
}

// Simple HTML parser untuk AniBaru (minimal, tidak perlu puppeteer)
function parseAniBaruSearch(html: string): AnimeSearchResult[] {
  const results: AnimeSearchResult[] = []
  // Match article cards: <article class="bs">
  const articleRe = /<article[^>]*class="[^"]*bs[^"]*"[^>]*>([\s\S]*?)<\/article>/gi
  let match: RegExpExecArray | null
  while ((match = articleRe.exec(html)) !== null && results.length < 20) {
    const card = match[1]
    const hrefM = /href="https?:\/\/anibaru\.id\/([^/"]+)\/"/.exec(card)
    const titleM = /title="([^"]+)"/.exec(card)
    const imgM = /src="([^"]+)"/.exec(card)
    if (!hrefM || !titleM) continue
    results.push({
      id: hrefM[1], title: titleM[1], altTitles: [], source: "anibaru",
      cover: imgM?.[1] ?? null, url: `https://anibaru.id/${hrefM[1]}/`,
      totalEpisodes: null, status: "Unknown", genres: [],
    })
  }
  return results
}

function parseAniBaruDetail(html: string, slug: string): AnimeDetail | null {
  const titleM = /<h1[^>]*itemprop="name"[^>]*>([^<]+)</.exec(html)
  const descM  = /<div[^>]*itemprop="description"[^>]*>([\s\S]*?)<\/div>/.exec(html)
  const imgM   = /<img[^>]*itemprop="image"[^>]*src="([^"]+)"/.exec(html)
  if (!titleM) return null
  return {
    id: slug, title: titleM[1].trim(), altTitles: [], source: "anibaru",
    cover: imgM?.[1] ?? null, url: `https://anibaru.id/${slug}/`,
    description: descM ? descM[1].replace(/<[^>]*>/g, "").trim() : null,
    totalEpisodes: null, status: "Unknown", genres: [], episodes: [],
    year: null, rating: null,
  }
}

// ── Consumet Type Normalizers ─────────────────────────────────

interface ConsumetSearchItem {
  id: string; title: string; url: string; image?: string; cover?: string
  totalEpisodes?: number; status?: string; genres?: string[]
}
interface ConsumetDetail extends ConsumetSearchItem {
  description?: string; releaseDate?: string; rating?: number
  episodes?: { id: string; number: number; title?: string; isFiller?: boolean }[]
}
interface ConsumetStream {
  sources?: { url: string; quality?: string; isM3U8?: boolean }[]
  subtitles?: { url: string; lang: string }[]
  intro?:  { start: number; end: number }
  outro?:  { start: number; end: number }
}

function normalizeSearch(r: ConsumetSearchItem, source: AnimeSource): AnimeSearchResult {
  return {
    id: r.id, title: r.title, altTitles: [], source,
    cover: r.image ?? r.cover ?? null, url: r.url,
    totalEpisodes: r.totalEpisodes ?? null,
    status: (r.status as AnimeSearchResult["status"]) ?? "Unknown",
    genres: r.genres ?? [],
  }
}

function normalizeDetail(r: ConsumetDetail, source: AnimeSource): AnimeDetail {
  return {
    ...normalizeSearch(r, source),
    description: r.description ?? null,
    year: r.releaseDate ? parseInt(r.releaseDate) : null,
    rating: r.rating ?? null,
    episodes: (r.episodes ?? []).map(e => ({
      id: e.id, number: e.number,
      title: e.title ?? null, isFiller: e.isFiller ?? false,
    })),
  }
}
