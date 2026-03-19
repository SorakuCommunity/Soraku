"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ArrowRight, Users, Wifi,
  Calendar, BookOpen, Handshake,
} from "lucide-react";
import {
  DiscordIcon, InstagramIcon, FacebookIcon, XIcon,
  TikTokIcon, YouTubeIcon, BlueSkyIcon,
} from "@/components/icons/custom-icons";
import { cn } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

const HERO_CATEGORIES = [
  { emoji: "🎌", label: "Anime / Manga" },
  { emoji: "🎨", label: "Fanart" },
  { emoji: "👘", label: "Cosplay" },
  { emoji: "🎭", label: "VTuber" },
  { emoji: "🗾", label: "Culture Jepang" },
];

const SOCIAL_LINKS = [
  { slug: "discord",   name: "Discord",     href: "https://discord.gg/qm3XJvRa6B",                 Icon: DiscordIcon,   action: "Gabung Server" },
  { slug: "instagram", name: "Instagram",   href: "https://www.instagram.com/soraku.moe",            Icon: InstagramIcon, action: "Follow" },
  { slug: "facebook",  name: "Facebook",    href: "https://www.facebook.com/share/1HQs9ZZeCw/",      Icon: FacebookIcon,  action: "Like Page" },
  { slug: "x",         name: "X / Twitter", href: "https://twitter.com/@AppSora",                   Icon: XIcon,         action: "Follow" },
  { slug: "tiktok",    name: "TikTok",      href: "https://www.tiktok.com/@soraku.id",               Icon: TikTokIcon,    action: "Follow" },
  { slug: "youtube",   name: "YouTube",     href: "https://youtube.com/@chsoraku",                  Icon: YouTubeIcon,   action: "Subscribe" },
  { slug: "bluesky",   name: "Bluesky",     href: "https://bsky.app/profile/soraku.id",             Icon: BlueSkyIcon,   action: "Follow" },
];

const DISCORD_GUILD_ID = "1033369620989124628";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Author {
  username: string | null;
  displayname: string | null;
  avatarurl: string | null;
}
interface EventItem {
  id: string; slug: string; title: string; description: string | null;
  coverurl: string | null; startdate: string; status: "online" | "pending" | "selesai";
  author: Author | null;
}
interface BlogItem {
  id: string; slug: string; title: string; excerpt: string | null;
  coverurl: string | null; publishedat: string; author: Author | null;
}
interface Partnership {
  id: string; name: string; logourl: string | null; website: string | null;
  category: string | null; description: string | null;
}

// ─── Utils ────────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: EventItem["status"] }) {
  const map = {
    online:  { label: "Online",  cls: "bg-green-500/15 text-green-400 border-green-500/30",     dot: "bg-green-400 animate-pulse" },
    pending: { label: "Pending", cls: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30", dot: "bg-yellow-400" },
    selesai: { label: "Selesai", cls: "bg-muted/30 text-muted-foreground/60 border-border/40", dot: "bg-muted-foreground/40" },
  };
  const m = map[status] ?? map.pending;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wide", m.cls)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", m.dot)} /> {m.label}
    </span>
  );
}

// ─── Author Row ───────────────────────────────────────────────────────────────

