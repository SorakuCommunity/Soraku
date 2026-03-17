import { Database } from '#structures/classes/Database'
import { config } from '#config/config'

export class Guild extends Database {
  constructor() { super() }

  async ensureGuild(guildId) {
    let g = await this.findOne('guilds', { guild_id: guildId })
    if (!g) {
      g = await this.upsert('guilds', {
        guild_id: guildId, prefixes: JSON.stringify([config.prefix]),
        default_volume: 100, auto_disconnect: true, stay_247: false,
      }, 'guild_id')
    }
    return g
  }

  async getGuild(guildId)   { return this.findOne('guilds', { guild_id: guildId }) }
  async getAllGuilds()       { return this.findAll('guilds') }

  async getPrefixes(guildId) {
    const g = await this.ensureGuild(guildId)
    try { const p = JSON.parse(g.prefixes); return Array.isArray(p) && p.length ? p : [config.prefix] }
    catch { return [config.prefix] }
  }
  async setPrefixes(guildId, prefixes) {
    await this.ensureGuild(guildId)
    await this.update('guilds', { prefixes: JSON.stringify(prefixes), updated_at: new Date().toISOString() }, { guild_id: guildId })
  }

  async getDefaultVolume(guildId)    { const g = await this.ensureGuild(guildId); return g.default_volume ?? 100 }
  async setDefaultVolume(guildId, v) {
    if (v < 1 || v > 100) throw new Error('Volume 1-100')
    await this.update('guilds', { default_volume: v, updated_at: new Date().toISOString() }, { guild_id: guildId })
  }

  async updateSettings(guildId, settings) {
    await this.ensureGuild(guildId)
    await this.update('guilds', { ...settings, updated_at: new Date().toISOString() }, { guild_id: guildId })
  }

  async blacklistGuild(guildId, reason = 'No reason') {
    await this.ensureGuild(guildId)
    await this.update('guilds', { blacklisted: true, blacklist_reason: reason, updated_at: new Date().toISOString() }, { guild_id: guildId })
  }
  async unblacklistGuild(guildId) {
    await this.update('guilds', { blacklisted: false, blacklist_reason: null, updated_at: new Date().toISOString() }, { guild_id: guildId })
  }
  async isBlacklisted(guildId) {
    const g = await this.getGuild(guildId)
    if (!g?.blacklisted) return false
    return { blacklisted: true, reason: g.blacklist_reason ?? 'No reason' }
  }
  async getAllBlacklistedGuilds() {
    const { data } = await this.sb.bot().from('guilds').select('*').eq('blacklisted', true)
    return data ?? []
  }

  async get247Settings(guildId) {
    const g = await this.ensureGuild(guildId)
    return { enabled: !!g.stay_247, voiceChannel: g.stay_247_voice_channel, textChannel: g.stay_247_text_channel, autoDisconnect: g.auto_disconnect !== false }
  }
  async set247Mode(guildId, enabled, voiceChannelId = null, textChannelId = null) {
    await this.ensureGuild(guildId)
    await this.update('guilds', {
      stay_247: enabled, stay_247_voice_channel: enabled ? voiceChannelId : null,
      stay_247_text_channel: enabled ? textChannelId : null, auto_disconnect: !enabled,
      updated_at: new Date().toISOString(),
    }, { guild_id: guildId })
  }
  async getValid247Guilds() {
    const { data } = await this.sb.bot().from('guilds').select('*').eq('stay_247', true).not('stay_247_voice_channel', 'is', null)
    return (data ?? []).filter(g => g.stay_247_voice_channel?.length > 0)
  }
  async setAutoDisconnect(guildId, enabled) {
    await this.update('guilds', { auto_disconnect: enabled, updated_at: new Date().toISOString() }, { guild_id: guildId })
  }
}
