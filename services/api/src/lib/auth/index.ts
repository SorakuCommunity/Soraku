import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import { env } from "@/env"
import { db } from "@/lib/db"
import { apikeys } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { createHash } from "crypto"

const adminClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

/** Verifikasi Bearer token — bisa Supabase JWT atau Soraku API key */
export async function verifyAuth(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? ""
  const token = auth.replace("Bearer ", "").trim()

  if (!token) return { error: "Unauthorized", status: 401 }

  // ── Cek API key (prefix sk_ atau bot_) ───────────────────
  if (token.startsWith("sk_") || token.startsWith("bot_")) {
    const hash = createHash("sha256").update(token).digest("hex")
    const [key] = await db
      .select()
      .from(apikeys)
      .where(and(eq(apikeys.keyhash, hash), eq(apikeys.isactive, true)))
      .limit(1)

    if (!key) return { error: "Invalid API key", status: 401 }
    if (key.expiresat && key.expiresat < new Date()) return { error: "API key expired", status: 401 }

    return { client: key.client, permissions: key.permissions as string[], keyId: key.id }
  }

  // ── Cek Supabase JWT ─────────────────────────────────────
  const { data: { user }, error } = await adminClient.auth.getUser(token)
  if (error || !user) return { error: "Invalid token", status: 401 }

  return { userId: user.id }
}

/** Verifikasi SORAKU_API_SECRET untuk komunikasi internal web ↔ bot */
export function verifySecret(req: NextRequest) {
  const secret = req.headers.get("x-soraku-secret")
  if (secret !== env.SORAKU_API_SECRET) return { error: "Forbidden", status: 403 }
  return { ok: true }
}

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ data: null, error: message }, { status: 401 })
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json({ data: null, error: message }, { status: 403 })
}
