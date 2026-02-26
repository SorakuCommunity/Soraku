/**
 * ============================================================
 *  SORAKU COMMUNITY — PROPRIETARY & CONFIDENTIAL
 * ============================================================
 *  Redis client (ioredis) — Singleton pattern for Next.js
 * ============================================================
 */

import Redis from 'ioredis'

let redis: Redis | null = null

function getRedisClient(): Redis {
  if (redis) return redis

  const url = process.env.REDIS_URL
  if (!url) {
    throw new Error('REDIS_URL environment variable is not set')
  }

  redis = new Redis(url, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: false,
    lazyConnect: true,
  })

  redis.on('error', (err) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[Redis] Connection error:', err.message)
    }
  })

  return redis
}

export { getRedisClient }

// ─── Generic cache helpers ─────────────────────────────────────────────────

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const client = getRedisClient()
    const raw = await client.get(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export async function cacheSet<T>(
  key: string,
  value: T,
  ttlSeconds = 600
): Promise<void> {
  try {
    const client = getRedisClient()
    await client.setex(key, ttlSeconds, JSON.stringify(value))
  } catch {
    // Fail silently — cache miss is acceptable
  }
}

export async function cacheDel(key: string): Promise<void> {
  try {
    const client = getRedisClient()
    await client.del(key)
  } catch {
    // Fail silently
  }
}

// ─── Rate limiting ─────────────────────────────────────────────────────────

/**
 * Increment a counter for rate-limiting.
 * Returns current count. Sets TTL on first increment.
 */
export async function rateLimit(
  key: string,
  windowSeconds = 60
): Promise<number> {
  try {
    const client = getRedisClient()
    const pipeline = client.pipeline()
    pipeline.incr(key)
    pipeline.expire(key, windowSeconds)
    const results = await pipeline.exec()
    return (results?.[0]?.[1] as number) ?? 0
  } catch {
    return 0
  }
}
