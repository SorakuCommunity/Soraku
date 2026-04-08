# Deployment Guide

## Current Setup

### Vercel (Web & Stream)
- **Web**: vercel.com → apps/web
- **Stream**: vercel.com → apps/stream
- Auto deploy on push to master

### Supabase
- Project: apisoraku
- Database migrations: database/migrations/
- Run migrations: pnpm migrate

## Future: VPS Deployment

If deploying to VPS (Render/DigitalOcean), need:

### 1. Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

### 2. Nginx (reverse proxy)
server {
  listen 80;
  server_name soraku.id;
  location / {
    proxy_pass http://localhost:3000;
  }
}

### 3. CI/CD
Already in .github/workflows/ci.yml

## Environment Variables

| Variable | Description |
|----------|-------------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL |
| SUPABASE_SERVICE_ROLE_KEY | Service role key |
| DISCORD_TOKEN | Bot token |
| DISCORD_CLIENT_ID | Bot client ID |
