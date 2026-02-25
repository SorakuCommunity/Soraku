export type UserRole = 'OWNER' | 'MANAGER' | 'ADMIN' | 'AGENSI' | 'PREMIUM' | 'DONATE' | 'USER'
export type GalleryStatus = 'pending' | 'approved' | 'rejected'
export type BlogStatus = 'draft' | 'published'

export interface User {
  id: string
  email: string | null
  display_name: string | null
  username: string | null
  avatar_url: string | null
  bio: string | null
  role: UserRole
  official_website: string | null
  generation_page: string | null
  talent_profile: string | null
  lore_archive: string | null
  schedule_page: string | null
  twitter: string | null
  instagram: string | null
  tiktok: string | null
  youtube: string | null
  twitch: string | null
  facebook: string | null
  discord_invite: string | null
  threads: string | null
  reddit: string | null
  spotify: string | null
  saweria: string | null
  trakteer: string | null
  sociabuzz: string | null
  kofi: string | null
  patreon: string | null
  streamlabs: string | null
  paypal: string | null
  fanart_gallery: string | null
  fan_submission: string | null
  merchandise: string | null
  created_at: string
}

export interface GalleryItem {
  id: string
  user_id: string
  image_url: string
  caption: string | null
  description: string | null
  hashtags: string[]
  status: GalleryStatus
  created_at: string
  users?: {
    display_name: string | null
    username: string | null
    avatar_url: string | null
  }
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  thumbnail: string | null
  content: string
  tags: string[]
  status: BlogStatus
  author_id: string
  deleted_at: string | null
  created_at: string
  updated_at: string
  users?: {
    display_name: string | null
    avatar_url: string | null
    username: string | null
  }
}

export interface Event {
  id: string
  title: string
  description: string | null
  banner_url: string | null
  start_date: string
  end_date: string
  created_by: string | null
  created_at: string
}

export interface AnimeProfile {
  id: string
  name: string
  slug: string
  generation: string | null
  avatar_url: string | null
  cover_url: string | null
  description: string | null
  bio: string | null
  twitter: string | null
  youtube: string | null
  twitch: string | null
  instagram: string | null
  tiktok: string | null
  website: string | null
  tags: string[]
  created_at: string
}

export interface SiteSetting {
  key: string
  value: string
}

export interface GithubDiscussion {
  id: string
  number: number
  title: string
  body: string
  url: string
  upvoteCount: number
  createdAt: string
  author: { login: string; avatarUrl: string }
  category: { name: string; emoji: string }
  comments: {
    totalCount: number
    nodes: GithubComment[]
  }
}

export interface GithubComment {
  id: string
  body: string
  upvoteCount: number
  createdAt: string
  author: { login: string; avatarUrl: string }
}

export interface SpotifyTrack {
  id: string
  name: string
  artists: { name: string }[]
  album: {
    name: string
    images: { url: string }[]
  }
  preview_url: string | null
  external_urls: { spotify: string }
  duration_ms: number
}

export interface DiscordStats {
  memberCount: number
  onlineCount: number
}
