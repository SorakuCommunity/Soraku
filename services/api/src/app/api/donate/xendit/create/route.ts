import { NextRequest, NextResponse } from "next/server"
import { verifyAuth, unauthorized } from "@/lib/auth"
import { XenditCreateSchema } from "@/lib/validators"
import { env } from "@/env"

export const dynamic = "force-dynamic"

// POST /api/donate/xendit/create
export async function POST(req: NextRequest) {
  const auth = await verifyAuth(req)
  if ("error" in auth) return unauthorized()

  if (!env.XENDIT_SECRET_KEY) {
    return NextResponse.json({ data: null, error: "Payment not configured" }, { status: 503 })
  }

  const body = await req.json()
  const parsed = XenditCreateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ data: null, error: parsed.error.issues[0]?.message }, { status: 400 })

  const { amount, displayname, message, tier } = parsed.data
  const externalId = `soraku-${Date.now()}`

  const xenditRes = await fetch("https://api.xendit.co/v2/invoices", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(env.XENDIT_SECRET_KEY + ":").toString("base64")}`,
    },
    body: JSON.stringify({
      external_id:          externalId,
      amount,
      description:          `Soraku ${tier} — ${displayname}`,
      customer:             { given_names: displayname },
      success_redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/donate?status=success`,
      failure_redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/donate?status=failed`,
    }),
  })

  const invoice = await xenditRes.json()
  return NextResponse.json({ data: { invoiceUrl: invoice.invoice_url, externalId }, error: null })
}
