# CHANGELOG — Soraku Community Platform
> Riwayat perubahan dari awal hingga sekarang
> Format: `[vX.X.X] — Tanggal · Owner`

---

---

## [v0.1.0] — 2026-03-11 · Bubu

### ✨ Homepage Redesign + Navbar Restructure

**Homepage**
- Hero: 5 kategori centered mobile-friendly (Anime/Manga, Fanart, Cosplay, VTuber, Culture Jepang)
- Stats real-time 3 item Discord only — Member Discord live dari Discord Widget API
- Hapus section Platform/Features lama
- Events real-time: grid-3, cover, status badge Online/Pending/Selesai, by username
- Blogs real-time: grid-3, cover, excerpt, by username
- Discord Card real-time: total member, user aktif, join button, deskripsi
- Partnership section dari DB soraku.partnerships (conditional render)
- Sosial Media section 7 platform card mode
- Data dari GET /api/home (single request)

**Navbar**
- Struktur: Beranda · About · Feature▼ (Events/Blogs/Gallery) · Agensi▼ (VTuber/Cosplay) · Utility▼ (Privacy/TOS/Feedback/License/Requirements)
- Button Donate & Premium (desktop + mobile)
- Hapus button Profil dari mobile menu

**Profile self-service**
- Username updatable oleh user sendiri (tidak perlu admin)

**Route baru**
- /requirements: halaman Open Recruitment Batch 01

**Database**
- soraku.events: kolom status (online/pending/selesai)
- soraku.partnerships: kolom description + createdby

---

## [v1.0.1] — 2026-03-11 · Sora

> Versi ini menggabungkan semua perbaikan post-v1.0 (termasuk yang sebelumnya dicatat sebagai 1.0.2+) menjadi satu rilis stabil.

### API — Admin Blog & Event

- **`GET /api/admin/blog`** — list semua post termasuk draft (sebelumnya hanya `POST`)
- **`GET /api/admin/blog/[id]`** — ambil satu post by ID untuk prefill form edit
- **`GET /api/admin/events`** — list semua event termasuk draft
- **`GET /api/admin/events/[id]`** — ambil satu event by ID untuk prefill form edit
- Fix `PATCH /api/admin/blog/[id]` — gunakan `.maybeSingle()`, handle `coverurl: ''` → null, update `updatedat`
- Fix `PATCH /api/admin/events/[id]` — idem + update `updatedat`

### Halaman Admin — Form Edit

- **`/dash/admin/blog/[id]/edit`** — form edit artikel: prefill dari DB, simpan Draft / Publish, warning slug change, indikator live status
- **`/dash/admin/events/[id]/edit`** — form edit event: prefill dari DB, idem
- **`/dash/admin/blog`** — sekarang fetch dari `/api/admin/blog` (tampilkan draft); tombol ✏️ Edit ditambahkan
- **`/dash/admin/events`** — sekarang fetch dari `/api/admin/events`; tombol ✏️ Edit ditambahkan

### Supabase Realtime

- **`/dash/admin/gallery`** — Realtime live update saat ada upload baru; indikator ⚡ Live / Static
- **`useNotifications`** — upgrade dari polling 30s ke Supabase Realtime dengan fallback polling 60s; safety timeout 5s jika koneksi gagal

### Notifikasi

- **`soraku.notifications`** — migration tabel baru dengan RLS (user hanya lihat/update notif sendiri)
- **`GET /api/notifications`** — list notif user
- **`PATCH /api/notifications`** — mark read (by ids atau all)
- Fix field names: `read` → `isread`, `created_at` → `createdat` (konsisten dengan konvensi soraku)

### Cleanup & Security

- Hapus **`/api/debug-profile`** — endpoint diagnostik sementara, tidak boleh ada di production
- Fix `lib/notifications.ts` — type `Notification` sesuai DB schema (`isread`, `createdat`)
- Fix `navbar.tsx` — field references sesuai type baru

### Docs & ENV

- **`apps/web/.env.local.example`** — lengkap 14 ENV vars, checklist, instruksi Supabase + Discord OAuth
- **`services/bot/.env.example`** — lengkap dengan instruksi Railway deploy
- **`docs/revisi/RIU.md`** — brief Riu: ide, saran stabilitas, roadmap berikutnya
- **`docs/revisi/SORA.md`** — update status semua task selesai
- **`docs/revisi/BUBU.md`** — task berikutnya: `/profile/[username]`, UI polish VTuber detail, vtubers admin CRUD
- **`docs/revisi/KAIZO.md`** — task berikutnya: jalankan migration notifications, enable Realtime di Supabase, fix gallery API filter status

