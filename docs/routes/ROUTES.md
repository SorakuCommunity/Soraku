# SORAKU COMMUNITY — Route Architecture

Dokumen resmi struktur route platform Soraku Community

Owner: Riu
Maintained by: Kairo
Last updated: 2026-03-11

--------------------------------------------------

Panduan Cepat untuk Tim

| Orang | Baca bagian ini |
|------|----------------|
| Bubu (Front-end) | Section 1, 2, 3, 5 — route mana yang ada, mana yang dihapus, naming rules |
| Sora (Full Stack) | Semua section — terutama Section 4 (API) dan Section 6 (Rebuild Rules) |
| Kaizo (Back-end) | Section 4, 6 — API structure dan rules |

--------------------------------------------------

Section 1 — Public Routes

Routes yang bisa diakses siapa saja (tidak butuh login).

/
/about

/blog
/blog/[slug]

/events
/events/[slug]

/gallery
/gallery/upload

/vtubers
/vtubers/[slug]

/agensi

/profile/[username]

/login
/register

/premium

/donate
/donate/leaderboard

Keterangan:

/vtubers menggantikan route lama /agensi/vtuber  
/donate/leaderboard menggantikan /donate/donatur

--------------------------------------------------

Routes yang DIHAPUS

| Route lama | Alasan | Pengganti |
|------------|--------|-----------|
| /social | Social media bukan halaman | Gunakan icon di Navbar/Footer |
| /premium/donatur | Premium ≠ Donate | /donate/leaderboard |
| /agensi/vtuber | Terlalu nested | /vtubers |

--------------------------------------------------

Section 2 — Dashboard Routes (Butuh Login)

Routes di bawah /profile/me menggunakan dashboard layout.

 /profile/me

 /admin
 /admin/blog
 /admin/blog/new

 /admin/events
 /admin/events/new

 /admin/gallery
 /admin/users

Catatan:

Route lama /admin/* akan di redirect otomatis ke /admin/* melalui proxy.ts.

Semua link baru WAJIB menggunakan /admin/*.

--------------------------------------------------

Section 3 — Auth Routes

/login
/register

Login sekarang mengecek session saat halaman dimuat.

Jika user sudah login maka:
- tidak menampilkan form login
- bisa redirect ke dashboard atau tampilkan pilihan akun

--------------------------------------------------

Section 4 — API Routes

Semua API berada di namespace:

/api/*

Struktur utama:

/api/auth/me
/api/auth/login
/api/auth/register
/api/auth/signout

/api/auth/callback
/api/auth/discord
/api/auth/google

/api/blog
/api/blog/[slug]

/api/events
/api/events/[slug]

/api/gallery
/api/gallery/upload

/api/vtubers (TODO)

/api/users/[username]

/api/profile
/api/notifications
/api/stats
/api/partnerships

/api/premium/*
/api/donate/*

/api/admin/*

/api/discord/*
/api/bot/*

/api/music/playlist

--------------------------------------------------

Section 5 — Struktur Folder Next.js

apps/web/src/app/

(public)
 ├ page.tsx
 ├ about/
 ├ blog/
 ├ events/
 ├ gallery/
 ├ vtubers/
 ├ agensi/
 ├ profile/[username]/
 ├ premium/
 └ donate/

(auth)
 ├ login/
 └ register/

(dashboard)
 ├ layout.tsx
 ├ dashboard/   (legacy)
 └ dash/
     ├ profile/me/
     └ admin/

(admin)
 └ legacy admin routes (redirect)

api/

--------------------------------------------------

Section 6 — Rebuild Rules (WAJIB)

Aturan agar struktur route tidak rusak.

BOLEH

- Tambah halaman publik di (public)
- Tambah halaman dashboard di (dashboard)/profile/me
- Tambah API route baru di /api

JANGAN

- Jangan buat route /admin/*
- Jangan ubah namespace /profile/me
- Jangan buat halaman untuk fitur kecil
- Jangan rename proxy.ts
- Jangan lupa dynamic rendering pada page

Contoh:

export const dynamic = 'force-dynamic'

--------------------------------------------------

Naming Convention

Route Group : (group)
Dynamic Route : [slug]

Dashboard : /profile/me/*
Admin : /admin/*
API : /api/*

--------------------------------------------------

Section 7 — Perubahan Versi

v1.0.1

- /social dihapus
- /premium/donatur dipisah dari premium
- /donate/donatur → /donate/leaderboard
- /agensi/vtuber → /vtubers
- /admin → /admin
- /profile/me ditambahkan untuk menghindari konflik dengan /profile/[username]

--------------------------------------------------

Untuk Bubu — Checklist UI

[ ] Hapus link /social
[ ] Update link Top Donatur → /donate/leaderboard
[ ] Update link VTuber → /vtubers
[ ] Update link Admin → /admin
[ ] Update form edit blog
[ ] Update form edit event

--------------------------------------------------

Untuk Sora — Checklist Backend

[ ] Buat API /api/vtubers
[ ] Pisahkan endpoint /api/donate
[ ] Update sitemap
[ ] Tambahkan Supabase realtime untuk notifikasi

--------------------------------------------------

END OF DOCUMENT
