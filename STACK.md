# 🧩 Stack & Features Soraku Monorepo

> Dokumentasi lengkap stack teknologi dan fitur untuk setiap service.
> Full prompt: You are a senior full-stack engineer and architect. Your role is to refactor and scale the Soraku Community Platform — an existing monorepo for an anime & Japanese culture non-profit community based in Indonesia. Do NOT rebuild from scratch. Improve, refactor, and scale incrementally.

---

## 📌 UI References

### UI Reference

- **Repo**: https://github.com/Shreyas-29/propease.git
- **Inspiration**: https://propease-app.vercel.app/

### Dashboard Reference

- **Link**: https://dub.sh/shadcn-dashboard
- **Repo**: https://github.com/Kiranism/next-shadcn-dashboard-starter.git

---

## 📊 Tech Stack Overview

| Service          | Framework               | React    | TypeScript | Database           | Cache                    | Auth           |
| ---------------- | ----------------------- | -------- | ---------- | ------------------ | ------------------------ | -------------- |
| **apps/web**     | Next.js 15 (App Router) | React 19 | ✓          | Drizzle + Supabase | Upstash Redis (optional) | Supabase Auth  |
| **apps/stream**  | Next.js 15 (App Router) | React 19 | ✓          | -                  | -                        | -              |
| **services/api** | Node/Hono               | -        | ✓          | Drizzle + Supabase | Upstash Redis            | JWT            |
| **services/bot** | Node.js 18+             | -        | -          | Supabase           | -                        | Discord.js v14 |

---

## 🎨 Design System (LOCKED — DO NOT CHANGE)

| Token         | Value     |
| ------------- | --------- |
| **Primary**   | `#4FA3D1` |
| **Dark**      | `#1C1E22` |
| **Secondary** | `#6E8FA6` |
| **Light**     | `#D9DDE3` |
| **Accent**    | `#E8C2A8` |

### Rules

- Dark mode by default
- `border-radius: rounded-2xl`
- Spacing unit: 8px base
- Soft shadows, no harsh borders
- Gradient direction: primary → secondary → accent
- Typography: `font-heading` for display, `font-body` for content

---

## 📦 Apps/Web (`apps/web`)

### 🔧 Dependencies

- **Framework**: Next.js 15 (App Router)
- **React**: 19.x
- **TypeScript**: ✓
- **UI**: shadcn/ui, Radix UI, Lucide React, Tailwind CSS v4, Framer Motion
- **Database**: Drizzle ORM + Supabase
- **Auth**: Supabase Auth (email/password + Google OAuth)
- **State**: Zustand, TanStack Query
- **Table**: TanStack Table

### ✨ Features

- Landing page + blog komunitas
- User profiles (auth Supabase)
- VTuber listing
- Events system
- Gallery (karya komunitas)
- Premium/subscription
- Admin dashboard (/admin)
- Discord widget (real-time member count + online avatars)
- Support page (Trakteer + Xendit integration)

---

## 📺 Apps/Stream (`apps/stream`)

### 🔧 Dependencies

- **Framework**: Next.js 15 (App Router)
- **React**: 19.x
- **TypeScript**: ✓
- **UI**: Tailwind CSS v4, Vidstack, Lucide

### ✨ Features

- Anime streaming (GogoAnime, HiAnime, Animekai, AniBaru)
- Search & discovery
- Episode streaming (HLS)
- Watch history
- Favorites
- Dashboard (/dashboard)
- API Docs (/api-docs)

---

## 🌐 Services/API (`services/api`)

### 🔧 Dependencies

- **Framework**: Node/Hono
- **TypeScript**: ✓
- **Database**: Drizzle ORM + Supabase
- **Cache**: Upstash Redis (optional)
- **Auth**: JWT

### 🔌 API Modules

| Module           | Endpoints                    |
| ---------------- | ---------------------------- |
| `/users`         | profile, role, avatar        |
| `/posts`         | CRUD, like, comment, view    |
| `/events`        | CRUD, register, status       |
| `/gallery`       | upload, list, delete         |
| `/support`       | donation, supporter list     |
| `/vtubers`       | list, detail                 |
| `/notifications` | list, mark read, broadcast   |
| `/partnerships`  | list, CRUD (admin)           |
| `/settings`      | site settings (webhook URLs) |

### 📝 Response Format

