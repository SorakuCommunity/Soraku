/**
 * @soraku/custom-icons
 * ─────────────────────────────────────────────────────────────────────────────
 * Registry SVG icon yang TIDAK tersedia di Lucide React.
 * Dikelola oleh: Sora (shared lib)
 * Digunakan di: footer, navbar, halaman sosial media, dll.
 *
 * ─── CARA PAKAI ──────────────────────────────────────────────────────────────
 *
 * // 1. Import langsung (untuk 1-2 icon)
 * import { DiscordIcon, TikTokIcon } from "@/components/icons/custom-icons"
 * <DiscordIcon className="h-5 w-5" />
 *
 * // 2. Lookup by slug (untuk render dinamis)
 * import { getIcon } from "@/components/icons/custom-icons"
 * const Icon = getIcon("discord")
 * if (Icon) <Icon className="h-5 w-5" />
 *
 * // 3. Loop seluruh array (untuk halaman ikon / sosmed page)
 * import { CUSTOM_ICONS } from "@/components/icons/custom-icons"
 * CUSTOM_ICONS.map(({ name, slug, category, icon: Icon }) => (
 *   <Icon key={slug} className="h-5 w-5" />
 * ))
 *
 * // 4. Filter by category
 * import { getIconsByCategory } from "@/components/icons/custom-icons"
 * const socialIcons = getIconsByCategory("social")
 *
 * ─── MENAMBAH ICON BARU ───────────────────────────────────────────────────────
 * 1. Buat component SVG di section === ICONS ===
 * 2. Daftarkan ke array CUSTOM_ICONS
 * 3. Re-export di bagian bawah file
 * 4. JANGAN buat SVG inline di page/component lain — import dari sini
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & {
  className?: string;
};

export type CustomIconEntry = {
  /** Nama tampilan */
  name: string;
  /** Slug lowercase untuk lookup */
  slug: string;
  /** Kategori */
  category: "social" | "platform" | "brand" | "misc";
  /** URL profil Soraku (opsional) */
  href?: string;
  /** React component */
  icon: React.FC<IconProps>;
};

// ═══════════════════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════════════════

// ── Social Media ──────────────────────────────────────────────────────────────

export const DiscordIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
  </svg>
);

export const InstagramIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

export const FacebookIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const XIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const TikTokIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
  </svg>
);

export const YouTubeIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const BlueSkyIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z" />
  </svg>
);

// ── Platform / Auth ────────────────────────────────────────────────────────────

export const GoogleIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export const TrakteerIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 512 512" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48zm0 380c-94.9 0-172-77.1-172-172S161.1 84 256 84s172 77.1 172 172-77.1 172-172 172zm-36-272v176h36V156h-36zm72 0v176h36V156h-36z" />
  </svg>
);

export const SunoIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm-2-5.5v-5l5 2.5z" />
  </svg>
);

// ── Payment / Bank — compact square icons ─────────────────────────────────────

export const BCAIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <rect width="24" height="24" rx="6" fill="#005BAB"/>
    <text x="12" y="16.5" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="7.5" fill="#FFFFFF" letterSpacing="0.3">BCA</text>
  </svg>
);

export const BRIIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <rect width="24" height="24" rx="6" fill="#003D7A"/>
    <text x="12" y="16.5" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="7.5" fill="#F5A623" letterSpacing="0.3">BRI</text>
  </svg>
);

export const BTNIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <rect width="24" height="24" rx="6" fill="#1B5E20"/>
    <text x="12" y="16.5" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="7.5" fill="#FFFFFF" letterSpacing="0.3">BTN</text>
  </svg>
);

export const SeabankIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <rect width="24" height="24" rx="6" fill="#0B4EAB"/>
    {/* anchor icon */}
    <circle cx="12" cy="9" r="2.2" stroke="white" strokeWidth="1.3" fill="none"/>
    <line x1="12" y1="11.2" x2="12" y2="18" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M8 14.5 Q10 18 12 18 Q14 18 16 14.5" stroke="white" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    <line x1="9.5" y1="9" x2="14.5" y2="9" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

export const DanaIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <rect width="24" height="24" rx="12" fill="#118EEA"/>
    <text x="12" y="16.5" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="8" fill="#FFFFFF" letterSpacing="0.2">D</text>
  </svg>
);

