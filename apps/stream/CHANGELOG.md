# Changelog - Soraku Stream (Web Streaming Anime)

All notable changes to this project will be documented in this file.

## [v0.1.0] - 7 April 2026

### Core Features (Currently Active)

- **Anime Streaming**: Watch anime with multiple sources (Consumet, AniList, MyAnimeList, Anify, Samehadaku, Otakudesu)
- **Episode Playback**: Video player with HLS support via Vidstack
- **Search**: Advanced search with filters (genre, year, status, type)
- **Discover**: Browse anime by genre, year, season, popularity
- **Schedule**: Daily anime release schedule
- **Manga/Novel**: Reading support for manga and novels
- **User System**: Authentication via NextAuth, favorites, watch history
- **Notifications**: Real-time notifications for new episodes
- **PWA Support**: Installable as web app

### Anime Sources (Scrapers)

1. **Consumet** - Primary anime info source
2. **AniList** - Anime database and metadata
3. **MyAnimeList** - Alternative metadata source
4. **Anify** - Streaming source integration
5. **Samehadaku** - Indonesian anime source (degraded)
6. **Otakudesu** - Indonesian anime source

### Dashboard Features

- Stats: Total anime, episodes, images, active sources, cache size, uptime
- Anime sources status monitoring
- Quick actions: Browse, Schedule, Settings

### Infrastructure

- Next.js 16.2.2 with React 18
- Redis for caching (with maxRetriesPerRequest: 1 fix)
- Supabase for authentication and data
- Tailwind CSS for styling
- Framer Motion for animations
- TypeScript with strict mode

### Technical Notes

- Prisma removed, using Drizzle ORM stub
- Build errors ignored during build (TypeScript/Eslint)
- Custom Navbar and MobileNav components
- NextAuth for authentication
- Vidstack for video playback with HLS.js

---

_v0.1.0 - present_
