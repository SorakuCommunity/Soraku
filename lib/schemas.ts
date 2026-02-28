/**
 * lib/schemas.ts — Zod schemas (re-export dari validations.ts)
 * File ini ada untuk kompatibilitas dengan import @/lib/schemas
 */

export * from './validations'

import { z } from 'zod'

// ─── Profile Edit Schema ───────────────────────────────────────────────────────
export const editProfileSchema = z.object({
  username:   z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  bio:        z.string().max(300).optional(),
  avatar_url: z.string().url().optional().or(z.literal('')),
  cover_url:  z.string().url().optional().or(z.literal('')),
  theme_mode: z.enum(['dark', 'light', 'auto']).optional(),
  socials:    z.record(z.string().url()).optional(),
})

// ─── Gallery Upload Schema ─────────────────────────────────────────────────────
export const galleryUploadSchema = z.object({
  title:     z.string().min(2).max(200),
  image_url: z.string().url(),
  tags:      z.array(z.string().max(30)).max(10).optional(),
})

// ─── Event Schema ──────────────────────────────────────────────────────────────
export const eventSchema = z.object({
  title:       z.string().min(3).max(200),
  slug:        z.string().min(3).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(2000).optional(),
  cover_url:   z.string().url().optional(),
  start_date:  z.string().datetime().optional(),
  end_date:    z.string().datetime().optional(),
  type:        z.enum(['online', 'offline', 'hybrid']).optional(),
  status:      z.enum(['draft', 'active', 'upcoming', 'ended']).optional(),
})

// ─── Contact / Report Schema ───────────────────────────────────────────────────
export const reportSchema = z.object({
  target_id:   z.string().uuid(),
  target_type: z.enum(['user', 'post', 'gallery', 'vtuber']),
  reason:      z.string().min(10).max(500),
})
