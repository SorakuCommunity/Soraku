import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getCurrentUserRole } from "@/lib/clerk";
import { hasPermission } from "@/lib/roles";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const generation = searchParams.get("generation");

  let query = supabaseAdmin
    .from("vtubers")
    .select("*")
    .order("created_at", { ascending: true });

  if (generation) query = query.eq("generation", parseInt(generation));

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ vtubers: data || [] });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = await getCurrentUserRole();
  if (!hasPermission(role, "vtuber_create")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { name, bio, avatar_url, generation, agency, social_links } = body;

  if (!name || !generation) {
    return NextResponse.json({ error: "Name and generation required" }, { status: 400 });
  }

  const slug = slugify(name) + "-gen" + generation;

  const { data, error } = await supabaseAdmin
    .from("vtubers")
    .insert({ name, bio, avatar_url, generation, slug, agency, social_links: social_links || {}, created_by: userId })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ vtuber: data }, { status: 201 });
}
