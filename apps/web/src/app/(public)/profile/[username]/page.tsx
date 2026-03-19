"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, Globe, Lock, Calendar, AlertCircle, Home,
  Pencil, Instagram, Twitter, Youtube, ExternalLink,
  Share2, Check, Star, ImageIcon, Trophy, Heart,
  Zap, UserPlus, UserCheck, Users,
} from "lucide-react";
import { DiscordIcon } from "@/components/icons/custom-icons";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/layout/footer";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LevelData { level: number; xpcurrent: number; xprequired: number; reputationscore: number }
interface BadgeData  { id: string; badgename: string; badgeicon: string; badgecls?: string }
interface GalleryItem { id: string; imageurl: string; title: string | null }
interface PublicProfile {
  id: string; username: string | null; displayname: string | null;
  avatarurl: string | null; coverurl: string | null; bio: string | null;
  role: string; supporterrole: string | null; sociallinks?: Record<string, string>;
  isprivate: boolean; createdat?: string;
  level: LevelData; galleryCount: number; galleryPosts: GalleryItem[];
  supportTotal: number; badges: BadgeData[];
}

// ─── Config ───────────────────────────────────────────────────────────────────

const ROLE_META: Record<string, { label: string; svg: string; badgeCls: string; glowCls: string; color: string }> = {
  OWNER:   { label: "Owner",   svg: "owner.svg",   color: "#eab308", badgeCls: "text-yellow-300 bg-yellow-400/15 border-yellow-400/40", glowCls: "from-yellow-500/20 to-transparent" },
  MANAGER: { label: "Manager", svg: "owner.svg",   color: "#fbbf24", badgeCls: "text-yellow-200 bg-yellow-300/12 border-yellow-300/30", glowCls: "from-yellow-400/12 to-transparent" },
  ADMIN:   { label: "Admin",   svg: "admin.svg",   color: "#ef4444", badgeCls: "text-red-300    bg-red-400/15    border-red-400/35",    glowCls: "from-red-500/15    to-transparent" },
  AGENSI:  { label: "Agensi",  svg: "admin.svg",   color: "#f97316", badgeCls: "text-orange-300 bg-orange-400/15 border-orange-400/30", glowCls: "from-orange-500/12 to-transparent" },
  KREATOR: { label: "Kreator", svg: "premium.svg", color: "#a855f7", badgeCls: "text-purple-300 bg-purple-400/15 border-purple-400/35", glowCls: "from-purple-500/15 to-transparent" },
  USER:    { label: "Member",  svg: "member.svg",  color: "#6b7280", badgeCls: "text-gray-300   bg-gray-400/10   border-gray-400/25",   glowCls: "from-primary/8     to-transparent" },
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

const SOCIAL_CONFIG = [
  { key: "discord",   label: "Discord",   Icon: DiscordIcon, getHref: (v: string) => `https://discord.com/users/${v}`                      },
  { key: "instagram", label: "Instagram", Icon: Instagram,   getHref: (v: string) => `https://instagram.com/${v.replace("@","")}`          },
  { key: "x",         label: "X",         Icon: Twitter,     getHref: (v: string) => `https://x.com/${v.replace("@","")}`                  },
  { key: "youtube",   label: "YouTube",   Icon: Youtube,     getHref: (v: string) => v.startsWith("http") ? v : `https://youtube.com/${v}` },
  { key: "website",   label: "Website",   Icon: Globe,       getHref: (v: string) => v.startsWith("http") ? v : `https://${v}`             },
] as const;

// ─── XP Ring ──────────────────────────────────────────────────────────────────

function XpRing({ pct, color, size=96 }: { pct: number; color: string; size?: number }) {
  const r = (size - 8) / 2; const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="absolute inset-0 -rotate-90 pointer-events-none">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3.5" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ - (pct/100)*circ}
        style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" }} />
    </svg>
  );
}

// ─── Share Button ─────────────────────────────────────────────────────────────

