/**
 * ============================================================
 *  SORAKU COMMUNITY — PROPRIETARY & CONFIDENTIAL
 * ============================================================
 *  BullMQ Queue — Webhook delivery & background jobs
 * ============================================================
 */

import { Queue, Worker, type Job } from 'bullmq'
import { getRedisClient } from './redis'

// ─── Queue Names ──────────────────────────────────────────────────────────────

export const QUEUE_WEBHOOK = 'soraku:webhooks'
export const QUEUE_NOTIFICATIONS = 'soraku:notifications'

// ─── Webhook Job Payload ──────────────────────────────────────────────────────

export interface WebhookJobPayload {
  webhookId: string
  url: string
  event: string
  payload: Record<string, unknown>
  secret?: string
}

// ─── Queue Factory ────────────────────────────────────────────────────────────

let webhookQueue: Queue | null = null

export function getWebhookQueue(): Queue {
  if (webhookQueue) return webhookQueue

  const connection = getRedisClient()

  webhookQueue = new Queue(QUEUE_WEBHOOK, {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: 100,
      removeOnFail: 500,
    },
  })

  return webhookQueue
}

// ─── Enqueue a webhook delivery ──────────────────────────────────────────────

export async function enqueueWebhook(payload: WebhookJobPayload): Promise<void> {
  try {
    const queue = getWebhookQueue()
    await queue.add('deliver', payload, {
      jobId: `webhook-${payload.webhookId}-${Date.now()}`,
    })
  } catch (err) {
    console.error('[Queue] Failed to enqueue webhook:', err)
  }
}

// ─── Worker (run separately via script, not in Next.js edge) ─────────────────

export function startWebhookWorker(): Worker {
  const connection = getRedisClient()

  const worker = new Worker(
    QUEUE_WEBHOOK,
    async (job: Job<WebhookJobPayload>) => {
      const { url, event, payload, secret } = job.data

      const body = JSON.stringify({ event, data: payload, timestamp: new Date().toISOString() })

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Soraku-Event': event,
      }

      if (secret) {
        // Simple HMAC-like signature using Web Crypto
        const encoder = new TextEncoder()
        const keyData = encoder.encode(secret)
        const bodyData = encoder.encode(body)
        const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
        const sig = await crypto.subtle.sign('HMAC', key, bodyData)
        headers['X-Soraku-Signature'] = Buffer.from(sig).toString('hex')
      }

      const res = await fetch(url, { method: 'POST', headers, body })
      if (!res.ok) throw new Error(`Webhook delivery failed: ${res.status}`)
    },
    { connection, concurrency: 5 }
  )

  worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed:`, err.message)
  })

  return worker
}
