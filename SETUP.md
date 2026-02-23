# 🛠️ SORAKU — Setup Guide

Panduan lengkap untuk menjalankan Soraku di environment lokal dan deploy ke Vercel.

---

## 📋 Prerequisites

- Node.js 18.18+
- npm / yarn / pnpm
- Akun [Clerk](https://clerk.com)
- Akun [Supabase](https://supabase.com)
- Discord Bot (opsional)
- Spotify Developer App (opsional)

---

## 1️⃣ Clone & Install

```bash
git clone https://github.com/your-username/soraku.git
cd soraku
npm install
```

---

## 2️⃣ Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` dan isi semua variable:

### Clerk Authentication

1. Buka [clerk.com](https://clerk.com) → Create application
2. Enable **Google** dan **Discord** OAuth di Social Connections
3. Copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` dan `CLERK_SECRET_KEY`

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
```

### Supabase

1. Buka [supabase.com](https://supabase.com) → New project
2. Copy URL dan anon key dari Settings → API

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx
```

3. Jalankan schema:
   - Buka **SQL Editor** di Supabase dashboard
   - Copy-paste isi `schema.sql`
   - Klik **Run**

### Discord (Opsional)

1. Buka [discord.com/developers](https://discord.com/developers/applications)
2. Create new application → Bot → Add Bot
3. Enable **Server Members Intent** & **Presence Intent**
4. Copy token dan server ID

```env
DISCORD_BOT_TOKEN=xxxx
DISCORD_SERVER_ID=xxxx
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxx/xxx
```

### Spotify (Opsional)

1. Buka [developer.spotify.com](https://developer.spotify.com/dashboard)
2. Create new app
3. Copy Client ID dan Client Secret

```env
SPOTIFY_CLIENT_ID=xxxx
SPOTIFY_CLIENT_SECRET=xxxx
```

---

## 3️⃣ Clerk Webhook Setup

Agar user Clerk tersinkron ke Supabase:

1. Di Clerk Dashboard → Webhooks → Add Endpoint
2. URL: `https://your-domain.com/api/webhooks/clerk`
3. Subscribe to events: `user.created`, `user.updated`, `user.deleted`
4. Copy **Signing Secret** → set `CLERK_WEBHOOK_SECRET`

---

## 4️⃣ Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## 5️⃣ Deploy ke Vercel

### Via CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Via GitHub

1. Push ke GitHub repository
2. Connect repo di [vercel.com](https://vercel.com)
3. Add semua environment variables di Vercel Dashboard → Settings → Environment Variables

### Environment Variables di Vercel

Tambahkan semua variable dari `.env.example` di:
**Vercel Dashboard → Project → Settings → Environment Variables**

---

## 6️⃣ Setup First Admin

Setelah deploy, set role SUPERADMIN untuk akun pertama:

```sql
-- Di Supabase SQL Editor
UPDATE users 
SET role = 'SUPERADMIN' 
WHERE email = 'your-email@example.com';
```

---

## 🔧 Maintenance Mode

### Aktifkan

```bash
# Di .env.local atau Vercel env
MAINTENANCE_MODE=true
```

### Nonaktifkan

```bash
MAINTENANCE_MODE=false
```

*Pada Vercel, update env var dan redeploy atau trigger redeployment.*

---

## 📊 Database Tables

| Table | Deskripsi |
|-------|-----------|
| `users` | Data user tersinkron dari Clerk |
| `vtubers` | Profil talent Vtuber |
| `blog_posts` | Artikel dan konten blog |
| `events` | Event komunitas |
| `gallery` | Upload galeri member |

---

## 🐛 Troubleshooting

**Build error di TypeScript?**
```bash
npm run type-check
```

**Supabase connection error?**
- Cek apakah `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` sudah benar
- Pastikan RLS policies sudah dijalankan dari `schema.sql`

**Clerk webhook tidak jalan?**
- Cek `CLERK_WEBHOOK_SECRET` sudah di-set
- Pastikan endpoint URL sudah benar dan accessible

**Discord stats tidak muncul?**
- Cek `DISCORD_BOT_TOKEN` dan `DISCORD_SERVER_ID`
- Pastikan bot sudah di-invite ke server dengan permission yang benar

---

## 📞 Support

- GitHub Issues: [github.com/soraku/soraku](https://github.com)
- Discord: [discord.gg/soraku](https://discord.gg/soraku)
