# Changelog - Soraku Web (Web Komunitas)

All notable changes to this project will be documented in this file.

## [v1.6.5] - 13 April 2026

### Added

- Cookie Consent Popup dengan opsi (Accept All / Customize / Only Necessary)
- Simplified homepage design: Hero + Features + CTA sections
- Fallback images untuk Blog & Event cards dari Dribbble:
  - Blog: `https://cdn.dribbble.com/userupload/25695983/file/original-0f88b9cf84315de3c021720b318e8279.png`
  - Event: `https://cdn.dribbble.com/userupload/10296709/file/original-0e04efb308e6970fce37f47f67bf5484.png`
- Dummy data placeholders untuk Events dan Blogs saat database kosong

### Changed

- Reverted ke Next.js 15.x karena turbopack build issues dengan monorepo
- Package updates ke versi latest:
  - @hookform/resolvers: 3.10.0 → 5.2.2
  - @types/node: 22.19.17 → 25.6.0
  - drizzle-kit: 0.18.1 → 0.31.10
  - eslint: 9.39.4 → 10.2.0
  - lucide-react: 0.513.0 → 1.8.0
  - react-hook-form: 7.72.1 → 7.56.1
  - typescript: 5.9.3 → 6.0.2
  - zod: 3.25.76 → 4.3.6
  - @supabase/ssr: 0.6.1 → 0.10.2
- Blog & Event cards menggunakan GlassCard glassmorphism style
- Navbar export default fixed

### Removed

- Teks "Belajar, Berkarya, Bersama" dari hero section
- Efek blur/gradasi hitam pada mascot di hero
- Referensi ke karakteranime images (folder kosong)

### Fixed

- Missing export default di Navbar component
- Missing @soraku/ui package.json untuk workspace
- Icon imports (Instagram/Twitter/Youtube → custom-icons)

---

## [v1.6.4] - 12 April 2026

### Added

- Homepage redesign dengan 10 sections (anime studio style)
- Navbar dengan "Konten" dropdown (Blog, VTuber, Gallery)
- Zustand store untuk user state personalization

---

## [v1.6.3] - 11 April 2026

### Added

- API endpoint `/api/home` untuk homepage data
- Personalization system (guest/new_user/active_user detection)

---

## [v1.6.2] - 10 April 2026

### Added

- Navbar user avatar dropdown (Profile, Dashboard, Settings, Logout)
- Updated navbar dengan Konten dropdown menu

---

## [v1.6.1] - 9 April 2026

### Fixed

- Navbar structure dengan Blog, VTuber, Gallery grouped into "Konten" dropdown

---

## [v1.6.0] - 7 April 2026

### Added

- **Admin Dashboard v2**: New pages for Analytics, Premium, Billing, Bot Control, and Settings
- **Analytics Page** (`/admin/analytics`): Period selection (7/30/90 days), top pages, visitor stats
- **Billing Page** (`/admin/billing`): Paddle subscription integration with Free/Pro/Premium plans
- **Premium Page** (`/admin/premium`): Benefits overview and plan comparison table
- **Bot Control Page** (`/admin/bot`): Status, stats, modules toggle (Music, Moderation, Auto Replies, Level System)
- **Settings Page** (`/admin/settings`): Profile editing (display name, avatar), account info
- **New Navigation Items**: Analytics, Premium, Billing, Bot, Settings in admin sidebar

### Updated

- **Contact Emails**:
  - contact@soraku.id (Contact Center - sponsor, partner, umum)
  - admin@soraku.id (Admin Center - OTP, teknis)
- **Footer**: Uses `CONTACT_EMAILS.contact` instead of `CONTACT_EMAILS.general`
- **Pages Updated**: License, TOS, Privacy, Contact pages now use new email addresses
- **SECURITY.md**: Security contact updated to admin@soraku.id

### Removed

- Navigation items from admin sidebar: (old layout)

---

## [v1.5.1] - 30 Maret 2026

### Added

- Admin Webhook management panel
- Privacy Policy page (10 sections)
- Terms of Service page (12 sections)
- License page with Soraku Community Source License v1.0
- Partnership & Sponsorship admin page
- Feedback page (/feedback)
- Contact page (/contact)
- Auto-notifications for blog publication

### Fixed

- TikTok analytics API error handling
- Webhook column fix (label, category)
- Upstash Redis graceful skip
- Various UI fixes and improvements

---

## [v1.5.0] - 21 Maret 2026

### Added

- Redis + Realtime integration for push notifications
- Complete homepage redesign
- Admin panel redesign with metrics

---

## [v1.0.0] - 8 Maret 2026

### Added

- Public release: Login, Register, Discord OAuth, Google OAuth
- Public/private profiles with roles, XP, levels
- Blog system with comments, likes, shares
- Event registration system
- Admin panel: Blog, Event, Gallery, Users
- Music player with React Context

---

_v1.5.0 - present_
