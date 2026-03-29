import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    // Database — Supabase Transaction Pooler (port 6543)
    DATABASE_URL: z.string().url(),

    // Supabase
    SUPABASE_URL:              z.string().url(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

    // Secret untuk auth antar service (web ↔ api ↔ bot)
    SORAKU_API_SECRET: z.string().min(32),

    // Payment (opsional)
    XENDIT_SECRET_KEY:       z.string().optional(),
    TRAKTEER_WEBHOOK_SECRET: z.string().optional(), // renamed dari TOKEN

    // CORS — comma-separated origins yang diizinkan
    // Contoh: https://soraku.vercel.app,https://stream.soraku.vercel.app
    CORS_ORIGINS: z.string().optional(),

    // Consumet API — untuk anime streaming data (self-hosted atau public)
    // https://github.com/consumet/consumet.ts
    CONSUMET_API_URL: z.string().url().optional(),

    // Upstash Redis — caching anime data (free tier cukup)
    UPSTASH_REDIS_REST_URL:   z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  },
  client: {},
  runtimeEnv: {
    DATABASE_URL:              process.env.DATABASE_URL,
    SUPABASE_URL:              process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SORAKU_API_SECRET:         process.env.SORAKU_API_SECRET,
    XENDIT_SECRET_KEY:         process.env.XENDIT_SECRET_KEY,
    TRAKTEER_WEBHOOK_SECRET:   process.env.TRAKTEER_WEBHOOK_SECRET,
    CORS_ORIGINS:              process.env.CORS_ORIGINS,
    CONSUMET_API_URL:          process.env.CONSUMET_API_URL,
    UPSTASH_REDIS_REST_URL:   process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    NODE_ENV:                  process.env.NODE_ENV,
  },
  skipValidation:         !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
})
