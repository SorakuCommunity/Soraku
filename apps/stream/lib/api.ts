// @soraku/stream-api - API client for streaming app
// Connects to centralized Soraku API: https://apisoraku.vercel.app

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SORAKU_URL || "https://apisoraku.vercel.app";

// ── Types ────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  error: string | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface AnimeSearchResult {
  id: string;
  title: string;
  cover: string | null;
  source: string;
  url: string;
  totalEpisodes: number | null;
  status: string;
  genres: string[];
}

export interface AnimeDetail extends AnimeSearchResult {
  description: string | null;
  episodes: AnimeEpisode[];
  year: number | null;
  rating: number | null;
}

export interface AnimeEpisode {
  id: string;
  number: number;
  title: string | null;
}

export interface AnimeStreamResult {
  episodeId: string;
  source: string;
  streams: {
    url: string;
    quality: string;
    isM3U8: boolean;
  }[];
  subtitles: { url: string; lang: string }[];
}

export interface WatchHistory {
  id: string;
  animeId: string;
  animeTitle: string;
  cover: string | null;
  episode: number;
  progress: number;
  duration: number;
  provider: string;
  updatedAt: string;
}

export interface Favorite {
  id: string;
  animeId: string;
  title: string;
  cover: string | null;
  addedAt: string;
}

// ── Fetcher ───────────────────────────────────────────────────────────────

async function fetcher<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL.replace(/\/$/, "")}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  if (!res.ok && res.status !== 404) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json?.error ?? `API Error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ── API Client ──────────────────────────────────────────────────────────

export const api = {
  // ── Anime Streaming ─────────────────────────────────────────────────
  anime: {
    search: async (query: string, source = "hianime", page = 1) => {
      return fetcher<ApiResponse<AnimeSearchResult[]>>(
        `/api/stream?anime=true&q=${encodeURIComponent(query)}&source=${source}&page=${page}`
      );
    },

    detail: async (animeId: string, source = "hianime") => {
      return fetcher<ApiResponse<AnimeDetail>>(
        `/api/stream/${encodeURIComponent(animeId)}?anime=true&source=${source}&info=true`
      );
    },

    episode: async (
      episodeId: string,
      source = "hianime",
      quality = "auto"
    ) => {
      return fetcher<ApiResponse<AnimeStreamResult>>(
        `/api/stream/${encodeURIComponent(episodeId)}?anime=true&source=${source}&quality=${quality}`
      );
    },

    sources: async () => {
      return fetcher<ApiResponse<{ source: string; status: string }[]>>(
        "/api/stream?anime=true&sources=true"
      );
    }
  },

  // ── Watch History ───────────────────────────────────────────────────
  watchHistory: {
    get: async () => {
      return fetcher<ApiResponse<WatchHistory[]>>("/api/stream/watch-history");
    },

    update: async (data: {
      animeId: string;
      episode: number;
      progress: number;
      duration: number;
      provider: string;
    }) => {
      return fetcher<ApiResponse<{ saved: boolean }>>(
        "/api/stream/watch-history",
        {
          method: "POST",
          body: JSON.stringify(data)
        }
      );
    }
  },

  // ── Favorites ───────────────────────────────────────────────────────
  favorites: {
    get: async () => {
      return fetcher<ApiResponse<Favorite[]>>("/api/stream/favorites");
    },

    add: async (data: { animeId: string; title: string; cover?: string }) => {
      return fetcher<ApiResponse<{ saved: boolean }>>("/api/stream/favorites", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },

    remove: async (animeId: string) => {
      return fetcher<ApiResponse<{ removed: boolean }>>(
        `/api/stream/favorites/${encodeURIComponent(animeId)}`,
        { method: "DELETE" }
      );
    }
  },

  // ── Community (optional - for user badges, etc.) ──────────────────
  community: {
    premium: {
      status: async () => {
        return fetcher<
          ApiResponse<{
            supporterrole: string | null;
            supportersince: string | null;
            supporteruntil: string | null;
            isActive: boolean;
          }>
        >("/api/community/premium");
      },

      leaderboard: async () => {
        return fetcher<
          ApiResponse<
            {
              displayname: string;
              amount: number;
              tier: string;
            }[]
          >
        >("/api/community/premium?leaderboard=true");
      }
    }
  }
};

export default api;
