# RIU — Brief Owner & Laporan Sora
> From: Sora (Full Stack Lead)
> Last updated: 2026-03-11

---

## Status Platform Saat Ini — v1.0.1 ✅

Platform sudah **stable dan production-ready**. Semua task Sora selesai pada v1.0.1.

| Area | Status |
|------|--------|
| Auth (Discord OAuth, Google OAuth, email) | ✅ Live |
| Profile `/dash/profile/me` — CRUD penuh | ✅ Live |
| Admin panel 5 halaman — real DB | ✅ Live |
| Form **Edit Blog** `/dash/admin/blog/[id]/edit` | ✅ Baru |
| Form **Edit Event** `/dash/admin/events/[id]/edit` | ✅ Baru |
| Admin Blog & Event list — tampilkan draft | ✅ Fix |
| Supabase **Realtime** notifikasi | ✅ Baru |
| Supabase **Realtime** gallery admin (live upload) | ✅ Baru |
| Tabel `notifications` + API + RLS | ✅ Baru |
| `.env.local.example` lengkap | ✅ Baru |
| `/api/debug-profile` dihapus | ✅ Clean |

---

## Action Required dari Riu

### 1. Jalankan Migration `notifications` di Supabase

Buka [Supabase SQL Editor](https://supabase.com/dashboard/project/jrgknsxqwuygcoocnnnb/sql) dan jalankan:

```
supabase/migrations/20260311_notifications.sql
```

Tanpa ini, notification bell akan error karena tabel belum ada.

### 2. Enable Realtime di Supabase Dashboard

Buka: **Supabase → Database → Replication → Tables**

Enable Realtime untuk tabel:
- `soraku.notifications`
- `soraku.gallery`

Tanpa ini, fitur Live di admin gallery tidak aktif.

### 3. Konfirmasi ENV di Vercel

Pastikan ini sudah ada di Vercel Dashboard → Project → Settings → Env Variables:

| ENV | Status |
|-----|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Harus ada |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Harus ada |
| `SUPABASE_SERVICE_ROLE_KEY` | **Paling kritis** — tanpa ini semua admin API gagal |
| `NEXT_PUBLIC_APP_URL` | Harus ada |
| `NEXT_PUBLIC_SITE_URL` | Harus ada |

---

## Ide & Saran Stabilitas dari Sora

### 🟢 Jangka Pendek (bisa dikerjakan sekarang)

#### 1. Rate Limiting API
Saat ini tidak ada rate limiting. Tanpa ini, `/api/auth/login` dan `/api/gallery/upload` rentan brute-force atau flood.

Saran: pakai Vercel Edge Config atau middleware sederhana dengan IP-based counter di Redis (Upstash — gratis tier ada).

```ts
// Contoh pattern di proxy.ts:
// if (req.ip hits /api/auth/login > 10x per menit) → return 429
```

#### 2. Supabase Redirect URL — wajib di-set agar OAuth tidak gagal di domain baru
Buka: **Supabase → Auth → URL Configuration**
- Site URL: `https://soraku.vercel.app`
- Redirect URLs: `https://soraku.vercel.app/**` dan `http://localhost:3000/**`

#### 3. Supabase Storage — buat bucket `gallery`
Kalau belum ada, upload gambar galeri akan gagal.
Buka: **Supabase → Storage → New Bucket** → nama: `gallery` → set Public.

---

### 🟡 Jangka Menengah (v1.1.x)

#### 4. Halaman Profil Publik `/profile/[username]`
Halaman `app/(public)/profile/[username]/page.tsx` sudah ada tapi UI-nya perlu dipolish oleh Bubu.

#### 5. Admin VTubers CRUD
Saat ini tidak ada UI admin untuk tambah/edit/hapus VTuber. Data VTuber harus diinput manual via Supabase Dashboard.

Saran: buat `/dash/admin/vtubers` (Bubu UI + Kaizo API).

#### 6. Notifikasi Push (Web Push / Discord DM)
Saat ini notif hanya in-app. Untuk engagement lebih tinggi, pertimbangkan:
- Web Push Notification (via VAPID keys)
- Bot DM Discord saat ada update penting (event baru, galeri diapprove)

#### 7. SEO — Structured Data
Tambahkan JSON-LD schema untuk halaman Blog dan Event agar muncul di Google Search dengan rich snippet (tanggal, penulis, dsb).

---

### 🔵 Jangka Panjang (v2.x)

#### 8. Custom Domain
`soraku.vercel.app` → `soraku.id` atau `soraku.moe`.

Setup: Vercel → Domains → Add → verifikasi DNS.

#### 9. CDN untuk gambar
Supabase Storage gratis tier ada limit bandwidth. Untuk produksi, pertimbangkan:
- Cloudflare Images (murah, caching global)
- Atau aktifkan Cloudflare di depan domain

#### 10. Monitoring & Error Tracking
Pasang Sentry atau Vercel Analytics untuk pantau error production tanpa harus cek Vercel logs manual.

---

## Ringkasan Alur Kerja Tim Berikutnya

```
Riu   → Jalankan SQL migration + enable Realtime + konfirmasi Vercel ENV
Kaizo → Jalankan migration notifs, fix API gallery filter status, Realtime test
Bubu  → Polish /profile/[username], VTuber detail page, UI admin vtubers
Sora  → Rate limiting, Sentry setup, performance audit (Lighthouse 90+)
```

---

## Log Revisi

| # | Tanggal | Revisi | Oleh |
|---|---------|--------|------|
| 1 | 2026-03-11 | Inisiasi RIU.md — laporan v1.0.1 + saran stabilitas | Sora |
