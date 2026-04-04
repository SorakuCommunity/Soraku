import { pgSchema, uuid, text, boolean, integer, jsonb, timestamp } from "drizzle-orm/pg-core"

const soraku = pgSchema("soraku")

export const users = soraku.table("users", {
  id:              uuid("id").primaryKey(),
  username:        text("username").unique(),
  displayname:     text("displayname"),
  avatarurl:       text("avatarurl"),
  bio:             text("bio"),
  coverurl:        text("coverurl"),
  role:            text("role").notNull().default("USER"),
  supporterrole:   text("supporterrole"),
  supportersince:  timestamp("supportersince", { withTimezone: true }),
  supporteruntil:  timestamp("supporteruntil", { withTimezone: true }),
  supportersource: text("supportersource"),
  sociallinks:     jsonb("sociallinks").default({}),
  isprivate:       boolean("isprivate").default(false),
  isbanned:        boolean("isbanned").default(false),
  createdat:       timestamp("createdat", { withTimezone: true }).defaultNow(),
  updatedat:       timestamp("updatedat", { withTimezone: true }).defaultNow(),
})

export const streamcontent = soraku.table("streamcontent", {
  id:           uuid("id").primaryKey().defaultRandom(),
  slug:         text("slug").unique().notNull(),
  title:        text("title").notNull(),
  description:  text("description"),
  thumbnailurl: text("thumbnailurl"),
  hlsurl:       text("hlsurl"),
  duration:     integer("duration"),
  type:         text("type").notNull().default("vod"),
  status:       text("status").notNull().default("draft"),
  vtuberid:     uuid("vtuberid"),
  tags:         text("tags").array().default([]),
  viewcount:    integer("viewcount").notNull().default(0),
  ispremium:    boolean("ispremium").default(false),
  metadata:     jsonb("metadata").default({}),
  createdat:    timestamp("createdat", { withTimezone: true }).defaultNow(),
  updatedat:    timestamp("updatedat", { withTimezone: true }).defaultNow(),
})

export const posts = soraku.table("posts", {
  id:          uuid("id").primaryKey().defaultRandom(),
  slug:        text("slug").unique().notNull(),
  title:       text("title").notNull(),
  excerpt:     text("excerpt"),
  content:     text("content"),
  coverurl:    text("coverurl"),
  tags:        text("tags").array().default([]),
  ispublished: boolean("ispublished").default(false),
  publishedat: timestamp("publishedat", { withTimezone: true }),
  authorid:    uuid("authorid"),
  viewcount:   integer("viewcount").notNull().default(0),
  likecount:   integer("likecount").notNull().default(0),
  createdat:   timestamp("createdat", { withTimezone: true }).defaultNow(),
  updatedat:   timestamp("updatedat", { withTimezone: true }).defaultNow(),
})

export const events = soraku.table("events", {
  id:          uuid("id").primaryKey().defaultRandom(),
  slug:        text("slug").unique().notNull(),
  title:       text("title").notNull(),
  description: text("description"),
  coverurl:    text("coverurl"),
  startdate:   timestamp("startdate", { withTimezone: true }).notNull(),
  enddate:     timestamp("enddate", { withTimezone: true }),
  location:    text("location"),
  isonline:    boolean("isonline").default(false),
  status:      text("status").notNull().default("pending"),
  ispublished: boolean("ispublished").default(false),
  tags:        text("tags").array().default([]),
  createdby:   uuid("createdby"),
  createdat:   timestamp("createdat", { withTimezone: true }).defaultNow(),
  updatedat:   timestamp("updatedat", { withTimezone: true }).defaultNow(),
})

export const gallery = soraku.table("gallery", {
  id:              uuid("id").primaryKey().defaultRandom(),
  uploadedby:      uuid("uploadedby"),
  imageurl:        text("imageurl").notNull(),
  title:           text("title"),
  description:     text("description"),
  tags:            text("tags").array().default([]),
  status:          text("status").notNull().default("pending"),
  reviewedby:      uuid("reviewedby"),
  rejectionreason: text("rejectionreason"),
  createdat:       timestamp("createdat", { withTimezone: true }).defaultNow(),
  updatedat:       timestamp("updatedat", { withTimezone: true }).defaultNow(),
})

