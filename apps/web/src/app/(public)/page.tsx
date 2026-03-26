"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight, Calendar, BookOpen, ChevronRight,
  Hash, MessageSquare, Volume2, Circle, Eye, Heart,
  MessageCircle, Clock, Zap, Users, Handshake, Sparkles,
} from "lucide-react";
import {
  DiscordIcon, InstagramIcon, FacebookIcon, XIcon,
  TikTokIcon, YouTubeIcon, BlueSkyIcon,
} from "@/components/icons/custom-icons";
import { cn } from "@/lib/utils";

// ─── Constants ──────────────────────────────────────────────────────────────

const SOCIAL_LINKS = [
  { slug:"discord",   name:"Discord",   href:"https://discord.gg/qm3XJvRa6B",             Icon:DiscordIcon,   color:"text-indigo-400" },
  { slug:"instagram", name:"Instagram", href:"https://www.instagram.com/soraku.moe",        Icon:InstagramIcon, color:"text-pink-400"   },
  { slug:"facebook",  name:"Facebook",  href:"https://www.facebook.com/share/1HQs9ZZeCw/",  Icon:FacebookIcon,  color:"text-blue-400"   },
  { slug:"x",         name:"X / Twitter",href:"https://twitter.com/@AppSoraa",              Icon:XIcon,         color:"text-white/60"   },
  { slug:"tiktok",    name:"TikTok",    href:"https://www.tiktok.com/@soraku.id",           Icon:TikTokIcon,    color:"text-pink-300"   },
  { slug:"youtube",   name:"YouTube",   href:"https://youtube.com/@chsoraku",              Icon:YouTubeIcon,   color:"text-red-400"    },
  { slug:"bluesky",   name:"Bluesky",   href:"https://bsky.app/profile/soraku.id",         Icon:BlueSkyIcon,   color:"text-sky-400"    },
];

const DISCORD_GUILD_ID = "1116971049045729302";

const CATEGORIES = [
  { label:"Anime & Manga", color:"#4FA3D1", glow:"rgba(79,163,209,0.7)" },
  { label:"Gaming",        color:"#a78bfa", glow:"rgba(167,139,250,0.7)" },
  { label:"VTuber",        color:"#f472b6", glow:"rgba(244,114,182,0.7)" },
  { label:"Fanart",        color:"#34d399", glow:"rgba(52,211,153,0.7)"  },
  { label:"J-Music",       color:"#fbbf24", glow:"rgba(251,191,36,0.7)"  },
  { label:"Cosplay",       color:"#E8C2A8", glow:"rgba(232,194,168,0.7)" },
  { label:"Kreator",       color:"#818cf8", glow:"rgba(129,140,248,0.7)" },
  { label:"Komunitas",     color:"#6ee7b7", glow:"rgba(110,231,183,0.7)" },
];

