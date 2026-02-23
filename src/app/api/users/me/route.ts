import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ role: "USER", user: null });
  }

  try {
    const { data } = await supabaseAdmin
      .from("user_roles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!data) {
      return NextResponse.json({ role: "USER", user: null });
    }

    return NextResponse.json({ role: data.role, user: data });
  } catch {
    return NextResponse.json({ role: "USER", user: null });
  }
}
