/**
 * ============================================================
 *  SORAKU COMMUNITY — PROPRIETARY & CONFIDENTIAL
 * ============================================================
 *  Boot-time environment variable validation — v1.0.a3
 *  Import this in server-side modules or layout to validate
 *  required env vars on startup, fail loud in dev, fail soft
 *  in prod (log + continue) to avoid full outage.
 * ============================================================
 */

import { z } from 'zod'

const envSchema = z.object({
  // ── Supabase (required) ──────────────────────────────────
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),

  // ── Supabase service role (server-only, optional — warn if missing) ──
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // ── Redis (required for caching + queues) ───────────────
  REDIS_URL: z.string().url('REDIS_URL must be a valid URL').optional(),

  // ── Discord (optional — features gracefully disabled) ────
  DISCORD_BOT_TOKEN: z.string().optional(),
  DISCORD_SERVER_ID: z.string().optional(),
  DISCORD_WEBHOOK_URL: z.string().url().optional().or(z.literal('')),

  // ── GitHub Discussions (optional) ───────────────────────
  GITHUB_TOKEN: z.string().optional(),
  GITHUB_REPO_OWNER: z.string().optional(),
  GITHUB_REPO_NAME: z.string().optional(),

  // ── Spotify (optional — Lofi player disabled if missing) ─
  SPOTIFY_CLIENT_ID: z.string().optional(),
  SPOTIFY_CLIENT_SECRET: z.string().optional(),
  SPOTIFY_REFRESH_TOKEN: z.string().optional(),
})

type Env = z.infer<typeof envSchema>

let _validated: Env | null = null

export function validateEnv(): Env {
  if (_validated) return _validated

  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    const errors = result.error.errors
      .map(e => `  • ${e.path.join('.')}: ${e.message}`)
      .join('\n')

    const message = `[Soraku] Environment validation failed:\n${errors}`

    if (process.env.NODE_ENV === 'production') {
      // In production, log but don't crash — individual features handle their own fallbacks
      console.error(message)
      // Return partial data (best-effort)
      _validated = process.env as unknown as Env
      return _validated
    } else {
      throw new Error(message)
    }
  }

  _validated = result.data
  return _validated
}

/** Check if all Spotify credentials are present */
export function hasSpotify(): boolean {
  return !!(
    process.env.SPOTIFY_CLIENT_ID &&
    process.env.SPOTIFY_CLIENT_SECRET &&
    process.env.SPOTIFY_REFRESH_TOKEN
  )
}

/** Check if Discord bot is configured */
export function hasDiscordBot(): boolean {
  return !!(process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_SERVER_ID)
}

/** Check if GitHub Discussions is configured */
export function hasGitHub(): boolean {
  return !!(
    process.env.GITHUB_TOKEN &&
    process.env.GITHUB_REPO_OWNER &&
    process.env.GITHUB_REPO_NAME
  )
}

/** Check if Redis is configured */
export function hasRedis(): boolean {
  return !!process.env.REDIS_URL
}
