"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import {
  ArrowRight, Users, Wifi, Calendar, BookOpen,
  Handshake, Eye, Heart, ChevronRight, Hash,
  MessageSquare, Volume2, Circle, Zap, Crown,
  Star, Sparkles, Trophy, Check, TrendingUp, Gift,
} from "lucide-react";
import {
  DiscordIcon, InstagramIcon, FacebookIcon, XIcon,
  TikTokIcon, YouTubeIcon, BlueSkyIcon,
} from "@/components/icons/custom-icons";
import { cn } from "@/lib/utils";

// ─── Constants ──────────────────────────────────────────────────────────────

const SOCIAL_LINKS = [
  { slug:"discord",   name:"Discord",   href:"https://discord.gg/qm3XJvRa6B",               Icon:DiscordIcon,   color:"text-indigo-400", bg:"hover:bg-indigo-500/8"  },
  { slug:"instagram", name:"Instagram", href:"https://www.instagram.com/soraku.moe",          Icon:InstagramIcon, color:"text-pink-400",   bg:"hover:bg-pink-500/8"    },
  { slug:"facebook",  name:"Facebook",  href:"https://www.facebook.com/share/1HQs9ZZeCw/",    Icon:FacebookIcon,  color:"text-blue-400",   bg:"hover:bg-blue-500/8"    },
  { slug:"x",         name:"X",         href:"https://twitter.com/@AppSora",                 Icon:XIcon,         color:"text-white/60",   bg:"hover:bg-white/5"       },
  { slug:"tiktok",    name:"TikTok",    href:"https://www.tiktok.com/@soraku.id",             Icon:TikTokIcon,    color:"text-pink-300",   bg:"hover:bg-pink-500/8"    },
  { slug:"youtube",   name:"YouTube",   href:"https://youtube.com/@chsoraku",                Icon:YouTubeIcon,   color:"text-red-400",    bg:"hover:bg-red-500/8"     },
  { slug:"bluesky",   name:"Bluesky",   href:"https://bsky.app/profile/soraku.id",           Icon:BlueSkyIcon,   color:"text-sky-400",    bg:"hover:bg-sky-500/8"     },
];

const DISCORD_GUILD_ID = "1033369620989124628";

const DISCORD_CHANNELS = [
  { id:"1", name:"pengumuman",  type:"text",  active:true  },
  { id:"2", name:"umum",        type:"text",  active:true  },
  { id:"3", name:"anime-manga", type:"text",  active:true  },
  { id:"4", name:"fanart",      type:"text",  active:false },
  { id:"5", name:"gaming",      type:"text",  active:false },
  { id:"6", name:"musik",       type:"voice", active:true  },
];

const FAKE_MSGS = [
  { user:"Sora",       color:"text-indigo-300", msg:"Selamat datang di Soraku! 🌸",               time:"10:00" },
  { user:"Kaizo",      color:"text-emerald-300",msg:"Halo~ ada yang nonton anime baru musim ini?", time:"10:02" },
  { user:"MemberBaru", color:"text-violet-300", msg:"Baru gabung nih, senang bisa kenal kalian ✨", time:"10:05" },
  { user:"AniWatcher", color:"text-amber-300",  msg:"Frieren season 2 kapan ya... 😭",             time:"10:08" },
];

// Tier premium Soraku
const TIERS = [
  {
    id: "donatur",
    name: "Donatur",
    emoji: "💙",
    price: "Bebas",
    period: "",
    desc: "Dukung Soraku seikhlasnya via Trakteer",
    color: "from-blue-500/10 to-transparent",
    border: "border-blue-500/20",
    accent: "text-blue-400",
    badge: "text-blue-300 bg-blue-500/10 border-blue-500/25",
    perks: [
      "Badge Donatur di profil",
      "Akses channel donatur Discord",
      "Terima kasih dari tim Soraku",
    ],
    href: "/donate",
    cta: "Donasi Sekarang",
  },
  {
    id: "vip",
    name: "VIP",
    emoji: "⭐",
    price: "Rp 25.000",
    period: "/bulan",
    desc: "Untuk supporter setia komunitas Soraku",
    color: "from-primary/15 to-transparent",
    border: "border-primary/30",
    accent: "text-primary",
    badge: "text-primary bg-primary/10 border-primary/25",
    highlight: true,
    perks: [
      "Badge VIP di profil & Discord",
      "Channel VIP eksklusif",
      "Early access event & konten",
      "Priority response dari tim",
      "Nama di halaman Top Supporter",
    ],
    href: "/premium#vip",
    cta: "Mulai VIP",
  },
  {
    id: "vvip",
    name: "VVIP",
    emoji: "✨",
    price: "Rp 75.000",
    period: "/bulan",
    desc: "Supporter tertinggi — Community Builder",
    color: "from-amber-500/12 via-accent/8 to-transparent",
    border: "border-amber-500/35",
    accent: "text-amber-400",
    badge: "text-amber-300 bg-amber-500/10 border-amber-500/25",
    perks: [
      "Semua benefit VIP",
      "Badge VVIP dengan glow emas",
      "Custom role Discord",
      "Shoutout bulanan di sosmed",
      "Akses beta fitur platform",
      "Nama besar di Top Supporter",
    ],
    href: "/premium#vvip",
    cta: "Mulai VVIP",
  },
];

