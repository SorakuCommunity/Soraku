import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, donatur } from "@/lib/db/schema";
import { verifyAuth, unauthorized } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/community/premium — status subscriber user yang login
// GET /api/community/premium?leaderboard=true — top donatur publik
export async function GET(req: NextRequest) {
  if (!db) {
    return NextResponse.json(
      { data: null, error: "Database not configured" },
      { status: 503 },
    );
  }
  const { searchParams } = new URL(req.url);

  // Leaderboard — publik, tidak perlu auth
  if (searchParams.get("leaderboard") === "true") {
    const rows = await db
      .select()
      .from(donatur)
      .where(eq(donatur.ispublic, true))
      .orderBy(desc(donatur.amount))
      .limit(50);
    return NextResponse.json({ data: rows, error: null });
  }

  // Status subscriber — wajib login
  const auth = await verifyAuth(req);
  if ("error" in auth) return unauthorized();

  const userId =
    "userId" in auth && typeof auth.userId === "string" ? auth.userId : null;
  if (!userId)
    return unauthorized("Endpoint ini hanya untuk user login, bukan API key");

  const [user] = await db
    .select({
      supporterrole: users.supporterrole,
      supportersince: users.supportersince,
      supporteruntil: users.supporteruntil,
      supportersource: users.supportersource,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user)
    return NextResponse.json(
      { data: null, error: "User not found" },
      { status: 404 },
    );

  const isActive =
    user.supporterrole !== null &&
    (user.supporteruntil === null || user.supporteruntil > new Date());

  return NextResponse.json({ data: { ...user, isActive }, error: null });
}