const DISCORD_CHANNELS = [
  { id:"1", name:"pengumuman",  type:"text",  active:true  },
  { id:"2", name:"umum",        type:"text",  active:true  },
  { id:"3", name:"anime-manga", type:"text",  active:true  },
  { id:"4", name:"fanart",      type:"text",  active:false },
  { id:"5", name:"gaming",      type:"text",  active:false },
  { id:"6", name:"musik",       type:"voice", active:true  },
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface EventItem  {
  id:string; slug:string; title:string; description:string|null;
  coverurl:string|null; startdate:string; enddate:string|null;
  isonline:boolean; tags:string[]; status:string;
}
interface Author { username:string|null; displayname:string|null; avatarurl:string|null; }
interface BlogItem   {
  id:string; slug:string; title:string; excerpt:string|null;
  coverurl:string|null; publishedat:string;
  viewcount:number; likecount:number; commentcount:number;
  tags:string[]; author:Author|null;
}
interface Partnership{ id:string; name:string; logourl:string|null; website:string|null; category:string|null; description:string|null; }
interface DmMember   { username:string; avatar:string|null; status:string; activity?:string; }

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDate(iso:string) {
  return new Date(iso).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"});
}

function getStatusBadge(status:string) {
  switch(status) {
    case "live":     return { label:"Live",     cls:"bg-red-500/15 border-red-500/30 text-red-400",         dot:"bg-red-400 animate-pulse" };
    case "upcoming": return { label:"Upcoming", cls:"bg-primary/15 border-primary/30 text-primary",         dot:"bg-primary animate-pulse" };
    default:         return { label:"Selesai",  cls:"bg-white/5 border-white/10 text-white/30",             dot:"bg-white/25" };
  }
}

function useDiscord() {
  const [d,setD] = useState<{presence:number|null;memberCount:number|null;name:string;loading:boolean;members:DmMember[]}>(
    {presence:null,memberCount:null,name:"Soraku Community",loading:true,members:[]}
  );
  useEffect(()=>{
    fetch(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/widget.json`)
      .then(r=>r.ok?r.json():null)
      .then(j=>{
        const members=(j?.members??[]).slice(0,8).map((m:any)=>({
          username:m.username, avatar:m.avatar_url??null,
          status:m.status??"online", activity:m.game?.name
        }));
        setD({
          presence:j?.presence_count??null,
          memberCount:null, // widget tidak expose total member
          name:j?.name??"Soraku Community",
          loading:false, members
        });
      }).catch(()=>setD(p=>({...p,loading:false})));
  },[]);
  return d;
}

// ─── Marquee Categories (glowing, colorful) ──────────────────────────────────

function CategoryMarquee() {
  const doubled = [...CATEGORIES,...CATEGORIES,...CATEGORIES,...CATEGORIES];
  return (
    <div className="relative overflow-hidden py-5 border-y border-white/[0.04]">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#1C1E22] to-transparent z-10"/>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#1C1E22] to-transparent z-10"/>
      <div className="flex gap-4 whitespace-nowrap" style={{animation:"marquee-cat 30s linear infinite"}}>
        {doubled.map((c,i)=>(
          <span key={i}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold tracking-wide flex-shrink-0 transition-all"
            style={{
              color: c.color,
              borderColor: c.color + "35",
              background: c.color + "10",
              textShadow: `0 0 12px ${c.glow}`,
              boxShadow: `0 0 10px ${c.color}18`,
            }}>
            <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{background:c.color,boxShadow:`0 0 6px ${c.glow}`}}/>
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Floating petals ────────────────────────────────────────────────────────

function Petal({style}:{style:React.CSSProperties}) {
  return (
    <motion.span className="absolute pointer-events-none select-none text-[#E8C2A8]"
      style={{opacity:0.15,...style}}
      animate={{y:[0,-14,0],rotate:[0,10,-5,0],opacity:[0.12,0.22,0.12]}}
      transition={{duration:6+Math.random()*4,repeat:Infinity,ease:"easeInOut",delay:Math.random()*4}}>
      ✿
    </motion.span>
  );
}

// ─── Event Card ──────────────────────────────────────────────────────────────

function EventCard({event}:{event:EventItem}) {
  const st = getStatusBadge(event.status);
  return (
    <Link href={`/events/${event.slug}`}
      className="group relative overflow-hidden rounded-[20px] bg-white/[0.025] border border-white/[0.06] transition-all duration-400 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/40 hover:border-white/[0.12]">
      <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden">
        {event.coverurl
          ? <Image src={event.coverurl} alt={event.title} fill className="object-cover transition-transform duration-600 group-hover:scale-110" unoptimized/>
          : <div className="h-full w-full bg-gradient-to-br from-primary/15 via-accent/8 to-violet-500/10"/>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"/>
        <span className={cn("absolute top-3 right-3 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-black backdrop-blur-md",st.cls)}>
          <span className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0",st.dot)}/>{st.label}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="text-[9px] font-bold text-white/35 mb-1 tracking-widest uppercase flex items-center gap-1">
          <Clock className="h-2.5 w-2.5"/>{fmtDate(event.startdate)}
        </p>
        <h3 className="line-clamp-2 text-sm font-black text-white/90 leading-snug group-hover:text-primary transition-colors">{event.title}</h3>
        {event.tags.length>0&&(
          <span className="mt-1.5 inline-block rounded-full bg-white/8 px-2 py-0.5 text-[9px] text-white/40 capitalize">{event.tags[0]}</span>
        )}
      </div>
    </Link>
  );
}

// ─── Blog Card ───────────────────────────────────────────────────────────────

function BlogCard({blog}:{blog:BlogItem}) {
  return (
    <Link href={`/blog/${blog.slug}`}
      className="group relative overflow-hidden rounded-[20px] bg-white/[0.025] border border-white/[0.06] transition-all duration-400 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/40 hover:border-white/[0.12]">
      <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden">
        {blog.coverurl
          ? <Image src={blog.coverurl} alt={blog.title} fill className="object-cover transition-transform duration-600 group-hover:scale-110" unoptimized/>
          : <div className="h-full w-full bg-gradient-to-br from-primary/12 via-accent/6 to-primary/4"/>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"/>

        {/* Author avatar */}
        {blog.author?.avatarurl&&(
          <div className="absolute top-3 left-3">
            <div className="h-7 w-7 overflow-hidden rounded-full border border-white/20">
              <Image src={blog.author.avatarurl} alt={blog.author.displayname??""} width={28} height={28} className="object-cover"/>
            </div>
          </div>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4">
        {blog.author&&(
          <p className="text-[9px] text-white/40 mb-1 font-medium">
            {blog.author.displayname??blog.author.username??""} · {fmtDate(blog.publishedat)}
          </p>
        )}
        <h3 className="line-clamp-2 text-sm font-black text-white/90 leading-snug group-hover:text-primary transition-colors mb-2">{blog.title}</h3>
        {/* Stats */}
        <div className="flex items-center gap-3 text-[9px] text-white/30">
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
    <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl shadow-2xl shadow-black/40">
      {/* Glass shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none"/>

      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-white/15">
            <Image src="/logo.png" alt="Soraku" fill className="object-cover"/>
          </div>
          <div>
            <p className="text-sm font-black text-white/90">{discord.name}</p>
            <p className="text-[10px] text-white/35">Server Discord Resmi</p>
          </div>
        </div>
        <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-400 transition-colors">
          <DiscordIcon className="h-3.5 w-3.5"/> Gabung
        </a>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"/>
            <span className="text-lg font-black text-white tabular-nums">
              {discord.loading?"—":discord.presence?.toLocaleString("id-ID")??"—"}
            </span>
          </div>
          <span className="text-[10px] text-white/35">Online</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-white/30 flex-shrink-0"/>
            <span className="text-lg font-black text-white">500+</span>
          </div>
          <span className="text-[10px] text-white/35">Member</span>
        </div>
      </div>

      {/* Active members */}
      <div className="px-5 py-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/25 mb-3">Member Online</p>
        {discord.loading ? (
          <div className="space-y-2.5">
            {[1,2,3,4].map(i=>(
              <div key={i} className="flex items-center gap-2.5 animate-pulse">
                <div className="h-8 w-8 rounded-full bg-white/8 flex-shrink-0"/>
                <div className="flex-1 space-y-1">
                  <div className="h-2.5 w-24 rounded bg-white/8"/>
                  <div className="h-2 w-16 rounded bg-white/5"/>
                </div>
              </div>
            ))}
          </div>
        ) : discord.members.length===0 ? (
          <div className="py-6 text-center text-[11px] text-white/20">Widget tidak tersedia</div>
        ) : (
          <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1 scrollbar-hide">
            {discord.members.map((m,i)=>(
              <div key={i} className="flex items-center gap-2.5">
                <div className="relative flex-shrink-0">
                  {m.avatar
                    ? <div className="h-8 w-8 overflow-hidden rounded-full border border-white/10"><Image src={m.avatar} alt="" width={32} height={32} className="object-cover"/></div>
                    : <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/30 text-xs font-black text-white/60">{m.username.charAt(0).toUpperCase()}</div>
                  }
                  <span className={cn("absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#1C1E22]",SC[m.status]??SC.online)}/>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white/70 truncate">{m.username}</p>
                  {m.activity&&<p className="text-[9px] text-white/28 truncate">{m.activity}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer link */}
      <div className="px-5 pb-4">
        <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full rounded-xl border border-indigo-500/25 bg-indigo-500/8 py-2.5 text-xs font-semibold text-indigo-300/70 hover:bg-indigo-500/15 hover:text-indigo-300 transition-colors">
          Buka Server Discord <ArrowRight className="h-3 w-3"/>
        </a>
      </div>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SH({eyebrow,title,href}:{eyebrow:string;title:string;href?:string}) {
  return (
    <div className="mb-8 flex items-end justify-between">
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/50 mb-1.5">{eyebrow}</p>
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl text-white/90">{title}</h2>
      </div>
      {href&&(
        <Link href={href} className="group flex items-center gap-1.5 text-xs font-bold text-white/22 hover:text-primary transition-colors">
          Lihat Semua <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform"/>
        </Link>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const PETALS_POS:React.CSSProperties[] = [
  {top:"18%",left:"7%",fontSize:"20px"},{top:"30%",right:"8%",fontSize:"15px"},
  {bottom:"30%",left:"5%",fontSize:"13px"},{bottom:"20%",right:"9%",fontSize:"17px"},
  {top:"12%",right:"22%",fontSize:"11px"},
];

export default function HomePage() {
  const discord = useDiscord();
  const [data,setData] = useState<{events:EventItem[];blogs:BlogItem[];partnerships:Partnership[]}>({events:[],blogs:[],partnerships:[]});
  const [loading,setLoading] = useState(true);
  const [user,setUser] = useState<{id:string}|null|"loading">("loading");
  const [mousePos,setMousePos] = useState({x:0,y:0});
  const communityRef = useRef<HTMLElement>(null);

  useEffect(()=>{
    fetch("/api/home").then(r=>r.ok?r.json():null).then(d=>{if(d?.data)setData(d.data);}).catch(()=>{}).finally(()=>setLoading(false));
    fetch("/api/auth/me",{cache:"no-store"}).then(r=>r.json()).then(d=>setUser(d.data??null)).catch(()=>setUser(null));
  },[]);

  const isLoggedIn = user!=="loading"&&user!==null;

  return (
    <main className="min-h-screen bg-[#1C1E22] text-foreground overflow-x-hidden">

      {/* ══════════════════════════════════════════════
          HERO — centered, no mascot, no "Sora/ku" etymology
          ══════════════════════════════════════════════ */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-20 pb-12">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-0 w-[500px] h-[420px] rounded-full blur-[140px] bg-[#4FA3D1]/10"/>
          <div className="absolute bottom-0 right-0 w-[440px] h-[380px] rounded-full blur-[130px] bg-[#E8C2A8]/7"/>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[340px] rounded-full blur-[180px] bg-[#4FA3D1]/4"/>
        </div>
        {PETALS_POS.map((s,i)=><Petal key={i} style={s}/>)}

        <div className="container mx-auto px-6 relative z-10 text-center max-w-[820px]">
          {/* Script eyebrow */}
          <motion.span initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.7}}
            className="block mb-4 text-2xl sm:text-3xl tracking-wide text-[#E8C2A8]/75"
            style={{fontFamily:"var(--font-script,'Style Script',cursive)"}}>
            Belajar, Berkarya, Bersama
          </motion.span>

          {/* Live badge */}
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.05}}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse"/>
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/38 uppercase">
              {discord.loading?"—":discord.presence?.toLocaleString("id-ID")??"—"} ONLINE SEKARANG
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.1}}
            className="font-black tracking-tighter leading-[1.0] text-foreground text-[clamp(44px,8.5vw,88px)] mb-0">
            Temukan Duniamu<br/>
            di{" "}
            <span className="bg-clip-text text-transparent"
              style={{backgroundImage:"linear-gradient(130deg,#4FA3D1 0%,#90c8e8 38%,#E8C2A8 72%,#d4a882 100%)",WebkitBackgroundClip:"text"}}>
              Soraku
            </span>
          </motion.h1>

          {/* Divider */}
          <motion.div initial={{opacity:0,scaleX:0}} animate={{opacity:0.45,scaleX:1}} transition={{duration:0.6,delay:0.2}}
            className="mx-auto my-5 h-[2px] w-12 rounded-full origin-center"
            style={{background:"linear-gradient(90deg,#4FA3D1,#E8C2A8)"}}/>

          {/* Description */}
          <motion.p initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.25}}
            className="max-w-[540px] mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed mb-7">
            Wujudkan imajinasi, asah kreativitas, dan jalin koneksi bermakna.
            Di sini, setiap langkahmu adalah bagian dari cerita besar kita bersama.
          </motion.p>

          {/* Category tags */}
          <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.32}}
            className="flex flex-wrap items-center justify-center gap-2 mb-9">
            {CATEGORIES.slice(0,6).map((c,i)=>(
              <motion.span key={c.label} initial={{opacity:0,scale:0.85}} animate={{opacity:1,scale:1}} transition={{duration:0.35,delay:0.37+i*0.05}}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-white/[0.04] border transition-all hover:bg-white/[0.08] cursor-default"
                style={{color:c.color,borderColor:c.color+"30"}}>
                {c.label}
              </motion.span>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.45}}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            {!isLoggedIn&&(
              <Link href="/register"
                className="group flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm tracking-wide text-white transition-all hover:scale-[1.03] hover:shadow-[0_0_32px_rgba(79,163,209,0.32)]"
                style={{background:"linear-gradient(135deg,#4FA3D1 0%,#3a8fbe 100%)"}}>
                <Sparkles className="h-4 w-4 opacity-90"/>
                Bergabung Gratis
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1"/>
              </Link>
            )}
            <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm tracking-wide text-foreground/75 bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.09] hover:border-white/[0.18] hover:text-foreground transition-all">
              <DiscordIcon className="h-4 w-4 text-indigo-400"/> Gabung Discord
            </a>
          </motion.div>

          {/* Scroll hint */}
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1,delay:1}}
            className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/35">Gulir untuk menjelajahi</span>
            <motion.div animate={{y:[0,6,0]}} transition={{duration:2,repeat:Infinity,ease:"easeInOut"}}
              className="w-px h-8 bg-gradient-to-b from-muted-foreground/20 to-transparent"/>
          </motion.div>
        </div>
      </section>

      {/* ══ CATEGORY MARQUEE ══ */}
      <CategoryMarquee/>

      {/* ══════════════════════════════════════════════
          COMMUNITY SECTION — framer animated
          ══════════════════════════════════════════════ */}
      <section ref={communityRef}
        onMouseMove={e=>{if(!communityRef.current)return;const r=communityRef.current.getBoundingClientRect();setMousePos({x:e.clientX-r.left,y:e.clientY-r.top});}}
        className="relative py-44 sm:py-56 overflow-hidden">
        <motion.div className="absolute pointer-events-none rounded-full blur-[140px] bg-primary/5 w-[600px] h-[600px] -z-0"
          animate={{x:mousePos.x-300,y:mousePos.y-300}} transition={{type:"spring",damping:40,stiffness:150}}/>
        <div className="pointer-events-none absolute inset-0">
          <motion.div animate={{scale:[1,1.15,1],opacity:[0.04,0.09,0.04],x:[0,50,0],y:[0,-30,0]}}
            transition={{duration:20,repeat:Infinity,ease:"easeInOut"}}
            className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px]"/>
          <motion.div animate={{scale:[1.1,1,1.1],opacity:[0.03,0.06,0.03],x:[0,-40,0],y:[0,40,0]}}
            transition={{duration:25,repeat:Infinity,ease:"easeInOut",delay:2}}
            className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[140px]"/>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}}
            viewport={{once:false,amount:0.3}} transition={{duration:1.2,ease:[0.22,1,0.36,1]}}>
            <motion.p initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} transition={{duration:1,delay:0.2}}
              className="font-script text-4xl sm:text-6xl text-white/18 mb-6 tracking-wide"
              style={{fontFamily:"var(--font-script,'Style Script',cursive)"}}>
              Belajar dan Berkembang
            </motion.p>
            <h2 className="text-[clamp(3.5rem,10vw,7.5rem)] font-black leading-[0.9] tracking-tighter text-white mb-12">
              <motion.span initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} transition={{duration:0.8,delay:0.4}} className="inline-block">Temukan</motion.span>{" "}
              <motion.span initial={{opacity:0,x:20}} whileInView={{opacity:1,x:0}} transition={{duration:0.8,delay:0.6}} className="inline-block">Duniamu</motion.span>{" "}
              <motion.span initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{duration:0.8,delay:0.8}} className="inline-block">
                di{" "}
                <span className="text-gradient relative">
                  Soraku
                  <motion.span className="absolute -inset-2 bg-primary/10 blur-2xl rounded-full -z-10"
                    animate={{opacity:[0.3,0.7,0.3]}} transition={{duration:3.5,repeat:Infinity}}/>
                </span>
              </motion.span>
            </h2>
            <motion.p initial={{opacity:0}} whileInView={{opacity:1}} transition={{duration:1,delay:1}}
              className="max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed text-white/22 font-medium">
              Dari penggemar, untuk penggemar di seluruh Indonesia.{" "}
              Tempat kamu ketemu orang-orang yang{" "}
              <em className="not-italic text-white/45 font-semibold">ngerti duniamu</em>.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PLATFORM — Floating cards with anime character overlay
          ══════════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 container mx-auto px-6">
        <SH eyebrow="Jelajahi" title="Platform Soraku"/>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { href:"/events", label:"Events", desc:"Turnamen & gathering komunitas", icon:Calendar, color:"#4FA3D1", glow:"rgba(79,163,209,0.25)", char:"/logo-full.png" },
            { href:"/blog",   label:"Blog",   desc:"Artikel & ulasan dari kreator", icon:BookOpen, color:"#a78bfa", glow:"rgba(167,139,250,0.25)", char:"/logo-full.png" },
            { href:"/gallery",label:"Galeri", desc:"Fanart & karya anggota",         icon:Zap,      color:"#f472b6", glow:"rgba(244,114,182,0.25)", char:"/logo-full.png" },
            { href:"/vtubers",label:"VTuber", desc:"Virtual YouTuber komunitas",      icon:Users,    color:"#34d399", glow:"rgba(52,211,153,0.25)",  char:"/logo-full.png" },
          ].map((p,i)=>(
            <motion.div key={p.href} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}}
              viewport={{once:true}} transition={{duration:0.6,delay:i*0.1}}>
              <Link href={p.href}
                className="group relative overflow-hidden rounded-[24px] border border-white/[0.06] bg-white/[0.02] flex flex-col min-h-[220px] sm:min-h-[260px] transition-all duration-400 hover:-translate-y-2 hover:shadow-2xl hover:border-white/[0.12]"
                style={{boxShadow:`0 0 0 0 ${p.glow}`}}>
                {/* Glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{background:`radial-gradient(circle at 50% 100%,${p.glow},transparent 70%)`}}/>
                {/* Anime character — overlay bottom right */}
                <div className="absolute bottom-0 right-0 h-[70%] w-[50%] opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
                  <Image src={p.char} alt="" fill className="object-contain object-right-bottom"/>
                </div>
                {/* Content */}
                <div className="relative z-10 p-5 flex flex-col flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl mb-auto"
                    style={{background:p.color+"20",border:`1px solid ${p.color}35`}}>
                    <p.icon className="h-5 w-5" style={{color:p.color}}/>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-base font-black text-white/90 mb-1 group-hover:text-white transition-colors" style={{color:p.color}}>{p.label}</h3>
                    <p className="text-[11px] text-white/35 leading-relaxed">{p.desc}</p>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-[10px] font-bold opacity-0 group-hover:opacity-60 transition-opacity" style={{color:p.color}}>
                    Jelajahi <ArrowRight className="h-3 w-3"/>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ EVENTS ══ */}
      <section className="py-12 sm:py-16 container mx-auto px-6">
        <SH eyebrow="Upcoming" title="Event Komunitas" href="/events"/>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {[1,2,3,4,5,6].map(i=><div key={i} className="animate-pulse rounded-[20px] bg-white/[0.025] aspect-[4/5]"/>)}
          </div>
        ) : data.events.length===0 ? (
          <div className="py-16 text-center"><Calendar className="mx-auto h-8 w-8 text-white/10 mb-3"/><p className="text-sm text-white/25">Belum ada event</p></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {data.events.map(e=><EventCard key={e.id} event={e}/>)}
          </div>
        )}
      </section>

      {/* ══ BLOG ══ */}
      <section className="py-12 sm:py-16 container mx-auto px-6">
        <SH eyebrow="Komunitas" title="Artikel & Kreasi" href="/blog"/>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {[1,2,3,4,5,6].map(i=><div key={i} className="animate-pulse rounded-[20px] bg-white/[0.025] aspect-[4/5]"/>)}
          </div>
        ) : data.blogs.length===0 ? (
          <div className="py-16 text-center"><BookOpen className="mx-auto h-8 w-8 text-white/10 mb-3"/><p className="text-sm text-white/25">Belum ada artikel</p></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {data.blogs.map(b=><BlogCard key={b.id} blog={b}/>)}
          </div>
        )}
      </section>

      {/* ══ DISCORD REALTIME ══ */}
      <section className="py-12 sm:py-16 container mx-auto px-6">
        <div className="max-w-sm mx-auto sm:max-w-md">
          <SH eyebrow="Real-time" title="Discord Server"/>
          <DiscordLiveCard discord={discord}/>
        </div>
      </section>

      {/* ══ SPONSORSHIP & PARTNERSHIP ══ */}
      {data.partnerships.length>0&&(
        <section className="py-12 sm:py-16 container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/45 mb-2">Dukungan</p>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl text-white/90">Sponsor &amp; Partner</h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {data.partnerships.map(p=>(
              <a key={p.id} href={p.website??"#"} target="_blank" rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 transition-all hover:-translate-y-0.5">
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center overflow-hidden rounded-2xl bg-white/[0.04] border border-white/[0.06] group-hover:border-white/[0.14] transition-colors p-2">
                  {p.logourl
                    ? <Image src={p.logourl} alt={p.name} width={56} height={56} className="object-contain opacity-45 group-hover:opacity-90 transition-opacity duration-400"/>
                    : <Handshake className="h-5 w-5 text-white/20"/>
                  }
                </div>
                <p className="text-[9px] font-bold text-white/22 group-hover:text-white/50 transition-colors uppercase tracking-wide">{p.name}</p>
                {p.category&&<p className="text-[8px] text-white/15 uppercase tracking-wide">{p.category}</p>}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ══ SOSIAL MEDIA — marquee, no heading ══ */}
      <div className="relative overflow-hidden py-3 border-t border-white/[0.04]">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#1C1E22] to-transparent z-10"/>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#1C1E22] to-transparent z-10"/>
        <div className="marquee-track mb-2 flex gap-4 whitespace-nowrap">
          {[...Array(4)].map((_,i)=>SOCIAL_LINKS.map(({slug,name,href,Icon,color})=>(
            <a key={`r1-${i}-${slug}`} href={href} target="_blank" rel="noopener noreferrer"
              className={cn("group inline-flex items-center gap-2 rounded-full px-4 py-2 hover:bg-white/5 transition-all",color)}>
              <Icon className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity"/>
              <span className="text-sm font-semibold opacity-25 group-hover:opacity-70 transition-opacity">{name}</span>
            </a>
          )))}
        </div>
        <div className="marquee-track-reverse flex gap-4 whitespace-nowrap">
          {[...Array(4)].map((_,i)=>[...SOCIAL_LINKS].reverse().map(({slug,name,href,Icon,color})=>(
            <a key={`r2-${i}-${slug}`} href={href} target="_blank" rel="noopener noreferrer"
              className={cn("group inline-flex items-center gap-2 rounded-full px-4 py-2 hover:bg-white/5 transition-all",color)}>
              <Icon className="h-4 w-4 opacity-40 group-hover:opacity-90 transition-opacity"/>
              <span className="text-sm font-semibold opacity-20 group-hover:opacity-60 transition-opacity">{name}</span>
            </a>
          )))}
        </div>
      </div>

      {/* ══ JOIN CTA ══ */}
      {!isLoggedIn&&user!=="loading"&&(
        <section className="py-20 sm:py-28 container mx-auto px-6 text-center">
          <div className="text-4xl mb-6">🌸</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-5 text-white">
            Jadilah bagian dari <span className="text-primary">Soraku</span>
          </h2>
          <p className="text-white/25 text-base sm:text-lg leading-relaxed mb-10 max-w-md mx-auto">
            Gratis selamanya. Komunitas yang hangat, supportif, dan penuh semangat.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register"
              className="inline-flex items-center gap-2 rounded-2xl px-9 py-4 text-sm font-bold text-white shadow-xl transition-all hover:scale-[1.03] hover:shadow-[0_0_32px_rgba(79,163,209,0.3)]"
              style={{background:"linear-gradient(135deg,#4FA3D1 0%,#3a8fbe 100%)"}}>
              Daftar Gratis <ArrowRight className="h-4 w-4"/>
            </Link>
            <Link href="/about"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.08] px-9 py-4 text-sm font-semibold text-white/38 hover:border-white/[0.15] hover:text-white/60 transition-all">
              Tentang Soraku
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
