# SORAKU — PLAN.md
> Koordinasi Tim: Riu (Owner) · Sora (Full Stack) · Bubu (Front-end) · Kaizo (Back-end)
> Last updated: 2026-03-11

---

## v0.0.1 — Foundation ✅

| Feature               | Owner | Status | Catatan                                      |
|-----------------------|-------|--------|----------------------------------------------|
| Monorepo setup        | Sora  | ✅     | pnpm workspace + Turborepo                   |
| Design system / CSS   | Bubu  | ✅     | globals.css, tokens, animations              |
| Navbar, Footer        | Bubu  | ✅     | Responsive, dark mode, social links          |
| Homepage              | Bubu  | ✅     | Hero blob, badges, marquee                   |
| About page            | Bubu  | ✅     | Filosofi, pilar, tim, CTA                   |
| UI primitives         | Bubu  | ✅     | Button, Badge, Avatar, Separator             |
| Types                 | Sora  | ✅     | User, BlogPost, Event, GalleryItem + Talent  |
| 404 page              | Bubu  | ✅     | Custom dengan kanji 空                       |
| Vercel deploy         | Sora  | ✅     | soraku.vercel.app — LIVE                     |

## v0.1.0 — Navbar & Footer ✅

| Feature                          | Owner | Status | Catatan                                      |
|----------------------------------|-------|--------|----------------------------------------------|
| Navbar dropdown Komunitas+Agensi | Bubu  | ✅     | With desc, mobile accordion                  |
| Footer 2 kolom + 6 sosmed        | Bubu  | ✅     | Discord, TikTok, FB, IG, Twitter, YouTube    |
| /agensi/vtuber page              | Bubu  | ✅     | VTuber cards + CTA                           |

## v0.2.0 — Auth & User UI ✅

| Feature                    | Owner | Status | Catatan                                      |
|----------------------------|-------|--------|----------------------------------------------|
| Supabase project setup     | Kaizo | ✅     | Schema soraku aktif di Supabase              |
| Schema DB                  | Kaizo | ✅     | 15 tabel di schema soraku, RLS aktif         |
| Login page UI              | Bubu  | ✅     | 2 step + Discord OAuth button                |
| Register page UI           | Bubu  | ✅     | 2 step form + benefits panel                 |
| Auth middleware             | Kaizo | ✅     | src/proxy.ts — role-based (Next.js 16)       |
| Dashboard layout + page    | Bubu  | ✅     | Sidebar, stats, quick links                  |

## v0.3.0 — Konten ✅

| Feature                    | Owner | Status | Catatan                                      |
|----------------------------|-------|--------|----------------------------------------------|
| Blog listing page          | Bubu  | ✅     | Filter tag, featured post, grid              |
| Blog detail page           | Bubu  | ✅     | /blog/[slug], related posts, metadata        |
| Blog API (GET)             | Kaizo | ✅     | /api/blog + /api/blog/[slug]                 |
| Events listing page        | Bubu  | ✅     | Upcoming/past, card grid                     |
| Events detail page         | Bubu  | ✅     | /events/[slug], Discord CTA                  |
| Events API (GET)           | Kaizo | ✅     | /api/events + /api/events/[slug]             |
| Galeri grid page           | Bubu  | ✅     | Masonry layout, filter kategori              |
| Galeri upload form         | Bubu  | ✅     | Drag & drop, preview, form                   |
| Galeri API                 | Kaizo | ✅     | /api/gallery + /api/gallery/upload           |
| Loading skeletons          | Bubu  | ✅     | Blog, events, gallery loading.tsx            |
| Error boundaries           | Bubu  | ✅     | Blog, events error.tsx                       |

## v0.4.0 — Agensi & Premium ✅

| Feature                    | Owner | Status | Catatan                                      |
|----------------------------|-------|--------|----------------------------------------------|
| Agensi talent list         | Bubu  | ✅     | Grid cards, type badge, socials              |
| Agensi VTuber page         | Bubu  | ✅     | /agensi/vtuber, model type, streams          |
| Agensi API                 | Kaizo | ✅     | /api/agensi + /api/agensi/[slug]             |
| Premium page               | Bubu  | ✅     | 3 tier (Donatur/VIP/VVIP) + benefits         |
| Xendit integration         | Kaizo | ✅     | /api/premium/xendit/create + webhook         |
| Donate page                | Bubu  | ✅     | Trakteer redirect, how-to, usage             |
| Top Donatur page           | Bubu  | ✅     | Podium 🥇🥈🥉, full list, gold glow          |

## v0.5.0 — Admin Panel UI ✅