function ShareButton({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => {
      navigator.clipboard.writeText(`https://www.soraku.id/profile/${username}`).catch(() => {});
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    }} className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-[11px] font-semibold text-white/70 backdrop-blur-sm hover:bg-white/15 hover:text-white transition-all">
      {copied ? <><Check className="h-3 w-3" /> Disalin</> : <><Share2 className="h-3 w-3" /> Bagikan</>}
    </button>
  );
}

// ─── Follow Button ────────────────────────────────────────────────────────────

function FollowButton({ username, isFollowing: init, onToggle }: {
  username: string; isFollowing: boolean; onToggle: (v: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(init);

  const toggle = async () => {
    setLoading(true);
    const res = await fetch(`/api/users/${username}/follow`, { method: "POST" }).catch(() => null);
    if (res?.ok) {
      const { data } = await res.json();
      setState(data.following);
      onToggle(data.following);
    }
    setLoading(false);
  };

  return (
    <button onClick={toggle} disabled={loading}
      className={cn(
        "flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all",
        loading && "opacity-60 pointer-events-none",
        state
          ? "border border-border/60 bg-card/40 text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
          : "bg-primary text-white shadow-md shadow-primary/25 hover:bg-primary/90"
      )}>
      {state ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
      {state ? "Mengikuti" : "Ikuti"}
    </button>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 animate-pulse space-y-4">
      <div className="h-3 w-16 rounded bg-muted/25" />
      <div className="rounded-3xl overflow-hidden border border-border/40">
        <div className="h-44 bg-gradient-to-r from-muted/20 to-muted/10" />
        <div className="px-6 pb-8 space-y-4">
          <div className="flex items-end gap-4 -mt-12">
            <div className="h-24 w-24 rounded-2xl bg-muted/30 border-4 border-background" />
            <div className="h-6 w-16 rounded-full bg-muted/25" />
          </div>
          <div className="h-6 w-48 rounded bg-muted/30" />
          <div className="h-3.5 w-28 rounded bg-muted/20" />
          <div className="h-16 rounded-2xl bg-muted/15" />
        </div>
      </div>
    </div>
  );
}

// ─── Not Found ────────────────────────────────────────────────────────────────

function NotFound({ username, onBack }: { username: string; onBack: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-28 text-center">
      <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-border/40 bg-muted/15">
        <AlertCircle className="h-7 w-7 text-muted-foreground/30" />
      </div>
      <h1 className="text-lg font-black">Profil tidak ditemukan</h1>
      <p className="mt-2 text-sm text-muted-foreground/50">
        User <span className="font-medium text-foreground/60">@{username}</span> tidak ada.
      </p>
      <button onClick={onBack}
        className="mt-7 inline-flex items-center gap-2 rounded-xl border border-border/50 px-5 py-2.5 text-sm text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </button>
    </div>
  );
}

// ─── Stat Box ─────────────────────────────────────────────────────────────────

function StatBox({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 text-center">
      <span className="text-xl font-black text-foreground tabular-nums">{value}</span>
      <span className="text-xs font-medium text-muted-foreground/60">{label}</span>
      {sub && <span className="text-[10px] text-muted-foreground/35">{sub}</span>}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const router = useRouter();
  const [profile,  setProfile]  = useState<PublicProfile | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSelf,   setIsSelf]   = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!username) return;
    Promise.all([
      fetch(`/api/users/${username}`).then(r => r.json()),
      fetch("/api/auth/me", { cache: "no-store" }).then(r => r.json()).catch(() => ({ data: null })),
      fetch(`/api/users/${username}/follow`).then(r => r.json()).catch(() => ({ data: null })),
    ]).then(([pRes, meRes, fRes]) => {
      if (pRes.error || !pRes.data) { setNotFound(true); return; }
      setProfile(pRes.data);
      setIsLoggedIn(!!meRes.data);
      if (meRes.data?.username === username) setIsSelf(true);
      if (fRes.data) {
        setFollowers(fRes.data.followers ?? 0);
        setFollowing(fRes.data.following ?? 0);
        setIsFollowing(fRes.data.isFollowing ?? false);
      }
    }).catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return <Skeleton />;
  if (notFound || !profile) return <NotFound username={username} onBack={() => router.back()} />;

  const rm   = ROLE_META[profile.role] ?? ROLE_META.USER;
  const sm   = profile.supporterrole ? SUPPORT_META[profile.supporterrole] : null;
  const name = profile.displayname ?? profile.username ?? "—";
  const init = name.charAt(0).toUpperCase();
  const joinDate = profile.createdat
    ? new Date(profile.createdat).toLocaleDateString("id-ID", { month: "long", year: "numeric" })
    : null;

  const lvl      = profile.level;
  const xpPct    = Math.min(100, Math.round((lvl.xpcurrent / lvl.xprequired) * 100));
  const lvlTitle = getLevelTitle(lvl.level);
  const socials  = SOCIAL_CONFIG.filter(s => profile.sociallinks?.[s.key]);

  return (
    <>
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12 space-y-5">

      {/* Breadcrumb nav */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground/50">
        <Link href="/" className="flex items-center gap-1 hover:text-muted-foreground/80 transition-colors">
          <Home className="h-3 w-3" /> Beranda
        </Link>
        <span>/</span>
        <span className="text-foreground/60">@{username}</span>
      </nav>

      {/* ══════ CARD ══════ */}
      <div className="relative overflow-hidden rounded-3xl border border-border/60 shadow-2xl bg-card/20 backdrop-blur-sm">

        {/* Ambient */}
        <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-60 bg-gradient-to-b opacity-60", rm.glowCls)} />

        {/* Cover */}
        <div className="relative h-44 sm:h-56 overflow-hidden">
          {profile.coverurl
            ? <Image src={profile.coverurl} alt="" fill className="object-cover" />
            : <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-primary/8 to-accent/15" />
          }
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />

          <div className="absolute right-3 top-3 flex items-center gap-2">
            <ShareButton username={profile.username ?? username} />
            {isSelf && (
              <Link href="/profile/me"
                className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/80 backdrop-blur-sm hover:bg-white/20 hover:text-white transition-all">
                <Pencil className="h-3 w-3" /> Edit
              </Link>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="relative px-5 sm:px-7 pb-7">

          {/* Avatar row */}
          <div className="-mt-14 mb-5 flex items-end justify-between">

            {/* Avatar + XP ring */}
            <div className="relative h-[96px] w-[96px] flex-shrink-0">
              <XpRing pct={xpPct} color={rm.color} size={96} />
              <div className="absolute inset-[5px] rounded-2xl overflow-hidden border-[3px] border-background bg-card/80 shadow-xl flex items-center justify-center">
                {profile.avatarurl
                  ? <Image src={profile.avatarurl} alt={name} fill className="object-cover" />
                  : <span className="text-2xl font-black text-primary/50">{init}</span>
                }
              </div>
              <div className="absolute -bottom-2 -right-2 flex h-6 min-w-[24px] items-center justify-center rounded-full border-2 border-background px-1.5 text-[10px] font-black"
                style={{ backgroundColor: rm.color + "25", color: rm.color, borderColor: rm.color + "40" }}>
                {lvl.level}
              </div>
            </div>

            {/* Badges + follow */}
            <div className="flex flex-col items-end gap-2 pb-2">
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-widest", rm.badgeCls)}>
                  <img src={`/roles/${rm.svg}`} alt={rm.label} className="h-3.5 w-3.5"
                    style={{ filter: `drop-shadow(0 0 3px ${rm.color}60)` }} />
                  {rm.label}
                </span>
                {sm && (
                  <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-black", sm.cls)}>
                    {sm.label}
                  </span>
                )}
              </div>
              {isLoggedIn && !isSelf && (
                <FollowButton
                  username={profile.username ?? username}
                  isFollowing={isFollowing}
                  onToggle={v => { setIsFollowing(v); setFollowers(n => v ? n+1 : n-1); }}
                />
              )}
            </div>
          </div>

          {/* Name + meta */}
          <div className="mb-5">
            <h1 className="text-2xl font-black tracking-tight leading-tight">{name}</h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
              <span className="text-muted-foreground/50">@{profile.username}</span>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{ color: rm.color + "cc", borderColor: rm.color + "30", border: `1px solid ${rm.color}30`, backgroundColor: rm.color + "10" }}>
                {lvlTitle}
              </span>
              {profile.isprivate && (
                <span className="flex items-center gap-1 text-muted-foreground/40">
                  <Lock className="h-3 w-3" /> Privat
                </span>
              )}
              {joinDate && (
                <span className="flex items-center gap-1 text-muted-foreground/40">
                  <Calendar className="h-3 w-3" /> Sejak {joinDate}
                </span>
              )}
            </div>
          </div>

          {profile.isprivate ? (
            <div className="flex items-center gap-3 rounded-2xl border border-border/30 bg-muted/8 px-4 py-4">
              <Lock className="h-4 w-4 text-muted-foreground/20 flex-shrink-0" />
              <p className="text-sm italic text-muted-foreground/35">Profil ini privat.</p>
            </div>
          ) : (<>

            {/* Follow stats */}
            <div className="mb-5 flex items-center gap-6 py-4 border-y border-border/30">
              <StatBox label="Pengikut" value={followers.toLocaleString("id-ID")} />
              <div className="h-8 w-px bg-border/40" />
              <StatBox label="Mengikuti" value={following.toLocaleString("id-ID")} />
              <div className="h-8 w-px bg-border/40" />
              <StatBox label="Karya" value={profile.galleryCount} />
              <div className="h-8 w-px bg-border/40" />
              <StatBox label="Reputasi" value={lvl.reputationscore.toLocaleString()} />
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="mb-5 text-sm text-foreground/75 leading-relaxed border-l-2 border-primary/20 pl-4">
                {profile.bio}
              </p>
            )}

            {/* XP Progress */}
            <div className="mb-5 rounded-2xl border border-border/40 bg-card/30 px-4 py-3.5">
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
                  style={{ width: `${xpPct}%`, backgroundColor: rm.color, boxShadow: `0 0 8px ${rm.color}50` }} />
              </div>
              <p className="mt-1.5 text-right text-[10px] text-muted-foreground/30">{xpPct}%</p>
            </div>

            {/* Badges */}
            {profile.badges.length > 0 && (
              <div className="mb-5">
                <p className="mb-2.5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/40 flex items-center gap-1.5">
                  <Star className="h-3 w-3" /> Badge
                </p>
                <div className="flex flex-wrap gap-2">
                  {profile.badges.map(b => (
                    <span key={b.id} className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold",
                      b.badgecls ?? "border-primary/25 bg-primary/10 text-primary/80"
                    )}>
                      <span>{b.badgeicon}</span> {b.badgename}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Socials */}
            {socials.length > 0 && (
              <div className="mb-5 flex flex-wrap gap-2">
                {socials.map(({ key, label, Icon, getHref }) => (
                  <a key={key} href={getHref(profile.sociallinks![key]!)}
                    target="_blank" rel="noopener noreferrer"
                    className="group flex items-center gap-2 rounded-full border border-border/40 bg-card/40 px-3.5 py-2 text-xs font-semibold text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground hover:-translate-y-0.5">
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                    <ExternalLink className="h-2.5 w-2.5 opacity-0 group-hover:opacity-60 transition-opacity" />
                  </a>
                ))}
              </div>
            )}

            {/* Gallery preview */}
            {profile.galleryPosts.length > 0 && (
              <div>
                <p className="mb-2.5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/40 flex items-center gap-1.5">
                  <ImageIcon className="h-3 w-3" /> Galeri Terbaru
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {profile.galleryPosts.map(g => (
                    <Link key={g.id} href="/gallery"
                      className="group relative aspect-square overflow-hidden rounded-xl border border-border/30 bg-card/40">
                      <Image src={g.imageurl} alt={g.title ?? ""} fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </>)}
        </div>
      </div>

      {/* Self hint */}
      {isSelf && (
        <p className="text-center text-xs text-muted-foreground/30">
          Ini profil publik kamu —{" "}
          <Link href="/profile/me" className="text-primary/50 hover:text-primary transition-colors">
            edit profil
          </Link>
        </p>
      )}
    </div>

    <Footer />
    </>
  );
}
