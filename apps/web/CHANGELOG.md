# Changelog - Soraku Web

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v1.5.2] - 26 April 2026

### Added
- Updated Soraku identity from "Soraku Community" to "Soraku" reflecting professional positioning
- New identity statement emphasizing community-driven digital platform for anime culture, learning, and creator development
- Positioned as scalable product with future monetization potential, similar to Dicoding/RevoU/Udemy but community-first
- **ALL FEATURES INTEGRATED**:
  - Cookie Consent Popup dengan opsi (Accept All / Customize / Only Necessary)
  - Simplified homepage design: Hero + Features + CTA sections
  - Fallback images untuk Blog & Event cards dari Dribbble
  - Dummy data placeholders untuk Events dan Blogs saat database kosong
  - Homepage redesign dengan 10 sections (anime studio style)
  - Navbar dengan "Konten" dropdown (Blog, VTuber, Gallery)
  - Zustand store untuk user state personalization
  - API endpoint `/api/home` untuk homepage data
  - Personalization system (guest/new_user/active_user detection)
  - Navbar user avatar dropdown (Profile, Dashboard, Settings, Logout)
  - Updated navbar dengan Konten dropdown menu
  - Admin Dashboard v2: New pages for Analytics, Premium, Billing, Bot Control, and Settings
  - Analytics Page: Period selection (7/30/90 days), top pages, visitor stats
  - Billing Page: Paddle subscription integration with Free/Pro/Premium plans
  - Premium Page: Benefits overview and plan comparison table
  - Bot Control Page: Status, stats, modules toggle (Music, Moderation, Auto Replies, Level System)
  - Settings Page: Profile editing (display name, avatar), account info
  - New Navigation Items: Analytics, Premium, Billing, Bot, Settings in admin sidebar
  - Updated Contact Emails: contact@soraku.id (Contact Center), admin@soraku.id (Admin Center)
  - Updated Footer to use CONTACT_EMAILS.contact
  - Updated License, TOS, Privacy, Contact pages with new email addresses
  - Updated SECURITY.md: Security contact updated to admin@soraku.id

### Changed
- Updated all references from "Soraku Community" to "Soraku" throughout codebase:
  - Web application (apps/web/) - layout, metadata, pages, components
  - Discord bot (services/bot/) - package.json, config, commands, events
  - API service (services/api/) - metadata and descriptions
  - Documentation - LICENSE, CHANGELOG.md, stack.md, SECURITY.md
  - Environment variables (.env.example)
  - License file - Soraku Source License v1.0
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
- Icon imports (Instagram/Twitter/Youtube → custom-icons)

### Fixed
- Build errors in tos/page.tsx (JSX syntax)
- Removed empty connects directory causing TypeScript issues
- Fixed remaining "Soraku Community" references in login/page.tsx
- Missing export default di Navbar component
- Missing @soraku/ui package.json untuk workspace
- Teks "Belajar, Berkarya, Bersama" dari hero section
- Efek blur/gradasi hitam pada mascot di hero
- Referensi ke karakteranime images (folder kosong)
- All builds now pass successfully

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
