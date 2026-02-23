import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ role: "USER" });
    }

    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("users")
      .select("role")
      .eq("clerk_id", userId)
      .single();

    return NextResponse.json({ role: data?.role ?? "USER" });
  } catch {
    return NextResponse.json({ role: "USER" });
  }
}
