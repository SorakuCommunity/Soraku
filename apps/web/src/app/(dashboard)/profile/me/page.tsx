"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Save, Loader2, LogOut, Globe, Lock, Camera,
  Instagram, Twitter, Youtube, ExternalLink,
  Zap, Star, ImageIcon, Eye, ChevronRight,
  Check, AlertCircle, Pencil,
} from "lucide-react";
import { DiscordIcon } from "@/components/icons/custom-icons";
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

// ─── Config ───────────────────────────────────────────────────────────────────

const ROLE_META: Record<string, { label: string; svg: string; color: string }> = {
  OWNER:   { label: "Owner",   svg: "owner.svg",   color: "#eab308" },
  MANAGER: { label: "Manager", svg: "owner.svg",   color: "#fbbf24" },
  ADMIN:   { label: "Admin",   svg: "admin.svg",   color: "#ef4444" },
  AGENSI:  { label: "Agensi",  svg: "admin.svg",   color: "#f97316" },
  KREATOR: { label: "Kreator", svg: "premium.svg", color: "#a855f7" },
  USER:    { label: "Member",  svg: "member.svg",  color: "#6366f1" },
};

const SUPPORT_META: Record<string, { label: string; color: string }> = {
  VVIP:    { label: "✨ VVIP", color: "text-purple-300" },
  VIP:     { label: "⭐ VIP",  color: "text-emerald-300" },
  DONATUR: { label: "💚 Donatur", color: "text-green-400" },
};

const LEVEL_TITLES: [number, string][] = [
  [50,"Soraku Legend"],[40,"Community Hero"],[30,"Elite Member"],
  [20,"Senpai"],[10,"Otaku"],[1,"Newcomer"],
];
const getLevelTitle = (lv: number) => LEVEL_TITLES.find(([m]) => lv >= m)?.[1] ?? "Newcomer";

const SOCIAL_FIELDS = [
  { key: "discord",   label: "Discord",     placeholder: "user#1234 atau ID",    Icon: DiscordIcon },
  { key: "instagram", label: "Instagram",   placeholder: "@username",            Icon: Instagram   },
  { key: "x",         label: "X / Twitter", placeholder: "@username",            Icon: Twitter     },
  { key: "youtube",   label: "YouTube",     placeholder: "URL channel",          Icon: Youtube     },
  { key: "website",   label: "Website",     placeholder: "https://yoursite.id",  Icon: Globe       },
] as const;

const SOCIAL_CONFIG = [
  { key: "discord",   Icon: DiscordIcon, getHref: (v: string) => `https://discord.com/users/${v}` },
  { key: "instagram", Icon: Instagram,   getHref: (v: string) => `https://instagram.com/${v.replace("@","")}` },
  { key: "x",         Icon: Twitter,     getHref: (v: string) => `https://x.com/${v.replace("@","")}` },
  { key: "youtube",   Icon: Youtube,     getHref: (v: string) => v.startsWith("http") ? v : `https://youtube.com/${v}` },
  { key: "website",   Icon: Globe,       getHref: (v: string) => v.startsWith("http") ? v : `https://${v}` },
] as const;

// ─── XP Ring ──────────────────────────────────────────────────────────────────

function XpRing({ pct, color, size = 88 }: { pct: number; color: string; size?: number }) {
  const r = (size - 6) / 2; const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="absolute inset-0 -rotate-90 pointer-events-none">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ - (pct/100)*circ}
        style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }} />
    </svg>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-muted-foreground/60">{label}</label>
      {children}
      {hint && <p className="text-[10px] text-muted-foreground/35">{hint}</p>}
    </div>
  );
}

