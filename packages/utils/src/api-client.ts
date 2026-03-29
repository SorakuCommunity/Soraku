/**
 * @soraku/utils — Shared API Client
 *
 * Dipakai oleh semua apps dan services:
 *   - apps/web     → import { createApiClient } from "@soraku/utils"
 *   - apps/stream  → import { createApiClient } from "@soraku/utils"
 *   - apps/mobile  → import { createApiClient } from "@soraku/utils"
 *   - services/bot → import { createApiClient } from "@soraku/utils"
 *
 * Usage:
 *   const api = createApiClient({ baseUrl: "https://soraku-api.vercel.app" })
 *   const { data } = await api.blog.list({ tag: "anime" })
 *   const { data } = await api.anime.search("naruto", "hianime")
 *   const { data } = await api.anime.episode("ep-id", "hianime")
 */

import type {
  ApiResponse, PaginatedResponse,
  User, Post, Event, GalleryItem, VTuber,
  StreamContent, Donatur, PremiumStatus,
  AnimeSearchResult, AnimeDetail, AnimeStreamResult, AnimeSource,
} from "@soraku/types"

// ── Config ────────────────────────────────────────────────────
export interface ApiClientConfig {
  /** URL services/api — contoh: https://soraku-api.vercel.app */
  baseUrl: string
  /**
   * Token auth — salah satu dari:
   * - Supabase JWT (user login dari Supabase Auth)
   * - API Key bot/mobile (prefix: sk_xxx / bot_xxx)
   */
  token?: string
  /** Untuk komunikasi internal web ↔ bot — pakai header x-soraku-secret */
  internalSecret?: string
}