```typescript
// Success
{ success: true, data: T, meta?: { page, limit, total } }

// Error
{ success: false, error: string, code?: string }
```

---

## 🤖 Services/Bot (`services/bot`)

### 🔧 Dependencies

- **Runtime**: Node.js 18+
- **Discord**: discord.js v14
- **Database**: Supabase (async)
- **Image**: @napi-rs/canvas

### ✨ Features

- Multi-process sharding
- Giveaways
- Moderation
- Custom commands
- Supabase sync
- Webhooks: `/webhook/notify`, `/webhook/event-announce`, `/webhook/role-sync`
- In-memory cooldown/anti-abuse (no DB)
- Branding: "Soraku", "Riu x Soraku Studio"

---

## 🏗️ Monorepo Structure

```
apps/
  web/          → Main platform (Next.js)
  stream/       → Anime streaming UI (Next.js)

services/
  api/          → Standalone REST API (Node/Hono)
  bot/          → Discord bot (Discord.js)

packages/
  ui/           → Shared components (base + soraku)
  types/        → Shared TypeScript types
  utils/        → Shared utilities
  database/     → Drizzle schema + migrations
  auth/         → Auth helpers
  api-client/   → Typed API client
```

---

## 🗄️ Database Schema

### Schemas

- `public` - Auth users
- `soraku` - Platform data
- `bot` - Bot data

### Tables

- `users` - User accounts
- `profiles` - Extended profile data
- `vtubers` - VTuber database
- `events` - Community events
- `blog` / `posts` - Blog articles
- `gallery` - User submissions
- `subscriptions` - Premium subscriptions
- `notifications` - User notifications
- `partnerships` - Sponsorships & partnerships

### Rules

- All tables: RLS enabled
- Migration files: `supabase/migrations/YYYYMMDD_name.sql`

---

## 🎯 Target Folder Structure (`apps/web`)

```
src/
  app/
    (public)/         → Landing, blog, events, gallery, about
    (auth)/           → Login, register, reset
    (dashboard)/      → Protected: profile, posts, notifications
    (admin)/          → Admin panel
    api/              → Route handlers

  features/
    auth/             → Auth logic, hooks, guards
    dashboard/        → Dashboard widgets, activity feed
    profile/         → Profile page, tabs, badges
    posts/            → Blog/article CRUD
    events/           → Event pages + registration
    gallery/          → Gallery grid + upload
    community/        → VTuber, Discord widget
    support/         → Donation UI, supporter list
    notifications/    → Notification center + settings

  components/
    layout/           → Navbar, Footer, Sidebar
    ui/               → Base shadcn components
    soraku/           → Soraku-branded components
```

---

## 🔐 Roles & Permissions

### User Roles

- `USER` - Default
- `KREATOR` - Content creator
- `AGENSI` - Agency
- `ADMIN` - Admin
- `MANAGER` - Manager
- `OWNER` - Owner

### Supporter Roles (nullable)

- `DONATUR` - Donatur
- `VIP` - VIP supporter
- `VVIP` - Very VIP supporter

---

## 📱 Navbar Rules

### Desktop Dropdowns

- **Fitur**: Events, Blog, Galeri, Premium
- **Komunitas**: VTuber, Donasi
- **Informasi**: Tentang Soraku, Rekrutmen, Masukan, Privasi, Ketentuan, Lisensi

### Mobile Menu — Two Separate Sections

1. **Web nav**: Jelajahi grid (Beranda, Events, Blog, Galeri, VTuber, Premium) + Komunitas + Informasi grid
2. **User section**: Hanya muncul jika login (profile card, Profil Saya, Notifikasi, Admin Panel if eligible, Keluar)

### Notes

- "Tentang Soraku" NOT in its own nav item — inside Informasi dropdown
- Label is "Informasi" not "Info"
- Mobile: user nav dan web nav dipisah jelas

---

## 🦶 Footer Rules

### Desktop

- 4 columns: Brand, Platform, Komunitas, Informasi

### Mobile

- 2 columns: Platform | Lainnya

### Notes

- Remove: "Non-profit Indonesia" from copyright line
- Keep: social icons, license notice, copyright

---

## 🏠 Homepage Specs

