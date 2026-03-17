import { Database } from '#structures/classes/Database'
import { logger } from '#utils/logger'
import { config } from '#config/config'

export class User extends Database {
  constructor() { super() }

  async ensureUser(userId) {
    let u = await this.findOne('users', { id: userId })
    if (!u) u = await this.upsert('users', { id: userId }, 'id')
    return u
  }

  async getUser(userId) { return this.findOne('users', { id: userId }) }

  async hasNoPrefix(userId) {
    const u = await this.getUser(userId)
    if (!u?.no_prefix) return false
    if (u.no_prefix_expiry && u.no_prefix_expiry < Date.now()) {
      await this.setNoPrefix(userId, false, null)
      return false
    }
    return true
  }
  async setNoPrefix(userId, enabled, expiryTimestamp = null) {
    await this.ensureUser(userId)
    await this.update('users', { no_prefix: enabled, no_prefix_expiry: expiryTimestamp ? Number(expiryTimestamp) : null, updated_at: new Date().toISOString() }, { id: userId })
  }

  async getUserPrefixes(userId) {
    const u = await this.getUser(userId)
    if (!u?.custom_prefixes) return []
    try { const p = JSON.parse(u.custom_prefixes); return Array.isArray(p) ? p : [] }
    catch { return [] }
  }
  async setUserPrefixes(userId, prefixes) {
    await this.ensureUser(userId)
    await this.update('users', { custom_prefixes: JSON.stringify(prefixes), updated_at: new Date().toISOString() }, { id: userId })
  }

  async isBlacklisted(userId) {
    const u = await this.getUser(userId)
    if (!u?.blacklisted) return false
    return { blacklisted: true, reason: u.blacklist_reason ?? 'No reason' }
  }
  async blacklistUser(userId, reason = 'No reason') {
    await this.ensureUser(userId)
    await this.update('users', { blacklisted: true, blacklist_reason: reason, updated_at: new Date().toISOString() }, { id: userId })
  }
  async unblacklistUser(userId) {
    await this.update('users', { blacklisted: false, blacklist_reason: null, updated_at: new Date().toISOString() }, { id: userId })
  }

  async getUserData(userId) { return this.ensureUser(userId) }

  async getHistory(userId) {
    const u = await this.getUser(userId)
    if (!u?.history) return []
    try { return JSON.parse(u.history) } catch { return [] }
  }
  async addToHistory(userId, track) {
    const history = await this.getHistory(userId)
    history.unshift(track)
    const trimmed = history.slice(0, 50)
    await this.ensureUser(userId)
    await this.update('users', { history: JSON.stringify(trimmed), updated_at: new Date().toISOString() }, { id: userId })
  }
  async clearHistory(userId) {
    await this.update('users', { history: '[]', updated_at: new Date().toISOString() }, { id: userId })
  }
}
