# Changelog - Soraku API (Community API Service)

All notable changes to this project will be documented in this file.

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