- **Hero**: anime mascot seamless (no card/border), floating community tags, CTA
- **Category marquee**: infinite scroll, colored glow per category, pause on hover
- **Community statement**: large typography, no stats
- **Platform cards**: 6 floating cards (Events, Blog, Galeri, VTuber, Premium, Discord)
- **Events**: grid cards with Live / Upcoming / Selesai badge
- **Articles**: cards with author avatar, view count, like count, date
- **Discord widget**: real-time member count + online avatars (no fake chat)
- **Social media**: marquee (no heading), two rows opposite direction
- **Support CTA**: only shown to guest users

---

## 📊 Dashboard Specs

### Sidebar Items

Dashboard, Explore, Profile, Posts, Notifications, Settings, Admin (role-gated)

### Dashboard Page

- **Stats cards**: Reputation, Badges, Supporter count, Post count
- **Activity feed**: recent actions (post, like, comment, event join)
- **Quick actions**: New Post, Edit Profile, View Notifications

---

## 👤 Profile Specs

- Banner + avatar + bio + social links
- Tabs: Posts, Galeri, Aktivitas, Pendukung
- Badge + reputation system
- Editable from `/profile/me`

---

## 🔔 Notifications Specs

### Auto-triggered

- new event, new article, system, level-up, ban, event reminder

### Admin Features

- Manageable from admin panel (broadcast, delete, filter by type)

### UI

- Bell icon in navbar with unread badge
- Full page: `/notifications` with filter tabs

---

## 📅 Events Specs

- List + detail page
- Registration requires login
- Status: Live / Upcoming / Selesai
- Admin: create, update, delete, publish/unpublish

---

## 📝 Articles Specs

- Public read, auth required to interact
- Author info, view count, like count, comment count
- Admin/Kreator can publish

---

## 🖼️ Gallery Specs

- Public grid, upload requires login
- Category filter
- Lightbox preview

---

## 💖 Support (Dukung Soraku) Specs

- Donation page: Trakteer + Xendit integration
- Supporter list (DONATUR, VIP, VVIP tiers)
- Supporter badge on profile

---

## 💬 Discord Widget Specs

- Real: total member count + online count from widget.json
- Show up to 8 online member avatars with status dot
- CTA: Gabung Server button

---

## 🤝 Sponsorship & Partnership Specs

- Shown on homepage if data exists
- Manageable via admin panel (create, update, delete, toggle active)

---

## ⚙️ Admin Panel Sections

- Dashboard overview (total users, posts, events)
- Users: list, role change, ban, unban
- Posts: list, publish/unpublish, delete
- Events: CRUD, publish toggle
- Gallery: moderate, delete
- Notifications: broadcast, manage
- Partnerships: CRUD
- Sponsorships: CRUD
- Site Settings: webhook URLs (Discord registration, event announce)

---

## 🚀 Migration Strategy

### Strangler Fig Pattern — Incremental, Never Big-Bang

| Phase   | Focus                             |
| ------- | --------------------------------- |
| Phase 1 | Move shared UI to packages/ui     |
| Phase 2 | Refactor auth feature             |
| Phase 3 | Refactor profile + dashboard      |
| Phase 4 | Refactor posts + events + gallery |
| Phase 5 | Refactor support + notifications  |
| Phase 6 | Refactor API into modules         |
| Phase 7 | Refactor stream UI (last)         |
| Phase 8 | Cleanup, test, document           |

### Rules Per Phase

- Only one phase at a time
- Test before moving to next phase
- Never mix UI and business logic

---

## 📜 Conventions

- All tables: RLS enabled
- DB schemas: public (auth users), soraku (platform data), bot (bot data)
- Migration files: `supabase/migrations/YYYYMMDD_name.sql`
- New API routes: `apps/web/src/app/api/**`
- Env: type-safe via T3 Env (`src/env.ts`)
- No hardcoded colors — always use CSS variables or design tokens
- No stats/numbers on homepage community section
- No "Ikuti Kami" heading on social media section
- Component exports: named, not default (except pages)

---

## 🌍 Deployment

| Service      | Platform | URL                  |
| ------------ | -------- | -------------------- |
| apps/web     | Vercel   | soraku.id            |
| apps/stream  | Vercel   | stream.soraku.id     |
| services/api | Vercel   | apisoraku.vercel.app |
| services/bot | Railway  | Discord bot          |

---

## 🛠️ Development Commands

```bash
# Build all
pnpm build

# Develop
cd apps/web && pnpm dev      # localhost:3000
cd apps/stream && pnpm dev   # localhost:3001
cd services/api && pnpm dev # localhost:4000
```

---

Last updated: April 2026
