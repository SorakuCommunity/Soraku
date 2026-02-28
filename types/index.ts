// types/index.ts - SORAKU 1.0.a3.1 ABSOLUTE FINAL FIXED
export type UserRole = 'OWNER' | 'MANAGER' | 'ADMIN' | 'AGENSI' | 'PREMIUM' | 'DONATE' | 'USER'

// 1. CORE USER SYSTEM
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

// 2. THEME SYSTEM
export interface SiteSettings {
  primary_color: `#${string}`
  dark_base_color: `#${string}`
  secondary_color?: `#${string}`
  light_base_color?: `#${string}`
  accent_color?: `#${string}`
  theme_mode: 'dark' | 'light' | 'auto'
}

// 3. GALLERY SYSTEM
export interface GalleryItem {
  id: string
  image_url: string
  caption: string
  approved: boolean
  approved_by?: string
  user_id: string
  created_at: string
}

// 4. VTUBER SYSTEM
export interface VtuberData {
  slug: string
  name: string
  description: string
  image_url: string
  agency_id?: string
}

// 5. SPOTIFY SYSTEM (FIXED)
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

// 6. DISCORD SYSTEM (COMPLETE - FIX onlineCount)
export interface DiscordStats {
  online: number
  onlineCount: number           // ✅ FIXED untuk DiscordSection.tsx line 62
  memberCount: number           // ✅ FIXED untuk DiscordSection.tsx line 46
  total_members: number         // ✅ Alias untuk useDiscord.ts
  voice_channels: number
  text_channels: number
  boost_count: number
  last_updated: string
}

// 7. GITHUB SYSTEM
export interface GitHubRepo {
  name: string
  description: string
  stars: number
  forks: number
  language: string
  html_url: string
}

// 8. BLOG SYSTEM
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

// 9. EVENT SYSTEM
export interface EventData {
  id: string
  title: string
  description: string
  date: string
  location: string
  status: 'ongoing' | 'upcoming' | 'finished'
}
