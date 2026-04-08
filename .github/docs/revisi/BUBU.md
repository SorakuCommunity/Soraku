# Revisi untuk Bubu — Front-end
> Updated: 2026-03-13

---

## ✅ API sudah online

`services/api` sudah deploy. Bubu sekarang bisa pakai `api.*` client
di semua halaman public apps/web untuk fetch data.

**Base URL:** `https://apisoraku-git-master-soraku.vercel.app`

---

## 🔧 Yang perlu Bubu lakukan

### 1. Import pattern yang benar

```ts
// Di Server Component (page.tsx) — RECOMMENDED
import { api } from "@/lib/api-client"

// Fetch data publik
const { data: posts }   = await api.blog.list({ page: 1, limit: 9 })
const { data: events }  = await api.events.list({ status: "online" })
const { data: vtubers } = await api.vtubers.list()
const { data: gallery } = await api.gallery.list({ tag: "fanart" })

// Dengan auth user (untuk premium content)
import { apiWithToken } from "@/lib/api-client"
const { data: status } = await apiWithToken(userToken).premium.status()
```

### 2. Halaman yang perlu di-update (ganti adminDb() → api.*)

| Halaman | Action |
|---------|--------|
| `app/(public)/page.tsx` | `api.events.list()` + `api.blog.list()` |
| `app/(public)/blog/page.tsx` | `api.blog.list()` |
| `app/(public)/events/page.tsx` | `api.events.list()` |
| `app/(public)/gallery/page.tsx` | `api.gallery.list()` |
| `app/(public)/vtubers/page.tsx` | `api.vtubers.list()` |

### 3. Anime Search component (untuk apps/stream nanti)

API sudah support search anime:
```ts
// Cari anime dari HiAnime
const { data } = await api.anime.search("naruto", "hianime")

// Stream episode — dapat HLS URL
const { data: stream } = await api.anime.episode(episodeId, "hianime")
// stream.streams[0].url → feed ke HLS.js player
// stream.subtitles → subtitle tracks
// stream.intro → skip intro timestamp
```

Sources yang tersedia:
- `gogoanime` — Sub English
- `hianime` — Sub English
- `animekai` — Sub English
- `anibaru` — Sub Indonesia

### 4. Response shape

```ts
// Semua response berbentuk:
{ data: T | null, error: string | null }

// Error handling:
const { data, error } = await api.blog.list()
if (error) return <ErrorState message={error} />
```

### 5. Yang TIDAK perlu diubah
- `apps/web/src/app/api/*` — auth, admin, gallery upload → tetap di web
- Semua UI component — tidak ada perubahan
- CSS / Tailwind — tidak ada perubahan

---

## 📋 Pending tasks (dari Sora)
1. ❌ Homepage redesign
2. ❌ Navbar restructure
3. ❌ Utility pages (requirements, privacy, tos, feedback, license)
4. ❌ Admin partnerships CRUD
