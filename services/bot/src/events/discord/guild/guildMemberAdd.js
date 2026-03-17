import { db } from "#database/DatabaseManager";
import { logger } from "#utils/logger";

export default {
  name: "guildMemberAdd",
  async execute(member, client) {
    if (member.user.bot) return;

    const guildId = member.guild.id;

    // FIX: Guard — only track invites if tracking is enabled for this guild
    if (!await db.isInviteTrackingEnabled(guildId)) return;

    try {
      const oldInvites = client.inviteCache?.get(guildId) || new Map();
      
      // Guard: cek permission Manage Guild sebelum fetch invites
      // Cek cache dulu, lalu fallback ke hasPermission
      const me = member.guild.members.me;
      const hasManageGuild = me?.permissions?.has('ManageGuild') || 
                              me?.permissions?.has(8n) || // ADMINISTRATOR
                              false;
      if (!hasManageGuild) {
        logger.debug('InviteTracker', `Bot tidak punya permission ManageGuild di ${member.guild.name}, skip invite tracking`);
        return;
      }

      // Wrap fetch dengan try-catch untuk handle 50013 gracefully
      let newInvites;
      try {
        newInvites = await member.guild.invites.fetch({ cache: false });
      } catch (fetchErr) {
        if (fetchErr?.code === 50013) {
          logger.debug('InviteTracker', `Missing Permissions fetch invites di ${member.guild.name} (${guildId}), skip`);
        } else {
          logger.warn('InviteTracker', `Gagal fetch invites di ${member.guild.name}:`, fetchErr?.message);
        }
        return;
      }

      let usedInvite = null;
      let inviter = null;

      for (const [code, invite] of newInvites) {
        const oldInvite = oldInvites.get(code);
        if (oldInvite && invite.uses > oldInvite.uses) {
          usedInvite = invite;
          inviter = invite.inviter;
          break;
        }
      }

      if (!usedInvite) {
        for (const [code, invite] of newInvites) {
          if (!oldInvites.has(code) && invite.uses > 0) {
            usedInvite = invite;
            inviter = invite.inviter;
            break;
          }
        }
      }

      // Update invite cache for this guild
      const cacheMap = new Map();
      for (const [code, invite] of newInvites) {
        cacheMap.set(code, { uses: invite.uses, inviterId: invite.inviter?.id });
      }
      if (!client.inviteCache) client.inviteCache = new Map();
      client.inviteCache.set(guildId, cacheMap);

      if (inviter && inviter.id !== member.id) {
        const memberCreatedAt = member.user.createdTimestamp;
        const now = Date.now();
        const accountAge = now - memberCreatedAt;
        const sevenDays = 7 * 24 * 60 * 60 * 1000;

        await db.invites.incrementTracked(guildId, inviter.id, 1);

        if (accountAge < sevenDays) {
          await db.invites.incrementFake(guildId, inviter.id, 1);
          logger.debug("InviteTracker", `Fake invite detected for ${member.user.tag} (account < 7 days old)`);
        }

        await db.invites.setInviterData(guildId, member.id, inviter.id, usedInvite.code);

        logger.debug("InviteTracker", `${member.user.tag} was invited by ${inviter.tag} using code ${usedInvite.code}`);

        const inviterData = await db.invites.getMemberInvites(guildId, inviter.id);
        const effectiveInvites = await db.invites.getEffectiveInvites(inviterData);

        const eligibleRanks = await db.invites.getEligibleRanks(guildId, effectiveInvites);
        if (eligibleRanks.length > 0) {
          try {
            const inviterMember = await member.guild.members.fetch(inviter.id).catch(() => null);
            if (inviterMember) {
              for (const rank of eligibleRanks) {
                const role = member.guild.roles.cache.get(rank.role_id);
                if (role && !inviterMember.roles.cache.has(role.id)) {
                  await inviterMember.roles.add(role).catch(() => null);
                  logger.debug("InviteTracker", `Assigned invite rank ${role.name} to ${inviter.tag}`);
                }
              }
            }
          } catch (error) {
            logger.error("InviteTracker", `Failed to assign invite ranks:`, error);
          }
        }
      } else {
        await db.invites.ensureMember(guildId, member.id);
        logger.debug("InviteTracker", `${member.user.tag} joined but inviter could not be determined`);
      }
    } catch (error) {
      logger.error("InviteTracker", `Error tracking invite for ${member.user.tag}:`, error);
    }
  },
};
