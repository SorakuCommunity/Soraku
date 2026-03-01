/**
 * lib/redis.ts — SORAKU v1.0.a3.3
 * Redis + BullMQ with graceful fallback when Redis is unavailable.
 * All operations are safe-to-call even without a Redis connection.
 */

import { Redis } from 'ioredis'

// ─── Lazy singleton ───────────────────────────────────────────────────────────
let _redis: Redis | null = null
let _redisAvailable: boolean | null = null

function getRedis(): Redis | null {
  if (_redisAvailable === false) return null
  if (!process.env.REDIS_URL && typeof window === 'undefined') {
    // Skip Redis if no URL configured (build-time safety)
    if (process.env.NODE_ENV === 'production' && !process.env.REDIS_URL) {
      return null
    }
  }
  if (!_redis) {
    try {
      _redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
        maxRetriesPerRequest: 0,
        lazyConnect: true,
        connectTimeout: 2000,
        commandTimeout: 2000,
        enableOfflineQueue: false,
      })
      _redis.on('error', () => { _redisAvailable = false })
    } catch {
      _redisAvailable = false
      return null
    }
  }
  return _redis
}

export { getRedis }

// ─── Cache helpers ────────────────────────────────────────────────────────────
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const r = getRedis()
    if (!r) return null
    const val = await r.get(key)
    if (!val) return null
    return JSON.parse(val) as T
  } catch { return null }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  try {
    const r = getRedis()
    if (!r) return
    await r.set(key, JSON.stringify(value), 'EX', ttlSeconds)
  } catch {}
}

export async function cacheDel(key: string): Promise<void> {
  try { const r = getRedis(); if (r) await r.del(key) } catch {}
}

export async function cacheExists(key: string): Promise<boolean> {
  try {
    const r = getRedis()
    if (!r) return false
    return (await r.exists(key)) === 1
  } catch { return false }
}

// ─── Rate limiting ────────────────────────────────────────────────────────────
export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const r = getRedis()
    if (!r) return { allowed: true, remaining: maxRequests }
    const current = await r.incr(key)
    if (current === 1) await r.expire(key, windowSeconds)
    return { allowed: current <= maxRequests, remaining: Math.max(0, maxRequests - current) }
  } catch { return { allowed: true, remaining: 0 } }
}

export async function rateLimit(key: string, windowSeconds: number): Promise<number> {
  try {
    const r = getRedis()
    if (!r) return 0
    const current = await r.incr(key)
    if (current === 1) await r.expire(key, windowSeconds)
    return current
  } catch { return 0 }
}

// ─── BullMQ Queues (lazy, only if Redis is available) ────────────────────────
type LazyQueue = {
  add: (name: string, data: unknown, opts?: unknown) => Promise<unknown>
}

function makeNullQueue(): LazyQueue {
  return {
    add: async () => null,
  }
}

function makeLazyQueue(name: string): LazyQueue {
  if (!process.env.REDIS_URL) return makeNullQueue()
  try {
    // Dynamic import to avoid build-time crash
    const { Queue } = require('bullmq') as typeof import('bullmq')
    const conn = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null })
    const q = new Queue(name, { connection: conn as never })
    return {
      add: (jobName: string, data: unknown, opts?: unknown) =>
        q.add(jobName, data, opts as never),
    }
  } catch {
    return makeNullQueue()
  }
}

export const webhookQueue      = makeLazyQueue('webhook')
export const spotifyQueue      = makeLazyQueue('spotify-refresh')
export const notificationQueue = makeLazyQueue('notifications')
