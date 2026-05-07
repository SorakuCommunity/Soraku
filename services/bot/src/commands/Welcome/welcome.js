import { Command } from '#structures/classes/Command'
import {
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
  ChannelType, PermissionFlagsBits,
} from 'discord.js'
import { db } from '#database/DatabaseManager'
import { config } from '#config/config'

const WEB = config.soraku?.webUrl ?? 'https://www.soraku.id'

// ─── Default welcome message ────────────────────────────────────────────────
const DEFAULT_MSG = `Selamat datang di **{server}**, {user}! 🌸\nKamu adalah member ke-**{count}**!\nJangan lupa baca peraturan dan nikmati komunitas kita~ ✨`

// ─── Variable guide ─────────────────────────────────────────────────────────
const VARIABLES = [
  ['`{user}`',       'Mention member (@user)'],
  ['`{username}`',   'Username Discord'],
  ['`{displayname}`','Display name'],
  ['`{server}`',     'Nama server'],
  ['`{count}`',      'Jumlah member saat ini'],
  ['`{membercount}`','Jumlah member (sama dengan count)'],
]

function parseMsg(template, member) {
  return template
    .replace(/{user}/g,        `<@${member.id}>`)
    .replace(/{username}/g,    member.user.username)
    .replace(/{displayname}/g, member.displayName ?? member.user.username)
    .replace(/{server}/g,      member.guild.name)
    .replace(/{count}/g,       member.guild.memberCount)
    .replace(/{membercount}/g, member.guild.memberCount)
}

export default class WelcomeCommand extends Command {
  constructor() {
    super({
      name: 'welcome',
      aliases: ['selamat', 'wcm'],
      category: 'Welcome',
      description: 'Setup pesan selamat datang untuk member baru',
      usage: 'welcome <set/disable/test/info>',
      cooldown: 5,
      permissions: [PermissionFlagsBits.ManageGuild],
      enabledSlash: false,
    })
  }

  async execute(message, args) {
    const sub = args[0]?.toLowerCase()

    if (!sub || sub === 'info') return this.showInfo(message)
    if (sub === 'set')     return this.setWelcome(message, args)
    if (sub === 'channel') return this.setChannel(message, args)
    if (sub === 'message') return this.setMessage(message, args)
    if (sub === 'test')    return this.testWelcome(message)
    if (sub === 'disable' || sub === 'off') return this.disableWelcome(message)
    if (sub === 'enable'  || sub === 'on')  return this.enableWelcome(message)
    if (sub === 'reset')   return this.resetWelcome(message)

    return this.showInfo(message)
  }

  // ─── show current config ────────────────────────────────────────────────
  async showInfo(message) {
    const settings = await db.guild.getWelcomeSettings(message.guild.id)
    const channel  = settings?.channel_id
      ? message.guild.channels.cache.get(settings.channel_id)
      : null

    const embed = new EmbedBuilder()
      .setColor(settings?.enabled ? 0x57F287 : 0x5865F2)
      .setAuthor({ name: 'Welcome System — Soraku', iconURL: message.client.user.displayAvatarURL() })
      .setTitle('⚙️ Konfigurasi Welcome')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addFields(
        {
          name: '📌 Status',
          value: settings?.enabled ? '🟢 **Aktif**' : '🔴 **Nonaktif**',
          inline: true,
        },
        {
          name: '📺 Channel',
          value: channel ? `<#${channel.id}>` : '`Belum diset`',
          inline: true,
        },
        {
          name: '🌸 Member Saat Ini',
          value: `**${message.guild.memberCount.toLocaleString('id-ID')}** member`,
          inline: true,
        },
        {
          name: '💬 Pesan Welcome',
          value: settings?.message
            ? `\`\`\`${settings.message.slice(0, 200)}${settings.message.length > 200 ? '...' : ''}\`\`\``
            : `\`\`\`${DEFAULT_MSG}\`\`\``,
        },
        {
          name: '📝 Variabel Tersedia',
          value: VARIABLES.map(([v, d]) => `${v} → ${d}`).join('\n'),
        },
        {
          name: '🔧 Cara Penggunaan',
          value: [
            '`!welcome set #channel` → set channel + aktifkan',
            '`!welcome message <teks>` → ubah pesan welcome',
            '`!welcome test` → test welcome di channel saat ini',
            '`!welcome enable/disable` → aktifkan/nonaktifkan',
            '`!welcome reset` → reset ke default',
          ].join('\n'),
        },
      )
       .setFooter({ text: 'Soraku', iconURL: message.client.user.displayAvatarURL() })
      .setTimestamp()

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Test Welcome')
        .setEmoji('🧪')
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('welcome_test'),
      new ButtonBuilder()
        .setLabel(settings?.enabled ? 'Nonaktifkan' : 'Aktifkan')
        .setEmoji(settings?.enabled ? '🔴' : '🟢')
        .setStyle(settings?.enabled ? ButtonStyle.Danger : ButtonStyle.Success)
        .setCustomId('welcome_toggle'),
    )

