import { Database } from '#structures/classes/Database'

export class Invites extends Database {
  constructor() { super() }

  async ensureGuildSettings(guildId) {
    let s = await this.findOne('invite_settings', { guild_id: guildId })
    if (!s) s = await this.upsert('invite_settings', { guild_id: guildId, tracking_enabled: false }, 'guild_id')
    return s
  }

  async isTrackingEnabled(guildId) {
    const s = await this.ensureGuildSettings(guildId)
    return !!s.tracking_enabled
  }
  async setTrackingEnabled(guildId, enabled) {
    await this.ensureGuildSettings(guildId)
    await this.update('invite_settings', { tracking_enabled: enabled, updated_at: new Date().toISOString() }, { guild_id: guildId })
  }

  async ensureMember(guildId, userId) {
    let m = await this.findOne('member_invites', { guild_id: guildId, user_id: userId })
    if (!m) m = await this.upsert('member_invites', { guild_id: guildId, user_id: userId, tracked: 0, added: 0, fake: 0, left_count: 0 }, 'guild_id,user_id')
    return m
  }
  async getMemberInvites(guildId, userId) { return this.ensureMember(guildId, userId) }
  getEffectiveInvites(m)                  { return (m?.tracked ?? 0) + (m?.added ?? 0) - (m?.fake ?? 0) - (m?.left_count ?? 0) }

  async addInvites(guildId, userId, amount) {
    const m = await this.ensureMember(guildId, userId)
    await this.update('member_invites', { added: (m.added ?? 0) + amount, updated_at: new Date().toISOString() }, { guild_id: guildId, user_id: userId })
  }
  async resetInvites(guildId, userId) {
    await this.update('member_invites', { tracked: 0, added: 0, fake: 0, left_count: 0, updated_at: new Date().toISOString() }, { guild_id: guildId, user_id: userId })
  }
  async setInviterData(guildId, userId, inviterId, inviteCode) {
    await this.ensureMember(guildId, userId)
    await this.update('member_invites', { inviter_id: inviterId, invite_code: inviteCode, updated_at: new Date().toISOString() }, { guild_id: guildId, user_id: userId })
  }
  async trackJoin(guildId, userId) {
    const m = await this.ensureMember(guildId, userId)
    await this.update('member_invites', { tracked: (m.tracked ?? 0) + 1, updated_at: new Date().toISOString() }, { guild_id: guildId, user_id: userId })
  }
  async trackLeave(guildId, userId) {
    const m = await this.ensureMember(guildId, userId)
    await this.update('member_invites', { left_count: (m.left_count ?? 0) + 1, updated_at: new Date().toISOString() }, { guild_id: guildId, user_id: userId })
  }

  async getInviteRanks(guildId) {
    const { data } = await this.sb.bot().from('invite_ranks').select('*').eq('guild_id', guildId).order('invites_required')
    return data ?? []
  }
  async addInviteRank(guildId, roleId, invitesRequired) {
    await this.upsert('invite_ranks', { guild_id: guildId, role_id: roleId, invites_required: invitesRequired }, 'guild_id,role_id')
  }
  async removeInviteRank(guildId, roleId) { await this.destroy('invite_ranks', { guild_id: guildId, role_id: roleId }) }
  async getEligibleRanks(guildId, count) {
    const { data } = await this.sb.bot().from('invite_ranks').select('*').eq('guild_id', guildId).lte('invites_required', count).order('invites_required', { ascending: false })
    return data ?? []
  }
  async getLeaderboard(guildId, limit = 10) {
    const { data } = await this.sb.bot().from('member_invites').select('*').eq('guild_id', guildId).order('tracked', { ascending: false }).limit(limit)
    return data ?? []
  }
  async importInvites(guildId, userId, uses) { return this.addInvites(guildId, userId, uses) }
}
