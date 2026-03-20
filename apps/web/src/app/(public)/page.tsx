"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ArrowRight, Users, Wifi,
  Calendar, BookOpen, Handshake, Star, Zap,
} from "lucide-react";
import {
  DiscordIcon, InstagramIcon, FacebookIcon, XIcon,
  TikTokIcon, YouTubeIcon, BlueSkyIcon,
} from "@/components/icons/custom-icons";
import { cn } from "@/lib/utils";

// ─── Constants ─────────────────────────────────────────────────────────────

const SOCIAL_LINKS = [
  { slug: "discord",   name: "Discord",     href: "https://discord.gg/qm3XJvRa6B",                Icon: DiscordIcon,   action: "Gabung Server",  color: "hover:border-indigo-400/50 hover:text-indigo-400" },
  { slug: "instagram", name: "Instagram",   href: "https://www.instagram.com/soraku.moe",           Icon: InstagramIcon, action: "Follow",         color: "hover:border-pink-400/50 hover:text-pink-400"    },
  { slug: "facebook",  name: "Facebook",    href: "https://www.facebook.com/share/1HQs9ZZeCw/",     Icon: FacebookIcon,  action: "Like Page",      color: "hover:border-blue-400/50 hover:text-blue-400"    },
  { slug: "x",         name: "X",           href: "https://twitter.com/@AppSora",                  Icon: XIcon,         action: "Follow",         color: "hover:border-foreground/40 hover:text-foreground" },
  { slug: "tiktok",    name: "TikTok",      href: "https://www.tiktok.com/@soraku.id",              Icon: TikTokIcon,    action: "Follow",         color: "hover:border-pink-400/50 hover:text-pink-400"    },
  { slug: "youtube",   name: "YouTube",     href: "https://youtube.com/@chsoraku",                 Icon: YouTubeIcon,   action: "Subscribe",      color: "hover:border-red-400/50 hover:text-red-400"      },
  { slug: "bluesky",   name: "Bluesky",     href: "https://bsky.app/profile/soraku.id",            Icon: BlueSkyIcon,   action: "Follow",         color: "hover:border-sky-400/50 hover:text-sky-400"      },
];

const DISCORD_GUILD_ID = "1033369620989124628";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Author { username: string | null; displayname: string | null; avatarurl: string | null; }
interface EventItem {
  id: string; slug: string; title: string; description: string | null;
  coverurl: string | null; startdate: string; status: string;
}
interface BlogItem {
  id: string; slug: string; title: string; excerpt: string | null;
  coverurl: string | null; publishedat: string; author: Author | null;
}
interface Partnership {
  id: string; name: string; logourl: string | null; website: string | null;
  category: string | null;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function getStatusInfo(status: string, startdate: string) {
  const now = Date.now();
  const start = new Date(startdate).getTime();
  if (start > now) return { label: "Upcoming", cls: "text-primary bg-primary/10 border-primary/25", dot: "bg-primary animate-pulse" };
  if (status === "selesai") return { label: "Selesai", cls: "text-muted-foreground/60 bg-muted/20 border-border/30", dot: "bg-muted-foreground/30" };
  return { label: "Live", cls: "text-green-400 bg-green-500/10 border-green-500/25", dot: "bg-green-400 animate-pulse" };
}

// ─── Discord realtime ────────────────────────────────────────────────────────

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

// ─── Skeleton ────────────────────────────────────────────────────────────────

function Skeleton3() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1,2,3].map(i => (
        <div key={i} className="animate-pulse space-y-3">
          <div className="aspect-[16/9] rounded-2xl bg-muted/20" />
          <div className="h-3.5 w-2/3 rounded bg-muted/20" />
          <div className="h-3 w-full rounded bg-muted/15" />
        </div>
      ))}
    </div>
  );
}

// ─── Event row item ───────────────────────────────────────────────────────────

function EventItem({ event }: { event: EventItem }) {
  const st = getStatusInfo(event.status, event.startdate);
  return (
    <Link href={`/events/${event.slug}`}
      className="group flex items-center gap-4 py-4 border-b border-border/30 last:border-0 transition-colors hover:bg-primary/3 -mx-2 px-2 rounded-xl">
      <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-muted/20">
        {event.coverurl
          ? <Image src={event.coverurl} alt="" fill className="object-cover transition-transform duration-300 group-hover:scale-105" unoptimized />
          : <div className="flex h-full items-center justify-center"><Calendar className="h-5 w-5 text-muted-foreground/20" /></div>
        }
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-1 text-sm font-bold text-foreground group-hover:text-primary transition-colors">{event.title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground/50">{fmtDate(event.startdate)}</p>
      </div>
      <span className={cn("flex-shrink-0 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold", st.cls)}>
        <span className={cn("h-1.5 w-1.5 rounded-full", st.dot)} />
        {st.label}
      </span>
    </Link>
  );
}

