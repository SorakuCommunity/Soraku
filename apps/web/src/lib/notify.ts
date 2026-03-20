/**
 * notify.ts — helper untuk membuat notifikasi + emit realtime ke user
 * Pakai di server-side: API routes, server actions
 */

import { adminDb } from "@/lib/supabase/admin";

// Emit notif ke Upstash Redis pub/sub via REST API (fire and forget)
async function emitRealtimeRest(channel: string, event: string, data: Record<string, unknown>) {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return;

  try {
    // Upstash realtime menggunakan Redis pub/sub internally
    // Publish message ke channel yang sesuai
    const message = JSON.stringify({ event, data, channel, id: Date.now().toString() });
    await fetch(`${url}/publish/${encodeURIComponent(channel)}/${encodeURIComponent(message)}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    // Silent fail — notif realtime optional
  }
}

export async function createNotification(params: {
  userid:  string;
  type:    "event" | "blog" | "gallery" | "badge" | "mention" | "system" | "info" | "premium";
  title:   string;
  body?:   string;
  href?:   string;
}) {
  const { data, error } = await adminDb()
    .from("notifications")
    .insert({
      userid:  params.userid,
      type:    params.type,
      title:   params.title,
      body:    params.body   ?? null,
      href:    params.href   ?? null,
      isread:  false,
    })
    .select("id,type,title,body,href")
    .single();

  if (error || !data) {
    console.error("[notify] DB insert error:", error);
    return null;
  }

  // Emit realtime ke channel user (fire and forget)
  emitRealtimeRest(`user:${params.userid}`, "notification.created", {
    ...data,
    userid: params.userid,
  }).catch(() => {});

  return data;
}
