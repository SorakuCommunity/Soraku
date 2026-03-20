"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ArrowRight, Users, Wifi, Calendar, BookOpen,
  Handshake, Eye, Heart, ChevronRight,
} from "lucide-react";
import {
  DiscordIcon, InstagramIcon, FacebookIcon, XIcon,
  TikTokIcon, YouTubeIcon, BlueSkyIcon,
} from "@/components/icons/custom-icons";
import { cn } from "@/lib/utils";

// ─── Constants ──────────────────────────────────────────────────────────────

const SOCIAL_LINKS = [
  { slug: "discord",   name: "Discord",   href: "https://discord.gg/qm3XJvRa6B",                Icon: DiscordIcon,   color: "text-indigo-400",   bg: "hover:bg-indigo-500/8"  },
  { slug: "instagram", name: "Instagram", href: "https://www.instagram.com/soraku.moe",           Icon: InstagramIcon, color: "text-pink-400",     bg: "hover:bg-pink-500/8"    },
  { slug: "facebook",  name: "Facebook",  href: "https://www.facebook.com/share/1HQs9ZZeCw/",     Icon: FacebookIcon,  color: "text-blue-400",     bg: "hover:bg-blue-500/8"    },
  { slug: "x",         name: "X",         href: "https://twitter.com/@AppSora",                  Icon: XIcon,         color: "text-foreground/70", bg: "hover:bg-white/5"       },
  { slug: "tiktok",    name: "TikTok",    href: "https://www.tiktok.com/@soraku.id",              Icon: TikTokIcon,    color: "text-pink-300",     bg: "hover:bg-pink-500/8"    },
  { slug: "youtube",   name: "YouTube",   href: "https://youtube.com/@chsoraku",                 Icon: YouTubeIcon,   color: "text-red-400",      bg: "hover:bg-red-500/8"     },
  { slug: "bluesky",   name: "Bluesky",   href: "https://bsky.app/profile/soraku.id",            Icon: BlueSkyIcon,   color: "text-sky-400",      bg: "hover:bg-sky-500/8"     },
];