| Feature                    | Owner | Status | Catatan                                      |
|----------------------------|-------|--------|----------------------------------------------|
| Admin layout               | Bubu  | ✅     | Sidebar, protected (middleware active)       |
| Admin dashboard overview   | Bubu  | ✅     | Stats cards, recent posts, pending gallery   |
| Admin user management      | Bubu  | ✅     | UI done                                      |
| Admin blog CRUD UI         | Bubu  | ✅     | Tabel + Edit/Delete buttons                  |
| Admin event CRUD UI        | Bubu  | ✅     | List + Edit/Delete buttons                   |
| Admin galeri moderasi      | Bubu  | ✅     | Approve/Reject buttons per item              |
| Admin API                  | Kaizo | ✅     | /api/admin/users + blog + events + gallery   |

## v0.6.0 — Polish ✅

| Feature                    | Owner | Status | Catatan                                      |
|----------------------------|-------|--------|----------------------------------------------|
| Discord stats API          | Sora  | ✅     | /api/discord/stats — fallback ke mock        |
| Music player persistent    | Bubu  | ✅     | React Context, PlayerBar floating            |
| Sitemap                    | Bubu  | ✅     | /sitemap.xml — static + dynamic pages        |
| OG image meta              | Bubu  | ✅     | layout.tsx — OG, Twitter card, robots        |

## v0.7.0 — Real Data Integration ✅

| Feature                    | Owner | Status | Catatan                                              |
|----------------------------|-------|--------|------------------------------------------------------|
| Blog → real DB             | Kaizo | ✅     | posts table, filter tags, order publishedat          |
| Blog detail → real DB      | Kaizo | ✅     | Query by slug + author join, notFound()              |
| Events → real DB           | Kaizo | ✅     | events table, filter isonline, upcoming/past         |
| Gallery → real DB          | Kaizo | ✅     | status='approved', filter tags, Next.js Image        |
| Agensi → real DB           | Kaizo | ✅     | vtubers table (/agensi + /agensi/vtuber)             |
| Top Donatur → real DB      | Kaizo | ✅     | donatur table, order amount DESC, podium top 3       |
| Music playlist → real DB   | Kaizo | ✅     | /api/music/playlist → musictracks                    |
| Dashboard → real user data | Kaizo | ✅     | getSession() + count posts & gallery per user        |
| packages/utils             | Kaizo | ✅     | slugify, formatDate, formatRupiah, truncate, dll     |
| Trakteer webhook           | Kaizo | ✅     | /api/premium/trakteer → update DB + bot DM + role   |
| /api/auth/register         | Kaizo | ✅     | POST — Zod validate, cek duplikat username           |
| /api/auth/login            | Kaizo | ✅     | POST — signInWithPassword, return full profile       |
| /gallery/upload → real API | Kaizo | ✅     | Connect form ke POST /api/gallery/upload             |
| Sitemap dynamic            | Kaizo | ✅     | Query real DB — posts + events                       |

## v0.8.0 — Discord Bot ✅

| Feature                          | Owner | Status | Catatan                                              |
|----------------------------------|-------|--------|------------------------------------------------------|
| Scaffold services/bot            | Sora  | ✅     | Discord.js v14, TypeScript, Railway-ready            |
| HTTP server internal (Hono)      | Sora  | ✅     | Terima webhooks dari web, port 3001                  |
| Bot login & ready handler        | Sora  | ✅     | Bot online, set activity status                      |
| guildMemberUpdate → role-sync    | Sora  | ✅     | services/bot/src/events/guildMemberUpdate.ts         |
| GET /health                      | Sora  | ✅     | Railway healthcheck                                  |
| POST /webhook/notify             | Sora  | ✅     | DM user Discord                                      |
| POST /webhook/role-update        | Sora  | ✅     | Update role Discord user                             |
| POST /webhook/discord-event      | Sora  | ✅     | Announce event ke channel                            |
| Slash command: /ping             | Sora  | ✅     | Health check command                                 |
| Slash command: /member           | Sora  | ✅     | Member count dari web API                            |
| Slash command: /event            | Sora  | ✅     | List 5 event upcoming                                |
| API web: POST /api/bot/notify    | Sora  | ✅     | Web → trigger bot DM                                 |
| API web: POST /api/bot/announce  | Sora  | ✅     | Web → trigger bot announcement                       |
| Dockerfile + Railway config      | Sora  | ✅     | Multi-stage Node 20 Alpine, non-root user            |
| Bot deploy Railway               | Kaizo | 🔴     | ENV vars belum di-set di Railway — pending Kaizo     |

