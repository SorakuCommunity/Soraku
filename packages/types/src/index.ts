// ============================================================
// @soraku/types — Shared TypeScript types
// Dipakai oleh: apps/web, apps/stream, apps/mobile, services/api, services/bot
// ============================================================

// ── Enums ────────────────────────────────────────────────────
export type UserRole       = "OWNER" | "MANAGER" | "ADMIN" | "AGENSI" | "KREATOR" | "USER"
export type SupporterTier  = "DONATUR" | "VIP" | "VVIP" | null
export type GalleryStatus  = "pending" | "approved" | "rejected"
export type EventStatus    = "online" | "pending" | "selesai"
export type StreamType     = "vod" | "live" | "clip"
export type StreamStatus   = "draft" | "published" | "archived"
export type NotifType      = "info" | "success" | "warning" | "system" | "event" | "blog" | "gallery" | "badge" | "mention" | "premium"
export type ApiClient      = "web" | "bot" | "stream" | "mobile" | "internal"

// ── User ─────────────────────────────────────────────────────
export interface User {
  id:              string
  username:        string | null
  displayname:     string | null
  avatarurl:       string | null
  bio:             string | null
  coverurl:        string | null
  role:            UserRole
  supporterrole:   SupporterTier
  supportersince:  string | null
  supporteruntil:  string | null
  supportersource: string | null
  sociallinks:     Record<string, string>
  isprivate:       boolean
  createdat:       string
  updatedat:       string
}

export interface UserSession {
  id:            string
  username:      string
  displayname:   string
  avatarurl:     string | null
  email:         string
  role:          UserRole
  supporterrole: SupporterTier
  issupporter:   boolean
}

// ── Content ──────────────────────────────────────────────────
export interface Post {
  id:          string
  slug:        string
  title:       string
  excerpt:     string | null
  content:     string | null
  coverurl:    string | null
  tags:        string[]
  ispublished: boolean
  publishedat: string | null
  authorid:    string | null
  createdat:   string
  updatedat:   string
}

export interface Event {
  id:          string
  slug:        string
  title:       string
  description: string | null
  coverurl:    string | null
  startdate:   string
  enddate:     string | null
  location:    string | null
  isonline:    boolean
  status:      EventStatus
  ispublished: boolean
  tags:        string[]
  createdby:   string | null
  createdat:   string
  updatedat:   string
}

export interface GalleryItem {
  id:              string
  uploadedby:      string | null
  imageurl:        string
  title:           string | null
  description:     string | null
  tags:            string[]
  status:          GalleryStatus
  reviewedby:      string | null
  rejectionreason: string | null
  createdat:       string
  updatedat:       string
}

export interface VTuber {
  id:              string
  slug:            string
  name:            string
  charactername:   string | null
  avatarurl:       string | null
  coverurl:        string | null
  description:     string | null
  tags:            string[]
  sociallinks:     Record<string, string>
  isactive:        boolean
  ispublished:     boolean
  islive:          boolean
  liveurl:         string | null
  subscribercount: number | null
  userid:          string | null
  createdat:       string
  updatedat:       string
}

// ── Stream ───────────────────────────────────────────────────
export interface StreamContent {
  id:           string
  slug:         string
  title:        string
  description:  string | null
  thumbnailurl: string | null
  hlsurl:       string | null
  duration:     number | null       // detik
  type:         StreamType
  status:       StreamStatus
  vtuberid:     string | null
  tags:         string[]
  viewcount:    number
  ispremium:    boolean
  metadata:     Record<string, unknown>
  createdat:    string
  updatedat:    string
}

// ── Premium / Donatur ─────────────────────────────────────────
export interface Donatur {
  id:          string
  userid:      string | null
  displayname: string
  amount:      number
  tier:        SupporterTier
  message:     string | null
  ispublic:    boolean
  createdat:   string
}

export interface PremiumStatus {
  supporterrole:   SupporterTier
  supportersince:  string | null
  supporteruntil:  string | null
  supportersource: string | null
  isActive:        boolean
}

// ── Notifications ────────────────────────────────────────────
export interface Notification {
  id:        string
  userid:    string | null
  type:      NotifType
  title:     string
  body:      string | null
  href:      string | null
  isread:    boolean
  createdat: string
}

// ── API Response ─────────────────────────────────────────────
export type ApiResponse<T> = 
  | { data: T;    error: null   }
  | { data: null; error: string }

export type PaginatedResponse<T> = ApiResponse<{
  items: T[]
  page:  number
  limit: number
  total: number
}>

// ── Anime Streaming ───────────────────────────────────────────
export type AnimeSource =
  | "gogoanime"   // Sub English — gogoanime
  | "hianime"     // Sub English — HiAnime / Aniwatch
  | "animekai"    // Sub English — Animekai
  | "anibaru"     // Sub Indonesia — AniBaru.id
  | "samehadaku"  // Sub Indonesia — Samehadaku

export type AnimeLang = "sub-en" | "sub-id" | "dub-en"

export interface AnimeSearchResult {
  id:          string          // source-specific ID / slug
  title:       string
  altTitles:   string[]
  cover:       string | null
  source:      AnimeSource
  url:         string
  totalEpisodes: number | null
  status:      "Ongoing" | "Completed" | "Unknown"
  genres:      string[]
}

export interface AnimeEpisode {
  id:      string    // episode ID dari source
  number:  number
  title:   string | null
  isFiller: boolean
}

export interface AnimeDetail extends AnimeSearchResult {
  description: string | null
  episodes:    AnimeEpisode[]
  year:        number | null
  rating:      number | null
}

export interface AnimeStreamSource {
  url:     string   // M3U8 / direct video URL
  quality: string   // "1080p" | "720p" | "360p" | "default"
  isM3U8:  boolean
  isDASH:  boolean
}

export interface AnimeStreamResult {
  episodeId: string
  source:    AnimeSource
  streams:   AnimeStreamSource[]
  subtitles: { url: string; lang: string }[]
  intro:     { start: number; end: number } | null
  outro:     { start: number; end: number } | null
}
