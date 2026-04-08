# Changelog - SorakuBot (Discord Bot)

All notable changes to this project will be documented in this file.

## [v1.0.0] - 7 April 2026

### Core Features

#### Music System

- Lavalink integration for high-quality audio streaming
- Play, pause, skip, stop, queue management
- Shuffle, loop, volume control
- Music card generation with canvas
- Filter system (bassboost, nightcore, etc.)

#### Command Categories

1. **Info**: botinfo, ping, help, team, tos, invite, support, suggest, feedback, report, pp
2. **Developer**: slash registration, reload, blacklist
3. **Giveaway**: gstart, gend, gereroll, gedit, gban, gunban, gpause, gresume
4. **Welcome**: Custom welcome messages
5. **Pfps**: animes, boys, girls, couples, banners
6. **Owner**: backup, noprefix, node, addpremium, leaveserver, serverinvite, unblacklistserver
7. **Invites**: invites, inviter, invitecodes, invite tracker, invite ranks, add invites, invites import
8. **Extra**: autoreact, autoresponder, ltcprice, embed

#### Database Repositories

- User repository (profiles, XP, levels)
- Guild repository (server settings)
- Moderation repository (bans, warns, kicks)
- Premium repository (subscriptions)
- Playlists repository
- Invites repository
- Ticket repository
- SorakuUser repository

#### Event Handlers

- Player events: trackStart, trackEnd, trackStuck, queueEnd, playerCreate, playerDestroy, playerMove
- Node events: connect, disconnect, error
- Discord events: ready, mention buttons, voice states

#### Features

- Auto-reply and autoreact system
- Invite tracking with ranks
- Moderation system (automod)
- Giveaway system
- Ticket system
- Role management

### Infrastructure

- discord.js v14 with sharding
- discord-hybrid-sharding for efficient scaling
- Express for web server
- Supabase for database
- TypeScript/JavaScript (ESM)

### Status

- **Active**: Production-ready with comprehensive feature set

---

_v1.0.0 - present_
