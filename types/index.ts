// types/index.ts - SORAKU 1.0.a3.1 FULL PRODUCTION SPEC
export type UserRole = 'OWNER' | 'MANAGER' | 'ADMIN' | 'AGENSI' | 'PREMIUM' | 'DONATE' | 'USER'

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

export interface UserSocialLinks {
  discord?: string
  github?: string
  spotify?: string
  twitter?: string
  youtube?: string
  max_links: number
}

export interface SiteSettings {
  primary_color: `#${string}`
  dark_base_color: `#${string}`
  secondary_color?: `#${string}`
  light_base_color?: `#${string}`
  accent_color?: `#${string}`
  theme_mode: 'dark' | 'light' | 'auto'
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

export interface VtuberData {
  slug: string
  name: string
  description: string
  image_url: string
  agency_id?: string
}

// 🎵 NEW: SPOTIFY INTEGRATION (MusicPlayer.tsx)
export interface SpotifyTrack {
  id: string
  name: string
  artist: string
  album: {
    name: string
    image: string
  }
  duration_ms: number
  preview_url?: string
  external_url?: string
  uri: string
}
