// ═══════════════════════════════════════
//  Soraku Community — Core Types
//  v0.1.0 — sync with Kaizo (backend)
// ═══════════════════════════════════════

/** Hirarki role struktural */
export type StructuralRole = 'OWNER' | 'MANAGER' | 'ADMIN' | 'AGENSI' | 'KREATOR' | 'USER'

/** Role supporter (badge khusus) */
export type SupporterRole = 'DONATUR' | 'VIP' | 'VVIP'

export interface User {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  role: StructuralRole
  supporter_role: SupporterRole | null
  discord_id: string | null
  created_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_url: string | null
  content?: string
  author: Pick<User, 'id' | 'username' | 'display_name' | 'avatar_url'>
  tags: string[]
  published_at: string
  read_time?: number
}

export interface Event {
  id: string
  title: string
  slug: string
  description: string
  cover_url: string | null
  event_type: 'online' | 'offline' | 'hybrid'
  starts_at: string
  ends_at: string | null
  location: string | null
  discord_link: string | null
  max_participants?: number
  tags?: string[]
}

export interface GalleryItem {
  id: string
  title: string
  image_url: string
  category: 'fanart' | 'cosplay' | 'foto' | 'digital' | 'lainnya'
  tags: string[]
  author: Pick<User, 'id' | 'username' | 'display_name' | 'avatar_url'>
  created_at: string
  approved?: boolean
}

export interface Talent {
  id: string
  slug: string
  name: string
  type: 'vtuber' | 'kreator' | 'cosplayer' | 'musisi' | 'penulis'
  avatar_url: string | null
  banner_url: string | null
  bio: string | null
  tags: string[]
  socials: {
    youtube?: string
    twitter?: string
    instagram?: string
    tiktok?: string
    twitch?: string
  }
  is_active: boolean
  debut_date: string | null
}

export interface VTuber extends Talent {
  type: 'vtuber'
  model_type: '2D' | '3D'
  character_name: string
  streams?: { platform: string; url: string }[]
}

export interface Donatur {
  id: string
  display_name: string
  avatar_url: string | null
  amount: number
  tier: SupporterRole
  message: string | null
  created_at: string
}

export interface ApiResponse<T> {
  data: T
  error: null
  meta?: { total: number; page: number; limit: number }
}

export interface ApiError {
  data: null
  error: { message: string; code?: string }
}
