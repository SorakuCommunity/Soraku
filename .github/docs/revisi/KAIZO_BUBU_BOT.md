# SorakuBot — Panduan Deploy & Integrasi
> Dari: Sora | Update: 2026-03-14 | Commit terbaru: `6502794`

---

## 🚨 Untuk Kaizo — Checklist agar bot online

### 1. ENV Railway (wajib diisi / update sekarang)

> **Rename ENV lama yang sudah salah nama:**

| Hapus nama lama | Ganti dengan | Isi |
|-----------------|-------------|-----|
| `BOT_TOKEN` / `DISCORD_TOKEN` | **`TOKEN`** | Discord Dev Portal → Bot → Reset Token |
| `DISCORD_GUILD_ID` | **`GUILD_ID`** | ID server Discord Soraku |
| `DISCORD_EVENT_CHANNEL_ID` | **`CHANNEL_ID`** | ID channel untuk announce event |
| `WEBHOOK_SECRET` | **`WEBHOOK`** | Secret webhook dari web |

> **ENV yang sudah benar — tidak perlu diubah:**

| Key | Keterangan |
|-----|-----------|
| `CLIENT_ID` | Application ID dari Discord Dev Portal |
| `SUPABASE_URL` | Format: `https://xxxx.supabase.co` (**wajib ada `https://`**) |
| `SUPABASE_SERVICE_KEY` | Supabase Dashboard → Settings → API → service_role |
| `SORAKU_WEB_URL` | `https://www.soraku.id` |
| `SORAKU_API_SECRET` | Secret internal web ↔ bot |

> **ENV opsional:**

| Key | Value default |
|-----|--------------|
| `BOT_PREFIX` | `!` |
| `OWNER_ID` | `1020644780075659356` |
| `ROLE_DONATUR` | `1436534227708543046` |
| `ROLE_VIP` | `1447194092965728307` |
| `ROLE_VVIP` | `1447194196401459320` |
| `LAVA_URL` | `lava-v4.ajieblogs.eu.org:443` |
| `LAVA_AUTH` | `https://dsc.gg/ajidevserver` |
| `LAVA_SECURE` | `true` |
| `SPOTIFY_ID` / `SPOTIFY_SECRET` | dari Spotify Developer |

---

### 2. Run SQL Migration di Supabase (WAJIB — 1x saja)

Tanpa ini bot crash saat akses database.

```
Supabase Dashboard → SQL Editor → New query
→ paste isi file: services/bot/supabase_migration.sql
→ Run
```

---

### 3. Aktifkan Privileged Intents di Discord Dev Portal (WAJIB)

```
discord.com/developers → aplikasi Soraku → Bot → Privileged Gateway Intents
✅ Server Members Intent
✅ Presence Intent
✅ Message Content Intent
→ Save Changes
```

---

### 4. Verifikasi setelah deploy

Buka di browser:
```
https://soraku.up.railway.app/status
```

Expected (bot siap):
```json
{
  "bot": "🟢 online",
  "env": {
    "TOKEN": "✅ set",
    "CLIENT_ID": "✅ set",
    "GUILD_ID": "✅ set",
    "SUPABASE_URL": "✅ set",
    "SUPABASE_SERVICE_KEY": "✅ set",
    "SORAKU_WEB_URL": "✅ set",
    "WEBHOOK": "✅ set"
  }
}
```

Kalau ada `❌ MISSING` → isi ENV tersebut di Railway → Variables.

---

## 📋 Untuk Bubu — Integrasi Bot ↔ Web

### Webhook dari `apps/web` ke bot

Endpoint bot: `https://soraku.up.railway.app/webhook/...`
Header wajib: `x-soraku-secret: <nilai WEBHOOK di Railway>`

| Endpoint | Method | Fungsi |
|----------|--------|--------|
| `/webhook/notify` | POST | Kirim DM ke user Discord |
| `/webhook/role-sync` | POST | Sync tier supporter → assign role Discord |
| `/webhook/event-announce` | POST | Announce event baru ke channel |

**Contoh role-sync dari web (saat user donasi):**
```json
POST /webhook/role-sync
{ "discordId": "123456789", "tier": "VIP" }
```

### Sinkronisasi otomatis Discord ↔ Supabase

| Trigger di Discord | Efek di `soraku.users` |
|-------------------|----------------------|
| User dapat role DONATUR/VIP/VVIP | `supporterrole` otomatis update |
| `/profile` dipanggil | Ambil data dari `users.discordid` |

### ENV apps/web yang perlu diset agar bot ↔ web tersambung

```
BOT_WEBHOOK_URL    = https://soraku.up.railway.app
BOT_WEBHOOK_SECRET = (sama dengan WEBHOOK di Railway bot)
SORAKU_API_SECRET  = (sama dengan SORAKU_API_SECRET di Railway bot)
```

---

## 📁 Struktur bot (referensi)

```
services/bot/src/
├── Commands/
│   ├── prefix/     — !help, !play, !ban, !antinuke, dll
│   └── slash/      — /link, /profile, /about, /help, /play, dll
├── Events/         — guildMemberAdd, guildMemberUpdate, dll
├── Schema/db.js    — Supabase (pengganti MongoDB)
├── Structures/SorakuClient.js
├── Webhooks/server.js
└── index.js
```

File `.env.example` di `services/bot/` selalu sinkron dengan kode.
