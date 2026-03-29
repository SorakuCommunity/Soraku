// Drizzle schema — schema soraku
// Semua kolom lowercase tanpa underscore (sesuai konvensi DB soraku)
// Tambah tabel di sini sesuai kebutuhan

import { pgSchema, uuid, text, boolean, timestamp, jsonb, integer } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const soraku = pgSchema('soraku')

export const users = soraku.table('users', {
  id: uuid('id').primaryKey(),
  username: text('username'),
  displayname: text('displayname'),
  avatarurl: text('avatarurl'),
  bio: text('bio'),
  coverurl: text('coverurl'),
  role: text('role').notNull().default('USER'),
  supporterrole: text('supporterrole'),
  supportersince: timestamp('supportersince', { withTimezone: true }),
  supporteruntil: timestamp('supporteruntil', { withTimezone: true }),
  supportersource: text('supportersource'),
  sociallinks: jsonb('sociallinks').default({}),
  isprivate: boolean('isprivate').default(false),
  isbanned: boolean('isbanned').default(false),
  createdat: timestamp('createdat', { withTimezone: true }).defaultNow(),
  updatedat: timestamp('updatedat', { withTimezone: true }).defaultNow(),
})

export const posts = soraku.table('posts', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  excerpt: text('excerpt'),
  content: text('content'),
  coverurl: text('coverurl'),
  tags: text('tags')
    .array()
    .default(sql`'{}'`),
  ispublished: boolean('ispublished').default(false),
  publishedat: timestamp('publishedat', { withTimezone: true }),
  authorid: uuid('authorid').references(() => users.id, { onDelete: 'set null' }),
  createdat: timestamp('createdat', { withTimezone: true }).defaultNow(),
  updatedat: timestamp('updatedat', { withTimezone: true }).defaultNow(),
})

export const userlevels = soraku.table('userlevels', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userid: uuid('userid')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  level: integer('level').notNull().default(1),
  xpcurrent: integer('xpcurrent').notNull().default(0),
  xprequired: integer('xprequired').notNull().default(100),
  reputationscore: integer('reputationscore').notNull().default(0),
  updatedat: timestamp('updatedat', { withTimezone: true }).defaultNow(),
})

export const userbadges = soraku.table('userbadges', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userid: uuid('userid')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  badgename: text('badgename').notNull(),
  badgeicon: text('badgeicon').notNull(),
  badgecls: text('badgecls'),
  createdat: timestamp('createdat', { withTimezone: true }).defaultNow(),
})

export const follows = soraku.table('follows', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  followerid: uuid('followerid')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  followingid: uuid('followingid')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
})
