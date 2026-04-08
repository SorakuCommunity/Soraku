# Catatan Perubahan - Soraku Community Platform

Semua perubahan signifikan pada platform Soraku dicatat di sini.
Format mengikuti [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

---

## [v1.6.0] - 7 April 2026

**Admin Dashboard v2, Stream Dashboard, Mobile Refactor, Billing & Bot Control**

### apps/web - Web Komunitas (1.5.0 → 1.6.0)

Ditambahkan:

- Dashboard admin baru: Analytics, Premium, Billing, Discord Bot Control, Settings
- Halaman Settings admin untuk profile dan akun
- Analytics page dengan periode 7/30/90 hari dan top pages
- Billing page dengan Paddle integration (placeholder)
- Premium page dengan perbandingan plan
- Discord Bot control panel dengan status, modules toggle, dan quick actions
- Navigation baru: Analytics, Premium, Billing, Bot, Settings

Diperbaiki:

- Email kontak di footer: contact@soraku.id dan admin@soraku.id
- Email di halaman Lisensi, TOS, Privacy, Contact diperbarui
- Email di SECURITY.md diperbarui ke admin@soraku.id
- Footer menggunakan CONTACT_EMAILS.contact вместо CONTACT_EMAILS.general

### apps/stream - Web Streaming (0.0.0 → 0.1.0)

Ditambahkan:

- Dashboard streaming di /dashboard dengan stats dan anime sources
- Anime sources: Consumet, AniList, MyAnimeList, Anify, Samehadaku, Otakudesu
- Stats: total anime, episodes, images, active sources, cache size, uptime

Infrastruktur:

- Prisma dihapus, gunakan Drizzle ORM
- Konfigurasi Next.js dengan ignoreBuildErrors dan ignoreDuringBuilds

### apps/mobile (0.0.0 → 0.0.1)

Ditambahkan:

- Struktur dasar mobile app dengan Expo
- Package workspace: @soraku/types, @soraku/utils, @soraku/api-client, @soraku/config
- Dipindahkan dari apps/stream/mobile ke apps/mobile

### services/api (0.1.0 → 1.0.0)

Ditambahkan:

- API endpoints untuk community: blog, events, gallery, vtubers
- API endpoints untuk stream: favorites, watch history, sources
- API endpoints untuk donation: Trakteer, Xendit
- Premium subscription API
- Konfigurasi CORS yang fleksibel
- Next.js 16.2.2 dengan ignoreBuildErrors

### services/bot - Discord Bot (1.0.0)

Ditambahkan:

- Sharding dengan discord-hybrid-sharding
- Music system dengan Lavalink
- Command handlers: Info, Developer, Giveaway, Welcome, Pfps, Owner, Invites, Extra
- Database repos: User, Guild, Moderation, Premium, Playlists, Invites, Ticket, SorakuUser
- Event handlers: player, node, discord
- Auto-reply dan autoreact system
- Invite tracking dan ranks

---

## [v1.5.1] - 30 Maret 2026

**Admin Webhook, Halaman Legal, Konsolidasi Migrasi, Feedback & Kontak**

Ditambahkan:

- Panel admin Discord Webhooks: kelola URL webhook Blog, Event, Pendaftaran, dan Feedback dari UI
- Fitur test webhook langsung dari panel admin dengan satu klik
- Admin panel terpisah dari navbar utama, layout standalone dengan header sendiri
- Halaman Kebijakan Privasi dengan 10 section (privasi anak, retensi data, hak pengguna)
- Halaman Ketentuan Penggunaan dengan 12 section (konten terlarang, event, pembatasan tanggung jawab)
- Halaman Lisensi dengan Soraku Community Source License v1.0 (8 bagian)
- Auto-notifikasi in-app saat artikel blog dipublikasikan (broadcast ke semua user)
- Partnership & Sponsorship admin page dengan upload logo dan kategori
- Halaman Kirim Masukan (/feedback) dengan form dan integrasi Discord webhook
- Halaman Kontak (/contact) dengan info email, Discord, lokasi, dan peta
- Link Kontak dan Feedback di footer

Diperbaiki:

- POST /api/analytics/tiktok gagal 500 jika TIKTOK_ACCESS_TOKEN tidak di-set, sekarang di-skip
- GET /api/admin/webhooks gagal 500: kolom label dan category tidak ada di DB, ditambah migrasi fix
- PATCH /api/admin/webhooks gagal 400/500, perbaikan parsing body dan validasi
- GET /api/admin/partnerships gagal 500, ditambah error logging
- Upstash Redis error saat ENV tidak di-set, sekarang di-skip dengan graceful
- Next.js Image fill tanpa prop sizes, ditambah sizes="100vw"
- Cross-origin warning di dev server, ditambah allowedDevOrigins
- Notifikasi `notifyNewBlog` tidak ter-trigger saat artikel di-publish
- Hero section: tombol "Masuk" dihapus, hanya Register + Discord atau Discord + About
- Semua em-dash di teks publik diganti dengan format yang lebih natural
- `export const dynamic` dihapus dari client component

Infrastruktur:

- Migrasi database terkonsolidasi ke satu file: `20260329_soraku_v1_5_1_consolidated.sql`
- Migrasi tambahan: `20260330_fix_sitesettings_columns.sql` untuk tambah kolom label/category
- Semua file migration lama dihapus, hanya tersisa file konsolidasi + fix
- Tabel `sitesettings` untuk konfigurasi webhook (key-value tanpa underscore)
- Discord webhook mendukung feedback: `discordFeedbackWebhookUrl`
- `discord-webhook.ts` mendukung format key baru (camelCase) dan lama (snake_case)
- Route admin dipindah dari `(dashboard)/admin` ke `(admin)/admin`, terpisah dari layout user

---

## [v1.5.0] - 21 Maret 2026

**Sistem Realtime, Redesign Homepage dan Admin**

Rilis ini membawa sistem notifikasi push berbasis Redis dan renovasi besar
pada tampilan beranda serta panel admin.

Ditambahkan:

- Integrasi Upstash Redis dan Realtime untuk notifikasi push instan tanpa polling
- Hook `useRealtime` dengan `RealtimeProvider` yang membungkus seluruh aplikasi
- Helper `createNotification()` yang otomatis meneruskan event ke semua client aktif
- Beranda didesain ulang sepenuhnya, latar menyatu tanpa card berat
- Seksi sosial media: scrolling marquee dua arah tanpa border card
- Panel admin didesain ulang: sidebar terkelompok, metrik besar di depan, tanpa glass card

Diperbaiki:

- Properti `cfg.icon` dan `cfg.border` yang hilang di notifikasi dan navbar
- Tanda tangan `markRead(string[])` tidak sesuai tipe
- Conflict markers di lebih dari sepuluh file blog yang menyebabkan build gagal

---

## [v1.4.0] - 20 Maret 2026

**Domain Resmi, Sistem Follow, Polesan UI**

Ditambahkan:

- Domain default berpindah ke `www.soraku.id`
- Sistem follow dan unfollow antar pengguna dengan counter real-time
- Notifikasi bell di navbar dengan ikon emoji per kategori notifikasi
- Peningkatan UI menyeluruh pada tipografi, spacing, dan navigasi

Diperbaiki:

- Error tipe ikon notifikasi
- Halaman registrasi event
- Resolusi conflict hasil merge blog

---

## [v1.3.0] - 19 Maret 2026

**Sistem Blog - Renovasi Total**

Ditambahkan:

- Grid blog didesain ulang dengan cover image dan stats overlay
- Like dan dislike dengan counter yang tersimpan per pengguna (wajib login)
- Komentar dengan dukungan Markdown, sistem balas bertingkat, dan persistensi otomatis
- Seksi artikel terkait di halaman detail
- Animasi like: floating hearts dan efek bounce
- Modal bagikan ke Twitter/X, Facebook, WhatsApp, dan salin tautan
- Pengumuman otomatis ke Discord saat artikel dipublikasikan
- Pencarian dan filter blog berdasarkan tag
- Editor blog admin: toolbar Markdown, tab pratinjau, komponen ImageUrlInput

Diperbaiki:

- Ketidakcocokan nama tabel `post_comments` dan `post_likes`
- Kolom `guestname` tidak sesuai skema DB yang menggunakan `username`
- Kompatibilitas `RefObject<HTMLTextAreaElement>` di React 19 strict mode
- Namespace `React.JSX.IntrinsicElements` di MarkdownRenderer

---

## [v1.2.0] - 17 Maret 2026

**Sistem Event - Pendaftaran Mobile Legends**

Ditambahkan:

- Form pendaftaran event 3 langkah: Info Tim, Pemain, Konfirmasi
- Dukungan event gratis dan berbayar dengan upload bukti bayar dan info rekening
- Admin dapat meninjau, menerima, atau menolak pendaftaran dengan notifikasi Discord
- Toggle buka dan tutup pendaftaran per event
- Detail event didesain ulang: cover image, badge status, CTA dinamis
- Dukungan URL QRIS di metode pembayaran
- Notifikasi Discord webhook saat event dibuat dan pendaftaran baru masuk
- Komponen `ImageUrlInput`: paste URL, clipboard, drag and drop
- Embed card Discord saat mempublikasikan event baru

Infrastruktur:

- `lib/discord-webhook.ts`: baca URL dari DB `sitesettings`, fallback ke ENV, cache 60 detik
- Migrasi: `eventregistrations`, `ispaid`, `price`, `registrationopen`, `paymentmethods`

---

## [v1.1.0] - 10 Maret 2026

**Konfigurasi Type-Safe, Penguatan Autentikasi**

Ditambahkan:

- T3 Env untuk validasi environment variable yang type-safe di semua aplikasi
- Auto migration runner untuk menerapkan migrasi SQL secara otomatis
- Self-edit username dari halaman profil
- Tab navbar dan animasi swipe di `/profile/me`

Diperbaiki:

- Propagasi cookie PKCE pada Discord OAuth
- Logout kini menghapus cookie sesi dengan benar menggunakan hard-refresh
- Dukungan nama ENV fallback `SUPABASE_SERVICE_KEY`
- `DATABASE_URL` dibuat opsional saat proses build

---

## [v1.0.0] - 8 Maret 2026

**Peluncuran Platform**

Ini adalah rilis publik pertama Soraku Community Platform.

Ditambahkan:

- Login dan registrasi dengan validasi lengkap, Discord OAuth, dan Google OAuth
- Profil publik dengan role badge, XP ring, sistem level, dan pratinjau galeri
- Profil pribadi `/profile/me`: edit semua field, social links, dan pengaturan privasi
- Notifikasi bell real-time via Supabase Realtime dengan polling sebagai fallback
- Panel admin lengkap: Blog, Event, Galeri, Pengguna
- Music player persisten menggunakan React Context dan floating PlayerBar
- Upload galeri ke Supabase Storage dengan sistem review admin

Sistem:

- Trigger auto-create `soraku.users` saat pengguna baru mendaftar via Discord atau Google
- Perbaikan PGRST106 pada schema exposure Supabase PostgREST
- Arsitektur route yang bersih: `/admin/*` dan `/profile/me` tanpa prefix `/dash`
- Guard Discord ID untuk Owner dan redirect pasca login

---

## [v0.9.0] - 5 Maret 2026

**Backend Lengkap, Integrasi Data Real**

Ditambahkan:

- Trakteer webhook untuk notifikasi donasi masuk
- Notification API: list, mark read, counter bell
- Delapan halaman terhubung ke data Supabase secara langsung
- Bot Discord di-deploy ke Railway dengan Dockerfile dan `railway.toml`
- Registry custom icons: DiscordIcon, InstagramIcon, dan lainnya

---

## [v0.8.0] - 3 Maret 2026

**Central API, Fondasi Bot Discord**

Ditambahkan:

- `services/api`: Next.js App Router sebagai API terpusat
- Halaman landing API dengan dokumentasi endpoint
- Tiga slash command Discord pertama
- Arsitektur monorepo: `apps/web`, `services/api`, `services/bot`

---

## [v0.7.0] - 1 Maret 2026

**Semua Halaman Selesai**

Halaman yang selesai pada rilis ini mencakup beranda, tentang kami, blog, event,
galeri, login, register, profil publik dan pribadi, VTubers, serta sosial media.

Ditambahkan:

- Navbar dengan dropdown Komunitas dan Agensi
- Footer dua kolom dengan enam tautan sosial media
- Notifikasi bell dengan badge counter

---

## [v0.5.0] - 25 Februari 2026

**Fondasi Backend**

Ditambahkan:

- Semua API route dasar: auth, profil, blog, event, galeri, admin
- Supabase client untuk server, client, dan admin
- Helper: `getSession()`, `adminDb()`, `ok()`, `err()`, `NOT_FOUND()`
- Upload galeri ke Supabase Storage

---

## [v0.2.0] - 20 Februari 2026

**Panel Admin**

Ditambahkan:

- Layout admin dengan sidebar navigasi
- CRUD lengkap untuk Blog, Event, Galeri, dan Pengguna
- Semua halaman admin menggunakan data real dari Supabase

---

## [v0.1.0] - 15 Februari 2026

**Fondasi UI**

Ditambahkan:

- Navbar dengan state autentikasi real
- Footer dengan tautan sosial
- Music player persisten via React Context
- Halaman statis awal: beranda, tentang, daftar blog, daftar event

---

## [v0.0.1] - 10 Februari 2026

**Awal Mula**

Ditambahkan:

- Scaffold monorepo: `apps/web`, `services/api`, `services/bot`
- Next.js 16 App Router dengan TypeScript dan Tailwind CSS v4
- Setup proyek Supabase dengan skema awal
- Konfigurasi deployment Vercel untuk monorepo
- Dokumentasi awal: PLAN.md, CHANGELOG.md, struktur tim

---

_Soraku Community. Est. 2023._

```

```