---

## [v1.0.3-cleanup] — 2026-03-11 · Bubu

### App Router Cleanup — Hapus Route Deprecated

Mengikuti `docs/routes/ROUTES.md` dan `docs/routes/NAMESPACE.md` dari Sora.

**Routes dihapus:**
- `(admin)/admin/*` — 7 pages + layout → sudah ada di `/dash/admin/*`
- `(dashboard)/dashboard/` — legacy → ganti ke `/dash`
- `(public)/agensi/vtuber/` → pindah ke `/vtubers`
- `(public)/social/` → social links via icon komponen
- `(public)/premium/donatur/` → pindah ke `/donate/leaderboard`
- `(public)/profile/me/` → sudah di `/dash/profile/me`

**Link fixes (6 file):**
- login/register: redirect setelah auth `/dashboard` → `/dash`
- dashboard/layout.tsx: sidebar links ke `/dash/*`
- about/page.tsx: hapus link `/social`, CTA ganti ke Discord
- agensi/page.tsx: `/agensi/vtuber` → `/vtubers`, card → `/vtubers/[slug]`
- donate/page.tsx + premium/page.tsx: `/premium/donatur` → `/donate/leaderboard`

**Build verified ✓** — tidak ada deprecated route di output build.

---


## [Hotfix] — 2026-03-11 · Kaizo

### Fix #1 — OAuth `bad_oauth_state`

Root cause: PKCE cookie ditulis ke response dengan URL salah (redirect ke
`/login?error=...`) sebelum Location di-override ke Discord URL.
Browser menerima redirect yang ambigu → cookie PKCE tidak tersimpan dengan
benar → state expired saat callback dipanggil kedua kali.

Fix: pattern `pendingCookies[]` — kumpulkan cookies PKCE dulu, baru buat
`NextResponse.redirect(data.url)` dan attach cookies ke response itu.
Berlaku untuk: `/api/auth/discord` dan `/api/auth/google`.

Catatan: `bad_oauth_state` juga muncul saat user reload tab callback atau
double-click tombol login. Itu behavior normal Supabase PKCE (state 10 menit).

### Fix #2 — `/api/profile GET` 500 → fallback ke session data

Root cause: adminDb() query gagal (kemungkinan `SUPABASE_SERVICE_ROLE_KEY`
tidak dikonfigurasi di Vercel) → return SERVER_ERROR → UI tampilkan error.

Fix: Jika DB query error, kembalikan data dari session (auth.users metadata)
alih-alih 500. UI tetap bisa render. Flag `_fallback: true` ditambahkan agar
Sora bisa debug via Vercel logs.

ACTION REQUIRED untuk Sora/Riu:
→ Pastikan `SUPABASE_SERVICE_ROLE_KEY` ada di Vercel Dashboard → Settings → Env Variables

### Fix #3 — Riu hilang dari soraku.users

Migrasi terbaru Sora (20260311_soraku_schema.sql) di-apply ke DB dan
sepertinya me-reset data. Re-insert Riu via Supabase SQL:
- username=riu, displayname=riu.me, avatarurl=Discord CDN, role=OWNER ✅

---

## [v1.0.3] — 2026-03-11 · Kaizo

### Fix: /dash/profile/me gagal load (root cause 3 lapis)

**Bug 1 — Kolom DB mismatch (paling kritis)**
- `soraku.users` dibuat dengan kolom snake_case (`display_name`, `avatar_url`, `is_private`, dll)
- Semua kode dan tabel lain sudah pakai format tanpa underscore (`displayname`, `avatarurl`, dll)
- Fix: migration rename semua kolom `soraku.users` agar konsisten:
  `display_name→displayname`, `avatar_url→avatarurl`, `cover_url→coverurl`,
  `supporter_role→supporterrole`, `social_links→sociallinks`, `is_private→isprivate`,
  `is_banned→isbanned`, `created_at→createdat`, `updated_at→updatedat`

