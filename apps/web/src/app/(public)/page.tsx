"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import {
  ArrowRight, Calendar, BookOpen, ChevronRight,
  Hash, MessageSquare, Volume2, Circle, Eye, Heart,
  MessageCircle, Clock, Users, Handshake, Sparkles,
} from "lucide-react";
import {
  DiscordIcon, InstagramIcon, FacebookIcon, XIcon,
  TikTokIcon, YouTubeIcon, BlueSkyIcon,
} from "@/components/icons/custom-icons";
import { cn } from "@/lib/utils";

// ─── Constants ──────────────────────────────────────────────────────────────

const SOCIAL_LINKS = [
  { slug:"discord",   name:"Discord",   href:"https://discord.gg/qm3XJvRa6B",             Icon:DiscordIcon   },
  { slug:"instagram", name:"Instagram", href:"https://www.instagram.com/soraku.moe",        Icon:InstagramIcon },
  { slug:"facebook",  name:"Facebook",  href:"https://www.facebook.com/share/1HQs9ZZeCw/",  Icon:FacebookIcon  },
  { slug:"x",         name:"X",         href:"https://twitter.com/@AppSoraa",              Icon:XIcon         },
  { slug:"tiktok",    name:"TikTok",    href:"https://www.tiktok.com/@soraku.id",           Icon:TikTokIcon    },
  { slug:"youtube",   name:"YouTube",   href:"https://youtube.com/@chsoraku",              Icon:YouTubeIcon   },
  { slug:"bluesky",   name:"Bluesky",   href:"https://bsky.app/profile/soraku.id",         Icon:BlueSkyIcon   },
];

const DISCORD_GUILD_ID = "1116971049045729302";

const CATEGORIES = [
  { label:"Anime & Manga", color:"#4FA3D1", glow:"rgba(79,163,209,0.6)"  },
  { label:"Gaming",        color:"#a78bfa", glow:"rgba(167,139,250,0.6)" },
  { label:"VTuber",        color:"#f472b6", glow:"rgba(244,114,182,0.6)" },
  { label:"Fanart",        color:"#34d399", glow:"rgba(52,211,153,0.6)"  },
  { label:"J-Music",       color:"#fbbf24", glow:"rgba(251,191,36,0.6)"  },
  { label:"Cosplay",       color:"#E8C2A8", glow:"rgba(232,194,168,0.6)" },
  { label:"Kreator",       color:"#818cf8", glow:"rgba(129,140,248,0.6)" },
  { label:"Komunitas",     color:"#6ee7b7", glow:"rgba(110,231,183,0.6)" },
];

