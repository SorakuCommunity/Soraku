# Changelog — Soraku Platform

Format: [Semantic Versioning](https://semver.org)

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
