import { Command } from '#structures/classes/Command'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js'
import { db } from '#database/DatabaseManager'
import { config } from '#config/config'

const ROLE  = { OWNER:'👑 Owner', MANAGER:'⭐ Manager', ADMIN:'🛡️ Admin', AGENSI:'🎭 Agensi', KREATOR:'🎨 Kreator', USER:'👤 Member' }
const TIER  = { VVIP:'💎 VVIP', VIP:'💜 VIP', DONATUR:'💙 Donatur' }
const WEB   = config.soraku.webUrl

export default class ProfileCommand extends Command {
  constructor() {
    super({
      name: 'profile', aliases: ['p', 'profil'], category: 'Soraku',
      description: 'Lihat profil Soraku Community kamu atau member lain',
      usage: 'profile [@user]', cooldown: 5,
      enabledSlash: true,
      slashData: {
        name: 'profile', description: 'Lihat profil Soraku Community 👤',
        options: [{ name: 'user', description: 'User Discord (kosong = kamu)', type: 6, required: false }],
      },
    })
  }

  async execute(message, args, client) {
    const target = message.mentions.users.first() ?? message.author
    const isSelf = target.id === message.author.id
    const user   = await db.soraku.get(target.id)

    if (!user) {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel('Daftar').setEmoji('✨').setStyle(ButtonStyle.Link).setURL(WEB + '/register'),
        new ButtonBuilder().setLabel('Link Akun').setEmoji('🔗').setStyle(ButtonStyle.Link).setURL(WEB + '/login'),
      )
      return message.reply({ embeds: [client.embed().setDescription(isSelf
        ? `Kamu belum punya akun Soraku!\nDaftar di **${WEB}** ✨`
        : `**${target.username}** belum menghubungkan akun Soraku.`
      ).setFooter({ text: 'Soraku Community' })], components: [row] })
    }

    if (user.isprivate && !isSelf) {
      return message.reply({ embeds: [client.embed().setDescription('🔒 Profil ini diprivate.').setFooter({ text: 'Soraku Community' })] })
    }

    const isSupporter = user.supporterrole && (!user.supporteruntil || new Date(user.supporteruntil) > new Date())
    const embed = new EmbedBuilder()
      .setColor('#7c3aed')
      .setTitle((ROLE[user.role]?.split(' ')[0] ?? '👤') + ' ' + (user.displayname ?? user.username))
      .setURL(WEB + '/profile/' + user.username)
      .setThumbnail(user.avatarurl ?? target.displayAvatarURL())
      .addFields(
        { name: 'Username', value: '@' + (user.username ?? '—'), inline: true },
        { name: 'Role',     value: ROLE[user.role] ?? '👤 Member', inline: true },
      )
    if (isSupporter) embed.addFields({ name: 'Supporter', value: TIER[user.supporterrole] ?? user.supporterrole, inline: true })
    if (user.bio)    embed.addFields({ name: 'Bio', value: user.bio.slice(0, 100) })
    embed.setFooter({ text: 'Soraku Community' }).setTimestamp()

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('Lihat Profil').setEmoji('🔗').setStyle(ButtonStyle.Link).setURL(WEB + '/profile/' + user.username),
    )
    if (isSelf) row.addComponents(
      new ButtonBuilder().setLabel('Edit Profil').setEmoji('✏️').setStyle(ButtonStyle.Link).setURL(WEB + '/profile/me'),
    )
    message.reply({ embeds: [embed], components: [row] })
  }

  async executeSlash(interaction, client) {
    await interaction.deferReply()
    const target = interaction.options.getUser('user') ?? interaction.user
    const isSelf = target.id === interaction.user.id
    const user   = await db.soraku.get(target.id)

    if (!user) {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel('Daftar').setEmoji('✨').setStyle(ButtonStyle.Link).setURL(WEB + '/register'),
        new ButtonBuilder().setLabel('Link Akun').setEmoji('🔗').setStyle(ButtonStyle.Link).setURL(WEB + '/login'),
      )
      return interaction.editReply({ embeds: [client.embed().setDescription(isSelf
        ? `Kamu belum punya akun Soraku!\nDaftar di **${WEB}** ✨`
        : `**${target.username}** belum menghubungkan akun Soraku.`
      ).setFooter({ text: 'Soraku Community' })], components: [row] })
    }

    if (user.isprivate && !isSelf) {
      return interaction.editReply({ embeds: [client.embed().setDescription('🔒 Profil ini diprivate.').setFooter({ text: 'Soraku Community' })] })
    }

    const isSupporter = user.supporterrole && (!user.supporteruntil || new Date(user.supporteruntil) > new Date())
    const embed = new EmbedBuilder()
      .setColor('#7c3aed')
      .setTitle((ROLE[user.role]?.split(' ')[0] ?? '👤') + ' ' + (user.displayname ?? user.username))
      .setURL(WEB + '/profile/' + user.username)
      .setThumbnail(user.avatarurl ?? target.displayAvatarURL())
      .addFields({ name: 'Username', value: '@' + (user.username ?? '—'), inline: true }, { name: 'Role', value: ROLE[user.role] ?? '👤 Member', inline: true })
    if (isSupporter) embed.addFields({ name: 'Supporter', value: TIER[user.supporterrole] ?? user.supporterrole, inline: true })
    if (user.bio) embed.addFields({ name: 'Bio', value: user.bio.slice(0, 100) })
    embed.setFooter({ text: 'Soraku Community' }).setTimestamp()

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('Lihat Profil').setEmoji('🔗').setStyle(ButtonStyle.Link).setURL(WEB + '/profile/' + user.username),
    )
    if (isSelf) row.addComponents(new ButtonBuilder().setLabel('Edit Profil').setEmoji('✏️').setStyle(ButtonStyle.Link).setURL(WEB + '/profile/me'))
    await interaction.editReply({ embeds: [embed], components: [row] })
  }
}
