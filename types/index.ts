/**
 * types/index.ts — Global TypeScript types for Soraku
 */

// ─── Spotify ──────────────────────────────────────────────────────────────────
export interface SpotifyTrack {
  id:           string
  name:         string
  duration_ms:  number
  preview_url:  string | null
  external_urls: { spotify: string }
  album: {
    id:     string
    name:   string
    images: { url: string; width: number; height: number }[]
  }
  artists: { id: string; name: string }[]
}

export interface SpotifyAlbum {
  id:           string
  name:         string
  album_type:   string
  release_date: string
  total_tracks: number
  images:       { url: string; width: number; height: number }[]
  artists:      { id: string; name: string }[]
  tracks: {
    items: SpotifyTrack[]
  }
}

export interface SpotifyArtist {
  id:         string
  name:       string
  followers:  { total: number }
  popularity: number
  images:     { url: string; width: number; height: number }[]
  genres:     string[]
  external_urls: { spotify: string }
}

// ─── User / Auth ──────────────────────────────────────────────────────────────
export type Role = 'OWNER' | 'MANAGER' | 'ADMIN' | 'AGENSI' | 'PREMIUM' | 'DONATE' | 'USER'
export type ThemeMode = 'dark' | 'light' | 'auto'

export interface UserProfile {
  id:           string
  username:     string
  display_name: string | null
  bio:          string | null
  avatar_url:   string | null
  cover_url:    string | null
  role:         Role
  theme_mode:   ThemeMode
  website:      string | null
  location:     string | null
  created_at:   string
  updated_at:   string | null
  socials?:     Record<string, string>
}

// ─── Blog ─────────────────────────────────────────────────────────────────────
export interface BlogPost {
  id:          string
  title:       string
  slug:        string
  content:     string
  excerpt:     string | null
  cover_image: string | null
  spotify_id:  string | null
  published:   boolean
  created_at:  string
  updated_at:  string | null
  author_id:   string
  author?:     Pick<UserProfile, 'username' | 'display_name' | 'avatar_url'>
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
export interface GalleryItem {
  id:          string
  title:       string
  image_url:   string
  description: string | null
  tags:        string[] | null
  approved:    boolean
  created_at:  string
  user_id:     string
  author?:     Pick<UserProfile, 'username' | 'display_name' | 'avatar_url'>
}

// ─── VTuber ───────────────────────────────────────────────────────────────────
export interface VTuber {
  id:          string
  name:        string
  slug:        string
  description: string | null
  agency:      string | null
  avatar_url:  string | null
  cover_url:   string | null
  socials:     Record<string, string> | null
  active:      boolean
  created_at:  string
}

// ─── Event ────────────────────────────────────────────────────────────────────
export interface SorakuEvent {
  id:          string
  title:       string
  slug:        string
  description: string | null
  cover_url:   string | null
  start_date:  string | null
  end_date:    string | null
  type:        'online' | 'offline' | 'hybrid'
  status:      'draft' | 'active' | 'upcoming' | 'ended'
  created_at:  string
}

// ─── Site Settings ────────────────────────────────────────────────────────────
export interface SiteSetting {
  key:        string
  value:      string
  updated_at: string | null
}

// ─── GitHub ───────────────────────────────────────────────────────────────────
export interface GitHubDiscussion {
  id:            string
  number:        number
  title:         string
  url:           string
  createdAt:     string
  bodyHTML?:     string
  author:        { login: string; avatarUrl: string }
  category:      { name: string; emoji: string }
  upvoteCount:   number
  comments:      { totalCount?: number; nodes?: GitHubComment[] }
}

export interface GitHubComment {
  id:        string
  bodyHTML:  string
  createdAt: string
  author:    { login: string; avatarUrl: string }
}

// ─── Discord ──────────────────────────────────────────────────────────────────
export interface DiscordStats {
  id:                         string
  name:                       string
  icon:                       string | null
  approximate_member_count:   number
  approximate_presence_count: number
}

// ─── API Response ─────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  data?:    T
  error?:   string
  success?: boolean
  count?:   number
  page?:    number
}

// ─── Theme ────────────────────────────────────────────────────────────────────
export interface ThemePalette {
  primary_color:    string
  dark_base_color:  string
  secondary_color:  string
  light_base_color: string
  accent_color:     string
  theme_mode:       ThemeMode
}
