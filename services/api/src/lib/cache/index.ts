/**
 * services/api/src/lib/cache — Redis cache via Upstash
 *
 * Upstash Redis: serverless, REST-based, free tier 10k req/day
 * https://upstash.com — buat akun gratis, dapat 1 database
 *
 * ENV yang perlu diisi:
 *   REDIS_URL=https://...upstash.io
 *   REDIS_TOKEN=...
 *
 * Tanpa Upstash: otomatis fallback ke in-memory cache (Map)
 */

// ── In-memory fallback ────────────────────────────────────────
const memCache = new Map<string, { value: string; expiresAt: number }>();

function memGet(key: string): string | null {
  const item = memCache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    memCache.delete(key);
    return null;
  }
  return item.value;
}

function memSet(key: string, value: string, ttlSeconds: number) {
  memCache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
  if (memCache.size > 500) {
    const now = Date.now();
    for (const [k, v] of memCache.entries()) {
      if (now > v.expiresAt) memCache.delete(k);
    }
  }
}

// ── Upstash REST client ───────────────────────────────────────
const REDIS_URL = process.env.REDIS_URL;
const REDIS_TOKEN = process.env.REDIS_TOKEN;

async function upstashGet(key: string): Promise<string | null> {
  if (!REDIS_URL || !REDIS_TOKEN) return null;
  try {
    const res = await fetch(`${REDIS_URL}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    });
    const data = await res.json();
    return data?.result ?? null;
  } catch {
    return null;
  }
}

async function upstashSet(
  key: string,
  value: string,
  ttlSeconds: number,
): Promise<void> {
  if (!REDIS_URL || !REDIS_TOKEN) return;
  try {
    await fetch(`${REDIS_URL}/set/${encodeURIComponent(key)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([value, "EX", ttlSeconds]),
    });
  } catch {}
}

async function upstashDel(pattern: string): Promise<void> {
  if (!REDIS_URL || !REDIS_TOKEN) return;
  try {
    // KEYS then DEL
    const res = await fetch(
      `${REDIS_URL}/keys/${encodeURIComponent(pattern)}`,
      {
        headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
      },
    );
    const data = await res.json();
    const keys: string[] = data?.result ?? [];
    if (keys.length === 0) return;
    await fetch(`${REDIS_URL}/del/${keys.map(encodeURIComponent).join("/")}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    });
  } catch {}
}

// ── Public cache API ──────────────────────────────────────────

const useUpstash = !!(REDIS_URL && REDIS_TOKEN);

export const cache = {
  /** Get cached value, parsed from JSON */
  async get<T>(key: string): Promise<T | null> {
    const raw = useUpstash ? await upstashGet(key) : memGet(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  /** Set value with TTL in seconds */
  async set<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    const raw = JSON.stringify(value);
    if (useUpstash) await upstashSet(key, raw, ttlSeconds);
    else memSet(key, raw, ttlSeconds);
  },

  /** Invalidate all keys matching pattern (e.g. "anime:search:*") */
  async invalidate(pattern: string): Promise<void> {
    if (useUpstash) await upstashDel(pattern);
    else {
      for (const key of memCache.keys()) {
        if (key.startsWith(pattern.replace("*", ""))) memCache.delete(key);
      }
    }
  },
};

// ── Cache TTL presets ─────────────────────────────────────────
export const TTL = {
  SEARCH: 60 * 10, // 10 menit — search results
  DETAIL: 60 * 30, // 30 menit — anime detail + episode list
  STREAM: 60 * 5, // 5 menit  — stream URLs (cepat expired)
  SOURCES: 60 * 60, // 1 jam    — available sources status
  TRENDING: 60 * 60 * 2, // 2 jam    — trending list
};

// ── Cache-aware wrappers ──────────────────────────────────────

export async function withCache<T>(
  key: string,
  ttl: number,
  fn: () => Promise<T>,
): Promise<T> {
  const cached = await cache.get<T>(key);
  if (cached !== null) return cached;
  const result = await fn();
  if (result !== null && result !== undefined) {
    await cache.set(key, result, ttl);
  }
  return result;
}
