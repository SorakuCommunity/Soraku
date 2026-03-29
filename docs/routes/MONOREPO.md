# SORAKU — MONOREPO ARCHITECTURE
> Platform ekosistem komunitas pop culture Jepang · Revisi 2026-03-10

---

## Gambaran Besar

Soraku bukan hanya website — ini adalah **ekosistem platform** yang terdiri dari beberapa aplikasi, services, dan shared packages yang bekerja bersama.

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT APPS                            │
│                                                             │
│   apps/web          apps/stream        apps/mobile          │
│   (Next.js)         (Next.js)          (React Native)       │
│   Platform utama    Anime streaming    iOS & Android        │
└────────────────────────────┬────────────────────────────────┘
                             │  semua komunikasi lewat API
┌────────────────────────────▼────────────────────────────────┐
│                     BACKEND SERVICES                        │
│                                                             │
│   services/api                   services/bot               │
│   Central REST API               Discord Bot                │
│   (auth, users, konten, dll)     (Railway)                  │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                    DATABASE                                 │
│              Supabase PostgreSQL · schema: soraku           │
└─────────────────────────────────────────────────────────────┘
```

**Aturan wajib:** Client apps TIDAK boleh query database langsung. Semua lewat `services/api`.

---

## Struktur Folder

```
SorakuCommunity/Soraku/
│
├── apps/
│   ├── web/          ✅ AKTIF   — Platform utama (Next.js, Vercel)
│   ├── stream/       🔜 PLANNED — Anime streaming (Next.js)
│   └── mobile/       🔜 PLANNED — Mobile app (React Native / Expo)
│
├── services/
│   ├── api/          🔜 PLANNED — Central REST API
│   └── bot/          ✅ AKTIF   — Discord bot (Railway, source di /Discord)
│
├── packages/
│   ├── types/        ✅ SCAFFOLD — Shared TypeScript types
│   ├── ui/           🔜 PLANNED  — Shared React components
│   ├── utils/        🔜 PLANNED  — Shared helper functions
│   ├── auth/         🔜 PLANNED  — Shared auth logic
│   └── config/       🔜 PLANNED  — Shared ESLint & TS config
│
├── database/
│   ├── schema/       🔜 PLANNED — SQL schema definitions
│   ├── migrations/   🔜 PLANNED — Drizzle migrations
│   └── seed/         🔜 PLANNED — Seed data untuk development
│
├── infrastructure/
│   ├── docker/       🔜 PLANNED — Docker configs
│   └── scripts/      🔜 PLANNED — Deployment & maintenance scripts
│
└── docs/
    ├── MONOREPO.md   — File ini
    ├── PHILOSOPHY.md — Visi & misi Soraku
    ├── PLAN.md       — Feature roadmap lengkap
    ├── PROMPTS.md    — Copy-paste prompts untuk setiap anggota tim
    └── revisi/
        ├── BUBU.md   — Catatan & tasks untuk Bubu (Front-end)
        ├── KAIZO.md  — Catatan & tasks untuk Kaizo (Back-end)
        └── SORA.md   — Catatan & tasks untuk Sora (Full Stack Lead)
