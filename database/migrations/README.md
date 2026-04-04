# Database Migrations

## Naming Convention
Format: `YYYYMMDD_description.sql`

Example:
- `20260312_initial_schema.sql`
- `20260313_level_badge_system.sql`
- `20260317_bot_schema_expose.sql`

## Running Migrations
1. Via Supabase Dashboard SQL Editor
2. Via CLI: `supabase db push`
3. Via Drizzle: `pnpm db:push`