## v0.9.0 — UI Redesign & Notifikasi ✅

| Feature                       | Owner | Status | Catatan                                               |
|-------------------------------|-------|--------|-------------------------------------------------------|
| Upload /public/logo.png       | Bubu  | ✅     | Chibi sticker + logo-full.png                         |
| Footer → SORAKU_SOCIALS       | Bubu  | ✅     | Import dari custom-icons.tsx                          |
| Halaman /social               | Bubu  | ✅     | Grid semua sosmed pakai SORAKU_SOCIALS                |
| Nav items baru                | Bubu  | ✅     | Showcase, Sosial Media, Premium                       |
| Notification bell UI          | Bubu  | ✅     | Bell, badge unread, panel dropdown, polling 30s       |
| User dropdown di Navbar       | Bubu  | ✅     | Avatar, nama, Profil/Settings/Admin/Keluar            |
| Redesign homepage             | Bubu  | ✅     | Mascot hero, stats grid, DiscordIcon CTA              |
| Redesign blog                 | Bubu  | ✅     | Featured post besar, emoji tags                       |
| Redesign events               | Bubu  | ✅     | Upcoming/past section, countdown timer                |
| Redesign gallery              | Bubu  | ✅     | Masonry grid, hover overlay, category filter          |
| Redesign login                | Bubu  | ✅     | Split layout mascot, OAuth custom icons               |
| Redesign register             | Bubu  | ✅     | Split layout benefits, 2-step form                    |
| Redesign /about               | Bubu  | ✅     | Hero mascot, stats real-time, marquee, timeline       |
| Navbar → real session         | Bubu  | ✅     | IS_LOGGED_IN → fetch /api/auth/me, hapus MOCK_USER    |
| Login/register accessible     | Bubu  | ✅     | Tombol Masuk/Daftar muncul saat belum login           |
| force-dynamic front-end pages | Bubu  | ✅     | 13 pages: login, register, about, donate, dll         |
| custom-icons registry         | Sora  | ✅     | DiscordIcon, TrakteerIcon, SORAKU_SOCIALS, dll        |
| force-dynamic semua API routes| Sora  | ✅     | 29 routes diinjeksi sekaligus                         |
| Notif API                     | Kaizo | ✅     | GET /api/notifications + PATCH mark-as-read           |
| Push notif via Trakteer flow  | Kaizo | ✅     | Insert ke notifications table saat donasi berhasil    |
| Supabase Realtime             | Sora  | ❌     | Ditunda ke v1.0.0
| /api/stats real DB            | Kaizo | ✅     | eventCount + memberCount + postCount dari DB          |
| Tabel partnerships + API      | Kaizo | ✅     | Migration soraku.partnerships, RLS, /api/partnerships |                                     |

## v1.0.0 — Admin Panel + Route Architecture ✅ / 🔜
> Route architecture ditetapkan oleh **Riu** (Owner) via `docs/routes/ROUTES.md` + `NAMESPACE.md`
> Dieksekusi oleh **Sora** — commit `56fcf36`

### Admin Panel (Sora)

| Feature                         | Owner | Status | Catatan                                               |
|---------------------------------|-------|--------|-------------------------------------------------------|
| Admin panel → real data         | Sora  | ✅     | Semua 5 halaman connect ke real DB via API            |
| Admin dashboard stats           | Sora  | ✅     | /api/admin/stats — Promise.all 6 queries              |
| Admin blog CRUD lengkap         | Sora  | ✅     | Publish/draft toggle + hapus + form buat baru         |
| Admin events CRUD lengkap       | Sora  | ✅     | Publish/draft toggle + hapus + form buat baru         |
| Admin gallery moderasi          | Sora  | ✅     | Approve/Reject via PATCH /api/admin/gallery/[id]      |
| Admin users — ubah role         | Sora  | ✅     | Dropdown role langsung PATCH /api/admin/users         |
| Admin users — ban/unban         | Sora  | ✅     | Toggle isbanned via PATCH /api/admin/users            |
| Admin layout active state       | Sora  | ✅     | Sidebar highlight + dot indicator per halaman         |
| Admin mobile bottom nav         | Sora  | ✅     | Fixed bottom nav 5 item untuk mobile                  |

### Route Architecture (Riu + Sora)