```

---

## Setiap Bagian — Siapa Kerjakan Apa

### apps/web — Bubu + Kaizo + Sora

Platform utama Soraku yang sudah live di Vercel.

**Bubu** handle:
- Semua halaman publik (`app/(public)/`)
- Auth pages (`app/(auth)/`)
- Dashboard user (`app/(dashboard)/`)
- Admin panel UI (`app/(admin)/`)
- Shared components (`components/`)

**Kaizo** handle:
- Semua API routes (`app/api/`)
- Database queries via Drizzle
- Auth middleware & session
- Supabase storage

**Sora** handle:
- Arsitektur, routing config, middleware
- TypeScript types & shared lib
- Deployment & environment
- Review code Bubu + Kaizo

---

### apps/stream — Sora (lead) + Bubu (UI)

Platform streaming anime Soraku. Dibuat setelah `services/api` selesai.

**Fitur yang akan dibangun:**
- Katalog anime (browse, search, filter genre)
- Halaman episode dengan video player
- Riwayat tonton per user
- Rekomendasi berdasarkan history

**Belum mulai.** Tunggu `services/api` dan katalog anime siap.

---

### apps/mobile — Sora (arsitektur) + Bubu (UI)

Mobile app dengan React Native / Expo.

**Fitur yang akan dibangun:**
- Akses komunitas (feed, posting)
- Push notifications
- Streaming player mobile
- User profile

**Belum mulai.** Priority setelah web + stream stabil.

---

### services/api — Kaizo (lead) + Sora (arsitektur)

Central REST API untuk seluruh platform. Semua client apps berkomunikasi ke sini.

**Stack yang akan dipakai:**
- Hono.js atau Fastify (lebih ringan dari Express)
- Drizzle ORM
- Supabase PostgreSQL (schema: `soraku`)
- Zod untuk validasi semua input

**Domain yang akan dihandle:**
- `/auth/*` — login, register, session, OAuth
- `/users/*` — profile, badges, activity
- `/community/*` — posts, reactions, follows
- `/content/*` — articles, categories, tags
- `/events/*` — events, RSVP
- `/gallery/*` — upload, review, moderation
- `/supporters/*` — tiers, history, webhooks
- `/streaming/*` — anime catalog, episodes, watch history
- `/notifications/*` — push, in-app
- `/admin/*` — management endpoints

**Belum mulai.** Ini yang paling urgent di-bangun setelah `apps/web` v0.6.0 selesai.

---

### services/bot — Kaizo (maintenance)

Discord bot yang sudah running di Railway. Source saat ini ada di folder `/Discord/` di root repo. Akan dimigrasikan ke `services/bot/` setelah monorepo lebih stabil.

**Fungsi aktif:**
- Sinkronisasi role supporter (Trakteer webhook → Discord role)
- Notifikasi event ke channel Discord
- Otomasi komunitas (welcome, dll)

---

### packages/types — Sora (owner)

Shared TypeScript types yang dipakai semua apps dan services.

**Sudah ada:** `User`, `Post`, `Event`, `GalleryItem`, `Anime`, `Episode`, `ApiResponse<T>`

**Cara pakai di apps lain:**
```ts
import type { User, ApiResponse } from "@soraku/types"
```

**Aturan:** Jangan define type yang sama di dua tempat. Kalau ada di sini, pakai dari sini.

---

### packages/ui — Bubu (owner)

Reusable React components yang bisa dipakai oleh `apps/web` dan `apps/stream`.

**Akan diisi dengan:** Button, Card, Badge, Modal, Input, Toast, Skeleton, Avatar, dll.

**Belum mulai.** Mulai setelah design system di `apps/web` sudah stabil.

---

### packages/utils — Sora + Kaizo

Helper functions yang dipakai di mana-mana.

**Akan diisi dengan:**
```ts
slugify(text: string): string
formatDate(date: string, locale?: string): string
formatRupiah(amount: number): string
truncate(text: string, maxLength: number): string
generateAvatar(name: string): string   // initials fallback
```

---

### packages/auth — Kaizo (owner)

Shared authentication logic agar tidak duplikasi di tiap app.

**Akan diisi dengan:**
- JWT helpers (sign, verify, decode)
- OAuth flow helpers (Discord, Google)
- Session management utilities
- Role guard helpers

---

### packages/config — Sora (owner)

Shared configs agar semua apps punya standar yang sama.

**Akan diisi dengan:**
- `eslint.config.js` — shared ESLint rules
- `tsconfig.base.json` — shared TypeScript config
- `prettier.config.js` — shared formatting rules

---

## Database — Domain Separation

Semua tabel ada di Supabase PostgreSQL, schema `soraku`.

| Domain | Tabel | Owner |
|--------|-------|-------|
| Users | `users`, `user_badges` | Kaizo |
| Community | `posts`, `reactions`, `follows`, `comments` | Kaizo |
| Content | `blog_posts`, `categories`, `tags` | Kaizo |
| Events | `events`, `event_rsvp` | Kaizo |
| Gallery | `gallery_items` | Kaizo |
| Supporters | `donatur`, `supporter_history` | Kaizo |
| Streaming | `anime`, `episodes`, `watch_history` | Kaizo |
| System | `notifications`, `audit_logs`, `music_tracks` | Kaizo |

**Aturan DB:**
- Standard fields setiap tabel: `id UUID`, `created_at TIMESTAMPTZ`, `updated_at TIMESTAMPTZ`
- Setiap tabel baru wajib RLS policy
- Perubahan DB selalu lewat migration file di `database/migrations/`
- Jangan pernah edit tabel production secara langsung

---

## Urutan Pengerjaan

```
SEKARANG (v0.1 → v0.6)
└── apps/web — selesaikan semua fitur utama
    ├── Kaizo : API routes per domain
    ├── Bubu  : UI pages + design system
    └── Sora  : middleware, types, deployment

SETELAH v0.6.0 SELESAI
└── packages/
    ├── types   — finalize semua shared types
    ├── utils   — helpers yang sudah dipakai di web
    └── config  — shared ESLint + TS

BERIKUTNYA
└── services/api — central REST API
    ├── Kaizo : migrate logic dari apps/web/api
    └── Sora  : arsitektur, routing, middleware

SELANJUTNYA
└── apps/stream — setelah services/api siap
    ├── Sora  : setup project, routing
    └── Bubu  : UI halaman streaming

TERAKHIR
└── apps/mobile — React Native / Expo
    └── Sora + Bubu
```

---

## Design System

Berlaku untuk semua apps (web, stream, mobile).

| Token | Value |
|-------|-------|
| Primary | `#6C5CE7` |
| Accent | `#38BDF8` |
| Background dark | `#020617` · `#0F172A` · `#111827` |
| Font | Inter (utama) · Poppins (sekunder) · Orbitron (aksen) |

**Card style (glass):**
```css
background: rgba(255, 255, 255, 0.06);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.08);
border-radius: 16px;
```

---

## Git Workflow

### Branch strategy
```
master    → production (Vercel auto-deploy)
develop   → development (staging)
feature/  → fitur baru   contoh: feature/gallery-upload
fix/      → bug fix       contoh: fix/auth-cookie
refactor/ → refactoring   contoh: refactor/navbar
```

### Commit format
```
feat(scope): deskripsi singkat
fix(scope): deskripsi singkat
refactor(scope): deskripsi singkat
docs(scope): deskripsi singkat
chore(scope): deskripsi singkat
```

### Git command wajib
```bash
git add -A -- ':!.github/workflows/ci.yml'
```

---

## Versioning

`MAJOR.MINOR.PATCH` — Semantic Versioning

| Tipe | Kapan |
|------|-------|
| MAJOR | Breaking change (misal: restructur DB besar) |
| MINOR | Fitur baru yang backward-compatible |
| PATCH | Bug fix |

---

## Safe Rebuild Rules

- Community system bisa di-rebuild tanpa affect streaming
- Streaming bisa di-update tanpa affect articles
- Setiap service communicate **hanya** lewat API — tidak direct DB access antar service
- Migration harus reversible — selalu ada `up` dan `down`

---

## Environment Variables

**apps/web (Vercel):**
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
TRAKTEER_API_KEY=trapi-nQQtEuQ3kf8gNNnlS0NP42FW
XENDIT_SECRET_KEY=          # optional - masih draft
NEXT_PUBLIC_DISCORD_INVITE=qm3XJvRa6B
BOT_WEBHOOK_URL=
BOT_WEBHOOK_SECRET=
```

**services/bot (Railway):**
```env
DISCORD_TOKEN=
DISCORD_GUILD_ID=
WEBHOOK_SECRET=
SORAKU_API_URL=https://soraku.vercel.app
```

---

*Soraku · Scalable · Modular · Maintainable · Long-term*
