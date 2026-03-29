import { Database } from '#structures/classes/Database'
import { randomUUID } from 'crypto'

export class Ticket extends Database {
  constructor() { super() }

  // ── Counters ────────────────────────────────────────────────
  async getCounter(guildId) {
    let c = await this.findOne('ticketcounters', { guild_id: guildId })
    if (!c) c = await this.upsert('ticketcounters', { guild_id: guildId, panel_counter: 0, ticket_counter: 0 }, 'guild_id')
    return c
  }
  async incrementPanelCounter(guildId) {
    await this.getCounter(guildId)
    await this.sb.bot().from('ticketcounters').update({ panel_counter: (await this.getCounter(guildId)).panel_counter + 1, updated_at: new Date().toISOString() }).eq('guild_id', guildId)
  }
  async decrementPanelCounter(guildId) {
    const c = await this.getCounter(guildId)
    await this.sb.bot().from('ticketcounters').update({ panel_counter: Math.max(0, c.panel_counter - 1), updated_at: new Date().toISOString() }).eq('guild_id', guildId)
  }
  async incrementTicketCounter(guildId) {
    const c = await this.getCounter(guildId)
    await this.sb.bot().from('ticketcounters').update({ ticket_counter: c.ticket_counter + 1, updated_at: new Date().toISOString() }).eq('guild_id', guildId)
    return c.ticket_counter + 1
  }

  // ── Panels ──────────────────────────────────────────────────
  async createPanel(data) {
    const { data: r, error } = await this.sb.bot().from('ticketpanels').insert({ ...data, panel_id: randomUUID() }).select().single()
    if (error) throw error
    return r
  }
  async getPanel(guildId, panelId) { return this.findOne('ticketpanels', { guild_id: guildId, panel_id: panelId }) }
  async getAllPanels(guildId)       { return this.findAll('ticketpanels', { guild_id: guildId }) }
  async updatePanel(guildId, panelId, updates) {
    await this.update('ticketpanels', { ...updates, updated_at: new Date().toISOString() }, { guild_id: guildId, panel_id: panelId })
  }
  async deletePanel(guildId, panelId) { await this.destroy('ticketpanels', { guild_id: guildId, panel_id: panelId }) }

  // ── Tickets ─────────────────────────────────────────────────
  async createTicket(data) {
    const { data: r, error } = await this.sb.bot().from('ticketdata').insert({ ...data, ticket_uuid: randomUUID() }).select().single()
    if (error) throw error
    return r
  }
  async getTicket(channelId)              { return this.findOne('ticketdata', { channel_id: channelId }) }
  async getTicketById(guildId, ticketId)  { return this.findOne('ticketdata', { guild_id: guildId, ticket_id: ticketId }) }
  async getUserTickets(guildId, userId)   { return this.findAll('ticketdata', { guild_id: guildId, user_id: userId }) }
  async getAllOpenTickets(guildId)        { return this.findAll('ticketdata', { guild_id: guildId, status: 'open' }) }

  async claimTicket(channelId, claimedBy) {
    await this.update('ticketdata', { claimed_by: claimedBy, updated_at: new Date().toISOString() }, { channel_id: channelId })
  }
  async closeTicket(channelId, closedBy) {
    await this.update('ticketdata', { status: 'closed', closed_by: closedBy, closed_at: new Date().toISOString(), updated_at: new Date().toISOString() }, { channel_id: channelId })
  }
  async rateTicket(channelId, rating, feedback) {
    await this.update('ticketdata', { rating, feedback, updated_at: new Date().toISOString() }, { channel_id: channelId })
  }
  async deleteTicket(channelId)           { await this.destroy('ticketdata', { channel_id: channelId }) }

  async getTicketStats(guildId) {
    const { count: total }  = await this.sb.bot().from('ticketdata').select('*', { count: 'exact', head: true }).eq('guild_id', guildId)
    const { count: open }   = await this.sb.bot().from('ticketdata').select('*', { count: 'exact', head: true }).match({ guild_id: guildId, status: 'open' })
    const { count: closed } = await this.sb.bot().from('ticketdata').select('*', { count: 'exact', head: true }).match({ guild_id: guildId, status: 'closed' })
    return { total: total ?? 0, open: open ?? 0, closed: closed ?? 0 }
  }

  async isTranscriptSent(channelId)  { const t = await this.getTicket(channelId); return !!t?.transcript_sent }
  async markTranscriptSent(channelId){ await this.update('ticketdata', { transcript_sent: true }, { channel_id: channelId }) }
  async isReviewSent(channelId)      { const t = await this.getTicket(channelId); return !!t?.review_sent }
  async markReviewSent(channelId)    { await this.update('ticketdata', { review_sent: true }, { channel_id: channelId }) }
}
