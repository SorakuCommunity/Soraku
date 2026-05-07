import { db }     from '#database/DatabaseManager'
import { logger } from '#utils/logger'
import {
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
} from 'discord.js'
import { config } from '#config/config'

const WEB = config.soraku?.webUrl ?? 'https://www.soraku.id'

const DEFAULT_MSG = `Selamat datang di **{server}**, {user}! 🌸\nKamu adalah member ke-**{count}**!\nJangan lupa baca peraturan dan nikmati komunitas kita~ ✨`

function parseMsg(template, member) {
  return template
    .replace(/{user}/g,        `<@${member.id}>`)
    .replace(/{username}/g,    member.user.username)
    .replace(/{displayname}/g, member.displayName ?? member.user.username)
    .replace(/{server}/g,      member.guild.name)
    .replace(/{count}/g,       member.guild.memberCount)
    .replace(/{membercount}/g, member.guild.memberCount)
}

async function sendWelcomeCard(channel, member, settings) {
  const guild  = member.guild
  const text   = parseMsg(settings?.message ?? DEFAULT_MSG, member)
  const joined  = `<t:${Math.floor(Date.now() / 1000)}:R>`
  const created = `<t:${Math.floor(member.user.createdTimestamp / 1000)}:D>`

  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setAuthor({
      name:    `Member Baru — ${guild.name}`,
      iconURL: guild.iconURL({ dynamic: true }) ?? undefined,
    })
    .setTitle('🌸 Selamat Datang!')
    .setDescription(text)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
    .addFields(
      { name: '👤 Member',       value: `${member} (${member.user.username})`, inline: true },
      { name: '👥 Total Member', value: `**${guild.memberCount.toLocaleString('id-ID')}** orang`, inline: true },
      { name: '📅 Bergabung',    value: joined,  inline: true },
      { name: '🗓️ Akun Dibuat', value: created, inline: true },
      { name: '🆔 User ID',      value: `\`${member.id}\``, inline: true },
    )
    .setImage(guild.bannerURL({ size: 1024 }) ?? null)
    .setFooter({
       text:    `Soraku • Member ke-${guild.memberCount.toLocaleString('id-ID')}`,
      iconURL: member.client.user.displayAvatarURL(),
    })
    .setTimestamp()

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel('Daftar Soraku')
      .setEmoji('✨')
      .setStyle(ButtonStyle.Link)
      .setURL(`${WEB}/register`),
    new ButtonBuilder()
      .setLabel('Website')
      .setEmoji('🌐')
      .setStyle(ButtonStyle.Link)
      .setURL(WEB),
  )

  await channel.send({ content: `${member}`, embeds: [embed], components: [row] }).catch(err => {
    logger.error('Welcome', `Gagal kirim welcome card: ${err.message}`)
  })
}

export default {
  name: 'guildMemberAdd',
  async execute(member, client) {
    if (member.user.bot) return

    const guildId = member.guild.id

    // ── 1. Welcome card ─────────────────────────────────────────────────────
    try {
      const settings = await db.guild.getWelcomeSettings(guildId)
      if (settings?.enabled && settings?.channel_id) {
        const channel = member.guild.channels.cache.get(settings.channel_id)
        if (channel) {
          await sendWelcomeCard(channel, member, settings)
          logger.debug('Welcome', `Sent welcome card for ${member.user.username} in ${member.guild.name}`)
        }
      }
    } catch (err) {
      logger.error('Welcome', `Error sending welcome card: ${err.message}`)
    }

    // ── 2. Invite tracking ───────────────────────────────────────────────────
    if (!await db.isInviteTrackingEnabled(guildId)) return

    try {
      const oldInvites = client.inviteCache?.get(guildId) || new Map()
      const me = member.guild.members.me
      const hasManageGuild = me?.permissions?.has('ManageGuild') || me?.permissions?.has(8n) || false

      if (!hasManageGuild) {
        logger.debug('InviteTracker', `Bot tidak punya permission ManageGuild di ${member.guild.name}, skip`)
        return
      }

      let newInvites
      try {
        newInvites = await member.guild.invites.fetch({ cache: false })
      } catch (fetchErr) {
        if (fetchErr?.code === 50013) {
          logger.debug('InviteTracker', `Missing Permissions fetch invites di ${member.guild.name} (${guildId}), skip`)
        } else {
          logger.warn('InviteTracker', `Gagal fetch invites di ${member.guild.name}:`, fetchErr?.message)
        }
        return
      }

      let usedInvite = null
      let inviter    = null

      for (const [code, invite] of newInvites) {
        const oldInvite = oldInvites.get(code)
        if (oldInvite && invite.uses > oldInvite.uses) { usedInvite = invite; inviter = invite.inviter; break }
      }
      if (!usedInvite) {
        for (const [code, invite] of newInvites) {
          if (!oldInvites.has(code) && invite.uses > 0) { usedInvite = invite; inviter = invite.inviter; break }
        }
      }

      const cacheMap = new Map()
      for (const [code, invite] of newInvites) cacheMap.set(code, { uses: invite.uses, inviterId: invite.inviter?.id })
      if (!client.inviteCache) client.inviteCache = new Map()
      client.inviteCache.set(guildId, cacheMap)

      if (inviter && inviter.id !== member.id) {
        const accountAge = Date.now() - member.user.createdTimestamp
        const sevenDays  = 7 * 24 * 60 * 60 * 1000

        await db.invites.incrementTracked(guildId, inviter.id, 1)
        if (accountAge < sevenDays) {
          await db.invites.incrementFake(guildId, inviter.id, 1)
          logger.debug('InviteTracker', `Fake invite detected for ${member.user.tag}`)
        }
        await db.invites.setInviterData(guildId, member.id, inviter.id, usedInvite.code)

        const inviterData     = await db.invites.getMemberInvites(guildId, inviter.id)
        const effectiveInvites = await db.invites.getEffectiveInvites(inviterData)
        const eligibleRanks   = await db.invites.getEligibleRanks(guildId, effectiveInvites)

        if (eligibleRanks.length > 0) {
          try {
            const inviterMember = await member.guild.members.fetch(inviter.id).catch(() => null)
            if (inviterMember) {
              for (const rank of eligibleRanks) {
                const role = member.guild.roles.cache.get(rank.role_id)
                if (role && !inviterMember.roles.cache.has(role.id)) {
                  await inviterMember.roles.add(role).catch(() => null)
                  logger.debug('InviteTracker', `Assigned invite rank ${role.name} to ${inviter.tag}`)
                }
              }
            }
          } catch (err) {
            logger.error('InviteTracker', `Failed to assign invite ranks:`, err)
          }
        }
      } else {
        await db.invites.ensureMember(guildId, member.id)
        logger.debug('InviteTracker', `${member.user.tag} joined but inviter not determined`)
      }
    } catch (err) {
      logger.error('InviteTracker', `Error tracking invite for ${member.user.tag}:`, err)
    }
  },
}
