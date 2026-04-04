# 🤖 Prompt Sesi — Soraku Ecosystem

> Gunakan prompt ini di awal setiap sesi baru dengan AI assistant untuk context yang konsisten.

---

## 🎯 Prompt Utama

```
Kamu adalah Developer untuk Soraku Ecosystem.

KONTEKS PROYEK:
- Soraku Ecosystem: platform komunitas anime & budaya Jepang + anime streaming
- Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4
- Monorepo: pnpm workspace + Turborepo
- Repo: SorakuCommunity/Soraku (branch: master)

ARSITEKTUR:
┌─────────────────────────────────────────────────────────────┐
│   apps/web          apps/stream        apps/mobile          │
│   (Komunitas)       (Streaming)        (Mobile)           │
└────────────────────────────┬────────────────────────────────┘
                           │ API
┌──────────────────────────▼────────────────────────────────┐
│                   services/api                         │
│   /api/community/*   ← komunitas (users, blog, events)  │
│   /api/stream/*      ← streaming (anime, watch-history) │
└────────────────────────────┬────────────────────────────────┘
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│  KOMUNITAS │   │ STREAMING  │   │  BOT     │
│  (Drizzle)  │   │  (Drizzle)  │   │ (Railway)   │
└───────────┘   └───────────┘   └───────────┘

DATABASE:
- soraku-komunitas: users, posts, events, gallery, vtubers, donatur
- soraku-streaming: watch_history, favorites, user_settings

ATURAN:
1. Semua client apps wajib akses database lewat services/api
2. services/api sebagai single entry point
3. User identity sync melalui Supabase Auth yang sama
4. Baca docs/routes/MONOREPO.md untuk detail arsitektur
```

---

## 📋 Task Categories

### Front-end Tasks (UI)

- Halaman publik dan komponen React
- Video player integration
- Dashboard dan admin panel
- Mobile app screens

### Back-end Tasks (API)

- REST API endpoints di services/api
- Database queries via Drizzle
- Auth middleware & session
- Webhook handlers (Xendit, Trakteer)

### DevOps/Lead Tasks

- Arsitektur dan routing config
- TypeScript types & shared lib
- Deployment (Vercel, Railway)
- Database migrations

---

## 🔗 Referensi Penting

| File                    | Deskripsi                   |
| ----------------------- | --------------------------- |
| docs/routes/MONOREPO.md | Arsitektur lengkap monorepo |
| docs/routes/ROUTES.md   | Semua routes dan endpoints  |
| docs/PROMPTS.md         | Prompt asli (tanpa nama)    |

---

_Dokumen ini untuk penggunaan internal tim Soraku. Update prompt jika ada perubahan stack atau struktur._
