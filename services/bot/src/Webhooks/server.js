import express from 'express'
import { config } from '#config/config'
import { logger } from '#utils/logger'

let _client = null
const _state = { startedAt: null, envMissing: [], discordReady: false, loginError: null }

export function setState(key, val) { _state[key] = val }

export async function startWebhookServer(client) {
  _state.startedAt = new Date().toISOString()
  _client = client

  const app  = express()
  const port = parseInt(process.env.PORT ?? '8080', 10)
  app.use(express.json())

  // Health — Railway butuh ini segera respond
  app.get('/health', (_req, res) => res.json({
    status: 'ok',
    bot:    _client?.isReady() ? 'online' : 'starting',
    uptime: process.uptime(),
    guilds: _client?.guilds?.cache?.size ?? 0,
    version: config.version,
  }))

  // Status — debug info
  app.get('/status', (_req, res) => {
    const required = ['TOKEN', 'CLIENT_ID', 'GUILD_ID', 'SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'SORAKU_WEB_URL', 'WEBHOOK']
    const envCheck = {}
    const aliases  = { SUPABASE_SERVICE_KEY: ['SUPABASE_SERVICE_KEY', 'SUPABASE_SERVICE_ROLE_KEY'] }
    for (const k of required) {
      const keys  = aliases[k] ?? [k]
      envCheck[k] = keys.some(a => !!process.env[a]) ? '✅ set' : '❌ MISSING'
    }
    res.json({
      bot:        _client?.isReady() ? '🟢 online' : '🔴 offline',
      uptime:     Math.floor(process.uptime()) + 's',
      startedAt:  _state.startedAt,
      loginError: _state.loginError ?? null,
      envMissing: _state.envMissing,
      env:        envCheck,
      guilds:     _client?.guilds?.cache?.size ?? 0,
      version:    config.version,
    })
  })

  // Auth middleware untuk webhook routes
  const authMiddleware = (req, res, next) => {
    const secret = req.headers['x-soraku-secret']
    if (secret !== config.soraku.webhook) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    next()
  }

  // POST /webhook/notify — kirim DM ke user Discord
  app.post('/webhook/notify', authMiddleware, async (req, res) => {
    try {
      const { discordId, message } = req.body
      if (!discordId || !message) return res.status(400).json({ error: 'discordId dan message wajib' })
      const user = await _client.users.fetch(discordId).catch(() => null)
      if (!user) return res.status(404).json({ error: 'User tidak ditemukan' })
      await user.send(message)
      res.json({ ok: true })
    } catch (err) {
      logger.error('Webhook', 'notify error', err)
      res.status(500).json({ error: err.message })
    }
  })

  // POST /webhook/role-sync — assign Discord role berdasarkan tier
  app.post('/webhook/role-sync', authMiddleware, async (req, res) => {
    try {
      const { discordId, tier } = req.body
      if (!discordId || !tier) return res.status(400).json({ error: 'discordId dan tier wajib' })

      const guild = _client.guilds.cache.get(config.soraku.guildId)
      if (!guild) return res.status(404).json({ error: 'Guild tidak ditemukan' })

      const member = await guild.members.fetch(discordId).catch(() => null)
      if (!member) return res.status(404).json({ error: 'Member tidak ditemukan' })

      const roleMap = { DONATUR: config.soraku.roles.donatur, VIP: config.soraku.roles.vip, VVIP: config.soraku.roles.vvip }
      // Hapus semua supporter roles dulu
      for (const roleId of Object.values(roleMap)) {
        if (member.roles.cache.has(roleId)) await member.roles.remove(roleId).catch(() => {})
      }
      // Tambah role baru
      if (roleMap[tier]) await member.roles.add(roleMap[tier]).catch(() => {})

      res.json({ ok: true, tier, discordId })
    } catch (err) {
      logger.error('Webhook', 'role-sync error', err)
      res.status(500).json({ error: err.message })
    }
  })

  // POST /webhook/event-announce — announce event ke channel Discord
  app.post('/webhook/event-announce', authMiddleware, async (req, res) => {
    try {
      const { title, description, startAt, eventUrl } = req.body
      if (!title) return res.status(400).json({ error: 'title wajib' })

      const channelId = config.soraku.channelId
      if (!channelId) return res.json({ ok: false, reason: 'CHANNEL_ID not set' })

      const channel = _client.channels.cache.get(channelId)
      if (!channel) return res.status(404).json({ error: 'Channel tidak ditemukan' })

      const { EmbedBuilder } = await import('discord.js')
      const embed = new EmbedBuilder()
        .setTitle('📅 ' + title)
        .setColor('#7c3aed')
        .setTimestamp()
      if (description) embed.setDescription(description)
      if (startAt) embed.addFields({ name: '🕐 Mulai', value: `<t:${Math.floor(new Date(startAt).getTime() / 1000)}:F>`, inline: true })
      if (eventUrl) embed.setURL(eventUrl)
      embed.setFooter({ text: 'Soraku Community • ' + config.soraku.webUrl })

      await channel.send({ embeds: [embed] })
      res.json({ ok: true })
    } catch (err) {
      logger.error('Webhook', 'event-announce error', err)
      res.status(500).json({ error: err.message })
    }
  })

  app.listen(port, '0.0.0.0', () => {
    logger.success('Webhook', `HTTP server started on port ${port}`)
  })
}
