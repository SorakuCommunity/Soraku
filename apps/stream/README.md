# 1Anime V2

> ⚠️ **Notice: This version is no longer maintained. 1Anime V2 is broken due to unmaintained dependencies (Consumet and Anify) and will receive no further updates or support. Please use V3X for a better, maintained experience (closed source for security reasons).**
>
> - **No Updates**: There will be no further updates or improvements made to this repository.
> - **No Support**: The authors will not provide any support, fixes, or acknowledge any issues found in the code.
> - **Use at Your Own Risk**: Any errors, bugs, or other issues that arise from using this code are your responsibility.
>
> **Project Origins:**  
> 1Anime V2 is largely based on/forked from [@Ani-Moopa/Moopa](https://github.com/Ani-Moopa/Moopa), with core features and architecture heavily inspired by Moopa.

---

<p align="center">
  <a href="https://nodejs.org/"><img alt="Node.js" src="https://img.shields.io/badge/Node.js-20.x-green?style=for-the-badge&logo=node.js"></a>
  <a href="https://nextjs.org/"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js"></a>
  <a href="https://redis.io/"><img alt="Redis" src="https://img.shields.io/badge/Redis-Cache-red?style=for-the-badge&logo=redis"></a>
  <a href="https://www.gnu.org/licenses/gpl-3.0.html"><img alt="License: GPL v3" src="https://img.shields.io/badge/License-GPLv3-blue?style=for-the-badge&logo=gnu"></a>
</p>

---

## Introduction

**1Anime V2** was a full-stack anime and manga streaming platform, aiming to provide a seamless and ad-free viewing experience. It featured:

- **REST API** endpoints for anime/manga streaming, search, trending, schedules, and more.
- **Multi-source streaming** and metadata via [Consumet](https://github.com/consumet/api.consumet.org) and [Anify](https://anify.tv/discord) (both now unmaintained).
- **AniList integration** for tracking, profiles, and lists.
- **SSR Admin dashboard** for stats and cache control.
- **Redis** for aggressive caching and improved performance.
- **Docker/PM2** support for deployment.

> **Warning:** The codebase is heavy, messy, and difficult to maintain. Many core upstream dependencies (Consumet, Anify) are now abandoned, rendering this project unstable or non-functional.

---

## Features (Historical)

- **Anime Streaming** – Watch anime from multiple providers, with skip OP/ED support.
- **Manga Reading** – Explore manga from several sources, including Anify.
- **AniList Integration** – Auto-track anime/manga, edit lists, and sync with your AniList profile.
- **User Profiles** – View watched lists, manage account, and more.
- **Trending/Popular** – Live trending and most-watched anime endpoints.
- **Schedules** – Real-time airing schedule endpoints.
- **Responsive UI** – Modern interface with mobile/desktop support.
- **PWA** – Add to home screen, offline support.
- **Admin Tools** – SSR admin dashboard for moderators.

---

## Local Development Setup

> **Self-hosting is only allowed for personal use. Commercial use or running ads is NOT permitted.**

### 1. Clone the repository

```bash
git clone https://github.com/1Anime/V2.git
cd V2
```

### 2. Install dependencies

```bash
npm install
```

### 3. Prepare your environment variables

Create a `.env.local` file in the project root with the following content (edit values as needed):

```env
# AniList OAuth
ANILIST_CLIENT_ID=your-anilist-client-id
ANILIST_CLIENT_SECRET=your-anilist-client-secret
GRAPHQL_ENDPOINT=https://graphql.anilist.co

# NextAuth
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=http://localhost:3000

# Database (optional, for Prisma features)
DATABASE_URL=postgresql://user:password@localhost:5432/1anime
DIRECT_URL=postgresql://user:password@localhost:5432/1anime

# Redis
REDIS_URL=redis://localhost:6379

# Optional: Disqus comments
DISQUS_SHORTNAME=your-disqus-shortname

# (For download proxy)
PROXY_URI=https://your-proxy-url
```

- You can generate a good `NEXTAUTH_SECRET` with:  
  `openssl rand -base64 32`

### 4. Set up your database (optional)

If you want to use the experimental Prisma features:

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Start Redis server

- **macOS:**  
  `brew install redis && brew services start redis`
- **Linux:**  
  `sudo apt install redis-server && sudo systemctl start redis`

### 6. Start the development server

```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000).

---

## Credits

- [Ani-Moopa/Moopa](https://github.com/Ani-Moopa/Moopa) – Major source/fork origin, idea, and initial codebase
- [Consumet API](https://github.com/consumet/api.consumet.org) for anime sources (now unmaintained)
- [AniList API](https://github.com/AniList/ApiV2-GraphQL-Docs) for anime/manga details and user lists
- [Anify API](https://anify.tv/discord) for manga sources (now unmaintained)
- [miru](https://github.com/ThaUnknown/miru/) for additional inspiration

---

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE.md](LICENSE.md) file for details.

> If you use or host this site for your own purposes, you are also required to release the source code of any modifications or improvements you make to this project.

---

**Built for the anime community. Not affiliated with AniList, Crunchyroll, or other licensors.**

**Thank you for your understanding.**
