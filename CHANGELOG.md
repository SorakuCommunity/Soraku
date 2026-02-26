# Soraku — Changelog

---

## v1.0.a3 — Production-Grade RLS + RBAC + Full UI Upgrade (February 2026)

### 🏗️ Architecture — Production RLS & RBAC
- **New DB migration**: `migration_v1.0.a3.sql` — full idempotent migration
- **`public.has_role(role_name TEXT)`** helper function — centralized DB-level role check
- **Role hierarchy extended**: `OWNER(7) > MANAGER(6) > ADMIN(5) > AGENSI(4) > PREMIUM(3) > DONATE(2) > USER(1)`
- **New roles added**: `PREMIUM`, `DONATE` — enforced in DB `CHECK` constraint and application code
- **All RLS policies rebuilt** from scratch — explicit per-operation (SELECT/INSERT/UPDATE/DELETE)
- **Premium enforcement at DB layer**: `check_social_limit()` trigger on `vtuber_socials` — USER/DONATE max 2 links, PREMIUM+ unlimited

### 🆕 New Tables
- `user_roles` — junction table for multi-role support (future-ready)
- `vtuber_socials` — normalized social links with DB-level limit enforcement
- `webhook_settings` — secure webhook storage (admin-only RLS)
- `spotify_tokens` — service role only, no anon access

### 🔒 Security
- All RLS policies now use `public.has_role()` — eliminates subquery duplication
- `webhook_settings` never exposed client-side
- Middleware updated with PREMIUM/DONATE role awareness
- Explicit `SECURITY DEFINER` on all security functions

### ⚡ Redis + Queue
- **`lib/redis.ts`**: ioredis singleton with `cacheGet/cacheSet/cacheDel/rateLimit` helpers
- **`lib/queue.ts`**: BullMQ webhook delivery queue with retry/backoff
- **GitHub Discussions** now cached in Redis (TTL 10m) — no more raw token exposure in errors
- Login rate limiting infrastructure ready

### 🎨 UI/UX — Full Overhaul (Points 1–9)
1. **Dashboard** — Card grid (3×2), anime backgrounds, Active Events grid, Blog preview grid 2, Discord CTA, Tentang preview card
2. **`/komunitas`** — Discord section top (chat/voice/meetup cards), GitHub Discussions bottom with Redis cache, no token error display
3. **`/Vtuber`** — Grid 3, generation grouping, detail page `/Vtuber/[slug]` with social links, AGENSI+ edit access
4. **`/gallery`** — Intro desc, search/sort/hashtag filter, Grid 2, zoom modal with navigation, caption + description + hashtags, ADMIN+ moderation
5. **`/Blog`** — Grid 2 + featured post, Spotify player single-row on top, sanitized content render
6. **`/Tentang`** — Founder section (from DB settings), timeline 2023→now, value cards
7. **Admin Panel** — Fixed UPDATE logic (explicit `.eq('id')` before `.select()`), Cancel button with X icon, scroll-to-top on edit, PREMIUM/DONATE in role selector, gallery filter tabs, settings founder section + login BG
8. **`/login`** — Glassmorphism dark anime aesthetic, Discord primary, Google/Facebook grid, Spotify optional, configurable BG from `site_settings`
9. **DB extended** — `vtuber_socials`, `user_roles`, `webhook_settings`, `spotify_tokens` added without breaking old schema

### 📦 Dependencies Added
- `ioredis@^5.4.2` — Redis client
- `bullmq@^5.34.0` — Job queue
- `isomorphic-dompurify@^2.26.0` — Server-safe HTML sanitization

### 🐛 Bug Fixes
- **Admin Panel edit reverting to default**: Fixed — form now resets ONLY after successful DB response, not before
- **`/Blog/[slug]` 404**: Full page rewrite with real DB fetch + metadata
- **`/Vtuber/[slug]` missing**: New detail page created
- **`/komunitas` GitHub token error fallback visible to users**: Removed — shows clean config notice only
- **AdminShell props mismatch**: Rewritten to accept `user`, `tabs`, `onTabChange` interface
- **Gallery upload link broken** (`/upload` → `/gallery/upload`): Fixed in empty state
- `PREMIUM` and `DONATE` missing from `users.role` CHECK constraint: Fixed in migration

