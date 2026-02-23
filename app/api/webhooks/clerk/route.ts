import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "No webhook secret" }, { status: 400 });
  }

  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: { type: string; data: { id: string; email_addresses: { email_address: string }[]; username?: string; image_url?: string } };

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as typeof evt;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const { type, data } = evt;

  if (type === "user.created") {
    await supabase.from("users").insert({
      clerk_id: data.id,
      email: data.email_addresses[0]?.email_address ?? "",
      username: data.username ?? data.email_addresses[0]?.email_address?.split("@")[0] ?? "user",
      avatar_url: data.image_url,
      role: "USER",
    });
  }

  if (type === "user.updated") {
    await supabase
      .from("users")
      .update({
        email: data.email_addresses[0]?.email_address ?? "",
        username: data.username,
        avatar_url: data.image_url,
        updated_at: new Date().toISOString(),
      })
      .eq("clerk_id", data.id);
  }

  if (type === "user.deleted") {
    await supabase.from("users").delete().eq("clerk_id", data.id);
  }

  return NextResponse.json({ success: true });
}