// Fitur komunitas Soraku
const FEATURES = [
  {
    icon: "🎌",
    title: "Anime & Manga Hub",
    desc: "Diskusi seru seputar anime musiman, manga terbaru, dan rekomendasi konten.",
    color: "from-red-500/8 to-transparent",
    link: "/blog",
  },
  {
    icon: "🎨",
    title: "Galeri Kreator",
    desc: "Pajang karyamu — fanart, cosplay, ilustrasi — di hadapan ribuan anggota.",
    color: "from-purple-500/8 to-transparent",
    link: "/gallery",
  },
  {
    icon: "🎭",
    title: "Agensi VTuber",
    desc: "Soraku punya talent VTuber, kreator, dan cosplayer yang aktif berkarya.",
    color: "from-pink-500/8 to-transparent",
    link: "/agensi",
  },
  {
    icon: "🏆",
    title: "Event Komunitas",
    desc: "Turnamen, lomba, nonton bareng, dan event offline reguler tiap bulan.",
    color: "from-amber-500/8 to-transparent",
    link: "/events",
  },
  {
    icon: "💬",
    title: "Server Discord Aktif",
    desc: "500+ member online setiap hari. Chat, voice, dan collab tanpa henti.",
    color: "from-indigo-500/8 to-transparent",
    link: "https://discord.gg/qm3XJvRa6B",
  },
  {
    icon: "🌸",
    title: "Non-Profit & Terbuka",
    desc: "Gratis selamanya. Komunitas dibuat dari penggemar, untuk penggemar.",
    color: "from-rose-500/8 to-transparent",
    link: "/about",
  },
];

// ─── Types ──────────────────────────────────────────────────────────────────

