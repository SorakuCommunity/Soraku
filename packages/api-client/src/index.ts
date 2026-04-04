// @soraku/api-client — API client untuk semua apps
// Re-export dari @soraku/utils dan tambahkan convenience functions

export { createApiClient, type ApiClientConfig, type SorakuApiClient } from "@soraku/utils"
export type {
  ApiResponse,
  PaginatedResponse,
  User,
  UserSession,
  Post,
  Event,
  GalleryItem,
  VTuber,
  StreamContent,
  Donatur,
  PremiumStatus,
  Notification,
  AnimeSearchResult,
  AnimeDetail,
  AnimeStreamResult,
  AnimeSource,
} from "@soraku/types"

import { createApiClient, type ApiClientConfig } from "@soraku/utils"

// ── Pre-configured Clients ─────────────────────────────────────

/**
 * Create API client untuk web app.
 * Otomatis inject token dari Supabase session.
 */
export function createWebClient(token?: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? ""
  return createApiClient({
    baseUrl: apiUrl,
    token,
  })
}

/**
 * Create API client untuk bot.
 * Pakai API key authentication.
 */
export function createBotClient() {
  const apiUrl = process.env.SORAKU_API_URL ?? ""
  const apiKey = process.env.BOT_API_KEY ?? ""
  return createApiClient({
    baseUrl: apiUrl,
    token: apiKey,
  })
}

/**
 * Create API client untuk stream app.
 */
export function createStreamClient(token?: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? ""
  return createApiClient({
    baseUrl: apiUrl,
    token,
  })
}

/**
 * Create API client untuk mobile app.
 */
export function createMobileClient(token?: string) {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? ""
  return createApiClient({
    baseUrl: apiUrl,
    token,
  })
}

/**
 * Create API client untuk internal service-to-service calls.
 * Pakai internal secret untuk autentikasi.
 */
export function createInternalClient(secret?: string) {
  const apiUrl = process.env.SORAKU_API_URL ?? process.env.API_URL ?? ""
  return createApiClient({
    baseUrl: apiUrl,
    internalSecret: secret ?? process.env.SORAKU_API_SECRET,
  })
}
