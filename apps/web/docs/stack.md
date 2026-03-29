# Soraku Community — Tech Stack

> Dokumen ini ditulis oleh Kaizo (Back-end) untuk Tim Soraku.
> Semua stack di bawah sudah terpasang dan terkonfigurasi di `apps/web/`.

---

## Stack Lengkap

| #   | Tool                      | Versi  | Fungsi                            | Status  |
| --- | ------------------------- | ------ | --------------------------------- | ------- |
| 1   | **Next.js**               | 16.1.6 | Framework utama, App Router       | ✅      |
| 2   | **React**                 | 19.x   | UI library                        | ✅      |
| 3   | **TypeScript**            | 5.x    | Strict mode, type safety          | ✅      |
| 4   | **Tailwind CSS**          | 4.x    | Styling utility-first             | ✅      |
| 5   | **Shadcn/ui**             | latest | Komponen UI (via Radix)           | ✅      |
| 6   | **Drizzle ORM**           | latest | ORM untuk PostgreSQL              | ✅ Baru |
| 7   | **Zod**                   | 4.x    | Schema validation                 | ✅      |
| 8   | **Supabase Auth**         | 2.x    | Authentication + OAuth            | ✅      |
| 9   | **Xendit**                | —      | Payment gateway                   | ✅      |
| 10  | **Trakteer**              | —      | Donasi handler                    | ✅      |
| 11  | **Jest**                  | latest | Unit testing                      | ✅ Baru |
| 12  | **React Testing Library** | latest | Component testing                 | ✅ Baru |
| 13  | **Playwright**            | latest | E2E testing                       | ✅ Baru |
| 14  | **Prettier**              | 3.x    | Code formatter + Tailwind sorting | ✅      |
| 15  | **ESLint**                | 9.x    | Code linting + Tailwind plugin    | ✅      |
| 16  | **Husky**                 | latest | Git hooks                         | ✅ Baru |
| 17  | **Lint-staged**           | latest | Lint file yang di-staged          | ✅ Baru |
| 18  | **Commitlint**            | latest | Lint git commit message           | ✅ Baru |
| 19  | **T3 Env**                | latest | Type-safe environment variables   | ✅ Baru |
| 20  | **next-sitemap**          | latest | Sitemap & robots.txt              | ✅ Baru |
| 21  | **Lucide React**          | latest | Icon library                      | ✅      |
| 22  | **next-themes**           | latest | Dark mode                         | ✅      |
| 23  | **MDX**                   | latest | Markdown + JSX support            | ✅ Baru |
| 24  | **GitHub Actions**        | —      | CI/CD — lint on PR                | ✅ Baru |

---

## Path Alias

```ts
import { foo } from '@/components/foo' // → src/components/foo
import { db } from '@/lib/db' // → src/lib/db
import { env } from '@/env' // → src/env/index.ts
```

---

## Drizzle ORM

Dipakai untuk type-safe query ke PostgreSQL Supabase.
Schema ada di `src/lib/db/schema.ts`.

```ts
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'

const user = await db.query.users.findFirst({
  where: (u, { eq }) => eq(u.id, userId),
})
```

Commands:

```bash
npm run db:generate   # generate migration dari schema
npm run db:push       # push schema ke DB langsung
npm run db:studio     # buka Drizzle Studio (GUI)
```

> **Catatan:** Drizzle dan Supabase client bisa dipakai bersamaan.
> Gunakan `adminDb()` (Supabase) untuk query sederhana,
> Drizzle untuk query kompleks yang butuh type-safety penuh.

---

## T3 Env

ENV vars sekarang type-safe. Import dari `@/env` bukan `process.env`.

```ts
import { env } from '@/env'

const key = env.SUPABASE_SERVICE_ROLE_KEY // ✅ typed + validated
```

Config ada di `src/env/index.ts`.
Tambahkan ENV baru di sana sebelum dipakai di kode.

---

## Testing

```bash
npm test                # unit test sekali
npm run test:watch      # unit test watch mode
npm run test:coverage   # coverage report
npm run test:e2e        # e2e test (butuh server jalan)
npm run test:e2e:ui     # e2e dengan UI Playwright
```

- Unit test: `src/**/__tests__/*.test.tsx`
- E2E test: `e2e/*.spec.ts`

---

## Git Hooks (Husky)

Otomatis jalan setiap commit:

| Hook         | Aksi                                                                |
| ------------ | ------------------------------------------------------------------- |
| `pre-commit` | Jalankan `lint-staged` (ESLint + Prettier pada file yang di-staged) |
| `commit-msg` | Validasi format commit via Commitlint                               |

Format commit yang valid:

```
feat: tambah halaman profile
fix: perbaiki logout tidak berfungsi
docs: update README
chore: install drizzle
```

---

## Sitemap & Robots

Otomatis di-generate setelah `next build` via `next-sitemap`.
Config di `next-sitemap.config.js`.

Halaman yang di-exclude dari sitemap:

- `/dash/*` (private dashboard)
- `/api/*`
- `/login`, `/register`

---

## GitHub Actions

CI berjalan otomatis setiap Pull Request ke `master`:

- Type check (`tsc --noEmit`)
- ESLint
- Prettier check
- Unit tests

Config: `.github/workflows/ci.yml`

---

## Prettier + Tailwind

Prettier sudah dikonfigurasi dengan `prettier-plugin-tailwindcss`.
Class Tailwind otomatis di-sort setiap save / commit.

Config di `apps/web/.prettierrc`.

---

_Kaizo — 2026-03-12_
