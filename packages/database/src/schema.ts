// @soraku/database/schema — Table name constants
// Dipakai untuk type-safe table references

export const TABLES = {
  // Schema soraku (Web & Utility)
  users: "users",
  posts: "posts",
  events: "events",
  gallery: "gallery",
  vtubers: "vtubers",
  donatur: "donatur",
  apikeys: "apikeys",
  streamcontent: "streamcontent",
  post_likes: "post_likes",
  post_comments: "post_comments",
  notifications: "notifications",
  partnerships: "partnerships",
  userlevels: "userlevels",
  userbadges: "userbadges",
  sitesettings: "sitesettings",
  eventregistrations: "eventregistrations",

  // Schema bot (Discord)
  bot_users: "users",
  bot_guilds: "guilds",
  bot_tickets: "tickets",
  bot_warns: "warns",
  bot_premium: "premium",
  bot_reminders: "reminders",
  bot_playlists: "playlists",
  bot_mutes: "mutes",
  bot_invite_data: "invite_data",
  bot_welcome: "welcome",
  bot_autorole: "autorole",
  bot_autoreact: "autoreact",
  bot_autorespond: "autorespond",
  bot_antispam: "antispam",
  bot_antilink: "antilink",
  bot_antinuke: "antinuke",
  bot_blacklist: "blacklist",
  bot_noprefix: "noprefix",
  bot_roles: "roles",
  bot_afk: "afk",
  bot_snipe: "snipe",
  bot_music247: "music247",
  bot_ignorechan: "ignorechan",
  bot_ticket_data: "ticket_data",
  bot_ticket_panels: "ticket_panels",
  bot_ticket_counters: "ticket_counters",
  bot_invite_settings: "invite_settings",
  bot_invite_ranks: "invite_ranks",
} as const

export type TableName = typeof TABLES[keyof typeof TABLES]
