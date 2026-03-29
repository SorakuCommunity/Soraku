import { z } from 'zod'

// Event schema
const schema = {
  notification: {
    created: z.object({
      id: z.string(),
      type: z.string(),
      title: z.string(),
      body: z.string().nullable(),
      href: z.string().nullable(),
      userid: z.string(),
    }),
  },
}

// Redis & Realtime - lazy init, null jika ENV tidak di-set
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _redis: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _realtime: any = null
let _initialized = false

function init() {
  if (_initialized) return
  _initialized = true

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Redis } = require('@upstash/redis')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Realtime } = require('@upstash/realtime')
    _redis = new Redis({ url, token })
    _realtime = new Realtime({ schema, redis: _redis })
  } catch {
    // Paket tidak tersedia atau Redis error - skip
  }
}

export function getRedis() {
  init()
  return _redis
}

export function getRealtime() {
  init()
  return _realtime
}

// Eager export untuk backward compatibility
export const redis = new Proxy({} as any, {
  get(_, prop) {
    return (getRedis() as any)?.[prop]
  },
})

export const realtime = new Proxy({} as any, {
  get(_, prop) {
    return (getRealtime() as any)?.[prop]
  },
})
