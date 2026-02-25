import { NextResponse } from "next/server";
import { isMaintenanceMode } from "@/lib/maintenance";

export async function GET() {
  return NextResponse.json({ maintenance: isMaintenanceMode() });
}
