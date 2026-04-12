// src/lib/anime.ts
// Anime data fetching via local API routes
// Sources: samehadaku, otakudesu, anibaru (Indonesia) → anify, gogoanime, hianime (English)

import type { AnimeSource } from "@soraku/types";

const API_BASE = "/api/anime";

async function fetchApi<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(path, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

// ── Search Anime ───────────────────────────────────────────────
export async function searchAnime(
  query: string,
  source: AnimeSource = "samehadaku",
  page = 1
): Promise<any[]> {
  const data = await fetchApi<{ results: any[] }>(
    `${API_BASE}/search/${source}?q=${encodeURIComponent(query)}&page=${page}`
  );
  return data?.results ?? [];
}

// ── Anime Detail ───────────────────────────────────────────────
export async function getAnimeDetail(
  animeId: string,
  source: AnimeSource = "samehadaku"
) {
  const data = await fetchApi<any>(
    `${API_BASE}/info/${source}/${encodeURIComponent(animeId)}`
  );
  return data ?? null;
}

// ── Episode Stream Sources ─────────────────────────────────────
export async function getEpisodeStream(
  episodeId: string,
  source: AnimeSource = "samehadaku",
  quality: "auto" | "1080p" | "720p" | "360p" = "auto"
) {
  const data = await fetchApi<{ streams: any[] }>(
    `${API_BASE}/episode/${source}/${encodeURIComponent(episodeId)}?quality=${quality}`
  );
  return data ?? null;
}

// ── Recent/Trending Anime ──────────────────────────────────────
export async function getRecentAnime(
  source: AnimeSource = "samehadaku",
  page = 1
) {
  const data = await fetchApi<{ results: any[] }>(
    `${API_BASE}/recent/${source}?page=${page}`
  );
  return data?.results ?? [];
}

// ── Source Status (mock for now) ────────────────────────────────
export async function getSourceStatus() {
  return [
    {
      source: "samehadaku",
      name: "Samehadaku",
      lang: "ID",
      status: "online",
      url: "https://samehadaku.email"
    },
    {
      source: "otakudesu",
      name: "Otakudesu",
      lang: "ID",
      status: "online",
      url: "https://otakudesu.animeupdates.me"
    },
    {
      source: "anibaru",
      name: "AniBaru",
      lang: "ID",
      status: "online",
      url: "https://anibaru.me"
    },
    {
      source: "anify",
      name: "Anify",
      lang: "EN",
      status: "online",
      url: "https://api.anify.eltik.cc"
    },
    {
      source: "gogoanime",
      name: "Gogoanime",
      lang: "EN",
      status: "online",
      url: "https://api.consumet.org"
    },
    {
      source: "hianime",
      name: "HiAnime",
      lang: "EN",
      status: "degraded",
      url: "https://api.hianime.to"
    }
  ];
}

// ── AniList Integration (GraphQL) ─────────────────────────────
const ANILIST_ENDPOINT = "https://graphql.anilist.co";

export async function anilistQuery<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T | null> {
  try {
    const res = await fetch(ANILIST_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 300 }
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as T;
  } catch {
    return null;
  }
}

export const ANILIST_QUERIES = {
  trending: `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
          id idMal title { romaji english native } coverImage { large }
          description status episodes genres averageScore season seasonYear
        }
      }
    }
  `,
  popular: `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
          id idMal title { romaji english native } coverImage { large }
          description status episodes genres averageScore season seasonYear
        }
      }
    }
  `,
  info: `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id idMal title { romaji english native } coverImage { large bannerImage }
        description status episodes duration genres averageScore season seasonYear
        studios { nodes { name } } relations { edges { relationType node { id title { romaji } } } }
      }
    }
  `,
  search: `
    query ($search: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, search: $search, isAdult: false) {
          id idMal title { romaji english native } coverImage { large }
          description status episodes genres averageScore
        }
      }
    }
  `,
  schedule: `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        airingSchedules(airingAt_greater: 0, sort: TIME) {
          episode airingAt media { id title { romaji english } coverImage { large } }
        }
      }
    }
  `
};

// ── Exports ────────────────────────────────────────────────────
export const ALL_SOURCES: AnimeSource[] = [
  "samehadaku",
  "otakudesu",
  "anibaru",
  "anify",
  "gogoanime",
  "hianime"
];
export const INDONESIAN_SOURCES: AnimeSource[] = [
  "samehadaku",
  "otakudesu",
  "anibaru"
];
export type { AnimeSource };
