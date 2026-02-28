# Soraku Changelog

## v1.0.a3.1 — 2026-02-28

### New Features
- **Centralized Theme System** — Two-layer: Admin Palette + User Display Mode
- **CSS Variables** — All colors via `--color-*` tokens in globals.css, no hardcoded values
- **Admin Palette Control** — Admin panel Settings tab with color pickers for all 5 palette colors
- **User Theme Toggle** — Dark/Light/Auto in navbar dropdown and profile settings
- **Public Profile Pages** — `/u/[username]` with cover, avatar, bio, role badge, social links
- **VTuber System** — `/Vtuber` and `/Vtuber/[slug]` with 3-column mobile grid
- **Gallery with Approval** — Admin must approve gallery submissions; filter + search + modal
- **Blog with Spotify** — Blog detail pages include embedded Spotify player if track ID set
- **Komunitas** — GitHub Discussions (Redis cached 10min) + Discord CTA + Event grid
- **Redis Caching** — GitHub, Spotify, and rate-limiting via ioredis
- **BullMQ Queues** — Webhook and Spotify refresh queues

### Theme System
- Default palette: Primary `#4FA3D1`, Dark Base `#1C1E22`, Secondary `#6E8FA6`, Light Base `#D9DDE3`, Accent `#E8C2A8`
- Admin stores palette in `site_settings` table (validated with Zod hex regex)
- User stores preference in `users.theme_mode` (dark | light | auto)
- Priority: User > Site Settings > System preference
- SSR resolves initial class to prevent hydration mismatch

### Security
- All inputs validated with Zod
- HTML content sanitized via isomorphic-dompurify
- Unique slug constraints on blog_posts, vtubers, events
- RLS enabled on all major tables
- `public.has_role(role_name)` DB function for server-side role checks
- No secrets exposed via client

### Responsive Grid
- Mobile: `grid-cols-3` (mandatory minimum, no single-column)
- Tablet: `grid-cols-3` to `grid-cols-4`
- Desktop: `grid-cols-4` to `grid-cols-6`
- Touch-friendly buttons (min-height 44px)
- Full-width modals on mobile
- Collapsible navbar with hamburger menu
- No horizontal overflow

### Bug Fixes
- Fixed admin panel edit revert bug — proper state management
- Profile route `/profile` now redirects to `/u/[username]`
- Navbar theme toggle persists to DB for authenticated users
- Auto theme mode uses system `prefers-color-scheme`

### Database
- Added `theme_mode` column to `users` table
- Added theme color keys to `site_settings`
- Added `social_limit` trigger (USER ≤ 2, PREMIUM unlimited)
- Added auto-create user trigger on auth.users INSERT
- All tables have RLS enabled with correct policies
- Indexes added for performance

### Stack
- Next.js 15 App Router
- TypeScript Strict Mode
- Supabase Auth + PostgreSQL + RLS
- TailwindCSS with CSS variable integration
- Framer Motion
- Lucide React
- Zod validation
- isomorphic-dompurify
- ioredis + BullMQ

---

## v1.0.a3 — Previous

- Initial App Router migration
- Supabase Auth integration
- Basic blog, gallery, VTuber pages
- Discord, GitHub, Spotify integrations
