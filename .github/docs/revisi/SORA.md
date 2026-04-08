# SORA — Brief & Task List
> From: Kaizo (Back-end)
> Last updated: 2026-03-12

---

## Identitas

Sora adalah Full Stack Lead di tim Soraku.
Sora membaca file ini di awal setiap sesi, lalu lanjut kerja sesuai status di bawah.

---

## Stack

- Next.js 16 App Router (arsitektur, routing, middleware)
- Supabase (client setup, env, admin client, migrations)
- TypeScript strict mode — semua types harus benar
- Vercel deployment & monitoring
- Turborepo untuk monorepo build

---

## Deployment

| | |
|---|---|
| Production | https://soraku.vercel.app |
| Repo | https://github.com/SorakuCommunity/Soraku |
| Branch | `master` → auto-deploy ke Vercel |
| Vercel project | `prj_xlkSNQGFtoVGd1XmbxqXmqvPkMug` |
| Root Directory | `apps/web` |
| Supabase project | `jrgknsxqwuygcoocnnnb` |

---

## ✅ Status Terkini

| Area | Status |
|------|--------|
| Auth (login/register/Discord OAuth/Google OAuth) | ✅ |
| Navbar session real | ✅ |
| Profile `/dash/profile/me` | ✅ |
| Admin panel → real API (5 halaman) | ✅ |
| Blog, Events, Gallery, VTubers, Donate | ✅ Real DB |
| Form edit blog + event `/dash/admin/*/[id]/edit` | ✅ |
| Supabase Realtime gallery | ✅ |
| Notifications Realtime | ✅ |
| Homepage real data | ✅ |
| Logout hard-refresh | ✅ Fix 2026-03-12 |
| DB sync — duplikat policies/triggers/functions dibersihkan | ✅ Fix 2026-03-12 |

---

## 🔴 ACTION REQUIRED — Segera (Riu yang kerjakan, Sora verifikasi)

### ⚠️ ENV di Vercel — PALING KRITIS

File referensi lengkap: **`apps/web/.env.example`** (sudah ada di repo)

Buka: **Vercel → Project `soraku` → Settings → Environment Variables**

Pastikan semua ini sudah diset:

| ENV | Nilai | Prioritas |
|-----|-------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://jrgknsxqwuygcoocnnnb.supabase.co` | 🔴 Wajib |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Dari Supabase Dashboard → API → anon key | 🔴 Wajib |
| `SUPABASE_SERVICE_ROLE_KEY` | Dari Supabase Dashboard → API → service_role | 🔴 Wajib |
| `NEXT_PUBLIC_SITE_URL` | `https://soraku.vercel.app` | 🔴 Wajib |
| `NEXT_PUBLIC_APP_URL` | `https://soraku.vercel.app` | 🔴 Wajib |
| `OWNER_DISCORD_IDS` | `1020644780075659356` | 🔴 Wajib |
| `DISCORD_INVITE_CODE` | `qm3XJvRa6B` | 🟡 Default ada |
| `SORAKU_API_SECRET` | Generate random hex 32 byte | 🟡 Wajib saat bot deploy |
| `BOT_WEBHOOK_URL` | URL Railway bot setelah deploy | 🟢 Opsional |
| `BOT_WEBHOOK_SECRET` | Sama dengan `WEBHOOK_SECRET` di bot | 🟢 Opsional |
| `XENDIT_SECRET_KEY` | Xendit Dashboard | 🟢 Opsional |
| `XENDIT_WEBHOOK_TOKEN` | Xendit Dashboard | 🟢 Opsional |
| `TRAKTEER_WEBHOOK_TOKEN` | Trakteer Dashboard | 🟢 Opsional |

> **Tanpa `SUPABASE_SERVICE_ROLE_KEY`** → semua `adminDb()` query gagal silent
> → error 500 di `/api/profile`, `/api/auth/me`, semua admin routes

### ⚠️ Supabase Auth URL Configuration

Buka: **Supabase → Authentication → URL Configuration**

Set ini:
```
Site URL:
  https://soraku.vercel.app

Redirect URLs (tambahkan semua):
  https://soraku.vercel.app/**
  https://soraku.vercel.app/api/auth/callback
  http://localhost:3000/**
```

> Tanpa ini → OAuth Discord/Google error `bad_oauth_state`

---

## DB State — Post Sync Fix (2026-03-12)

Migration `20260312_fix_sync_cleanup_all` sudah applied. DB sekarang bersih:

