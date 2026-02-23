import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "./supabase";
import type { Role } from "./roles";

export async function getCurrentUserRole(): Promise<Role> {
  const { userId } = await auth();
  if (!userId) return "USER";

  try {
    const { data } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    return (data?.role as Role) || "USER";
  } catch {
    return "USER";
  }
}

export async function ensureUserInDB() {
  const user = await currentUser();
  if (!user) return;

  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!data) {
    await supabaseAdmin.from("user_roles").insert({
      user_id: user.id,
      role: "USER",
      username: user.username || user.firstName || "Unknown",
      email: user.emailAddresses?.[0]?.emailAddress || null,
      avatar_url: user.imageUrl || null,
    });
  }
}
