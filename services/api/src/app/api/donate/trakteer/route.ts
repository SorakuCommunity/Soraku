import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { donatur } from "@/lib/db/schema"
import { TrakteerWebhookSchema } from "@/lib/validators"
import { env } from "@/env"
import { createHash } from "crypto"

export const dynamic = "force-dynamic"

// POST /api/donate/trakteer
export async function POST(req: NextRequest) {
  if (!env.TRAKTEER_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 })
  }

  const sig      = req.headers.get("x-trakteer-signature") ?? ""
  const rawBody  = await req.text()
  const expected = createHash("sha256").update(env.TRAKTEER_WEBHOOK_SECRET + rawBody).digest("hex")
  if (sig !== expected) return NextResponse.json({ error: "Invalid signature" }, { status: 401 })

  const parsed = TrakteerWebhookSchema.safeParse(JSON.parse(rawBody))
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })

  const { supporter_name, supporter_message, total } = parsed.data
  await db.insert(donatur).values({
    displayname: supporter_name,
    amount:      Math.round(total * 1000), // unit coffee → IDR
    message:     supporter_message,
    ispublic:    true,
  })

  return NextResponse.json({ ok: true })
}
