/**
 * lib/redis.ts — Centralized Redis + BullMQ
 * All cache, rate limiting, and queue logic lives here.
 */
import { Redis } from 'ioredis'
import { Queue } from 'bullmq'

let redis: Redis | null = null

export function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
      maxRetriesPerRequest: null,
      lazyConnect: true,
    })
  }
  return redis
}

// ─── Cache helpers ────────────────────────────────────────────────────────────
export async function cacheGet<T>(key: string): Promise<T | null> {
  const r = getRedis()
  const val = await r.get(key)
  if (!val) return null
  try { return JSON.parse(val) as T } catch { return null }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  const r = getRedis()
  await r.set(key, JSON.stringify(value), 'EX', ttlSeconds)
}

export async function cacheDel(key: string): Promise<void> {
  await getRedis().del(key)
}

// ─── Rate limiting ────────────────────────────────────────────────────────────
export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number }> {
  const r = getRedis()
  const current = await r.incr(key)
  if (current === 1) await r.expire(key, windowSeconds)
  const allowed = current <= maxRequests
  return { allowed, remaining: Math.max(0, maxRequests - current) }
}

// Alias — beberapa file mengimport sebagai rateLimit
export const rateLimit = checkRateLimit

// ─── BullMQ Queues ────────────────────────────────────────────────────────────
export const webhookQueue = new Queue('webhook', {
  connection: { host: 'localhost', port: 6379 },
})

export const spotifyQueue = new Queue('spotify-refresh', {
  connection: { host: 'localhost', port: 6379 },
})
