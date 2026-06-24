/**
 * env.ts — Soraku
 * Type-safe environment variable management via T3 Env + Zod.
 *
 * Import: import { env } from '@/env'
 *
 * Naming Convention:
 * - NEXT_PUBLIC_* = Client-side (Next.js)
 * - SUPABASE_* = Supabase
 * - SORAKU_* = Soraku API
 * - DB_* = Database
 * - XENDIT_* = Payment
 * - TRAKTEER_* = Donation
 *
 * @see https://env.t3.gg/docs/nextjs
 */

import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

const urlString = z.string().transform((s) => s.trim())

export const env = createEnv({
  server: {
    // Database
    DB_URL: z.string().optional(),

    // Supabase (Server)
    SUPABASE_SERVICE_KEY: z.string().optional(),

    // Soraku API
    SORAKU_SECRET: z.string().optional(),

    // Bot Communication
    BOT_WEBHOOK_URL: z.string().optional(),
    BOT_WEBHOOK_SECRET: z.string().optional(),

    // Umami Analytics
    UMAMI_API_TOKEN: z.string().optional(),

    // Tiktok
    TIKTOK_TOKEN: z.string().optional(),

    // Payment
    XENDIT_KEY: z.string().optional(),
    XENDIT_WEBHOOK: z.string().optional(),
    TRAKTEER_SECRET: z.string().optional(),

    // Discord (Server-side)
    OWNER_IDS: z.string().optional(),
    DISCORD_INVITE: z.string().optional(),
    D_EVENT_WEBHOOK: z.string().optional(),
    D_REGISTRATION_WEBHOOK: z.string().optional(),
    D_BLOG_WEBHOOK: z.string().optional(),
    D_FEEDBACK_WEBHOOK: z.string().optional(),

    // Contact Emails (Public)
    CONTACT_EMAIL: z.string().email().optional(),
    ADMIN_EMAIL: z.string().email().optional(),
  },

  client: {
    // Supabase (Client)
    NEXT_PUBLIC_SUPABASE_URL: urlString.pipe(z.string().url()).optional(),
    NEXT_PUBLIC_SUPABASE_KEY: z.string().optional(),

    // Site
    NEXT_PUBLIC_SITE_URL: urlString.pipe(z.string().url()),
    NEXT_PUBLIC_APP_URL: urlString.optional(),

    // Soraku API
    NEXT_PUBLIC_SORAKU_URL: z.string().url().optional(),

    // Discord (Client)
    NEXT_PUBLIC_DISCORD_INVITE: z.string().optional(),
  },

  runtimeEnv: {
    // Server
    DB_URL: process.env.DB_URL,
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
    SORAKU_SECRET: process.env.SORAKU_SECRET,
    BOT_WEBHOOK_URL: process.env.BOT_WEBHOOK_URL,
    BOT_WEBHOOK_SECRET: process.env.BOT_WEBHOOK_SECRET,
    TIKTOK_TOKEN: process.env.TIKTOK_TOKEN,
    UMAMI_API_TOKEN: process.env.UMAMI_API_TOKEN,
    XENDIT_KEY: process.env.XENDIT_KEY,
    XENDIT_WEBHOOK: process.env.XENDIT_WEBHOOK,
    TRAKTEER_SECRET: process.env.TRAKTEER_SECRET,
    OWNER_IDS: process.env.OWNER_IDS,
    DISCORD_INVITE: process.env.DISCORD_INVITE,
    D_EVENT_WEBHOOK: process.env.D_EVENT_WEBHOOK,
    D_REGISTRATION_WEBHOOK: process.env.D_REGISTRATION_WEBHOOK,
    D_BLOG_WEBHOOK: process.env.D_BLOG_WEBHOOK,
    D_FEEDBACK_WEBHOOK: process.env.D_FEEDBACK_WEBHOOK,
    CONTACT_EMAIL: process.env.CONTACT_EMAIL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,

    // Client
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SORAKU_URL: process.env.NEXT_PUBLIC_SORAKU_URL,
    NEXT_PUBLIC_DISCORD_INVITE: process.env.NEXT_PUBLIC_DISCORD_INVITE,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
})