| Item | Sebelum | Sesudah |
|------|---------|---------|
| Functions | 6 (ada duplikat + fungsi lama) | 4 (bersih) |
| Triggers | 10 (ada 2 nama berbeda) | 10 (semua `set_updated_at`) |
| RLS Policies | ~45 (banyak duplikat) | 36 (bersih) |
| Migrations tracked | 3 | 5 |

---

## Schema DB — Naming Convention

Semua kolom di schema `soraku.*` pakai **lowercase tanpa underscore**:

| ✅ Benar | ❌ Salah |
|---------|---------|
| `displayname` | `display_name` |
| `avatarurl` | `avatar_url` |
| `isprivate` | `is_private` |
| `createdat` | `created_at` |

Tabel lain — perbedaan dari mock lama:

| Mock lama | DB sebenarnya |
|-----------|--------------|
| `blog_posts` | `posts` |
| `gallery.approved` (bool) | `gallery.status` ('pending'/'approved'/'rejected') |
| `events.starts_at` | `events.startdate` |
| `events.event_type` | `events.isonline` (boolean) |
| `posts.published` | `posts.ispublished` |
| `vtubers.bio` | `vtubers.description` |

---

## Pattern Query Wajib

```ts
// ✅ Server Component → query DB langsung via adminDb()
import { adminDb } from "@/lib/supabase/admin"
const { data } = await adminDb().from("posts").select("...").eq("ispublished", true)

// ✅ force-dynamic wajib di semua page
export const dynamic = "force-dynamic"

// ✅ searchParams Next.js 16 — wajib awaited
export default async function Page({ searchParams }: { searchParams?: Promise<{ tag?: string }> }) {
  const params = await searchParams
  const tag = params?.tag ?? "Semua"
}

// ❌ JANGAN fetch ke API dari Server Component
const res = await fetch("/api/blog") // double round-trip
```

---

## Bug Log — Fix yang Sudah Dilakukan Kaizo

| # | Bug | Root Cause | Fix | Status |
|---|-----|-----------|-----|--------|
| 1 | `z.record()` error | Zod v3 butuh 2 argumen | `z.record(z.string(), z.string())` | ✅ |
| 2 | `adminDb().auth` error | adminDb() return schema client | `createAdminClient().auth.admin` | ✅ |
| 3 | `/profile/me` route conflict | Clash dengan `/profile/[username]` | Pindah ke `/dash/profile/me` | ✅ |
| 4 | `ZodError.errors` undefined | Zod v3 pakai `.issues` | `.issues[0]?.message` | ✅ |
| 5 | Kolom DB snake_case mismatch | Migration rename 9 kolom | DB `displayname` bukan `display_name` | ✅ |
| 6 | Riu hilang dari soraku.users | Migration Sora reset tabel | Re-insert manual dari auth.users | ✅ |
| 7 | OAuth `bad_oauth_state` | PKCE cookie ke response yang salah | `pendingCookies[]` pattern | ✅ |
| 8 | Profile GET return 500 | adminDb() gagal (ENV kosong) | Fallback ke session + `_fallback:true` | ✅ |
| 9 | Logout tidak berfungsi | signout tidak tulis cookie ke response | `createServerClient` + clear `sb-*` | ✅ |
| 10 | Logout tidak auto refresh | `router.push` tidak reset JS state | Ganti ke `window.location.href = "/"` | ✅ |
| 11 | DB duplikat policies/triggers/fn | Multiple sesi migrasi tumpang tindih | Migration cleanup `20260312_fix_sync_cleanup_all` | ✅ |
| 12 | `DbEvent` tidak ada `status` | Types belum sync dengan kolom DB | Tambah `EventStatus` + field `status` | ✅ |
| 13 | `DbNotification` tidak ada | Interface belum dibuat | Tambah `DbNotification` + `NotifType` | ✅ |
| 14 | Shared response constants | NextResponse body single-use stream | Ganti constants ke functions `SERVER_ERROR()` | ✅ |

---

## Log Revisi

