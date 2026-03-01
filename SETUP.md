# Soraku v1.0.a3.3 — Setup Guide

## Prerequisites
- Node.js 20+
- npm 10+
- Supabase project (free tier works)
- Redis instance (optional, recommended for caching)

---

## 1. Clone Repository

```bash
git clone https://github.com/SorakuCommunity/Soraku.git
cd Soraku
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# ── Supabase (required) ───────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ── Redis (optional, recommended) ────────────────────────────
REDIS_URL=redis://localhost:6379

# ── Discord (optional) ────────────────────────────────────────
DISCORD_BOT_TOKEN=your-bot-token
DISCORD_SERVER_ID=your-server-id

# ── GitHub (optional) ─────────────────────────────────────────
GITHUB_TOKEN=your-github-token

# ── Spotify (optional) ────────────────────────────────────────
SPOTIFY_CLIENT_ID=your-client-id
SPOTIFY_CLIENT_SECRET=your-client-secret
SPOTIFY_REFRESH_TOKEN=your-refresh-token
```

---

## 4. Enable Google OAuth Provider

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Create **OAuth 2.0 Client ID** (type: Web application)
3. Add Authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
4. Copy **Client ID** and **Client Secret**
5. In Supabase Dashboard → **Authentication → Providers → Google**:
   - Enable Google
   - Paste Client ID and Client Secret
   - Save

---

## 5. Enable Discord OAuth Provider

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new Application → OAuth2 → General
3. Add Redirect URL: `https://your-project.supabase.co/auth/v1/callback`
4. Copy **Client ID** and **Client Secret**
5. In Supabase Dashboard → **Authentication → Providers → Discord**:
   - Enable Discord
   - Paste Client ID and Client Secret
   - Save

---

## 6. Configure Redirect URLs in Supabase

In Supabase Dashboard → **Authentication → URL Configuration**:

- **Site URL**: `https://your-domain.com`
- **Additional Redirect URLs**:
  ```
  https://your-domain.com/auth/callback
  http://localhost:3000/auth/callback
  ```

> ⚠️ Both production and localhost must be listed for local dev to work.

---

## 7. Apply Database Schema

In Supabase Dashboard → **SQL Editor**, paste the contents of:

```
lib/schema.sql
```

This single file contains:
- All tables: `users`, `gallery`, `blog_posts`, `events`, `vtubers`, `webhook_settings`, `spotify_tokens`, `user_socials`, `site_settings`
- RLS policies (production-grade)
- Helper functions: `has_role()`, `handle_new_user()`
- Triggers: auto-slug, updated_at, premium social limit enforcement
- Indexes: title, likes, created_at for gallery sorting

> Schema is **idempotent** — safe to re-run.

---

## 8. Create Storage Bucket

In Supabase Dashboard → **Storage**:

1. Create bucket named `gallery`
2. Set to **Public**
3. Add storage policies as needed (from schema.sql comments)

---

## 9. Run Development Server

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

Test checklist:
- [ ] App loads without crash
- [ ] Login with email works
- [ ] Login with username works
- [ ] Google OAuth works
- [ ] Discord OAuth works
- [ ] Logout clears session completely
- [ ] Public profile `/u/username` loads
- [ ] Gallery grid = 3 cols on mobile

---

## 10. Build for Production

```bash
# Clear build cache first
rm -rf .next

npm run build
```

Fix any TypeScript or ESLint errors before deploying.

---

## 11. Deploy to Vercel

```bash
# Option A: Git push (recommended)
git push origin main
# Connect repo in Vercel dashboard → Import Project

# Option B: Vercel CLI
npm i -g vercel
vercel --prod
```

In Vercel Dashboard → **Settings → Environment Variables**, add all variables from `.env.local`.

---

## Production Checklist

| Item | Status |
|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` set | ☐ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` set | ☐ |
| `SUPABASE_SERVICE_ROLE_KEY` set | ☐ |
| Google OAuth provider enabled | ☐ |
| Discord OAuth provider enabled | ☐ |
| Redirect URLs configured in Supabase | ☐ |
| `lib/schema.sql` applied | ☐ |
| RLS enabled on all tables | ☐ |
| Storage bucket `gallery` created | ☐ |
| Clean build passes (`npm run build`) | ☐ |
| No console errors in preview | ☐ |
| Logout fully clears session | ☐ |
| Mobile grid = 3 columns verified | ☐ |

---

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

---

## Security Notes

- **Role editing** is blocked in UI — users cannot self-escalate
- **RLS** enforces all data access at the database layer
- **Social link limit** (max 2 for USER) is enforced by DB trigger — cannot be bypassed client-side
- **OAuth user creation** is idempotent — duplicate records are prevented via `ON CONFLICT DO NOTHING`
- All inputs validated with **Zod** before processing
- All user content sanitized with **DOMPurify** before rendering

---

> Questions? Open an issue at [github.com/SorakuCommunity/Soraku](https://github.com/SorakuCommunity/Soraku)