| Feature                                     | Owner      | Status | Catatan                                                        |
|---------------------------------------------|------------|--------|----------------------------------------------------------------|
| Redirect /social → /                        | Sora       | ✅     | 301 di proxy.ts — /social bukan halaman per NAMESPACE.md      |
| Redirect /agensi/vtuber → /vtubers          | Sora       | ✅     | 301 permanent — semua link lama tetap jalan                    |
| Redirect /premium/donatur → /donate/leaderboard | Sora   | ✅     | 301 permanent                                                  |
| Redirect /admin/* → /dash/admin/*           | Sora       | ✅     | 301 permanent — sesuai NAMESPACE.md                            |
| Redirect /dashboard/* → /dash/*             | Sora       | ✅     | 301 permanent                                                  |
| Halaman /vtubers                            | Sora       | ✅     | Dipindah dari /agensi/vtuber, real DB                          |
| Halaman /vtubers/[slug]                     | Sora       | ✅     | Detail VTuber baru — belum ada sebelumnya                      |
| Halaman /donate/leaderboard                 | Sora       | ✅     | Dipindah dari /premium/donatur, konten sama                    |
| /dash/admin/* — semua pages                 | Sora       | ✅     | Layout + 5 halaman admin di namespace baru                     |
| API /api/vtubers                            | Sora       | ✅     | GET list + filter tag + pagination                             |
| API /api/vtubers/[slug]                     | Sora       | ✅     | GET detail by slug                                             |
| API /api/donate                             | Sora       | ✅     | GET donatur publik, filter period=all|month                    |
| Sitemap update                              | Sora       | ✅     | Hapus deprecated, tambah /vtubers + /donate/leaderboard        |
| Navbar update                               | Sora       | ✅     | Link VTuber→/vtubers, Admin→/dash/admin, hapus /social         |
| Halaman /social dihapus (page masih ada)    | Bubu       | 🔜     | File lama masih ada — Bubu hapus page.tsx /social              |
| Update semua link internal → route baru     | Bubu       | 🔜     | Cek seluruh halaman publik — link /premium/donatur, /agensi/vtuber |
| Admin form edit blog /dash/admin/blog/[id]/edit  | Bubu  | 🔜     | Form prefill dari /api/blog/[slug]                             |
| Admin form edit event /dash/admin/events/[id]/edit | Bubu | 🔜   | Form prefill dari /api/events/[slug]                           |

### Auth & Profile (Kaizo + Bubu)

| Feature                          | Owner | Status | Catatan                                               |
|----------------------------------|-------|--------|-------------------------------------------------------|
| Login page → real API            | Bubu  | ✅     | POST /api/auth/login, error state, redirect           |
| Register page → real API         | Bubu  | ✅     | POST /api/auth/register, auto-login, 2-step           |
| Dashboard layout → real session  | Bubu  | ✅     | fetch /api/auth/me, nama real, link admin jika staff  |
| Profile page /dash/profile/me    | Bubu  | ✅     | CRUD: displayname, bio, avatar, cover, social links   |
| API /api/profile GET + PATCH     | Bubu  | ✅     | Update profile user login                             |
| Profile routing restruktur       | Kaizo | ✅     | /dash/profile/me + /profile/[username] fix conflict   |
| Discord ID OWNER (Riu)           | Kaizo | 🔴     | ID 1020644780075659356 → role OWNER di auth callback  |
| Bot deploy Railway               | Kaizo | 🔴     | Set ENV vars di Railway + Vercel, lalu deploy         |

### Launch Checklist

| Feature                 | Owner | Status | Catatan                              |
|-------------------------|-------|--------|--------------------------------------|
| Performance audit       | Sora  | 🔜     | Lighthouse 90+, Core Web Vitals      |
| Security audit          | Sora  | 🔜     | Rate limiting, CORS, CSP headers     |
| E2E tests (Playwright)  | Sora  | 🔜     | Auth flow, blog, gallery upload      |
| Error monitoring        | Sora  | 🔜     | Sentry / Vercel monitoring           |
| Custom domain           | Riu   | 🔜     | soraku.id atau soraku.moe            |

---

## Coding Rules (WAJIB semua tim)

```ts
export const dynamic = 'force-dynamic'  // baris pertama SETIAP page.tsx & route.ts
```

- Mutations via API routes — BUKAN Server Actions
- Server Components query DB langsung via `db()` — JANGAN fetch /api/* dari server
- `adminDb()` untuk data queries, `createAdminClient()` untuk auth.admin
- Semua DB queries pakai `.schema('soraku')`
- Zod validasi semua input API
- Import icons dari `@/components/icons/custom-icons` atau Lucide — JANGAN inline SVG
- Commit convention: `feat|fix|refactor|docs|chore(scope): deskripsi`
- Git: `git add -A -- ':!.github/workflows/ci.yml'`
