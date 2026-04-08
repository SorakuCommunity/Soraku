# Docker Configuration

## Services

### apps/web
- Next.js 16+ app on port 3000
- Environment: production

### apps/stream
- Next.js 16+ streaming app on port 3001
- Environment: production

### services/api
- Central REST API on port 4000
- Environment: production

### services/bot
- Discord bot (Node.js 20)
- Sharding enabled

### services/anime-scraper
- Anime scraper service
- Internal only

### services/scheduler
- Cron job runner
- Internal only
