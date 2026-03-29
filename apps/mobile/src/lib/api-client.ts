/**
 * apps/mobile — API Client (React Native / Expo)
 * Mobile app konek ke services/api — sama persis dengan web/stream.
 *
 * Token didapat dari Supabase Auth di mobile:
 *   const session = await supabase.auth.getSession()
 *   const client  = apiWithToken(session.data.session?.access_token)
 *
 * Pakai di screens/components:
 *   import { api, apiWithToken } from "@/lib/api-client"
 *   const { data } = await api.stream.list({ type: "vod" })
 */
import { createApiClient } from "@soraku/utils"

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000"

/** Client publik */
export const api = createApiClient({ baseUrl: API_URL })

/** Client dengan JWT user — premium content, profile update */
export function apiWithToken(token: string) {
  return createApiClient({ baseUrl: API_URL, token })
}
