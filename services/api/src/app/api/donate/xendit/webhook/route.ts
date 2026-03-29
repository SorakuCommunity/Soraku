import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { donatur } from "@/lib/db/schema"
import { env } from "@/env"

export const dynamic = "force-dynamic"

// POST /api/donate/xendit/webhook
export async function POST(req: NextRequest) {
  const token = req.headers.get("x-callback-token")
  if (!env.XENDIT_SECRET_KEY || token !== env.XENDIT_SECRET_KEY) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }

  const body = await req.json()
  if (body.status !== "PAID") return NextResponse.json({ ok: true })

  await db.insert(donatur).values({
    displayname: body.customer?.given_names ?? "Anonim",
    amount:      body.paid_amount,
    ispublic:    true,
  })

  return NextResponse.json({ ok: true })
}