**Bug 2 — Riu belum ada di soraku.users**
- OAuth callback dulu gagal silent karena kolom DB salah → upsert tidak pernah berhasil
- Fix: insert manual record Riu + update dari Discord metadata:
  username=`riu`, displayname=`riu.me`, avatarurl dari CDN Discord, role=`OWNER`

**Bug 3 — Trigger updatedat masih pakai nama lama**
- Trigger `set_updated_at()` masih referensi `NEW.updated_at` → error saat UPDATE
- Fix: replace function body → `NEW.updatedat = now()`

### Tambahan: /login sudah login → 3 pilihan
- Login page sekarang cek session via `GET /api/auth/me` saat mount
- Jika sudah login, tampilkan screen "Kamu sudah login, {nama}" dengan 3 button:
  1. Kembali ke Beranda (`/`)
  2. Lihat Profil Saya (`/dash/profile/me`)
  3. Keluar dari Akun (POST /api/auth/signout)
- Jika belum login, tampilkan form login seperti biasa

---

## [v1.0.2] — 2026-03-11 · Kaizo

### Fix Vercel Build Error — Profile Route Conflict
- **Root cause**: `/profile/me` dari `(dashboard)` group konflik dengan `/profile/[username]` dari `(public)` group — Next.js Turbopack menganggap `me` bisa jadi value dari `[username]` parameter
- **Fix**: Pindah semua profile pribadi ke `/dash/profile/me`
  - `(dashboard)/profile/me/page.tsx` → `(dashboard)/dash/profile/me/page.tsx`
  - Hapus `(public)/profile/me/page.tsx` (redirect lama yang menyebabkan triple conflict)
  - Update `proxy.ts` — protect `/dash/*` sama seperti `/dashboard/*` (harus login)
- Update semua referensi `/profile/me` → `/dash/profile/me`:
  - `(dashboard)/layout.tsx` sidebar
  - `(dashboard)/dashboard/page.tsx` quick links
  - `(public)/profile/[username]/page.tsx` tombol edit
  - `navbar.tsx` dropdown menu (2 lokasi)

### Struktur routing profile final:
```
/dash/profile/me        ← Profile Pribadi (edit, butuh login, sidebar dashboard)
/profile/[username]     ← Profile Publik (view, siapa saja bisa akses)
```

### Stats real data — website_online dihapus
- Hapus `website_online` dari `stats-client.tsx` (data tidak tersedia tanpa Supabase Realtime)
- Ganti dengan `member_count` — jumlah user terdaftar di platform (real DB ✅)
- Sesuai instruksi Riu: semua data harus real, yang belum real diganti

> ⚠️ Versi ini bukan keputusan Kaizo — menunggu konfirmasi Riu & Sora untuk bump versi resmi

---

## [v1.0.1] — 2026-03-11 · Kaizo (backup Bubu + lanjutan)

### Profile Routing — Restruktur (Backup Tugas Bubu)
- **Sebelumnya**: edit profile ada di `/dashboard/profile` — tidak konsisten dengan konsep Soraku
- **Sesudah**: struktur baru sesuai instruksi Riu:
  - `/profile/me` ← Profile Pribadi (edit — pakai dashboard layout + sidebar)
  - `/profile/[username]` ← Profile Publik (tetap seperti sebelumnya)
- Pindah `(dashboard)/profile/page.tsx` → `(dashboard)/profile/me/page.tsx`
- Hapus `(public)/profile/me/page.tsx` (redirect lama — tidak diperlukan lagi)
- Update semua referensi `/dashboard/profile` → `/profile/me`:
  - `(dashboard)/layout.tsx` SIDEBAR_LINKS
  - `(dashboard)/dashboard/page.tsx` quick links
  - `(public)/profile/[username]/page.tsx` edit profile button
  - Navbar sudah benar (`/profile/me`)
- **Versi tidak berubah** — keputusan versi di tangan Riu & Sora

### /api/stats — Real DB (Fix TODO dari Bubu)
- Ganti hard-coded mock count dengan query real ke Supabase:
  - `event_count` → `SELECT COUNT(*) FROM events WHERE ispublished = true`
  - `member_count` → `SELECT COUNT(*) FROM users`
  - `post_count` → `SELECT COUNT(*) FROM posts WHERE ispublished = true`
- Discord member + online count tetap dari Discord Invite API (revalidate 60s)
- Fallback ke 0 jika DB error — tidak crash