| # | Tanggal | Revisi | Oleh |
|---|---------|--------|------|
| 1 | 2026-03-10 | Project reset → v0.0.1 | Riu |
| 2 | 2026-03-10 | Schema `public` → `soraku` | Sora |
| 3 | 2026-03-10 | `middleware.ts` → `proxy.ts` | Sora/Kaizo |
| 4 | 2026-03-11 | v0.7.0 — Real DB di 8 pages | Kaizo |
| 5 | 2026-03-11 | v0.9.0 → v1.0 — Redesign + Auth | Bubu |
| 6 | 2026-03-11 | v1.0.1 — Edit forms, Realtime, Notif | Sora |
| 7 | 2026-03-11 | Auth bugs: OAuth, logout, profile 500 | Kaizo |
| 8 | 2026-03-11 | Homepage real data + navbar restructure | Bubu |
| 9 | 2026-03-12 | DB sync fix — cleanup duplikat + types | Kaizo |
| 10 | 2026-03-12 | Logout hard-refresh fix | Kaizo |
| 11 | 2026-03-12 | .env.example lengkap di apps/web/ | Kaizo |


---

## 📋 LAPORAN — 2026-03-12 #4 (Bubu — commit 624caa4)

### ✅ Fix yang dikerjakan

**1. PGRST106 — Schema `soraku` tidak ter-expose ke PostgREST**
- Root cause: Supabase PostgREST default hanya expose schema `public`
- Fix: `ALTER ROLE authenticator SET pgrst.db_schemas TO 'public, soraku'` + `NOTIFY pgrst`
- Dikonfirmasi lewat `pg_roles`: `pgrst.db_schemas=public, soraku` sudah aktif
- Efek: `/api/profile`, `/api/notifications`, semua route pakai `adminDb()` → sudah bisa query

**2. OAuth error di homepage (bad_oauth_callback)**
- Supabase redirect `/?error=invalid_request&error_code=bad_oauth_callback` ke Site URL
- Fix di `proxy.ts`: deteksi `?error=` / `?error_code=` di pathname `/` → redirect ke `/login?error=...`
- Fix di `login/page.tsx`: baca `?error=` dari searchParams, tampilkan pesan ramah ke user

**3. tsconfig.json**
- Exclude `commitlint.config.ts` dari TypeScript build (Fix `Cannot find module '@commitlint/types'`)

---

### ❌ SORA — Perlu Action (URGENT)

**Supabase Auth Config** (root cause `bad_oauth_callback`):
1. **Site URL** → harus: `https://soraku.vercel.app`
2. **Redirect URLs** → tambahkan: `https://soraku.vercel.app/**`

Lokasi: Supabase Dashboard → Authentication → URL Configuration

Kalau belum di-set, PKCE state tidak tersimpan → OAuth selalu gagal.

**Bot Invite URL** (beda concern dari login):
URL yang beredar:
```
https://discord.com/oauth2/authorize?...&redirect_uri=https://jrgknsxqwuygcoocnnnb.supabase.co/auth/v1/callback
```
Ini seharusnya redirect ke Railway bot endpoint, BUKAN ke Supabase callback.
Koordinasi dengan Kaizo untuk pisahkan URL bot invite dari URL login user.


---

## 📋 LAPORAN — 2026-03-17 #5 (Bubu — commit 8501288)

### ✅ Fitur: Pendaftaran Event ML

**DB (sudah applied):**
- `soraku.events` → `registrationurl TEXT`, `discordchannelid TEXT`
- Tabel baru `soraku.eventregistrations`: teamname, teamlogourl, activeplayers (jsonb), reserveplayers (jsonb), contactname, contactdiscord, status, notes

**API:**
- `GET/POST /api/events/[slug]` — public
- `POST /api/events/[slug]/register` — daftar tim
- `GET  /api/events/[slug]/register` — admin: list pendaftar

**Pages:**
- `/events/[slug]/daftar` — form 3 langkah (info tim → pemain → konfirmasi)
- `/events/[slug]` — tombol "Daftar Sekarang" baru

### ❌ SORA — Perlu Dikerjakan

**1. ENV Vercel — wajib set:**
```
DISCORD_EVENT_WEBHOOK_URL = https://discord.com/api/webhooks/CHANNEL_ID/TOKEN
```
Buat webhook di: Server Discord `1116971049045729302` → channel yang diinginkan → Edit Channel → Integrations → Webhooks → New Webhook → Copy URL

**2. Admin list pendaftaran** — belum ada UI untuk lihat daftar tim yang masuk.
Bubu bisa bantu buat kalau ada waktu, atau Sora buat sendiri via:
`GET /api/events/[slug]/register` (perlu session staff).

**3. Approve/Reject pendaftaran** — `status` kolom sudah ada, API belum.
Perlu `PATCH /api/events/[slug]/register/[id]` untuk update status.
