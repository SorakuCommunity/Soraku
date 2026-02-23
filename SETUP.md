# SETUP GUIDE — Soraku Community Platform

## 1. Installation

```bash
git clone <your-repo>
cd soraku
npm install
cp .env.example .env.local
```

---

## 2. Environment Variables

Buat file `.env.local` dan isi dengan nilai berikut:

```env
# ===== CLERK =====
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# ===== SUPABASE =====
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxx

# ===== DISCORD =====
DISCORD_CLIENT_ID=xxxxxxxxxxxxxxxxxx
DISCORD_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
DISCORD_BOT_TOKEN=MTE4xxxxxx.xxxxxx.xxxxxx
DISCORD_SERVER_ID=1116971049045729302
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxxx/xxxx

# ===== APP =====
MAINTENANCE_MODE=false
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 3. Setup Supabase

### 3.1 Buat Project Supabase
1. Pergi ke [supabase.com](https://supabase.com) → New Project
2. Catat **Project URL** dan **Anon Key** dari Settings → API

### 3.2 Jalankan SQL Schema
1. Buka Supabase Dashboard → SQL Editor
2. Copy-paste konten dari `src/lib/schema.sql`
3. Klik **Run**

### 3.3 Aktifkan Row Level Security
Schema sudah menyertakan RLS policies. Pastikan semuanya aktif.

---

## 4. Setup Clerk

### 4.1 Buat Clerk Application
1. Pergi ke [clerk.com](https://clerk.com) → Create Application
2. Pilih **Discord** sebagai social provider
3. Catat **Publishable Key** dan **Secret Key**

### 4.2 Setup Discord OAuth di Clerk
1. Discord Developer Portal → Buat aplikasi baru
2. Salin **Client ID** dan **Client Secret**
3. Di Clerk Dashboard → Social Connections → Discord → masukkan credentials
4. Tambah redirect URL: `https://your-clerk-domain.clerk.accounts.dev/v1/oauth_callback`

### 4.3 Clerk Webhook (opsional untuk sync user)
1. Clerk Dashboard → Webhooks → Add Endpoint
2. URL: `https://your-domain.com/api/webhooks/clerk`
3. Events: `user.created`, `user.updated`

---

## 5. Setup Discord Bot

### 5.1 Buat Bot
1. [discord.com/developers](https://discord.com/developers/applications) → New Application
2. Bot → Add Bot → catat **Token**
3. Aktifkan: **SERVER MEMBERS INTENT** dan **PRESENCE INTENT**

### 5.2 Invite Bot ke Server
Gunakan link ini (ganti CLIENT_ID):
```
https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=8&scope=bot
```

### 5.3 Aktifkan Widget Server Discord
1. Server Settings → Widget → Enable Server Widget
2. Ini diperlukan untuk menampilkan data online members

### 5.4 Setup Webhook untuk Events
1. Server Discord → Channel settings → Integrations → Webhooks
2. Create Webhook → salin URL → masukkan ke `DISCORD_WEBHOOK_URL`

---

## 6. Development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## 7. Deploy ke Vercel

### 7.1 Persiapan
1. Push code ke GitHub
2. Pergi ke [vercel.com](https://vercel.com) → Import Project
3. Pilih repository soraku

### 7.2 Environment Variables di Vercel
1. Project Settings → Environment Variables
2. Tambahkan semua variables dari `.env.local`
3. Pastikan `NEXT_PUBLIC_APP_URL` diisi dengan URL Vercel production

### 7.3 Deploy
```bash
# Vercel CLI
npm i -g vercel
vercel --prod
```

Atau push ke branch main untuk auto-deploy.

---

## 8. Setup Role Pertama (MANAGER)

Setelah login pertama kali:

1. Buka Supabase Dashboard → Table Editor → `user_roles`
2. Cari user kamu berdasarkan `user_id`
3. Update kolom `role` menjadi `MANAGER`

Atau via SQL:
```sql
UPDATE user_roles 
SET role = 'MANAGER' 
WHERE email = 'your@email.com';
```

---

## 9. Fitur Maintenance Mode

### Via Dashboard Admin
1. Login sebagai MANAGER
2. Pergi ke `/admin/settings`
3. Toggle "Maintenance Mode"

### Via Environment Variable
Set `MAINTENANCE_MODE=true` di Vercel environment variables dan redeploy.

---

## 10. Troubleshooting

**Q: Discord stats tidak muncul?**
A: Pastikan `DISCORD_BOT_TOKEN` sudah benar dan bot sudah di invite ke server dengan permission yang tepat. Aktifkan Server Widget di Discord.

**Q: Upload gallery tidak bisa?**
A: Saat ini gallery menggunakan URL eksternal. Untuk file upload langsung, integrasikan dengan Supabase Storage atau Cloudinary.

**Q: Admin panel tidak bisa diakses?**
A: Pastikan role user sudah diset ke MANAGER/AGENSI/ADMIN di tabel `user_roles`.

**Q: Clerk sign in error?**
A: Periksa redirect URLs di Clerk Dashboard dan pastikan domain sudah terdaftar.
