# Changelog — Soraku Platform

Format: [Semantic Versioning](https://semver.org)

---

## [1.0.a3.5-bf1] — 2026-03-01 — Build-Fix Patch

### Fixed
- `lib/supabase/server.ts` — Build-safe JWT placeholder fallbacks; @supabase/ssr no longer throws during static prerender with missing env vars
- `lib/supabase/client.ts` — Same env guard for browser client
- `middleware.ts` — Env guard + wrapped in try/catch; graceful degradation when Supabase unreachable
- `app/dashboard/page.tsx` — Removed direct `motion` import from server component; extracted to `components/dashboard/DashboardAnimations.tsx` client wrappers
- `app/api/gallery/route.ts` — Fixed `caption` → `title` column alignment with actual gallery table schema; removed dompurify dep
- `types/index.ts` — GalleryItem aligned with DB schema (`title`, `tags`, `likes`); DiscordStats + EventData + BlogPost extended
- `lib/schema.sql` — Added `approved_by` column to gallery table (idempotent ALTER)
- Build: 0 errors, 25/25 pages generated ✓

---

## [1.0.a3.5] — 2026-03-01 ✅ BUILD SUCCESS

### Added
- `app/dashboard/page.tsx` — New Dashboard page: Discord Hero Card, Latest Blog (6), Latest Events, Komunitas CTA
- `components/community/DiscordHeroCard.tsx` — Reusable glass Discord card with widget member list auto-scroll
- `app/komunitas/page.tsx` — Full rewrite: Discord Hero Card + 6 Glass Feature Cards (3×2, Framer Motion stagger) + CTA
- `app/gallery/page.tsx` — Glass upload card with Supabase Storage direct upload + Newest/Popular/Trending tabs + like counter
- `app/u/[username]/ProfileClient.tsx` — Role-based social media editor: USER=2, DONATE=8, PREMIUM=10 (Trakteer+Ko-fi), cover edit PREMIUM only
- `components/Footer.tsx` — Glass panel footer: Logo + Quick Links + 6 Social icons with hover colors
- Navbar: Dashboard link added
- `lib/schema.sql` — Storage bucket RLS policies for `uploads` bucket

### Changed
- Discord stats API now returns `icon_url` + `online_members` from widget endpoint
- Gallery upload uses Supabase Storage (`uploads/gallery/`) instead of URL-only input
- Footer copyright updated to v1.0.a3.5

### Fixed
- Gallery `likes` column referenced correctly across all view + like flows
- Social editor respects role hierarchy from `lib/roles.ts` (`hasRole`)
- Cover edit gated to `PREMIUM` role minimum

---

## [1.0.a3.3] — 2026-02-28 (MASTER STABILITY RELEASE)

### Added
- Anime-style split-screen login UI (Left: animated illustration, Right: glass form)
- Anime-style split-screen register UI (reversed layout)
- Google OAuth integration (login + register, replaces GitHub OAuth)
- Username login support: resolves email via users table lookup
- `webhook_settings`, `spotify_tokens`, `user_socials` tables with RLS
- `user_roles` table with RLS (role audit trail, admin-managed)
- `vtuber_socials` table with RLS (platform social links per VTuber)
- Gallery sorting indexes: title, likes, created_at
- `likes` column on gallery (idempotent)
- `/auth/callback` as canonical OAuth callback (Google + Discord)
- Premium social limit trigger (USER → max 2 links, PREMIUM = unlimited)
- Schema fully consolidated in `/lib/schema.sql` (all 11 tables + RLS + triggers + indexes)

### Fixed
- OAuth redirects point to `/auth/callback` (canonical)
- `loginSchema` accepts identifier (email OR username)
- Public profile: role display-only, never editable from UI
- RLS blocks role self-escalation

### Changed
- Version: 1.0.a3.2 2192 1.0.a3.3
- setup.md: Google + Discord provider setup documented

---

## [1.0.a3.2] — 2026-02-28

### Fixed
- Build error: `Gallery` icon tidak ada di lucide-react → diganti `Images`
- Tombol hero tidak punya `href` → semua Button sekarang punya href
- Logout ghost session: middleware `setAll()` sekarang forward Set-Cookie ke browser
- Footer mobile `grid-cols-3` → `grid-cols-1 sm:grid-cols-3`, icons centered di mobile
- TypeScript TS2802: `[...new Set()]` → `Array.from(new Set())` di GalleryGrid

### Added
- Gallery sorting dropdown: Terbaru / Terlama / A–Z / Z–A / Terpopuler / Kurang Populer
- `/lib/schema.sql` sebagai single source of truth database
- Middleware proteksi route `/Soraku_Admin`

### Removed
- `components/layout/` (duplikat Footer/Navbar/Hero/FeaturesSection — dead code)
- `app/community/` (route tidak aktif, konflik dengan `/komunitas`)
- `app/admin/` (duplikat admin panel, canonical adalah `/Soraku_Admin`)
- `postcss.config.js` (duplikat dengan `.mjs`)
- `lib/migration_v1.0.a3.1.sql` (sudah ter-cover di schema.sql lengkap)
- `schema.sql` (root) → dipindah ke `lib/schema.sql`

### Changed
- Version: 1.0.a3.1 → 1.0.a3.2
- `app/Blog/` → `app/blog/` (fix 404: Next.js Linux case-sensitive)

---

---

## [1.0.a3.1] — 2025-02-28

### Added
- Two-layer theme system: Admin palette + User display mode (dark/light/auto)
- CSS variable architecture di globals.css
- ThemeProvider.tsx: Client-side injector, SSR-safe
- Public profile /u/[username]: cover, avatar, bio, role badge, social links
- Profile edit page /edit/profile dengan Zod validation
- Gallery upload page /gallery/upload dengan admin approval flow
- Komunitas detail /komunitas/[slug]: GitHub Discussion + komentar
- AdminShell component: sidebar responsif
- Admin dashboard /Soraku_Admin: stats cards, quick links
- API Routes: discord stats/webhook, maintenance, spotify search/track, admin users, webhooks
- lib/schemas.ts: Zod schemas untuk semua form
- lib/utils.ts: cn, slugify, formatDate, relativeTime, dll
- lib/discord.ts: Discord API integration
- lib/maintenance.ts: Maintenance mode via Redis
- lib/supabase.ts: sync createServerSupabaseClient untuk webhooks
- hooks/useTheme.ts, hooks/useUser.ts
- README.md, CONTRIBUTING.md, SECURITY.md

### Fixed
- Semua missing exports: ALL_ROLES, ROLE_LABELS, ROLE_COLORS, rateLimit, searchSpotifyTracks,
  fetchDiscussionByNumber, fetchDiscordStats, isMaintenanceMode, createServerSupabaseClient,
  ProfileFormData, profileSchema, display_name field
- React 19 npm overrides untuk peer dependency conflicts
- Route conflict (auth)/login → flat routes

### Security
- RLS enabled semua tabel
- Rate limiting Redis pada API sensitif
- DOMPurify sanitization konten user
- Zod validation semua API endpoints

---

## [1.0.a3] — 2025-02-15

### Added
- Upgrade Next.js 15.5.12 Stable
- Supabase SSR (@supabase/ssr)
- VTuber grid responsif
- Blog Spotify embed
- Gallery admin approval
- Komunitas GitHub Discussions + Redis cache 10 menit

---

## [1.0.a2.11] — 2024-12-01

### Added
- Initial platform launch
- Supabase Auth + OAuth GitHub/Discord
- Role system: OWNER, MANAGER, ADMIN, AGENSI, PREMIUM, DONATE, USER