// ─── Blog item ────────────────────────────────────────────────────────────────

function BlogItem({ blog }: { blog: BlogItem }) {
  return (
    <Link href={`/blog/${blog.slug}`}
      className="group flex items-start gap-4 py-4 border-b border-border/30 last:border-0 transition-colors hover:bg-primary/3 -mx-2 px-2 rounded-xl">
      <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-muted/20">
        {blog.coverurl
          ? <Image src={blog.coverurl} alt="" fill className="object-cover transition-transform duration-300 group-hover:scale-105" unoptimized />
          : <div className="flex h-full items-center justify-center"><BookOpen className="h-5 w-5 text-muted-foreground/20" /></div>
        }
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-snug">{blog.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground/40">{fmtDate(blog.publishedat)}</p>
      </div>
    </Link>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ label, title, href, children, className }: {
  label: string; title: string; href?: string;
  children: React.ReactNode; className?: string;
}) {
  return (
    <section className={cn("px-4", className)}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex items-baseline justify-between gap-4">
          <div>
            <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-primary/50">{label}</p>
            <h2 className="text-xl font-black tracking-tight sm:text-2xl">{title}</h2>
          </div>
          {href && (
            <Link href={href}
              className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/50 hover:text-primary transition-colors">
              Lihat semua <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
        {children}
      </div>
    </section>
  );
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
      {/* ════════════════════════════════════════
          HERO
          ════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-4 pt-10 pb-16 sm:pt-14 lg:min-h-[92vh] lg:pb-20">

        {/* Background atmosphere */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[700px] w-[700px] rounded-full bg-primary/6 blur-[180px]" />
          <div className="absolute top-20 -right-40 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[150px]" />
          <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-primary/4 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[1fr_400px] lg:items-center lg:gap-20">

            {/* Left — text */}
            <div className="order-2 lg:order-1">

              {/* Badge */}
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-[11px] font-bold tracking-[0.15em] text-primary/70 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-pulse" />
                Komunitas Anime Indonesia
              </div>

              {/* Heading */}
              <h1 className="font-black tracking-tight leading-none">
                <span className="block text-[clamp(3.8rem,11vw,7.5rem)] leading-[0.9] text-foreground">Soraku</span>
                <span className="mt-3 block text-[clamp(1rem,2.5vw,1.6rem)] font-semibold text-muted-foreground/55 leading-tight">
                  Community · 空
                </span>
                <span className="mt-2 block text-[10px] font-semibold tracking-[0.5em] text-primary/35 uppercase">
                  Est. 2023 · Indonesia
                </span>
              </h1>

              {/* Apa itu Soraku */}
              <div className="mt-7 space-y-2.5 max-w-lg">
                <p className="text-sm leading-relaxed text-muted-foreground/80">
                  <span className="font-bold text-foreground/90">Soraku</span> — dari kata <em>"Sora"</em> (langit) dan <em>"ku"</em> (milikku).
                  Sebuah ruang komunitas non-profit yang terbuka untuk semua pecinta budaya Jepang di Indonesia.
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground/60">
                  Tempat berbagi karya, berdiskusi anime & manga, mengikuti event, dan bertemu teman-teman yang sefrekuensi.
                  Soraku bukan sekadar komunitas — ini rumah digitalmu.
                </p>
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/register"
                  className="group relative overflow-hidden rounded-2xl bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-primary/40">
                  <span className="relative z-10 flex items-center gap-2">
                    Bergabung Gratis <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                  <div className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
                </Link>
                <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-2xl border border-indigo-500/30 bg-indigo-500/8 px-7 py-3.5 text-sm font-semibold text-indigo-300 transition-all hover:-translate-y-0.5 hover:border-indigo-400/50 hover:bg-indigo-500/15">
                  <DiscordIcon className="h-4 w-4" /> Gabung Discord
                </a>
              </div>

              {/* Stats row */}
              <div className="mt-10 flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                  </div>
                  <span className="text-sm font-black text-foreground">
                    {discord.loading ? "—" : (discord.presence?.toLocaleString("id-ID") ?? "500") + "+"
                  }</span>
                  <span className="text-xs text-muted-foreground/50">online sekarang</span>
                </div>
                <div className="h-4 w-px bg-border/40" />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-foreground">20+</span>
                  <span className="text-xs text-muted-foreground/50">event digelar</span>
                </div>
                <div className="h-4 w-px bg-border/40" />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-foreground">100+</span>
                  <span className="text-xs text-muted-foreground/50">konten komunitas</span>
                </div>
              </div>
            </div>

            {/* Right — mascot card */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative w-[280px] sm:w-[320px]">
                {/* Glow */}
                <div className="absolute inset-0 -m-6 rounded-full bg-primary/8 blur-3xl pointer-events-none" />

                {/* Card — tanpa border, menyatu dengan background */}
                <div className="relative h-[400px] sm:h-[460px] w-full overflow-hidden rounded-[2.5rem]">
                  {/* Gradient overlay atas */}
                  <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/60 via-transparent to-transparent z-10" />
                  {/* Gradient overlay bawah */}
                  <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />

                  <Image
                    src="/logo-full.png"
                    alt="Soraku mascot"
                    fill
                    className="object-cover object-top"
                    priority
                  />

                  {/* Bottom info */}
                  <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-5">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-lg font-black text-white drop-shadow-lg">Soraku</p>
                        <p className="text-xs text-white/60">Community · 空</p>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full border border-green-500/40 bg-green-500/20 px-3 py-1.5 text-[10px] font-bold text-green-300 backdrop-blur-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> Live
                      </div>
                    </div>
                  </div>
                </div>

                {/* Float badges — menyatu tanpa card border */}
                <div className="absolute -right-8 top-14 rounded-full bg-background/80 border border-border/40 px-3 py-1.5 text-[11px] font-semibold backdrop-blur-sm float-badge">🎭 VTuber</div>
                <div className="absolute -left-10 top-28 rounded-full bg-background/80 border border-border/40 px-3 py-1.5 text-[11px] font-semibold backdrop-blur-sm float-badge" style={{ animationDelay: "0.8s" }}>🎨 Fanart</div>
                <div className="absolute -right-6 bottom-32 rounded-full bg-background/80 border border-border/40 px-3 py-1.5 text-[11px] font-semibold backdrop-blur-sm float-badge" style={{ animationDelay: "1.6s" }}>🎌 Anime</div>
                <div className="absolute -left-8 bottom-20 rounded-full bg-background/80 border border-border/40 px-3 py-1.5 text-[11px] font-semibold backdrop-blur-sm float-badge" style={{ animationDelay: "2.4s" }}>📚 Manga</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ MARQUEE ════ */}
      <section className="overflow-hidden border-y border-border/30 py-3.5">
        <div className="marquee-track flex gap-10 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/25">
          {[...Array(4)].map((_, i) =>
            ["🎌 Anime","📚 Manga","🎵 J-Music","🎭 VTuber","🎨 Fanart","👘 Cosplay","🎮 Gaming","🌸 Culture"]
              .map(item => <span key={`${i}-${item}`}>{item}</span>)
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════
          EVENTS + BLOGS — 2 kolom
          ════════════════════════════════════════ */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">

            {/* Events */}
            <div>
              <div className="mb-6 flex items-baseline justify-between">
                <div>
                  <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-primary/50">Event</p>
                  <h2 className="text-xl font-black sm:text-2xl">Event Terbaru</h2>
                </div>
                <Link href="/events" className="text-xs font-semibold text-muted-foreground/50 hover:text-primary transition-colors flex items-center gap-1">
                  Semua <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              {loading ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => <div key={i} className="flex gap-4 py-4 border-b border-border/20"><div className="h-16 w-24 rounded-xl bg-muted/20 animate-pulse flex-shrink-0" /><div className="flex-1 space-y-2"><div className="h-3.5 w-3/4 rounded bg-muted/20 animate-pulse" /><div className="h-3 w-1/2 rounded bg-muted/15 animate-pulse" /></div></div>)}
                </div>
              ) : data.events.length === 0 ? (
                <div className="py-12 text-center">
                  <Calendar className="mx-auto h-8 w-8 text-muted-foreground/20 mb-3" />
                  <p className="text-sm text-muted-foreground/40">Belum ada event</p>
                </div>
              ) : (
                <div>{data.events.map(e => <EventItem key={e.id} event={e} />)}</div>
              )}
            </div>

            {/* Blogs */}
            <div>
              <div className="mb-6 flex items-baseline justify-between">
                <div>
                  <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-primary/50">Blog</p>
                  <h2 className="text-xl font-black sm:text-2xl">Artikel Terbaru</h2>
                </div>
                <Link href="/blog" className="text-xs font-semibold text-muted-foreground/50 hover:text-primary transition-colors flex items-center gap-1">
                  Semua <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              {loading ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => <div key={i} className="flex gap-4 py-4 border-b border-border/20"><div className="h-16 w-24 rounded-xl bg-muted/20 animate-pulse flex-shrink-0" /><div className="flex-1 space-y-2"><div className="h-3.5 w-3/4 rounded bg-muted/20 animate-pulse" /><div className="h-3 w-1/2 rounded bg-muted/15 animate-pulse" /></div></div>)}
                </div>
              ) : data.blogs.length === 0 ? (
                <div className="py-12 text-center">
                  <BookOpen className="mx-auto h-8 w-8 text-muted-foreground/20 mb-3" />
                  <p className="text-sm text-muted-foreground/40">Belum ada artikel</p>
                </div>
              ) : (
                <div>{data.blogs.map(b => <BlogItem key={b.id} blog={b} />)}</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          DISCORD — real time
          ════════════════════════════════════════ */}
      <section className="px-4 pb-16 sm:pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/50 via-background/60 to-background">
            {/* Ambient */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/8 blur-3xl" />

            <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8 lg:p-10">
              {/* Icon */}
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/15">
                <DiscordIcon className="h-8 w-8 text-indigo-300" />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <h3 className="text-lg font-black">{discord.name}</h3>
                  <span className="flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 text-[10px] font-bold text-green-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> Online
                  </span>
                </div>
                <p className="text-sm text-muted-foreground/65 leading-relaxed max-w-md">
                  Server komunitas anime, manga & budaya Jepang Indonesia. Chat, nonton bareng, dan banyak lagi. Aktif 24/7.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-3.5 w-3.5 text-green-400" />
                    <span className="text-sm font-black">
                      {discord.loading ? "—" : (discord.presence?.toLocaleString("id-ID") ?? "—")}
                    </span>
                    <span className="text-xs text-muted-foreground/50">online sekarang</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-muted-foreground/40" />
                    <span className="text-sm font-black">500+</span>
                    <span className="text-xs text-muted-foreground/50">total member</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
                className="flex-shrink-0 self-start sm:self-center inline-flex items-center gap-2 rounded-2xl bg-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 hover:bg-indigo-400">
                <DiscordIcon className="h-4 w-4" /> Gabung Sekarang <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          PARTNERSHIP / SPONSOR
          ════════════════════════════════════════ */}
      {data.partnerships.length > 0 && (
        <section className="px-4 pb-16 sm:pb-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground/35">Kolaborasi</p>
              <h2 className="text-xl font-black sm:text-2xl">Partner & Sponsor</h2>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {data.partnerships.map(p => (
                <a key={p.id} href={p.website ?? "#"} target={p.website ? "_blank" : undefined} rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-2.5 rounded-2xl px-5 py-4 transition-all hover:bg-primary/5 w-28 text-center">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-muted/20 border border-border/40 group-hover:border-primary/30 transition-colors">
                    {p.logourl
                      ? <Image src={p.logourl} alt={p.name} width={48} height={48} className="h-full w-full object-contain" />
                      : <Handshake className="h-5 w-5 text-muted-foreground/30" />
                    }
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-foreground/70 group-hover:text-primary transition-colors">{p.name}</p>
                    {p.category && <p className="text-[9px] text-muted-foreground/40 mt-0.5">{p.category}</p>}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════
          SOSIAL MEDIA
          ════════════════════════════════════════ */}
      <section className="px-4 pb-16 sm:pb-20 border-t border-border/25 pt-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-primary/50">Ikuti Kami</p>
            <h2 className="text-xl font-black sm:text-2xl">Sosial Media</h2>
          </div>
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {SOCIAL_LINKS.map(({ slug, name, href, Icon, action, color }) => (
              <a key={slug} href={href} target="_blank" rel="noopener noreferrer"
                className={cn(
                  "group flex items-center gap-3 rounded-2xl border border-border/40 bg-card/30 px-5 py-3.5 transition-all hover:-translate-y-0.5",
                  color
                )}>
                <Icon className="h-4 w-4 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-foreground leading-none">{name}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground/50 group-hover:text-current/70 transition-colors">{action}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          JOIN CTA — hanya jika belum login
          ════════════════════════════════════════ */}
      {!isLoggedIn && user !== "loading" && (
        <section className="px-4 pb-24">
          <div className="mx-auto max-w-2xl">
            <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background/50 to-accent/8 px-8 py-14 sm:px-14 text-center">
              {/* Glow */}
              <div className="pointer-events-none absolute inset-0 -z-0">
                <div className="absolute inset-0 -m-8 rounded-full bg-primary/5 blur-3xl" />
              </div>

              <div className="relative">
                <div className="mb-4 flex justify-center gap-1.5 text-2xl">
                  <span>🌸</span><span>🎌</span><span>✨</span>
                </div>
                <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                  Jadilah bagian dari Soraku
                </h2>
                <p className="mt-3 text-sm text-muted-foreground/70 leading-relaxed max-w-sm mx-auto">
                  Gratis selamanya. Temukan komunitas yang hangat, supportif, dan penuh semangat di sini.
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  <Link href="/register"
                    className="inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary/90">
                    Daftar Gratis <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/about"
                    className="inline-flex items-center gap-2 rounded-2xl border border-border/60 px-7 py-3.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
                    Tentang Soraku
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