export const vtubers = soraku.table("vtubers", {
  id:              uuid("id").primaryKey().defaultRandom(),
  slug:            text("slug").unique().notNull(),
  name:            text("name").notNull(),
  charactername:   text("charactername"),
  avatarurl:       text("avatarurl"),
  coverurl:        text("coverurl"),
  description:     text("description"),
  tags:            text("tags").array().default([]),
  sociallinks:     jsonb("sociallinks").default({}),
  isactive:        boolean("isactive").default(true),
  ispublished:     boolean("ispublished").default(true),
  islive:          boolean("islive").default(false),
  liveurl:         text("liveurl"),
  subscribercount: integer("subscribercount"),
  userid:          uuid("userid"),
  createdat:       timestamp("createdat", { withTimezone: true }).defaultNow(),
  updatedat:       timestamp("updatedat", { withTimezone: true }).defaultNow(),
})

export const donatur = soraku.table("donatur", {
  id:          uuid("id").primaryKey().defaultRandom(),
  userid:      uuid("userid"),
  displayname: text("displayname").notNull(),
  amount:      integer("amount").notNull(),
  tier:        text("tier"),
  message:     text("message"),
  ispublic:    boolean("ispublic").default(true),
  createdat:   timestamp("createdat", { withTimezone: true }).defaultNow(),
})

export const apikeys = soraku.table("apikeys", {
  id:          uuid("id").primaryKey().defaultRandom(),
  name:        text("name").notNull(),
  keyhash:     text("keyhash").unique().notNull(),
  prefix:      text("prefix").notNull(),
  client:      text("client").notNull().default("web"),
  permissions: jsonb("permissions").notNull().default(["read"]),
  expiresat:   timestamp("expiresat", { withTimezone: true }),
  isactive:    boolean("isactive").notNull().default(true),
  createdat:   timestamp("createdat", { withTimezone: true }).defaultNow(),
})

export const post_likes = soraku.table("post_likes", {
  id:        uuid("id").primaryKey().defaultRandom(),
  postid:    uuid("postid").notNull(),
  userid:    uuid("userid"),
  ipaddr:    text("ipaddr"),
  createdat: timestamp("createdat", { withTimezone: true }).defaultNow(),
})

export const post_comments = soraku.table("post_comments", {
  id:        uuid("id").primaryKey().defaultRandom(),
  postid:    uuid("postid").notNull(),
  parentid:  uuid("parentid"),
  userid:    uuid("userid"),
  guestname: text("guestname"),
  content:   text("content").notNull(),
  isdeleted: boolean("isdeleted").default(false),
  createdat: timestamp("createdat", { withTimezone: true }).defaultNow(),
  updatedat: timestamp("updatedat", { withTimezone: true }).defaultNow(),
})

// ============================================================
// STREAMING DATABASE TABLES (soraku-streaming project)
// ============================================================

export const watch_history = soraku.table("watch_history", {
  id:          uuid("id").primaryKey().defaultRandom(),
  userid:      uuid("userid").notNull(),
  animeid:     text("animeid").notNull(),
  animetitle: text("animetitle").notNull(),
  cover:       text("cover"),
  episode:     integer("episode").notNull(),
  progress:    integer("progress").default(0),
  duration:    integer("duration").default(0),
  provider:    text("provider").default("hianime"),
  updatedat:   timestamp("updatedat", { withTimezone: true }).defaultNow(),
  createdat:    timestamp("createdat", { withTimezone: true }).defaultNow(),
})

export const favorites = soraku.table("favorites", {
  id:        uuid("id").primaryKey().defaultRandom(),
  userid:    uuid("userid").notNull(),
  animeid:   text("animeid").notNull(),
  title:     text("title").notNull(),
  cover:     text("cover"),
  addedat:   timestamp("addedat", { withTimezone: true }).defaultNow(),
})

export const user_settings = soraku.table("user_settings", {
  id:           uuid("id").primaryKey().defaultRandom(),
  userid:       uuid("userid").notNull().unique(),
  defaultsource text("defaultsource").default("hianime"),
  defaultquality text("defaultquality").default("auto"),
  subtitlesenabled boolean("subtitlesenabled").default(true),
  autoplay     boolean("autoplay").default(true),
  notifications boolean("notifications").default(true),
  createdat:    timestamp("createdat", { withTimezone: true }).defaultNow(),
  updatedat:    timestamp("updatedat", { withTimezone: true }).defaultNow(),
})

// ============================================================
// BOT DATABASE TABLES (soraku-komunitas project)
// ============================================================

export const bot_config = soraku.table("bot_config", {
  id:        uuid("id").primaryKey().defaultRandom(),
  key:       text("key").notNull().unique(),
  value:     text("value"),
  createdat: timestamp("createdat", { withTimezone: true }).defaultNow(),
  updatedat: timestamp("updatedat", { withTimezone: true }).defaultNow(),
})