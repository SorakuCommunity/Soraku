import { Database } from '#structures/classes/Database'

// Nama tabel di DB Supabase
const T_SETTINGS = 'invitesettings'   // guild_id, tracking_enabled
const T_DATA     = 'invitedata'       // id, guild_id, user_id, real_invites, bonus_invites, fake_invites, left_invites, inviter_id, invite_code
const T_RANKS    = 'inviteranks'      // id, guild_id, role_id, invites_required

export class Invites extends Database {
  constructor() { super() }

  async ensureGuildSettings(guildId) {
    let s = await this.findOne(T_SETTINGS, { guild_id: guildId })
    if (!s) s = await this.upsert(T_SETTINGS, { guild_id: guildId, tracking_enabled: false }, 'guild_id')
    return s
  }

  async isTrackingEnabled(guildId) {
    const s = await this.ensureGuildSettings(guildId)
    return !!s.tracking_enabled
  }
  async setTrackingEnabled(guildId, enabled) {
    await this.ensureGuildSettings(guildId)
    await this.update(T_SETTINGS, { tracking_enabled: enabled, updated_at: new Date().toISOString() }, { guild_id: guildId })
  }

  async ensureMember(guildId, userId) {
    let m = await this.findOne(T_DATA, { guild_id: guildId, user_id: userId })
    if (!m) m = await this.upsert(T_DATA, { guild_id: guildId, user_id: userId, real_invites: 0, bonus_invites: 0, fake_invites: 0, left_invites: 0 }, 'guild_id,user_id')
    return m
  }
  async getMemberInvites(guildId, userId) { return this.ensureMember(guildId, userId) }
  getEffectiveInvites(m) { return (m?.real_invites ?? 0) + (m?.bonus_invites ?? 0) - (m?.fake_invites ?? 0) - (m?.left_invites ?? 0) }

  async addInvites(guildId, userId, amount) {
    const m = await this.ensureMember(guildId, userId)
    await this.update(T_DATA, { bonus_invites: (m.bonus_invites ?? 0) + amount, updated_at: new Date().toISOString() }, { guild_id: guildId, user_id: userId })
  }
  async resetInvites(guildId, userId) {
    await this.update(T_DATA, { real_invites: 0, bonus_invites: 0, fake_invites: 0, left_invites: 0, updated_at: new Date().toISOString() }, { guild_id: guildId, user_id: userId })
  }
  async setInviterData(guildId, userId, inviterId, inviteCode) {
    await this.ensureMember(guildId, userId)
    await this.update(T_DATA, { inviter_id: inviterId, invite_code: inviteCode, updated_at: new Date().toISOString() }, { guild_id: guildId, user_id: userId })
  }
  async trackJoin(guildId, userId) {
    const m = await this.ensureMember(guildId, userId)
    await this.update(T_DATA, { real_invites: (m.real_invites ?? 0) + 1, updated_at: new Date().toISOString() }, { guild_id: guildId, user_id: userId })
  }
  async trackLeave(guildId, userId) {
    const m = await this.ensureMember(guildId, userId)
    await this.update(T_DATA, { left_invites: (m.left_invites ?? 0) + 1, updated_at: new Date().toISOString() }, { guild_id: guildId, user_id: userId })
  }
  async incrementTracked(guildId, userId, amount = 1) {
    const m = await this.ensureMember(guildId, userId)
    await this.update(T_DATA, { real_invites: (m.real_invites ?? 0) + amount, updated_at: new Date().toISOString() }, { guild_id: guildId, user_id: userId })
  }
  async incrementFake(guildId, userId, amount = 1) {
    const m = await this.ensureMember(guildId, userId)
    await this.update(T_DATA, { fake_invites: (m.fake_invites ?? 0) + amount, updated_at: new Date().toISOString() }, { guild_id: guildId, user_id: userId })
  }

  async getInviteRanks(guildId) {
    const { data } = await this.sb.bot().from(T_RANKS).select('*').eq('guild_id', guildId).order('invites_required')
    return data ?? []
  }
  async addInviteRank(guildId, roleId, invitesRequired) {
    await this.upsert(T_RANKS, { guild_id: guildId, role_id: roleId, invites_required: invitesRequired }, 'guild_id,role_id')
  }
  async removeInviteRank(guildId, roleId) { await this.destroy(T_RANKS, { guild_id: guildId, role_id: roleId }) }
  async getEligibleRanks(guildId, count) {
    const { data } = await this.sb.bot().from(T_RANKS).select('*').eq('guild_id', guildId).lte('invites_required', count).order('invites_required', { ascending: false })
    return data ?? []
  }
  async getLeaderboard(guildId, limit = 10) {
    const { data } = await this.sb.bot().from(T_DATA).select('*').eq('guild_id', guildId).order('real_invites', { ascending: false }).limit(limit)
    return data ?? []
  }
  async importInvites(guildId, userId, uses) { return this.addInvites(guildId, userId, uses) }
}
