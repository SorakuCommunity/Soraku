# 🌸 SORAKU — Komunitas Anime, Manga & Kultur Digital Jepang

![Version](https://img.shields.io/badge/version-v1.0.0--alpha.2-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8)

**Soraku** adalah platform komunitas untuk para penggemar anime, manga, dan kultur digital Jepang. Immersive, modern, dan anime-inspired.

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 🎭 **Komunitas** | Forum diskusi anime, manga, fan art, dan review |
| ⭐ **Vtuber System** | Profil dan manajemen Vtuber per generasi |
| 📝 **Blog** | Artikel dengan integrasi Spotify music player |
| 🗓️ **Events** | Manajemen event dengan Discord webhook sync |
| 🖼️ **Gallery** | Upload karya dengan sistem moderasi |
| 🛡️ **Admin Panel** | Dashboard lengkap dengan RBAC |

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + Glassmorphism + Neon accents
- **Auth**: Clerk (Google + Discord OAuth)
- **Database**: Supabase PostgreSQL + RLS
- **Discord**: Bot integration + Webhooks
- **Spotify**: Web API integration
- **Deploy**: Vercel

## 🎭 Role System

| Role | Level | Akses |
|------|-------|-------|
| SUPERADMIN | 5 | Full access + Maintenance toggle |
| MANAGER | 4 | Full CRUD Vtuber, manage roles |
| AGENSI | 3 | Add/edit Vtuber |
| ADMIN | 2 | Manage blog, events, gallery moderation |
| USER | 1 | View & upload gallery |

## 🚀 Quick Start

Lihat [SETUP.md](./SETUP.md) untuk panduan instalasi lengkap.

```bash
# Install dependencies
npm install

# Copy env
cp .env.example .env.local

# Run development server
npm run dev
```

## 📁 Project Structure

```
soraku/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   ├── community/         # Community page
│   ├── events/            # Events pages
│   ├── gallery/           # Gallery page
│   ├── maintenance/       # Maintenance page
│   └── vtuber/            # Vtuber pages (dynamic)
├── components/            # React components
│   ├── admin/             # Admin components
│   ├── blog/              # Blog components (SpotifyPlayer)
│   ├── community/         # Community components (DiscordSection)
│   ├── events/            # Events components
│   ├── layout/            # Navbar, Footer, Hero
│   └── ui/                # Shared UI components
├── hooks/                 # Custom React hooks
│   ├── useDiscord.ts      # Discord stats with auto-refresh
│   ├── useAuthRole.ts     # Auth role check
│   └── useMaintenance.ts  # Maintenance mode check
├── lib/                   # Utilities & integrations
│   ├── discord.ts         # Discord API + caching
│   ├── roles.ts           # RBAC permission system
│   ├── spotify.ts         # Spotify Web API
│   ├── supabase.ts        # Supabase client
│   └── maintenance.ts     # Maintenance mode
├── types/                 # TypeScript types
├── middleware.ts           # Route protection + maintenance
├── schema.sql             # Supabase database schema
└── .env.example           # Environment variables template
```

## 🎨 Design System

```
Primary:    #4FA3D1  (Soraku Blue)
Dark Base:  #1C1E22  (Deep Dark)
Secondary:  #6E8FA6  (Steel Blue)
Light Base: #D9DDE3  (Off White)
Accent:     #E8C2A8  (Warm Peach)
```

- **Glassmorphism** cards dengan blur backdrop
- **Neon glow** effect pada hover
- **Gradient text** pada heading
- **Dark mode** by default
- **Subtle grid pattern** background

## 🔒 Maintenance Mode

Set `MAINTENANCE_MODE=true` di environment variables untuk mengaktifkan maintenance mode. Semua route akan redirect ke `/maintenance` kecuali Discord join link.

## 📄 License

MIT License — Soraku Community 2025