### 🔧 Additional Fixes (Continuation)
- **`app/auth/page.tsx`** — Created missing auth page with glassmorphism dark anime design; Discord primary OAuth; Google/GitHub/Spotify secondary; animated anime background
- **`lib/spotify.ts`** — Full rewrite with graceful fallback (returns `[]`/`null` instead of throwing); Redis token caching (TTL = `expires_in - 60s`); lofi tracks cached 30 min
- **`lib/env.ts`** — New boot-time env validation with Zod; hard-fail dev / soft-fail prod; `hasSpotify()`, `hasDiscordBot()`, `hasGitHub()`, `hasRedis()` feature helpers
- **`lib/utils.ts`** — Fixed `getRoleBadgeColor()`: PREMIUM → pink, DONATE → orange (were falling through to gray default)
- **`middleware.ts`** — Auth redirects now point to `/auth?next=<path>` preserving return URL

---

## v1.0.a2.10 — Role System Fix & Next.js Security Patch (February 2026)
- **Fixed `lib/roles.ts`**: Import `Role` dari `@/types` → `UserRole` dari `@/types`
  - Error: `Type error: Module '"@/types"' has no exported member 'Role'`
  - Penyebab: `lib/roles.ts` ditulis dengan tipe `Role` yang tidak pernah didefinisikan
    di `types/index.ts`. Seluruh codebase menggunakan `UserRole`.
  - Fix: Rewrite penuh `lib/roles.ts` — align dengan `UserRole` yang sudah ada,
    ganti `SUPERADMIN` → `OWNER` sesuai hierarki aktual di database

### 🔒 Role Hierarchy (Final — selaras dengan database)
```
OWNER   (5) — Akses penuh, toggle maintenance
MANAGER (4) — Kelola roles, events, vtuber
ADMIN   (3) — Blog, gallery moderation, users
AGENSI  (2) — Manajemen vtuber
USER    (1) — Member biasa
```

### ⬆️ Next.js Security Upgrade
- `next@15.4.0` → `15.4.1` — Fix CVE-2025-66478 (vulnerability yang memblokir deploy)
- `eslint-config-next`: `15.4.0` → `15.4.1`

### 📦 Dependency Cleanup
- Hapus `@supabase/auth-helpers-nextjs` (deprecated, sudah digantikan `@supabase/ssr`)
- Tidak ada Clerk dependency tersisa

---

## v1.0.a2.9 — Clerk Removal & Supabase Auth Unification (February 2026)

### 🔴 Critical Fix
- Rewrite total `components/layout/Navbar.tsx` — hapus semua Clerk type references
  yang menyebabkan: `Cannot find module '@clerk/nextjs' or its corresponding type declarations`
- Ganti dengan Supabase `signInWithOAuth` + `onAuthStateChange`

### ✅ Navbar — Supabase Auth
- Avatar dropdown: Profil, Edit Profil, Keluar
- Mobile auth buttons terpisah
- Auto-update state via `onAuthStateChange` listener

---

## v1.0.a2.2 — Security Fix (February 2026)

### 🔴 Critical
- Upgrade `next@15.1.0` → `15.4.0` (fix CVE-2025-66478)
- React `^18.3.1` → `^19.0.0` (align dengan Vercel environment)
- `@types/react` + `@types/react-dom`: `^18` → `^19`

---

## v1.0.a2.1 — Initial Release

- Platform komunitas Soraku: Anime, Manga & Kultur Digital Jepang
- Supabase Auth (Discord OAuth, Google OAuth)
- Gallery system dengan moderasi (pending → approved → public)
- Soraku_Admin panel dengan RBAC
- Blog system + Spotify music player
- Events + Discord webhook notification
- VTuber generasi system
- Middleware route protection (Supabase session)
