# Changelog - Soraku API (Community API Service)

All notable changes to this project will be documented in this file.

## [v1.0.2] - 9 April 2026

### Added

- **API Docs Endpoint** (`GET /api/docs`): Returns info about the Wotaku-based docs structure located in `services/api/src/app/docs/`

### Note

- The actual docs are in `services/api/src/app/docs/` - a clone of Wotaku wiki
- To deploy docs: `cd services/api/src/app/docs && pnpm docs:build`

## [v1.0.1] - 9 April 2026

### Updated

- **Community Blog API**: Now used by stream app for announcement fetching
- **Endpoints**: More detailed API documentation at `/api` health check

### Note

- This API serves as the backend for Soraku Stream announcements
- Used by: `https://stream.soraku.id` for blog/content data

## [v1.0.0] - 7 April 2026

### Core Features

#### Community Endpoints

- `/api/community/blog` - Blog posts CRUD
- `/api/community/blog/[slug]` - Single blog post
- `/api/community/events` - Events listing
- `/api/community/events/[slug]` - Single event details
- `/api/community/gallery` - Gallery uploads and listing
- `/api/community/vtubers` - VTuber profiles
- `/api/community/vtubers/[slug]` - Single VTuber
- `/api/community/users/[username]` - User profiles

#### Stream Endpoints

- `/api/stream` - Stream anime list
- `/api/stream/[slug]` - Anime details
- `/api/stream/favorites` - User favorites
- `/api/stream/watch-history` - Watch history

#### Donation Endpoints

- `/api/community/donate/trakteer` - Trakteer webhook handler
- `/api/community/donate/xendit/create` - Xendit payment creation
- `/api/community/donate/xendit/webhook` - Xendit webhook handler

#### Premium Endpoints

- `/api/community/premium` - Premium subscription info

### Infrastructure

- Next.js 16.2.2 App Router
- TypeScript with strict mode
- Supabase for authentication (SSR)
- Drizzle ORM for database
- Zod for validation
- Upstash Redis for caching
- CORS configuration via environment variable

### Configuration

- Type-safe environment with @t3-oss/env-nextjs
- CORS headers configurable via CORS_ORIGINS env
- Server external packages: postgres, drizzle-orm

---

_v1.0.0 - present_
