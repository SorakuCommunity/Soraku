# Catatan Perubahan - Soraku Platform

Semua perubahan signifikan pada platform Soraku dicatat di sini.
Format mengikuti [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

Mengikuti yang ada di:
- [Soraku Web](https://github.com/soraku-id/soraku/blob/main/apps/web/CHANGELOG.md)
- [Soraku API](https://github.com/soraku-id/soraku/blob/main/apps/api/CHANGELOG.md)
- [Soraku Bot](https://github.com/soraku-id/soraku/blob/main/apps/bot/CHANGELOG.md)

Gabungkan menjadi satu changelog untuk keseluruhan platform Soraku.

## [unreleased]

## [v1.6.0] - 13 Juni 2026

### Added
- Full platform redesign: Hybrid Neo Brutalism Design System (apps/web)
  - New color palette: Background #0B1120, Primary #2563EB, Surface #111827
  - Thick borders (2px), offset shadows, high contrast, minimal rounding
  - Geometric decorative elements (circles, diamonds, patterns)
- Mobile Android-style bottom navigation (Home, Community, Showcase, Events, Profile)
- Desktop sticky top navbar with Home, Community, Showcase, Events, Leaderboard, About
- New landing page with 10 sections: Hero, Stats, Features, Events, Blog, Benefits, Discord, Partners, Social, CTA
- New community page with discussions feed, featured groups, trending topics
- New showcase page with project gallery grid and tag filtering
- New leaderboard page with XP rankings and gamification stats
- New wallet page for balance management
- BrutalCard base component (forward-compatible alias for glass-card)

### Changed
- Completely redesigned globals.css — removed all glassmorphism, cyberpunk styles
- Core UI components rewritten: button, card, badge, input with brutalist styling
- Footer redesigned with brutalist card panels and English localization
- All existing pages inherit brutalist styling through backward-compatible glass-card alias
- Navbar items updated to English layout
- Public layout padding adjusted for new bottom nav

### Removed
- All glassmorphism classes (glass-card-cyber, emerald, rose, etc.)
- All cyberpunk glow effects and gradient border animations
- btn-shine, btn-primary-gradient, btn-neon, btn-pulse classes

## [v1.5.3] - 07 Mei 2026

### Added
- Umami Analytics integration (apps/web)
  - Comprehensive analytics dashboard with Recharts (line, bar, pie charts)
  - API route proxy `/api/admin/umami`
  - Metrics: Pageviews, Visitors, Bounce Rate, Duration, Top Pages, Referrers, Browser, OS, Devices, Countries
- ProfileSidebar component for profile section navigation
- Section component for reusable page sections

### Changed
- Mobile navbar redesign: dropdown from top with grouped sections matching desktop (Fitur, Agensi, Komunitas, Informasi)
- Static assets reorganized to `public/assets/` directory
- Updated favicon and PWA manifest files

### Fixed
- JSX comment syntax errors in navbar.tsx
- Duplicate `cn` function in ProfileSidebar
- Stray closing tags in mobile drawer

---

## [v1.5.2] - 26 April 2026

### Added
- Updated Soraku identity from "Soraku Community" to "Soraku" reflecting professional positioning
- New identity statement emphasizing community-driven digital platform for anime culture, learning, and creator development
- Positioned as scalable product with future monetization potential, similar to Dicoding/RevoU/Udemy but community-first
- **ALL FEATURES INTEGRATED**:
  - Cookie Consent Popup dengan opsi (Accept All / Customize / Only Necessary)
  - Simplified homepage design: Hero + Features + CTA sections
  - Fallback images untuk Blog & Event cards dari Dribbble
  - Dummy data placeholders untuk Events dan Blogs saat database kosong
  - Homepage redesign dengan 10 sections (anime studio style)
  - Navbar dengan "Konten" dropdown (Blog, VTuber, Gallery)
  - Zustand store untuk user state personalization
  - API endpoint `/api/home` untuk homepage data
  - Personalization system (guest/new_user/active_user detection)
  - Navbar user avatar dropdown (Profile, Dashboard, Settings, Logout)
  - Updated navbar dengan Konten dropdown menu
  - Admin Dashboard v2: New pages for Analytics, Premium, Billing, Bot Control, and Settings
  - Analytics Page: Period selection (7/30/90 days), top pages, visitor stats
  - Billing Page: Paddle subscription integration with Free/Pro/Premium plans
  - Premium Page: Benefits overview and plan comparison table
  - Bot Control Page: Status, stats, modules toggle (Music, Moderation, Auto Replies, Level System)
  - Settings Page: Profile editing (display name, avatar), account info
  - New Navigation Items: Analytics, Premium, Billing, Bot, Settings in admin sidebar
  - Updated Contact Emails: contact@soraku.id (Contact Center), admin@soraku.id (Admin Center)
  - Updated Footer to use CONTACT_EMAILS.contact
  - Updated License, TOS, Privacy, Contact pages with new email addresses
  - Updated SECURITY.md: Security contact updated to admin@soraku.id

### Changed
- Updated all references from "Soraku Community" to "Soraku" throughout codebase:
  - Web application (apps/web/) - layout, metadata, pages, components
  - Discord bot (services/bot/) - package.json, config, commands, events
  - API service (services/api/) - metadata and descriptions
  - Documentation - LICENSE, CHANGELOG.md, stack.md, SECURITY.md
  - Environment variables (.env.example)
  - License file - Soraku Source License v1.0
- Reverted ke Next.js 15.x karena turbopack build issues dengan monorepo
- Package updates ke versi latest:
  - @hookform/resolvers: 3.10.0 → 5.2.2
  - @types/node: 22.19.17 → 25.6.0
  - drizzle-kit: 0.18.1 → 0.31.10
  - eslint: 9.39.4 → 10.2.0
  - lucide-react: 0.513.0 → 1.8.0
  - react-hook-form: 7.72.1 → 7.56.1
  - typescript: 5.9.3 → 6.0.2
  - zod: 3.25.76 → 4.3.6
  - @supabase/ssr: 0.6.1 → 0.10.2
- Blog & Event cards menggunakan GlassCard glassmorphism style
- Navbar export default fixed
- Icon imports (Instagram/Twitter/Youtube → custom-icons)

### Fixed
- Build errors in tos/page.tsx (JSX syntax)
- Removed empty connects directory causing TypeScript issues
- Fixed remaining "Soraku Community" references in login/page.tsx
- Missing export default di Navbar component
- Missing @soraku/ui package.json untuk workspace
- Teks "Belajar, Berkarya, Bersama" dari hero section
- Efek blur/gradasi hitam pada mascot di hero
- Referensi ke karakteranime images (folder kosong)
- All builds now pass successfully

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

_Soraku. Est. 2023._

```

```
