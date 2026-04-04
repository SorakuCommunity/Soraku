import dotenv from "dotenv";
dotenv.config();

export const config = {
  // Discord
  token: process.env.TOKEN,
  clientId: process.env.CLIENT_ID,
  prefix: process.env.PREFIX || "!",
  ownerIds: (process.env.OWNER_IDS ?? "1020644780075659356")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  // Sharding
  sharding: {
    totalShards:
      process.env.TOTAL_SHARDS === "auto" || !process.env.TOTAL_SHARDS
        ? "auto"
        : parseInt(process.env.TOTAL_SHARDS, 10),
    shardsPerCluster: parseInt(process.env.SHARDS_PER_CLUSTER, 10) || 2,
  },

  // Lavalink
  nodes: [
    {
      id: "nodes",
      host: process.env.LAVA_HOST ?? "localhost",
      port: parseInt(process.env.LAVA_PORT ?? "2333", 10),
      authorization: process.env.LAVA_PASS ?? "youshallnotpass",
      secure: (process.env.LAVA_SECURE ?? "false") === "true",
      retryAmount: Infinity,
      retryDelay: 10000,
    },
  ],

  // Soraku
  soraku: {
    webUrl: process.env.WEB_URL ?? "https://soraku.id",
    apiUrl: process.env.SORAKU_URL ?? "https://apisoraku.vercel.app",
    apiSecret: process.env.SORAKU_SECRET ?? "",
    webhook: process.env.WEBHOOK ?? "",
    guildId: process.env.GUILD_ID ?? "",
    channelId: process.env.CHANNEL_ID ?? "",
    roles: {
      donatur: process.env.ROLE_DONATUR ?? "1436534227708543046",
      vip: process.env.ROLE_VIP ?? "1447194092965728307",
      vvip: process.env.ROLE_VVIP ?? "1447194196401459320",
    },
  },

  // Supabase
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
  },

  environment: process.env.NODE_ENV || "production",
  debug: process.env.DEBUG === "true",

  links: {
    supportServer: process.env.DISCORD_INVITE
      ? `https://discord.gg/${process.env.DISCORD_INVITE}`
      : "https://discord.gg/qm3XJvRa6B",
  },

  status: {
    name:
      process.env.STATUS_TEXT ||
      `${process.env.PREFIX || "!"}help | Soraku Community`,
    status: process.env.STATUS_TYPE || "online",
    type: "CUSTOM",
  },

  colors: {
    info: "#7c3aed",
    success: "#2ecc71",
    warning: "#f39c12",
    error: "#e74c3c",
  },

  // Multiple webhooks support - pisahkan dengan koma untuk multiple channels
  // Format: WEBHOOKS=url1,url2,url3 atau WH_EVENT=url,WH_BLOG=url
  webhook: {
    enabled: process.env.WEBHOOK_ENABLED !== "false",
    // Multiple webhooks - bisa comma-separated atau use specific vars
    urls: (process.env.WEBHOOK ?? process.env.WEBHOOK_URL ?? "")
      .split(",")
      .filter(Boolean),
    // Specific webhooks untuk different purposes
    events: process.env.WH_EVENTS ?? "",
    blog: process.env.WH_BLOG ?? "",
    feedback: process.env.WH_FEEDBACK ?? "",
    donation: process.env.WH_DONATION ?? "",
    // Fallback default
    default: process.env.WEBHOOK ?? process.env.WEBHOOK_URL ?? null,
    username: process.env.WEBHOOK_USERNAME || "Soraku Bot Logger",
    avatarUrl: process.env.WEBHOOK_AVATAR_URL ?? null,
    levels: {
      info: { enabled: process.env.WEBHOOK_INFO_ENABLED !== "false" },
      success: { enabled: process.env.WEBHOOK_SUCCESS_ENABLED !== "false" },
      warning: { enabled: process.env.WEBHOOK_WARNING_ENABLED !== "false" },
      error: { enabled: process.env.WEBHOOK_ERROR_ENABLED !== "false" },
      debug: { enabled: process.env.WEBHOOK_DEBUG_ENABLED === "true" },
    },
  },

  features: { stay247: false },
  queue: { maxSongs: { free: 50, premium: 200 } },

  assets: {
    defaultTrackArtwork: process.env.DEFAULT_TRACK_ARTWORK ?? null,
    defaultThumbnail: process.env.DEFAULT_THUMBNAIL ?? null,
    helpThumbnail: process.env.HELP_THUMBNAIL ?? null,
    bannerUrl: process.env.BANNER_URL ?? null,
  },

  getThumbnailUrl(url) {
    return url || null;
  },

  spotify: {
    clientId: process.env.SPOTIFY_ID ?? "",
    clientSecret: process.env.SPOTIFY_SECRET ?? "",
  },
  lastfm: { apiKey: process.env.LASTFM_KEY },
  search: { maxResults: 6, defaultSources: ["ytsearch"] },

  player: {
    defaultVolume: 100,
    seekStep: 10000,
    maxHistorySize: 50,
    stay247: {
      reconnectDelay: 5000,
      maxReconnectAttempts: 3,
      checkInterval: 30000,
    },
    audioQuality: {
      bitrate: 320,
      sampleRate: 48000,
      channels: 2,
      bufferSize: 8192,
      highWaterMark: 1048576,
    },
  },

  watermark: "Soraku Community",
  version: "2.0.0",
};
