import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createServerSupabaseClient();

    // Handle Discord event creation webhook
    if (body.type === "event_create") {
      await supabase.from("events").insert({
        title: body.name,
        description: body.description ?? "",
        start_date: body.scheduled_start_time,
        end_date: body.scheduled_end_time,
        status: "upcoming",
        discord_event_id: body.id,
        created_by: "discord",
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Discord webhook error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
