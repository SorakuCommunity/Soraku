import { Guild }      from '#db/Guild'
import { User }       from '#db/User'
import { Playlists }  from '#db/Playlists'
import { Premium }    from '#db/Premium'
import { Moderation } from '#db/Moderation'
import { Ticket }     from '#db/Ticket'
import { Invites }    from '#db/Invites'
import { SorakuUser } from '#db/SorakuUser'
import { logger }     from '#utils/logger'

export class DatabaseManager {
  constructor() {
    this.guild      = new Guild()
    this.user       = new User()
    this.premium    = new Premium()
    this.playlists  = new Playlists()
    this.moderation = new Moderation()
    this.ticket     = new Ticket()
    this.invites    = new Invites()
    this.soraku     = new SorakuUser()
    logger.success('DatabaseManager', 'Supabase databases initialized')
  }

  closeAll() { /* Supabase tidak butuh close */ }

  // ── Guild ──────────────────────────────────────────────────
  getPrefixes(g)              { return this.guild.getPrefixes(g) }
  setPrefixes(g, p)           { return this.guild.setPrefixes(g, p) }
  isGuildBlacklisted(g)       { return this.guild.isBlacklisted(g) }
  blacklistGuild(g, r)        { return this.guild.blacklistGuild(g, r) }
  unblacklistGuild(g)         { return this.guild.unblacklistGuild(g) }

  // ── User ───────────────────────────────────────────────────
  hasNoPrefix(u)              { return this.user.hasNoPrefix(u) }
  setNoPrefix(u, e, x)        { return this.user.setNoPrefix(u, e, x) }
  getUserPrefixes(u)          { return this.user.getUserPrefixes(u) }
  setUserPrefixes(u, p)       { return this.user.setUserPrefixes(u, p) }
  isUserBlacklisted(u)        { return this.user.isBlacklisted(u) }
  blacklistUser(u, r)         { return this.user.blacklistUser(u, r) }
  unblacklistUser(u)          { return this.user.unblacklistUser(u) }
  getUserData(u)              { return this.user.getUserData(u) }

  // ── Premium ────────────────────────────────────────────────
  isUserPremium(u)            { return this.premium.isUserPremium(u) }
  isGuildPremium(g)           { return this.premium.isGuildPremium(g) }
  hasAnyPremium(u, g)         { return this.premium.hasAnyPremium(u, g) }
  grantUserPremium(u,b,e,r)   { return this.premium.grantUserPremium(u,b,e,r) }
  grantGuildPremium(g,b,e,r)  { return this.premium.grantGuildPremium(g,b,e,r) }
  revokeUserPremium(u)        { return this.premium.revokeUserPremium(u) }
  revokeGuildPremium(g)       { return this.premium.revokeGuildPremium(g) }

  // ── Moderation ─────────────────────────────────────────────
  addMute(g,u,m,r,d)          { return this.moderation.addMute(g,u,m,r,d) }
  removeMute(g,u)             { return this.moderation.removeMute(g,u) }
  getActiveMute(g,u)          { return this.moderation.getActiveMute(g,u) }
  getMuteHistory(g,u)         { return this.moderation.getMuteHistory(g,u) }
  resetMutes(g,u)             { return this.moderation.resetMutes(g,u) }
  addWarn(g,u,m,r)            { return this.moderation.addWarn(g,u,m,r) }
  getWarns(g,u)               { return this.moderation.getWarns(g,u) }
  getWarnCount(g,u)           { return this.moderation.getWarnCount(g,u) }
  resetWarns(g,u)             { return this.moderation.resetWarns(g,u) }
  addRemind(g,c,u,m,r)        { return this.moderation.addRemind(g,c,u,m,r) }
  getReminders(u)             { return this.moderation.getReminders(u) }
  getPendingReminders()       { return this.moderation.getPendingReminders() }
  markReminded(id)            { return this.moderation.markReminded(id) }
  resetReminds(u)             { return this.moderation.resetReminds(u) }
  getExpiredMutes()           { return this.moderation.getExpiredMutes() }

  // ── Ticket ─────────────────────────────────────────────────
  getTicketCounter(g)           { return this.ticket.getCounter(g) }
  incrementPanelCounter(g)      { return this.ticket.incrementPanelCounter(g) }
  decrementPanelCounter(g)      { return this.ticket.decrementPanelCounter(g) }
  incrementTicketCounter(g)     { return this.ticket.incrementTicketCounter(g) }
  createTicketPanel(d)          { return this.ticket.createPanel(d) }
  getTicketPanel(g,p)           { return this.ticket.getPanel(g,p) }
  getAllTicketPanels(g)          { return this.ticket.getAllPanels(g) }
  updateTicketPanel(g,p,u)      { return this.ticket.updatePanel(g,p,u) }
  deleteTicketPanel(g,p)        { return this.ticket.deletePanel(g,p) }
  createTicket(d)               { return this.ticket.createTicket(d) }
  getTicket(c)                  { return this.ticket.getTicket(c) }
  getTicketById(g,t)            { return this.ticket.getTicketById(g,t) }
  getUserTickets(g,u)           { return this.ticket.getUserTickets(g,u) }
  getAllOpenTickets(g)           { return this.ticket.getAllOpenTickets(g) }
  claimTicket(c,b)              { return this.ticket.claimTicket(c,b) }
  closeTicket(c,b)              { return this.ticket.closeTicket(c,b) }
  rateTicket(c,r,f)             { return this.ticket.rateTicket(c,r,f) }
  getTicketStats(g)             { return this.ticket.getTicketStats(g) }
  deleteTicket(c)               { return this.ticket.deleteTicket(c) }
  isTranscriptSent(c)           { return this.ticket.isTranscriptSent(c) }
  markTranscriptSent(c)         { return this.ticket.markTranscriptSent(c) }
  isReviewSent(c)               { return this.ticket.isReviewSent(c) }
  markReviewSent(c)             { return this.ticket.markReviewSent(c) }

  // ── Invites ────────────────────────────────────────────────
  isInviteTrackingEnabled(g)         { return this.invites.isTrackingEnabled(g) }
  setInviteTracking(g,e)             { return this.invites.setTrackingEnabled(g,e) }
  getMemberInvites(g,u)              { return this.invites.getMemberInvites(g,u) }
  getEffectiveInvites(m)             { return this.invites.getEffectiveInvites(m) }
  addInvitesToMember(g,u,a)          { return this.invites.addInvites(g,u,a) }
  resetMemberInvites(g,u)            { return this.invites.resetInvites(g,u) }
  setMemberInviter(g,u,i,c)          { return this.invites.setInviterData(g,u,i,c) }
  getInviteRanks(g)                  { return this.invites.getInviteRanks(g) }
  addInviteRank(g,r,i)               { return this.invites.addInviteRank(g,r,i) }
  removeInviteRank(g,r)              { return this.invites.removeInviteRank(g,r) }
  getEligibleInviteRanks(g,i)        { return this.invites.getEligibleRanks(g,i) }
  getInviteLeaderboard(g,l)          { return this.invites.getLeaderboard(g,l) }
  importMemberInvites(g,u,i)         { return this.invites.importInvites(g,u,i) }
}

export const db = new DatabaseManager()
