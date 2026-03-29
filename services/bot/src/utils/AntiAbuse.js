/**
 * AntiAbuse — Pure in-memory cooldown & anti-abuse system
 * Tidak lagi extends SQLite Database — semua data disimpan di Map
 * Data reset saat bot restart (by design — cooldown bukan data persisten)
 */
import {
	ContainerBuilder,
	MessageFlags,
	SectionBuilder,
	SeparatorBuilder,
	SeparatorSpacingSize,
	TextDisplayBuilder,
	ThumbnailBuilder,
} from 'discord.js';
import { config } from '#config/config';
import { db } from '#database/DatabaseManager';
import { logger } from '#utils/logger';
import emoji from '#config/emoji';

export class AntiAbuse {
	constructor() {
		// Map<"userId:commandName", { last_used, violation_count, violation_timestamps[] }>
		this._cooldowns = new Map();
		// Map<"userId:commandName", lastNotificationTimestamp>
		this.cooldownNotifications = new Map();
		// Map<userId, lastMentionTimestamp>
		this._mentionLimits = new Map();
	}

	_key(userId, commandName) { return `${userId}:${commandName}` }

	getCooldownData(userId, commandName) {
		return this._cooldowns.get(this._key(userId, commandName)) ?? null;
	}

	async checkCooldown(userId, command, messageOrInteraction) {
		const commandName = command.name;
		const baseCooldown = command.cooldown || 3;
		const hasPremium = await db.hasAnyPremium(userId, null).catch(() => false);
		const actualCooldown = hasPremium ? baseCooldown * 0.5 : baseCooldown;
		const cooldownMs = actualCooldown * 1000;
		const data = this.getCooldownData(userId, commandName);
		if (data && data.last_used) {
			const timeLeft = data.last_used + cooldownMs - Date.now();
			if (timeLeft > 0) {
				this.handleCooldownViolation(userId, commandName, messageOrInteraction);
				return (timeLeft / 1000).toFixed(1);
			}
		}
		return null;
	}

	setCooldown(userId, command) {
		const key = this._key(userId, command.name);
		const existing = this._cooldowns.get(key);
		if (existing) { existing.last_used = Date.now(); }
		else { this._cooldowns.set(key, { last_used: Date.now(), violation_count: 0, violation_timestamps: [] }); }
	}

	handleCooldownViolation(userId, commandName, messageOrInteraction) {
		const now = Date.now();
		const key = this._key(userId, commandName);
		const data = this._cooldowns.get(key);
		if (!data) return;
		data.violation_timestamps = (data.violation_timestamps || []).concat(now).filter(ts => now - ts < 20000);
		data.violation_count = (data.violation_count || 0) + 1;
		if (data.violation_timestamps.length >= 3) {
			this.blacklistUser(userId, messageOrInteraction);
		}
	}

	async blacklistUser(userId, messageOrInteraction) {
		try {
			await db.blacklistUser(userId, 'Automated: Excessive cooldown violations (Anti-abuse system)');
			if (messageOrInteraction) this._sendBlacklistNotification(messageOrInteraction);
			logger.warn('AntiAbuse', `User ${userId} auto-blacklisted for cooldown violations`);
		} catch (error) {
			logger.error('AntiAbuse', `Failed to blacklist user ${userId}`, error);
		}
	}

