"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Save, Loader2, CheckCircle2, AlertCircle, X, LogOut,
  User, AtSign, FileText, Globe, Lock, Camera, Link as LinkIcon,
  Shield, Sparkles, Settings, UserCircle, RefreshCw,
  Instagram, Twitter, Youtube, Calendar, ExternalLink,
  Pencil, Zap, Trophy, Heart, ImageIcon, TrendingUp, Star,
} from "lucide-react";
import { DiscordIcon } from "@/components/icons/custom-icons";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LevelData { level: number; xpcurrent: number; xprequired: number; reputationscore: number }
interface BadgeData  { id: string; badgename: string; badgeicon: string; badgecls?: string }

interface Profile {
  id: string; username: string | null; displayname: string | null;
  avatarurl: string | null; coverurl: string | null; bio: string | null;
  role: string; supporterrole: string | null; sociallinks: Record<string, string>;
  isprivate: boolean; createdat: string;
  level: LevelData; galleryCount: number; supportTotal: number; badges: BadgeData[];
}

// ─── Role / Support config ────────────────────────────────────────────────────

const ROLE_META: Record<string, { label: string; svg: string; badgeCls: string; glowCls: string; color: string }> = {
  OWNER:   { label: "Owner",   svg: "owner.svg",   color: "#eab308", badgeCls: "text-yellow-300 bg-yellow-400/15 border-yellow-400/40", glowCls: "from-yellow-500/18 to-transparent" },
  MANAGER: { label: "Manager", svg: "owner.svg",   color: "#fbbf24", badgeCls: "text-yellow-200 bg-yellow-300/12 border-yellow-300/30", glowCls: "from-yellow-400/12 to-transparent" },
  ADMIN:   { label: "Admin",   svg: "admin.svg",   color: "#ef4444", badgeCls: "text-red-300    bg-red-400/15    border-red-400/35",    glowCls: "from-red-500/14    to-transparent" },
  AGENSI:  { label: "Agensi",  svg: "admin.svg",   color: "#f97316", badgeCls: "text-orange-300 bg-orange-400/15 border-orange-400/30", glowCls: "from-orange-500/12 to-transparent" },
  KREATOR: { label: "Kreator", svg: "premium.svg", color: "#a855f7", badgeCls: "text-purple-300 bg-purple-400/15 border-purple-400/35", glowCls: "from-purple-500/14 to-transparent" },
  USER:    { label: "Member",  svg: "member.svg",  color: "#6b7280", badgeCls: "text-gray-300   bg-gray-400/10   border-gray-400/25",   glowCls: "from-primary/6     to-transparent" },
};

const SUPPORT_META: Record<string, { label: string; cls: string }> = {
  VVIP:    { label: "✨ VVIP",    cls: "text-purple-300 bg-purple-400/15 border-purple-400/40" },
  VIP:     { label: "⭐ VIP",     cls: "text-green-300  bg-green-400/15  border-green-400/35"  },
  DONATUR: { label: "💚 Donatur", cls: "text-green-400  bg-green-500/10  border-green-500/25"  },
};

const LEVEL_TITLES: [number, string][] = [
  [50, "Soraku Legend"], [40, "Community Hero"], [30, "Elite Member"],
  [20, "Senpai"], [10, "Otaku"], [1, "Newcomer"],
];
const getLevelTitle = (lv: number) => LEVEL_TITLES.find(([m]) => lv >= m)?.[1] ?? "Newcomer";

const SOCIAL_FIELDS = [
  { key: "discord",   label: "Discord",     placeholder: "username",            Icon: DiscordIcon },
  { key: "instagram", label: "Instagram",   placeholder: "@username",            Icon: Instagram   },
  { key: "x",         label: "X / Twitter", placeholder: "@username",            Icon: Twitter     },
  { key: "youtube",   label: "YouTube",     placeholder: "URL channel",          Icon: Youtube     },
  { key: "website",   label: "Website",     placeholder: "https://yoursite.id",  Icon: Globe       },
] as const;