interface Author { username:string|null; displayname:string|null; avatarurl:string|null; }
interface EventItem  { id:string; slug:string; title:string; description:string|null; coverurl:string|null; startdate:string; status:string; }
interface BlogItem   { id:string; slug:string; title:string; excerpt:string|null; coverurl:string|null; publishedat:string; viewcount?:number; likecount?:number; author:Author|null; }
interface Partnership{ id:string; name:string; logourl:string|null; website:string|null; category:string|null; }
interface DmMember   { username:string; avatar:string|null; status:string; activity?:string; }

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDate(iso:string) {
  return new Date(iso).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"});
}
function getStatusInfo(status:string,startdate:string) {
  const now=Date.now(),start=new Date(startdate).getTime();
  if(start>now) return {label:"Upcoming",cls:"text-primary/80 bg-primary/8 border-primary/20",dot:"bg-primary animate-pulse"};
  if(status==="selesai") return {label:"Selesai",cls:"text-white/30 bg-white/6 border-white/10",dot:"bg-white/20"};
  return {label:"Live",cls:"text-emerald-400 bg-emerald-500/10 border-emerald-500/20",dot:"bg-emerald-400 animate-pulse"};
}
function useDiscord() {
  const [d,setD]=useState<{presence:number|null;name:string;loading:boolean;members:DmMember[]}>({presence:null,name:"Soraku Community",loading:true,members:[]});
  useEffect(()=>{
    fetch(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/widget.json`)
      .then(r=>r.ok?r.json():null)
      .then(j=>{
        const members=(j?.members??[]).slice(0,6).map((m:any)=>({username:m.username,avatar:m.avatar_url??null,status:m.status??"online",activity:m.game?.name}));
        setD({presence:j?.presence_count??null,name:j?.name??"Soraku Community",loading:false,members});
      }).catch(()=>setD(p=>({...p,loading:false})));
  },[]);
  return d;
}

// ─── Content Card — image poster style ───────────────────────────────────────

function ContentCard({href,cover,title,meta,badge}:{href:string;cover:string|null;title:string;meta:string;badge?:React.ReactNode}) {
  return (
    <Link href={href} className="group block relative overflow-hidden rounded-2xl bg-muted/8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30">
      <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden">
        {cover
          ? <Image src={cover} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized/>
          : <div className="h-full w-full bg-gradient-to-br from-primary/15 via-accent/8 to-violet-500/10"/>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"/>
        {badge && <div className="absolute top-3 right-3">{badge}</div>}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="text-[10px] text-white/35 mb-1">{meta}</p>
        <h3 className="line-clamp-2 text-sm font-black text-white/90 leading-snug group-hover:text-primary/90 transition-colors">{title}</h3>
      </div>
    </Link>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SH({eyebrow,title,href,center}:{eyebrow:string;title:string;href?:string;center?:boolean}) {
  return (
    <div className={cn("mb-8 flex items-end justify-between",center && "justify-center text-center flex-col items-center")}>
      <div className={center ? "text-center" : ""}>
        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-primary/40 mb-1.5">{eyebrow}</p>
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl">{title}</h2>
      </div>
      {href && !center && (
        <Link href={href} className="group flex items-center gap-1 text-xs font-semibold text-muted-foreground/35 hover:text-primary transition-colors">
          Semua <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform"/>
        </Link>
      )}
    </div>
  );
}

// ─── Discord Embed ────────────────────────────────────────────────────────────

function DiscordEmbed({discord}:{discord:ReturnType<typeof useDiscord>}) {
  const [active,setActive]=useState("2");
  const SC={online:"bg-emerald-500",idle:"bg-amber-400",dnd:"bg-red-500",offline:"bg-muted-foreground/30"};
  return (
    <div className="overflow-hidden rounded-2xl border border-white/6 bg-[#1e1f22]/90 shadow-2xl shadow-black/40 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#1e1f22]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border border-indigo-500/30">
            <Image src="/logo.png" alt="S" fill className="object-cover"/>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-white/90 truncate">{discord.name}</p>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"/>
              <span className="text-[10px] text-white/35 truncate">
                {discord.loading?"—":`${discord.presence?.toLocaleString("id-ID")??"—"} online`}
              </span>
            </div>
          </div>
        </div>
        <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
          className="flex-shrink-0 flex items-center gap-1.5 rounded-xl bg-indigo-500 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-indigo-400 transition-colors">
          <DiscordIcon className="h-3 w-3"/> Gabung
        </a>
      </div>
      <div className="flex h-[300px] sm:h-[340px]">
        <div className="w-[150px] flex-shrink-0 bg-[#2b2d31]/90 flex flex-col overflow-y-auto py-2 gap-0.5">
          <p className="px-3 pb-1 pt-0.5 text-[9px] font-black uppercase tracking-wider text-white/20">Channels</p>
          {DISCORD_CHANNELS.map(ch=>(
            <button key={ch.id} onClick={()=>setActive(ch.id)}
              className={cn("flex items-center gap-1.5 mx-1 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors text-left",
                active===ch.id?"bg-white/10 text-white/90":"text-white/30 hover:text-white/60 hover:bg-white/5")}>
              {ch.type==="voice"?<Volume2 className="h-3 w-3 flex-shrink-0"/>:<Hash className="h-3 w-3 flex-shrink-0"/>}
              <span className="truncate">{ch.name}</span>
              {ch.active&&<span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0"/>}
            </button>
          ))}
          <p className="px-3 pb-1 pt-3 text-[9px] font-black uppercase tracking-wider text-white/20">Online</p>
          {discord.loading?[1,2,3].map(i=>(<div key={i} className="flex items-center gap-2 px-2 py-1.5 mx-1 animate-pulse"><div className="h-5 w-5 rounded-full bg-white/10 flex-shrink-0"/><div className="h-2 w-14 rounded bg-white/10"/></div>))
          :discord.members.length>0?discord.members.map((m,i)=>(
            <div key={i} className="flex items-center gap-2 px-2 py-1.5 mx-1 rounded-lg hover:bg-white/5 transition-colors">
              <div className="relative flex-shrink-0">
                {m.avatar?<div className="h-5 w-5 overflow-hidden rounded-full"><Image src={m.avatar} alt="" width={20} height={20} className="object-cover"/></div>
                :<div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/40 text-[8px] font-black text-white/70">{m.username.charAt(0).toUpperCase()}</div>}
                <span className={cn("absolute -bottom-px -right-px h-2 w-2 rounded-full border-[1.5px] border-[#2b2d31]",(SC as any)[m.status]??SC.online)}/>
              </div>
              <span className="text-[10px] text-white/50 truncate">{m.username}</span>
            </div>
          )):<p className="px-3 text-[10px] text-white/20">Widget offline</p>}
        </div>
        <div className="flex-1 flex flex-col bg-[#313338]/60 min-w-0">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5">
            <Hash className="h-3.5 w-3.5 text-white/25 flex-shrink-0"/>
            <span className="text-xs font-bold text-white/60 truncate">{DISCORD_CHANNELS.find(c=>c.id===active)?.name??"umum"}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {FAKE_MSGS.map((m,i)=>(
              <div key={i} className="flex items-start gap-2.5">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/25 text-[9px] font-black text-white/60 mt-0.5">
                  {m.user.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className={cn("text-[11px] font-bold",m.color)}>{m.user}</span>
                    <span className="text-[9px] text-white/20">{m.time}</span>
                  </div>
                  <p className="text-[11px] text-white/55 leading-relaxed">{m.msg}</p>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 pt-0.5">
              {[0,150,300].map(d=><span key={d} className="h-1.5 w-1.5 rounded-full bg-white/20 animate-bounce" style={{animationDelay:`${d}ms`}}/>)}
              <span className="text-[9px] text-white/20">beberapa orang mengetik...</span>
            </div>
          </div>
          <div className="px-3 pb-3">
            <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 w-full rounded-xl bg-[#1e1f22] px-3 py-2 text-[11px] text-white/20 hover:text-white/40 transition-colors group">
              <MessageSquare className="h-3.5 w-3.5 flex-shrink-0"/>
              <span className="flex-1">Bergabung untuk kirim pesan...</span>
              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity"/>
            </a>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/5 bg-[#1e1f22]/80">
        <div className="flex items-center gap-4 text-[10px] text-white/25">
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/>{discord.loading?"...":discord.presence?`${discord.presence.toLocaleString("id-ID")} online`:"—"}</span>
          <span className="flex items-center gap-1.5"><Circle className="h-2 w-2"/>500+ member</span>
        </div>
        <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
          className="text-[10px] text-indigo-400/60 hover:text-indigo-300 transition-colors font-semibold">Buka Discord →</a>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const discord=useDiscord();
  const [data,setData]=useState<{events:EventItem[];blogs:BlogItem[];partnerships:Partnership[]}>({events:[],blogs:[],partnerships:[]});
  const [loading,setLoading]=useState(true);
  const [user,setUser]=useState<{id:string}|null|"loading">("loading");

  useEffect(()=>{
    fetch("/api/home").then(r=>r.ok?r.json():null).then(d=>{if(d?.data)setData(d.data);}).catch(()=>{}).finally(()=>setLoading(false));
    fetch("/api/auth/me",{cache:"no-store"}).then(r=>r.json()).then(d=>setUser(d.data??null)).catch(()=>setUser(null));
  },[]);

  const isLoggedIn=user!=="loading"&&user!==null;

  return (
    <>
      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">

        {/* Mobile */}
        <div className="lg:hidden px-5 pt-16 pb-14 min-h-[85svh] flex flex-col justify-center">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-primary/8 blur-[140px]"/>
            <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-accent/6 blur-[100px]"/>
          </div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/12 bg-primary/5 px-4 py-1.5 w-fit reveal-up">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"/>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"/>
            </span>
            <span className="text-[10px] font-black tracking-[0.15em] text-primary/60 uppercase">
              {discord.loading?"—":`${discord.presence?.toLocaleString("id-ID")??"500"}+ online`}
            </span>
          </div>
          <div className="reveal-up">
            <h1 className="text-[clamp(3.5rem,18vw,6rem)] font-black leading-[0.88] tracking-tighter">Soraku</h1>
            <p className="text-[clamp(0.9rem,4vw,1.2rem)] font-light text-muted-foreground/45 tracking-wide mt-1.5">Community · 空 · Est. 2023</p>
          </div>
          <div className="h-px w-16 bg-gradient-to-r from-primary/40 to-transparent my-6 reveal-up reveal-delay-1"/>
          <div className="reveal-up reveal-delay-2 space-y-2 max-w-xs">
            <p className="text-sm leading-relaxed text-muted-foreground/75">
              <span className="font-bold text-foreground/90">Soraku</span> — komunitas non-profit untuk semua pecinta anime, manga, dan budaya Jepang di Indonesia.
            </p>
            <p className="text-xs text-muted-foreground/45">Gratis. Terbuka. Hangat. <span className="text-primary/65 font-semibold">Ini rumah digitalmu.</span></p>
          </div>
          <div className="mt-8 flex items-center gap-3 reveal-up reveal-delay-3">
            <Link href="/register" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all">
              Bergabung <ArrowRight className="h-3.5 w-3.5"/>
            </Link>
            <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-indigo-500/25 bg-indigo-500/8 px-5 py-3 text-sm font-semibold text-indigo-300/80 hover:-translate-y-0.5 transition-all">
              <DiscordIcon className="h-4 w-4"/> Discord
            </a>
          </div>
          <div className="mt-10 flex items-center gap-6 reveal-up reveal-delay-4">
            {[
              {val:discord.loading?"—":`${discord.presence?.toLocaleString("id-ID")??"500"}+`,label:"online",live:true},
              {val:"20+",label:"event"},{val:"100+",label:"konten"},
            ].map((s,i)=>(
              <div key={i} className="flex items-center gap-1.5">
                {s.live&&<span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50"/><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400"/></span>}
                <span className="text-xs font-black text-foreground">{s.val}</span>
                <span className="text-[10px] text-muted-foreground/35">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden lg:flex items-center min-h-[96vh] px-6 py-16">
          <div className="mx-auto w-full max-w-7xl">
            <div className="grid gap-20 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] items-center">
              <div className="max-w-2xl">
                <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-primary/12 bg-primary/5 px-4 py-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"/>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"/>
                  </span>
                  <span className="text-[10px] font-black tracking-[0.18em] text-primary/60 uppercase">
                    {discord.loading?"—":`${discord.presence?.toLocaleString("id-ID")??"500"}+ online`} · Soraku Community
                  </span>
                </div>
                <div className="space-y-1 reveal-up">
                  <h1 className="text-[clamp(4rem,10vw,8rem)] font-black leading-[0.88] tracking-tighter">Soraku</h1>
                  <p className="text-[clamp(1rem,2.2vw,1.6rem)] font-light text-muted-foreground/45 tracking-wide pl-0.5">Community · 空 · Est. 2023</p>
                </div>
                <div className="my-8 h-px w-20 bg-gradient-to-r from-primary/35 to-transparent"/>
                <div className="space-y-3 max-w-lg reveal-up reveal-delay-1">
                  <p className="text-base leading-relaxed text-muted-foreground/80">
                    <span className="font-bold text-foreground">Soraku</span> — dari <em className="not-italic font-medium text-foreground/70">"Sora"</em> (langit) dan <em className="not-italic font-medium text-foreground/70">"ku"</em> (milikku).
                  </p>
                  <p className="text-sm leading-loose text-muted-foreground/55">
                    Ruang komunitas non-profit untuk semua pecinta anime, manga, dan budaya Jepang di Indonesia.
                  </p>
                  <p className="text-sm text-muted-foreground/40">Gratis. Terbuka. Hangat. <span className="text-primary/65 font-semibold">Ini rumah digitalmu.</span></p>
                </div>
                <div className="mt-10 flex flex-wrap items-center gap-3 reveal-up reveal-delay-2">
                  <Link href="/register"
                    className="group relative overflow-hidden rounded-2xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-primary/20 transition-all hover:-translate-y-0.5">
                    <span className="relative z-10 flex items-center gap-2">Bergabung Gratis <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"/></span>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 transition-transform duration-500 group-hover:translate-x-full"/>
                  </Link>
                  <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-2xl border border-indigo-500/20 bg-indigo-500/7 px-8 py-3.5 text-sm font-semibold text-indigo-300/80 transition-all hover:-translate-y-0.5 hover:border-indigo-400/35">
                    <DiscordIcon className="h-4 w-4"/> Gabung Discord
                  </a>
                </div>
                <div className="mt-12 flex flex-wrap items-center gap-7 reveal-up reveal-delay-3">
                  {[
                    {val:discord.loading?"—":`${discord.presence?.toLocaleString("id-ID")??"500"}+`,label:"online",live:true},
                    {val:"20+",label:"event"},{val:"100+",label:"konten"},
                  ].map((s,i)=>(
                    <div key={i} className="flex items-center gap-2">
                      {s.live&&<span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50"/><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"/></span>}
                      <span className="text-sm font-black text-foreground">{s.val}</span>
                      <span className="text-xs text-muted-foreground/35">{s.label}</span>
                      {i<2&&<span className="ml-3 h-3 w-px bg-border/25"/>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mascot */}
              <div className="flex justify-end">
                <div className="relative w-[360px] xl:w-[420px]">
                  <div className="absolute inset-0 -m-14 rounded-full bg-primary/8 blur-3xl pointer-events-none"/>
                  <div className="relative h-[560px] xl:h-[620px] w-full">
                    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background via-background/45 to-transparent z-10 pointer-events-none"/>
                    <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-background via-background/65 to-transparent z-10 pointer-events-none"/>
                    <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background/70 to-transparent z-10 pointer-events-none"/>
                    <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background/70 to-transparent z-10 pointer-events-none"/>
                    <Image src="/logo-full.png" alt="Soraku mascot" fill className="object-cover object-center" priority/>
                    <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-6 flex items-end justify-between">
                      <div><p className="text-base font-black text-white/80 drop-shadow-lg">Soraku</p><p className="text-[10px] text-white/30">Community · 空</p></div>
                      <span className="flex items-center gap-1 text-[9px] font-black text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"/> Live</span>
                    </div>
                  </div>
                  {[
                    {text:"🌸 Komunitas",   r:"-2.5rem",t:"4rem",   d:"0s"   },
                    {text:"🎌 Anime & Manga",l:"-3.5rem",t:"8.5rem", d:"1s"   },
                    {text:"✨ Non-profit",   r:"-2rem",  b:"9rem",   d:"2s"   },
                    {text:"🇮🇩 Indonesia",  l:"-2.5rem", b:"5.5rem", d:"0.5s" },
                  ].map((b,i)=>(
                    <div key={i} className="absolute z-20 float-badge" style={{...(b.r?{right:b.r}:{left:b.l}),...(b.t?{top:b.t}:{bottom:b.b}),animationDelay:b.d}}>
                      <span className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/55 backdrop-blur-md">{b.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MARQUEE ══════════════════════════════════════════════════════════ */}
      <div className="overflow-hidden border-y border-border/12 py-3">
        <div className="marquee-track flex gap-12 whitespace-nowrap text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/15">
          {[...Array(4)].map((_,i)=>["🎌 Anime","📚 Manga","🎵 J-Music","🎭 VTuber","🎨 Fanart","👘 Cosplay","🎮 Gaming","🌸 Culture","🌙 Soraku"].map(item=><span key={`${i}-${item}`}>{item}</span>))}
        </div>
      </div>

      {/* ══ COMMUNITY STATEMENT ═══════════════════════════════════════════════ */}
      <section className="relative px-4 py-20 sm:py-28 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent"/>
          <div className="absolute left-1/4 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl"/>
          <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-accent/4 blur-3xl"/>
        </div>
        <div className="mx-auto max-w-5xl">
          <div className="relative flex flex-col items-center text-center">
            <div className="pointer-events-none absolute inset-0 hidden lg:block">
              {[
                {text:"🎌 Anime",  l:"-1rem",   t:"15%",   cls:"community-tag",   d:"0s"  },
                {text:"🎨 Fanart", r:"-1rem",   t:"10%",   cls:"community-tag-r", d:"0.5s"},
                {text:"👘 Cosplay",l:"3%",      t:"55%",   cls:"community-tag",   d:"1.2s"},
                {text:"🎭 VTuber", r:"2%",      t:"50%",   cls:"community-tag-r", d:"0.8s"},
                {text:"🎮 Gaming", l:"-0.5rem", b:"15%",   cls:"community-tag",   d:"1.8s"},
                {text:"📚 Manga",  r:"1%",      b:"20%",   cls:"community-tag-r", d:"1.5s"},
              ].map((t,i)=>(
                <div key={i} className={cn("absolute",t.cls)} style={{...(t.l?{left:t.l}:{right:t.r}),...(t.t?{top:t.t}:{bottom:t.b}),animationDelay:t.d}}>
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-background/60 px-4 py-2 text-[12px] font-semibold text-foreground/40 backdrop-blur-sm shadow-sm">{t.text}</span>
                </div>
              ))}
            </div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-5 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/60"/>
              <span className="text-[11px] font-black tracking-[0.2em] text-primary/60 uppercase">Komunitas Soraku</span>
            </div>
            <div className="space-y-1 sm:space-y-2 mb-7">
              <p className="text-[clamp(1.1rem,3.5vw,2rem)] font-light text-muted-foreground/35 leading-tight tracking-wide">dari penggemar,</p>
              <h2 className="text-[clamp(3rem,10vw,7rem)] font-black tracking-tighter leading-[0.88]">
                <span className="text-foreground/90">untuk </span>
                <span className="text-shimmer">penggemar</span>
              </h2>
              <p className="text-[clamp(1.1rem,3.5vw,2rem)] font-light text-muted-foreground/35 leading-tight tracking-wide">— di seluruh Indonesia</p>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground/55 leading-relaxed max-w-lg mx-auto mb-10">
              Soraku bukan sekadar komunitas. Ini tempat kamu ketemu orang-orang yang <em className="not-italic font-semibold text-foreground/70">ngerti duniamu</em> — yang sama-sama suka anime, ngobrolin manga, dan nonton VTuber sampai pagi.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-10 lg:hidden">
              {["🎌 Anime","📚 Manga","🎨 Fanart","🎭 VTuber","👘 Cosplay","🎮 Gaming","🌸 Culture"].map((t,i)=>(
                <span key={i} className="inline-flex items-center rounded-full border border-border/35 bg-card/30 px-3.5 py-1.5 text-xs font-medium text-muted-foreground/60">{t}</span>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {[
                {n:"500+",label:"Member aktif",    emoji:"👥"},
                {n:"20+", label:"Event komunitas", emoji:"🗓️"},
                {n:"100+",label:"Karya & konten",  emoji:"🎨"},
                {n:"3+",  label:"Tahun bersama",   emoji:"🌸"},
              ].map((s,i)=>(
                <div key={i} className="flex flex-col items-center gap-1 min-w-[80px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{s.emoji}</span>
                    <span className="text-2xl sm:text-3xl font-black text-foreground tabular-nums">{s.n}</span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-muted-foreground/40">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FITUR KOMUNITAS — 6 grid ══════════════════════════════════════════ */}
      <section className="px-4 pb-20 sm:pb-24 border-t border-border/10 pt-16">
        <div className="mx-auto max-w-7xl">
          <SH eyebrow="Platform" title="Semua yang kamu butuhkan"/>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f,i)=>(
              <Link key={i} href={f.link.startsWith("http")?f.link:f.link} {...(f.link.startsWith("http")?{target:"_blank",rel:"noopener noreferrer"}:{})}
                className="group relative overflow-hidden rounded-2xl border border-border/12 bg-transparent p-5 transition-all duration-300 hover:border-border/25 hover:-translate-y-0.5">
                <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",f.color)}/>
                <div className="relative">
                  <div className="mb-4 text-3xl">{f.icon}</div>
                  <h3 className="text-sm font-black mb-1.5 group-hover:text-foreground transition-colors">{f.title}</h3>
                  <p className="text-xs text-muted-foreground/50 leading-relaxed">{f.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-[10px] text-muted-foreground/25 group-hover:text-primary/60 transition-colors font-semibold">
                    Jelajahi <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5"/>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ EVENTS ════════════════════════════════════════════════════════════ */}
      <section className="px-4 pb-16 sm:pb-20 border-t border-border/10 pt-16">
        <div className="mx-auto max-w-7xl">
          <SH eyebrow="Event" title="Event Terbaru" href="/events"/>
          {loading ? (
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
              {[1,2,3,4].map(i=><div key={i} className="animate-pulse rounded-2xl bg-muted/8 aspect-[3/4]"/>)}
            </div>
          ) : data.events.length===0 ? (
            <div className="py-16 text-center"><Calendar className="mx-auto h-8 w-8 text-muted-foreground/10 mb-3"/><p className="text-sm text-muted-foreground/25">Belum ada event</p></div>
          ) : (
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.events.map(e=>{
                const st=getStatusInfo(e.status,e.startdate);
                return <ContentCard key={e.id} href={`/events/${e.slug}`} cover={e.coverurl} title={e.title} meta={fmtDate(e.startdate)}
                  badge={<span className={cn("flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-black backdrop-blur-sm",st.cls)}><span className={cn("h-1.5 w-1.5 rounded-full",st.dot)}/>{st.label}</span>}/>;
              })}
            </div>
          )}
        </div>
      </section>

      {/* ══ BLOG ═════════════════════════════════════════════════════════════ */}
      <section className="px-4 pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl">
          <SH eyebrow="Komunitas" title="Artikel Terbaru" href="/blog"/>
          {loading ? (
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
              {[1,2,3,4].map(i=><div key={i} className="animate-pulse rounded-2xl bg-muted/8 aspect-[3/4]"/>)}
            </div>
          ) : data.blogs.length===0 ? (
            <div className="py-16 text-center"><BookOpen className="mx-auto h-8 w-8 text-muted-foreground/10 mb-3"/><p className="text-sm text-muted-foreground/25">Belum ada artikel</p></div>
          ) : (
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.blogs.map(b=><ContentCard key={b.id} href={`/blog/${b.slug}`} cover={b.coverurl} title={b.title} meta={fmtDate(b.publishedat)}/>)}
            </div>
          )}
        </div>
      </section>

      {/* ══ DISCORD EMBED ════════════════════════════════════════════════════ */}
      <section className="px-4 pb-16 sm:pb-20 border-t border-border/10 pt-16">
        <div className="mx-auto max-w-5xl">
          <SH eyebrow="Real-time" title="Server Discord"/>
          <DiscordEmbed discord={discord}/>
        </div>
      </section>

      {/* ══ MONETISASI — Dukung Soraku ════════════════════════════════════════ */}
      <section className="relative px-4 py-20 sm:py-24 overflow-hidden border-t border-border/10">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/2 to-transparent"/>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[600px] w-[400px] rounded-full bg-primary/4 blur-3xl"/>
          <div className="absolute right-0 top-1/3 h-[400px] w-[300px] rounded-full bg-amber-500/3 blur-3xl"/>
        </div>
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5">
              <Heart className="h-3.5 w-3.5 text-amber-400"/>
              <span className="text-[10px] font-black tracking-[0.2em] text-amber-400/70 uppercase">Dukung Soraku</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl mb-3">Jadilah Bagian yang Lebih Besar</h2>
            <p className="text-sm text-muted-foreground/50 max-w-md mx-auto leading-relaxed">
              Soraku tetap gratis selamanya. Tapi dengan dukunganmu, kami bisa bikin komunitas ini makin seru.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {TIERS.map((t)=>(
              <div key={t.id}
                className={cn(
                  "relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1",
                  t.border,
                  t.highlight && "tier-vvip-glow",
                )}>
                <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br",t.color)}/>
                {t.highlight && (
                  <div className="absolute top-3 right-3">
                    <span className="rounded-full bg-primary/15 border border-primary/25 px-2.5 py-0.5 text-[9px] font-black text-primary uppercase tracking-wider">Populer</span>
                  </div>
                )}
                <div className="relative">
                  <div className="mb-4">
                    <span className="text-2xl">{t.emoji}</span>
                  </div>
                  <h3 className="text-lg font-black mb-1">{t.name}</h3>
                  <p className="text-xs text-muted-foreground/50 mb-4 leading-relaxed">{t.desc}</p>

                  <div className="mb-5">
                    <span className={cn("text-2xl font-black",t.accent)}>{t.price}</span>
                    {t.period && <span className="text-xs text-muted-foreground/40 ml-1">{t.period}</span>}
                  </div>

                  <ul className="space-y-2 mb-6">
                    {t.perks.map((p,i)=>(
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground/65">
                        <Check className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-emerald-400/70"/>
                        {p}
                      </li>
                    ))}
                  </ul>

                  <Link href={t.href}
                    className={cn(
                      "flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5",
                      t.highlight
                        ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90"
                        : `border ${t.border} ${t.accent} hover:bg-white/5`
                    )}>
                    {t.cta} <ArrowRight className="h-3.5 w-3.5"/>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-[11px] text-muted-foreground/30">
            Seluruh hasil dukungan digunakan untuk keberlangsungan platform dan event komunitas.
            <Link href="/donate/leaderboard" className="ml-1 text-primary/50 hover:text-primary transition-colors">Lihat Top Supporter →</Link>
          </p>
        </div>
      </section>

      {/* ══ SOSIAL MEDIA — dual marquee ══════════════════════════════════════ */}
      <section className="py-16 sm:py-20 border-t border-border/10">
        <div className="mx-auto max-w-7xl px-4 mb-10">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-primary/35 mb-1.5">Ikuti Kami</p>
              <h2 className="text-2xl font-black tracking-tight">Sosial Media</h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-border/25 to-transparent"/>
          </div>
        </div>
        <div className="relative overflow-hidden py-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10"/>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10"/>
          <div className="marquee-track mb-2 flex gap-4 whitespace-nowrap">
            {[...Array(4)].map((_,i)=>SOCIAL_LINKS.map(({slug,name,href,Icon,color,bg})=>(
              <a key={`r1-${i}-${slug}`} href={href} target="_blank" rel="noopener noreferrer"
                className={cn("group inline-flex items-center gap-2.5 rounded-full px-4 py-2 transition-all",bg)}>
                <Icon className={cn("h-4 w-4 text-muted-foreground/22 transition-colors",`group-hover:${color}`)}/>
                <span className="text-sm font-semibold text-muted-foreground/30 group-hover:text-foreground/65 transition-colors">{name}</span>
              </a>
            )))}
          </div>
          <div className="marquee-track-reverse flex gap-4 whitespace-nowrap">
            {[...Array(4)].map((_,i)=>[...SOCIAL_LINKS].reverse().map(({slug,name,href,Icon,color,bg})=>(
              <a key={`r2-${i}-${slug}`} href={href} target="_blank" rel="noopener noreferrer"
                className={cn("group inline-flex items-center gap-2.5 rounded-full px-4 py-2 transition-all",bg)}>
                <Icon className={cn("h-4 w-4 text-muted-foreground/18 transition-colors",`group-hover:${color}`)}/>
                <span className="text-sm font-semibold text-muted-foreground/25 group-hover:text-foreground/65 transition-colors">{name}</span>
              </a>
            )))}
          </div>
        </div>
      </section>

      {/* ══ PARTNERSHIP ═══════════════════════════════════════════════════════ */}
      {data.partnerships.length>0&&(
        <section className="px-4 pb-16 sm:pb-20 border-t border-border/10 pt-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/20 mb-2">Kolaborasi</p>
              <h2 className="text-2xl font-black tracking-tight">Sponsor &amp; Partner</h2>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14">
              {data.partnerships.map(p=>(
                <a key={p.id} href={p.website??"#"} target={p.website?"_blank":undefined} rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-2 opacity-35 hover:opacity-85 transition-all hover:-translate-y-0.5">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-muted/10 border border-border/15 group-hover:border-primary/15 transition-colors">
                    {p.logourl?<Image src={p.logourl} alt={p.name} width={48} height={48} className="h-full w-full object-contain"/>:<Handshake className="h-5 w-5 text-muted-foreground/15"/>}
                  </div>
                  <p className="text-[10px] font-bold text-foreground/35 group-hover:text-primary transition-colors">{p.name}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ JOIN CTA — hanya jika belum login ════════════════════════════════ */}
      {!isLoggedIn&&user!=="loading"&&(
        <section className="relative px-4 pb-28 pt-16 overflow-hidden border-t border-border/10">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent"/>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/4 blur-3xl"/>
          </div>
          <div className="mx-auto max-w-xl text-center">
            <div className="mb-5 text-4xl">🌸</div>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              Jadilah bagian dari <span className="text-primary">Soraku</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground/50 max-w-sm mx-auto">
              Gratis selamanya. Komunitas yang hangat, supportif, dan penuh semangat untuk semua pecinta anime di Indonesia.
            </p>
            <div className="my-7 flex items-center gap-4 max-w-xs mx-auto">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border/18"/>
              <span className="text-xs text-muted-foreground/18 font-semibold">bergabung sekarang</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border/18"/>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-primary/18 transition-all hover:-translate-y-0.5">
                Daftar Gratis <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5"/>
              </Link>
              <Link href="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-border/20 px-7 py-3.5 text-sm font-semibold text-muted-foreground/45 hover:border-primary/15 hover:text-foreground/65 transition-all">
                Tentang Soraku
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
