// types/index.ts - Soraku 1.0.a3.1 FULL SPEC
export type UserRole = 'OWNER' | 'MANAGER' | 'ADMIN' | 'AGENSI' | 'PREMIUM' | 'DONATE' | 'USER'

// CORE USER + THEME
export interface UserWithRole {
  id: string
  email: string | null
  username?: string | null
  full_name?: string | null
  role: UserRole
  theme_mode: 'dark' | 'light' | 'auto'
  social_links?: UserSocialLinks[]
  created_at: string
}

// SOCIAL - Premium unlimited (DB trigger enforced)
export interface UserSocialLinks {
  discord?: string
  github?: string
  spotify?: string
  twitter?: string
  youtube?: string
  max_links: number
}

// THEME SYSTEM - Admin + User control
export interface SiteSettings {
  primary_color: `#${string}` // Zod hex validation
  dark_base_color: `#${string}`
  secondary_color?: `#${string}`
  light_base_color?: `#${string}`
  accent_color?: `#${string}`
  theme_mode: 'dark' | 'light' | 'auto'
}

export interface ThemePalette extends SiteSettings {}

// VTUBER + GALLERY
export interface VtuberData {
  slug: string
  name: string
  description: string
  image_url: string
  agency_id?: string
}

export interface GalleryItem {
  id: string
  image_url: string
  caption: string
  approved: boolean
  approved_by?: string
  user_id: string
  created_at: string
}