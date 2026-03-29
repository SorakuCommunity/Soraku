# Database Migration & Architecture — Soraku Monorepo
> Dibuat oleh: Kaizo (Back-end)
> Last updated: 2026-03-12

---

## Arsitektur Monorepo

```
SorakuCommunity/Soraku/
├── apps/
│   ├── web/        → Soraku Komunitas (community site, auth, admin, donate)
│   ├── stream/     → Anime Streaming Web
│   └── mobile/     → Mobile App (React Native / Expo)
├── services/
│   ├── api/        → ★ CENTRAL API — satu-satunya yang akses DB langsung
│   └── bot/        → Discord Bot (Railway)
└── packages/
    ├── types/      → @soraku/types  — shared TypeScript interfaces
    ├── utils/      → @soraku/utils  — shared API client
    ├── ui/         → @soraku/ui     — shared components
    └── config/     → shared eslint, tsconfig
```

---

## Prinsip Utama — Satu Otak, Semua Terhubung

```
┌─────────────────────────────────────────────────┐
│                 services/api                    │
│         (Central API — satu-satunya             │
│          yang boleh akses DB Supabase)          │
└──────────────┬────────────────┬─────────────────┘
               │  fetch via     │
    ┌──────────┴─────┐   ┌──────┴──────────┐
    │   apps/web     │   │  apps/stream    │
    │  (komunitas)   │   │  (anime web)    │
    └────────────────┘   └─────────────────┘
               │                │
    ┌──────────┴─────┐   ┌──────┴──────────┐
    │  apps/mobile   │   │  services/bot   │
    │  (React Native)│   │  (Discord)      │
    └────────────────┘   └─────────────────┘

Semua pakai @soraku/utils → createApiClient()
Semua types dari @soraku/types
```

**Yang HANYA ada di `apps/web`** (tidak dipindah ke services/api):
- `/api/auth/*` — Supabase Auth OAuth flow (Discord, Google, login, register)
- `/api/admin/*` — Admin CRUD (create/update posts, events, gallery review)
- `/api/gallery/upload` — Upload file ke Supabase Storage
- `/api/notifications` — Notifikasi real-time user
- `/api/bot/*` — Incoming webhook dari Discord bot
- `/api/discord/*` — Discord role sync

---

## Cara Koneksi — Pakai `@soraku/utils`

Semua apps sudah punya file `src/lib/api-client.ts`. Tinggal import dan pakai:

### apps/web (Server Component)
```ts
import { api, apiWithToken } from "@/lib/api-client"

// Data publik — tanpa auth
const { data: posts } = await api.blog.list({ tag: "anime", page: 1 })
const { data: events } = await api.events.list({ status: "online" })
const { data: vtubers } = await api.vtubers.list()

// Data premium — dengan JWT user
const token = (await supabase.auth.getSession()).data.session?.access_token
const { data: stream } = await apiWithToken(token).stream.get(slug)
```

### apps/stream (Server Component)
```ts
import { api, apiWithToken } from "@/lib/api-client"

// List konten VOD
const { data: list } = await api.stream.list({ type: "vod" })

// Detail konten + HLS URL untuk player
const { data: content } = await api.stream.get(slug)
// content.hlsurl → feed ke HLS.js
// content.thumbnailurl → poster image
// content.ispremium → premium gate
```

### apps/mobile (React Native)
```ts
import { api, apiWithToken } from "@/lib/api-client"

// Sama persis dengan web — cukup ganti BASE URL di env
const { data: events } = await api.events.list()

// Setelah user login dengan Supabase di mobile:
const session = await supabase.auth.getSession()
const client  = apiWithToken(session.data.session?.access_token ?? "")
const { data: premium } = await client.premium.status()
```

### services/bot (Discord Bot)
```ts
import { api } from "@/lib/api-client"

// Bot pakai API Key (bukan JWT)
// BOT_API_KEY sudah di-set di .env Railway
const { data: events } = await api.events.list({ status: "online" })
const { data: vtuber } = await api.vtubers.get("nama-slug")
```

---

## ENV yang Diperlukan per App

### apps/web
```
API_URL = https://soraku-api.vercel.app    ← URL services/api setelah deploy
# (development: http://localhost:4000)
```

### apps/stream
```
API_URL = https://soraku-api.vercel.app
NEXT_PUBLIC_API_URL = https://soraku-api.vercel.app  ← kalau butuh di client
```

### apps/mobile
```
EXPO_PUBLIC_API_URL = https://soraku-api.vercel.app
```

