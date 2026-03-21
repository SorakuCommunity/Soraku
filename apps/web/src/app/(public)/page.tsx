"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import {
  ArrowRight, Users, Wifi, Calendar, BookOpen,
  Handshake, Eye, Heart, ChevronRight, Hash,
  MessageSquare, Circle, Volume2, Headphones,
} from "lucide-react";
import {
  DiscordIcon, InstagramIcon, FacebookIcon, XIcon,
  TikTokIcon, YouTubeIcon, BlueSkyIcon,
} from "@/components/icons/custom-icons";
import { cn } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

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

// Simulasi channels Discord Soraku
const DISCORD_CHANNELS = [
  { id:"1", name:"📢・pengumuman",   type:"text",  active:true  },
  { id:"2", name:"💬・umum",         type:"text",  active:true  },
  { id:"3", name:"🎌・anime-manga",  type:"text",  active:true  },
  { id:"4", name:"🎨・fanart",       type:"text",  active:false },
  { id:"5", name:"🎮・gaming",       type:"text",  active:false },
  { id:"6", name:"🎵・musik",        type:"voice", active:true  },
  { id:"7", name:"🌸・ngobrol",      type:"voice", active:false },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface Author { username:string|null; displayname:string|null; avatarurl:string|null; }
interface EventItem { id:string; slug:string; title:string; description:string|null; coverurl:string|null; startdate:string; status:string; }
interface BlogItem  { id:string; slug:string; title:string; excerpt:string|null; coverurl:string|null; publishedat:string; viewcount?:number; likecount?:number; author:Author|null; }
interface Partnership { id:string; name:string; logourl:string|null; website:string|null; category:string|null; }
interface DiscordMember { username:string; avatar:string|null; status:"online"|"idle"|"dnd"|"offline"; activity?:string; }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso:string) {
  return new Date(iso).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"});
}

function getStatusInfo(status:string,startdate:string) {
  const now=Date.now(),start=new Date(startdate).getTime();
  if(start>now) return {label:"Upcoming",cls:"text-primary/80 bg-primary/8 border-primary/15",dot:"bg-primary animate-pulse"};
  if(status==="selesai") return {label:"Selesai",cls:"text-muted-foreground/40 bg-muted/10 border-border/15",dot:"bg-muted-foreground/20"};
  return {label:"Live",cls:"text-emerald-400 bg-emerald-500/8 border-emerald-500/15",dot:"bg-emerald-400 animate-pulse"};
}

