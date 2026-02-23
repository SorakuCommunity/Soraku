import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getCurrentUserRole } from "@/lib/clerk";
import { hasPermission } from "@/lib/roles";

export async function GET() {
  const maintenanceEnv = process.env.MAINTENANCE_MODE === "true";

  try {
    const { data } = await supabaseAdmin
      .from("app_settings")
      .select("value")
      .eq("key", "maintenance_mode")
      .single();

    const enabled = data ? data.value === "true" : maintenanceEnv;
    return NextResponse.json({ enabled });
  } catch {
    return NextResponse.json({ enabled: maintenanceEnv });
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = await getCurrentUserRole();
  if (!hasPermission(role, "settings_maintenance")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { enabled } = await req.json();

  await supabaseAdmin
    .from("app_settings")
    .upsert({ key: "maintenance_mode", value: String(enabled) }, { onConflict: "key" });

  return NextResponse.json({ enabled, message: `Maintenance mode ${enabled ? "activated" : "deactivated"}` });
}