const SOCIAL_CONFIG = [
  { key: "discord",   Icon: DiscordIcon, getHref: (v: string) => `https://discord.com/users/${v}`                        },
  { key: "instagram", Icon: Instagram,   getHref: (v: string) => `https://instagram.com/${v.replace("@","")}`            },
  { key: "x",         Icon: Twitter,     getHref: (v: string) => `https://x.com/${v.replace("@","")}`                    },
  { key: "youtube",   Icon: Youtube,     getHref: (v: string) => v.startsWith("http") ? v : `https://youtube.com/${v}`   },
  { key: "website",   Icon: Globe,       getHref: (v: string) => v.startsWith("http") ? v : `https://${v}`               },
] as const;

type Tab = "profile" | "settings";

// ─── XP Ring (circular SVG progress) ─────────────────────────────────────────

function XpRing({ pct, color, size = 96 }: { pct: number; color: string; size?: number }) {
  const r = (size - 8) / 2; const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="absolute inset-0 -rotate-90 pointer-events-none">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3.5" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ}
        style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)" }} />
    </svg>
  );
}

// ─── Stat Box ─────────────────────────────────────────────────────────────────

function StatBox({ icon: Icon, label, value, iconCls = "" }: {
  icon: React.ElementType; label: string; value: string | number; iconCls?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-border/50 bg-card/30 px-3 py-3.5 text-center">
      <Icon className={cn("h-4 w-4 mb-0.5", iconCls || "text-muted-foreground/40")} />
      <span className="text-base font-black">{value}</span>
      <span className="text-[10px] text-muted-foreground/45 leading-tight">{label}</span>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ msg, type, onClose }: { msg: string; type: "ok" | "err"; onClose: () => void }) {
  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-3.5 shadow-2xl",
      "text-sm font-medium backdrop-blur-xl animate-in slide-in-from-bottom-3 fade-in duration-200 max-w-sm",
      type === "ok" ? "border-green-500/30 bg-card/95 text-green-400" : "border-destructive/30 bg-card/95 text-destructive"
    )}>
      {type === "ok" ? <CheckCircle2 className="h-4 w-4 flex-shrink-0" /> : <AlertCircle className="h-4 w-4 flex-shrink-0" />}
      <span className="flex-1">{msg}</span>
      <button onClick={onClose} className="opacity-40 hover:opacity-80 transition-opacity"><X className="h-3.5 w-3.5" /></button>
    </div>
  );
}

// ─── Form primitives ──────────────────────────────────────────────────────────

function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input className={cn(
      "w-full rounded-xl border border-border/60 bg-card/40 px-4 py-2.5 text-sm outline-none",
      "placeholder:text-muted-foreground/25 focus:border-primary/40 focus:bg-card/60 focus:ring-2 focus:ring-primary/10",
      "disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150", className
    )} {...props} />
  );
}

