import { Command } from '#structures/classes/Command'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js'
import { config } from '#config/config'

const WEB = config.soraku.webUrl

export default class LinkCommand extends Command {
  constructor() {
    super({
      name: 'link', aliases: ['daftar', 'register'], category: 'Soraku',
      description: 'Hubungkan akun Discord kamu ke Soraku Community',
      usage: 'link', cooldown: 5,
      enabledSlash: true,
      slashData: { name: 'link', description: 'Hubungkan akun Discord ke Soraku Community 🔗' },
    })
  }

  _buildEmbed(client) {
    return new EmbedBuilder()
      .setColor('#7c3aed')
      .setTitle('🌸 Bergabung dengan Soraku Community')
      .setDescription(
        `Hubungkan akun Discord kamu dengan **Soraku Community**:\n\n` +
        `💜 **Profile** — tampil di website\n` +
        `🎨 **Galeri** — upload & share karya\n` +
        `📖 **Blog & Event** — ikuti kegiatan komunitas\n` +
        `👑 **Supporter** — DONATUR / VIP / VVIP\n\n` +
        `Login pakai Discord untuk menghubungkan akun! ✨`
      )
      .setThumbnail(client.user.displayAvatarURL())
      .addFields({ name: '🌐 Website', value: `[${WEB.replace('https://', '')}](${WEB})`, inline: true })
      .setFooter({ text: 'Soraku Community' })
      .setTimestamp()
  }

  _buildRow() {
    return new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('Daftar').setEmoji('✨').setStyle(ButtonStyle.Link).setURL(WEB + '/register'),
      new ButtonBuilder().setLabel('Login').setEmoji('🔑').setStyle(ButtonStyle.Link).setURL(WEB + '/login'),
      new ButtonBuilder().setLabel('Website').setEmoji('🌐').setStyle(ButtonStyle.Link).setURL(WEB),
    )
  }

  async execute(message, _args, client) {
    message.reply({ embeds: [this._buildEmbed(client)], components: [this._buildRow()] })
  }

  async executeSlash(interaction, client) {
    await interaction.reply({ embeds: [this._buildEmbed(client)], components: [this._buildRow()], ephemeral: true })
  }
}
