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

const SOCIAL_LINKS = [
  { slug:"discord",   name:"Discord",   href:"https://discord.gg/qm3XJvRa6B",               Icon:DiscordIcon,   color:"text-indigo-400", bg:"hover:bg-indigo-500/8"  },
  { slug:"instagram", name:"Instagram", href:"https://www.instagram.com/soraku.moe",          Icon:InstagramIcon, color:"text-pink-400",   bg:"hover:bg-pink-500/8"    },
  { slug:"facebook",  name:"Facebook",  href:"https://www.facebook.com/share/1HQs9ZZeCw/",    Icon:FacebookIcon,  color:"text-blue-400",   bg:"hover:bg-blue-500/8"    },
  { slug:"x",         name:"X",         href:"https://twitter.com/@AppSora",                 Icon:XIcon,         color:"text-foreground/70",bg:"hover:bg-white/5"      },
  { slug:"tiktok",    name:"TikTok",    href:"https://www.tiktok.com/@soraku.id",             Icon:TikTokIcon,    color:"text-pink-300",   bg:"hover:bg-pink-500/8"    },
  { slug:"youtube",   name:"YouTube",   href:"https://youtube.com/@chsoraku",                Icon:YouTubeIcon,   color:"text-red-400",    bg:"hover:bg-red-500/8"     },
  { slug:"bluesky",   name:"Bluesky",   href:"https://bsky.app/profile/soraku.id",           Icon:BlueSkyIcon,   color:"text-sky-400",    bg:"hover:bg-sky-500/8"     },
];

const DISCORD_GUILD_ID = "1033369620989124628";

interface Author { username: string | null; displayname: string | null; avatarurl: string | null; }
interface EventItem { id:string; slug:string; title:string; description:string|null; coverurl:string|null; startdate:string; status:string; }
interface BlogItem  { id:string; slug:string; title:string; excerpt:string|null; coverurl:string|null; publishedat:string; viewcount?:number; likecount?:number; author:Author|null; }
interface Partnership { id:string; name:string; logourl:string|null; website:string|null; category:string|null; }

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day:"numeric", month:"short", year:"numeric" });
}

function getStatusInfo(status: string, startdate: string) {
  const now = Date.now(), start = new Date(startdate).getTime();
  if (start > now) return { label:"Upcoming", cls:"text-primary/80 bg-primary/8 border-primary/15", dot:"bg-primary animate-pulse" };
  if (status==="selesai") return { label:"Selesai", cls:"text-muted-foreground/40 bg-muted/10 border-border/15", dot:"bg-muted-foreground/20" };
  return { label:"Live", cls:"text-emerald-400 bg-emerald-500/8 border-emerald-500/15", dot:"bg-emerald-400 animate-pulse" };
}