function Input({ value, onChange, placeholder, disabled, mono }: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; disabled?: boolean; mono?: boolean;
}) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      disabled={disabled}
      className={cn(
        "w-full rounded-xl border border-border/25 bg-transparent px-3.5 py-2.5 text-sm outline-none",
        "placeholder:text-muted-foreground/25 focus:border-primary/40 transition-colors",
        "disabled:opacity-40",
        mono && "font-mono"
      )}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PrivateProfilePage() {
  const router = useRouter();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  // Form state
  const [displayname, setDisplayname] = useState("");
  const [username,    setUsername]    = useState("");
  const [bio,         setBio]         = useState("");
  const [avatarurl,   setAvatarurl]   = useState("");
  const [coverurl,    setCoverurl]    = useState("");
  const [isprivate,   setIsprivate]   = useState(false);
  const [socials,     setSocials]     = useState<Record<string, string>>({});

  const [dirty, setDirty] = useState(false);

  const showToast = (type: "ok" | "err", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) { router.push("/login"); return; }
      const { data } = await res.json();
      setProfile(data);
      setDisplayname(data.displayname ?? "");
      setUsername(data.username ?? "");
      setBio(data.bio ?? "");
      setAvatarurl(data.avatarurl ?? "");
      setCoverurl(data.coverurl ?? "");
      setIsprivate(data.isprivate ?? false);
      setSocials(data.sociallinks ?? {});
    } catch { router.push("/login"); }
    finally { setLoading(false); setDirty(false); }
  }, [router]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayname: displayname.trim(), username: username.trim(), bio: bio.trim(), avatarurl, coverurl, isprivate, sociallinks: socials }),
      });
      const { data, error } = await res.json();
      if (!res.ok) { showToast("err", error?.message ?? "Gagal menyimpan."); return; }
      setProfile(p => p ? { ...p, ...data } : p);
      setDirty(false);
      showToast("ok", "Profil berhasil disimpan ✓");
    } catch { showToast("err", "Terjadi kesalahan."); }
    finally { setSaving(false); }
  };

  const handleImgUrl = (type: "avatar" | "cover", url: string) => {
    if (type === "avatar") { setAvatarurl(url); }
    else { setCoverurl(url); }
    setDirty(true);
  };

  const handleSocialChange = (key: string, val: string) => {
    setSocials(p => ({ ...p, [key]: val }));
    setDirty(true);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.push("/");
  };

  if (loading) return (
    <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 animate-pulse space-y-6">
      <div className="h-3 w-24 rounded bg-muted/20" />
      <div className="h-40 rounded-3xl bg-muted/15" />
      <div className="flex gap-4 items-center">
        <div className="h-20 w-20 rounded-2xl bg-muted/20" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-40 rounded bg-muted/20" />
          <div className="h-3 w-24 rounded bg-muted/15" />
        </div>
      </div>
    </div>
  );

  if (!profile) return null;

  const rm       = ROLE_META[profile.role] ?? ROLE_META.USER;
  const sm       = profile.supporterrole ? SUPPORT_META[profile.supporterrole] : null;
  const name     = displayname || profile.displayname || profile.username || "—";
  const lvl      = profile.level;
  const xpPct    = Math.min(100, Math.round((lvl.xpcurrent / Math.max(1, lvl.xprequired)) * 100));
  const lvlTitle = getLevelTitle(lvl.level);
  const activeSocials = SOCIAL_CONFIG.filter(s => socials[s.key]);

  return (
    <div className="mx-auto max-w-2xl px-4 pt-8 pb-24">

      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-semibold shadow-xl transition-all",
          toast.type === "ok"
            ? "bg-emerald-500/15 border border-emerald-500/25 text-emerald-300"
            : "bg-red-500/15 border border-red-500/25 text-red-300"
        )}>
          {toast.type === "ok" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/30 mb-1">Dashboard</p>
          <h1 className="text-xl font-black tracking-tight">Profil Saya</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/profile/${profile.username}`}
            className="flex items-center gap-1.5 rounded-xl border border-border/25 px-3.5 py-2 text-xs font-semibold text-muted-foreground/50 hover:text-foreground hover:border-border/50 transition-all">
            <Eye className="h-3.5 w-3.5" /> Lihat Publik
          </Link>
          <button onClick={logout}
            className="flex items-center gap-1.5 rounded-xl border border-border/25 px-3.5 py-2 text-xs font-semibold text-muted-foreground/50 hover:text-red-400 hover:border-red-400/30 transition-all">
            <LogOut className="h-3.5 w-3.5" /> Keluar
          </button>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-primary/20 via-border/20 to-transparent mb-8" />

      {/* ── PREVIEW CARD ── */}
      <div className="mb-8 relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 via-primary/4 to-accent/8">
        {/* Cover */}
        <div className="relative h-36 group cursor-pointer" onClick={() => {
          const url = prompt("URL cover baru (kosongkan untuk hapus):", coverurl);
          if (url !== null) { handleImgUrl("cover", url); }
        }}>
          {coverurl
            ? <Image src={coverurl} alt="" fill className="object-cover" />
            : <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/8 to-accent/15" />
          }
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <Camera className="h-5 w-5 text-white opacity-0 group-hover:opacity-70 transition-opacity" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          {/* Role ambient */}
          <div className="absolute inset-0 opacity-25" style={{ background: `radial-gradient(circle at 70% 50%, ${rm.color}20, transparent 70%)` }} />
        </div>

        <div className="px-5 pb-5">
          {/* Avatar */}
          <div className="relative h-[88px] w-[88px] -mt-11 cursor-pointer group" onClick={() => {
            const url = prompt("URL avatar baru:", avatarurl);
            if (url !== null) { handleImgUrl("avatar", url); }
          }}>
            <XpRing pct={xpPct} color={rm.color} size={88} />
            <div className="absolute inset-[4px] rounded-2xl overflow-hidden border-[3px] border-background bg-card shadow-xl">
              {avatarurl
                ? <Image src={avatarurl} alt={name} fill className="object-cover" />
                : <div className="flex h-full w-full items-center justify-center text-2xl font-black" style={{ color: rm.color + "80" }}>
                    {name.charAt(0).toUpperCase()}
                  </div>
              }
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <Pencil className="h-4 w-4 text-white opacity-0 group-hover:opacity-80 transition-opacity" />
              </div>
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-background px-1 text-[9px] font-black"
              style={{ background: rm.color + "20", color: rm.color }}>
              {lvl.level}
            </div>
          </div>

          {/* Name & badges */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-black">{name}</h2>
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider"
              style={{ color: rm.color, background: rm.color + "15", border: `1px solid ${rm.color}25` }}>
              <img src={`/roles/${rm.svg}`} alt="" className="h-3 w-3" />{rm.label}
            </span>
            {sm && <span className={cn("text-[10px] font-black", sm.color)}>{sm.label}</span>}
          </div>
          <p className="text-xs text-muted-foreground/40 mt-0.5">@{username || profile.username} · {lvlTitle}</p>

          {/* Stats */}
          <div className="mt-4 flex items-center gap-5">
            {[
              { label: "Level", val: lvl.level },
              { label: "XP", val: lvl.xpcurrent.toLocaleString() },
              { label: "Reputasi", val: lvl.reputationscore.toLocaleString() },
              { label: "Karya", val: profile.galleryCount },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-sm font-black tabular-nums">{s.val}</div>
                <div className="text-[9px] text-muted-foreground/35 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>

          {/* XP bar */}
          <div className="mt-4">
            <div className="h-1 w-full overflow-hidden rounded-full bg-muted/15">
              <div className="h-full rounded-full" style={{ width: `${xpPct}%`, background: `linear-gradient(to right, ${rm.color}60, ${rm.color})` }} />
            </div>
            <p className="mt-1 text-right text-[9px] text-muted-foreground/25">{xpPct}% menuju level {lvl.level + 1}</p>
          </div>
        </div>
      </div>

      {/* ── FORM ── */}
      <div className="space-y-7">

        {/* Identity */}
        <div>
          <p className="mb-4 text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/30">Identitas</p>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Nama Tampil">
                <Input value={displayname} onChange={v => { setDisplayname(v); setDirty(true); }} placeholder="Nama kamu" />
              </Field>
              <Field label="Username" hint="Huruf kecil, angka, underscore">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/30 text-sm">@</span>
                  <input value={username} onChange={e => { setUsername(e.target.value); setDirty(true); }}
                    className="w-full rounded-xl border border-border/25 bg-transparent pl-8 pr-3.5 py-2.5 text-sm font-mono outline-none placeholder:text-muted-foreground/25 focus:border-primary/40 transition-colors"
                    placeholder="username" />
                </div>
              </Field>
            </div>
            <Field label="Bio" hint="Maksimal 300 karakter">
              <textarea value={bio} onChange={e => { setBio(e.target.value); setDirty(true); }} rows={3}
                maxLength={300} placeholder="Ceritakan sedikit tentang dirimu..."
                className="w-full resize-none rounded-xl border border-border/25 bg-transparent px-3.5 py-2.5 text-sm outline-none placeholder:text-muted-foreground/25 focus:border-primary/40 transition-colors" />
              <p className="text-right text-[10px] text-muted-foreground/25">{bio.length}/300</p>
            </Field>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-border/20 to-transparent" />

        {/* Images */}
        <div>
          <p className="mb-4 text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/30">Gambar</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Avatar URL">
              <Input value={avatarurl} onChange={v => { setAvatarurl(v); setDirty(true); }} placeholder="https://..." />
            </Field>
            <Field label="Cover URL">
              <Input value={coverurl} onChange={v => { setCoverurl(v); setDirty(true); }} placeholder="https://..." />
            </Field>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-border/20 to-transparent" />

        {/* Social links */}
        <div>
          <p className="mb-4 text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/30">Sosial Media</p>
          <div className="space-y-3">
            {SOCIAL_FIELDS.map(({ key, label, placeholder, Icon }) => (
              <div key={key} className="flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-border/20 text-muted-foreground/40">
                  <Icon className="h-4 w-4" />
                </div>
                <input value={socials[key] ?? ""} onChange={e => handleSocialChange(key, e.target.value)}
                  placeholder={placeholder}
                  className="flex-1 rounded-xl border border-border/20 bg-transparent px-3.5 py-2 text-sm outline-none placeholder:text-muted-foreground/20 focus:border-primary/35 transition-colors" />
                {socials[key] && (
                  <a href={(SOCIAL_CONFIG.find(s => s.key === key)?.getHref(socials[key]) ?? "#")}
                    target="_blank" rel="noopener noreferrer"
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-border/20 text-muted-foreground/30 hover:text-foreground hover:border-border/50 transition-all">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-border/20 to-transparent" />

        {/* Privacy */}
        <div>
          <p className="mb-4 text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/30">Privasi</p>
          <button onClick={() => { setIsprivate(p => !p); setDirty(true); }}
            className={cn(
              "flex items-center gap-3 rounded-2xl border px-5 py-3.5 w-full text-left transition-all",
              isprivate ? "border-primary/25 bg-primary/6" : "border-border/20"
            )}>
            <div className={cn(
              "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all",
              isprivate ? "border-primary bg-primary" : "border-border/40"
            )}>
              {isprivate && <Check className="h-3 w-3 text-white" />}
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Lock className="h-3.5 w-3.5 text-muted-foreground/50" />
                Profil Privat
              </div>
              <p className="text-xs text-muted-foreground/40 mt-0.5">Sembunyikan detail profilmu dari publik</p>
            </div>
          </button>
        </div>

        {/* Badges */}
        {profile.badges.length > 0 && (
          <>
            <div className="h-px bg-gradient-to-r from-border/20 to-transparent" />
            <div>
              <p className="mb-3 text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/30 flex items-center gap-1.5">
                <Star className="h-3 w-3" /> Badge Kamu
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.badges.map(b => (
                  <span key={b.id} className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold",
                    b.badgecls ?? "border-primary/20 bg-primary/8 text-primary/70"
                  )}>
                    <span>{b.badgeicon}</span>{b.badgename}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Save button */}
        <div className="sticky bottom-6 pt-4">
          <button onClick={save} disabled={saving || !dirty}
            className={cn(
              "w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold transition-all duration-200",
              dirty && !saving
                ? "bg-primary text-white shadow-xl shadow-primary/20 hover:-translate-y-0.5"
                : "bg-muted/15 text-muted-foreground/30 cursor-not-allowed"
            )}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Menyimpan..." : dirty ? "Simpan Perubahan" : "Tidak ada perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}
