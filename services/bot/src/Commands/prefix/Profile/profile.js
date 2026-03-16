const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { SorakuUser } = require("../../../Schema/db")

const ROLE = { OWNER:"👑 Owner", MANAGER:"⭐ Manager", ADMIN:"🛡️ Admin", AGENSI:"🎭 Agensi", KREATOR:"🎨 Kreator", USER:"👤 Member" }
const TIER = { VVIP:"💎 VVIP", VIP:"💜 VIP", DONATUR:"💙 Donatur" }

module.exports = {
  name: "profile", aliases: ["p", "profil"], category: "Profile",
  description: "Lihat profil Soraku Community kamu atau member lain", usage: "profile [@user]",
  execute: async (message, _args, client) => {
    const target = message.mentions.users.first() ?? message.author
    const isSelf = target.id === message.author.id

    const user = await SorakuUser.get(target.id)

    if (!user) {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel("Daftar Sekarang").setEmoji("✨").setStyle(ButtonStyle.Link).setURL(client.webUrl + "/register"),
        new ButtonBuilder().setLabel("Link Akun").setEmoji("🔗").setStyle(ButtonStyle.Link).setURL(client.webUrl + "/login"),
      )
      const msg = isSelf
        ? `Kamu belum punya akun Soraku atau belum menghubungkan Discord.\nDaftar di **${client.webUrl}** lalu link akun kamu! ✨`
        : `**${target.username}** belum menghubungkan akun Soraku dengan Discord.`
      return message.reply({ embeds: [client.embed().setDescription(msg).setFooter({ text: "Soraku Community" })], components: [row] })
    }

    if (user.isprivate && !isSelf) {
      return message.reply({ embeds: [client.embed().setDescription("🔒 Profil ini diprivate.").setFooter({ text: "Soraku Community" })] })
    }

    const isSupporter = user.supporterrole && (!user.supporteruntil || new Date(user.supporteruntil) > new Date())

    const embed = client.embed()
      .setTitle((ROLE[user.role]?.split(" ")[0] ?? "👤") + " " + (user.displayname ?? user.username))
      .setURL(client.webUrl + "/profile/" + user.username)
      .setThumbnail(user.avatarurl ?? target.displayAvatarURL())
      .addFields(
        { name: "Username",  value: "@" + (user.username ?? "—"),     inline: true },
        { name: "Role",      value: ROLE[user.role] ?? "👤 Member",   inline: true },
      )

    if (isSupporter) embed.addFields({ name: "Supporter", value: TIER[user.supporterrole] ?? user.supporterrole, inline: true })
    if (user.bio)    embed.addFields({ name: "Bio", value: user.bio.slice(0, 100), inline: false })

    embed.setFooter({ text: "Soraku Community" }).setTimestamp()

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("Lihat Profil").setEmoji("🔗").setStyle(ButtonStyle.Link).setURL(client.webUrl + "/profile/" + user.username),
    )
    if (isSelf) row.addComponents(
      new ButtonBuilder().setLabel("Edit Profil").setEmoji("✏️").setStyle(ButtonStyle.Link).setURL(client.webUrl + "/profile/me"),
    )

    message.reply({ embeds: [embed], components: [row] })
  },
}