    const msg = await message.reply({ embeds: [embed], components: [row] })

    // Handle button click
    const collector = msg.createMessageComponentCollector({ time: 30_000 })
    collector.on('collect', async i => {
      if (i.user.id !== message.author.id) {
        return i.reply({ content: '❌ Bukan kamu yang menjalankan command ini.', ephemeral: true })
      }
      if (i.customId === 'welcome_test') {
        await i.deferUpdate()
        await this._sendWelcomeCard(message.channel, message.member, await db.guild.getWelcomeSettings(message.guild.id))
      }
      if (i.customId === 'welcome_toggle') {
        await i.deferUpdate()
        const current = await db.guild.getWelcomeSettings(message.guild.id)
        await db.guild.setWelcomeSetting(message.guild.id, 'enabled', !current?.enabled)
        await i.editReply({ content: `✅ Welcome system ${!current?.enabled ? '**diaktifkan**' : '**dinonaktifkan**'}.`, embeds: [], components: [] })
      }
    })
    collector.on('end', () => msg.edit({ components: [] }).catch(() => {}))
  }

  // ─── set channel ────────────────────────────────────────────────────────
  async setWelcome(message, args) {
    const channel = message.mentions.channels.first()
      ?? message.guild.channels.cache.get(args[1])
      ?? message.channel

    if (channel.type !== ChannelType.GuildText) {
      return message.reply({ embeds: [this._errEmbed('❌ Channel harus berupa teks channel!')] })
    }

    await db.guild.setWelcomeSetting(message.guild.id, 'channel_id', channel.id)
    await db.guild.setWelcomeSetting(message.guild.id, 'enabled', true)

    const embed = new EmbedBuilder()
      .setColor(0x57F287)
      .setTitle('✅ Welcome Channel Diset!')
      .setDescription(`Channel welcome berhasil diset ke <#${channel.id}>.\nWelcome system otomatis **diaktifkan**.`)
      .addFields({ name: '🧪 Test Sekarang', value: 'Ketik `!welcome test` untuk mencoba.' })
      .setFooter({ text: 'Soraku' })
      .setTimestamp()

    return message.reply({ embeds: [embed] })
  }

  // ─── set message ────────────────────────────────────────────────────────
  async setMessage(message, args) {
    const text = args.slice(1).join(' ')
    if (!text) {
      return message.reply({ embeds: [this._errEmbed('❌ Tulis pesan welcome-nya!\nContoh: `!welcome message Halo {user}, selamat datang di {server}! 🌸`')] })
    }

    await db.guild.setWelcomeSetting(message.guild.id, 'message', text)

    const embed = new EmbedBuilder()
      .setColor(0x57F287)
      .setTitle('✅ Pesan Welcome Diperbarui!')
      .addFields(
        { name: '💬 Pesan Baru', value: `\`\`\`${text.slice(0, 300)}\`\`\`` },
        { name: '👀 Preview', value: parseMsg(text, message.member) },
      )
      .setFooter({ text: 'Ketik !welcome test untuk mencoba' })
      .setTimestamp()

    return message.reply({ embeds: [embed] })
  }

  // ─── test welcome ────────────────────────────────────────────────────────
  async testWelcome(message) {
    const settings = await db.guild.getWelcomeSettings(message.guild.id)
    const channel  = settings?.channel_id
      ? message.guild.channels.cache.get(settings.channel_id)
      : message.channel

    await this._sendWelcomeCard(channel, message.member, settings)
    if (channel.id !== message.channel.id) {
      message.reply({ embeds: [new EmbedBuilder().setColor(0x57F287).setDescription(`✅ Welcome card terkirim ke <#${channel.id}>!`)] })
    }
  }

  // ─── disable ─────────────────────────────────────────────────────────────
  async disableWelcome(message) {
    await db.guild.setWelcomeSetting(message.guild.id, 'enabled', false)
    return message.reply({ embeds: [new EmbedBuilder().setColor(0xED4245).setDescription('🔴 Welcome system **dinonaktifkan**.')] })
  }

  // ─── enable ──────────────────────────────────────────────────────────────
  async enableWelcome(message) {
    const settings = await db.guild.getWelcomeSettings(message.guild.id)
    if (!settings?.channel_id) {
      return message.reply({ embeds: [this._errEmbed('❌ Set channel dulu!\n`!welcome set #channel`')] })
    }
    await db.guild.setWelcomeSetting(message.guild.id, 'enabled', true)
    return message.reply({ embeds: [new EmbedBuilder().setColor(0x57F287).setDescription('🟢 Welcome system **diaktifkan**.')] })
  }

  // ─── reset ───────────────────────────────────────────────────────────────
  async resetWelcome(message) {
    await db.guild.resetWelcomeSettings(message.guild.id)
    return message.reply({ embeds: [new EmbedBuilder().setColor(0x57F287).setDescription('🔄 Welcome settings **direset** ke default.')] })
  }

  // ─── send beautiful welcome card ─────────────────────────────────────────
  async _sendWelcomeCard(channel, member, settings) {
    const guild = member.guild
    const msg   = settings?.message ?? DEFAULT_MSG
    const text  = parseMsg(msg, member)

    // Format join date
    const joined = `<t:${Math.floor(Date.now() / 1000)}:R>`
    const created = `<t:${Math.floor(member.user.createdTimestamp / 1000)}:D>`

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setAuthor({
        name:    `Member Baru — ${guild.name}`,
        iconURL: guild.iconURL({ dynamic: true }) ?? undefined,
      })
      .setTitle(`🌸 Selamat Datang!`)
      .setDescription(text)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .addFields(
        {
          name:   '👤 Member',
          value:  `${member} (${member.user.username})`,
          inline: true,
        },
        {
          name:   '👥 Total Member',
          value:  `**${guild.memberCount.toLocaleString('id-ID')}** orang`,
          inline: true,
        },
        {
          name:   '📅 Bergabung',
          value:  joined,
          inline: true,
        },
        {
          name:   '🗓️ Akun Dibuat',
          value:  created,
          inline: true,
        },
        {
          name:   '🆔 User ID',
          value:  `\`${member.id}\``,
          inline: true,
        },
        {
          name:   '🌐 Platform',
          value:  member.user.bot ? '🤖 Bot' : '👤 User',
          inline: true,
        },
      )
      .setImage(guild.bannerURL({ size: 1024 }) ?? null)
       .setFooter({
         text:    `Soraku • Member ke-${guild.memberCount.toLocaleString('id-ID')}`,
         iconURL: member.client.user.displayAvatarURL(),
       })
      .setTimestamp()

    // Tombol aksi
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

    await channel.send({ content: `${member}`, embeds: [embed], components: [row] }).catch(() => {})
  }

  _errEmbed(desc) {
    return new EmbedBuilder().setColor(0xED4245).setDescription(desc)
  }
}