	_sendBlacklistNotification(messageOrInteraction) {
		try {
			const container = new ContainerBuilder();
			container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`${emoji.get('cross')} **Automatically Blacklisted**`));
			container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small));
			const content =
				`**${emoji.get('folder')} Anti-Abuse System**\n` +
				`├─ **Reason:** Excessive cooldown violations\n` +
				`├─ **Status:** Account access suspended\n` +
				`└─ **Appeal:** Contact support if this is a mistake\n\n` +
				`**${emoji.get('reset')} What happened?**\n` +
				`└─ You triggered cooldown violations too frequently`;
			const thumbnailUrl = config.assets?.defaultThumbnail || config.assets?.defaultTrackArtwork;
			const sectionBuilder = new SectionBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent(content));
			if (thumbnailUrl) sectionBuilder.setThumbnailAccessory(new ThumbnailBuilder().setURL(thumbnailUrl));
			container.addSectionComponents(sectionBuilder);
			container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small));
			const payload = { components: [container], flags: MessageFlags.IsComponentsV2 };
			if (messageOrInteraction.reply) messageOrInteraction.reply(payload).catch(() => {});
			else if (messageOrInteraction.editReply) messageOrInteraction.editReply(payload).catch(() => {});
		} catch (e) {
			logger.error('AntiAbuse', `Failed to send blacklist notification`, e);
		}
	}

	sendCooldownNotification(messageOrInteraction, timeLeft, commandName) {
		try {
			const container = new ContainerBuilder();
			container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`${emoji.get('cross')} **Command on Cooldown**`));
			container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small));
			const content =
				`**${emoji.get('folder')} Cooldown Information**\n` +
				`├─ **Command:** ${commandName}\n` +
				`├─ **Time Remaining:** ${timeLeft}s\n` +
				`└─ **Status:** Please wait before using this command again\n\n` +
				`**${emoji.get('add')} Pro Tip**\n` +
				`└─ Premium users get 50% reduced cooldowns`;
			const thumbnailUrl = config.assets?.defaultThumbnail || config.assets?.defaultTrackArtwork;
			const sectionBuilder = new SectionBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent(content));
			if (thumbnailUrl) sectionBuilder.setThumbnailAccessory(new ThumbnailBuilder().setURL(thumbnailUrl));
			container.addSectionComponents(sectionBuilder);
			container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small));
			const payload = { components: [container], flags: MessageFlags.IsComponentsV2, ephemeral: true };
			if (messageOrInteraction.reply) messageOrInteraction.reply(payload).catch(() => {});
			else if (messageOrInteraction.followUp) messageOrInteraction.followUp(payload).catch(() => {});
		} catch (error) {
			logger.error('AntiAbuse', `Failed to send cooldown notification`, error);
		}
	}

	shouldShowCooldownNotification(userId, commandName) {
		const key = this._key(userId, commandName);
		const now = Date.now();
		if (now - (this.cooldownNotifications.get(key) || 0) >= 5000) {
			this.cooldownNotifications.set(key, now);
			return true;
		}
		return false;
	}

	canShowMentionResponse(userId) {
		const now = Date.now();
		if (now - (this._mentionLimits.get(userId) || 0) >= 10000) {
			this._mentionLimits.set(userId, now);
			return true;
		}
		return false;
	}

	resetCooldown(userId, commandName) {
		this._cooldowns.delete(this._key(userId, commandName));
		this.cooldownNotifications.delete(this._key(userId, commandName));
	}

	resetAll() {
		this._cooldowns.clear();
		this._mentionLimits.clear();
		this.cooldownNotifications.clear();
	}

	async getUserStats(userId, command) {
		const data = this.getCooldownData(userId, command.name);
		const baseCooldown = command.cooldown || 3;
		const hasPremium = await db.hasAnyPremium(userId, null).catch(() => false);
		return { baseCooldown, currentCooldown: hasPremium ? baseCooldown * 0.5 : baseCooldown, violations: data ? data.violation_count : 0, hasPremium };
	}

	cleanupOldData() {
		const cutoff = Date.now() - 24 * 60 * 60 * 1000;
		for (const [k, d] of this._cooldowns.entries()) if (d.last_used < cutoff) this._cooldowns.delete(k);
		for (const [k, ts] of this._mentionLimits.entries()) if (ts < cutoff) this._mentionLimits.delete(k);
		for (const [k, ts] of this.cooldownNotifications.entries()) if (Date.now() - ts > 300000) this.cooldownNotifications.delete(k);
	}
}

export const antiAbuse = new AntiAbuse();
