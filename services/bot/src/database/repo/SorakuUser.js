import { Database, soraku } from '#structures/classes/Database'

export class SorakuUser extends Database {
  constructor() { super() }

  async get(discordId) {
    const { data } = await soraku().from('users')
      .select('id,username,displayname,avatarurl,bio,role,supporterrole,supporteruntil,isprivate')
      .eq('discordid', discordId).maybeSingle()
    return data
  }

  async link(userId, discordId) {
    const { error } = await soraku().from('users').update({ discordid: discordId }).eq('id', userId)
    if (error) throw error
  }

  async syncRole(discordId, tier) {
    await soraku().from('users').update({ supporterrole: tier, supportersource: 'discord' }).eq('discordid', discordId)
  }
}