export const QRISIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <rect width="24" height="24" rx="6" fill="#E30613"/>
    {/* top-left QR corner */}
    <rect x="4" y="4" width="6" height="6" rx="1" fill="white"/>
    <rect x="5.5" y="5.5" width="3" height="3" rx="0.5" fill="#E30613"/>
    {/* top-right QR corner */}
    <rect x="14" y="4" width="6" height="6" rx="1" fill="white"/>
    <rect x="15.5" y="5.5" width="3" height="3" rx="0.5" fill="#E30613"/>
    {/* bottom-left QR corner */}
    <rect x="4" y="14" width="6" height="6" rx="1" fill="white"/>
    <rect x="5.5" y="15.5" width="3" height="3" rx="0.5" fill="#E30613"/>
    {/* data dots */}
    <rect x="14" y="14" width="2" height="2" rx="0.3" fill="white"/>
    <rect x="17" y="14" width="2" height="2" rx="0.3" fill="white"/>
    <rect x="14" y="17" width="2" height="2" rx="0.3" fill="white"/>
    <rect x="17" y="17" width="2" height="2" rx="0.3" fill="white"/>
  </svg>
);

export const GopayIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <rect width="24" height="24" rx="12" fill="#00AED6"/>
    {/* G letter */}
    <path d="M8.5 12 C8.5 9.5 10.5 7.5 13 7.5 C14.4 7.5 15.6 8.1 16.4 9.1 L14.8 10.3 C14.3 9.7 13.7 9.3 13 9.3 C11.5 9.3 10.3 10.5 10.3 12 C10.3 13.5 11.5 14.7 13 14.7 C14 14.7 14.8 14.2 15.3 13.4 L13.2 13.4 L13.2 11.7 L17.2 11.7 L17.2 12.2 C17.2 14.8 15.3 16.5 13 16.5 C10.5 16.5 8.5 14.5 8.5 12 Z" fill="white"/>
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════════
// REGISTRY
// Semua sosial media & link resmi Soraku
// ═══════════════════════════════════════════════════════════════════════════════

export const SORAKU_SOCIALS: CustomIconEntry[] = [
  {
    name:     "Discord",
    slug:     "discord",
    category: "social",
    href:     "https://discord.gg/qm3XJvRa6B",
    icon:     DiscordIcon,
  },
  {
    name:     "Instagram",
    slug:     "instagram",
    category: "social",
    href:     "https://www.instagram.com/soraku.moe",
    icon:     InstagramIcon,
  },
  {
    name:     "Facebook",
    slug:     "facebook",
    category: "social",
    href:     "https://www.facebook.com/share/1HQs9ZZeCw/",
    icon:     FacebookIcon,
  },
  {
    name:     "X / Twitter",
    slug:     "x",
    category: "social",
    href:     "https://twitter.com/@AppSora",
    icon:     XIcon,
  },
  {
    name:     "TikTok",
    slug:     "tiktok",
    category: "social",
    href:     "https://www.tiktok.com/@soraku.id",
    icon:     TikTokIcon,
  },
  {
    name:     "YouTube",
    slug:     "youtube",
    category: "social",
    href:     "https://youtube.com/@soraku",
    icon:     YouTubeIcon,
  },
  {
    name:     "Bluesky",
    slug:     "bluesky",
    category: "social",
    href:     "https://bsky.app/profile/soraku.id",
    icon:     BlueSkyIcon,
  },
];

/** Semua custom icons (registry lengkap termasuk platform/auth) */
export const CUSTOM_ICONS: CustomIconEntry[] = [
  ...SORAKU_SOCIALS,
  { name: "Google",   slug: "google",   category: "platform", icon: GoogleIcon   },
  { name: "Trakteer", slug: "trakteer", category: "platform", icon: TrakteerIcon },
  { name: "Suno",     slug: "suno",     category: "platform", icon: SunoIcon     },
  { name: "BCA",      slug: "bca",      category: "brand",    icon: BCAIcon      },
  { name: "BRI",      slug: "bri",      category: "brand",    icon: BRIIcon      },
  { name: "BTN",      slug: "btn",      category: "brand",    icon: BTNIcon      },
  { name: "Seabank",  slug: "seabank",  category: "brand",    icon: SeabankIcon  },
  { name: "Dana",     slug: "dana",     category: "brand",    icon: DanaIcon     },
  { name: "QRIS",     slug: "qris",     category: "brand",    icon: QRISIcon     },
  { name: "GoPay",    slug: "gopay",    category: "brand",    icon: GopayIcon    },
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/** Lookup icon component by slug. Return null jika tidak ada. */
export function getIcon(slug: string): React.FC<IconProps> | null {
  return CUSTOM_ICONS.find((i) => i.slug === slug)?.icon ?? null;
}

/** Filter registry by category */
export function getIconsByCategory(
  category: CustomIconEntry["category"]
): CustomIconEntry[] {
  return CUSTOM_ICONS.filter((i) => i.category === category);
}
