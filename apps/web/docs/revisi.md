# Revisi & Catatan — apps/web

> From: Kaizo (Back-end)
> Last updated: 2026-03-12

---

## Stack Resmi

Lihat detail di [`apps/web/docs/stack.md`](./stack.md)

| Tool                        | Versi           | Status              |
| --------------------------- | --------------- | ------------------- |
| Next.js                     | 16.x App Router | ✅                  |
| React                       | Latest          | ✅                  |
| TypeScript                  | Latest strict   | ✅                  |
| Tailwind CSS                | 4.x             | ✅                  |
| Shadcn/ui                   | Latest          | ✅                  |
| Drizzle ORM                 | Latest          | ✅ Baru ditambahkan |
| Zod                         | v3              | ✅                  |
| Supabase Auth               | Latest          | ✅                  |
| Xendit + Trakteer           | —               | ✅                  |
| Jest + RTL                  | Latest          | ✅ Baru ditambahkan |
| Playwright                  | Latest          | ✅ Baru ditambahkan |
| Prettier + Tailwind sorting | Latest          | ✅                  |
| ESLint                      | 9.x flat config | ✅                  |
| Husky + lint-staged         | Latest          | ✅                  |
| Commitlint                  | Latest          | ✅                  |
| T3 Env                      | Latest          | ✅ Baru ditambahkan |
| next-sitemap                | Latest          | ✅                  |
| next-themes (dark mode)     | Latest          | ✅                  |
| Lucide Icons                | Latest          | ✅                  |
| MDX                         | Latest          | ✅ Baru ditambahkan |
| GitHub Actions CI           | —               | ✅ Baru ditambahkan |

> **Yang dihapus:** `eslint-plugin-tailwindcss` — tidak support Tailwind v4.
> Class sorting sudah dihandle `prettier-plugin-tailwindcss`.

---

## Build Log — 2026-03-12

Build Vercel berhasil ✅ dengan beberapa warning yang sudah di-fix:

### ✅ Fixed — Husky `.git can't be found`

**Warning:**

```
> @soraku/web@0.0.1 prepare
> husky
.git can't be found
```

**Root cause:** Vercel tidak punya `.git` folder saat install → `husky` error.
**Fix:** Ubah `prepare` script di `package.json`:

```json
"prepare": "husky || true"
```

`|| true` memastikan build tidak gagal meski `.git` tidak ada di Vercel.

---

### ✅ Fixed — `/api/debug-save` masih live

**Issue:** Route debug temporary masih terbuild dan live di production.
**Fix:** Hapus `apps/web/src/app/api/debug-save/route.ts`.

---

### ⚠️ Warning npm deprecated (tidak perlu difix)

Warning ini muncul dari **transitive dependencies** — bukan dari package yang kita install langsung.
Tidak ada action yang diperlukan, akan hilang sendiri saat package upstream update.

```
npm warn deprecated inflight@1.0.6
npm warn deprecated @esbuild-kit/core-utils@3.3.2
npm warn deprecated glob@7.2.3
```

---

### ⚠️ 4 moderate severity vulnerabilities

Dari `npm audit` — dari deps transitive. Bukan dari kode kita.
Jalankan `npm audit` untuk lihat detail. Tidak blocking production.

---

## Catatan Penting untuk Sora

### Drizzle ORM — Cara Pakai

Schema ada di `src/lib/db/schema.ts`, client di `src/lib/db/index.ts`.

```ts
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const user = await db.select().from(users).where(eq(users.id, userId))
```

> **CATATAN:** Sekarang ada dua cara query DB:
>
> - **Supabase client** (`adminDb()`) → sudah dipakai di semua existing API routes
> - **Drizzle** (`db`) → untuk query baru yang lebih kompleks / type-safe
>
> Tidak perlu migrasi semua ke Drizzle sekarang. Gunakan Drizzle untuk route baru saja.

---

### T3 Env — Cara Pakai

ENV vars sekarang type-safe. Import dari `@/env` bukan `process.env`:

```ts
import { env } from '@/env'

env.SUPABASE_SERVICE_ROLE_KEY // ✅ typed + validated
process.env.SUPABASE_SERVICE_ROLE_KEY // ⚠️ masih works tapi tidak type-safe
```

Tambah ENV baru di `src/env/index.ts` sebelum pakai.

---

### Testing

- **Unit test:** `npm test` — Jest + React Testing Library
- **E2E test:** `npm run test:e2e` — Playwright
- Test files: `*.test.ts` / `*.test.tsx` di sebelah komponen, atau `__tests__/`
- E2E files: di folder `e2e/`

---

### Commit Message Format (Commitlint)

Wajib pakai format conventional commits:

```
feat(scope): deskripsi singkat
fix(scope): deskripsi singkat
docs(scope): deskripsi singkat
chore(scope): deskripsi singkat
```

Commitlint akan reject commit yang tidak sesuai format via Husky.

---

## ENV yang Wajib Ada di Vercel

Referensi lengkap di `apps/web/.env.example`.
Yang paling kritis dan belum tentu ada:

| ENV                             | Status                                 |
| ------------------------------- | -------------------------------------- |
| `SUPABASE_SERVICE_ROLE_KEY`     | ⚠️ Pastikan sudah diset di Vercel      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ⚠️ Pastikan sudah diset                |
| `SORAKU_API_SECRET`             | ⚠️ Generate dan set sebelum bot deploy |

---

## Routes yang Ada

Semua route terdokumentasi di `docs/routes/ROUTES.md`.
Namespace rules di `docs/routes/NAMESPACE.md`.

> Jangan buat route di luar namespace yang sudah ditetapkan.
