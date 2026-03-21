import { InferRealtimeEvents, Realtime } from '@upstash/realtime'
import { z } from 'zod'
import { Redis } from '@upstash/redis'

// Redis client — hanya di server
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL ?? '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN ?? '',
})

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

export const realtime = new Realtime({ schema, redis })
export type RealtimeEvents = InferRealtimeEvents<typeof realtime>
