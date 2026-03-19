// ─────────────────────────────────────────────────────────────────────────────
// Soraku — Notification System
// DB: soraku.notifications — lihat migration 20260311_notifications.sql
// Field names mengikuti konvensi soraku: lowercase tanpa underscore
// ─────────────────────────────────────────────────────────────────────────────

export type NotifType =
  | "event"    // Event baru / reminder
  | "blog"     // Artikel baru
  | "gallery"  // Galeri disetujui / ditolak
  | "badge"    // Dapat badge / role baru
  | "mention"  // Disebut di komentar
  | "system"   // Pengumuman platform
  | "info"     // Info umum
  | "premium"; // Status premium berubah

export interface Notification {
  id:        string;
  type:      NotifType;
  title:     string;
  body:      string | null;
  href:      string | null;
  isread:    boolean;         // ← sesuai kolom DB: isread (bukan read)
  createdat: string;          // ← sesuai kolom DB: createdat (bukan created_at)
}

export const NOTIF_CONFIG: Record<
  NotifType,
{ emoji: string; bg: string; color: string; icon?: React.FC<any> }
> = {
  event:   { emoji: "🎌", bg: "bg-blue-500/10",   color: "text-blue-400"   },
  blog:    { emoji: "📝", bg: "bg-primary/10",    color: "text-primary"    },
  gallery: { emoji: "🖼️", bg: "bg-purple-500/10", color: "text-purple-400" },
  badge:   { emoji: "🏅", bg: "bg-yellow-500/10", color: "text-yellow-400" },
  mention: { emoji: "💬", bg: "bg-green-500/10",  color: "text-green-400"  },
  system:  { emoji: "📢", bg: "bg-accent/10",     color: "text-accent"     },
  info:    { emoji: "ℹ️",  bg: "bg-muted/20",      color: "text-muted-foreground" },
  premium: { emoji: "⭐", bg: "bg-yellow-400/10", color: "text-yellow-300" },
};