### Migration: soraku.partnerships
- Buat tabel `soraku.partnerships` baru di Supabase:
  - Kolom: `id, name, logourl, website, category, isactive, sortorder, createdat, updatedat`
  - RLS: public bisa read (isactive=true), service_role full access
  - Index: `(isactive, sortorder)` untuk query cepat
- `/api/partnerships` sudah siap konsumsi tabel ini (tidak perlu ubah kode)
- Admin bisa tambah partnership via Supabase Dashboard atau admin panel

---

## [Hotfix] — 2026-03-11 · Kaizo

### Fix #1 — OAuth `bad_oauth_state`

Root cause: PKCE cookie ditulis ke response dengan URL salah (redirect ke
`/login?error=...`) sebelum Location di-override ke Discord URL.
Browser menerima redirect yang ambigu → cookie PKCE tidak tersimpan dengan
benar → state expired saat callback dipanggil kedua kali.

Fix: pattern `pendingCookies[]` — kumpulkan cookies PKCE dulu, baru buat
`NextResponse.redirect(data.url)` dan attach cookies ke response itu.
Berlaku untuk: `/api/auth/discord` dan `/api/auth/google`.

Catatan: `bad_oauth_state` juga muncul saat user reload tab callback atau
double-click tombol login. Itu behavior normal Supabase PKCE (state 10 menit).

### Fix #2 — `/api/profile GET` 500 → fallback ke session data

Root cause: adminDb() query gagal (kemungkinan `SUPABASE_SERVICE_ROLE_KEY`
tidak dikonfigurasi di Vercel) → return SERVER_ERROR → UI tampilkan error.

Fix: Jika DB query error, kembalikan data dari session (auth.users metadata)
alih-alih 500. UI tetap bisa render. Flag `_fallback: true` ditambahkan agar
Sora bisa debug via Vercel logs.

ACTION REQUIRED untuk Sora/Riu:
→ Pastikan `SUPABASE_SERVICE_ROLE_KEY` ada di Vercel Dashboard → Settings → Env Variables

### Fix #3 — Riu hilang dari soraku.users

Migrasi terbaru Sora (20260311_soraku_schema.sql) di-apply ke DB dan
sepertinya me-reset data. Re-insert Riu via Supabase SQL:
- username=riu, displayname=riu.me, avatarurl=Discord CDN, role=OWNER ✅

---

## [v1.0.3] — 2026-03-11 · Kaizo

### Fix: /dash/profile/me gagal load (root cause 3 lapis)

**Bug 1 — Kolom DB mismatch (paling kritis)**
- `soraku.users` dibuat dengan kolom snake_case (`display_name`, `avatar_url`, `is_private`, dll)
- Semua kode dan tabel lain sudah pakai format tanpa underscore (`displayname`, `avatarurl`, dll)
- Fix: migration rename semua kolom `soraku.users` agar konsisten:
  `display_name→displayname`, `avatar_url→avatarurl`, `cover_url→coverurl`,
  `supporter_role→supporterrole`, `social_links→sociallinks`, `is_private→isprivate`,
  `is_banned→isbanned`, `created_at→createdat`, `updated_at→updatedat`

**Bug 2 — Riu belum ada di soraku.users**
- OAuth callback dulu gagal silent karena kolom DB salah → upsert tidak pernah berhasil
- Fix: insert manual record Riu + update dari Discord metadata:
  username=`riu`, displayname=`riu.me`, avatarurl dari CDN Discord, role=`OWNER`

**Bug 3 — Trigger updatedat masih pakai nama lama**
- Trigger `set_updated_at()` masih referensi `NEW.updated_at` → error saat UPDATE
- Fix: replace function body → `NEW.updatedat = now()`

### Tambahan: /login sudah login → 3 pilihan
- Login page sekarang cek session via `GET /api/auth/me` saat mount
- Jika sudah login, tampilkan screen "Kamu sudah login, {nama}" dengan 3 button:
  1. Kembali ke Beranda (`/`)
  2. Lihat Profil Saya (`/dash/profile/me`)
  3. Keluar dari Akun (POST /api/auth/signout)
- Jika belum login, tampilkan form login seperti biasa

---

## [v1.0.2] — 2026-03-11 · Kaizo

