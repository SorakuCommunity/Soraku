// ============================================================
// SORAKU TYPES — V1.0.a2
// ============================================================

export type Role = "SUPERADMIN" | "MANAGER" | "AGENSI" | "ADMIN" | "USER";

export type GalleryStatus = "pending" | "approved" | "rejected";
export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

// ─── User ────────────────────────────────────────────────────
export interface SorakuUser {
  id: string;
  clerk_id: string;
  username: string;
  email: string;
  avatar_url?: string;
  role: Role;
  created_at: string;
  updated_at: string;
}

// ─── Vtuber ──────────────────────────────────────────────────
export interface SocialLinks {
  youtube?: string;
  twitter?: string;
  tiktok?: string;
  instagram?: string;
  twitch?: string;
  [key: string]: string | undefined;
}

export interface Vtuber {
  id: string;
  name: string;
  bio: string;
  avatar_url: string;
  generation: string;
  social_links: SocialLinks;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// ─── Blog ────────────────────────────────────────────────────
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  author_id: string;
  author?: SorakuUser;
  tags: string[];
  published: boolean;
  spotify_track_id?: string;
  created_at: string;
  updated_at: string;
}

// ─── Event ───────────────────────────────────────────────────
export interface SorakuEvent {
  id: string;
  title: string;
  description: string;
  banner_image?: string;
  start_date: string;
  end_date: string;
  status: EventStatus;
  discord_event_id?: string;
  created_by: string;
  created_at: string;
}

// ─── Gallery ─────────────────────────────────────────────────
export interface GalleryItem {
  id: string;
  user_id: string;
  user?: SorakuUser;
  image_url: string;
  caption: string;
  status: GalleryStatus;
  reviewed_by?: string;
  created_at: string;
}

// ─── Discord ─────────────────────────────────────────────────
export interface DiscordStats {
  memberCount: number;
  onlineCount: number;
  serverName: string;
  serverIcon?: string;
  lastUpdated: number;
}

// ─── Spotify ─────────────────────────────────────────────────
export interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  previewUrl?: string;
  externalUrl: string;
  duration: number;
}

// ─── API Response ────────────────────────────────────────────
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
