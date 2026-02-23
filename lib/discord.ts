import type { DiscordStats } from "@/types";

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_SERVER_ID = process.env.DISCORD_SERVER_ID;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

let cachedStats: DiscordStats | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60_000; // 60 seconds

export async function getDiscordStats(): Promise<DiscordStats> {
  const now = Date.now();

  // Return cached data if fresh
  if (cachedStats && now - cacheTimestamp < CACHE_DURATION) {
    return cachedStats;
  }

  try {
    if (!DISCORD_BOT_TOKEN || !DISCORD_SERVER_ID) {
      return getDefaultStats();
    }

    const res = await fetch(
      `https://discord.com/api/v10/guilds/${DISCORD_SERVER_ID}?with_counts=true`,
      {
        headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) return getDefaultStats();

    const guild = await res.json();

    cachedStats = {
      memberCount: guild.approximate_member_count ?? 0,
      onlineCount: guild.approximate_presence_count ?? 0,
      serverName: guild.name ?? "Soraku Community",
      serverIcon: guild.icon
        ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
        : undefined,
      lastUpdated: now,
    };
    cacheTimestamp = now;

    return cachedStats;
  } catch {
    return getDefaultStats();
  }
}

function getDefaultStats(): DiscordStats {
  return {
    memberCount: 1337,
    onlineCount: 42,
    serverName: "Soraku Community",
    lastUpdated: Date.now(),
  };
}

export async function sendDiscordWebhook(payload: {
  title: string;
  description: string;
  color?: number;
  fields?: { name: string; value: string; inline?: boolean }[];
}) {
  if (!DISCORD_WEBHOOK_URL) return;

  try {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: payload.title,
            description: payload.description,
            color: payload.color ?? 0x4fa3d1,
            fields: payload.fields ?? [],
            footer: { text: "Soraku Community Platform" },
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });
  } catch (err) {
    console.error("Discord webhook error:", err);
  }
}
