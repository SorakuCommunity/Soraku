# SORAKU — MONOREPO ARCHITECTURE

> Platform ekosistem komunitas pop culture Jepang · Revisi 2026-04-03

---

## Gambaran Besar

Soraku bukan hanya website — ini adalah **ekosistem platform** dengan dua database terpisah yang saling terintegrasi.

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT APPS                            │
│                                                             │
│   apps/web          apps/stream        apps/mobile          │
│   (Next.js)         (Next.js)          (React Native)       │
│   Komunitas       Anime streaming     iOS & Android         │
└────────────────────────────┬────────────────────────────────┘
                           │  semua komunikasi lewat API
┌──────────────────────────▼────────────────────────────────┐
│                   services/api                         │
│   ┌─────────────────────────────────────────────┐  │
│   │            /api/community/*                │  │
│   │  blog, events, users, gallery, premium     │  │
│   └─────────────────────────────────────────────┘  │
│   ┌─────────────────────────────────────────────┐  │
│   │            /api/stream/*                  │  │
│   │  anime, watch-history, favorites          │  │
│   └─────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                           │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│  KOMUNITAS │   │ STREAMING  │   │  BOT     │
│  Database │   │ Database │   │ Discord  │
│  (Drizzle)│   │ (Drizzle)│   │ (Railway)│
└───────────┘   └───────────┘   └───────────┘
```

**Aturan wajib:**

- Client apps TIDAK boleh query database langsung. Semua lewat `services/api`.
- services/api sebagai single entry point untuk semua client apps.
- User identity sync melalui Supabase Auth yang sama.

---

## Struktur Folder

```
SorakuCommunity/Soraku/
│
├── apps/
│   ├── web/          ✅ AKTIF   — Platform komunitas (Next.js, Vercel)
│   ├── stream/       ✅ AKTIF   — Anime streaming (Next.js)
│   └── mobile/       🔜 PLANNED — Mobile app (React Native / Expo)
│
├── services/
│   ├── api/          ✅ AKTIF   — Central REST API (Next.js)
│   │   └── src/
│   │       ├── app/api/
│   │       │   ├── community/     ← Komunitas endpoints
│   │       │   │   ├── users/
│   │       │   │   ├── blog/
│   │       │   │   ├── events/
│   │       │   │   ├── vtubers/
│   │       │   │   ├── gallery/
│   │       │   │   └── premium/
│   │       │   │       └── donate/
│   │       │   └── stream/        ← Streaming endpoints
│   │       │       ├── watch-history/
│   │       │       ├── favorites/
│   │       │       └── scrape/
│   │       └── lib/
│   │           ├── db/
│   │           │   ├── community.ts  ← Drizzle: soraku-komunitas
│   │           │   └── stream.ts   ← Drizzle: soraku-streaming
│   │           ├── scraper/        ← Anime scraper integration
│   │           └── scheduler/      ← Background jobs
│   └── bot/          ✅ AKTIF   — Discord bot (Railway)
│
├── packages/
│   ├── types/        ✅ AKTIF   — Shared TypeScript types
│   ├── utils/        ✅ AKTIF   — Shared helper functions
│   ├── api-client/   ✅ AKTIF   — API client
│   ├── auth/        ✅ AKTIF   — Auth helpers
│   ├── config/      ✅ AKTIF   — Shared ESLint & TS config
│   └── database/    ✅ AKTIF   — Drizzle config
│
└── docs/
    └── routes/
        └── MONOREPO.md   ← File ini
```

---

## Setiap Bagian — Responsibility

### apps/web — Front-end + Back-end

Platform utama Soraku untuk komunitas.

**Front-end handle:**

- Semua halaman publik
- Auth pages
- Dashboard user
- Admin panel UI
- Shared components

**Back-end handle:**

- API routes di /api/community/\* (services/api)
- Database queries via Drizzle
- Auth middleware & session

**Core/Lead handle:**

- Arsitektur, routing config, middleware
- TypeScript types & shared lib
- Deployment & environment

---

### apps/stream — Streaming Team

Platform streaming anime Soraku.

**Fitur:**

- Katalog anime (browse, search, filter genre)
- Halaman episode dengan video player
- Riwayat tonton per user
- Favorites anime

**Lead handle:**

- Setup project, routing
- API integration dengan services/api

**Front-end handle:**

- UI halaman streaming
- Video player component

---

### apps/mobile — Mobile Team

Mobile app dengan React Native / Expo.

**Fitur:**

- Akses komunitas (feed, posting)
- Streaming player mobile
- Push notifications
- User profile

---

### services/api — API Team

Central REST API untuk seluruh platform.

**Stack:**

- Next.js (App Router)
- Drizzle ORM (dual database)
- Zod untuk validasi

**API Structure:**

- /api/community/\* — komunitas endpoints
- /api/stream/\* — streaming endpoints

---

### services/bot — Bot Team

Discord bot yang running di Railway.

**Fungsi aktif:**

- Sinkronisasi role supporter (Trakteer webhook → Discord role)
- Notifikasi event ke channel Discord
- Otomasi komunitas

---

### packages/types — TypeScript Owner

Shared TypeScript types.

**Sudah ada:** User, Post, Event, GalleryItem, Anime, Episode, ApiResponse<T>

### Project 1: soraku-komunitas

**Project ID:** jrgknsxqwuygcoocnnnb  
**Schema:** soraku (komunitas), bot (Discord bot)

Untuk community features:

| Domain     | Tabel                               | API Route                 |
| ---------- | ----------------------------------- | ------------------------- |
| Users      | users, user_badges                  | /api/community/users/\*   |
| Community  | posts, reactions, follows, comments | /api/community/blog/\*    |
| Events     | events, event_rsvp                  | /api/community/events/\*  |
| Gallery    | gallery_items                       | /api/community/gallery/\* |
| VTuber     | vtubers                             | /api/community/vtubers/\* |
| Supporters | donatur, supporter_history          | /api/community/premium/\* |

### Project 2: soraku-streaming

**Project ID:** qrplumamxikcxvaerlug  
**Schema:** soraku

Untuk streaming features:

| Domain        | Tabel         | API Route                    |
| ------------- | ------------- | ---------------------------- |
| Watch History | watch_history | /api/stream/watch-history/\* |
| Favorites     | favorites     | /api/stream/favorites/\*     |
| User Settings | user_settings | /api/stream/settings/\*      |

**Catatan:** Anime catalog TIDAK di database — comes from external scraping (HiAnime, GogoAnime, etc.)

---

## API Routes — Detail

### /api/community/\* — Komunitas

```
GET    /api/community                  # Health check + available endpoints
GET    /api/community/users           # List users
GET    /api/community/users/:username # Get user profile
PATCH  /api/community/users/:username # Update user profile (auth required)
GET    /api/community/blog             # List blog posts
GET    /api/community/blog/:slug       # Get blog post
POST   /api/community/blog/:slug/likes     # Toggle like (auth required)
POST   /api/community/blog/:slug/views    # Increment view
GET    /api/community/blog/:slug/comments     # Get comments
POST   /api/community/blog/:slug/comments    # Add comment
POST   /api/community/blog/:slug/comments/:id/reply  # Reply to comment
GET    /api/community/events           # List events
GET    /api/community/events/:slug     # Get event detail
GET    /api/community/vtubers           # List VTubers
GET    /api/community/vtubers/:slug     # Get VTuber detail
GET    /api/community/gallery           # List gallery (approved)
POST   /api/community/gallery          # Upload image (auth required)
GET    /api/community/premium           # Supporter leaderboard
POST   /api/community/donate/xendit/create   # Create Xendit invoice
POST   /api/community/donate/xendit/webhook  # Xendit webhook
POST   /api/community/donate/trakteer        # Trakteer webhook
```

### /api/stream/\* — Anime Streaming

```
GET    /api/stream                     # Health check + streaming info
GET    /api/stream/sources            # Anime provider status (online/degraded/offline)
GET    /api/stream/:slug               # Anime detail + episodes
GET    /api/stream/:slug/:episode      # Episode stream URLs + subtitles
GET    /api/stream/watch-history      # Get user's watch history (auth required)
POST   /api/stream/watch-history       # Update watch progress (auth required)
GET    /api/stream/favorites           # Get user's favorites (auth required)
POST   /api/stream/favorites           # Add favorite (auth required)
DELETE /api/stream/favorites/:animeId  # Remove favorite (auth required)
```

---

## Scraping Integration

Anime-scraper diintegrasikan ke dalam services/api:

```
services/api/src/lib/scraper/
├── index.ts              # anime-scraper core
├── providers/
│   ├── hianime.ts
│   ├── gogoanime.ts
│   ├── samehadaku.ts
│   └── ...
```

Usage di Next.js API route:

```ts
// services/api/src/app/api/stream/route.ts
import { getProvider } from "@/lib/scraper";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const source = searchParams.get("source") ?? "hianime";

  const provider = getProvider(source);
  const results = await provider.search(q!);

  return Response.json({ data: results, error: null });
}
```

---

## User Identity Sync

### Masalah

apps/stream dan apps/web punya database berbeda — bagaimana user badges, level, supporter tier sync?

### Solusi

**1. Single Supabase Auth**

```ts
// Semua app pake Supabase Auth yang sama
// JWT contains: user_id, email, role
```

**2. User Data dari API**

```ts
// Di /api/stream/watch-history:
// Response includes user badge info from community DB:

{
  "history": [...],
  "user": {
    "level": 5,
    "badges": ["verified", "supporter"],
    "supporterTier": "VIP"
  }
}
```

**3. Database Reference**

```sql
-- Di soraku-streaming.watch_history:
-- user_id = auth.id (dari Supabase Auth, sama dengan soraku-komunitas.users.id)
```

---

## Git Workflow

Berlaku untuk semua apps (web, stream, mobile).

| Token           | Value                                                 |
| --------------- | ----------------------------------------------------- |
| Primary         | `#6C5CE7`                                             |
| Accent          | `#38BDF8`                                             |
| Background dark | `#020617` · `#0F172A` · `#111827`                     |
| Font            | Inter (utama) · Poppins (sekunder) · Orbitron (aksen) |

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

---

## Versioning

MAJOR.MINOR.PATCH — Semantic Versioning

| Tipe  | Kapan                               |
| ----- | ----------------------------------- |
| MAJOR | Breaking change (restructure DB)    |
| MINOR | Fitur baru yang backward-compatible |
| PATCH | Bug fix                             |

---

## Safe Rebuild Rules

- Community system bisa di-rebuild tanpa affect streaming
- Streaming bisa di-update tanpa affect komunitas
- services/api bisa deploy tanpa affect client apps
- Setiap service communicate HANYA lewat API

---

## Environment Variables

**services/api (Vercel):**

```env
# Community DB (soraku-komunitas) - Project: jrgknsxqwuygcoocnnnb
DATABASE_URL=postgresql://...

# Streaming DB (soraku-streaming) - Project: qrplumamxikcxvaerlug
STREAMING_DATABASE_URL=postgresql://...

# Auth (pake yang dari komunitas)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Bot
SORAKU_API_SECRET=
BOT_WEBHOOK_URL=
```

**apps/web (Vercel):**

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=https://apisoraku.vercel.app
```

**services/api (Vercel):**

```env
# Community DB (soraku-komunitas) - Project: jrgknsxqwuygcoocnnnb
DATABASE_URL=postgresql://...

# Streaming DB (soraku-streaming) - Project: qrplumamxikcxvaerlug
STREAMING_DATABASE_URL=postgresql://...

# Auth (pake yang dari komunitas)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Bot
SORAKU_API_SECRET=
BOT_WEBHOOK_URL=
```

**apps/stream (Vercel):**

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=https://apisoraku.vercel.app
```

---

_Soraku · Scalable · Modular · Maintainable · Long-term_
