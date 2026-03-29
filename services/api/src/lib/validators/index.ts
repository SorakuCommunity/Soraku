import { z } from "zod"

// ── Common ───────────────────────────────────────────────────
export const PaginationSchema = z.object({
  page:  z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
})

// ── Users ────────────────────────────────────────────────────
export const UpdateUserSchema = z.object({
  displayname: z.string().max(50).optional(),
  bio:         z.string().max(500).optional(),
  avatarurl:   z.string().url().optional(),
  coverurl:    z.string().url().optional(),
  isprivate:   z.boolean().optional(),
  sociallinks: z.record(z.string(), z.string()).optional(),
})

// ── Blog ─────────────────────────────────────────────────────
export const BlogQuerySchema = PaginationSchema.extend({
  tag:    z.string().optional(),
  search: z.string().optional(),
})

// ── Events ───────────────────────────────────────────────────
export const EventQuerySchema = PaginationSchema.extend({
  status: z.enum(["online", "pending", "selesai"]).optional(),
})

// ── Gallery ──────────────────────────────────────────────────
export const GalleryQuerySchema = PaginationSchema.extend({
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  tag:    z.string().optional(),
})

// ── Stream ───────────────────────────────────────────────────
export const StreamQuerySchema = PaginationSchema.extend({
  type:      z.enum(["vod", "live", "clip"]).optional(),
  vtuberid:  z.string().uuid().optional(),
  ispremium: z.coerce.boolean().optional(),
})

// ── Donate / Xendit ──────────────────────────────────────────
export const XenditCreateSchema = z.object({
  amount:      z.number().min(10000),
  displayname: z.string().min(1).max(50),
  message:     z.string().max(200).optional(),
  tier:        z.enum(["DONATUR", "VIP", "VVIP"]),
})

// ── Trakteer Webhook ─────────────────────────────────────────
export const TrakteerWebhookSchema = z.object({
  supporter_name:    z.string(),
  supporter_message: z.string().optional(),
  total:             z.number(),
  unit:              z.string(),
  created_at:        z.string(),
})

// ── Anime Search (via external providers) ────────────────────
export const AnimeSearchQuerySchema = z.object({
  q:      z.string().min(1).max(200),
  source: z.enum(["gogoanime", "hianime", "animekai", "anibaru", "samehadaku"]).default("hianime"),
  page:   z.coerce.number().min(1).default(1),
})

// ── Blog Comments ────────────────────────────────────────────
export const CommentSchema = z.object({
  content:   z.string().min(1).max(2000),
  parentid:  z.string().uuid().optional(),
  guestname: z.string().max(50).optional(),
})
