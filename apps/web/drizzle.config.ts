import { defineConfig } from 'drizzle-kit'
import * as dotenv from 'dotenv'

// Load .env.local untuk drizzle-kit CLI (berjalan di luar Next.js runtime)
dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/db/schema.ts',
  out: './supabase/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  schemaFilter: ['soraku'],
})
