# 🌸 Soraku Setup Guide — v1.0.a2.1 MASTER

Platform komunitas full-stack untuk Anime, Manga, dan Budaya Digital Jepang.

---

## ⚡ Quick Start (3 menit)

```bash
# 1. Extract Soraku.zip
unzip Soraku.zip && cd soraku

# 2. Install dependencies
npm install

# 3. Copy env
cp .env.example .env.local

# 4. Isi .env.local (minimal: SUPABASE_URL + ANON_KEY)

# 5. Jalankan
npm run dev
# → http://localhost:3000
```

---

## 📁 Project Structure

```
soraku/              ← ROOT (tanpa folder src)
├── app/             ← Next.js 15 App Router
│   ├── page.tsx           Homepage + Discord stats
│   ├── layout.tsx         Root layout
│   ├── globals.css        Tailwind + custom CSS
│   ├── komunitas/         GitHub Discussions embed
│   ├── Vtuber/            Anime & VTuber grid
│   ├── Blog/              Blog + Spotify player
│   ├── gallery/           Gallery (masonry grid)
│   ├── Tentang/           About page
│   ├── edit/profile/      Edit profil (react-hook-form + zod)
│   ├── u/[username]/      Public profile
│   ├── Soraku_Admin/      Full admin panel
│   └── api/
│       └── discord/       Webhook + Stats API
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── MusicPlayer.tsx    Spotify preview player
│   └── admin/
│       └── AdminShell.tsx Sidebar layout
├── lib/
│   ├── supabase/client.ts + server.ts
│   ├── github.ts          GitHub GraphQL Discussions
│   ├── spotify.ts         Spotify Web API
│   ├── discord.ts         Discord Bot API + Webhook
│   ├── schemas.ts         Zod validation schemas
│   └── utils.ts
├── hooks/
│   └── useStore.ts        Zustand global state
├── types/index.ts          TypeScript types
├── middleware.ts           Route protection + RBAC
├── next.config.mjs
├── tailwind.config.ts
├── supabase_schema.sql    ← Run ini di Supabase SQL Editor
└── .env.example
```

---

## 🗄️ Step 1 – Setup Supabase

