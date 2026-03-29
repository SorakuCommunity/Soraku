import dotenv from 'dotenv'
dotenv.config()

export const config = {
  token:    process.env.TOKEN ?? process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  prefix:   process.env.PREFIX || '!',
  ownerIds: (process.env.OWNER_IDS ?? process.env.OWNER_ID ?? '1020644780075659356').split(',').map(s => s.trim()).filter(Boolean),

  sharding: {
    totalShards:      process.env.TOTAL_SHARDS === 'auto' || !process.env.TOTAL_SHARDS ? 'auto' : parseInt(process.env.TOTAL_SHARDS, 10),
    shardsPerCluster: parseInt(process.env.SHARDS_PER_CLUSTER, 10) || 2,
  },

  nodes: [{
    id:            process.env.LAVALINK_ID || 'soraku-lava',
    host:          process.env.LAVA_URL?.split(':')[0] ?? process.env.LAVALINK_HOST ?? 'localhost',
    port:          parseInt(process.env.LAVALINK_PORT ?? process.env.LAVA_URL?.split(':')[1] ?? '2333', 10),
    authorization: process.env.LAVA_AUTH ?? process.env.LAVALINK_PASSWORD ?? 'youshallnotpass',
    secure:        (process.env.LAVA_SECURE ?? process.env.LAVALINK_SECURE ?? 'false') === 'true',
    retryAmount:   Infinity,
    retryDelay:    10000,
  }],

  // Soraku Community
  soraku: {
    webUrl:     process.env.SORAKU_WEB_URL ?? 'https://soraku.vercel.app',
    apiSecret:  process.env.SORAKU_API_SECRET ?? '',
    webhook:    process.env.WEBHOOK ?? process.env.WEBHOOK_SECRET ?? '',
    guildId:    process.env.GUILD_ID ?? process.env.DISCORD_GUILD_ID ?? '',
    channelId:  process.env.CHANNEL_ID ?? process.env.DISCORD_EVENT_CHANNEL_ID ?? '',
    roles: {
      donatur:  process.env.ROLE_DONATUR ?? '1436534227708543046',
      vip:      process.env.ROLE_VIP     ?? '1447194092965728307',
      vvip:     process.env.ROLE_VVIP    ?? '1447194196401459320',
    },
  },

  environment:  process.env.NODE_ENV || 'production',
  debug:        process.env.DEBUG === 'true',

  links: { supportServer: process.env.SUPPORT_SERVER_URL ?? 'https://discord.gg/qm3XJvRa6B' },

  status: {
    name:   process.env.STATUS_TEXT || `${process.env.PREFIX || '!'}help | Soraku Community`,
    status: process.env.STATUS_TYPE || 'online',
    type:   'CUSTOM',
  },

  colors: { info: '#7c3aed', success: '#2ecc71', warning: '#f39c12', error: '#e74c3c' },

  webhook: {
    enabled:   process.env.WEBHOOK_ENABLED !== 'false',
    url:       process.env.WEBHOOK_URL ?? null,
    username:  process.env.WEBHOOK_USERNAME || 'Soraku Bot Logger',
    avatarUrl: process.env.WEBHOOK_AVATAR_URL ?? null,
    levels: {
      info:    { enabled: process.env.WEBHOOK_INFO_ENABLED !== 'false' },
      success: { enabled: process.env.WEBHOOK_SUCCESS_ENABLED !== 'false' },
      warning: { enabled: process.env.WEBHOOK_WARNING_ENABLED !== 'false' },
      error:   { enabled: process.env.WEBHOOK_ERROR_ENABLED !== 'false' },
      debug:   { enabled: process.env.WEBHOOK_DEBUG_ENABLED === 'true' },
    },
  },

  features: { stay247: true },
  queue: { maxSongs: { free: 50, premium: 200 } },

  assets: {
    defaultTrackArtwork: process.env.DEFAULT_TRACK_ARTWORK ?? null,
    defaultThumbnail:    process.env.DEFAULT_THUMBNAIL ?? null,
    helpThumbnail:       process.env.HELP_THUMBNAIL ?? null,
    bannerUrl:           process.env.BANNER_URL ?? null,
  },

  getThumbnailUrl(url) { return url || null },

  spotify: { clientId: process.env.SPOTIFY_CLIENT_ID ?? process.env.SPOTIFY_ID, clientSecret: process.env.SPOTIFY_CLIENT_SECRET ?? process.env.SPOTIFY_SECRET },
  lastfm:  { apiKey: process.env.LASTFM_API_KEY },
  search:  { maxResults: 6, defaultSources: ['ytsearch'] },

  player: {
    defaultVolume: 100, seekStep: 10000, maxHistorySize: 50,
    stay247: { reconnectDelay: 5000, maxReconnectAttempts: 3, checkInterval: 30000 },
    audioQuality: { bitrate: 320, sampleRate: 48000, channels: 2, bufferSize: 8192, highWaterMark: 1048576 },
  },

  watermark: 'Soraku Community',
  version:   '3.0.0',
}
