import { Database } from '#structures/classes/Database'

export class Invites extends Database {
  constructor() { super() }

  async ensureGuildSettings(guildId) {
    let s = await this.findOne('invitesettings', { guild_id: guildId })
    if (!s) s = await this.upsert('invitesettings', { guild_id: guildId, tracking_enabled: false }, 'guild_id')
    return s
  }

  async isTrackingEnabled(guildId) {
    const s = await this.ensureGuildSettings(guildId)
    return !!s.tracking_enabled
  }
  async setTrackingEnabled(guildId, enabled) {
    await this.ensureGuildSettings(guildId)
    await this.update('invitesettings', { tracking_enabled: enabled, updated_at: new Date().toISOString() }, { guild_id: guildId })
  }

  async ensureMember(guildId, userId) {
    let m = await this.findOne('invitedata', { guild_id: guildId, user_id: userId })
    if (!m) m = await this.upsert('invitedata', { guild_id: guildId, user_id: userId, real_invites: 0, bonus_invites: 0, fake_invites: 0, left_invites: 0 }, 'guild_id,user_id')
    return m
  }
  async getMemberInvites(guildId, userId) { return this.ensureMember(guildId, userId) }
  getEffectiveInvites(m)                  { return (m?.real_invites ?? 0) + (m?.bonus_invites ?? 0) - (m?.fake_invites ?? 0) - (m?.left_invites ?? 0) }

  async addInvites(guildId, userId, amount) {
    const m = await this.ensureMember(guildId, userId)
    await this.update('invitedata', { bonus_invites: (m.bonus_invites ?? 0) + amount, updated_at: new Date().toISOString() }, { guild_id: guildId, user_id: userId })
  }
  async resetInvites(guildId, userId) {
    await this.update('invitedata', { real_invites: 0, bonus_invites: 0, fake_invites: 0, left_invites: 0, updated_at: new Date().toISOString() }, { guild_id: guildId, user_id: userId })
  }
  async setInviterData(guildId, userId, inviterId, inviteCode) {
    await this.ensureMember(guildId, userId)
    await this.update('invitedata', { inviter_id: inviterId, invite_code: inviteCode, updated_at: new Date().toISOString() }, { guild_id: guildId, user_id: userId })
  }
  async trackJoin(guildId, userId) {
    const m = await this.ensureMember(guildId, userId)
    await this.update('invitedata', { real_invites: (m.real_invites ?? 0) + 1, updated_at: new Date().toISOString() }, { guild_id: guildId, user_id: userId })
  }
  async trackLeave(guildId, userId) {
    const m = await this.ensureMember(guildId, userId)
    await this.update('invitedata', { left_invites: (m.left_invites ?? 0) + 1, updated_at: new Date().toISOString() }, { guild_id: guildId, user_id: userId })
  }

  async getInviteRanks(guildId) {
    const { data } = await this.sb.bot().from('inviteranks').select('*').eq('guild_id', guildId).order('invites_required')
    return data ?? []
  }
  async addInviteRank(guildId, roleId, invitesRequired) {
    await this.upsert('inviteranks', { guild_id: guildId, role_id: roleId, invites_required: invitesRequired }, 'guild_id,role_id')
  }
  async removeInviteRank(guildId, roleId) { await this.destroy('inviteranks', { guild_id: guildId, role_id: roleId }) }
  async getEligibleRanks(guildId, count) {
    const { data } = await this.sb.bot().from('inviteranks').select('*').eq('guild_id', guildId).lte('invites_required', count).order('invites_required', { ascending: false })
    return data ?? []
  }
  async getLeaderboard(guildId, limit = 10) {
    const { data } = await this.sb.bot().from('invitedata').select('*').eq('guild_id', guildId).order('real_invites', { ascending: false }).limit(limit)
    return data ?? []
  }
  async importInvites(guildId, userId, uses) { return this.addInvites(guildId, userId, uses) }
}