### Fix Vercel Build Error — Profile Route Conflict
- **Root cause**: `/profile/me` dari `(dashboard)` group konflik dengan `/profile/[username]` dari `(public)` group — Next.js Turbopack menganggap `me` bisa jadi value dari `[username]` parameter
- **Fix**: Pindah semua profile pribadi ke `/dash/profile/me`
  - `(dashboard)/profile/me/page.tsx` → `(dashboard)/dash/profile/me/page.tsx`
  - Hapus `(public)/profile/me/page.tsx` (redirect lama yang menyebabkan triple conflict)
  - Update `proxy.ts` — protect `/dash/*` sama seperti `/dashboard/*` (harus login)
- Update semua referensi `/profile/me` → `/dash/profile/me`:
  - `(dashboard)/layout.tsx` sidebar
  - `(dashboard)/dashboard/page.tsx` quick links
  - `(public)/profile/[username]/page.tsx` tombol edit
  - `navbar.tsx` dropdown menu (2 lokasi)

### Struktur routing profile final:
```
/dash/profile/me        ← Profile Pribadi (edit, butuh login, sidebar dashboard)
/profile/[username]     ← Profile Publik (view, siapa saja bisa akses)
```

### Stats real data — website_online dihapus
- Hapus `website_online` dari `stats-client.tsx` (data tidak tersedia tanpa Supabase Realtime)
- Ganti dengan `member_count` — jumlah user terdaftar di platform (real DB ✅)
- Sesuai instruksi Riu: semua data harus real, yang belum real diganti

> ⚠️ Versi ini bukan keputusan Kaizo — menunggu konfirmasi Riu & Sora untuk bump versi resmi

---

## [v1.0.1] — 2026-03-11 · Bubu

### Profile Page — Total Redesign
- Redesign minimalis modern: layout 2-kolom grid, section cards dengan icon headers
- **Identity Card** di bagian atas: cover banner + avatar float, role badge + supporter badge, nama + username + bio preview, tanggal bergabung
- **Dirty state tracking**: tombol Simpan hanya aktif (biru) jika ada perubahan yang belum disimpan
- **Info Dasar** section: Nama Tampilan, Username (read-only), Bio (max 300 dengan counter), Privacy toggle (publik/privat) dengan animasi pill
- **Foto & Media** section: Avatar URL dengan preview + clear button, Cover URL dengan preview inline + clear button, Account info card (Role, Supporter, Bergabung)
- **Sosial Media** section: 5 fields (Discord, Instagram, X, YouTube, Website) dengan individual clear button per field, grid 3 kolom
- **Actions bar** bawah: Keluar dari akun (kiri) + Lihat Profil + Simpan Perubahan (kanan)
- Semua menggunakan **Lucide icon** — zero emoji
- Toast notification dengan close button, animasi slide-in
- Loading skeleton, error state dengan icon

### Auth — Discord & Google OAuth Routes (sebelumnya belum ada)
- `apps/web/src/app/api/auth/discord/route.ts` — GET redirect ke Supabase Discord OAuth
- `apps/web/src/app/api/auth/google/route.ts` — GET redirect ke Supabase Google OAuth
- Scope Discord: `identify email guilds`

### Auth Callback — Auto OWNER role
- `apps/web/src/app/api/auth/callback/route.ts` diupdate:
  - Upsert user ke `soraku.users` setelah OAuth berhasil (ambil username/displayname/avatarurl dari metadata)
  - Discord ID `1020644780075659356` (Riu) otomatis dapat role `OWNER`
  - Support ENV `OWNER_DISCORD_IDS` untuk tambah owner lain tanpa deploy ulang
  - Graceful: DB error tidak block user dari login

### Login & Register — Real API
- Login: `POST /api/auth/login`, error message dari server, redirect `/dashboard`
- Register: `POST /api/auth/register`, auto-login setelah daftar berhasil, 2-step form
- Dashboard layout: real session dari `GET /api/auth/me`, nama + avatar real, link Admin hanya jika staff

### API `/api/profile` (baru)
- `GET /api/profile` — ambil profile user yang sedang login
- `PATCH /api/profile` — update displayname, bio, avatarurl, coverurl, sociallinks, isprivate

---

## [v0.9.0] — 2026-03-11 · Bubu

### /about — Total Rebuild (Sesuai Spesifikasi Riu)
- Hero dengan `logo-full.png` mascot full-height + kanji 空 giant gradient
- Quote dramatis dari PHILOSOPHY: *"Langit tidak membatasi siapa yang boleh memandangnya."*
- **Stats real-time** (Client Component):
  - Total Member Discord (dari Discord API)
  - Total Event Digelar
  - Tahun Berdiri (2023)
  - Member Online di Website (green dot pulse = Live)
  - CountUp animation saat pertama load
