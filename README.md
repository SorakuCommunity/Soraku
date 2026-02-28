<div align="center">

# 🎌 Soraku

**Platform Komunitas Anime, Manga & Budaya Digital Jepang**

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com)
[![Version](https://img.shields.io/badge/version-1.0.a3.1-4FA3D1)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-Proprietary-red)](LICENSE)

[🌐 Live Demo](https://soraku.vercel.app) · [💬 Discord](https://discord.gg/CJJ7KEJMbg) · [🐛 Issues](https://github.com/SorakuCommunity/Soraku/issues) · [📋 Changelog](CHANGELOG.md)

</div>

---

## ✨ Fitur

| Fitur | Deskripsi |
|-------|-----------|
| 🎨 **Theme System** | Admin palette + User dark/light/auto mode |
| 👤 **Public Profile** | `/u/[username]` — cover, bio, role badge, socials |
| ✏️ **Edit Profile** | `/edit/profile` — form dengan Zod validation |
| 🎭 **VTuber Directory** | Grid animasi, editable oleh AGENSI+ |
| 📝 **Blog** | Artikel + Spotify player embed |
| 🖼️ **Gallery** | Upload, filter, admin approval |
| 🏘️ **Komunitas** | GitHub Discussions + Discord CTA |
| 🔐 **Auth** | Supabase Auth + OAuth GitHub & Discord |
| ⚡ **Redis Cache** | GitHub, Spotify, rate limiting |
| 🛡️ **RLS** | Row Level Security di semua tabel |
| 📱 **Responsive** | Mobile-first, grid 3 kolom minimum |

---

## 🛠️ Tech Stack

```
Next.js 15 App Router     TypeScript Strict Mode
Supabase Auth + PostgreSQL TailwindCSS + CSS Variables
Framer Motion             Lucide React
Zod Validation            DOMPurify Sanitization
Redis (ioredis) + BullMQ  Sonner (toast)
React Hook Form           Vercel (deploy)
```

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/SorakuCommunity/Soraku.git
cd Soraku
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
# Edit .env.local dengan nilai yang sesuai
```

### 3. Database Setup

Di Supabase SQL Editor, jalankan secara berurutan:
1. `schema.sql` — schema lengkap
2. `lib/migration_v1.0.a3.1.sql` — migration v1.0.a3.1

### 4. Run

```bash
npm run dev
# Buka http://localhost:3000
```

---

## ⚙️ Environment Variables

Buat `.env.local` dari template:

```env
# ── Supabase (wajib) ──────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# ── GitHub (untuk Discussions) ────────────────────────
GITHUB_TOKEN=ghp_...
GITHUB_OWNER=SorakuCommunity
GITHUB_REPO=Soraku

# ── Discord ───────────────────────────────────────────
DISCORD_GUILD_ID=
DISCORD_BOT_TOKEN=
DISCORD_WEBHOOK_URL=
DISCORD_WEBHOOK_SECRET=    # secret untuk verifikasi webhook

# ── Spotify ───────────────────────────────────────────
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=

# ── Redis ─────────────────────────────────────────────
REDIS_URL=redis://localhost:6379

# ── App ───────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 📁 Struktur Project

```
Soraku/
├── app/                        # Next.js App Router
│   ├── page.tsx                # Landing page
│   ├── layout.tsx              # Root layout (theme, SSR)
│   ├── globals.css             # CSS variables + base styles
│   ├── login/                  # Halaman login
│   ├── register/               # Halaman registrasi
│   ├── profile/                # Redirect → /u/[username]
│   ├── edit/profile/           # Form edit profil
│   ├── u/[username]/           # Public profile
│   ├── blog/                   # Blog list + detail
│   ├── gallery/                # Gallery + upload
│   ├── komunitas/              # Komunitas + discussions
│   ├── Vtuber/                 # VTuber directory
│   ├── Soraku_Admin/           # Admin dashboard (ADMIN+)
│   └── api/                    # API routes
│       ├── auth/callback/
│       ├── theme/
│       ├── admin/theme/
│       ├── admin/users/
│       ├── profile/theme/
│       ├── discord/stats/
│       ├── discord/webhook/
│       ├── maintenance/
│       ├── spotify/search/
│       ├── spotify/track/
│       └── webhooks/discord/
│
├── components/
│   ├── Navbar.tsx              # Navigasi + theme toggle
│   ├── Footer.tsx              # Footer
│   ├── ThemeProvider.tsx       # Client theme management
│   └── admin/
│       └── AdminShell.tsx      # Admin sidebar layout
│
├── lib/                        # Business logic (CENTRALIZED)
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   └── server.ts           # Server client (SSR)
│   ├── supabase.ts             # Barrel + sync client
│   ├── theme.ts                # Theme loader + CSS builder
│   ├── roles.ts                # RBAC system
│   ├── schemas.ts              # Zod schemas (semua form)
│   ├── validations.ts          # Zod validators tambahan
│   ├── utils.ts                # Utility functions
│   ├── redis.ts                # Redis cache + BullMQ
│   ├── github.ts               # GitHub Discussions API
│   ├── spotify.ts              # Spotify API
│   ├── discord.ts              # Discord API + webhooks
│   ├── maintenance.ts          # Maintenance mode
│   ├── sanitize.ts             # DOMPurify wrapper
│   └── migration_v1.0.a3.1.sql
│
├── hooks/
│   ├── useTheme.ts             # Theme toggle hook
│   └── useUser.ts              # Auth state hook
│
├── middleware.ts               # Auth protection
├── schema.sql                  # Full DB schema
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.example
├── .gitignore
├── LICENSE
├── CHANGELOG.md
├── CONTRIBUTING.md
├── SECURITY.md
└── README.md
```

---

## 🎨 Theme System

### Default Palette

| Variable | Warna | Kegunaan |
|----------|-------|----------|
| `--color-primary` | `#4FA3D1` | Tombol, link aktif, hover |
| `--color-dark-base` | `#1C1E22` | Background dark mode |
| `--color-secondary` | `#6E8FA6` | Border, subheading |
| `--color-light-base` | `#D9DDE3` | Background light mode |
| `--color-accent` | `#E8C2A8` | Badge khusus, highlight |

Admin dapat mengubah palette via `/Soraku_Admin` → Tema.

---

## 👥 Role System

| Role | Rank | Privilege |
|------|------|-----------|
| `OWNER` | 7 | Full access |
| `MANAGER` | 6 | Manage users + content |
| `ADMIN` | 5 | Moderate content |
| `AGENSI` | 4 | Manage VTuber |
| `PREMIUM` | 3 | Unlimited social links |
| `DONATE` | 2 | Donatur badge |
| `USER` | 1 | Default (max 2 socials) |

---

## 🚢 Deploy ke Vercel

### Via GitHub (Otomatis)

1. Push ke GitHub
2. Import di [vercel.com/new](https://vercel.com/new)
3. Set environment variables
4. Deploy!

### Manual CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 📜 NPM Scripts

```bash
npm run dev          # Dev server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run type-check   # TypeScript check
npm run format       # Prettier
npm run clean        # Reset node_modules + .next
```

---

## 🤝 Contributing

Lihat [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan lengkap.

---

## 🔐 Security

Laporkan kerentanan ke: **echo.soraku@gmail.com**  
Lihat [SECURITY.md](SECURITY.md) untuk detail.

---

## 📄 License

Proprietary — © 2024–2025 Soraku Community. All rights reserved.  
Lihat [LICENSE](LICENSE).

---

<div align="center">

Made with ❤️ by [Soraku Community](https://github.com/SorakuCommunity)

[🌐 soraku.vercel.app](https://soraku.veraku.app) · [💬 Discord](https://discord.gg/CJJ7KEJMbg) · [📷 Instagram](https://instagram.com/soraku.moe)

</div>
