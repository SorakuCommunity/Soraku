// lib/anilist.ts — AniList GraphQL client (gratis, no API key)
const ANILIST_API = "https://graphql.anilist.co"

const MEDIA_FRAGMENT = `
  id title { romaji english native } coverImage { large extraLarge color }
  bannerImage description genres averageScore popularity episodes
  status season seasonYear format isAdult nextAiringEpisode { episode airingAt }
`

async function query<T>(q: string, variables?: object): Promise<T | null> {
  try {
    const res = await fetch(ANILIST_API, {
      method:  "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body:    JSON.stringify({ query: q, variables }),
      next:    { revalidate: 3600 }, // 1 hour cache
    })
    if (!res.ok) return null
    const { data } = await res.json()
    return data as T
  } catch { return null }
}

// ── Trending ────────────────────────────────────────────────────
export async function getTrending(page = 1, perPage = 20) {
  const data = await query<any>(`
    query($page:Int $perPage:Int) {
      Page(page:$page perPage:$perPage) {
        media(sort:TRENDING_DESC type:ANIME isAdult:false) {
          ${MEDIA_FRAGMENT}
        }
      }
    }
  `, { page, perPage })
  return data?.Page?.media ?? []
}

// ── Popular ─────────────────────────────────────────────────────
export async function getPopular(page = 1, perPage = 20) {
  const data = await query<any>(`
    query($page:Int $perPage:Int) {
      Page(page:$page perPage:$perPage) {
        media(sort:POPULARITY_DESC type:ANIME isAdult:false) {
          ${MEDIA_FRAGMENT}
        }
      }
    }
  `, { page, perPage })
  return data?.Page?.media ?? []
}

// ── Currently Airing ────────────────────────────────────────────
export async function getAiring(page = 1, perPage = 20) {
  const data = await query<any>(`
    query($page:Int $perPage:Int) {
      Page(page:$page perPage:$perPage) {
        media(status:RELEASING sort:POPULARITY_DESC type:ANIME isAdult:false) {
          ${MEDIA_FRAGMENT}
        }
      }
    }
  `, { page, perPage })
  return data?.Page?.media ?? []
}

// ── Search ──────────────────────────────────────────────────────
export async function searchAniList(q: string, page = 1, perPage = 20) {
  const data = await query<any>(`
    query($search:String $page:Int $perPage:Int) {
      Page(page:$page perPage:$perPage) {
        media(search:$search type:ANIME isAdult:false) {
          ${MEDIA_FRAGMENT}
        }
      }
    }
  `, { search: q, page, perPage })
  return data?.Page?.media ?? []
}

// ── Single anime by ID ──────────────────────────────────────────
export async function getAnimeById(id: number) {
  const data = await query<any>(`
    query($id:Int) {
      Media(id:$id type:ANIME) {
        ${MEDIA_FRAGMENT}
        characters(sort:ROLE perPage:6) {
          nodes { name { full } image { large } }
        }
        relations {
          edges {
            relationType
            node { id title { romaji } coverImage { large } type format }
          }
        }
        studios(isMain:true) { nodes { name } }
        startDate { year month day }
        endDate   { year month day }
        duration trailer { id site }
        source synonyms tags { name rank } score:meanScore
      }
    }
  `, { id })
  return data?.Media ?? null
}

export type AniListMedia = {
  id: number
  title: { romaji: string; english: string | null; native: string }
  coverImage: { large: string; extraLarge: string; color: string | null }
  bannerImage: string | null
  description: string | null
  genres: string[]
  averageScore: number | null
  popularity: number
  episodes: number | null
  status: string
  season: string | null
  seasonYear: number | null
  format: string | null
  nextAiringEpisode: { episode: number; airingAt: number } | null
}
