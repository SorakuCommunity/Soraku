import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { verifyAuth, unauthorized } from "@/lib/auth"
import { UpdateUserSchema } from "@/lib/validators"
import { eq } from "drizzle-orm"

export const dynamic = "force-dynamic"

// GET /api/users/:username
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params
  const [user] = await db
    .select({
      id: users.id, username: users.username, displayname: users.displayname,
      avatarurl: users.avatarurl, bio: users.bio, coverurl: users.coverurl,
      role: users.role, supporterrole: users.supporterrole,
      sociallinks: users.sociallinks, isprivate: users.isprivate,
      createdat: users.createdat,
    })
    .from(users)
    .where(eq(users.username, username))
    .limit(1)

  if (!user) return NextResponse.json({ data: null, error: "User not found" }, { status: 404 })
  if (user.isprivate) return NextResponse.json({ data: null, error: "Profile is private" }, { status: 403 })

  return NextResponse.json({ data: user, error: null })
}

// PATCH /api/users/:username
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const auth = await verifyAuth(req)
  if ("error" in auth) return unauthorized(auth.error)

  const { username } = await params
  const body = await req.json()
  const parsed = UpdateUserSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ data: null, error: parsed.error.issues[0]?.message }, { status: 400 })

  const [updated] = await db
    .update(users)
    .set({ ...parsed.data, updatedat: new Date() })
    .where(eq(users.username, username))
    .returning()

  return NextResponse.json({ data: updated, error: null })
}