- **Category marquee** berjalan seperti homepage (anime, manga, cosplay, dll)
- **Kenapa nama Soraku** — 3 kartu: `空` (langit) + `-ku` (possesif) + `Soraku` (langitku)
- **3 Pilar** — Manager, Agensi, Admin (bukan 4 pilar generik sebelumnya)
  - Masing-masing dengan gradient, badge role, duties list
- **Timeline Soraku** — 7 milestone dari 2023 s.d. 2026:
  - 2023 Awal: "Lahirnya Sora" (nama awal komunitas)
  - 2023 Mid: Berubah jadi Soraku (+ sufiks -ku)
  - 2023 Akhir: Event pertama
  - 2024 Q1: Platform web lahir, tim inti terbentuk
  - 2024 Q2: Agensi Soraku berdiri
  - 2025 Q1: 500+ member Discord
  - 2026 Now: v1.0 Platform Penuh
- **Team section** (Draft) — 4 cards: Riu/Sora/Bubu/Kaizo dengan badge berwarna
- **Discord CTA** — link real `discord.gg/qm3XJvRa6B`
- **Sosial media scrolling** — marquee cards seperti homepage hero
- **Partnership scrolling** — marquee dari `/api/partnerships` (diisi admin manual)
- `api/stats/route.ts` — Discord real member + fallback mock
- `api/partnerships/route.ts` — mock, schema TODO untuk Kaizo

---

### Homepage Redesign
- Hero visual `logo-full.png` mascot sebagai visual utama desktop
- `DiscordIcon` dari `custom-icons.tsx` (tidak ada inline SVG baru)
- Stats grid 4 kolom (member, event, konten, tahun berdiri)
- Features grid 6 kolom dengan gradient icons per section
- Discord CTA section full-width + Join CTA glassmorphism

### Login Redesign
- Split layout: panel kiri (mascot + quote) + panel kanan (form)
- `DiscordIcon` + `GoogleIcon` dari `custom-icons.tsx`
- OAuth Discord & Google button

### Register Redesign
- Split layout: panel kiri (benefits list + mascot preview) + panel kanan (2-step form)
- `DiscordIcon` + `GoogleIcon` dari `custom-icons.tsx`

### Blog Redesign
- Featured post card lebih besar (area cover 420px)
- Emoji tag filter (✨ Semua · 🎌 Anime · 📚 Manga · dll)
- Search placeholder di header

### Events Redesign
- Section Upcoming vs Selesai terpisah
- Countdown badge "X hari lagi" untuk event < 7 hari
- Filter tipe Online/Offline/Hybrid

### Gallery Redesign
- Masonry 2→4 kolom
- Hover overlay dengan icon ZoomIn
- Upload karya button prominent

### Notification System
- `lib/notifications.ts` — NotifType, NOTIF_CONFIG, MOCK_NOTIFICATIONS
- `hooks/use-notifications.ts` — polling 30 detik, markRead, markAllRead
- `app/api/notifications/route.ts` — GET + PATCH (schema TODO Kaizo)
- **Bukan dari GitHub Discussion** — internal DB Supabase

### Navbar Polish
- Logo `logo.png` mascot dengan hover scale
- Bell icon (Lucide) + badge unread count merah
- Panel dropdown notifikasi (judul, body, timeAgo, mark all read)
- User dropdown (avatar, nama, Profil/Settings/Admin/Keluar)
- Nav items baru: Showcase, Sosial Media → `/social`, Premium

### New Pages
- `/social` — grid semua platform Soraku dari `SORAKU_SOCIALS`
- `/api/stats` — combined stats (Discord + events)
- `/api/partnerships` — data partner (mock, admin panel nanti)

---

## [v0.8.0] — 2026-03-10 · Sora

### Discord Bot (services/bot)
- Fix 3 bug sebelum deploy Railway
- Fix Dockerfile + railway.toml path error

---

## [v0.7.0] — 2026-03-10 · Sora (IN PROGRESS)

### Real Data Integration
- Pattern Server Component query langsung via `db()` dari `@/lib/supabase/server`
- Blog, events, gallery, agensi, donatur → connected ke Supabase