function useDiscord() {
  const [data, setData] = useState<{ presence:number|null; name:string; loading:boolean }>({ presence:null, name:"Soraku Community", loading:true });
  useEffect(() => {
    fetch(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/widget.json`)
      .then(r => r.ok ? r.json() : null)
      .then(d => setData({ presence:d?.presence_count??null, name:d?.name??"Soraku Community", loading:false }))
      .catch(() => setData(p=>({...p,loading:false})));
  }, []);
  return data;
}

// ─── Event Card ────────────────────────────────────────────────────────────────
function EventCard({ event }: { event: EventItem }) {
  const st = getStatusInfo(event.status, event.startdate);
  return (
    <Link href={`/events/${event.slug}`}
      className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20">
      {/* Cover */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/10">
        {event.coverurl
          ? <Image src={event.coverurl} alt={event.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
          : <div className="flex h-full items-center justify-center"><Calendar className="h-8 w-8 text-muted-foreground/10" /></div>
        }
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        {/* Status badge */}
        <span className={cn("absolute top-3 right-3 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-black backdrop-blur-sm", st.cls)}>
          <span className={cn("h-1.5 w-1.5 rounded-full", st.dot)} />{st.label}
        </span>
      </div>
      {/* Info — menyatu di atas gradient */}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="text-[10px] text-white/40 mb-1">{fmtDate(event.startdate)}</p>
        <h3 className="line-clamp-2 text-sm font-black text-white/90 leading-snug group-hover:text-primary transition-colors">{event.title}</h3>
      </div>
    </Link>
  );
}

// ─── Blog Card ─────────────────────────────────────────────────────────────────
function BlogCard({ blog }: { blog: BlogItem }) {
  return (
    <Link href={`/blog/${blog.slug}`}
      className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20">
      {/* Cover */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/10">
        {blog.coverurl
          ? <Image src={blog.coverurl} alt={blog.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
          : <div className="flex h-full items-center justify-center"><BookOpen className="h-8 w-8 text-muted-foreground/10" /></div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
      </div>
      {/* Info */}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="mb-1 flex items-center gap-3 text-[10px] text-white/35">
          <span>{fmtDate(blog.publishedat)}</span>
          {blog.viewcount ? <span className="flex items-center gap-1"><Eye className="h-2.5 w-2.5" />{blog.viewcount}</span> : null}
          {blog.likecount ? <span className="flex items-center gap-1"><Heart className="h-2.5 w-2.5" />{blog.likecount}</span> : null}
        </div>
        <h3 className="line-clamp-2 text-sm font-black text-white/90 leading-snug group-hover:text-primary transition-colors">{blog.title}</h3>
      </div>
    </Link>
  );
}

// ─── Skeleton cards ────────────────────────────────────────────────────────────
function SkeletonCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1,2,3].map(i => (
        <div key={i} className="animate-pulse rounded-2xl bg-muted/8 aspect-[16/10]" />
      ))}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const discord = useDiscord();
  const [data, setData] = useState<{ events:EventItem[]; blogs:BlogItem[]; partnerships:Partnership[] }>({
    events:[], blogs:[], partnerships:[],
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id:string }|null|"loading">("loading");

  useEffect(() => {
    fetch("/api/home")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.data) setData(d.data); })
      .catch(()=>{}).finally(()=>setLoading(false));
    fetch("/api/auth/me",{cache:"no-store"})
      .then(r=>r.json()).then(d=>setUser(d.data??null)).catch(()=>setUser(null));
  }, []);

  const isLoggedIn = user !== "loading" && user !== null;

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          HERO — mascot seamless, no card border
          ══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[96vh] overflow-hidden flex items-center px-4 py-16 sm:py-20">

        {/* Atmospheric glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[900px] w-[900px] rounded-full bg-primary/7 blur-[220px]" />
          <div className="absolute top-1/4 -right-1/3 h-[600px] w-[600px] rounded-full bg-accent/5 blur-[180px]" />
          <div className="absolute bottom-0 -left-1/4 h-[500px] w-[500px] rounded-full bg-primary/4 blur-[160px]" />
        </div>

        <div className="mx-auto w-full max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:items-center lg:gap-20 xl:gap-28">

            {/* ── Left — text ── */}
            <div className="order-2 lg:order-1 max-w-2xl">

              {/* Live badge */}
              <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-primary/12 bg-primary/5 px-4 py-1.5 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[10px] font-black tracking-[0.18em] text-primary/60 uppercase">
                  {discord.loading ? "—" : `${discord.presence?.toLocaleString("id-ID")??"500"}+ online`} · Soraku Community
                </span>
              </div>

              {/* Heading */}
              <div className="space-y-1">
                <h1 className="text-[clamp(4rem,12vw,8.5rem)] font-black leading-[0.88] tracking-tighter text-foreground">
                  Soraku
                </h1>
                <p className="text-[clamp(1rem,2.5vw,1.7rem)] font-light text-muted-foreground/45 tracking-wide pl-0.5">
                  Community · 空 · Est. 2023
                </p>
              </div>

              {/* Divider */}
              <div className="my-8 h-px w-20 bg-gradient-to-r from-primary/35 to-transparent" />

              {/* Apa itu Soraku */}
              <div className="space-y-3 max-w-lg">
                <p className="text-base leading-relaxed text-muted-foreground/80">
                  <span className="font-bold text-foreground">Soraku</span> — dari <em className="not-italic font-medium text-foreground/70">"Sora"</em> (langit) dan{" "}
                  <em className="not-italic font-medium text-foreground/70">"ku"</em> (milikku).
                </p>
                <p className="text-sm leading-loose text-muted-foreground/55">
                  Ruang komunitas non-profit terbuka untuk semua pecinta anime, manga, dan budaya Jepang di Indonesia.
                  Berbagi karya, berdiskusi, ikuti event, bertemu teman sefrekuensi.
                </p>
                <p className="text-sm text-muted-foreground/45">
                  Gratis. Terbuka. Hangat.{" "}
                  <span className="text-primary/65 font-semibold">Ini rumah digitalmu.</span>
                </p>
              </div>

              {/* CTAs */}
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
                  className="flex items-center gap-2 rounded-2xl border border-indigo-500/20 bg-indigo-500/7 px-8 py-3.5 text-sm font-semibold text-indigo-300/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/35 hover:bg-indigo-500/12 hover:text-indigo-200">
                  <DiscordIcon className="h-4 w-4" /> Gabung Discord
                </a>
              </div>

              {/* Stats */}
              <div className="mt-12 flex flex-wrap items-center gap-7">
                {[
                  { val: discord.loading ? "—" : `${discord.presence?.toLocaleString("id-ID")??"500"}+`, label:"online", live:true },
                  { val:"20+", label:"event" },
                  { val:"100+", label:"konten" },
                ].map((s,i) => (
                  <div key={i} className="flex items-center gap-2">
                    {s.live && (
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                      </span>
                    )}
                    <span className="text-sm font-black text-foreground">{s.val}</span>
                    <span className="text-xs text-muted-foreground/35">{s.label}</span>
                    {i < 2 && <span className="ml-3 h-3 w-px bg-border/25" />}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right — mascot, BENAR-BENAR seamless ── */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative w-[240px] sm:w-[290px] lg:w-[340px]">

                {/* Glow di belakang mascot */}
                <div className="absolute inset-0 -m-12 rounded-full bg-primary/8 blur-3xl pointer-events-none" />

                {/* Mascot — tanpa frame, seamless */}
                <div className="relative h-[460px] sm:h-[520px] w-full">
                  {/* Fade top — menyatu ke background */}
                  <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background via-background/50 to-transparent z-10 pointer-events-none" />
                  {/* Fade bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/70 to-transparent z-10 pointer-events-none" />
                  {/* Fade sides */}
                  <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background/70 to-transparent z-10 pointer-events-none" />
                  <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background/70 to-transparent z-10 pointer-events-none" />

                  <Image
                    src="/logo-full.png"
                    alt="Soraku mascot"
                    fill
                    className="object-cover object-center"
                    priority
                  />

                  {/* Info overlay di bawah — seamless */}
                  <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-base font-black text-white/80 drop-shadow-md">Soraku</p>
                        <p className="text-[10px] text-white/35">Community · 空</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                      </div>
                    </div>
                  </div>
                </div>

                {/* Float badges — hanya teks + border tipis, TANPA background card */}
                <div className="absolute -right-10 top-16 float-badge">
                  <span className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/60 backdrop-blur-md">
                    🌸 Komunitas
                  </span>
                </div>
                <div className="absolute -left-14 top-32 float-badge" style={{animationDelay:"1s"}}>
                  <span className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/60 backdrop-blur-md">
                    🎌 Anime &amp; Manga
                  </span>
                </div>
                <div className="absolute -right-8 bottom-36 float-badge" style={{animationDelay:"2s"}}>
                  <span className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/60 backdrop-blur-md">
                    ✨ Non-profit
                  </span>
                </div>
                <div className="absolute -left-10 bottom-24 float-badge" style={{animationDelay:"0.5s"}}>
                  <span className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/60 backdrop-blur-md">
                    🇮🇩 Indonesia
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-20 flex flex-col items-center gap-1">
          <div className="h-8 w-px bg-gradient-to-b from-foreground/40 to-transparent" />
          <div className="h-4 w-px bg-gradient-to-b from-foreground/15 to-transparent" />
        </div>
      </section>

      {/* ══ MARQUEE ══ */}
      <div className="overflow-hidden border-y border-border/15 py-3">
        <div className="marquee-track flex gap-12 whitespace-nowrap text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/18">
          {[...Array(4)].map((_,i)=>
            ["🎌 Anime","📚 Manga","🎵 J-Music","🎭 VTuber","🎨 Fanart","👘 Cosplay","🎮 Gaming","🌸 Culture","🌙 Soraku"]
              .map(item=><span key={`${i}-${item}`}>{item}</span>)
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          DISCORD — real-time, seamless
          ══════════════════════════════════════════════════════ */}
      <section className="px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex items-center gap-4">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-primary/35 mb-1">Real-time</p>
              <h2 className="text-2xl font-black tracking-tight">Server Discord</h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-border/30 to-transparent" />
          </div>

          <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-12">
            <div className="pointer-events-none absolute inset-0 -m-16 rounded-full bg-indigo-600/5 blur-3xl -z-10" />

            <div className="flex items-center gap-5">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/15 bg-indigo-500/8">
                <div className="absolute inset-0 rounded-2xl bg-indigo-500/6 blur-md" />
                <DiscordIcon className="relative h-7 w-7 text-indigo-300/80" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-black">{discord.name}</h3>
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/8 border border-emerald-500/15 px-2 py-0.5 text-[9px] font-black text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />LIVE
                  </span>
                </div>
                <p className="text-xs text-muted-foreground/40">Anime · Manga · Budaya Jepang · Indonesia</p>
              </div>
            </div>

            <div className="hidden sm:block h-14 w-px bg-gradient-to-b from-transparent via-border/25 to-transparent" />

            <div className="flex items-center gap-8 flex-1">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Wifi className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-xl font-black">{discord.loading?"—":(discord.presence?.toLocaleString("id-ID")??"—")}</span>
                </div>
                <p className="text-[10px] text-muted-foreground/35">online sekarang</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-3.5 w-3.5 text-muted-foreground/25" />
                  <span className="text-xl font-black">500+</span>
                </div>
                <p className="text-[10px] text-muted-foreground/35">total member</p>
              </div>
            </div>

            <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
              className="group flex-shrink-0 inline-flex items-center gap-2.5 rounded-2xl border border-indigo-500/20 bg-indigo-500/8 px-6 py-3 text-sm font-bold text-indigo-300/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/35 hover:bg-indigo-500/14">
              <DiscordIcon className="h-4 w-4" /> Gabung
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
          <div className="mt-10 h-px bg-gradient-to-r from-transparent via-indigo-500/12 to-transparent" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          EVENTS — card grid, image seamless
          ══════════════════════════════════════════════════════ */}
      <section className="px-4 pb-20 sm:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-primary/35 mb-1">Terbaru</p>
              <h2 className="text-2xl font-black tracking-tight">Event</h2>
            </div>
            <Link href="/events" className="group flex items-center gap-1 text-xs font-semibold text-muted-foreground/30 hover:text-primary transition-colors">
              Lihat semua <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {loading ? <SkeletonCards /> : data.events.length === 0 ? (
            <div className="py-16 text-center">
              <Calendar className="mx-auto h-8 w-8 text-muted-foreground/10 mb-3" />
              <p className="text-sm text-muted-foreground/25">Belum ada event</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.events.map(e => <EventCard key={e.id} event={e} />)}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          BLOG — card grid, image seamless
          ══════════════════════════════════════════════════════ */}
      <section className="px-4 pb-20 sm:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-primary/35 mb-1">Komunitas</p>
              <h2 className="text-2xl font-black tracking-tight">Artikel</h2>
            </div>
            <Link href="/blog" className="group flex items-center gap-1 text-xs font-semibold text-muted-foreground/30 hover:text-primary transition-colors">
              Lihat semua <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {loading ? <SkeletonCards /> : data.blogs.length === 0 ? (
            <div className="py-16 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-muted-foreground/10 mb-3" />
              <p className="text-sm text-muted-foreground/25">Belum ada artikel</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.blogs.map(b => <BlogCard key={b.id} blog={b} />)}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SOSIAL MEDIA — marquee dua arah, no card
          ══════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 border-t border-border/12">
        <div className="mx-auto max-w-7xl px-4 mb-10">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-primary/35 mb-1">Ikuti Kami</p>
              <h2 className="text-2xl font-black tracking-tight">Sosial Media</h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-border/30 to-transparent" />
          </div>
        </div>

        <div className="relative overflow-hidden py-2">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

          <div className="marquee-track mb-2 flex gap-6 whitespace-nowrap">
            {[...Array(4)].map((_,i)=>
              SOCIAL_LINKS.map(({slug,name,href,Icon,color,bg})=>(
                <a key={`r1-${i}-${slug}`} href={href} target="_blank" rel="noopener noreferrer"
                  className={cn("group inline-flex items-center gap-3 rounded-full px-5 py-2.5 transition-all duration-300",bg)}>
                  <Icon className={cn("h-4 w-4 text-muted-foreground/25 transition-colors",`group-hover:${color}`)} />
                  <span className="text-sm font-semibold text-muted-foreground/40 group-hover:text-foreground/70 transition-colors">{name}</span>
                </a>
              ))
            )}
          </div>
          <div className="marquee-track-reverse flex gap-6 whitespace-nowrap">
            {[...Array(4)].map((_,i)=>
              [...SOCIAL_LINKS].reverse().map(({slug,name,href,Icon,color,bg})=>(
                <a key={`r2-${i}-${slug}`} href={href} target="_blank" rel="noopener noreferrer"
                  className={cn("group inline-flex items-center gap-3 rounded-full px-5 py-2.5 transition-all duration-300",bg)}>
                  <Icon className={cn("h-4 w-4 text-muted-foreground/20 transition-colors",`group-hover:${color}`)} />
                  <span className="text-sm font-semibold text-muted-foreground/30 group-hover:text-foreground/70 transition-colors">{name}</span>
                </a>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PARTNERSHIP / SPONSOR
          ══════════════════════════════════════════════════════ */}
      {data.partnerships.length > 0 && (
        <section className="px-4 pb-20 sm:pb-24 border-t border-border/12 pt-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/20 mb-2">Kolaborasi</p>
              <h2 className="text-2xl font-black tracking-tight">Partner &amp; Sponsor</h2>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14">
              {data.partnerships.map(p=>(
                <a key={p.id} href={p.website??"#"} target={p.website?"_blank":undefined} rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-2.5 transition-all duration-300 hover:-translate-y-0.5 opacity-40 hover:opacity-90">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-muted/10 border border-border/15 transition-colors group-hover:border-primary/15">
                    {p.logourl
                      ? <Image src={p.logourl} alt={p.name} width={48} height={48} className="h-full w-full object-contain" />
                      : <Handshake className="h-5 w-5 text-muted-foreground/15" />
                    }
                  </div>
                  <p className="text-[10px] font-bold text-foreground/40 group-hover:text-primary transition-colors">{p.name}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          JOIN CTA — hanya jika belum login
          ══════════════════════════════════════════════════════ */}
      {!isLoggedIn && user !== "loading" && (
        <section className="relative px-4 pb-28 pt-20 overflow-hidden border-t border-border/12">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/4 blur-3xl" />
          </div>

          <div className="mx-auto max-w-xl text-center">
            <div className="mb-5 text-4xl">🌸</div>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Jadilah bagian dari <span className="text-primary">Soraku</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground/50 max-w-sm mx-auto">
              Gratis selamanya. Komunitas yang hangat, supportif, dan penuh semangat untuk semua pecinta anime di Indonesia.
            </p>
            <div className="my-8 flex items-center gap-4 max-w-xs mx-auto">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border/20" />
              <span className="text-xs text-muted-foreground/18 font-semibold">bergabung sekarang</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border/20" />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-primary/18 transition-all duration-300 hover:-translate-y-0.5">
                Daftar Gratis <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-border/20 px-8 py-3.5 text-sm font-semibold text-muted-foreground/50 transition-all hover:border-primary/15 hover:text-foreground/70">
                Tentang Soraku
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
