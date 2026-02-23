const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_SERVER_ID = process.env.DISCORD_SERVER_ID || "1116971049045729302";
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

export interface DiscordStats {
  totalMembers: number;
  onlineMembers: number;
  guildName: string;
  guildIcon: string | null;
  cachedAt: number;
}

let statsCache: DiscordStats | null = null;
let lastFetch = 0;
const CACHE_DURATION = 60 * 1000; // 60 seconds

export async function getDiscordStats(): Promise<DiscordStats> {
  const now = Date.now();

  if (statsCache && now - lastFetch < CACHE_DURATION) {
    return statsCache;
  }

  if (!DISCORD_BOT_TOKEN) {
    return {
      totalMembers: 0,
      onlineMembers: 0,
      guildName: "Soraku Community",
      guildIcon: null,
      cachedAt: now,
    };
  }

  try {
    const [guildRes, widgetRes] = await Promise.all([
      fetch(
        `https://discord.com/api/v10/guilds/${DISCORD_SERVER_ID}?with_counts=true`,
        {
          headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` },
          next: { revalidate: 60 },
        }
      ),
      fetch(
        `https://discord.com/api/v10/guilds/${DISCORD_SERVER_ID}/widget.json`,
        { next: { revalidate: 60 } }
      ),
    ]);

    if (!guildRes.ok) throw new Error("Failed to fetch guild");

    const guild = await guildRes.json();
    let onlineMembers = 0;

    if (widgetRes.ok) {
      const widget = await widgetRes.json();
      onlineMembers = widget.presence_count || 0;
    }

    statsCache = {
      totalMembers: guild.approximate_member_count || 0,
      onlineMembers,
      guildName: guild.name || "Soraku Community",
      guildIcon: guild.icon
        ? `https://cdn.discordapp.com/icons/${DISCORD_SERVER_ID}/${guild.icon}.png`
        : null,
      cachedAt: now,
    };

    lastFetch = now;
    return statsCache;
  } catch (error) {
    console.error("Discord stats error:", error);
    return {
      totalMembers: statsCache?.totalMembers || 0,
      onlineMembers: statsCache?.onlineMembers || 0,
      guildName: "Soraku Community",
      guildIcon: null,
      cachedAt: now,
    };
  }
}

export async function sendDiscordWebhook(event: {
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  bannerImage?: string;
}): Promise<boolean> {
  if (!DISCORD_WEBHOOK_URL) return false;

  const embed = {
    title: `🎉 ${event.title}`,
    description: event.description,
    color: 0x4fa3d1,
    fields: [
      {
        name: "📅 Mulai",
        value: new Date(event.startDate).toLocaleDateString("id-ID", {
          dateStyle: "full",
        }),
        inline: true,
      },
      ...(event.endDate
        ? [
            {
              name: "📅 Selesai",
              value: new Date(event.endDate).toLocaleDateString("id-ID", {
                dateStyle: "full",
              }),
              inline: true,
            },
          ]
        : []),
    ],
    image: event.bannerImage ? { url: event.bannerImage } : undefined,
    footer: { text: "Soraku Community Platform" },
    timestamp: new Date().toISOString(),
  };

  try {
    const res = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });
    return res.ok;
  } catch (error) {
    console.error("Webhook error:", error);
    return false;
  }
}
