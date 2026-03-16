import { Database } from '#structures/classes/Database'

export class Premium extends Database {
  constructor() { super() }

  async isUserPremium(userId) {
    const { data } = await this.sb.bot().from('user_premium').select('*').eq('user_id', userId).eq('active', true).maybeSingle()
    if (!data) return false
    if (data.expires_at && new Date(data.expires_at) < new Date()) { await this.revokeUserPremium(userId); return false }
    return true
  }

  async isGuildPremium(guildId) {
    const { data } = await this.sb.bot().from('guild_premium').select('*').eq('guild_id', guildId).eq('active', true).maybeSingle()
    if (!data) return false
    if (data.expires_at && new Date(data.expires_at) < new Date()) { await this.revokeGuildPremium(guildId); return false }
    return true
  }

  async hasAnyPremium(userId, guildId) {
    return (await this.isUserPremium(userId)) || (await this.isGuildPremium(guildId))
  }

  async grantUserPremium(userId, grantedBy, expiresAt = null, reason = 'Premium granted') {
    await this.sb.bot().from('user_premium').update({ active: false }).eq('user_id', userId).eq('active', true)
    return this.sb.bot().from('user_premium').insert({ user_id: userId, granted_by: grantedBy, expires_at: expiresAt, reason, active: true })
  }

  async grantGuildPremium(guildId, grantedBy, expiresAt = null, reason = 'Premium granted') {
    await this.sb.bot().from('guild_premium').update({ active: false }).eq('guild_id', guildId).eq('active', true)
    return this.sb.bot().from('guild_premium').insert({ guild_id: guildId, granted_by: grantedBy, expires_at: expiresAt, reason, active: true })
  }

  async revokeUserPremium(userId) {
    await this.sb.bot().from('user_premium').update({ active: false, updated_at: new Date().toISOString() }).eq('user_id', userId).eq('active', true)
  }

  async revokeGuildPremium(guildId) {
    await this.sb.bot().from('guild_premium').update({ active: false, updated_at: new Date().toISOString() }).eq('guild_id', guildId).eq('active', true)
  }

  async getUserPremiumInfo(userId) {
    const { data } = await this.sb.bot().from('user_premium').select('*').eq('user_id', userId).eq('active', true).maybeSingle()
    return data
  }

  async getGuildPremiumInfo(guildId) {
    const { data } = await this.sb.bot().from('guild_premium').select('*').eq('guild_id', guildId).eq('active', true).maybeSingle()
    return data
  }
}
