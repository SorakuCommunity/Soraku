// types/index.ts - SORAKU 1.0.a3.1 USESTORE ARRAY FIX
export type UserRole = 'OWNER' | 'MANAGER' | 'ADMIN' | 'AGENSI' | 'PREMIUM' | 'DONATE' | 'USER'

// 1. CORE USER SYSTEM
export interface User {
  id: string
  email: string | null
  username?: string | null
  full_name?: string | null
  role?: UserRole
  theme_mode?: 'dark' | 'light' | 'auto'
  created_at: string
}

export interface UserWithRole extends User {
  role: UserRole
  social_links?: UserSocialLinks[]
}

export interface UserSocialLinks {
  discord?: string
  github?: string
  spotify?: string
  twitter?: string
  youtube?: string
  max_links: number
}

// 2. SITE SETTINGS - KEY-VALUE ARRAY (useStore.ts REQUIRED)
export interface SiteSetting {
  key: string           // ✅ "primary_color", "dark_base_color", etc
  value: string         // ✅ "#4FA3D1", "#1C1E22", etc
}

// 3. DB THEME OBJECT (untuk admin panel)
export interface SiteSettingsObject {
  primary_color: `#${string}`
  dark_base_color: `#${string}`
  secondary_color?: `#${string}`
  light_base_color?: `#${string}`
  accent_color?: `#${string}`
  theme_mode: 'dark' | 'light' | 'auto'
}

// 4. GALLERY SYSTEM
export interface GalleryItem {
  id: string
  image_url: string
  caption: string
  approved: boolean
  approved_by?: string
  user_id: string
  created_at: string
}

// 5. VTUBER SYSTEM
export interface VtuberData {
  slug: string
  name: string
  description: string
  image_url: string
  agency_id?: string
}

// 6. SPOTIFY SYSTEM
export interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{
    name: string
    id: string
  }>
  album: {
    name: string
    images: Array<{
      url: string
      width: number
      height: number
    }>
  }
  duration_ms: number
  preview_url?: string
  external_url?: string
  uri: string
}

// 7. DISCORD SYSTEM
export interface DiscordStats {
  online: number
  onlineCount: number
  memberCount: number
  total_members: number
  voice_channels: number
  text_channels: number
  boost_count: number
  last_updated: string
}

// 8. GITHUB SYSTEM
export interface GitHubRepo {
  name: string
  description: string
  stars: number
  forks: number
  language: string
  html_url: string
}

// 9. BLOG SYSTEM
export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author_id: string
  published: boolean
  published_at?: string
  spotify_track_id?: string
}

// 10. EVENT SYSTEM
export interface EventData {
  id: string
  title: string
  description: string
  date: string
  location: string
  status: 'ongoing' | 'upcoming' | 'finished'
}

// 11. COOKIE TYPE - SUPABASE SSR + MIDDLEWARE
export interface Cookie {
  name: string
  value: string
  options?: {
    httpOnly?: boolean
    secure?: boolean
    sameSite?: 'lax' | 'strict' | 'none'
    maxAge?: number
    path?: string
  }
}
