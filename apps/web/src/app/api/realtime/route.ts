export const dynamic = 'force-dynamic'

// Jika Redis tidak dikonfigurasi, return SSE stream kosong agar client tidak retry 503
function emptySSE() {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(': ok\n\n'))
      setTimeout(() => controller.close(), 30_000)
    },
  })
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let handler: any = null

export async function GET(req: Request) {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return emptySSE()

  try {
    if (!handler) {
      const { getRealtime } = await import('@/lib/realtime')
      const rt = getRealtime()
      if (!rt) return emptySSE()

      const { handle } = await import('@upstash/realtime')
      handler = handle({ realtime: rt })
    }
    return handler(req)
  } catch {
    return emptySSE()
  }
}
