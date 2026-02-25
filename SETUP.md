# 🌸 Soraku v1.0.a3 — Setup Guide

## Ringkasan Perubahan v1.0.a3

| Halaman | Perubahan |
|---|---|
| `/` (Homepage) | Hero + Tentang card + Events grid 3 + Blog grid 2 + Gallery grid 3 + Discord CTA |
| `/login` | Glassmorphism split layout, Discord utama, Google/Facebook sekunder, Spotify opsional |
| `/komunitas` | Deskripsi Discord lengkap + GitHub Discussions di bawah |
| `/Anime` | Grid 3 talent card per generasi (menggantikan `/Vtuber` yang 404) |
| `/Anime/[slug]` | Halaman detail talent: nama, bio, sosial media |
| `/Blog` | Grid 2 + featured post (fix 404) |
| `/Blog/[slug]` | Spotify player 1 baris di atas artikel |
| `/gallery` | Intro + filter + search + sort + hashtag + zoom modal |
| `/Tentang` | Aesthetic, founder section, timeline 2023-2024 |
| `/edit/profile` | USER = maks 2 link sosial, PREMIUM = unlimited |
| `/Soraku_Admin` | Fix edit reverting, role PREMIUM & DONATE ditambah, settings login bg |

---

## Step 1 — Setup Supabase

1. Buka [app.supabase.com](https://app.supabase.com) → buat project baru (region: Singapore)
2. Masuk ke **SQL Editor** → paste seluruh isi `supabase_schema.sql` → klik **Run**
3. Masuk ke **Storage** → buat bucket baru bernama `gallery` → centang **Public**
4. Di bucket `gallery`, masuk ke **Policies** → tambahkan:
   - **SELECT**: `true` (public read)
   - **INSERT**: `auth.uid() IS NOT NULL` (hanya user login)
5. Masuk ke **Authentication → Providers** → aktifkan:
   - **Discord** ✅ (utama)
   - **Google** ✅
   - **Facebook** ✅
   - **Spotify** ✅ (opsional)
6. Di setiap provider, isi **Callback URL** dengan:
   ```
   https://xxxxxxxxxxxx.supabase.co/auth/v1/callback
   ```

---

## Step 2 — Konfigurasi Environment Variables

1. Copy `.env.example` → rename jadi `.env.local`
2. Isi semua value yang REQUIRED:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=https://soraku.vercel.app
```

---

## Step 3 — Deploy ke Vercel

```bash
# 1. Extract zip
unzip SorakuV3.zip && cd soraku

# 2. Init Git
git init
git add .
git commit -m "feat: Soraku v1.0.a3"

# 3. Buat repo baru di GitHub, lalu push
git remote add origin https://github.com/USERNAME/soraku.git
git push -u origin main --force
```

4. Di **Vercel Dashboard** → import repo → tambahkan semua env vars dari `.env.local`
5. Deploy otomatis berjalan ✅

---

## Step 4 — Set Admin Pertama

1. Login ke website via Discord
2. Buka **Supabase → Table Editor → users**
3. Cari row kamu (by email)
4. Ubah kolom `role` → `OWNER`
5. Refresh website → akses `/Soraku_Admin`

---

## Role System

| Role | Level | Akses |
|---|---|---|
| OWNER | 7 | Full access semua fitur |
| MANAGER | 6 | Dashboard, blog, events, vtubers |
| ADMIN | 5 | Blog, gallery moderation, settings |
| AGENSI | 4 | Kelola Anime/Talent profiles |
| PREMIUM | 3 | Unlimited sosial links, fitur VIP |
| DONATE | 2 | Supporter badge |
| USER | 1 | Upload gallery, edit profil (maks 2 link sosial) |

---

## Struktur Folder

```
soraku/
├── app/
│   ├── page.tsx              ← Homepage
│   ├── login/page.tsx        ← Login glassmorphism
│   ├── komunitas/page.tsx    ← Komunitas + Discord desc + Discussions
│   ├── Anime/page.tsx        ← Talent grid (fix Vtuber 404)
│   ├── Anime/[slug]/page.tsx ← Detail talent
│   ├── Blog/page.tsx         ← Blog grid 2 (fix 404)
│   ├── Blog/[slug]/page.tsx  ← Artikel + Spotify player
│   ├── gallery/page.tsx      ← Gallery + filter + zoom
│   ├── gallery/upload/page.tsx
│   ├── Tentang/page.tsx      ← Founder + Timeline
│   ├── edit/profile/page.tsx ← Edit profil + PREMIUM enforcement
│   ├── Soraku_Admin/page.tsx ← Admin panel lengkap
│   └── auth/callback/route.ts
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── MusicPlayer.tsx       ← compact + full mode
│   ├── admin/AdminShell.tsx
│   └── icons/                ← Discord, Google, Facebook, Spotify
├── lib/
│   ├── spotify.ts
│   ├── discord.ts
│   ├── github.ts
│   ├── schemas.ts            ← Zod validation
│   └── utils.ts              ← PREMIUM/DONATE role helpers
├── supabase_schema.sql       ← Complete DB schema
└── .env.example
```

---

## Tech Stack

- **Next.js 15.1** (App Router)
- **React 18 + TypeScript 5** (strict)
- **Tailwind CSS 3.4** + Framer Motion 11
- **Supabase** (Auth + DB + Storage)
- **Zustand 5** (state)
- **Zod 3.23** (validation)
- **Sonner** (toast)
- **Lucide React** (icons)

---

*Soraku v1.0.a3 — Built with ❤️ for the community*
