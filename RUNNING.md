# =============================================================================

# SORAKU MONOREPO — Quick Start Guide

# =============================================================================

## Requirements

- **Node.js**: >=20.0.0 (v20.x recommended)
- **pnpm**: >=9.0.0

## Port Configuration (Local Development)

| Project      | Port | URL                   | Command         |
| ------------ | ---- | --------------------- | --------------- |
| apps/web     | 3000 | http://localhost:3000 | pnpm dev:web    |
| apps/stream  | 3001 | http://localhost:3001 | pnpm dev:stream |
| services/api | 4000 | http://localhost:4000 | pnpm dev:api    |
| services/bot | N/A  | N/A (Discord)         | pnpm dev:bot    |

## Install Dependencies

```bash
# Per project (recommended):
cd apps/web && pnpm install
cd apps/stream && pnpm install
cd services/api && pnpm install

# Atau semua sekaligus:
pnpm install
```

## Running Development

````bash
# Dari root Soraku/
pnpm dev:web      # Komunitas platform (port 3000)
pnpm dev:stream   # Anime streaming (port 3001)
pnpm dev:api      # Central API (port 4000)

# Semua sekaligus (pakai turbo)
pnpm dev


## Environment Files (Local)

Copy .env.example ke .env.local:

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/stream/.env.example apps/stream/.env.local
cp services/api/.env.example services/api/.env.local
cp services/bot/.env.example services/bot/.env
````

## Deployment URLs (Production)

| Project      | URL                          |
| ------------ | ---------------------------- |
| apps/web     | https://soraku.vercel.app    |
| apps/stream  | https://stream.soraku.id     |
| services/api | https://apisoraku.vercel.app |
| services/bot | Railway/Render               |

## Project Structure

```
Soraku/
├── apps/
│   ├── web/              → Komunitas platform (Next.js)
│   │   └── .env.local    → PORT=3000
│   └── stream/           → Anime streaming (Next.js)
│       └── .env.local    → PORT=3001
├── services/
│   ├── api/              → Central REST API (Next.js)
│   │   └── .env.local    → PORT=4000
│   └── bot/              → Discord bot
│       └── .env          → (no port)
├── packages/             → Shared libraries
└── docs/
    └── routes/
        └── MONOREPO.md   → Full documentation
```

## Running Development

````bash
# Dari root Soraku/
pnpm dev:web      # Komunitas platform (port 3000)
pnpm dev:stream   # Anime streaming (port 3001)
pnpm dev:api      # Central API (port 4000)

# Semua sekaligus (pakai turbo)
pnpm dev


## Environment Files (Local)

Copy .env.example ke .env.local:

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/stream/.env.example apps/stream/.env.local
cp services/api/.env.example services/api/.env.local
cp services/bot/.env.example services/bot/.env
````

## Deployment URLs (Production)

| Project      | URL                          |
| ------------ | ---------------------------- |
| apps/web     | https://soraku.vercel.app    |
| apps/stream  | https://stream.soraku.id     |
| services/api | https://apisoraku.vercel.app |
| services/bot | Railway/Render               |

## Project Structure

```
Soraku/
├── apps/
│   ├── web/              → Komunitas platform (Next.js)
│   │   └── .env.local    → PORT=3000
│   └── stream/           → Anime streaming (Next.js)
│       └── .env.local    → PORT=3001
├── services/
│   ├── api/              → Central REST API (Next.js)
│   │   └── .env.local    → PORT=4000
│   └── bot/              → Discord bot
│       └── .env          → (no port)
├── packages/             → Shared libraries
└── docs/
    └── routes/
        └── MONOREPO.md   → Full documentation
```
