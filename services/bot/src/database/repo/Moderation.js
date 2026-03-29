import { Database } from '#structures/classes/Database'

export class Moderation extends Database {
  constructor() { super() }

  // ── Mutes ──────────────────────────────────────────────────
  async addMute(guildId, userId, moderatorId, reason, duration = null) {
    await this.sb.bot().from('mutes').update({ active: false }).match({ guild_id: guildId, user_id: userId, active: true })
    const expiresAt = duration ? (Date.now() + duration) : null
    return this.sb.bot().from('mutes').insert({ guild_id: guildId, user_id: userId, moderator_id: moderatorId, reason, duration, expires_at: expiresAt, active: true })
  }
  async removeMute(guildId, userId) {
    await this.sb.bot().from('mutes').update({ active: false }).match({ guild_id: guildId, user_id: userId, active: true })
  }
  async getActiveMute(guildId, userId) {
    const { data } = await this.sb.bot().from('mutes').select('*').match({ guild_id: guildId, user_id: userId, active: true }).maybeSingle()
    return data
  }
  async getMuteHistory(guildId, userId) {
    const { data } = await this.sb.bot().from('mutes').select('*').match({ guild_id: guildId, user_id: userId }).order('muted_at', { ascending: false })
    return data ?? []
  }
  async resetMutes(guildId, userId) {
    await this.sb.bot().from('mutes').delete().match({ guild_id: guildId, user_id: userId })
  }
  async getExpiredMutes() {
    const { data } = await this.sb.bot().from('mutes').select('*').eq('active', true).not('expires_at', 'is', null).lte('expires_at', Date.now())
    return data ?? []
  }

  // ── Warns ──────────────────────────────────────────────────
  async addWarn(guildId, userId, moderatorId, reason) {
    return this.sb.bot().from('warns').insert({ guild_id: guildId, user_id: userId, moderator_id: moderatorId, reason })
  }
  async getWarns(guildId, userId) {
    const { data } = await this.sb.bot().from('warns').select('*').match({ guild_id: guildId, user_id: userId }).order('warned_at', { ascending: false })
    return data ?? []
  }
  async getWarnCount(guildId, userId) {
    const { count } = await this.sb.bot().from('warns').select('*', { count: 'exact', head: true }).match({ guild_id: guildId, user_id: userId })
    return count ?? 0
  }
  async resetWarns(guildId, userId) {
    await this.sb.bot().from('warns').delete().match({ guild_id: guildId, user_id: userId })
  }

  // ── Reminders ──────────────────────────────────────────────
  async addRemind(guildId, channelId, userId, message, remindAt) {
    return this.sb.bot().from('reminders').insert({ guild_id: guildId, channel_id: channelId, user_id: userId, message, remind_at: new Date(remindAt).toISOString(), done: false })
  }
  async getReminders(userId) {
    const { data } = await this.sb.bot().from('reminders').select('*').eq('user_id', userId).eq('done', false)
    return data ?? []
  }
  async getPendingReminders() {
    const { data } = await this.sb.bot().from('reminders').select('*').eq('done', false).lte('remind_at', new Date().toISOString())
    return data ?? []
  }
  async markReminded(id) {
    await this.sb.bot().from('reminders').update({ done: true }).eq('id', id)
  }
  async resetReminds(userId) {
    await this.sb.bot().from('reminders').delete().eq('user_id', userId)
  }
}
