// @soraku/database — Database config dan ORM setup
// Dipakai oleh: services/api, apps/web (server components)

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// ── Supabase Client Factory ───────────────────────────────────

export interface DatabaseConfig {
  url: string
  anonKey: string
  serviceRoleKey?: string
  schema?: string
}

/**
 * Create Supabase client dengan schema soraku (default).
 * Untuk server-side usage.
 */
export function createDbClient(config: DatabaseConfig): SupabaseClient {
  return createClient(config.url, config.serviceRoleKey ?? config.anonKey, {
    db: { schema: config.schema ?? "soraku" },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Create Supabase client untuk schema bot.
 */
export function createBotDbClient(config: DatabaseConfig): SupabaseClient {
  return createClient(config.url, config.serviceRoleKey ?? config.anonKey, {
    db: { schema: "bot" },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Create Supabase client untuk schema streaming.
 * Menggunakan Supabase Project 2.
 */
export function createStreamDbClient(config: DatabaseConfig): SupabaseClient {
  return createClient(config.url, config.serviceRoleKey ?? config.anonKey, {
    db: { schema: "soraku" },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// ── Re-exports ─────────────────────────────────────────────────

export { createClient } from "@supabase/supabase-js"
export type { SupabaseClient } from "@supabase/supabase-js"
