# Soraku v1.0.a3 — Setup Guide

## Prerequisites
- Node.js 20+
- Supabase project
- Redis instance (optional but recommended)

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

### 3. Setup database
Run the single schema file in Supabase SQL Editor:
```
lib/schema.sql
```
This is the **only** database file you need. It contains:
- All tables (users, gallery, blog_posts, events, vtubers, site_settings, etc.)
- RLS policies (production-grade)
- Helper functions (`has_role`, `check_social_limit`)
- Triggers (auto-slug, updated_at, premium enforcement)
- Default site_settings data

### 4. Configure Supabase Auth
In Supabase Dashboard → Authentication → Providers, enable:
- **Discord** (recommended) — add Client ID + Secret
- **Google** — add Client ID + Secret
- **GitHub** — add Client ID + Secret
- **Spotify** (optional)

Set redirect URL: `https://your-domain.com/auth/callback`

### 5. Create Storage Bucket
In Supabase Dashboard → Storage:
1. Create bucket named `gallery` (set to Public)
2. Run storage policies from the bottom of `lib/schema.sql`

### 6. Run development server
```bash
npm run dev
```

### 7. Deploy to Vercel
```bash
# Push to GitHub, connect repo to Vercel
# Set env vars in Vercel dashboard
```

## Role Hierarchy

| Role    | Level | Permissions |
|---------|-------|-------------|
| OWNER   | 7     | Full access, assign all roles, toggle maintenance |
| MANAGER | 6     | Manage roles, events, vtubers |
| ADMIN   | 5     | Blog, gallery moderation, users, settings |
| AGENSI  | 4     | VTuber management (insert/update) |
| PREMIUM | 3     | Unlimited social links, premium features |
| DONATE  | 2     | Donatur badge |
| USER    | 1     | Member, max 2 social links |

## Premium Enforcement
- Social link limit (max 2) is enforced at DB layer via trigger `check_social_limit()`
- Cannot be bypassed from client-side

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Service role (server-only) |
| `REDIS_URL` | Recommended | Redis for caching + rate limiting |
| `DISCORD_BOT_TOKEN` | Optional | Discord stats |
| `DISCORD_SERVER_ID` | Optional | Discord server ID |
| `GITHUB_TOKEN` | Optional | GitHub Discussions |
| `SPOTIFY_CLIENT_ID` | Optional | Spotify lofi player |
| `SPOTIFY_CLIENT_SECRET` | Optional | Spotify API |
| `SPOTIFY_REFRESH_TOKEN` | Optional | Spotify token refresh |
