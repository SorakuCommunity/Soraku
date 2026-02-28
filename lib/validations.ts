import { z } from 'zod'

export const hexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color like #4FA3D1')

export const themeModeSchema = z.enum(['dark', 'light', 'auto'])

export const profileUpdateSchema = z.object({
  bio:        z.string().max(300).optional(),
  theme_mode: themeModeSchema.optional(),
  socials:    z.array(z.object({
    platform: z.string().max(30),
    url:      z.string().url(),
  })).optional(),
})

export const blogPostSchema = z.object({
  title:       z.string().min(3).max(200),
  slug:        z.string().min(3).max(100).regex(/^[a-z0-9-]+$/),
  content:     z.string().min(10),
  excerpt:     z.string().max(400).optional(),
  cover_image: z.string().url().optional(),
  spotify_id:  z.string().max(100).optional(),
  published:   z.boolean().default(false),
})

export const vtuberSchema = z.object({
  name:        z.string().min(2).max(100),
  slug:        z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  agency:      z.string().max(100).optional(),
  avatar_url:  z.string().url().optional(),
  cover_url:   z.string().url().optional(),
  socials:     z.record(z.string().url()).optional(),
  active:      z.boolean().default(true),
})

export const galleryItemSchema = z.object({
  title:     z.string().min(2).max(200),
  image_url: z.string().url(),
  tags:      z.array(z.string().max(30)).max(10).optional(),
})

export const adminThemeSchema = z.object({
  primary_color:    hexColorSchema.optional(),
  dark_base_color:  hexColorSchema.optional(),
  secondary_color:  hexColorSchema.optional(),
  light_base_color: hexColorSchema.optional(),
  accent_color:     hexColorSchema.optional(),
  theme_mode:       themeModeSchema.optional(),
})

export const loginSchema = z.object({
  // accepts email OR username
  identifier: z.string().min(2, 'Email atau username harus diisi'),
  password:   z.string().min(8, 'Password minimal 8 karakter'),
})

// Legacy compat — some imports use { email, password }
export const loginEmailSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(8),
})

export const registerSchema = loginSchema.extend({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/),
  password: z.string().min(8).max(128),
})