// Platform data — karakter dari /karakteranime/
const PLATFORM_ITEMS = [
  { href:"/events",  label:"Events",  desc:"Turnamen & gathering komunitas", color:"#4FA3D1", char:"/karakteranime/events.png"  },
  { href:"/blog",    label:"Blog",    desc:"Artikel & ulasan dari kreator",  color:"#a78bfa", char:"/karakteranime/blog.png"    },
  { href:"/gallery", label:"Galeri",  desc:"Fanart & karya anggota",         color:"#f472b6", char:"/karakteranime/gallery.png" },
  { href:"/vtubers", label:"VTuber",  desc:"Virtual YouTuber komunitas",     color:"#34d399", char:"/karakteranime/vtuber.png"  },
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface EventItem {
  id:string; slug:string; title:string; description:string|null;
  coverurl:string|null; startdate:string; enddate:string|null;
  isonline:boolean; tags:string[]; status:string;
}
interface Author { username:string|null; displayname:string|null; avatarurl:string|null; }
interface BlogItem {
  id:string; slug:string; title:string; excerpt:string|null;
  coverurl:string|null; publishedat:string;
  viewcount:number; likecount:number; commentcount:number;
  tags:string[]; author:Author|null;
}
interface Partnership { id:string; name:string; logourl:string|null; website:string|null; category:string|null; description:string|null; }
interface DmMember { username:string; avatar:string|null; status:string; activity?:string; }

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDate(iso:string) {
  return new Date(iso).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"});
}

function getStatusBadge(status:string) {
  switch(status) {
    case "live":     return { label:"Live",     cls:"bg-red-500/15 border-red-500/30 text-red-400",     dot:"bg-red-400 animate-pulse"     };
    case "upcoming": return { label:"Upcoming", cls:"bg-primary/15 border-primary/30 text-primary",     dot:"bg-primary animate-pulse"     };
    default:         return { label:"Selesai",  cls:"bg-white/5 border-white/10 text-white/30",         dot:"bg-white/20"                  };
  }
}

function useDiscord() {
  const [d,setD] = useState<{presence:number|null;name:string;loading:boolean;members:DmMember[]}>(
    {presence:null,name:"Soraku Community",loading:true,members:[]}
  );
  useEffect(()=>{
    fetch(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/widget.json`)
      .then(r=>r.ok?r.json():null)
      .then(j=>{
        const members=(j?.members??[]).slice(0,8).map((m:any)=>({
          username:m.username, avatar:m.avatar_url??null,
          status:m.status??"online", activity:m.game?.name,
        }));
        setD({presence:j?.presence_count??null, name:j?.name??"Soraku Community", loading:false, members});
      }).catch(()=>setD(p=>({...p,loading:false})));
  },[]);
  return d;
}

// ─── Category Marquee (CSS-only, no framer) ──────────────────────────────────

function CategoryMarquee() {
  const doubled = [...CATEGORIES,...CATEGORIES,...CATEGORIES,...CATEGORIES];
  return (
    <div className="relative overflow-hidden py-4 border-y border-white/[0.04]">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#1C1E22] to-transparent z-10"/>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#1C1E22] to-transparent z-10"/>
      <div className="flex gap-3 whitespace-nowrap" style={{animation:"marquee-cat 32s linear infinite"}}>
        {doubled.map((c,i)=>(
          <span key={i} className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold flex-shrink-0"
            style={{color:c.color, borderColor:c.color+"30", background:c.color+"0d", textShadow:`0 0 10px ${c.glow}`, boxShadow:`0 0 8px ${c.color}15`}}>
            <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{background:c.color, boxShadow:`0 0 5px ${c.glow}`}}/>
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SH({eyebrow,title,href}:{eyebrow:string;title:string;href?:string}) {
  return (
    <div className="mb-6 sm:mb-8 flex items-end justify-between">
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/50 mb-1.5">{eyebrow}</p>
        <h2 className="text-xl font-black tracking-tight sm:text-2xl lg:text-3xl text-white/90">{title}</h2>
      </div>
      {href&&(
        <Link href={href} className="group flex items-center gap-1 text-xs font-bold text-white/22 hover:text-primary transition-colors">
          Lihat Semua <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform"/>
        </Link>
      )}
    </div>
  );
}

// ─── Event Card ───────────────────────────────────────────────────────────────

function EventCard({event}:{event:EventItem}) {
  const st = getStatusBadge(event.status);
  return (
    <Link href={`/events/${event.slug}`}
      className="group relative overflow-hidden rounded-2xl bg-white/[0.025] border border-white/[0.06] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 hover:border-white/[0.1] block">
      <div className="relative aspect-[3/4] overflow-hidden">
        {event.coverurl
          ? <Image src={event.coverurl} alt={event.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized sizes="(max-width:640px)50vw,(max-width:1024px)33vw,16vw"/>
          : <div className="h-full w-full bg-gradient-to-br from-primary/15 via-accent/8 to-violet-500/10"/>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"/>
        <span className={cn("absolute top-2 right-2 flex items-center gap-1 rounded-full border px-2 py-0.5 text-[8px] sm:text-[9px] font-black backdrop-blur-md",st.cls)}>
          <span className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0",st.dot)}/>{st.label}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3.5">
        <p className="text-[8px] sm:text-[9px] font-semibold text-white/35 mb-1 flex items-center gap-1">
          <Clock className="h-2.5 w-2.5"/>{fmtDate(event.startdate)}
        </p>
        <h3 className="line-clamp-2 text-[11px] sm:text-sm font-black text-white/90 leading-snug group-hover:text-primary transition-colors">{event.title}</h3>
      </div>
    </Link>
  );
}

// ─── Blog Card ────────────────────────────────────────────────────────────────

function BlogCard({blog}:{blog:BlogItem}) {
  return (
    <Link href={`/blog/${blog.slug}`}
      className="group relative overflow-hidden rounded-2xl bg-white/[0.025] border border-white/[0.06] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 hover:border-white/[0.1] block">
      <div className="relative aspect-[3/4] overflow-hidden">
        {blog.coverurl
          ? <Image src={blog.coverurl} alt={blog.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized sizes="(max-width:640px)50vw,(max-width:1024px)33vw,16vw"/>
          : <div className="h-full w-full bg-gradient-to-br from-primary/12 via-accent/6 to-primary/4"/>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"/>
        {blog.author?.avatarurl&&(
          <div className="absolute top-2 left-2 h-6 w-6 overflow-hidden rounded-full border border-white/20">
            <Image src={blog.author.avatarurl} alt="" width={24} height={24} className="object-cover"/>
          </div>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3.5">
        {blog.author&&(
          <p className="text-[8px] sm:text-[9px] text-white/35 mb-1 truncate">
            {blog.author.displayname??blog.author.username??""} · {fmtDate(blog.publishedat)}
          </p>
        )}
        <h3 className="line-clamp-2 text-[11px] sm:text-sm font-black text-white/90 leading-snug group-hover:text-primary transition-colors mb-1.5">{blog.title}</h3>
        <div className="flex items-center gap-2.5 text-[8px] sm:text-[9px] text-white/28">
          <span className="flex items-center gap-1"><Eye className="h-2.5 w-2.5"/>{blog.viewcount}</span>
          <span className="flex items-center gap-1"><Heart className="h-2.5 w-2.5"/>{blog.likecount}</span>
          <span className="flex items-center gap-1"><MessageCircle className="h-2.5 w-2.5"/>{blog.commentcount}</span>
        </div>
      </div>
    </Link>
  );
}

// ─── Discord Glass Card ───────────────────────────────────────────────────────

function DiscordLiveCard({discord}:{discord:ReturnType<typeof useDiscord>}) {
  const SC:{[k:string]:string}={online:"bg-emerald-400",idle:"bg-amber-400",dnd:"bg-red-500",offline:"bg-white/25"};
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl shadow-2xl shadow-black/40">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none"/>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-white/15">
            <Image src="/logo.png" alt="S" fill className="object-cover"/>
          </div>
          <div>
            <p className="text-sm font-black text-white/90">{discord.name}</p>
            <p className="text-[10px] text-white/35">Server Discord Resmi</p>
          </div>
        </div>
        <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-xl bg-indigo-500 px-3 sm:px-4 py-2 text-xs font-bold text-white hover:bg-indigo-400 transition-colors">
          <DiscordIcon className="h-3.5 w-3.5"/> Gabung
        </a>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 divide-x divide-white/[0.06] border-b border-white/[0.06]">
        <div className="flex flex-col items-center py-4 gap-1">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"/>
            <span className="text-2xl font-black text-white tabular-nums">{discord.loading?"—":discord.presence?.toLocaleString("id-ID")??"—"}</span>
          </div>
          <span className="text-[10px] text-white/35">Member Online</span>
        </div>
        <div className="flex flex-col items-center py-4 gap-1">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-white/30"/>
            <span className="text-2xl font-black text-white">500+</span>
          </div>
          <span className="text-[10px] text-white/35">Total Member</span>
        </div>
      </div>
      {/* Members list */}
      <div className="px-4 sm:px-6 py-4">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/22 mb-3">Sedang Online</p>
        {discord.loading ? (
          <div className="space-y-2.5">
            {[1,2,3,4,5].map(i=>(
              <div key={i} className="flex items-center gap-2.5 animate-pulse">
                <div className="h-8 w-8 rounded-full bg-white/8 flex-shrink-0"/>
                <div className="flex-1 space-y-1"><div className="h-2.5 w-24 rounded bg-white/8"/><div className="h-2 w-16 rounded bg-white/5"/></div>
              </div>
            ))}
          </div>
        ) : discord.members.length===0 ? (
          <p className="text-sm text-white/22 text-center py-4">Widget tidak tersedia</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {discord.members.map((m,i)=>(
              <div key={i} className="flex items-center gap-2.5 rounded-xl bg-white/[0.03] px-3 py-2 border border-white/[0.04]">
                <div className="relative flex-shrink-0">
                  {m.avatar
                    ? <div className="h-8 w-8 overflow-hidden rounded-full border border-white/10"><Image src={m.avatar} alt="" width={32} height={32} className="object-cover"/></div>
                    : <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/25 text-xs font-black text-white/60">{m.username.charAt(0).toUpperCase()}</div>
                  }
                  <span className={cn("absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-[1.5px] border-[#1C1E22]",SC[m.status]??SC.online)}/>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white/65 truncate">{m.username}</p>
                  {m.activity&&<p className="text-[9px] text-white/25 truncate">{m.activity}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="px-4 sm:px-6 pb-4">
        <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full rounded-xl border border-indigo-500/25 bg-indigo-500/8 py-2.5 text-xs font-semibold text-indigo-300/70 hover:bg-indigo-500/15 hover:text-indigo-300 transition-colors">
          Buka Discord <ArrowRight className="h-3 w-3"/>
        </a>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const discord = useDiscord();
  const [data,setData] = useState<{events:EventItem[];blogs:BlogItem[];partnerships:Partnership[]}>({events:[],blogs:[],partnerships:[]});
  const [loading,setLoading] = useState(true);
  const [user,setUser] = useState<{id:string}|null|"loading">("loading");

  useEffect(()=>{
    fetch("/api/home").then(r=>r.ok?r.json():null).then(d=>{if(d?.data)setData(d.data);}).catch(()=>{}).finally(()=>setLoading(false));
    fetch("/api/auth/me",{cache:"no-store"}).then(r=>r.json()).then(d=>setUser(d.data??null)).catch(()=>setUser(null));
  },[]);

  const isLoggedIn = user!=="loading"&&user!==null;

  return (
    <main className="min-h-screen bg-[#1C1E22] text-foreground overflow-x-hidden">

      {/* ══════════════════════════════════════════════
          HERO
          Mobile: Mascot full-bleed seamless (no card)
          Desktop: Script + centered heading
          ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">

        {/* ── MOBILE HERO — Mascot seamless, no card ── */}
        <div className="lg:hidden relative w-full h-[100svh] min-h-[600px]">
          {/* Atmosphere */}
          <div className="pointer-events-none absolute inset-0 -z-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[140px]"/>
            <div className="absolute bottom-1/4 right-0 h-[300px] w-[300px] rounded-full bg-[#E8C2A8]/6 blur-[100px]"/>
          </div>
          {/* Mascot full-bleed — NO card, NO border */}
          <Image src="/logo-full.png" alt="Soraku" fill className="object-cover object-top" priority/>
          {/* Fades menyatu ke background */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#1C1E22] to-transparent z-10"/>
          <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#1C1E22] via-[#1C1E22]/80 to-transparent z-10"/>
          <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#1C1E22]/70 to-transparent z-10"/>
          <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#1C1E22]/70 to-transparent z-10"/>
          {/* Text overlay di bawah */}
          <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-12 space-y-4">
            <div>
              <h1 className="text-[clamp(2.8rem,14vw,4.5rem)] font-black leading-[0.88] tracking-tighter text-white">
                Soraku
              </h1>
              <p className="text-sm font-light text-white/35 tracking-wide mt-1 pl-0.5">
                Community · 空 · Est. 2023
              </p>
            </div>
            <div className="h-px w-12 bg-gradient-to-r from-primary/50 to-transparent"/>
            <p className="text-[13px] text-white/55 max-w-xs leading-relaxed">
              Komunitas non-profit anime & budaya Jepang Indonesia.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Live badge */}
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-white/45">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"/>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"/>
                </span>
                {discord.loading?"—":`${discord.presence?.toLocaleString("id-ID")??"—"} online`}
              </span>
            </div>
            <div className="flex items-center gap-3 pt-1">
              {!isLoggedIn&&(
                <Link href="/register"
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white"
                  style={{background:"linear-gradient(135deg,#4FA3D1 0%,#3a8fbe 100%)"}}>
                  Bergabung <ArrowRight className="h-3.5 w-3.5"/>
                </Link>
              )}
              <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.05] px-5 py-2.5 text-sm font-bold text-white/60">
                <DiscordIcon className="h-4 w-4 text-indigo-400"/>
              </a>
            </div>
          </div>
        </div>

        {/* ── DESKTOP HERO — Script + Centered heading ── */}
        <div className="hidden lg:flex min-h-[95vh] flex-col items-center justify-center relative pt-20 pb-12">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-0 w-[500px] h-[420px] rounded-full blur-[140px] bg-[#4FA3D1]/10"/>
            <div className="absolute bottom-0 right-0 w-[440px] h-[380px] rounded-full blur-[130px] bg-[#E8C2A8]/7"/>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[340px] rounded-full blur-[180px] bg-[#4FA3D1]/5"/>
          </div>
          {/* Floating petals */}
          {[
            {top:"16%",left:"7%",fs:"20px"},{top:"28%",right:"8%",fs:"15px"},
            {bottom:"28%",left:"5%",fs:"13px"},{bottom:"20%",right:"9%",fs:"17px"},
          ].map((p,i)=>(
            <span key={i} className="absolute pointer-events-none select-none text-[#E8C2A8]"
              style={{opacity:0.14,...(p.left?{left:p.left}:{right:(p as any).right}),...(p.top?{top:p.top}:{bottom:(p as any).bottom}),fontSize:p.fs}}>
              ✿
            </span>
          ))}

          <div className="relative z-10 text-center max-w-[800px] mx-auto px-6">
            <span className="block mb-4 text-2xl sm:text-3xl tracking-wide text-[#E8C2A8]/75"
              style={{fontFamily:"var(--font-script,'Style Script',cursive)"}}>
              Belajar, Berkarya, Bersama
            </span>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"/>
              <span className="text-[10px] font-bold tracking-[0.2em] text-white/38 uppercase">
                {discord.loading?"—":discord.presence?.toLocaleString("id-ID")??"—"} ONLINE SEKARANG
              </span>
            </div>
            <h1 className="font-black tracking-tighter leading-[1.0] text-foreground text-[clamp(52px,9vw,96px)] mb-0">
              Temukan Duniamu<br/>
              di{" "}
              <span className="bg-clip-text text-transparent"
                style={{backgroundImage:"linear-gradient(130deg,#4FA3D1 0%,#90c8e8 38%,#E8C2A8 72%,#d4a882 100%)",WebkitBackgroundClip:"text"}}>
                Soraku
              </span>
            </h1>
            <div className="mx-auto my-5 h-[2px] w-12 rounded-full" style={{background:"linear-gradient(90deg,#4FA3D1,#E8C2A8)",opacity:0.45}}/>
            <p className="max-w-[520px] mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed mb-7">
              Wujudkan imajinasi, asah kreativitas, dan jalin koneksi bermakna.
              Di sini, setiap langkahmu adalah bagian dari cerita besar kita bersama.
            </p>
            {/* Category pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-9">
              {CATEGORIES.slice(0,6).map((c,i)=>(
                <span key={i} className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] border cursor-default"
                  style={{color:c.color,borderColor:c.color+"30"}}>
                  {c.label}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-center gap-3">
              {!isLoggedIn&&(
                <Link href="/register"
                  className="group flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm text-white transition-all hover:scale-[1.02]"
                  style={{background:"linear-gradient(135deg,#4FA3D1 0%,#3a8fbe 100%)"}}>
                  <Sparkles className="h-4 w-4"/>Bergabung Gratis<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform"/>
                </Link>
              )}
              <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm text-foreground/75 bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.09] transition-all">
                <DiscordIcon className="h-4 w-4 text-indigo-400"/> Gabung Discord
              </a>
            </div>
            <div className="mt-12 flex flex-col items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/35">Gulir untuk menjelajahi</span>
              <div className="w-px h-8 bg-gradient-to-b from-muted-foreground/20 to-transparent" style={{animation:"bounce-soft 2s ease-in-out infinite"}}/>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CATEGORY MARQUEE ══ */}
      <CategoryMarquee/>

      {/* ══════════════════════════════════════════════
          COMMUNITY SECTION — CSS only, no framer, mobile-fixed
          ══════════════════════════════════════════════ */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-[350px] h-[350px] bg-primary/8 rounded-full blur-[100px]"/>
          <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-[#E8C2A8]/5 rounded-full blur-[120px]"/>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <p className="block mb-4 text-2xl sm:text-4xl md:text-5xl tracking-wide text-white/16"
            style={{fontFamily:"var(--font-script,'Style Script',cursive)"}}>
            Belajar dan Berkembang
          </p>
          <h2 className="text-[clamp(2.8rem,8vw,6.5rem)] font-black leading-[0.92] tracking-tighter text-white mb-8 sm:mb-12">
            Temukan<br className="sm:hidden"/>
            {" "}Duniamu<br className="sm:hidden"/>
            {" "}di{" "}
            <span className="bg-clip-text text-transparent"
              style={{backgroundImage:"linear-gradient(130deg,#4FA3D1 0%,#90c8e8 38%,#E8C2A8 72%,#d4a882 100%)",WebkitBackgroundClip:"text"}}>
              Soraku
            </span>
          </h2>
          <p className="max-w-xl mx-auto text-base sm:text-lg leading-relaxed text-white/22 font-medium">
            Dari penggemar, untuk penggemar — di seluruh Indonesia.
            {" "}Tempat kamu ketemu orang-orang yang{" "}
            <em className="not-italic text-white/42 font-semibold">ngerti duniamu</em>.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PLATFORM — Anime characters per card
          ══════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 container mx-auto px-4 sm:px-6">
        <SH eyebrow="Jelajahi" title="Platform Soraku"/>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {PLATFORM_ITEMS.map((p,i)=>(
            <Link key={p.href} href={p.href}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] min-h-[160px] sm:min-h-[220px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-white/[0.12] block">
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{background:`radial-gradient(circle at 50% 100%,${p.color}22,transparent 70%)`}}/>
              {/* Anime char — bottom right overlay */}
              <div className="absolute bottom-0 right-0 h-[75%] w-[55%] pointer-events-none">
                <Image src={p.char} alt="" fill className="object-contain object-right-bottom opacity-[0.12] group-hover:opacity-[0.22] transition-opacity duration-400"
                  onError={()=>{}} sizes="120px"/>
              </div>
              {/* Content */}
              <div className="relative z-10 p-4 sm:p-5 flex flex-col h-full">
                <h3 className="text-base sm:text-lg font-black transition-colors" style={{color:p.color}}>{p.label}</h3>
                <p className="text-[10px] sm:text-xs text-white/30 leading-relaxed mt-1 flex-1">{p.desc}</p>
                <div className="flex items-center gap-1 text-[10px] font-bold mt-3 opacity-0 group-hover:opacity-50 transition-opacity" style={{color:p.color}}>
                  Jelajahi <ArrowRight className="h-3 w-3"/>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══ EVENTS — 2 cols mobile, 3 sm, 4 lg, 6 xl ══ */}
      <section className="py-8 sm:py-12 container mx-auto px-4 sm:px-6">
        <SH eyebrow="Upcoming" title="Event Komunitas" href="/events"/>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {[1,2,3,4,5,6].map(i=><div key={i} className="animate-pulse rounded-2xl bg-white/[0.025] aspect-[3/4]"/>)}
          </div>
        ) : data.events.length===0 ? (
          <div className="py-16 text-center"><Calendar className="mx-auto h-8 w-8 text-white/10 mb-3"/><p className="text-sm text-white/25">Belum ada event</p></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {data.events.map(e=><EventCard key={e.id} event={e}/>)}
          </div>
        )}
      </section>

      {/* ══ BLOG — same grid ══ */}
      <section className="py-8 sm:py-12 container mx-auto px-4 sm:px-6">
        <SH eyebrow="Komunitas" title="Artikel & Kreasi" href="/blog"/>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {[1,2,3,4,5,6].map(i=><div key={i} className="animate-pulse rounded-2xl bg-white/[0.025] aspect-[3/4]"/>)}
          </div>
        ) : data.blogs.length===0 ? (
          <div className="py-16 text-center"><BookOpen className="mx-auto h-8 w-8 text-white/10 mb-3"/><p className="text-sm text-white/25">Belum ada artikel</p></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {data.blogs.map(b=><BlogCard key={b.id} blog={b}/>)}
          </div>
        )}
      </section>

      {/* ══ DISCORD — glass card, richer desktop ══ */}
      <section className="py-12 sm:py-16 container mx-auto px-4 sm:px-6">
        <SH eyebrow="Real-time" title="Server Discord"/>
        <div className="max-w-2xl lg:max-w-none lg:grid lg:grid-cols-[1fr_340px] lg:gap-8 mx-auto">
          <DiscordLiveCard discord={discord}/>
          {/* Desktop side — invite CTA */}
          <div className="hidden lg:flex flex-col justify-between">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/25 bg-indigo-500/10 mb-5">
                <DiscordIcon className="h-7 w-7 text-indigo-300"/>
              </div>
              <h3 className="text-2xl font-black text-white/90 mb-3">Gabung Server Discord Soraku</h3>
              <p className="text-white/30 text-sm leading-relaxed mb-6">
                Chat bareng, nonton bareng, dan ketemu teman sefrekuensi.
                Aktif 24/7 bersama ratusan member online.
              </p>
              <div className="space-y-2.5">
                {["💬 Chat komunitas anime & gaming","🎭 VTuber fans & fanart","🗓️ Info event & giveaway","🎵 J-Music & cosplay"].map((f,i)=>(
                  <div key={i} className="flex items-center gap-2.5 text-sm text-white/40">{f}</div>
                ))}
              </div>
            </div>
            <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-6 py-4 text-sm font-bold text-white hover:bg-indigo-400 hover:-translate-y-0.5 transition-all shadow-lg shadow-indigo-500/20">
              <DiscordIcon className="h-5 w-5"/> Masuk ke Discord
            </a>
          </div>
        </div>
      </section>

      {/* ══ PARTNERSHIP ══ */}
      {data.partnerships.length>0&&(
        <section className="py-10 sm:py-14 container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/45 mb-2">Dukungan</p>
            <h2 className="text-xl font-black sm:text-2xl text-white/90">Sponsor &amp; Partner</h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8">
            {data.partnerships.map(p=>(
              <a key={p.id} href={p.website??"#"} target="_blank" rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 transition-all hover:-translate-y-0.5">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center overflow-hidden rounded-xl bg-white/[0.04] border border-white/[0.05] p-2 group-hover:border-white/[0.12] transition-colors">
                  {p.logourl ? <Image src={p.logourl} alt={p.name} width={48} height={48} className="object-contain opacity-40 group-hover:opacity-90 transition-opacity duration-400"/> : <Handshake className="h-5 w-5 text-white/20"/>}
                </div>
                <p className="text-[9px] font-bold text-white/20 group-hover:text-white/45 transition-colors uppercase tracking-wide">{p.name}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ══ SOCIAL MEDIA MARQUEE — no heading ══ */}
      <div className="relative overflow-hidden py-3 border-t border-white/[0.04]">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-[#1C1E22] to-transparent z-10"/>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-[#1C1E22] to-transparent z-10"/>
        <div className="marquee-track flex gap-3 whitespace-nowrap mb-2">
          {[...Array(4)].map((_,i)=>SOCIAL_LINKS.map(s=>(
            <a key={`r1-${i}-${s.slug}`} href={s.href} target="_blank" rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-white/[0.05] bg-white/[0.02] px-4 py-2 hover:bg-white/[0.06] transition-all">
              <s.Icon className="h-4 w-4 text-white/22 group-hover:text-white/70 transition-opacity"/>
              <span className="text-xs font-semibold text-white/18 group-hover:text-white/50 transition-opacity">{s.name}</span>
            </a>
          )))}
        </div>
        <div className="marquee-track-reverse flex gap-3 whitespace-nowrap">
          {[...Array(4)].map((_,i)=>[...SOCIAL_LINKS].reverse().map(s=>(
            <a key={`r2-${i}-${s.slug}`} href={s.href} target="_blank" rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-white/[0.05] bg-white/[0.02] px-4 py-2 hover:bg-white/[0.06] transition-all">
              <s.Icon className="h-4 w-4 text-white/18 group-hover:text-white/65 transition-opacity"/>
              <span className="text-xs font-semibold text-white/15 group-hover:text-white/45 transition-opacity">{s.name}</span>
            </a>
          )))}
        </div>
      </div>

      {/* ══ JOIN CTA ══ */}
      {!isLoggedIn&&user!=="loading"&&(
        <section className="py-20 sm:py-24 container mx-auto px-4 sm:px-6 text-center">
          <div className="text-4xl mb-5">🌸</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-4 text-white">
            Jadilah bagian dari <span className="text-primary">Soraku</span>
          </h2>
          <p className="text-white/25 text-sm sm:text-base leading-relaxed mb-8 max-w-sm mx-auto">Gratis selamanya. Komunitas yang hangat dan penuh semangat.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register"
              className="inline-flex items-center gap-2 rounded-2xl px-8 py-3.5 text-sm font-bold text-white shadow-xl transition-all hover:scale-[1.02]"
              style={{background:"linear-gradient(135deg,#4FA3D1 0%,#3a8fbe 100%)"}}>
              Daftar Gratis <ArrowRight className="h-4 w-4"/>
            </Link>
            <Link href="/about"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.08] px-8 py-3.5 text-sm font-semibold text-white/38 hover:border-white/[0.15] hover:text-white/60 transition-all">
              Tentang Soraku
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