const DISCORD_GUILD_ID = "1033369620989124628";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Author { username: string | null; displayname: string | null; avatarurl: string | null; }
interface EventItem {
  id: string; slug: string; title: string; description: string | null;
  coverurl: string | null; startdate: string; status: string;
}
interface BlogItem {
  id: string; slug: string; title: string; excerpt: string | null;
  coverurl: string | null; publishedat: string; viewcount?: number; likecount?: number;
  author: Author | null;
}
interface Partnership {
  id: string; name: string; logourl: string | null; website: string | null; category: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function getStatusInfo(status: string, startdate: string) {
  const now = Date.now();
  const start = new Date(startdate).getTime();
  if (start > now) return { label: "Upcoming", cls: "text-primary bg-primary/10 border-primary/20", dot: "bg-primary animate-pulse" };
  if (status === "selesai") return { label: "Selesai", cls: "text-muted-foreground/50 bg-muted/15 border-border/20", dot: "bg-muted-foreground/25" };
  return { label: "Live", cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-400 animate-pulse" };
}

function useDiscord() {
  const [data, setData] = useState<{ presence: number | null; name: string; loading: boolean }>({ presence: null, name: "Soraku Community", loading: true });
  useEffect(() => {
    fetch(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/widget.json`)
      .then(r => r.ok ? r.json() : null)
      .then(d => setData({ presence: d?.presence_count ?? null, name: d?.name ?? "Soraku Community", loading: false }))
      .catch(() => setData(p => ({ ...p, loading: false })));
  }, []);
  return data;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const discord = useDiscord();
  const [data, setData] = useState<{ events: EventItem[]; blogs: BlogItem[]; partnerships: Partnership[] }>({
    events: [], blogs: [], partnerships: [],
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string } | null | "loading">("loading");

  useEffect(() => {
    fetch("/api/home")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.data) setData(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch("/api/auth/me", { cache: "no-store" })
      .then(r => r.json())
      .then(d => setUser(d.data ?? null))
      .catch(() => setUser(null));
  }, []);

  const isLoggedIn = user !== "loading" && user !== null;

  return (
    <>
      {/* ══════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════ */}
      <section className="relative min-h-[95vh] overflow-hidden flex items-center px-4 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 h-[900px] w-[900px] rounded-full bg-primary/7 blur-[200px]" />
          <div className="absolute top-1/3 -right-1/4 h-[600px] w-[600px] rounded-full bg-accent/6 blur-[180px]" />
          <div className="absolute bottom-0 -left-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[160px]" />
        </div>

        <div className="mx-auto w-full max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-[1fr_420px] lg:items-center lg:gap-24">

            {/* Left */}
            <div className="order-2 lg:order-1 max-w-2xl">
              <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-primary/15 bg-primary/6 px-4 py-1.5 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[10px] font-black tracking-[0.18em] text-primary/70 uppercase">
                  {discord.loading ? "—" : `${discord.presence?.toLocaleString("id-ID") ?? "500"}+ online`} · Soraku Community
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="text-[clamp(4rem,12vw,8rem)] font-black leading-[0.88] tracking-tighter text-foreground">
                  Soraku
                </h1>
                <p className="text-[clamp(1.1rem,2.8vw,1.8rem)] font-light text-muted-foreground/50 tracking-wide pl-1">
                  Community · 空 · Est. 2023
                </p>
              </div>

              <div className="my-8 h-px w-24 bg-gradient-to-r from-primary/40 to-transparent" />

              <div className="space-y-3 max-w-lg">
                <p className="text-base leading-relaxed text-muted-foreground/80">
                  <span className="font-bold text-foreground">Soraku</span> — dari kata <em className="text-foreground/70 not-italic font-medium">"Sora"</em> (langit) dan <em className="text-foreground/70 not-italic font-medium">"ku"</em> (milikku).
                </p>
                <p className="text-sm leading-loose text-muted-foreground/60">
                  Ruang komunitas non-profit untuk semua pecinta anime, manga, dan budaya Jepang di Indonesia.
                  Tempat berbagi karya, berdiskusi, mengikuti event, dan bertemu teman yang sefrekuensi.
                </p>
                <p className="text-sm text-muted-foreground/50">
                  Gratis. Terbuka. Hangat. <span className="text-primary/70 font-semibold">Ini rumah digitalmu.</span>
                </p>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link href="/register"
                  className="group relative overflow-hidden rounded-2xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/35">
                  <span className="relative z-10 flex items-center gap-2">
                    Bergabung Gratis
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 transition-transform duration-500 group-hover:translate-x-full" />
                </Link>
                <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-2xl border border-indigo-500/25 bg-indigo-500/8 px-8 py-3.5 text-sm font-semibold text-indigo-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/40 hover:bg-indigo-500/14">
                  <DiscordIcon className="h-4 w-4" /> Gabung Discord
                </a>
              </div>

              <div className="mt-12 flex flex-wrap items-center gap-8">
                {[
                  { val: discord.loading ? "—" : `${discord.presence?.toLocaleString("id-ID") ?? "500"}+`, label: "online sekarang", live: true },
                  { val: "20+", label: "event digelar" },
                  { val: "100+", label: "konten komunitas" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    {s.live && (
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                      </span>
                    )}
                    <span className="text-sm font-black text-foreground">{s.val}</span>
                    <span className="text-xs text-muted-foreground/45">{s.label}</span>
                    {i < 2 && <span className="ml-2 h-3 w-px bg-border/30" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — mascot, seamless */}
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative w-[260px] sm:w-[320px] lg:w-[360px]">
                <div className="absolute inset-0 -m-10 rounded-full bg-primary/10 blur-3xl" />
                <div className="relative h-[480px] sm:h-[540px] w-full">
                  <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background via-background/40 to-transparent z-10" />
                  <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background via-background/70 to-transparent z-10" />
                  <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background/60 to-transparent z-10" />
                  <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background/60 to-transparent z-10" />
                  <Image src="/logo-full.png" alt="Soraku mascot" fill className="object-cover object-center" priority />
                </div>
                <div className="absolute -right-6 top-20 rounded-full border border-border/30 bg-background/70 px-3.5 py-1.5 text-[11px] font-semibold backdrop-blur-md float-badge shadow-sm">🌸 Komunitas</div>
                <div className="absolute -left-8 top-36 rounded-full border border-border/30 bg-background/70 px-3.5 py-1.5 text-[11px] font-semibold backdrop-blur-md float-badge shadow-sm" style={{ animationDelay: "1s" }}>🎌 Anime & Manga</div>
                <div className="absolute -right-4 bottom-36 rounded-full border border-border/30 bg-background/70 px-3.5 py-1.5 text-[11px] font-semibold backdrop-blur-md float-badge shadow-sm" style={{ animationDelay: "2s" }}>✨ Non-profit</div>
                <div className="absolute -left-6 bottom-24 rounded-full border border-border/30 bg-background/70 px-3.5 py-1.5 text-[11px] font-semibold backdrop-blur-md float-badge shadow-sm" style={{ animationDelay: "0.5s" }}>🇮🇩 Indonesia</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-25">
          <div className="h-7 w-px bg-gradient-to-b from-foreground/40 to-transparent" />
          <div className="h-4 w-px bg-gradient-to-b from-foreground/20 to-transparent" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          MARQUEE STRIP
          ══════════════════════════════════════════════ */}
      <div className="overflow-hidden border-y border-border/20 py-3">
        <div className="marquee-track flex gap-12 whitespace-nowrap text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/20">
          {[...Array(4)].map((_, i) =>
            ["🎌 Anime","📚 Manga","🎵 J-Music","🎭 VTuber","🎨 Fanart","👘 Cosplay","🎮 Gaming","🌸 Culture","🌙 Soraku"]
              .map(item => <span key={`${i}-${item}`}>{item}</span>)
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          DISCORD — realtime
          ══════════════════════════════════════════════ */}
      <section className="px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex items-center gap-4">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-primary/40 mb-1">Real-time</p>
              <h2 className="text-2xl font-black tracking-tight">Server Discord</h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-border/40 to-transparent" />
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-0 -m-16 rounded-full bg-indigo-600/6 blur-3xl -z-10" />
            <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-12">
              <div className="flex items-center gap-5">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
                  <div className="absolute inset-0 rounded-2xl bg-indigo-500/8 blur-md" />
                  <DiscordIcon className="relative h-7 w-7 text-indigo-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-black">{discord.name}</h3>
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-black text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />LIVE
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground/50">Anime · Manga · Budaya Jepang · Indonesia</p>
                </div>
              </div>

              <div className="hidden sm:block h-14 w-px bg-gradient-to-b from-transparent via-border/30 to-transparent" />

              <div className="flex items-center gap-8 flex-1">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Wifi className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-xl font-black">{discord.loading ? "—" : (discord.presence?.toLocaleString("id-ID") ?? "—")}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground/40">online sekarang</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-3.5 w-3.5 text-muted-foreground/30" />
                    <span className="text-xl font-black">500+</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground/40">total member</p>
                </div>
              </div>

              <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
                className="group flex-shrink-0 inline-flex items-center gap-2.5 rounded-2xl border border-indigo-500/25 bg-indigo-500/10 px-6 py-3 text-sm font-bold text-indigo-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/40 hover:bg-indigo-500/18">
                <DiscordIcon className="h-4 w-4" /> Gabung
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
            <div className="mt-10 h-px bg-gradient-to-r from-transparent via-indigo-500/15 to-transparent" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          EVENTS + BLOG
          ══════════════════════════════════════════════ */}
      <section className="px-4 pb-20 sm:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">

            {/* Events */}
            <div>
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-primary/40 mb-1">Terbaru</p>
                  <h2 className="text-2xl font-black tracking-tight">Event</h2>
                </div>
                <Link href="/events" className="group flex items-center gap-1 text-xs font-semibold text-muted-foreground/35 hover:text-primary transition-colors">
                  Semua <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
              <div className="mb-6 h-px bg-gradient-to-r from-primary/20 via-border/25 to-transparent" />

              {loading ? (
                <div>{[1,2,3,4].map(i => <div key={i} className="flex items-center gap-4 py-4 border-b border-border/10 last:border-0 animate-pulse"><div className="h-14 w-20 rounded-xl bg-muted/12 flex-shrink-0" /><div className="flex-1 space-y-2"><div className="h-3 w-3/4 rounded bg-muted/12" /><div className="h-2.5 w-1/2 rounded bg-muted/8" /></div></div>)}</div>
              ) : data.events.length === 0 ? (
                <div className="py-14 text-center"><Calendar className="mx-auto h-8 w-8 text-muted-foreground/10 mb-3" /><p className="text-sm text-muted-foreground/25">Belum ada event</p></div>
              ) : (
                <div>
                  {data.events.map(e => {
                    const st = getStatusInfo(e.status, e.startdate);
                    return (
                      <Link key={e.id} href={`/events/${e.slug}`}
                        className="group flex items-center gap-4 py-4 border-b border-border/12 last:border-0 transition-all hover:border-primary/12 -mx-3 px-3 rounded-xl">
                        <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted/12">
                          {e.coverurl
                            ? <Image src={e.coverurl} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-110" unoptimized />
                            : <div className="flex h-full items-center justify-center"><Calendar className="h-4 w-4 text-muted-foreground/15" /></div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="line-clamp-1 text-sm font-bold group-hover:text-primary transition-colors">{e.title}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground/35">{fmtDate(e.startdate)}</p>
                        </div>
                        <span className={cn("flex-shrink-0 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-black", st.cls)}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", st.dot)} />{st.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Blog */}
            <div>
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-primary/40 mb-1">Komunitas</p>
                  <h2 className="text-2xl font-black tracking-tight">Artikel</h2>
                </div>
                <Link href="/blog" className="group flex items-center gap-1 text-xs font-semibold text-muted-foreground/35 hover:text-primary transition-colors">
                  Semua <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
              <div className="mb-6 h-px bg-gradient-to-r from-primary/20 via-border/25 to-transparent" />

              {loading ? (
                <div>{[1,2,3,4].map(i => <div key={i} className="flex items-start gap-4 py-4 border-b border-border/10 last:border-0 animate-pulse"><div className="h-14 w-20 rounded-xl bg-muted/12 flex-shrink-0" /><div className="flex-1 space-y-2 pt-1"><div className="h-3 w-4/5 rounded bg-muted/12" /><div className="h-2.5 w-1/2 rounded bg-muted/8" /></div></div>)}</div>
              ) : data.blogs.length === 0 ? (
                <div className="py-14 text-center"><BookOpen className="mx-auto h-8 w-8 text-muted-foreground/10 mb-3" /><p className="text-sm text-muted-foreground/25">Belum ada artikel</p></div>
              ) : (
                <div>
                  {data.blogs.map(b => (
                    <Link key={b.id} href={`/blog/${b.slug}`}
                      className="group flex items-start gap-4 py-4 border-b border-border/12 last:border-0 transition-all hover:border-primary/12 -mx-3 px-3 rounded-xl">
                      <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted/12">
                        {b.coverurl
                          ? <Image src={b.coverurl} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-110" unoptimized />
                          : <div className="flex h-full items-center justify-center"><BookOpen className="h-4 w-4 text-muted-foreground/15" /></div>
                        }
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="line-clamp-2 text-sm font-bold leading-snug group-hover:text-primary transition-colors">{b.title}</p>
                        <div className="mt-1.5 flex items-center gap-3">
                          <span className="text-xs text-muted-foreground/30">{fmtDate(b.publishedat)}</span>
                          <span className="flex items-center gap-2 text-[10px] text-muted-foreground/25">
                            {b.viewcount ? <span className="flex items-center gap-1"><Eye className="h-2.5 w-2.5" />{b.viewcount}</span> : null}
                            {b.likecount ? <span className="flex items-center gap-1"><Heart className="h-2.5 w-2.5" />{b.likecount}</span> : null}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SOSIAL MEDIA — scrolling marquee, no cards
          Inspired by about page tapi vertical flow
          ══════════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 border-t border-border/15">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 flex items-center gap-4">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-primary/40 mb-1">Ikuti Kami</p>
              <h2 className="text-2xl font-black tracking-tight">Sosial Media</h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-border/40 to-transparent" />
          </div>
        </div>

        {/* Scrolling social links — dua arah, no cards */}
        <div className="relative overflow-hidden py-2">
          {/* Fade kiri kanan */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

          {/* Row 1 — kiri ke kanan */}
          <div className="marquee-track mb-2 flex gap-8 whitespace-nowrap">
            {[...Array(4)].map((_, i) =>
              SOCIAL_LINKS.map(({ slug, name, href, Icon, color, bg }) => (
                <a key={`r1-${i}-${slug}`} href={href} target="_blank" rel="noopener noreferrer"
                  className={cn(
                    "group inline-flex items-center gap-3 rounded-full px-5 py-2.5 transition-all duration-300",
                    bg
                  )}>
                  <Icon className={cn("h-4 w-4 text-muted-foreground/30 transition-colors group-hover:scale-110 group-hover:transition-transform", `group-hover:${color}`)} />
                  <span className="text-sm font-semibold text-muted-foreground/50 group-hover:text-foreground/80 transition-colors">{name}</span>
                </a>
              ))
            )}
          </div>

          {/* Row 2 — kanan ke kiri (reverse) */}
          <div className="marquee-track-reverse flex gap-8 whitespace-nowrap">
            {[...Array(4)].map((_, i) =>
              [...SOCIAL_LINKS].reverse().map(({ slug, name, href, Icon, color, bg }) => (
                <a key={`r2-${i}-${slug}`} href={href} target="_blank" rel="noopener noreferrer"
                  className={cn(
                    "group inline-flex items-center gap-3 rounded-full px-5 py-2.5 transition-all duration-300",
                    bg
                  )}>
                  <Icon className={cn("h-4 w-4 text-muted-foreground/25 transition-colors group-hover:scale-110", `group-hover:${color}`)} />
                  <span className="text-sm font-semibold text-muted-foreground/40 group-hover:text-foreground/80 transition-colors">{name}</span>
                </a>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PARTNERSHIP / SPONSOR
          ══════════════════════════════════════════════ */}
      {data.partnerships.length > 0 && (
        <section className="px-4 pb-20 sm:pb-24 border-t border-border/15 pt-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/25 mb-2">Kolaborasi</p>
              <h2 className="text-2xl font-black tracking-tight">Partner & Sponsor</h2>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14">
              {data.partnerships.map(p => (
                <a key={p.id} href={p.website ?? "#"} target={p.website ? "_blank" : undefined} rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-2.5 transition-all duration-300 hover:-translate-y-0.5 opacity-50 hover:opacity-100">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-muted/15 border border-border/20 transition-colors group-hover:border-primary/20">
                    {p.logourl
                      ? <Image src={p.logourl} alt={p.name} width={48} height={48} className="h-full w-full object-contain" />
                      : <Handshake className="h-5 w-5 text-muted-foreground/20" />
                    }
                  </div>
                  <p className="text-[10px] font-bold text-foreground/50 group-hover:text-primary transition-colors">{p.name}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          JOIN CTA — hanya jika belum login
          ══════════════════════════════════════════════ */}
      {!isLoggedIn && user !== "loading" && (
        <section className="relative px-4 pb-28 pt-20 overflow-hidden border-t border-border/15">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="mx-auto max-w-xl text-center">
            <div className="mb-6 text-4xl">🌸</div>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Jadilah bagian dari <span className="text-primary">Soraku</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground/55 max-w-sm mx-auto">
              Gratis selamanya. Komunitas yang hangat, supportif, dan penuh semangat untuk semua pecinta anime di Indonesia.
            </p>

            <div className="my-8 flex items-center gap-4 max-w-xs mx-auto">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border/25" />
              <span className="text-xs text-muted-foreground/20 font-semibold">bergabung sekarang</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border/25" />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5">
                Daftar Gratis
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-border/25 px-8 py-3.5 text-sm font-semibold text-muted-foreground/60 transition-all hover:border-primary/20 hover:text-foreground">
                Tentang Soraku
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