function Field({ label, icon: Icon, hint, children }: {
  label: string; icon: React.ElementType; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50">
        <Icon className="h-3 w-3" />{label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground/35 leading-relaxed">{hint}</p>}
    </div>
  );
}

function SectionCard({ title, icon: Icon, children, className }: {
  title: string; icon: React.ElementType; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={cn("glass-card rounded-2xl p-6 space-y-5", className)}>
      <div className="flex items-center gap-2 pb-4 border-b border-border/40">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-foreground/60">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="space-y-5 pb-10 animate-pulse">
      <div className="glass-card h-12 rounded-2xl bg-muted/10" />
      <div className="glass-card h-80 rounded-3xl bg-muted/10" />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass-card h-64 rounded-2xl bg-muted/10" />
        <div className="glass-card h-64 rounded-2xl bg-muted/10" />
      </div>
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab({
  profile, rm, sm, joinDate, displayname, username, bio, avatarurl, coverurl, isprivate, socials, onGoSettings,
  followers = 0, following = 0,
}: {
  profile: Profile; rm: typeof ROLE_META[string]; sm: typeof SUPPORT_META[string] | null;
  joinDate: string; displayname: string; username: string; bio: string;
  avatarurl: string; coverurl: string; isprivate: boolean; socials: Record<string, string>;
  onGoSettings: () => void;
  followers?: number;
  following?: number;
}) {
  const name  = displayname || profile.username || "Pengguna";
  const init  = name.charAt(0).toUpperCase();
  const lvl   = profile.level;
  const xpPct = Math.min(100, Math.round((lvl.xpcurrent / lvl.xprequired) * 100));
  const lvlTitle = getLevelTitle(lvl.level);
  const activeSocials = SOCIAL_CONFIG.filter(s => socials[s.key]);
  const supportStatus = profile.supportTotal >= 100000 ? "Top Supporter"
    : profile.supportTotal >= 50000 ? "Patron"
    : profile.supportTotal > 0 ? "Supporter" : null;

  return (
    <div className="space-y-4">
      {/* ── Identity Card ── */}
      <div className="glass-card relative overflow-hidden rounded-3xl border border-border/60 shadow-2xl">
        {/* Ambient glow */}
        <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-52 bg-gradient-to-b opacity-60", rm.glowCls)} />

        {/* Cover */}
        <div className="relative h-36 sm:h-48 overflow-hidden">
          {coverurl
            ? <Image src={coverurl} alt="" fill className="object-cover" />
            : <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-primary/8 to-accent/15" />
          }
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
          {/* Tombol lihat profil publik */}
          {username && (
            <Link href={`/profile/${username}`}
              className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/80 backdrop-blur-sm hover:bg-white/20 hover:text-white transition-all">
              <ExternalLink className="h-3 w-3" /> Profil Publik
            </Link>
          )}
        </div>

        {/* Body */}
        <div className="relative px-5 sm:px-7 pb-7">
          {/* Avatar + Badges row */}
          <div className="-mt-14 mb-5 flex items-end justify-between">
            {/* Avatar + XP ring */}
            <div className="relative h-[96px] w-[96px] flex-shrink-0">
              <XpRing pct={xpPct} color={rm.color} size={96} />
              <div className="absolute inset-[5px] rounded-2xl overflow-hidden border-[3px] border-background bg-card/80 shadow-2xl flex items-center justify-center">
                {avatarurl
                  ? <Image src={avatarurl} alt={name} fill className="object-cover" />
                  : <span className="text-2xl font-black text-primary/50">{init}</span>
                }
              </div>
              {/* Level bubble */}
              <div className="absolute -bottom-2 -right-2 flex h-6 min-w-[24px] items-center justify-center rounded-full border-2 border-background px-1.5 text-[10px] font-black"
                style={{ backgroundColor: rm.color + "25", color: rm.color, borderColor: rm.color + "40" }}>
                {lvl.level}
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-col items-end gap-1.5 pb-2">
              <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-widest", rm.badgeCls)}>
                <img src={`/roles/${rm.svg}`} alt={rm.label} className="h-3.5 w-3.5"
                  style={{ filter: `drop-shadow(0 0 3px ${rm.color}60)` }} />
                {rm.label}
              </span>
              {sm && (
                <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-black", sm.cls)}>{sm.label}</span>
              )}
              {isprivate && (
                <span className="flex items-center gap-1 rounded-full border border-border/40 bg-muted/15 px-2.5 py-1 text-[10px] text-muted-foreground/45">
                  <Lock className="h-2.5 w-2.5" /> Privat
                </span>
              )}
            </div>
          </div>

          {/* Name */}
          <div className="mb-5">
            <h1 className="text-2xl font-black tracking-tight">{name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {username ? (
                <Link href={`/profile/${username}`}
                  className="flex items-center gap-1 text-sm text-muted-foreground/50 hover:text-primary/70 transition-colors group">
                  @{username}
                  <ExternalLink className="h-2.5 w-2.5 opacity-0 group-hover:opacity-50 transition-opacity" />
                </Link>
              ) : <span className="text-sm text-muted-foreground/40">@—</span>}
              <span className="rounded-full border px-2 py-0.5 text-[10px] font-bold"
                style={{ color: rm.color + "cc", borderColor: rm.color + "30", backgroundColor: rm.color + "10" }}>
                {lvlTitle}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-green-500/50 dark:text-green-400/40">
                <Calendar className="h-2.5 w-2.5" /> Sejak {joinDate}
              </span>
            </div>
          </div>

          {/* Bio */}
          {bio ? (
            <p className="mb-5 border-l-2 border-primary/20 pl-3.5 text-sm text-foreground/75 leading-relaxed">{bio}</p>
          ) : (
            <button onClick={onGoSettings}
              className="mb-5 flex items-center gap-2 text-xs italic text-muted-foreground/30 hover:text-primary/50 transition-colors">
              <Pencil className="h-3 w-3" /> Tambah bio di Settings
            </button>
          )}

          {/* XP Progress bar */}
          <div className="mb-5 rounded-2xl border border-border/50 bg-card/30 px-4 py-3.5">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" style={{ color: rm.color }} />
                <span className="text-xs font-bold text-foreground/70">Level {lvl.level} · {lvlTitle}</span>
              </div>
              <span className="font-mono text-[11px] text-muted-foreground/40">
                {lvl.xpcurrent.toLocaleString()} / {lvl.xprequired.toLocaleString()} XP
              </span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted/20">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${xpPct}%`, backgroundColor: rm.color, boxShadow: `0 0 8px ${rm.color}55` }} />
            </div>
            <p className="mt-1.5 text-right text-[10px] text-muted-foreground/30">{xpPct}%</p>
          </div>

          {/* Stats row */}
          <div className="mb-5 grid grid-cols-3 gap-2.5">
            <StatBox icon={ImageIcon}  label="Karya Galeri"  value={profile.galleryCount}  iconCls="text-blue-400/60"  />
            <StatBox icon={TrendingUp} label="Reputasi"      value={lvl.reputationscore}   iconCls="text-primary/60"  />
            <StatBox icon={Heart}      label="Support Budget"
              value={profile.supportTotal > 0 ? `Rp ${(profile.supportTotal/1000).toFixed(0)}K` : "—"}
              iconCls="text-green-400/60" />
          </div>

          {/* Support status */}
          {supportStatus && (
            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/5 px-4 py-3">
              <Trophy className="h-4 w-4 text-green-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-black text-green-300">{supportStatus}</p>
                <p className="text-[11px] text-green-400/50">Total Rp {profile.supportTotal.toLocaleString("id-ID")}</p>
              </div>
            </div>
          )}

          {/* Badge collection */}
          {profile.badges.length > 0 && (
            <div className="mb-5">
              <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/40">
                <Star className="h-3 w-3" /> Badge
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.badges.map(b => (
                  <span key={b.id} className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold",
                    b.badgecls ?? "border-primary/25 bg-primary/10 text-primary/80")}>
                    <span>{b.badgeicon}</span> {b.badgename}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social links */}
          {activeSocials.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {activeSocials.map(({ key, Icon, getHref }) => (
                <a key={key} href={getHref(socials[key]!)} target="_blank" rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-red-500/25 bg-red-500/8 text-red-400/80 hover:bg-red-500/18 hover:text-red-300 hover:-translate-y-0.5 transition-all">
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          )}

          {/* CTA ke Settings */}
          <button onClick={onGoSettings}
            className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold text-white/70 backdrop-blur-sm hover:bg-white/15 hover:text-white transition-all">
            <Pencil className="h-3.5 w-3.5" /> Edit Profil
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab({
  profile, rm, sm, joinDate,
  displayname, setDisplayname, username, setUsername,
  bio, setBio, avatarurl, setAvatarurl, coverurl, setCoverurl,
  isprivate, setIsprivate, socials, setSocials,
  setDirty, saving, dirty, onSave, onSignout, isStaff,
}: {
  profile: Profile;
  rm: typeof ROLE_META[string]; sm: typeof SUPPORT_META[string] | null; joinDate: string;
  displayname: string; setDisplayname: (v: string) => void;
  username: string;    setUsername:    (v: string) => void;
  bio: string;         setBio:         (v: string) => void;
  avatarurl: string;   setAvatarurl:   (v: string) => void;
  coverurl: string;    setCoverurl:    (v: string) => void;
  isprivate: boolean;  setIsprivate:   (fn: (p: boolean) => boolean) => void;
  socials: Record<string, string>; setSocials: (fn: (p: Record<string,string>) => Record<string,string>) => void;
  setDirty: (v: boolean) => void;
  saving: boolean; dirty: boolean; onSave: () => void; onSignout: () => void; isStaff: boolean;
}) {
  const name = displayname || profile.username || "Pengguna";
  const init = name.charAt(0).toUpperCase();
  return (
    <div className="space-y-5 pb-4">
      {/* Mini preview card */}
      <div className="flex items-center gap-4 glass-card rounded-2xl px-5 py-4">
        <div className="h-14 w-14 flex-shrink-0 rounded-xl overflow-hidden border-2 border-border/40 bg-card/80 flex items-center justify-center shadow-lg">
          {avatarurl
            ? <Image src={avatarurl} alt={name} width={56} height={56} className="h-full w-full object-cover" onError={() => setAvatarurl("")} />
            : <span className="text-xl font-black text-primary/50">{init}</span>
          }
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold truncate">{name}</p>
          <p className="text-xs text-muted-foreground/50">@{username || "—"}</p>
        </div>
        <span className={cn("flex-shrink-0 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest", rm.badgeCls)}>
          <img src={`/roles/${rm.svg}`} alt={rm.label} className="h-3 w-3" />
          {rm.label}
        </span>
      </div>

      {/* Form grid */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Kiri — Info */}
        <SectionCard title="Info Dasar" icon={User}>
          <Field label="Nama Tampilan" icon={Sparkles}>
            <Input value={displayname} onChange={e => { setDisplayname(e.target.value); setDirty(true); }} placeholder="Nama yang tampil ke orang lain" maxLength={50} />
          </Field>
          <Field label="Username" icon={AtSign} hint="3–30 karakter · huruf kecil, angka, underscore">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/30 select-none">@</span>
              <Input value={username}
                onChange={e => { setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "")); setDirty(true); }}
                placeholder="username_kamu" maxLength={30} className="pl-7" />
            </div>
          </Field>
          <Field label="Bio" icon={FileText}>
            <div className="relative">
              <textarea value={bio} onChange={e => { setBio(e.target.value); setDirty(true); }}
                rows={3} maxLength={300} placeholder="Ceritakan sedikit tentang dirimu…"
                className="w-full resize-none rounded-xl border border-border/60 bg-card/40 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground/25 focus:border-primary/40 focus:bg-card/60 focus:ring-2 focus:ring-primary/10 transition-all" />
              <span className="absolute bottom-2.5 right-3 text-[10px] text-muted-foreground/25 tabular-nums">{bio.length}/300</span>
            </div>
          </Field>
          {/* Privacy toggle */}
          <button type="button" onClick={() => { setIsprivate(p => !p); setDirty(true); }}
            className={cn("flex items-center justify-between w-full rounded-xl border px-4 py-3 text-left transition-all",
              isprivate ? "border-primary/25 bg-primary/5" : "border-border/40 bg-card/20 hover:border-border/70")}>
            <div className="flex items-center gap-3">
              <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
                isprivate ? "bg-primary/15 text-primary" : "bg-muted/40 text-muted-foreground/40")}>
                {isprivate ? <Lock className="h-3.5 w-3.5" /> : <Globe className="h-3.5 w-3.5" />}
              </div>
              <div>
                <p className="text-sm font-medium">{isprivate ? "Profil Privat" : "Profil Publik"}</p>
                <p className="text-[11px] text-muted-foreground/40 mt-0.5">
                  {isprivate ? "Hanya kamu yang bisa lihat detail" : "Semua orang bisa melihat profilmu"}
                </p>
              </div>
            </div>
            <div className={cn("relative flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0",
              isprivate ? "bg-primary" : "bg-muted/50")}>
              <span className={cn("absolute h-3.5 w-3.5 rounded-full bg-white shadow transition-transform",
                isprivate ? "translate-x-[18px]" : "translate-x-[3px]")} />
            </div>
          </button>
        </SectionCard>

        {/* Kanan — Media + Account */}
        <SectionCard title="Foto & Media" icon={Camera}>
          <Field label="Avatar" icon={User} hint="URL gambar publik · rasio 1:1">
            <div className="flex gap-2.5">
              <div className="h-10 w-10 flex-shrink-0 rounded-xl overflow-hidden border border-border/40 bg-muted/20 flex items-center justify-center">
                {avatarurl
                  ? <Image src={avatarurl} alt="" width={40} height={40} className="h-full w-full object-cover" onError={() => setAvatarurl("")} />
                  : <User className="h-4 w-4 text-muted-foreground/20" />
                }
              </div>
              <div className="flex flex-1 gap-1.5">
                <Input type="url" value={avatarurl} onChange={e => { setAvatarurl(e.target.value); setDirty(true); }} placeholder="https://cdn.example.com/avatar.jpg" className="flex-1" />
                {avatarurl && (
                  <button type="button" onClick={() => { setAvatarurl(""); setDirty(true); }}
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-border/40 text-muted-foreground/40 hover:border-destructive/30 hover:text-destructive transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </Field>
          <Field label="Cover / Banner" icon={Camera} hint="Saran: 1280×360px · rasio 16:9">
            <Input type="url" value={coverurl} onChange={e => { setCoverurl(e.target.value); setDirty(true); }} placeholder="https://cdn.example.com/cover.jpg" />
            {coverurl && (
              <div className="relative mt-2 h-20 overflow-hidden rounded-xl border border-border/40">
                <Image src={coverurl} alt="" fill className="object-cover" onError={() => setCoverurl("")} />
                <button type="button" onClick={() => { setCoverurl(""); setDirty(true); }}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-lg bg-background/80 text-muted-foreground hover:text-destructive transition-colors backdrop-blur-sm">
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </Field>

          {/* Account info tiles */}
          <div className="rounded-xl border border-border/30 bg-card/20 divide-y divide-border/20 overflow-hidden">
            {([
              { label: "Role",      value: rm.label,     color: "text-yellow-300/80" },
              { label: "Supporter", value: sm?.label,    color: "text-green-400/80"  },
              { label: "Bergabung", value: joinDate,      color: "text-green-500/50"  },
            ] as {label:string;value?:string;color:string}[]).filter(r => r.value).map(row => (
              <div key={row.label} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-xs text-muted-foreground/40">{row.label}</span>
                <span className={cn("text-xs font-semibold", row.color)}>{row.value}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Sosial Media */}
      <SectionCard title="Sosial Media" icon={LinkIcon}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SOCIAL_FIELDS.map(({ key, label, placeholder, Icon }) => (
            <Field key={key} label={label} icon={Icon}>
              <div className="relative flex items-center">
                <Input value={socials[key] ?? ""} placeholder={placeholder}
                  onChange={e => { setSocials(prev => ({ ...prev, [key]: e.target.value })); setDirty(true); }}
                  className="pr-9" />
                {socials[key] && (
                  <button type="button"
                    onClick={() => { setSocials(prev => { const n = {...prev}; delete n[key]; return n; }); setDirty(true); }}
                    className="absolute right-3 text-muted-foreground/30 hover:text-muted-foreground/70 transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </Field>
          ))}
        </div>
      </SectionCard>

      {/* Admin shortcut */}
      {isStaff && (
        <div className="glass-card rounded-2xl p-5 border border-primary/15 bg-primary/3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold">Panel Admin</p>
                <p className="text-xs text-muted-foreground/50">Kelola blog, event, galeri, dan pengguna</p>
              </div>
            </div>
            <Link href="/admin"
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/20">
              <Shield className="h-3.5 w-3.5" /> Admin Panel
            </Link>
          </div>
        </div>
      )}

      {/* Bottom actions */}
      <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
        <button onClick={onSignout}
          className="flex items-center gap-1.5 rounded-xl border border-border/40 px-4 py-2.5 text-xs font-medium text-muted-foreground/60 hover:border-destructive/30 hover:text-destructive transition-all">
          <LogOut className="h-3.5 w-3.5" /> Keluar
        </button>
        <button onClick={onSave} disabled={saving || !dirty}
          className={cn("flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold transition-all",
            dirty && !saving ? "bg-primary text-white shadow-lg shadow-primary/20 hover:-translate-y-0.5" : "bg-muted/30 text-muted-foreground/30 cursor-not-allowed")}>
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          {saving ? "Menyimpan…" : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router   = useRouter();
  const toastRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [profile,  setProfile]  = useState<Profile | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [hasError, setHasError] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [dirty,    setDirty]    = useState(false);
  const [toast,    setToast]    = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("left");

  const [displayname, setDisplayname] = useState("");
  const [username,    setUsername]    = useState("");
  const [bio,         setBio]         = useState("");
  const [avatarurl,   setAvatarurl]   = useState("");
  const [coverurl,    setCoverurl]    = useState("");
  const [isprivate,   setIsprivate]   = useState(false);
  const [socials,     setSocials]     = useState<Record<string, string>>({});

  const showToast = useCallback((msg: string, type: "ok" | "err") => {
    if (toastRef.current) clearTimeout(toastRef.current);
    setToast({ msg, type });
    toastRef.current = setTimeout(() => setToast(null), 4000);
  }, []);

  const load = useCallback(async () => {
    setLoading(true); setHasError(false);
    try {
      const r = await fetch("/api/profile", { cache: "no-store" });
      if (r.status === 401) { router.push("/login"); return; }
      if (!r.ok) throw new Error();
      const d = await r.json();
      if (!d.data) throw new Error();
      const p: Profile = d.data;
      setProfile(p);
      // Load follow counts
      if (p.username) {
        fetch(`/api/users/${p.username}/follow`).then(r => r.json())
          .then(d => { if (d.data) { setFollowers(d.data.followers ?? 0); setFollowing(d.data.following ?? 0); } })
          .catch(() => {});
      }
      setDisplayname(p.displayname ?? "");
      setUsername(p.username ?? "");
      setBio(p.bio ?? "");
      setAvatarurl(p.avatarurl ?? "");
      setCoverurl(p.coverurl ?? "");
      setIsprivate(p.isprivate ?? false);
      setSocials(p.sociallinks ?? {});
      setTimeout(() => setDirty(false), 0);
    } catch { setHasError(true); }
    finally   { setLoading(false); }
  }, [router]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res  = await fetch("/api/profile", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username || undefined, displayname: displayname || undefined,
          bio: bio || undefined, avatarurl: avatarurl || undefined, coverurl: coverurl || undefined,
          isprivate, sociallinks: socials }),
      });
      const data = await res.json();
      if (!res.ok || data.error) showToast(data.error?.message ?? "Gagal menyimpan.", "err");
      else { setProfile(prev => prev ? { ...prev, ...data.data } : prev); setDirty(false); showToast("Profil berhasil disimpan!", "ok"); }
    } catch { showToast("Koneksi gagal. Coba lagi.", "err"); }
    finally   { setSaving(false); }
  };

  const handleSignout = async () => {
    await fetch("/api/auth/signout", { method: "POST" }).catch(() => {});
    window.location.href = "/";
  };

  const switchTab = useCallback((tab: Tab) => {
    if (tab === activeTab || animating) return;
    setDirection(tab === "settings" ? "left" : "right");
    setAnimating(true);
    setTimeout(() => { setActiveTab(tab); setAnimating(false); }, 180);
  }, [activeTab, animating]);

  if (loading) return <><Skeleton /><Footer /></>;

  if (hasError || !profile) return (
    <>
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <AlertCircle className="h-10 w-10 text-destructive/30" />
        <p className="text-sm text-muted-foreground/60">Gagal memuat profil.</p>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
            <RefreshCw className="h-3.5 w-3.5" /> Coba Lagi
          </button>
          <Link href="/login" className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90 transition-all">Login Ulang</Link>
        </div>
      </div>
      <Footer />
    </>
  );

  const rm      = ROLE_META[profile.role] ?? ROLE_META.USER;
  const sm      = profile.supporterrole ? SUPPORT_META[profile.supporterrole] : null;
  const isStaff = ["OWNER","MANAGER","ADMIN"].includes(profile.role);
  const joinDate = new Date(profile.createdat).toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "profile",  label: "Profil",   icon: UserCircle },
    { id: "settings", label: "Settings", icon: Settings   },
  ];

  return (
    <>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="space-y-5 pb-2">

        {/* Tab bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex gap-1 rounded-2xl border border-border/50 bg-card/30 p-1 backdrop-blur-sm">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => switchTab(tab.id)}
                className={cn("relative flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200",
                  activeTab === tab.id ? "bg-primary text-white shadow-md shadow-primary/20" : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/30")}>
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
                {tab.id === "settings" && dirty && (
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-background" />
                )}
              </button>
            ))}
          </div>
          {activeTab === "settings" && (
            <button onClick={handleSave} disabled={saving || !dirty}
              className={cn("flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all",
                dirty && !saving ? "bg-primary text-white shadow-lg shadow-primary/20 hover:-translate-y-0.5" : "bg-muted/30 text-muted-foreground/30 cursor-not-allowed")}>
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              {saving ? "Menyimpan…" : "Simpan"}
            </button>
          )}
        </div>

        {/* Animated tab content */}
        <div className="relative overflow-hidden">
          <div className={cn("transition-all duration-180",
            animating ? (direction === "left" ? "-translate-x-3 opacity-0" : "translate-x-3 opacity-0") : "translate-x-0 opacity-100")}>
            {activeTab === "profile" ? (
              <ProfileTab
                profile={profile} rm={rm} sm={sm} joinDate={joinDate}
                displayname={displayname} username={username} bio={bio}
                avatarurl={avatarurl} coverurl={coverurl} isprivate={isprivate} socials={socials}
                onGoSettings={() => switchTab("settings")}
              />
            ) : (
              <SettingsTab
                profile={profile} rm={rm} sm={sm} joinDate={joinDate}
                displayname={displayname} setDisplayname={setDisplayname}
                username={username} setUsername={setUsername}
                bio={bio} setBio={setBio}
                avatarurl={avatarurl} setAvatarurl={setAvatarurl}
                coverurl={coverurl} setCoverurl={setCoverurl}
                isprivate={isprivate} setIsprivate={setIsprivate}
                socials={socials} setSocials={setSocials}
                setDirty={setDirty} saving={saving} dirty={dirty}
                onSave={handleSave} onSignout={handleSignout} isStaff={isStaff}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
