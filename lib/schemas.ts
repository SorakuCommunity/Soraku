/**
 * lib/schemas.ts — Zod schemas (re-export + extended)
 * Kompatibel dengan semua import @/lib/schemas di repo
 */

import { z } from 'zod'
export * from './validations'

// ─── Profile Form Schema ──────────────────────────────────────────────────────
export const editProfileSchema = z.object({
  display_name: z.string().min(2).max(50).optional(),
  username:     z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  bio:          z.string().max(300).optional(),
  avatar_url:   z.string().url().optional().or(z.literal('')),
  cover_url:    z.string().url().optional().or(z.literal('')),
  theme_mode:   z.enum(['dark', 'light', 'auto']).optional(),
  socials:      z.record(z.string().url()).optional(),
  website:      z.string().url().optional().or(z.literal('')),
  location:     z.string().max(100).optional(),
})

// Aliases
export const profileSchema    = editProfileSchema
export const profileFormSchema = editProfileSchema

export type ProfileFormData    = z.infer<typeof editProfileSchema>
export type EditProfileData    = z.infer<typeof editProfileSchema>

// ─── Gallery Upload Schema ─────────────────────────────────────────────────────
export const galleryUploadSchema = z.object({
  title:       z.string().min(2).max(200),
  image_url:   z.string().url(),
  description: z.string().max(500).optional(),
  tags:        z.array(z.string().max(30)).max(10).optional(),
})
export type GalleryUploadData = z.infer<typeof galleryUploadSchema>

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
export type EventFormData = z.infer<typeof eventSchema>

// ─── Report Schema ─────────────────────────────────────────────────────────────
export const reportSchema = z.object({
  target_id:   z.string().uuid(),
  target_type: z.enum(['user', 'post', 'gallery', 'vtuber', 'event']),
  reason:      z.string().min(10).max(500),
})
export type ReportData = z.infer<typeof reportSchema>

// ─── Contact Schema ────────────────────────────────────────────────────────────
export const contactSchema = z.object({
  name:    z.string().min(2).max(100),
  email:   z.string().email(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(2000),
})
export type ContactData = z.infer<typeof contactSchema>

// ─── VTuber Schema ────────────────────────────────────────────────────────────
export const vtuberFormSchema = z.object({
  name:        z.string().min(2).max(100),
  slug:        z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  agency:      z.string().max(100).optional(),
  avatar_url:  z.string().url().optional(),
  cover_url:   z.string().url().optional(),
  socials:     z.record(z.string().url()).optional(),
  active:      z.boolean().default(true),
})
export type VTuberFormData = z.infer<typeof vtuberFormSchema>
