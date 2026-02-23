# Soraku Community Platform

Platform komunitas VTuber Indonesia yang modern dan fullstack.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Auth**: Clerk (Discord OAuth)
- **Database**: Supabase (PostgreSQL)
- **Discord**: Discord API + Bot + Webhooks
- **Deploy**: Vercel

## Features

- 🎭 **VTuber System** — Profil VTuber per generasi dengan modal detail
- 📝 **Blog System** — CRUD blog dengan status draft/published
- 🎉 **Events System** — Event management + Discord webhook integration
- 🖼️ **Gallery System** — Upload foto dengan approval workflow
- 💬 **Discord Stats** — Live member count & online status (refresh 60s)
- 🛡️ **Role System** — MANAGER, AGENSI, ADMIN, USER
- 🔧 **Maintenance Mode** — Toggle dari dashboard admin
- 🔐 **Admin Panel** — Full management dashboard

## Quick Start

Lihat [SETUP.md](./SETUP.md) untuk panduan instalasi lengkap.

```bash
npm install
cp .env.example .env.local
# isi environment variables
npm run dev
```

## Project Structure

```
src/
├── app/           # Next.js App Router pages
│   ├── api/       # Backend API routes
│   ├── admin/     # Admin panel pages
│   ├── vtuber/    # VTuber pages (by generation)
│   ├── blog/      # Blog pages
│   ├── events/    # Events pages
│   └── gallery/   # Gallery page
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks
└── lib/           # Utilities, DB client, roles
```

## License

MIT