function AuthorRow({ author }: { author: Author }) {
  return (
    <div className="mt-auto flex items-center gap-2 pt-3 border-t border-border/30">
      <div className="h-5 w-5 flex-shrink-0 overflow-hidden rounded-full bg-primary/20">
        {author.avatarurl ? (
          <Image src={author.avatarurl} alt="" width={20} height={20} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[8px] font-bold text-primary">
            {(author.displayname ?? author.username ?? "?").charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <span className="text-[11px] text-muted-foreground/50">@{author.username ?? "—"}</span>
    </div>
  );
}

// ─── Event Card ───────────────────────────────────────────────────────────────

function EventCard({ event }: { event: EventItem }) {
  return (
    <Link href={`/events/${event.slug}`}
      className="glass-card group flex flex-col overflow-hidden rounded-2xl transition-all hover:-translate-y-1 hover:border-primary/30">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted/20">
        {event.coverurl ? (
          <Image src={event.coverurl} alt={event.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground/20"><Calendar className="h-10 w-10" /></div>
        )}
        <div className="absolute bottom-2 left-2"><StatusBadge status={event.status} /></div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs text-muted-foreground/50">{formatDate(event.startdate)}</p>
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground group-hover:text-primary transition-colors">{event.title}</h3>
        {event.description && <p className="line-clamp-2 text-xs text-muted-foreground/60 leading-relaxed">{event.description}</p>}
        {event.author && <AuthorRow author={event.author} />}
      </div>
    </Link>
  );
}

// ─── Blog Card ────────────────────────────────────────────────────────────────

function BlogCard({ blog }: { blog: BlogItem }) {
  return (
    <Link href={`/blog/${blog.slug}`}
      className="glass-card group flex flex-col overflow-hidden rounded-2xl transition-all hover:-translate-y-1 hover:border-primary/30">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted/20">
        {blog.coverurl ? (
          <Image src={blog.coverurl} alt={blog.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground/20"><BookOpen className="h-10 w-10" /></div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs text-muted-foreground/50">{formatDate(blog.publishedat)}</p>
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground group-hover:text-primary transition-colors">{blog.title}</h3>
        {blog.excerpt && <p className="line-clamp-2 text-xs text-muted-foreground/60 leading-relaxed">{blog.excerpt}</p>}
        {blog.author && <AuthorRow author={blog.author} />}
      </div>
    </Link>
  );
}

// ─── Discord Real-Time Card ───────────────────────────────────────────────────

function DiscordCard() {
  const [presence, setPresence] = useState<number | null>(null);
  const [serverName, setServerName] = useState("Soraku Community");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/widget.json`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) { setPresence(d.presence_count); if (d.name) setServerName(d.name); } })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 via-background/50 to-primary/5 p-6 sm:p-8 backdrop-blur-sm">
      <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-primary/8 blur-2xl" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
        {/* Icon */}
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/15">
          <DiscordIcon className="h-8 w-8 text-indigo-300" />
        </div>
        {/* Info */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-black text-foreground">{serverName}</h3>
            <span className="flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> ONLINE
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground/70 leading-relaxed">
            Server komunitas anime & budaya Jepang Indonesia. Aktif 24/7.
          </p>
          {/* Stats: total & aktif */}
          <div className="mt-3 flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-muted-foreground/50" />
              {loading
                ? <span className="h-3.5 w-12 animate-pulse rounded bg-muted/30" />
                : <span className="text-sm font-bold text-foreground">{presence != null ? `${presence.toLocaleString("id-ID")}` : "500+"}</span>
              }
              <span className="text-xs text-muted-foreground/50">total member</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi className="h-3.5 w-3.5 text-green-400" />
              {loading
                ? <span className="h-3.5 w-10 animate-pulse rounded bg-muted/30" />
                : <span className="text-sm font-bold text-foreground">{presence != null ? `${presence.toLocaleString("id-ID")}` : "—"}</span>
              }
              <span className="text-xs text-muted-foreground/50">user aktif</span>
            </div>
          </div>
        </div>
        {/* CTA */}
        <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
          className="flex-shrink-0 self-start sm:self-center flex items-center gap-2 rounded-2xl bg-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-400">
          <DiscordIcon className="h-4 w-4" /> Join Discord <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ eyebrow, title, subtitle, href }: {
  eyebrow: string; title: string; subtitle?: string; href?: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-primary/60">{eyebrow}</p>
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1.5 text-sm text-muted-foreground/70">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="flex-shrink-0 flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition-all hover:border-primary/40 hover:text-primary">
          Lihat semua <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}

// ─── Skeleton Grid ────────────────────────────────────────────────────────────

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1,2,3].map(i => (
        <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse">
          <div className="aspect-[16/9] bg-muted/30" />
          <div className="p-4 space-y-2">
            <div className="h-3 w-24 bg-muted/30 rounded" />
            <div className="h-4 w-full bg-muted/30 rounded" />
            <div className="h-3 w-3/4 bg-muted/20 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [homeData, setHomeData] = useState<{ events: EventItem[]; blogs: BlogItem[]; partnerships: Partnership[] }>({
    events: [], blogs: [], partnerships: [],
  });
  const [dataLoading, setDataLoading] = useState(true);
  const [discordMembers, setDiscordMembers] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/home")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.data) setHomeData(d.data); })
      .catch(() => {})
      .finally(() => setDataLoading(false));

    fetch(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/widget.json`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.presence_count) setDiscordMembers(d.presence_count); })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* ════ HERO ════ */}
      <section className="relative overflow-hidden px-4 pt-12 pb-16 sm:pt-16 lg:min-h-[90vh] lg:pt-20 lg:pb-20">
        {/* Atmosphere */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="animate-blob absolute -top-48 -left-32 h-[600px] w-[600px] rounded-full bg-primary/8 blur-[160px]" />
          <div className="animate-blob animation-delay-2000 absolute -top-10 right-0 h-[500px] w-[500px] rounded-full bg-accent/6 blur-[140px]" />
          <div className="animate-blob animation-delay-4000 absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[130px]" />
          <svg className="absolute inset-0 h-full w-full opacity-[0.018]" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#4FA3D1" strokeWidth="0.5" />
            </pattern></defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-12 lg:grid lg:grid-cols-[1fr_420px] lg:items-center lg:gap-16">
            <div>
              {/* Eyebrow */}
              <div className="border-primary/20 bg-primary/8 text-primary/80 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold tracking-[0.18em] uppercase">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/70" />
                Komunitas Anime &amp; Budaya Jepang Indonesia
              </div>

              {/* Heading */}
              <h1 className="font-heading leading-none tracking-tight">
                <span className="block text-[clamp(4rem,12vw,8rem)] leading-[0.88] font-black text-foreground/95">Soraku</span>
                <span className="mt-2 block text-[clamp(1.2rem,3vw,2rem)] leading-tight font-semibold text-muted-foreground/60">Community</span>
                <span className="mt-3 block text-[10px] font-semibold tracking-[0.5em] text-primary/40 uppercase sm:text-[11px]">空 · Indonesia · Est. 2023</span>
              </h1>

              {/* 5 categories — center mobile */}
              <div className="mt-6 flex flex-wrap justify-center gap-2 sm:justify-start">
                {HERO_CATEGORIES.map((cat, i) => (
                  <span key={cat.label} className={cn("rounded-full px-3.5 py-1.5 text-xs font-semibold",
                    i === 0 ? "border border-primary/25 bg-primary/10 text-primary/80"
                    : i === 1 ? "border border-accent/25 bg-accent/8 text-accent/75"
                    : "border border-border/60 text-muted-foreground/55"
                  )}>
                    {cat.emoji} {cat.label}
                  </span>
                ))}
              </div>

              <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
                Komunitas non-profit yang menaungi pecinta budaya pop Jepang di Indonesia. Tempat berbagi, berkarya, dan bertumbuh bersama.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/register" className="group relative overflow-hidden rounded-2xl bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-primary/40 hover:shadow-xl">
                  <span className="relative z-10 flex items-center gap-2">Bergabung Gratis <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
                  <div className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
                </Link>
                <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-2xl border border-indigo-500/30 bg-indigo-500/8 px-7 py-3.5 text-sm font-semibold text-indigo-300 transition-all hover:-translate-y-0.5 hover:border-indigo-400/50 hover:bg-indigo-500/15">
                  <DiscordIcon className="h-4 w-4" /> Gabung Discord
                </a>
              </div>

              {/* Real-time 3 Discord stats */}
              <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4">
                {[
                  { value: discordMembers ? `${discordMembers.toLocaleString("id-ID")}+` : "500+", label: "Member Discord", icon: "👥", live: !!discordMembers },
                  { value: "20+",  label: "Event Digelar", icon: "🗓️", live: false },
                  { value: "100+", label: "Konten Aktif",  icon: "📝", live: false },
                ].map(s => (
                  <div key={s.label} className="relative rounded-2xl border border-border/60 bg-card/40 px-4 py-3 backdrop-blur-sm">
                    {s.live && (
                      <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400/40" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-base">{s.icon}</span>
                      <span className="text-lg font-black text-foreground">{s.value}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground/60">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mascot — desktop only */}
            <div className="hidden lg:flex lg:items-center lg:justify-center">
              <div className="relative">
                <div className="absolute inset-0 -m-8 rounded-full bg-primary/5 blur-2xl" />
                <div className="absolute inset-0 -m-4 rounded-full bg-primary/3 blur-xl" />
                <div className="glass-card relative h-[420px] w-[340px] overflow-hidden rounded-[2rem] p-0">
                  <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-primary/15 to-transparent" />
                  <Image src="/logo-full.png" alt="Soraku mascot" fill className="object-cover object-top" priority />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent p-5 pt-10">
                    <div className="flex items-center justify-between">
                      <div><p className="text-base font-black text-foreground">Soraku</p><p className="text-xs text-muted-foreground/60">Community · 空</p></div>
                      <div className="flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-[10px] font-bold text-green-400">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" /> Live
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-12 top-16 float-badge glass-card rounded-full px-3 py-1.5 text-[11px] font-semibold">🎭 VTuber</div>
                <div className="absolute -left-14 top-28 float-badge glass-card rounded-full px-3 py-1.5 text-[11px] font-semibold" style={{ animationDelay: "0.8s" }}>🎨 Fanart</div>
                <div className="absolute -right-10 bottom-28 float-badge glass-card rounded-full px-3 py-1.5 text-[11px] font-semibold" style={{ animationDelay: "1.6s" }}>🎌 Anime</div>
                <div className="absolute -left-12 bottom-16 float-badge glass-card rounded-full px-3 py-1.5 text-[11px] font-semibold" style={{ animationDelay: "2.4s" }}>📚 Manga</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ MARQUEE ════ */}
      <section className="overflow-hidden border-y border-border/40 py-4">
        <div className="marquee-track flex gap-10 whitespace-nowrap text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/35">
          {[...Array(4)].map((_, i) =>
            ["🎌 Anime","📚 Manga","🎵 J-Music","🎭 VTuber","🎨 Fanart","👘 Cosplay","🎮 Gaming","🍜 J-Food","📖 Light Novel","🌸 Budaya Jepang"]
              .map(item => <span key={`${i}-${item}`}>{item}</span>)
          )}
        </div>
      </section>

      {/* ════ EVENTS ════ */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="Event" title="Event Terbaru" subtitle="Nonton bareng, gathering, dan kontes seru komunitas Soraku" href="/events" />
          {dataLoading ? <SkeletonGrid /> : homeData.events.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <Calendar className="h-10 w-10 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground/50">Belum ada event yang dipublish.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {homeData.events.map(e => <EventCard key={e.id} event={e} />)}
            </div>
          )}
        </div>
      </section>

      {/* ════ BLOGS ════ */}
      <section className="px-4 pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="Blog" title="Artikel Terbaru" subtitle="Ulasan, info, dan opini seputar anime & pop culture Jepang" href="/blog" />
          {dataLoading ? <SkeletonGrid /> : homeData.blogs.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <BookOpen className="h-10 w-10 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground/50">Belum ada artikel yang dipublish.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {homeData.blogs.map(b => <BlogCard key={b.id} blog={b} />)}
            </div>
          )}
        </div>
      </section>

      {/* ════ DISCORD CARD ════ */}
      <section className="px-4 pb-16 sm:pb-20">
        <div className="mx-auto max-w-4xl"><DiscordCard /></div>
      </section>

      {/* ════ PARTNERSHIP ════ */}
      {homeData.partnerships.length > 0 && (
        <section className="px-4 pb-16 sm:pb-20 border-t border-border/30 pt-16">
          <div className="mx-auto max-w-7xl">
            <SectionHeader eyebrow="Partnership" title="Partner Soraku" subtitle="Komunitas dan organisasi yang berkolaborasi bersama kami" />
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {homeData.partnerships.map(p => (
                <a key={p.id} href={p.website ?? "#"} target={p.website ? "_blank" : undefined} rel="noopener noreferrer"
                  className="glass-card group flex flex-col items-center gap-3 rounded-2xl px-6 py-5 text-center transition-all hover:-translate-y-1 hover:border-primary/30 w-36">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-muted/30">
                    {p.logourl
                      ? <Image src={p.logourl} alt={p.name} width={48} height={48} className="h-full w-full object-contain" />
                      : <Handshake className="h-6 w-6 text-muted-foreground/30" />
                    }
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{p.name}</p>
                    {p.category && <p className="text-[10px] text-muted-foreground/50 mt-0.5">{p.category}</p>}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════ SOCIAL MEDIA ════ */}
      <section className="px-4 pb-16 sm:pb-20 border-t border-border/30 pt-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="Ikuti Kami" title="Sosial Media" subtitle="Ikuti Soraku di semua platform untuk update terbaru" />
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {SOCIAL_LINKS.map(({ slug, name, href, Icon, action }) => (
              <a key={slug} href={href} target="_blank" rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-card/50 px-5 py-5 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary/35 hover:bg-card min-w-[100px]">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/50 bg-background/80 text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-foreground">{name}</p>
                  <p className="mt-0.5 text-[10px] font-semibold text-primary/70 group-hover:text-primary transition-colors">{action} →</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ════ JOIN CTA ════ */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="glass-card px-8 py-12 sm:px-14">
            <div className="mb-4 flex justify-center gap-2 text-3xl"><span>🌸</span><span>🎌</span><span>✨</span></div>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Jadilah bagian dari Soraku</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Gratis selamanya. Temukan sesama penggemar budaya Jepang dan jadilah bagian dari komunitas yang hangat &amp; supportif.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
                Daftar Gratis <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/about" className="inline-flex items-center gap-2 rounded-2xl border border-border px-7 py-3.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
                Tentang Kami
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
