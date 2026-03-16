# Revisi untuk Kaizo — Back-end
> Updated: 2026-03-13

---

## ✅ Status services/api

`services/api` sudah deploy ke Vercel. Landing page sudah ada di root `/`.

**Domain:**
- `https://apisoraku-git-master-soraku.vercel.app`
- `https://apisoraku-8jsns0leq-soraku.vercel.app`

---

## 🔧 Yang perlu Kaizo lakukan sekarang

### 1. Assign custom domain (opsional tapi recommended)
Di Vercel project `apisoraku` → Settings → Domains → tambah:
```
api.soraku.vercel.app
```
Atau domain custom kalau ada.

### 2. Set `API_URL` di apps/web di Vercel
Setelah domain final diketahui, update ENV di project `soraku` (apps/web):
```
API_URL = https://apisoraku-git-master-soraku.vercel.app
```

### 3. Run migration `20260313_level_badge_system.sql`
Kalau belum di-run, execute di Supabase SQL Editor:
```
supabase/migrations/20260313_level_badge_system.sql
```
Ini untuk tabel `userlevels` dan `userbadges`.

### 4. Generate + simpan API Key untuk Discord Bot
```bash
node -e "
const crypto = require('crypto');
const key  = 'bot_' + crypto.randomBytes(32).toString('hex');
const hash = crypto.createHash('sha256').update(key).digest('hex');
console.log('KEY  (→ BOT_API_KEY di Railway):', key);
console.log('HASH (→ simpan ke DB):', hash);
"
```

Simpan HASH ke Supabase:
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

Lalu set `BOT_API_KEY=<KEY>` di Railway ENV bot.

### 5. Set Railway ENV untuk bot
```
DISCORD_TOKEN       = (dari Discord Developer Portal)
DISCORD_GUILD_ID    = (ID server Discord Soraku)
SORAKU_API_URL      = https://apisoraku-git-master-soraku.vercel.app
SORAKU_WEB_URL      = https://soraku.vercel.app
SORAKU_API_SECRET   = (sama dengan di apps/web)
WEBHOOK_SECRET      = (sama dengan BOT_WEBHOOK_SECRET di apps/web)
DISCORD_INVITE_CODE = qm3XJvRa6B
BOT_API_KEY         = (dari langkah 4)
```

### 6. Aktifkan Privileged Intents di Discord Developer Portal
Discord Dev Portal → aplikasi bot → **Bot** → Privileged Gateway Intents:
- ✅ Server Members Intent
- ✅ Presence Intent

---

## ⚠️ Yang JANGAN dilakukan
- Jangan pakai Prisma / ioredis / bullmq
- Jangan query DB langsung dari apps/web — semua lewat services/api
- Jangan commit `.env` ke Git


---

## 📋 LAPORAN — 2026-03-17 (Bubu — migration applied)

### 🔴 Bot Railway — Errors dari Log

**Log yang dianalisis:** Railway container log `2026-03-16T17:29:54` s/d `17:55:46`

---

### ✅ Fix yang sudah dikerjakan di DB (migration `20260317_bot_schema_expose_and_consolidate`)

#### 1. Root cause semua error: PGRST205 + `guilds247 is not iterable`

Masalah utama:
```
code: 'PGRST205'
message: "Could not find the table 'bot.users' in the schema cache"
hint: "Perhaps you meant the table 'bot.users'"
```

Schema `bot` belum di-expose ke PostgREST (sama persis seperti `soraku` sebelumnya).

**Fix:**
```sql
ALTER ROLE authenticator SET pgrst.db_schemas TO 'public, soraku, bot';
NOTIFY pgrst, 'reload config';
```

**Dikonfirmasi:**
```
pgrst.db_schemas = public, soraku, bot ✅
```

**Efek berantai yang ikut terperbaiki:**
- `[DB] findAll users` → crash PGRST205 → sekarang OK
- `[DB] findOne invite_settings` → crash PGRST205 → sekarang OK
- `guilds247 is not iterable` → terjadi karena query `music247` return error object (bukan array) → `.map()` crash. Setelah schema exposed, query return array normal → error hilang.

---

#### 2. Konsolidasi tabel duplikat (semua 0 rows — aman)

| Tabel Lama | Status | Tabel Kanonik |
|------------|--------|---------------|
| `bot.guild_premium` | ❌ DROP → VIEW | `bot.premium` |
| `bot.user_premium` | ❌ DROP → VIEW | `bot.premium` |
| `bot.invite_members` | ❌ DROP → VIEW | `bot.invite_data` |
| `bot.member_invites` | ❌ DROP → VIEW | `bot.invite_data` |
| `bot.reminds` | ❌ DROP → VIEW | `bot.reminders` |

Nama tabel lama masih bisa dipakai (VIEW backward-compatible), tapi data tersimpan di tabel kanonik saja.

**Aturan ke depan: jangan buat tabel terpisah untuk hal yang sama.**
- Premium guild/user → pakai kolom `type` di `bot.premium`
- Invite tracking → pakai `bot.invite_data`
- Reminder → pakai `bot.reminders`

---

### ❌ KAIZO — Perlu Action Sekarang

**1. RESTART BOT di Railway** ← URGENT
PostgREST perlu waktu beberapa detik untuk reload config setelah `NOTIFY pgrst`.
Bot perlu restart agar koneksi Supabase client fresh dan tidak pakai cache lama.

**2. Test setelah restart:**
- Cek log Railway — tidak boleh ada lagi `PGRST205` atau `guilds247 is not iterable`
- Test command `/invites` di Discord untuk verify `invite_settings` accessible
- Test `247 mode` di voice channel

**3. (Opsional, bisa nanti) Update kode bot** kalau ada yang masih query `guild_premium`, `user_premium`, `invite_members`, `member_invites`, atau `reminds` secara langsung — seharusnya tetap jalan via VIEW, tapi lebih bersih kalau ganti ke tabel kanonik (`premium`, `invite_data`, `reminders`).

---

### Tabel Bot Final (setelah konsolidasi)

**BASE TABLE (22):** afk, antilink, antinuke, antispam, autoreact, autorespond, autorole, blacklist, guilds, ignorechan, invite_data, invite_ranks, invite_settings, music247, mutes, noprefix, playlists, premium, reminders, roles, snipe, ticket_counters, ticket_data, ticket_panels, tickets, users, warns, welcome

**VIEW (5, backward-compat):** guild_premium, invite_members, member_invites, reminds, user_premium
