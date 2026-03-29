/**
 * apps/web — API Client
 * Koneksi ke services/api sebagai sumber data utama.
 *
 * Pakai di Server Components:
 *   import { api } from "@/lib/api-client"
 *   const { data } = await api.blog.list({ tag: "anime" })
 *
 * NOTE: Sengaja tidak import dari @soraku/utils agar tidak ada
 * dependency workspace yang perlu resolve di Vercel build.
 * createApiClient di-inline langsung di sini.
 */
import { env } from '@/env'

// ── Core Fetcher ──────────────────────────────────────────────
async function fetcher<T>(
  baseUrl: string,
  token: string | undefined,
  internalSecret: string | undefined,
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${baseUrl.replace(/\/$/, '')}${path}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) ?? {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (internalSecret) headers['x-soraku-secret'] = internalSecret

  const res = await fetch(url, { ...options, headers })
  if (!res.ok && res.status !== 404) {
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>
    const errMsg =
      (json?.error as Record<string, string>)?.message ??
      json?.error ??
      `API ${res.status}: ${path}`
    throw new Error(String(errMsg))
  }
  return res.json() as Promise<T>
}

function qs(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return ''
  const p = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) p.set(k, String(v))
  }
  const s = p.toString()
  return s ? `?${s}` : ''
}

function createApiClient(baseUrl: string, token?: string, internalSecret?: string) {
  const get = <T>(path: string) => fetcher<T>(baseUrl, token, internalSecret, path)
  const post = <T>(path: string, body: unknown) =>
    fetcher<T>(baseUrl, token, internalSecret, path, { method: 'POST', body: JSON.stringify(body) })
  const patch = <T>(path: string, body: unknown) =>
    fetcher<T>(baseUrl, token, internalSecret, path, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })

  return {
    health: () => get<{ status: string; version: string }>('/api'),

    users: {
      get: (username: string) => get(`/api/users/${username}`),
      update: (username: string, data: unknown) => patch(`/api/users/${username}`, data),
    },
    premium: {
      status: () => get('/api/premium'),
      leaderboard: (params?: { limit?: number }) =>
        get(`/api/premium${qs({ leaderboard: 'true', ...params })}`),
    },
    vtubers: {
      list: (params?: { islive?: boolean; page?: number; limit?: number }) =>
        get(`/api/vtubers${qs(params)}`),
      get: (slug: string) => get(`/api/vtubers/${slug}`),
    },
    events: {
      list: (params?: { status?: string; page?: number; limit?: number }) =>
        get(`/api/events${qs(params)}`),
      get: (slug: string) => get(`/api/events/${slug}`),
    },
    blog: {
      list: (params?: { search?: string; tag?: string; page?: number; limit?: number }) =>
        get(`/api/blog${qs(params)}`),
      get: (slug: string) => get(`/api/blog/${slug}`),
    },
    gallery: {
      list: (params?: { tag?: string; page?: number; limit?: number }) =>
        get(`/api/gallery${qs(params)}`),
    },
    stream: {
      list: (params?: {
        type?: string
        vtuberid?: string
        ispremium?: boolean
        page?: number
        limit?: number
      }) => get(`/api/stream${qs(params)}`),
      get: (slug: string) => get(`/api/stream/${slug}`),
    },
    anime: {
      search: (q: string, source = 'hianime', page = 1) =>
        get(`/api/stream${qs({ anime: 'true', q, source, page })}`),
      detail: (animeId: string, source = 'hianime') =>
        get(
          `/api/stream/${encodeURIComponent(animeId)}${qs({ anime: 'true', source, info: 'true' })}`
        ),
      episode: (episodeId: string, source = 'hianime', quality = 'auto') =>
        get(
          `/api/stream/${encodeURIComponent(episodeId)}${qs({ anime: 'true', source, quality })}`
        ),
      sources: () => get('/api/stream/sources'),
    },
    donate: {
      createXendit: (data: unknown) => post('/api/donate/xendit/create', data),
    },
  }
}

// ── Exported clients ──────────────────────────────────────────

/** Client publik — untuk data yang tidak perlu auth */
export const api = createApiClient(env.API_URL)

/** Client dengan Supabase JWT user — untuk data private/premium */
export function apiWithToken(token: string | undefined) {
  return createApiClient(env.API_URL, token)
}

/** Client internal — untuk komunikasi web ↔ bot via secret */
export function apiInternal() {
  return createApiClient(env.API_URL, undefined, env.SORAKU_API_SECRET ?? '')
}
