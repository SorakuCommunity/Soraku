// types/index.ts — SORAKU v1.0.a3.5 — Aligned with schema.sql
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
  instagram?: string
  twitter?: string
  youtube?: string
  tiktok?: string
  website?: string
  max_links: number
}

// 2. SITE SETTINGS
export interface SiteSetting {
  key: string
  value: string
}

export interface SiteSettingsObject {
  primary_color:    `#${string}`
  dark_base_color:  `#${string}`
  secondary_color?: `#${string}`
  light_base_color?:`#${string}`
  accent_color?:    `#${string}`
  theme_mode: 'dark' | 'light' | 'auto'
}

// 3. GALLERY SYSTEM — matches gallery table schema
export interface GalleryItem {
  id:          string
  user_id:     string
  title:       string           // real column name
  image_url:   string
  tags:        string[] | null
  approved:    boolean
  approved_by?: string | null
  likes:       number
  created_at:  string
}

// 4. VTUBER SYSTEM
export interface VtuberData {
  slug:        string
  name:        string
  description: string
  image_url:   string
  agency_id?:  string
  active:      boolean
}

// 5. SPOTIFY SYSTEM
export interface SpotifyTrack {
  id:          string
  name:        string
  artists:     Array<{ name: string; id: string }>
  album: {
    name:   string
    images: Array<{ url: string; width: number; height: number }>
  }
  duration_ms:  number
  preview_url?: string
  external_url?: string
  uri:          string
}

// 6. DISCORD SYSTEM
export interface DiscordStats {
  id?:                          string
  name?:                        string
  icon?:                        string | null
  icon_url?:                    string | null
  online:                       number
  onlineCount:                  number
  memberCount:                  number
  total_members:                number
  approximate_member_count:     number
  approximate_presence_count:   number
  voice_channels:               number
  text_channels:                number
  boost_count:                  number
  last_updated:                 string
  online_members?:              Array<{
    id: string; username: string; avatar_url: string; status?: string
  }>
}

// 7. GITHUB SYSTEM
export interface GitHubRepo {
  name:        string
  description: string
  stars:       number
  forks:       number
  language:    string
  html_url:    string
}

// 8. BLOG SYSTEM
export interface BlogPost {
  id:               string
  slug:             string
  title:            string
  excerpt:          string
  content:          string
  cover_image?:     string | null
  author_id:        string
  published:        boolean
  published_at?:    string
  spotify_track_id?: string
  created_at:       string
}

// 9. EVENT SYSTEM
export interface EventData {
  id:          string
  title:       string
  description: string
  date:        string
  start_date?: string
  cover_url?:  string | null
  slug?:       string
  location:    string
  status:      'active' | 'upcoming' | 'ended' | 'draft'
}

// 10. COOKIE TYPE
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
