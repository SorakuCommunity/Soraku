import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    API_URL:                   z.string().default("http://localhost:4000"),
    SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
    BUNNY_STREAM_API_KEY:      z.string().optional(),
    BUNNY_STREAM_LIBRARY_ID:   z.string().optional(),
    BUNNY_STORAGE_ZONE:        z.string().optional(),
    BUNNY_STORAGE_API_KEY:     z.string().optional(),
    BUNNY_CDN_HOSTNAME:        z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL:      z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    NEXT_PUBLIC_SITE_URL:          z.string().default("https://soraku.live"),
    NEXT_PUBLIC_API_URL:           z.string().default("https://soraku-api.vercel.app"),
    NEXT_PUBLIC_BUNNY_CDN_URL:     z.string().optional(),
  },
  runtimeEnv: {
    API_URL:                       process.env.API_URL,
    SUPABASE_SERVICE_ROLE_KEY:     process.env.SUPABASE_SERVICE_ROLE_KEY,
    BUNNY_STREAM_API_KEY:          process.env.BUNNY_STREAM_API_KEY,
    BUNNY_STREAM_LIBRARY_ID:       process.env.BUNNY_STREAM_LIBRARY_ID,
    BUNNY_STORAGE_ZONE:            process.env.BUNNY_STORAGE_ZONE,
    BUNNY_STORAGE_API_KEY:         process.env.BUNNY_STORAGE_API_KEY,
    BUNNY_CDN_HOSTNAME:            process.env.BUNNY_CDN_HOSTNAME,
    NEXT_PUBLIC_SUPABASE_URL:      process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL:          process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_API_URL:           process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_BUNNY_CDN_URL:     process.env.NEXT_PUBLIC_BUNNY_CDN_URL,
  },
})
