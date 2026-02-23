import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getCurrentUserRole } from "@/lib/clerk";
import { hasPermission } from "@/lib/roles";
import { slugify } from "@/lib/utils";
import { sendDiscordWebhook } from "@/lib/discord";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  let query = supabaseAdmin
    .from("events")
    .select("*")
    .order("start_date", { ascending: true });

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ events: data || [] });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = await getCurrentUserRole();
  if (!hasPermission(role, "event_create")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { title, description, banner_image, start_date, end_date, status = "upcoming" } = body;

  if (!title || !description || !start_date) {
    return NextResponse.json({ error: "Title, description, and start date required" }, { status: 400 });
  }

  const slug = slugify(title) + "-" + Date.now().toString().slice(-4);

  const { data, error } = await supabaseAdmin
    .from("events")
    .insert({ title, slug, description, banner_image, start_date, end_date, status, created_by: userId })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send to Discord webhook
  await sendDiscordWebhook({ title, description, startDate: start_date, endDate: end_date, bannerImage: banner_image });

  return NextResponse.json({ event: data }, { status: 201 });
}
