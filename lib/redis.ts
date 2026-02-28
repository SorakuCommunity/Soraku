/**
 * lib/redis.ts — Centralized Redis + BullMQ
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
  try {
    const r = getRedis()
    const val = await r.get(key)
    if (!val) return null
    return JSON.parse(val) as T
  } catch { return null }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  try {
    const r = getRedis()
    await r.set(key, JSON.stringify(value), 'EX', ttlSeconds)
  } catch {}
}

export async function cacheDel(key: string): Promise<void> {
  try { await getRedis().del(key) } catch {}
}

export async function cacheExists(key: string): Promise<boolean> {
  try { return (await getRedis().exists(key)) === 1 } catch { return false }
}

// ─── Rate limiting ────────────────────────────────────────────────────────────
export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const r = getRedis()
    const current = await r.incr(key)
    if (current === 1) await r.expire(key, windowSeconds)
    return { allowed: current <= maxRequests, remaining: Math.max(0, maxRequests - current) }
  } catch { return { allowed: true, remaining: 0 } }
}

// rateLimit(key, windowSeconds) → count  (2-arg version used by repo)
export async function rateLimit(key: string, windowSeconds: number): Promise<number> {
  try {
    const r = getRedis()
    const current = await r.incr(key)
    if (current === 1) await r.expire(key, windowSeconds)
    return current
  } catch { return 0 }
}

// ─── BullMQ Queues ────────────────────────────────────────────────────────────
const queueConn = process.env.REDIS_URL
  ? { connection: new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null }) }
  : { connection: { host: 'localhost', port: 6379 } }

export const webhookQueue      = new Queue('webhook',         queueConn as never)
export const spotifyQueue      = new Queue('spotify-refresh', queueConn as never)
export const notificationQueue = new Queue('notifications',   queueConn as never)