### custom-icons.tsx Registry (Sora)
- `DiscordIcon`, `InstagramIcon`, `FacebookIcon`, `XIcon`
- `TikTokIcon`, `YouTubeIcon`, `BlueSkyIcon`
- `GoogleIcon`, `TrakteerIcon`, `SunoIcon`
- `SORAKU_SOCIALS[]`, `CUSTOM_ICONS[]`
- `getIcon(slug)`, `getIconsByCategory(category)`
- REVISI/BUBU.md dengan aturan wajib penggunaan icon

---

## [v0.6.0] — 2026-03-09 · Bubu

### Polish & Infrastructure
- Music player persistent (React Context + floating PlayerBar)
- `MusicPlayerContext` — DEFAULT_PLAYLIST 5 lagu anime mock
- `PlayerBar` — glassmorphism, progress, volume, playlist panel
- `providers.tsx` — wrap MusicPlayerProvider + PlayerBar
- Sitemap XML — static + dynamic pages
- OG Image meta — layout.tsx (OG, Twitter card, robots)
- Discord stats API — `/api/discord/stats` (fallback mock)

---

## [v0.5.0] — 2026-03-08 · Bubu

### Admin Panel (UI + Mock Data)
- Admin layout — sidebar, protected (middleware active)
- Admin dashboard overview — stats cards, recent posts, pending gallery
- Admin user management UI
- Admin blog CRUD UI — tabel + Edit/Delete
- Admin event CRUD UI — list + Edit/Delete
- Admin galeri moderasi — Approve/Reject per item

---

## [v0.4.0] — 2026-03-07 · Bubu + Kaizo

### Agensi & Premium
- Agensi talent list — grid cards, type badge, socials
- Agensi VTuber page — `/agensi/vtuber`, model type, streams
- Premium page — 3 tier (Donatur/VIP/VVIP) + benefits
- Xendit integration — `/api/premium/xendit/create` + webhook (Kaizo)
- Donate page — Trakteer redirect, how-to, usage
- Top Donatur page — podium 🥇🥈🥉, full list, gold glow

---

## [v0.3.0] — 2026-03-06 · Bubu + Kaizo

### Konten (UI + Mock Data)
- Blog listing — filter tag, featured post, grid
- Blog detail — `/blog/[slug]`, related posts, metadata
- Blog API GET — `/api/blog` + `/api/blog/[slug]` (Kaizo)
- Events listing — upcoming/past, card grid
- Events detail — `/events/[slug]`, Discord CTA
- Events API GET — `/api/events` + `/api/events/[slug]` (Kaizo)
- Gallery grid — masonry layout, filter kategori
- Gallery upload form — drag & drop, preview, form
- Gallery API — `/api/gallery` + `/api/gallery/upload` (Kaizo)
- Loading skeletons — blog, events, gallery
- Error boundaries — blog, events

---

## [v0.2.0] — 2026-03-05 · Bubu + Kaizo

### Auth & User UI
- Supabase project setup (Kaizo) — schema soraku, 15 tabel, RLS aktif
- Login page UI — 2 step + Discord OAuth button
- Register page UI — 2 step form + benefits panel
- Auth middleware — `src/middleware.ts`, role-based protection (Kaizo)
- Dashboard layout + page — sidebar, stats, quick links

---

## [v0.1.0] — 2026-03-04 · Bubu

### Navbar & Footer
- Navbar dropdown Komunitas + Agensi (with desc, mobile accordion)
- Footer 2 kolom + 6 sosmed — Discord, TikTok, FB, IG, Twitter, YouTube
- `/agensi/vtuber` page — VTuber cards + CTA

---

## [v0.0.1] — 2026-03-03 · Tim Soraku

### Foundation
- Monorepo setup — pnpm workspace + Turborepo (Sora)
- Design system / CSS — globals.css, tokens, animations (Bubu)
- Navbar + Footer responsive dark mode (Bubu)
- Homepage — hero blob, badges, marquee (Bubu)
- About page — filosofi, pilar, tim, CTA (Bubu)
- UI primitives — Button, Badge, Avatar, Separator (Bubu)
- Types — User, BlogPost, Event, GalleryItem, Talent, Donatur (Sora)
- 404 page — custom dengan kanji 空 (Bubu)
- Vercel deploy — `soraku.vercel.app` LIVE (Sora)

---

