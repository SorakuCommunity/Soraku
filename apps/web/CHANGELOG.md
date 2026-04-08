# Changelog - Soraku Web (Web Komunitas)

All notable changes to this project will be documented in this file.

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