### services/bot
```
SORAKU_API_URL     = https://soraku-api.vercel.app
BOT_API_KEY        = bot_xxxxxxxxxxxx   ← generate + simpan hash di DB
SORAKU_API_SECRET  = xxxxxxxxxxxx       ← sama dengan apps/web
```

---

## Cara Generate API Key untuk Bot

```bash
node -e "
const crypto = require('crypto');
const key  = 'bot_' + crypto.randomBytes(32).toString('hex');
const hash = crypto.createHash('sha256').update(key).digest('hex');
console.log('KEY  (→ BOT_API_KEY di Railway):', key);
console.log('HASH (→ simpan ke DB):', hash);
"
```

Simpan HASH ke `soraku.apikeys`:
```sql
INSERT INTO soraku.apikeys (name, keyhash, prefix, client, permissions)
VALUES (
  'Discord Bot',
  '<HASH dari command di atas>',
  LEFT('<KEY>', 8),
  'bot',
  '["read"]'
);
```

---

## Migration History

| # | File | Tanggal | Isi | Status |
|---|------|---------|-----|--------|
| 1 | `20260310_init.sql` | 2026-03-10 | Schema awal — users, posts, events, gallery, vtubers | ✅ Applied |
| 2 | `20260311_follows.sql` | 2026-03-11 | Tabel follows, rename kolom ke tanpa underscore | ✅ Applied |
| 3 | `20260311_notifications.sql` | 2026-03-11 | Notifications, supporter history, discord mappings | ✅ Applied |
| 4 | `20260312_fix_sync_cleanup_all.sql` | 2026-03-12 | Cleanup duplikat functions/triggers/policies | ✅ Applied |
| 5 | `20260312_services_api_setup.sql` | 2026-03-12 | Tabel `streamcontent` + `apikeys` | ✅ Applied |

---

## DB Schema Aktif — `soraku.*`

### Naming Convention
Semua kolom **lowercase tanpa underscore**: `displayname`, `avatarurl`, `createdat`

### Tabel & Consumer

| Tabel | Consumer |
|-------|---------|
| `users` | semua |
| `posts` | web, bot |
| `events` | web, stream, mobile, bot |
| `gallery` | web, mobile |
| `vtubers` | web, stream, mobile |
| `streamcontent` | stream, mobile |
| `donatur` | web, mobile |
| `notifications` | web, mobile |
| `supporterhistory` | web, bot |
| `discordrolemappings` | bot |
| `apikeys` | services/api |
| `musictracks` | web |
| `partnerships` | web |
| `userlevels` | web |
| `userbadges` | web |

---

## Cara Tambah Migration Baru

1. Buat file: `supabase/migrations/YYYYMMDD_nama.sql`
2. Gunakan `ALTER TABLE ADD COLUMN IF NOT EXISTS`
3. Selalu tambah RLS + policy
4. Track di `soraku._migrations`
5. **Koordinasi dengan Kaizo sebelum apply**

---

## Tugas Sora (Full Stack)

### 1. Tambah `API_URL` ke `apps/web/src/env/index.ts`
```ts
server: {
  API_URL: z.string().url().default("http://localhost:4000"),
  // ...existing
}
```

### 2. Update pages apps/web — ganti `adminDb()` langsung ke `api.*`
Semua Server Component yang fetch data publik (blog, events, vtubers, gallery):
```ts
// ❌ Sebelum
import { adminDb } from "@/lib/supabase/admin"
const { data } = await adminDb().from("posts").select("*").eq("ispublished", true)

// ✅ Sekarang
import { api } from "@/lib/api-client"
const { data } = await api.blog.list()
```

### 3. Setup `apps/stream`
Struktur minimal yang dibutuhkan:
```
apps/stream/src/app/
├── page.tsx              → list anime/VTuber stream
├── watch/[slug]/page.tsx → HLS video player
└── layout.tsx
```

### 4. Deploy `services/api` ke Vercel sebagai project terpisah
- Root Directory: `services/api`
- URL hasil deploy → isi `API_URL` di semua apps

---

## Tugas Bubu (Front-end)

### 1. `apps/web` — Halaman yang perlu update setelah routes dihapus
Semua halaman yang sebelumnya fetch ke `/api/blog`, `/api/events`, dll
sekarang otomatis dapat data dari `api.*` client (Sora yang update Server Component-nya).
Bubu cukup pastikan UI masih berfungsi normal.

### 2. `apps/stream` — Komponen yang dibutuhkan

