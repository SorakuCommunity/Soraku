# SORAKU COMMUNITY
Route Namespace Rules

Dokumen ini adalah aturan inti struktur route Soraku.
Tujuannya mencegah contributor atau AI tools membuat route yang merusak struktur platform.

Owner: Riu
Maintainer: Soraku Core Team

--------------------------------------------------

PRINSIP UTAMA

Soraku menggunakan struktur route modular berbasis namespace.

Setiap fitur HARUS berada di namespace yang sudah ditentukan.

Jangan membuat namespace baru tanpa diskusi dengan maintainer.

--------------------------------------------------

PUBLIC ROUTES

Digunakan untuk halaman yang bisa diakses tanpa login.

Namespace:

/
/about
/blog
/events
/gallery
/vtubers
/agensi
/profile/[username]
/premium
/donate

Contoh:

/blog/nama-artikel
/events/anime-festival-2026
/profile/riu

--------------------------------------------------

AUTH ROUTES

Digunakan hanya untuk proses autentikasi.

Namespace:

/login
/register

Rules:

Halaman ini tidak boleh memiliki sub route tambahan.

--------------------------------------------------

DASHBOARD ROUTES

Semua halaman user dashboard berada di namespace ini.

Namespace:

/profile/me

Contoh:

/profile/me
/admin
/admin/blog
/admin/events

Rules:

JANGAN membuat namespace baru seperti:

/profile/meboard
/user-dashboard
/adminpanel

Semua dashboard WAJIB berada di bawah /profile/me.

--------------------------------------------------

ADMIN ROUTES

Admin panel berada di dalam dashboard.

Namespace:

/admin

Contoh:

/admin/blog
/admin/events
/admin/gallery
/admin/users

Rules:

Route /admin tidak boleh digunakan lagi.

Gunakan redirect jika masih ada route lama.

--------------------------------------------------

API ROUTES

Semua API backend berada di namespace:

/api

Contoh:

/api/blog
/api/events
/api/gallery
/api/vtubers
/api/users

/authentication:

/api/auth/login
/api/auth/register
/api/auth/me
/api/auth/signout

Rules:

JANGAN membuat endpoint di luar /api.

Contoh yang salah:

/login-api
/auth/login
/backend/api

--------------------------------------------------

DONATE SYSTEM

Donate dipisahkan dari premium.

Namespace:

/donate
/donate/leaderboard

API:

/api/donate

Rules:

Premium adalah membership.
Donate adalah support platform.

Jangan mencampur keduanya.

--------------------------------------------------

VTUBER SYSTEM

VTuber menggunakan namespace:

/vtubers

Contoh:

/vtubers
/vtubers/alexxa-li-moretti

Rules:

Route lama:

/agensi/vtuber

sudah diganti.

--------------------------------------------------

SOCIAL MEDIA

Soraku tidak memiliki halaman /social.

Semua social media hanya dipanggil melalui icon.

Lokasi icon:

src/components/icons/custom-icons.tsx

--------------------------------------------------

DYNAMIC ROUTES

Gunakan format Next.js:

[slug]

Contoh:

/blog/[slug]
/events/[slug]
/profile/[username]

Jangan menggunakan format lain seperti:

:id
{slug}

--------------------------------------------------

REBUILD RULES

Saat melakukan refactor atau rebuild:

BOLEH

- Menambah page di namespace yang sudah ada
- Menambah API endpoint baru
- Menambah dashboard feature

JANGAN

- Mengubah namespace utama
- Menghapus /profile/me
- Menghapus /api
- Membuat route baru tanpa struktur

--------------------------------------------------

RULE UNTUK AI TOOLS

Jika AI coding tools membuat route baru,
AI harus mengikuti aturan berikut:

1. Public page → /blog /events /gallery dll
2. Dashboard page → /profile/me/*
3. Admin page → /admin/*
4. API endpoint → /api/*
5. Authentication → /login atau /register

Jika route tidak cocok dengan kategori di atas,
maka route tersebut SALAH.

--------------------------------------------------

END OF FILE
