// ════════════════════════════════════════════════════════════════
// Soraku — Supabase DB Types
// Author : Kaizo (Back-end)
// Schema : soraku — lowercase, no underscore
// ════════════════════════════════════════════════════════════════

export type UserRole = 'OWNER' | 'MANAGER' | 'ADMIN' | 'AGENSI' | 'KREATOR' | 'USER'
export type SupporterRole = 'DONATUR' | 'VIP' | 'VVIP'
export type GalleryStatus = 'pending' | 'approved' | 'rejected'
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn'

export interface DbUser {
  id: string
  username: string | null
  displayname: string | null
  avatarurl: string | null
  bio: string | null
  coverurl: string | null
  role: UserRole
  supporterrole: SupporterRole | null
  supportersince: string | null
  supporteruntil: string | null
  supportersource: string | null
  sociallinks: Record<string, string>
  isprivate: boolean
  isbanned: boolean
  createdat: string
  updatedat: string
}

export interface DbPost {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string | null
  coverurl: string | null
  tags: string[]
  ispublished: boolean
  publishedat: string | null
  authorid: string | null
  createdat: string
  updatedat: string
}

export type EventStatus = 'online' | 'pending' | 'selesai'

export interface DbEvent {
  id: string
  slug: string
  title: string
  description: string | null
  coverurl: string | null
  startdate: string
  enddate: string | null
  location: string | null
  isonline: boolean
  status: EventStatus // 'online' | 'pending' | 'selesai'
  ispublished: boolean
  tags: string[]
  createdby: string | null
  createdat: string
  updatedat: string
}

export interface DbGallery {
  id: string
  uploadedby: string | null
  imageurl: string
  title: string | null
  description: string | null
  tags: string[]
  status: GalleryStatus
  reviewedby: string | null
  rejectionreason: string | null
  createdat: string
  updatedat: string
}

export interface DbVtuber {
  id: string
  slug: string
  name: string
  charactername: string | null
  avatarurl: string | null
  coverurl: string | null
  description: string | null
  debutdate: string | null
  tags: string[]
  sociallinks: Record<string, string>
  isactive: boolean
  ispublished: boolean
  islive: boolean
  liveurl: string | null
  subscribercount: number | null
  userid: string | null
  createdat: string
  updatedat: string
}

export interface DbMusicTrack {
  id: string
  title: string
  artist: string
  anime: string | null
  coverurl: string | null
  srcurl: string
  duration: number | null
  ordernum: number
  isactive: boolean
  createdat: string
}

export interface DbDonatur {
  id: string
  userid: string | null
  displayname: string
  amount: number
  tier: SupporterRole | null
  message: string | null
  ispublic: boolean
  createdat: string
}

export interface DbMusicSettings {
  id: string
  enabled: boolean
  volume: number
  tracks: DbMusicTrack[]
  isautoplay: boolean
  updatedby: string | null
  createdat: string
  updatedat: string
}

// Session type — dipakai di semua API routes
export interface UserSession {
  id: string
  username: string | null
  displayname: string | null
  avatarurl: string | null
  email: string | null
  role: UserRole
  supporterrole: SupporterRole | null
  issupporter: boolean
}

export type NotifType = 'info' | 'success' | 'warning' | 'system'

export interface DbNotification {
  id: string
  userid: string
  type: NotifType
  title: string
  body: string | null
  href: string | null
  isread: boolean
  createdat: string
}
