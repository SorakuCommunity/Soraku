// @soraku/config — Shared configuration
// Dipakai oleh: semua apps dan services

import { z } from "zod";

// ── App URLs ───────────────────────────────────────────────────

export const SORAKU_URLS = {
  web: process.env.NEXT_PUBLIC_SITE_URL ?? "https://soraku.vercel.app",
  stream: process.env.NEXT_PUBLIC_SITE_URL ?? "https://stream.soraku.id",
  api: process.env.SORAKU_URL ?? "https://apisoraku.vercel.app",
  discord: "https://discord.gg/soraku",
} as const;

// ── Shared Constants ───────────────────────────────────────────

export const APP_NAME = "Soraku";
export const APP_DESCRIPTION = "VTuber Community Ecosystem";
export const APP_VERSION = "1.5.0";

export const DISCORD_INVITE_CODE = "qm3XJvRa6B";
export const DISCORD_SERVER_ID = "1116971049045729302";

// ── Pagination ─────────────────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_PAGE_SIZE)
    .default(DEFAULT_PAGE_SIZE),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

// ── Roles ──────────────────────────────────────────────────────

export const USER_ROLES = [
  "OWNER",
  "MANAGER",
  "ADMIN",
  "AGENSI",
  "KREATOR",
  "USER",
] as const;
export const SUPPORTER_TIERS = ["DONATUR", "VIP", "VVIP"] as const;

// ── Env Schema (shared) ────────────────────────────────────────

export const sharedEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_KEY: z.string().min(1),
  SUPABASE_SERVICE_KEY: z.string().min(1),
});

export type SharedEnv = z.infer<typeof sharedEnvSchema>;