*空 · Soraku Community · Est. 2023*

## [1.0.0-routes] — 2026-03-11 · Route Architecture Migration

> Ditetapkan oleh: **Riu** (Owner) via `docs/routes/ROUTES.md` + `NAMESPACE.md`
> Dieksekusi oleh: **Sora** — commit `56fcf36`

### Redirect Permanen (proxy.ts)
- `301` `/social` → `/` — bukan halaman per NAMESPACE.md
- `301` `/agensi/vtuber` → `/vtubers`
- `301` `/premium/donatur` → `/donate/leaderboard`
- `301` `/admin/*` → `/dash/admin/*`
- `301` `/dashboard/*` → `/dash/*`

### Pages Baru
- `/vtubers` — dipindah + diupdate dari `/agensi/vtuber`
- `/vtubers/[slug]` — halaman detail VTuber (baru)
- `/donate/leaderboard` — dipindah dari `/premium/donatur`
- `/dash/admin/*` — semua admin pages di namespace baru (layout + 5 halaman)

### API Baru
- `GET /api/vtubers` — list + filter tag + pagination
- `GET /api/vtubers/[slug]` — detail by slug
- `GET /api/donate` — donatur publik, filter `period=all|month`

### Navbar + Sitemap
- VTuber link → `/vtubers`
- Sosial Media link → `/about` (tidak ada halaman /social)
- Admin link → `/dash/admin`
- Sitemap: hapus deprecated routes, tambah `/vtubers`, `/donate/leaderboard`, dynamic vtuber pages

### Auth Guard Update (proxy.ts)
- `/dash/*` → redirect `/login` jika belum login
- `/dash/admin/*` → cek role OWNER/MANAGER/ADMIN
- `/login` atau `/register` + sudah login → redirect `/dash/profile/me`

## [1.1.0] — 2026-03-12

### ♻️ Refactor — Environment Configuration System

**File baru/diubah:**
- `apps/web/src/env.ts` — File canonical T3 Env (sesuai spec prompt)
  - `DATABASE_URL` (server, required — Drizzle ORM)
  - `SUPABASE_SERVICE_ROLE_KEY` (server, required)
  - `XENDIT_SECRET_KEY` (server, optional)
  - `TRAKTEER_WEBHOOK_SECRET` (server, optional — rename dari `TRAKTEER_WEBHOOK_TOKEN`)
  - `NEXT_PUBLIC_SITE_URL` (client, required)
  - `NEXT_PUBLIC_SUPABASE_URL` (client, required)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (client, required)
- `apps/web/src/env/index.ts` — Backward compat re-export dari `src/env.ts`
- `apps/web/.env.example` — Update lengkap termasuk `DATABASE_URL`

**Update dependencies:**
- `zod` downgraded ke `^3.23.8` (dari `^4.3.6`) untuk T3 env v0.13.x compatibility

**Files diupdate pakai `env.*` bukan `process.env.*`:**
- `src/lib/db/index.ts` — `env.DATABASE_URL`
- `src/lib/supabase/admin.ts` — `env.NEXT_PUBLIC_SUPABASE_URL`, `env.SUPABASE_SERVICE_ROLE_KEY`
- `src/lib/supabase/server.ts` — `env.NEXT_PUBLIC_SUPABASE_URL`, `env.NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `src/app/api/auth/callback/route.ts` — `env.*`
- `src/app/api/auth/signout/route.ts` — `env.*`
- `src/app/api/auth/google/route.ts` — `env.*`
- `src/app/api/auth/discord/route.ts` — `env.*`
- `src/app/api/premium/trakteer/route.ts` — `env.TRAKTEER_WEBHOOK_SECRET`
- `src/app/api/admin/events/route.ts` — `env.*`
- `src/app/api/discord/stats/route.ts` — `env.*`
- `src/app/api/discord/role-sync/route.ts` — `env.*`
- `src/app/api/bot/notify/route.ts` — `env.*`
- `src/app/api/bot/announce/route.ts` — `env.*`
- `src/app/api/gallery/upload/route.ts` — `env.*`

**next.config.ts:**
- Tambah MDX support via `@next/mdx`
- `serverExternalPackages: ['postgres', 'drizzle-orm']`
- Fix `pageExtensions` untuk `.mdx`

**drizzle.config.ts:**
- Tambah `dotenv` loading untuk CLI support
