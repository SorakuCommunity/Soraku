const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { SorakuUser } = require("../../../Schema/db")

const ROLE = { OWNER:"👑", MANAGER:"⭐", ADMIN:"🛡️", AGENSI:"🎭", KREATOR:"🎨", USER:"👤" }
const ROLE_LABEL = { OWNER:"Owner", MANAGER:"Manager", ADMIN:"Admin", AGENSI:"Agensi", KREATOR:"Kreator", USER:"Member" }
const TIER = { VVIP:"💎 VVIP", VIP:"💜 VIP", DONATUR:"💙 Donatur" }

module.exports = {
  name: "profile", description: "Lihat profil Soraku Community 👤",
  options: [{ name: "user", description: "User Discord (kosong = profil kamu)", type: 6, required: false }],
  execute: async (interaction, client) => {
    await interaction.deferReply()

    const target = interaction.options.getUser("user") ?? interaction.user
    const isSelf = target.id === interaction.user.id

    const user = await SorakuUser.get(target.id)

    if (!user) {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel("Daftar").setEmoji("✨").setStyle(ButtonStyle.Link).setURL(client.webUrl + "/register"),
        new ButtonBuilder().setLabel("Link Akun").setEmoji("🔗").setStyle(ButtonStyle.Link).setURL(client.webUrl + "/login"),
      )
      const msg = isSelf
        ? `Kamu belum punya akun Soraku atau belum menghubungkan Discord.\nDaftar di **${client.webUrl}** lalu link akun! ✨`
        : `**${target.username}** belum menghubungkan akun Soraku dengan Discord.`
      return interaction.editReply({ embeds: [client.embed().setDescription(msg).setFooter({ text: "Soraku Community" })], components: [row] })
    }

    if (user.isprivate && !isSelf) {
      return interaction.editReply({ embeds: [client.embed().setDescription("🔒 Profil ini diprivate.").setFooter({ text: "Soraku Community" })] })
    }

    const isSupporter = user.supporterrole && (!user.supporteruntil || new Date(user.supporteruntil) > new Date())

    const embed = client.embed()
      .setTitle((ROLE[user.role] ?? "👤") + " " + (user.displayname ?? user.username))
      .setURL(client.webUrl + "/profile/" + user.username)
      .setThumbnail(user.avatarurl ?? target.displayAvatarURL())
      .addFields(
        { name: "Username", value: "@" + (user.username ?? "—"),                                    inline: true },
        { name: "Role",     value: (ROLE[user.role] ?? "👤") + " " + (ROLE_LABEL[user.role] ?? "Member"), inline: true },
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

    await interaction.editReply({ embeds: [embed], components: [row] })
  },
}