function useDiscord() {
  const [data,setData]=useState<{presence:number|null;name:string;loading:boolean;members:DiscordMember[]}>({
    presence:null,name:"Soraku Community",loading:true,members:[],
  });
  useEffect(()=>{
    fetch(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/widget.json`)
      .then(r=>r.ok?r.json():null)
      .then(d=>{
        const members:DiscordMember[]=(d?.members??[]).slice(0,8).map((m:any)=>({
          username:m.username,
          avatar:m.avatar_url??null,
          status:m.status??"online",
          activity:m.game?.name??undefined,
        }));
        setData({presence:d?.presence_count??null,name:d?.name??"Soraku Community",loading:false,members});
      })
      .catch(()=>setData(p=>({...p,loading:false})));
  },[]);
  return data;
}

// ─── Event Card (seamless overlay) ───────────────────────────────────────────

function EventCard({event}:{event:EventItem}) {
  const st=getStatusInfo(event.status,event.startdate);
  return (
    <Link href={`/events/${event.slug}`}
      className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/25">
      <div className="relative aspect-[4/5] sm:aspect-[16/10] w-full overflow-hidden bg-muted/10">
        {event.coverurl
          ? <Image src={event.coverurl} alt={event.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
          : <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/8"><Calendar className="h-8 w-8 text-muted-foreground/15"/></div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"/>
        <span className={cn("absolute top-3 right-3 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-black backdrop-blur-md",st.cls)}>
          <span className={cn("h-1.5 w-1.5 rounded-full",st.dot)}/>{st.label}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="text-[10px] text-white/40 mb-1">{fmtDate(event.startdate)}</p>
        <h3 className="line-clamp-2 text-sm font-black text-white/90 leading-snug group-hover:text-primary transition-colors">{event.title}</h3>
      </div>
    </Link>
  );
}

// ─── Blog Card ────────────────────────────────────────────────────────────────

function BlogCard({blog}:{blog:BlogItem}) {
  return (
    <Link href={`/blog/${blog.slug}`}
      className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/25">
      <div className="relative aspect-[4/5] sm:aspect-[16/10] w-full overflow-hidden bg-muted/10">
        {blog.coverurl
          ? <Image src={blog.coverurl} alt={blog.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
          : <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/8 to-accent/6"><BookOpen className="h-8 w-8 text-muted-foreground/15"/></div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"/>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="mb-1 flex items-center gap-2 text-[10px] text-white/35">
          <span>{fmtDate(blog.publishedat)}</span>
          {blog.viewcount?<span className="flex items-center gap-1"><Eye className="h-2.5 w-2.5"/>{blog.viewcount}</span>:null}
          {blog.likecount?<span className="flex items-center gap-1"><Heart className="h-2.5 w-2.5"/>{blog.likecount}</span>:null}
        </div>
        <h3 className="line-clamp-2 text-sm font-black text-white/90 leading-snug group-hover:text-primary transition-colors">{blog.title}</h3>
      </div>
    </Link>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCards() {
  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[1,2,3,4].map(i=>(
        <div key={i} className="animate-pulse rounded-2xl bg-muted/8 aspect-[4/5] sm:aspect-[16/10]"/>
      ))}
    </div>
  );
}

// ─── Discord Embed (Soraku style) ─────────────────────────────────────────────

function DiscordEmbed({discord}:{discord:ReturnType<typeof useDiscord>}) {
  const [activeChannel,setActiveChannel]=useState("2");

  const statusColor={
    online:"bg-emerald-500",idle:"bg-amber-400",dnd:"bg-red-500",offline:"bg-muted-foreground/30",
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-indigo-500/15 bg-[#1e1f22]/80 backdrop-blur-sm shadow-2xl shadow-black/30">
      {/* Server header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/6 bg-[#1e1f22]">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border-2 border-indigo-500/30">
            <Image src="/logo.png" alt="Soraku" fill className="object-cover"/>
          </div>
          <div>
            <p className="text-sm font-black text-white/90 leading-none">{discord.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"/>
              <span className="text-[10px] text-white/40">
                {discord.loading?"memuat...":discord.presence!=null?`${discord.presence.toLocaleString("id-ID")} online`:"online"}
              </span>
            </div>
          </div>
        </div>
        <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-xl bg-indigo-500 px-3 py-1.5 text-[11px] font-bold text-white transition-all hover:bg-indigo-400 hover:-translate-y-0.5">
          <DiscordIcon className="h-3 w-3"/> Gabung
        </a>
      </div>

      <div className="flex h-[340px] sm:h-[380px]">
        {/* Sidebar channels */}
        <div className="w-[180px] flex-shrink-0 bg-[#2b2d31]/80 flex flex-col py-2 overflow-y-auto">
          <p className="px-3 pb-1.5 text-[9px] font-black uppercase tracking-widest text-white/25">Channels</p>
          {DISCORD_CHANNELS.map(ch=>(
            <button key={ch.id} onClick={()=>setActiveChannel(ch.id)}
              className={cn(
                "flex items-center gap-2 px-2 mx-1 py-1.5 rounded-lg text-left text-[12px] transition-colors",
                activeChannel===ch.id ? "bg-white/10 text-white/90" : "text-white/30 hover:text-white/60 hover:bg-white/5"
              )}>
              {ch.type==="voice"
                ? <Volume2 className="h-3.5 w-3.5 flex-shrink-0 opacity-60"/>
                : <Hash className="h-3.5 w-3.5 flex-shrink-0 opacity-60"/>
              }
              <span className="truncate font-medium">{ch.name.slice(2)}</span>
              {ch.active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0"/>}
            </button>
          ))}

          {/* Members online */}
          <p className="px-3 pt-3 pb-1.5 text-[9px] font-black uppercase tracking-widest text-white/25">Online</p>
          {discord.loading ? (
            <div className="space-y-1 px-2">
              {[1,2,3].map(i=><div key={i} className="flex items-center gap-2 py-1 animate-pulse"><div className="h-6 w-6 rounded-full bg-white/10"/><div className="h-2 w-16 rounded bg-white/10"/></div>)}
            </div>
          ) : discord.members.length>0 ? (
            <div className="space-y-0.5 px-1">
              {discord.members.map((m,i)=>(
                <div key={i} className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="relative flex-shrink-0">
                    {m.avatar
                      ? <div className="h-6 w-6 overflow-hidden rounded-full"><Image src={m.avatar} alt="" width={24} height={24} className="object-cover"/></div>
                      : <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/40 text-[9px] font-black text-white/70">{m.username.charAt(0).toUpperCase()}</div>
                    }
                    <span className={cn("absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#2b2d31]",statusColor[m.status]??statusColor.online)}/>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-white/60 truncate">{m.username}</p>
                    {m.activity && <p className="text-[9px] text-white/25 truncate">{m.activity}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-3 text-[10px] text-white/20">Tidak ada data</div>
          )}
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-[#313338]/60 min-w-0">
          {/* Channel header */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/6">
            <Hash className="h-4 w-4 text-white/30 flex-shrink-0"/>
            <span className="text-sm font-bold text-white/70 truncate">
              {DISCORD_CHANNELS.find(c=>c.id===activeChannel)?.name.slice(2)??"umum"}
            </span>
          </div>

          {/* Fake messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {[
              {user:"Sora",color:"text-indigo-300",msg:"Selamat datang di Soraku Community! 🌸",time:"hari ini 10:00"},
              {user:"Kaizo",color:"text-emerald-300",msg:"Halo semuanya~ ada yang nonton anime baru musim ini?",time:"hari ini 10:02"},
              {user:"MemberBaru",color:"text-violet-300",msg:"Hai! Baru gabung nih, senang bisa kenal kalian ✨",time:"hari ini 10:05"},
              {user:"AniWatcher",color:"text-amber-300",msg:"Frieren season 2 kapan ya... 😭",time:"hari ini 10:08"},
            ].map((m,i)=>(
              <div key={i} className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/25 text-[10px] font-black text-white/60 mt-0.5">
                  {m.user.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className={cn("text-[12px] font-bold",m.color)}>{m.user}</span>
                    <span className="text-[9px] text-white/20">{m.time}</span>
                  </div>
                  <p className="text-[12px] text-white/60 leading-relaxed">{m.msg}</p>
                </div>
              </div>
            ))}

            {/* "typing" indicator */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex gap-0.5">
                {[0,150,300].map(d=>(
                  <span key={d} className="h-1.5 w-1.5 rounded-full bg-white/25 animate-bounce" style={{animationDelay:`${d}ms`}}/>
                ))}
              </div>
              <span className="text-[10px] text-white/25">beberapa orang sedang mengetik...</span>
            </div>
          </div>

          {/* Input bar */}
          <div className="px-4 pb-4 pt-2">
            <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 w-full rounded-xl bg-[#1e1f22] px-4 py-2.5 text-[12px] text-white/25 hover:text-white/40 transition-colors group">
              <MessageSquare className="h-4 w-4 flex-shrink-0"/>
              <span className="flex-1">Kirim pesan di Discord...</span>
              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity"/>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/6 bg-[#1e1f22]/80">
        <div className="flex items-center gap-4 text-[10px] text-white/30">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/>
            {discord.loading?"...":discord.presence?`${discord.presence.toLocaleString("id-ID")} online`:"—"}
          </span>
          <span className="flex items-center gap-1.5">
            <Circle className="h-2.5 w-2.5 text-muted-foreground/25"/>
            500+ total member
          </span>
        </div>
        <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
          className="text-[10px] text-indigo-400/70 hover:text-indigo-300 transition-colors font-semibold">
          Buka Discord →
        </a>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

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
      {/* ══════════════════════════════════════════════════════════
          HERO — mascot full, menyatu, mobile-first
          ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">

        {/* ── MOBILE: mascot full-bleed di atas, teks di bawah ── */}
        <div className="lg:hidden">
          {/* Mascot — full width, no card, no border */}
          <div className="relative w-full h-[100svh] min-h-[560px]">
            {/* Atmosphere glow */}
            <div className="absolute inset-0 -z-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[140px]"/>
              <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-accent/8 blur-[100px]"/>
            </div>

            {/* Gambar mascot */}
            <Image src="/logo-full.png" alt="Soraku" fill className="object-cover object-top -z-0" priority/>

            {/* Fade atas dari navbar */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent z-10"/>
            {/* Fade bawah ke konten */}
            <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-background via-background/85 to-transparent z-10"/>
            {/* Fade sides */}
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background/60 to-transparent z-10"/>
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background/60 to-transparent z-10"/>

            {/* Float badges — menyatu */}
            <div className="absolute right-4 top-[22%] z-20 float-badge">
              <span className="rounded-full border border-white/12 bg-background/40 px-3 py-1.5 text-[11px] font-semibold text-white/60 backdrop-blur-md shadow-sm">
                🌸 Komunitas
              </span>
            </div>
            <div className="absolute left-4 top-[38%] z-20 float-badge" style={{animationDelay:"1s"}}>
              <span className="rounded-full border border-white/12 bg-background/40 px-3 py-1.5 text-[11px] font-semibold text-white/60 backdrop-blur-md shadow-sm">
                🎌 Anime &amp; Manga
              </span>
            </div>
            <div className="absolute right-4 top-[58%] z-20 float-badge" style={{animationDelay:"2s"}}>
              <span className="rounded-full border border-white/12 bg-background/40 px-3 py-1.5 text-[11px] font-semibold text-white/60 backdrop-blur-md shadow-sm">
                ✨ Non-profit
              </span>
            </div>
            <div className="absolute left-4 top-[70%] z-20 float-badge" style={{animationDelay:"0.5s"}}>
              <span className="rounded-full border border-white/12 bg-background/40 px-3 py-1.5 text-[11px] font-semibold text-white/60 backdrop-blur-md shadow-sm">
                🇮🇩 Indonesia
              </span>
            </div>

            {/* Live + member count di atas overlay bawah */}
            <div className="absolute bottom-52 inset-x-0 z-20 px-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"/>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"/>
                </span>
                <span className="text-[11px] font-bold text-white/50">
                  {discord.loading?"—":`${discord.presence?.toLocaleString("id-ID")??"500"}+ online`}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"/> Live
              </div>
            </div>
          </div>

          {/* Teks hero — di bawah mascot, masih bagian hero section */}
          <div className="relative px-5 pb-14 -mt-16 z-10">
            <h1 className="text-[clamp(3.2rem,18vw,5.5rem)] font-black leading-[0.88] tracking-tighter text-foreground">
              Soraku
            </h1>
            <p className="text-[clamp(0.9rem,4vw,1.2rem)] font-light text-muted-foreground/50 tracking-wide mt-1 pl-0.5">
              Community · 空 · Est. 2023
            </p>
            <div className="my-5 h-px w-16 bg-gradient-to-r from-primary/40 to-transparent"/>
            <p className="text-sm leading-relaxed text-muted-foreground/70 max-w-xs">
              <span className="font-bold text-foreground/90">Soraku</span> — dari <em className="not-italic font-medium text-foreground/70">"Sora"</em> (langit) dan <em className="not-italic font-medium text-foreground/70">"ku"</em> (milikku).
              Komunitas non-profit untuk semua pecinta anime & budaya Jepang di Indonesia.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link href="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all">
                Bergabung <ArrowRight className="h-3.5 w-3.5"/>
              </Link>
              <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-indigo-500/25 bg-indigo-500/8 px-6 py-3 text-sm font-semibold text-indigo-300/80 hover:-translate-y-0.5 transition-all">
                <DiscordIcon className="h-4 w-4"/> Discord
              </a>
            </div>
          </div>
        </div>

        {/* ── DESKTOP: layout grid dua kolom ── */}
        <div className="hidden lg:flex items-center min-h-[96vh] px-6 py-16">
          <div className="mx-auto w-full max-w-7xl">
            <div className="grid gap-20 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] items-center">

              {/* Left */}
              <div className="max-w-2xl">
                <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-primary/12 bg-primary/5 px-4 py-1.5 backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"/>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"/>
                  </span>
                  <span className="text-[10px] font-black tracking-[0.18em] text-primary/60 uppercase">
                    {discord.loading?"—":`${discord.presence?.toLocaleString("id-ID")??"500"}+ online`} · Soraku Community
                  </span>
                </div>

                <div className="space-y-1">
                  <h1 className="text-[clamp(4rem,10vw,8rem)] font-black leading-[0.88] tracking-tighter text-foreground">
                    Soraku
                  </h1>
                  <p className="text-[clamp(1rem,2.2vw,1.6rem)] font-light text-muted-foreground/45 tracking-wide pl-0.5">
                    Community · 空 · Est. 2023
                  </p>
                </div>

                <div className="my-8 h-px w-20 bg-gradient-to-r from-primary/35 to-transparent"/>

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
                    Gratis. Terbuka. Hangat. <span className="text-primary/65 font-semibold">Ini rumah digitalmu.</span>
                  </p>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <Link href="/register"
                    className="group relative overflow-hidden rounded-2xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5">
                    <span className="relative z-10 flex items-center gap-2">
                      Bergabung Gratis <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"/>
                    </span>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 transition-transform duration-500 group-hover:translate-x-full"/>
                  </Link>
                  <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-2xl border border-indigo-500/20 bg-indigo-500/7 px-8 py-3.5 text-sm font-semibold text-indigo-300/80 transition-all hover:-translate-y-0.5 hover:border-indigo-400/35">
                    <DiscordIcon className="h-4 w-4"/> Gabung Discord
                  </a>
                </div>

                <div className="mt-12 flex flex-wrap items-center gap-7">
                  {[
                    {val:discord.loading?"—":`${discord.presence?.toLocaleString("id-ID")??"500"}+`,label:"online",live:true},
                    {val:"20+",label:"event"},
                    {val:"100+",label:"konten"},
                  ].map((s,i)=>(
                    <div key={i} className="flex items-center gap-2">
                      {s.live&&(
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50"/>
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"/>
                        </span>
                      )}
                      <span className="text-sm font-black text-foreground">{s.val}</span>
                      <span className="text-xs text-muted-foreground/35">{s.label}</span>
                      {i<2&&<span className="ml-3 h-3 w-px bg-border/25"/>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — mascot seamless */}
              <div className="flex justify-end">
                <div className="relative w-[340px] xl:w-[400px]">
                  <div className="absolute inset-0 -m-12 rounded-full bg-primary/8 blur-3xl pointer-events-none"/>
                  <div className="relative h-[520px] xl:h-[580px] w-full">
                    <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background via-background/50 to-transparent z-10 pointer-events-none"/>
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/70 to-transparent z-10 pointer-events-none"/>
                    <div className="absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-background/70 to-transparent z-10 pointer-events-none"/>
                    <div className="absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-background/70 to-transparent z-10 pointer-events-none"/>
                    <Image src="/logo-full.png" alt="Soraku mascot" fill className="object-cover object-center" priority/>
                    <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-5">
                      <div className="flex items-end justify-between">
                        <div><p className="text-base font-black text-white/80 drop-shadow-md">Soraku</p><p className="text-[10px] text-white/35">Community · 空</p></div>
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"/> Live
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -right-10 top-16 float-badge"><span className="rounded-full border border-white/10 bg-background/20 px-3 py-1.5 text-[11px] font-semibold text-white/60 backdrop-blur-md">🌸 Komunitas</span></div>
                  <div className="absolute -left-14 top-32 float-badge" style={{animationDelay:"1s"}}><span className="rounded-full border border-white/10 bg-background/20 px-3 py-1.5 text-[11px] font-semibold text-white/60 backdrop-blur-md">🎌 Anime &amp; Manga</span></div>
                  <div className="absolute -right-8 bottom-36 float-badge" style={{animationDelay:"2s"}}><span className="rounded-full border border-white/10 bg-background/20 px-3 py-1.5 text-[11px] font-semibold text-white/60 backdrop-blur-md">✨ Non-profit</span></div>
                  <div className="absolute -left-10 bottom-24 float-badge" style={{animationDelay:"0.5s"}}><span className="rounded-full border border-white/10 bg-background/20 px-3 py-1.5 text-[11px] font-semibold text-white/60 backdrop-blur-md">🇮🇩 Indonesia</span></div>
                </div>
              </div>

            </div>
          </div>
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

      {/* ══════════════════════════════════════════════════════════
          DISCORD EMBED (Soraku style, real-time)
          ══════════════════════════════════════════════════════════ */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center gap-4">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-primary/35 mb-1">Real-time</p>
              <h2 className="text-xl font-black sm:text-2xl tracking-tight">Server Discord</h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-border/30 to-transparent"/>
          </div>
          <DiscordEmbed discord={discord}/>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          EVENTS
          ══════════════════════════════════════════════════════════ */}
      <section className="px-4 pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-primary/35 mb-1">Terbaru</p>
              <h2 className="text-xl font-black sm:text-2xl tracking-tight">Event</h2>
            </div>
            <Link href="/events" className="group flex items-center gap-1 text-xs font-semibold text-muted-foreground/30 hover:text-primary transition-colors">
              Semua <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5"/>
            </Link>
          </div>
          {loading ? <SkeletonCards/> : data.events.length===0 ? (
            <div className="py-16 text-center"><Calendar className="mx-auto h-8 w-8 text-muted-foreground/10 mb-3"/><p className="text-sm text-muted-foreground/25">Belum ada event</p></div>
          ) : (
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.events.map(e=><EventCard key={e.id} event={e}/>)}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          BLOG
          ══════════════════════════════════════════════════════════ */}
      <section className="px-4 pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-primary/35 mb-1">Komunitas</p>
              <h2 className="text-xl font-black sm:text-2xl tracking-tight">Artikel</h2>
            </div>
            <Link href="/blog" className="group flex items-center gap-1 text-xs font-semibold text-muted-foreground/30 hover:text-primary transition-colors">
              Semua <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5"/>
            </Link>
          </div>
          {loading ? <SkeletonCards/> : data.blogs.length===0 ? (
            <div className="py-16 text-center"><BookOpen className="mx-auto h-8 w-8 text-muted-foreground/10 mb-3"/><p className="text-sm text-muted-foreground/25">Belum ada artikel</p></div>
          ) : (
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.blogs.map(b=><BlogCard key={b.id} blog={b}/>)}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SOSIAL MEDIA — marquee dua arah
          ══════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 border-t border-border/12">
        <div className="mx-auto max-w-7xl px-4 mb-10">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-primary/35 mb-1">Ikuti Kami</p>
              <h2 className="text-xl font-black sm:text-2xl tracking-tight">Sosial Media</h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-border/30 to-transparent"/>
          </div>
        </div>
        <div className="relative overflow-hidden py-2">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10"/>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10"/>
          <div className="marquee-track mb-2 flex gap-4 whitespace-nowrap">
            {[...Array(4)].map((_,i)=>
              SOCIAL_LINKS.map(({slug,name,href,Icon,color,bg})=>(
                <a key={`r1-${i}-${slug}`} href={href} target="_blank" rel="noopener noreferrer"
                  className={cn("group inline-flex items-center gap-2.5 rounded-full px-4 py-2 transition-all",bg)}>
                  <Icon className={cn("h-4 w-4 text-muted-foreground/25 transition-colors",`group-hover:${color}`)}/>
                  <span className="text-sm font-semibold text-muted-foreground/35 group-hover:text-foreground/70 transition-colors">{name}</span>
                </a>
              ))
            )}
          </div>
          <div className="marquee-track-reverse flex gap-4 whitespace-nowrap">
            {[...Array(4)].map((_,i)=>
              [...SOCIAL_LINKS].reverse().map(({slug,name,href,Icon,color,bg})=>(
                <a key={`r2-${i}-${slug}`} href={href} target="_blank" rel="noopener noreferrer"
                  className={cn("group inline-flex items-center gap-2.5 rounded-full px-4 py-2 transition-all",bg)}>
                  <Icon className={cn("h-4 w-4 text-muted-foreground/20 transition-colors",`group-hover:${color}`)}/>
                  <span className="text-sm font-semibold text-muted-foreground/30 group-hover:text-foreground/70 transition-colors">{name}</span>
                </a>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ══ PARTNERSHIP ══ */}
      {data.partnerships.length>0&&(
        <section className="px-4 pb-16 sm:pb-20 border-t border-border/12 pt-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/20 mb-2">Kolaborasi</p>
              <h2 className="text-xl font-black sm:text-2xl tracking-tight">Partner &amp; Sponsor</h2>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
              {data.partnerships.map(p=>(
                <a key={p.id} href={p.website??"#"} target={p.website?"_blank":undefined} rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-2 opacity-40 hover:opacity-90 transition-all hover:-translate-y-0.5">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-muted/10 border border-border/15 group-hover:border-primary/15 transition-colors">
                    {p.logourl?<Image src={p.logourl} alt={p.name} width={48} height={48} className="h-full w-full object-contain"/>:<Handshake className="h-5 w-5 text-muted-foreground/15"/>}
                  </div>
                  <p className="text-[10px] font-bold text-foreground/40 group-hover:text-primary transition-colors">{p.name}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ JOIN CTA — hanya jika belum login ══ */}
      {!isLoggedIn&&user!=="loading"&&(
        <section className="relative px-4 pb-24 pt-16 overflow-hidden border-t border-border/12">
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
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border/20"/>
              <span className="text-xs text-muted-foreground/18 font-semibold">bergabung sekarang</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border/20"/>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-primary/18 transition-all hover:-translate-y-0.5">
                Daftar Gratis <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5"/>
              </Link>
              <Link href="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-border/20 px-7 py-3.5 text-sm font-semibold text-muted-foreground/50 transition-all hover:border-primary/15 hover:text-foreground/70">
                Tentang Soraku
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
