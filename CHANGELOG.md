# Soraku — Changelog

---

## v1.0.a2.10 — Role System Fix & Next.js Security Patch (February 2026)

### 🔴 Critical Fix — Build Error
- **Fixed `lib/roles.ts`**: Import `Role` dari `@/types` → `UserRole` dari `@/types`
  - Error: `Type error: Module '"@/types"' has no exported member 'Role'`
  - Penyebab: `lib/roles.ts` ditulis dengan tipe `Role` yang tidak pernah didefinisikan
    di `types/index.ts`. Seluruh codebase menggunakan `UserRole`.
  - Fix: Rewrite penuh `lib/roles.ts` — align dengan `UserRole` yang sudah ada,
    ganti `SUPERADMIN` → `OWNER` sesuai hierarki aktual di database

### 🔒 Role Hierarchy (Final — selaras dengan database)
```
OWNER   (5) — Akses penuh, toggle maintenance
MANAGER (4) — Kelola roles, events, vtuber
ADMIN   (3) — Blog, gallery moderation, users
AGENSI  (2) — Manajemen vtuber
USER    (1) — Member biasa
```

### ⬆️ Next.js Security Upgrade
- `next@15.4.0` → `15.4.1` — Fix CVE-2025-66478 (vulnerability yang memblokir deploy)
- `eslint-config-next`: `15.4.0` → `15.4.1`

### 📦 Dependency Cleanup
- Hapus `@supabase/auth-helpers-nextjs` (deprecated, sudah digantikan `@supabase/ssr`)
- Tidak ada Clerk dependency tersisa

---

## v1.0.a2.9 — Clerk Removal & Supabase Auth Unification (February 2026)

### 🔴 Critical Fix
- Rewrite total `components/layout/Navbar.tsx` — hapus semua Clerk type references
  yang menyebabkan: `Cannot find module '@clerk/nextjs' or its corresponding type declarations`
- Ganti dengan Supabase `signInWithOAuth` + `onAuthStateChange`

### ✅ Navbar — Supabase Auth
- Avatar dropdown: Profil, Edit Profil, Keluar
- Mobile auth buttons terpisah
- Auto-update state via `onAuthStateChange` listener

---

## v1.0.a2.2 — Security Fix (February 2026)

### 🔴 Critical
- Upgrade `next@15.1.0` → `15.4.0` (fix CVE-2025-66478)
- React `^18.3.1` → `^19.0.0` (align dengan Vercel environment)
- `@types/react` + `@types/react-dom`: `^18` → `^19`

---

## v1.0.a2.1 — Initial Release

- Platform komunitas Soraku: Anime, Manga & Kultur Digital Jepang
- Supabase Auth (Discord OAuth, Google OAuth)
- Gallery system dengan moderasi (pending → approved → public)
- Soraku_Admin panel dengan RBAC
- Blog system + Spotify music player
- Events + Discord webhook notification
- VTuber generasi system
- Middleware route protection (Supabase session)