**StreamCard** (untuk list halaman):
```tsx
interface StreamCardProps {
  title:        string
  thumbnail:    string | null   // content.thumbnailurl
  duration:     number | null   // detik → format ke "24:15"
  type:         "vod" | "live" | "clip"
  isPremium:    boolean         // tampilkan crown badge 👑
  slug:         string
}
```

**VideoPlayer** (untuk `/watch/[slug]`):
```tsx
// content.hlsurl → feed ke HLS.js
// Kalau HLS.js tidak support → fallback ke <video src={hlsurl}>
import Hls from "hls.js"
```

**PremiumGate** (overlay kalau belum subscribe):
```tsx
// content.ispremium === true && !user.isSubscriber
// Tampilkan blur overlay + tombol "Upgrade ke Supporter"
// Link ke apps/web/premium
```

### 3. `apps/mobile` — nanti (React Native / Expo)
Types dan API client sudah siap — tinggal bangun UI-nya.

---

## Bot Schema — `bot.*`

Migration applied: `20260314_bot_schema_setup` ✅

Schema `bot` terpisah dari `soraku` — pakai Supabase service role key langsung dari bot.

| Tabel | Deskripsi |
|-------|-----------|
| `bot.bot_guilds` | Setting per server (prefix, embed color, log channel) |
| `bot.bot_antinuke` | Konfigurasi antinuke per server |
| `bot.bot_antilink` | Konfigurasi antilink per server |
| `bot.bot_antispam` | Konfigurasi antispam + threshold |
| `bot.bot_autorole` | Role otomatis saat member join |
| `bot.bot_autorespond` | Trigger → response otomatis |
| `bot.bot_autoreact` | Keyword → emoji react otomatis |
| `bot.bot_welcome` | Konfigurasi welcome message |
| `bot.bot_afk` | Status AFK per user per server |
| `bot.bot_playlists` | Playlist musik per user |
| `bot.bot_247` | Konfigurasi 24/7 music per server |
| `bot.bot_roles` | Setup role hierarchy per server |
| `bot.bot_blacklist` | User yang di-blacklist dari bot |
| `bot.bot_noprefix` | User dengan akses tanpa prefix |
| `bot.bot_ignorechan` | Channel yang diabaikan prefix bot |
| `bot.bot_snipe` | Cache pesan terakhir yang dihapus |

> Bot tidak butuh RLS — akses langsung pakai `SUPABASE_SERVICE_KEY`.

---

## Bot ↔ Web — Webhook Flow

```
apps/web  ──────────────────→  services/bot
          POST /webhook/notify          (kirim DM ke user Discord)
          POST /webhook/role-sync       (assign role Discord)
          POST /webhook/event-announce  (announce event ke channel)
          Header: x-soraku-secret: <BOT_WEBHOOK_SECRET>

services/bot  ──────────────→  apps/web
          POST /api/discord/role-sync   (sync tier dari Discord roles)
          Header: x-soraku-secret: <SORAKU_API_SECRET>
```

### ENV yang harus sama antara web dan bot

| apps/web (Vercel) | services/bot (Railway) |
|-------------------|------------------------|
| `SORAKU_API_SECRET` | `SORAKU_API_SECRET` |
| `BOT_WEBHOOK_SECRET` | `WEBHOOK` |
| `BOT_WEBHOOK_URL` | ← URL Railway bot |

---

## ENV Railway — services/bot

| Key | Keterangan |
|-----|-----------|
| `TOKEN` | Discord Dev Portal → Bot → Reset Token |
| `CLIENT_ID` | Discord Dev Portal → Application ID |
| `GUILD_ID` | ID server Discord Soraku |
| `CHANNEL_ID` | ID channel announce event |
| `SUPABASE_URL` | `https://jrgknsxqwuygcoocnnnb.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Supabase → Settings → API → service_role |
| `SORAKU_WEB_URL` | `https://www.soraku.id` |
| `SORAKU_API_SECRET` | Harus sama dengan apps/web |
| `WEBHOOK` | Harus sama dengan `BOT_WEBHOOK_SECRET` di apps/web |
| `BOT_PREFIX` | `!` (default) |
| `OWNER_ID` | `1020644780075659356` |
| `ROLE_DONATUR` | `1436534227708543046` |
| `ROLE_VIP` | `1447194092965728307` |
| `ROLE_VVIP` | `1447194196401459320` |
| `LAVA_URL` | `lava-v4.ajieblogs.eu.org:443` |
| `LAVA_AUTH` | `https://dsc.gg/ajidevserver` |
| `LAVA_SECURE` | `true` |

> Setelah set ENV di Railway → Redeploy → cek `https://soraku.up.railway.app/status`