### 1.1 Buat Proyek
1. Buka [app.supabase.com](https://app.supabase.com) → **New Project**
2. Pilih region **Singapore** (SEA)
3. Salin: **Project URL** + **anon key** + **service_role key**

### 1.2 Jalankan Schema
1. Buka **SQL Editor** di Supabase Dashboard
2. Salin seluruh isi `supabase_schema.sql`
3. Klik **Run** ✅

Ini akan membuat:
- Tabel: `users`, `gallery`, `blog_posts`, `events`, `vtubers`, `site_settings`
- RLS policies untuk semua tabel
- Trigger auto-create profile saat OAuth

### 1.3 Setup Storage Bucket

1. **Storage** → **New Bucket** → Nama: `gallery` → ✅ Public
2. Buka **SQL Editor**, jalankan:

```sql
CREATE POLICY "auth_upload_gallery" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'gallery'
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[2] = auth.uid()::text
);

CREATE POLICY "public_read_gallery" ON storage.objects
FOR SELECT USING (bucket_id = 'gallery');
```

---

## 🔐 Step 2 – Setup OAuth

### Discord (WAJIB / Primary Login)

1. [discord.com/developers](https://discord.com/developers/applications) → **New Application**
2. **OAuth2 > General** → Salin **Client ID** & **Client Secret**
3. **Redirects** → Tambah: `https://[PROJECT_REF].supabase.co/auth/v1/callback`
4. Supabase: **Authentication > Providers > Discord** → Enable, isi Client ID & Secret

### Google (Opsional)
1. [console.cloud.google.com](https://console.cloud.google.com)
2. **APIs & Services > Credentials** → Create OAuth 2.0 Client
3. Authorized redirect: `https://[PROJECT_REF].supabase.co/auth/v1/callback`
4. Supabase: **Authentication > Providers > Google**

### Facebook (Opsional)
1. [developers.facebook.com](https://developers.facebook.com) → New App
2. Tambah **Facebook Login**
3. Valid OAuth Redirect: `https://[PROJECT_REF].supabase.co/auth/v1/callback`
4. Supabase: **Authentication > Providers > Facebook**

---

## 🔑 Step 3 – Environment Variables

```env
# .env.local

# ──── WAJIB ────
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ──── OPTIONAL: GitHub Discussions ────
# Buat token di: github.com/settings/tokens (scope: public_repo)
GITHUB_TOKEN=ghp_xxxxx
GITHUB_REPO_OWNER=your-username
GITHUB_REPO_NAME=your-repo-name

# ──── OPTIONAL: Spotify Blog Player ────
# Buat app di: developer.spotify.com/dashboard
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=

# ──── OPTIONAL: Discord Integration ────
# Bot token dari: discord.com/developers → Bot tab
DISCORD_BOT_TOKEN=
# Server ID (klik kanan server → Copy Server ID)
DISCORD_SERVER_ID=
# Webhook dari: Server Settings → Integrations → Webhooks
DISCORD_WEBHOOK_URL=

# ──── SECURITY ────
JWT_SECRET=generate-random-32-char-string
```

---

## 🚀 Step 4 – Deploy ke Vercel

### Cara 1: Via GitHub (Recommended)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/user/soraku.git
git push
```
→ Import di [vercel.com/new](https://vercel.com/new), set env vars, klik Deploy.

### Cara 2: Via CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Update Supabase Auth URL setelah deploy:
1. **Authentication > URL Configuration**
2. Site URL: `https://soraku.vercel.app`
3. Redirect URLs: `https://soraku.vercel.app/auth/callback`

Update juga di Discord/Google Developer Console.

---

## 👑 Step 5 – Setup Admin Pertama

Setelah login pertama:
1. Supabase **Table Editor > users**
2. Cari user kamu (by email)
3. Edit kolom `role` → `OWNER`
4. Akses `/Soraku_Admin` ✅

---

## 🛡️ Role System

| Role | Level | Akses |
|------|-------|-------|
| OWNER | 5 | Full access + manage semua role + Settings |
| MANAGER | 4 | Dashboard, Blog, Events, VTuber |
| ADMIN | 3 | Blog, Gallery moderation, Users (read) |
| AGENSI | 2 | VTuber manager |
| USER | 1 | Upload gallery, edit profil |

---

## 📋 Semua Routes

| Route | Deskripsi | Auth |
|-------|-----------|------|
| `/` | Homepage + Discord stats | Public |
| `/komunitas` | GitHub Discussions | Public |
| `/komunitas/[number]` | Detail diskusi | Public |
| `/Vtuber` | Koleksi Anime & VTuber | Public |
| `/gallery` | Gallery (approved) | Public |
| `/gallery/upload` | Upload karya | 🔒 Login |
| `/Blog` | Blog + Spotify | Public |
| `/Tentang` | About Soraku | Public |
| `/u/[username]` | Profil publik | Public |
| `/edit/profile` | Edit profil | 🔒 Login |
| `/Soraku_Admin` | Admin panel | 🔒 ADMIN+ |

---

## ⚙️ Admin Panel Features

| Tab | Tersedia untuk |
|-----|---------------|
| Dashboard | Semua admin |
| Pengguna | ADMIN+ (role change: OWNER only) |
| Blog CRUD | ADMIN+ |
| Events CRUD + Discord webhook | MANAGER+ |
| VTuber CRUD | MANAGER+ / AGENSI |
| Gallery Moderation | ADMIN+ |
| Settings (dynamic DB) | OWNER only |

---

## 🔧 Troubleshooting

**Login Discord gagal?**
→ Cek Redirect URI di Discord Developer Portal dan Supabase Auth settings.

**Gallery upload gagal?**
→ Pastikan bucket `gallery` sudah dibuat (Public) dan storage policies sudah dijalankan.

**Komunitas tidak tampil?**
→ Set `GITHUB_TOKEN`, `GITHUB_REPO_OWNER`, `GITHUB_REPO_NAME`. Pastikan repo punya Discussions aktif.

**Discord stats tidak muncul?**
→ Set `DISCORD_BOT_TOKEN` dan `DISCORD_SERVER_ID`. Pastikan bot sudah join server.

**Build error TypeScript?**
→ Jalankan `npm run type-check` untuk detail error.

**Admin panel tidak bisa diakses?**
→ Pastikan role user di tabel `users` sudah di-update ke OWNER/ADMIN/MANAGER.

---

## 📦 Tech Stack

| | Teknologi | Versi |
|-|-----------|-------|
| Framework | Next.js | 15.1 |
| Language | TypeScript | 5.6+ strict |
| Styling | Tailwind CSS | 3.4+ |
| Animation | Framer Motion | 11+ |
| Auth + DB | Supabase | 2.45+ |
| State | Zustand | 5+ |
| Validation | Zod + react-hook-form | 3.23+ / 7.53+ |
| Icons | Lucide React | 0.446+ |

---

*Soraku – Dibuat dengan ❤️ untuk komunitas anime & manga Indonesia*