// ── Core Fetcher ──────────────────────────────────────────────
async function fetcher<T>(
  config: ApiClientConfig,
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${config.baseUrl.replace(/\/$/, "")}${path}`

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> ?? {}),
  }

  if (config.token) headers["Authorization"] = `Bearer ${config.token}`
  if (config.internalSecret) headers["x-soraku-secret"] = config.internalSecret

  const res = await fetch(url, {
    ...options,
    headers,
    // Next.js fetch cache — default no-store untuk data realtime
    // Bisa di-override per call kalau mau revalidate
    next: (options as RequestInit & { next?: object }).next,
  })

  if (!res.ok && res.status !== 404) {
    const json = await res.json().catch(() => ({}))
    throw new Error(json?.error?.message ?? json?.error ?? `API ${res.status}: ${path}`)
  }

  return res.json() as Promise<T>
}

// ── Query String Helper ───────────────────────────────────────
function qs(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return ""
  const p = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) p.set(k, String(v))
  }
  const str = p.toString()
  return str ? `?${str}` : ""
}

// ── Client Factory ────────────────────────────────────────────
export function createApiClient(config: ApiClientConfig) {
  const get  = <T>(path: string, init?: RequestInit) => fetcher<T>(config, path, init)
  const post = <T>(path: string, body: unknown)      =>
    fetcher<T>(config, path, { method: "POST", body: JSON.stringify(body) })
  const patch = <T>(path: string, body: unknown)     =>
    fetcher<T>(config, path, { method: "PATCH", body: JSON.stringify(body) })
  const del  = <T>(path: string)                     =>
    fetcher<T>(config, path, { method: "DELETE" })

  return {
    // ── Health ───────────────────────────────────────────────
    health: () =>
      get<{ status: string; version: string; uptime: number }>("/api"),

    // ── Users ────────────────────────────────────────────────
    users: {
      get: (username: string) =>
        get<ApiResponse<User>>(`/api/users/${username}`),
      update: (username: string, data: Partial<User>) =>
        patch<ApiResponse<User>>(`/api/users/${username}`, data),
    },

    // ── Premium ──────────────────────────────────────────────
    premium: {
      status: () =>
        get<ApiResponse<PremiumStatus>>("/api/premium"),
      leaderboard: (params?: { limit?: number }) =>
        get<ApiResponse<Donatur[]>>(`/api/premium${qs({ leaderboard: "true", ...params })}`),
    },

    // ── VTubers ──────────────────────────────────────────────
    vtubers: {
      list: (params?: { islive?: boolean; page?: number; limit?: number }) =>
        get<ApiResponse<VTuber[]>>(`/api/vtubers${qs(params)}`),
      get: (slug: string) =>
        get<ApiResponse<VTuber>>(`/api/vtubers/${slug}`),
    },

    // ── Events ───────────────────────────────────────────────
    events: {
      list: (params?: { status?: string; page?: number; limit?: number }) =>
        get<ApiResponse<Event[]>>(`/api/events${qs(params)}`),
      get: (slug: string) =>
        get<ApiResponse<Event>>(`/api/events/${slug}`),
    },

    // ── Blog ─────────────────────────────────────────────────
    blog: {
      list: (params?: { search?: string; tag?: string; page?: number; limit?: number }) =>
        get<ApiResponse<Post[]>>(`/api/blog${qs(params)}`),
      get: (slug: string) =>
        get<ApiResponse<Post>>(`/api/blog/${slug}`),
    },

    // ── Gallery ──────────────────────────────────────────────
    gallery: {
      list: (params?: { tag?: string; page?: number; limit?: number }) =>
        get<ApiResponse<GalleryItem[]>>(`/api/gallery${qs(params)}`),
    },

    // ── Soraku Stream (VTuber VOD / live) ────────────────────
    stream: {
      list: (params?: { type?: string; vtuberid?: string; ispremium?: boolean; page?: number; limit?: number }) =>
        get<ApiResponse<StreamContent[]>>(`/api/stream${qs(params)}`),
      get: (slug: string) =>
        get<ApiResponse<StreamContent>>(`/api/stream/${slug}`),
    },

    // ── Anime (GogoAnime · HiAnime · Animekai · AniBaru) ─────
    anime: {
      /**
       * Cari anime dari provider eksternal.
       * @param q     Judul anime
       * @param source Default: "hianime"
       * @param page  Default: 1
       */
      search: (q: string, source: AnimeSource = "hianime", page = 1) =>
        get<ApiResponse<AnimeSearchResult[]>>(
          `/api/stream${qs({ anime: "true", q, source, page })}`
        ),

      /**
       * Detail anime + episode list.
       * @param animeId  ID / slug dari provider (contoh: "one-piece")
       * @param source   Default: "hianime"
       */
      detail: (animeId: string, source: AnimeSource = "hianime") =>
        get<ApiResponse<AnimeDetail>>(
          `/api/stream/${encodeURIComponent(animeId)}${qs({ anime: "true", source, info: "true" })}`
        ),

      /**
       * Stream sources untuk 1 episode.
       * Response berisi HLS (.m3u8) / MP4 URLs + subtitles + skip intro/outro.
       * @param episodeId  Episode ID dari provider
       * @param source     Default: "hianime"
       * @param quality    "auto" | "1080p" | "720p" | "360p"
       */
      episode: (episodeId: string, source: AnimeSource = "hianime", quality: "auto" | "1080p" | "720p" | "360p" = "auto") =>
        get<ApiResponse<AnimeStreamResult>>(
          `/api/stream/${encodeURIComponent(episodeId)}${qs({ anime: "true", source, quality })}`
        ),

      /**
       * Cek status semua anime sources (online / degraded / offline).
       */
      sources: () =>
        get<ApiResponse<{ source: AnimeSource; name: string; lang: string; status: string; url: string }[]>>(
          "/api/stream/sources"
        ),
    },

    // ── Donate ───────────────────────────────────────────────
    donate: {
      createXendit: (data: { amount: number; displayname: string; tier: string; message?: string }) =>
        post<ApiResponse<{ invoiceUrl: string; externalId: string }>>("/api/donate/xendit/create", data),
    },
  }
}

// ── Type export ───────────────────────────────────────────────
export type SorakuApiClient = ReturnType<typeof createApiClient>
