import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Database
    DB_URL: z.string().optional(), // Komunitas DB (optional for dev)
    DB_STREAM_URL: z.string().optional(), // Streaming DB

    // Supabase
    SUPABASE_URL: z.string().url().optional(),
    SUPABASE_SERVICE_KEY: z.string().optional(),

    // Soraku API Secret (shared)
    SORAKU_SECRET: z.string().min(32).optional(),

    // Payment
    XENDIT_KEY: z.string().optional(),
    TRAKTEER_SECRET: z.string().optional(),

    // CORS
    CORS_ORIGINS: z.string().optional(),

    // Consumet API
    CONSUMET_API_URL: z.string().url().optional(),

    // Anify API
    ANIFY_API_URL: z.string().url().optional(),

    // Redis
    REDIS_URL: z.string().url().optional(),
    REDIS_TOKEN: z.string().optional(),

    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  client: {},
  runtimeEnv: {
    DB_URL: process.env.DB_URL,
    DB_STREAM_URL: process.env.DB_STREAM_URL,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
    SORAKU_SECRET: process.env.SORAKU_SECRET,
    XENDIT_KEY: process.env.XENDIT_KEY,
    TRAKTEER_SECRET: process.env.TRAKTEER_SECRET,
    CORS_ORIGINS: process.env.CORS_ORIGINS,
    CONSUMET_API_URL: process.env.CONSUMET_API_URL,
    ANIFY_API_URL: process.env.ANIFY_API_URL,
    REDIS_URL: process.env.REDIS_URL,
    REDIS_TOKEN: process.env.REDIS_TOKEN,
    NODE_ENV: process.env.NODE_ENV,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
