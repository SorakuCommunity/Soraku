# SorakuBot — Setup Manual
> Untuk Riu / Kaizo · Updated: 2026-03-13

---

## ✅ Yang sudah berjalan
- Build Docker di Railway: **SUCCESS**
- Deploy: **SUCCESS**
- Domain Railway: `soraku.up.railway.app`

---

## ⚠️ Kenapa bot belum online?

Bot deploy berhasil tapi **belum online** karena Railway health check gagal.
**Root cause:** endpoint `/health` kena auth middleware → Railway anggap service unhealthy → terus restart.

**Sudah di-fix di commit terbaru** — health check sekarang bebas auth.

---

## 🔧 Setup Manual yang perlu Riu/Kaizo lakukan

### 1. Aktifkan Privileged Intents (WAJIB)
Tanpa ini, bot tidak bisa baca member list dan presence.

1. Buka [Discord Developer Portal](https://discord.com/developers/applications)
2. Pilih aplikasi **Soraku** (Soraku#0289)
3. Menu kiri → **Bot**
4. Scroll ke **Privileged Gateway Intents**
5. Aktifkan:
   - ✅ **Server Members Intent**
   - ✅ **Presence Intent**
   - ✅ **Message Content Intent**
6. Klik **Save Changes**

> Tanpa langkah ini, bot akan crash saat start dengan error `DisallowedIntents`.

---

### 2. Tambah ENV di Railway yang belum ada

Buka Railway → project Soraku → **Variables** → tambah:

| Key | Value | Keterangan |
|-----|-------|------------|
| `CLIENT_ID` | `(Application ID dari Dev Portal)` | Bukan Bot Token! Lihat di "General Information" |
| `DISCORD_EVENT_CHANNEL_ID` | `(ID channel #event atau #announcement)` | Untuk announce event otomatis |
| `ROLE_DONATUR` | `1436534227708543046` | ID role Discord Donatur |
| `ROLE_VIP` | `1447194092965728307` | ID role Discord VIP |
| `ROLE_VVIP` | `1447194196401459320` | ID role Discord VVIP |

> **CLIENT_ID** ada di Discord Dev Portal → aplikasi Soraku → General Information → **Application ID**

---

### 3. Cara dapat CLIENT_ID
1. [Discord Developer Portal](https://discord.com/developers/applications)
2. Pilih aplikasi Soraku
3. **General Information** → copy **Application ID**
4. Paste ke Railway ENV sebagai `CLIENT_ID`

---

### 4. Invite Bot ke Server (kalau belum)
Kalau bot belum di server, generate invite URL:

```
https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID_DISINI&permissions=8&scope=bot%20applications.commands
```

Ganti `CLIENT_ID_DISINI` dengan Application ID dari langkah 3.

Permission `8` = Administrator (bisa dikurangi sesuai kebutuhan).

---

### 5. Verifikasi bot online
Setelah Railway redeploy berhasil:
```bash
curl https://soraku.up.railway.app/health
# Expected: {"status":"ok","bot":"online","uptime":123}
```

---

## 📋 Checklist Deploy Bot

- [x] Build TypeScript berhasil
- [x] Deploy Railway berhasil  
- [ ] Privileged Intents diaktifkan di Dev Portal
- [ ] `CLIENT_ID` ditambah ke Railway ENV
- [ ] `DISCORD_EVENT_CHANNEL_ID` ditambah (opsional, untuk announce)
- [ ] Bot online (cek di `/health`)
- [ ] Slash commands muncul di server Discord
