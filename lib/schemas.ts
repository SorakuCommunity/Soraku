import { z } from 'zod'

const urlOrEmpty = z.string().refine(
  v => v === '' || (() => {
    try { const u = new URL(v); return ['http:', 'https:'].includes(u.protocol) } catch { return false }
  })(),
  { message: 'URL tidak valid' }
).optional().nullable()

export const profileSchema = z.object({
  display_name: z.string().min(1, 'Wajib diisi').max(50),
  username: z.string()
    .min(3, 'Min 3 karakter')
    .max(30, 'Maks 30 karakter')
    .regex(/^[a-zA-Z0-9_]+$/, 'Hanya huruf, angka, underscore'),
  bio: z.string().max(200).optional().nullable(),
  official_website: urlOrEmpty,
  twitter: urlOrEmpty,
  instagram: urlOrEmpty,
  tiktok: urlOrEmpty,
  youtube: urlOrEmpty,
  twitch: urlOrEmpty,
  facebook: urlOrEmpty,
  discord_invite: urlOrEmpty,
  threads: urlOrEmpty,
  reddit: urlOrEmpty,
  spotify: urlOrEmpty,
  saweria: urlOrEmpty,
  trakteer: urlOrEmpty,
  sociabuzz: urlOrEmpty,
  kofi: urlOrEmpty,
  patreon: urlOrEmpty,
  streamlabs: urlOrEmpty,
  paypal: urlOrEmpty,
  fanart_gallery: urlOrEmpty,
  fan_submission: urlOrEmpty,
  merchandise: urlOrEmpty,
})
export type ProfileFormData = z.infer<typeof profileSchema>

export const blogSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi').max(200),
  slug: z.string().min(1, 'Slug wajib diisi').regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, tanda hubung'),
  thumbnail: z.string().optional().nullable(),
  content: z.string().min(10, 'Konten terlalu pendek'),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published']),
})
export type BlogFormData = z.infer<typeof blogSchema>

export const eventSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi').max(200),
  description: z.string().optional().nullable(),
  banner_url: z.string().optional().nullable(),
  start_date: z.string().min(1, 'Tanggal mulai wajib diisi'),
  end_date: z.string().min(1, 'Tanggal selesai wajib diisi'),
}).refine(d => new Date(d.end_date) >= new Date(d.start_date), {
  message: 'Tanggal selesai harus setelah tanggal mulai',
  path: ['end_date'],
})
export type EventFormData = z.infer<typeof eventSchema>

export const vtuberSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi').max(100),
  generation: z.string().optional().nullable(),
  avatar_url: urlOrEmpty,
  description: z.string().max(1000).optional().nullable(),
  twitter: urlOrEmpty,
  youtube: urlOrEmpty,
  twitch: urlOrEmpty,
  instagram: urlOrEmpty,
  tiktok: urlOrEmpty,
})
export type VtuberFormData = z.infer<typeof vtuberSchema>

export const galleryUploadSchema = z.object({
  caption: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
  hashtags: z.array(z.string()).default([]),
})
export type GalleryUploadFormData = z.infer<typeof galleryUploadSchema>
