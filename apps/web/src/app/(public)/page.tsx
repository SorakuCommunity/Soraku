"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import {
  ArrowRight, Calendar, BookOpen, ChevronRight,
  Hash, MessageSquare, Volume2, Circle, Eye, Heart,
  MessageCircle, Clock, Users, Handshake, Sparkles,
  Zap, Target, TrendingUp, MapPin, Ticket, User,
  ImageIcon, Tv2, Trophy, Gift, Star, Share2,
} from "lucide-react";
import {
  DiscordIcon, InstagramIcon, FacebookIcon, XIcon,
  TikTokIcon, YouTubeIcon, BlueSkyIcon,
} from "@/components/icons/custom-icons";
import { cn } from "@/lib/utils";

// ═════════════════════════════════════════════════════════════════════════════
// CONSTANTS - New Color Palette
// ═════════════════════════════════════════════════════════════════════════════

const SOCIAL_LINKS = [
  { slug:"discord",   name:"Discord",   href:"https://discord.gg/qm3XJvRa6B",             Icon:DiscordIcon   },
  { slug:"instagram", name:"Instagram", href:"https://www.instagram.com/soraku.moe",        Icon:InstagramIcon },
  { slug:"facebook",  name:"Facebook",  href:"https://www.facebook.com/share/1HQs9ZZeCw/",  Icon:FacebookIcon  },
  { slug:"x",         name:"X",         href:"https://twitter.com/@AppSoraa",              Icon:XIcon         },
  { slug:"tiktok",    name:"TikTok",    href:"https://www.tiktok.com/@soraku.id?_r=1&_t=ZS-93VKUIkzmTM", Icon:TikTokIcon },
  { slug:"youtube",   name:"YouTube",   href:"https://youtube.com/@chsoraku?si=kcOs8wWCi7TwwC3P", Icon:YouTubeIcon },
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

// New Color Palette
const COLORS = {
  primary: "#4FA3D1",    // Cyan biru mata
  dark: "#1C1E22",       // Dark base
  secondary: "#6E8FA6",  // Secondary
  light: "#D9DDE3",      // Light base
  accent: "#E8C2A8",     // Accent
};

// Features untuk section fitur
const FEATURES = [
  {
    icon: BookOpen,
    title: "Blog & Artikel",
    description: "Baca dan tulis artikel tentang anime, manga, gaming, dan budaya Jepang bersama komunitas.",
    color: COLORS.primary,
  },
  {
    icon: Calendar,
    title: "Event & Tournament",
    description: "Ikuti berbagai event seru, turnamen gaming, nonton bareng, dan aktivitas komunitas lainnya.",
    color: "#6EE7B7",
  },
  {
    icon: ImageIcon,
    title: "Galeri Karya",
    description: "Bagikan karya fanart, cosplay, dan kreasi kamu. Dapatkan apresiasi dari komunitas.",
    color: "#F472B6",
  },
  {
    icon: Tv2,
    title: "VTuber Komunitas",
    description: "Dukung VTuber lokal Indonesia. Streaming, fanbase, dan konten kreator virtual.",
    color: "#A78BFA",
  },
  {
    icon: Users,
    title: "Komunitas Aktif",
    description: "Gabung dengan ribuan member aktif di Discord. Chat 24/7, temukan teman sefrekuensi.",
    color: COLORS.accent,
  },
  {
    icon: Trophy,
    title: "Sistem Prestasi",
    description: "Raih badge dan level dengan berkontribusi. Tunjukkan dedikasi kamu di komunitas.",
    color: "#FBBF24",
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// TYPES
// ═════════════════════════════════════════════════════════════════════════════

interface EventItem {
  id:string; slug:string; title:string; description:string|null;
  coverurl:string|null; startdate:string; enddate:string|null;
  isonline:boolean; tags:string[]; status:string; location?:string|null;
  price?:number|null;
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

// ═════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═════════════════════════════════════════════════════════════════════════════

function fmtDate(iso:string) {
  return new Date(iso).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"});
}

function getStatusBadge(status:string) {
  switch(status) {
    case "live":     return { label:"Live",     cls:"bg-red-500/15 border-red-500/30 text-red-400",     dot:"bg-red-400 animate-pulse"     };
    case "upcoming": return { label:"Upcoming", cls:"bg-[#4FA3D1]/15 border-[#4FA3D1]/30 text-[#4FA3D1]",     dot:"bg-[#4FA3D1] animate-pulse"     };
    default:         return { label:"Selesai",  cls:"bg-white/5 border-white/10 text-white/30",         dot:"bg-white/20"                  };
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═════════════════════════════════════════════════════════════════════════════

function SectionHeader({eyebrow,title,href,children}:{eyebrow:string;title:string;href?:string;children?:React.ReactNode}){
  return (
    <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-0">
      <div>
        <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-[#6E8FA6] mb-1.5">{eyebrow}</p>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#D9DDE3]">{title}</h2>
      </div>
      <div className="flex items-center gap-3">
        {children}
        {href&&(
          <Link href={href} className="group inline-flex items-center gap-1.5 text-xs font-bold text-[#4FA3D1] hover:text-[#E8C2A8] transition-colors">
            Lihat semua <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform"/>
          </Link>
        )}
      </div>
    </div>
  );
}

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

function EventCard({event}:{event:EventItem}){
  const badge = getStatusBadge(event.status);
  return (
    <Link href={`/events/${event.slug}`} className="group relative flex flex-col rounded-2xl border border-white/[0.06] bg-[#1C1E22]/50 overflow-hidden transition-all hover:-translate-y-1 hover:border-[#4FA3D1]/30 hover:shadow-lg hover:shadow-[#4FA3D1]/5">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {event.coverurl
          ? <Image src={event.coverurl} alt={event.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized sizes="(max-width:640px)50vw,(max-width:1024px)33vw,25vw"/>
          : <div className="h-full w-full bg-gradient-to-br from-[#4FA3D1]/20 via-[#6E8FA6]/10 to-transparent"/>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1E22] via-transparent to-transparent"/>
        <div className={cn("absolute top-2 left-2 flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-black",badge.cls)}>
          <span className={cn("h-1.5 w-1.5 rounded-full",badge.dot)}/>{badge.label}
        </div>
      </div>
      {/* Content */}
      <div className="flex flex-col flex-1 p-3 sm:p-4">
        <h3 className="text-sm sm:text-base font-bold text-[#D9DDE3] line-clamp-1 mb-1 group-hover:text-[#4FA3D1] transition-colors">{event.title}</h3>
        <p className="text-[10px] sm:text-xs text-[#6E8FA6] line-clamp-2 mb-3 flex-1">{event.description||"Tidak ada deskripsi"}</p>
        <div className="flex items-center gap-3 text-[10px] text-[#6E8FA6]/70">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3"/> {fmtDate(event.startdate)}</span>
          {event.isonline
            ? <span className="flex items-center gap-1"><Users className="h-3 w-3"/> Online</span>
            : <span className="flex items-center gap-1"><MapPin className="h-3 w-3"/> Offline</span>
          }
        </div>
      </div>
    </Link>
  );
}

function BlogCard({blog}:{blog:BlogItem}){
  const tagColors:Record<string,string> = {
    "Anime & Manga":"#4FA3D1", "Gaming":"#a78bfa", "VTuber":"#f472b6",
    "Fanart":"#34d399", "J-Music":"#fbbf24", "Cosplay":"#E8C2A8",
    "Kreator":"#818cf8", "Komunitas":"#6ee7b7",
  };
  const mainTag = blog.tags?.[0] ?? null;
  const tagColor = mainTag ? (tagColors[mainTag] ?? "#4FA3D1") : "#4FA3D1";
  return (
    <Link href={`/blog/${blog.slug}`} className="group relative flex flex-col rounded-2xl sm:rounded-2xl border border-white/[0.06] bg-[#1C1E22]/60 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#4FA3D1]/25 hover:shadow-xl hover:shadow-[#4FA3D1]/5">
      {/* Image */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden">
        {blog.coverurl
          ? <Image src={blog.coverurl} alt={blog.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized sizes="(max-width:640px)50vw,(max-width:1024px)33vw,25vw"/>
          : <div className="h-full w-full" style={{background:`linear-gradient(135deg, ${tagColor}15 0%, ${tagColor}08 50%, transparent 100%)`}}/>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1E22] via-[#1C1E22]/20 to-transparent"/>
        {/* Tag badge */}
        {mainTag && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold backdrop-blur-md border"
              style={{color:tagColor, borderColor:tagColor+"30", backgroundColor:tagColor+"15"}}>
              <span className="h-1.5 w-1.5 rounded-full" style={{backgroundColor:tagColor}}/>
              {mainTag}
            </span>
          </div>
        )}
      </div>
      {/* Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <h3 className="text-sm sm:text-base font-bold text-[#D9DDE3] line-clamp-2 mb-2 group-hover:text-[#4FA3D1] transition-colors leading-snug">{blog.title}</h3>
        <p className="text-[11px] sm:text-xs text-[#6E8FA6]/80 line-clamp-2 mb-4 flex-1 leading-relaxed">{blog.excerpt||"Tidak ada deskripsi"}</p>
        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/[0.04]">
          {/* Author */}
          <div className="flex items-center gap-2 min-w-0">
            {blog.author?.avatarurl ? (
              <div className="relative h-6 w-6 rounded-full overflow-hidden flex-shrink-0">
                <Image src={blog.author.avatarurl} alt={blog.author.displayname??""} fill sizes="24px" className="object-cover" unoptimized/>
              </div>
            ) : (
              <div className="h-6 w-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold" style={{backgroundColor:tagColor+"20", color:tagColor}}>
                {(blog.author?.displayname ?? blog.author?.username ?? "S").charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-[10px] sm:text-[11px] text-[#6E8FA6]/60 truncate font-medium">
              {blog.author?.displayname ?? blog.author?.username ?? "Soraku"}
            </span>
          </div>
          {/* Read more */}
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#4FA3D1]/70 group-hover:text-[#4FA3D1] transition-colors flex-shrink-0">
            Baca <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform"/>
          </span>
        </div>
      </div>
    </Link>
  );
}

function FeatureCard({feature,index}:{feature:typeof FEATURES[0];index:number}){
  const Icon = feature.icon;
  return (
    <div className="group relative p-5 sm:p-6 rounded-2xl border border-white/[0.06] bg-[#1C1E22]/30 hover:bg-[#1C1E22]/50 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.12]">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0 transition-colors" style={{backgroundColor: `${feature.color}15`}}>
          <Icon className="h-6 w-6" style={{color: feature.color}}/>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-[#D9DDE3] mb-1.5">{feature.title}</h3>
          <p className="text-xs sm:text-sm text-[#6E8FA6] leading-relaxed">{feature.description}</p>
        </div>
      </div>
    </div>
  );
}



// ═════════════════════════════════════════════════════════════════════════════
// DISCORD HOOK
// ═════════════════════════════════════════════════════════════════════════════

function useDiscord(){
  const [presence,setPresence]=useState<number|null>(null);
  const [members,setMembers]=useState<DmMember[]>([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    fetch(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/widget.json`).then(r=>r.ok?r.json():null).then(d=>{
      if(d){
        setPresence(d.presence_count??d.members?.length??0);
        setMembers((d.members||[]).slice(0,8));
      }
    }).catch(()=>{}).finally(()=>setLoading(false));
  },[]);
  return {loading,presence,members};
}

function DiscordLiveCard({discord}:{discord:{loading:boolean;presence:number|null;members:DmMember[]}}){
  const statusColor = (s:string) => {
    switch(s){
      case "online": return "bg-emerald-400";
      case "idle": return "bg-amber-400";
      case "dnd": return "bg-red-400";
      default: return "bg-gray-500";
    }
  };
  const avatarColors = ["#4FA3D1","#6EE7B7","#F472B6","#A78BFA","#FBBF24","#818CF8","#34D399","#FB923C"];
  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#5865F2]/20 bg-gradient-to-br from-[#5865F2]/8 via-[#1C1E22] to-[#5865F2]/5">
      {/* Ambient glow */}
      <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#5865F2]/10 blur-[80px] pointer-events-none"/>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-[#4FA3D1]/8 blur-[60px] pointer-events-none"/>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-[#5865F2]/15 border border-[#5865F2]/20 shadow-lg shadow-[#5865F2]/10">
              <DiscordIcon className="h-5 w-5 sm:h-7 sm:w-7 text-[#5865F2]"/>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-bold text-[#6E8FA6] uppercase tracking-wider">Server Discord</p>
              <div className="flex items-baseline gap-1.5">
                <p className="text-xl sm:text-2xl lg:text-3xl font-black text-[#D9DDE3]">
                  {discord.loading ? "—" : discord.presence?.toLocaleString("id-ID") ?? "—"}
                </p>
                <span className="text-xs sm:text-sm font-medium text-[#6E8FA6]">online</span>
              </div>
            </div>
          </div>
          <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
            className="hidden sm:flex items-center justify-center gap-2 rounded-xl bg-[#5865F2] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#4752C4] hover:-translate-y-0.5 transition-all shadow-lg shadow-[#5865F2]/20">
            <DiscordIcon className="h-4 w-4"/> Join Server
          </a>
        </div>

        {/* Members grid */}
        <div className="mb-5">
          {discord.loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[1,2,3,4,5,6,7,8].map(i=>(
                <div key={i} className="flex items-center gap-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04] p-2.5">
                  <div className="h-9 w-9 rounded-full bg-white/10 animate-pulse flex-shrink-0"/>
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2.5 w-3/4 bg-white/10 rounded animate-pulse"/>
                    <div className="h-2 w-1/2 bg-white/5 rounded animate-pulse"/>
                  </div>
                </div>
              ))}
            </div>
          ) : discord.members.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {discord.members.map((m,i)=>{
                const color = avatarColors[i % avatarColors.length];
                return (
                  <div key={m.username} className="group flex items-center gap-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04] p-2.5 hover:bg-white/[0.06] hover:border-white/[0.08] transition-all">
                    <div className="relative h-9 w-9 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/5">
                      {m.avatar
                        ? <Image src={m.avatar} alt={m.username} fill sizes="36px" className="object-cover" unoptimized/>
                        : <div className="h-full w-full flex items-center justify-center text-xs font-bold" style={{backgroundColor:color,color:"#1C1E22"}}>{m.username.charAt(0).toUpperCase()}</div>
                      }
                      <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#1C1E22] ${statusColor(m.status)}`}/>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#D9DDE3] truncate">{m.username}</p>
                      <p className="text-[10px] text-[#6E8FA6]/60 truncate capitalize">{m.status === "online" ? "Online" : m.status === "idle" ? "Idle" : m.status === "dnd" ? "DND" : "Offline"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <span className="text-xs text-[#6E8FA6]">Loading members...</span>
            </div>
          )}
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/[0.04]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"/>
              <span className="text-[10px] sm:text-xs text-[#6E8FA6]">Live Chat 24/7</span>
            </div>
            {discord.members.length > 0 && (
              <span className="text-[10px] sm:text-xs text-[#6E8FA6]/50">
                +{Math.max(0,(discord.presence??0)-discord.members.length)} member lainnya
              </span>
            )}
          </div>
          <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
            className="sm:hidden flex items-center justify-center gap-1.5 rounded-xl bg-[#5865F2] px-3.5 py-2 text-[11px] font-bold text-white hover:bg-[#4752C4] transition-colors">
            <DiscordIcon className="h-3.5 w-3.5"/> Join
          </a>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═════════════════════════════════════════════════════════════════════════════

export default function HomePage() {
  const discord = useDiscord();
  const [data,setData] = useState<{events:EventItem[];blogs:BlogItem[];partnerships:Partnership[];sponsorships:Partnership[]}>({events:[],blogs:[],partnerships:[],sponsorships:[]});
  const [loading,setLoading] = useState(true);
  const [user,setUser] = useState<{id:string}|null|"loading">("loading");

  useEffect(()=>{
    fetch("/api/home").then(r=>r.ok?r.json():null).then(d=>{if(d?.data)setData(prev => ({ ...prev, ...d.data }));}).catch(()=>{}).finally(()=>setLoading(false));
    fetch("/api/auth/me",{cache:"no-store"}).then(r=>r.json()).then(d=>setUser(d.data??null)).catch(()=>setUser(null));
  },[]);

  const isLoggedIn = user!=="loading"&&user!==null;

  return (
    <main className="min-h-screen bg-[#1C1E22] text-foreground overflow-x-hidden">

      {/* ══════════════════════════════════════════════
          HERO
          Mobile: Text centered, NO mascot
          Desktop: Mascot seamless kanan + teks kiri
          ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">

        {/* ── MOBILE HERO — Text only, no mascot ── */}
        <div className="lg:hidden flex min-h-[95svh] flex-col justify-center relative px-6 pt-24 pb-14">
          {/* Atmosphere orbs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-primary/8 blur-[140px]"/>
            <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-[#E8C2A8]/5 blur-[100px]"/>
          </div>
          <div className="relative z-10">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"/>
              <span className="text-[10px] font-bold tracking-[0.18em] text-white/40 uppercase">
                {discord.loading?"—":discord.presence?.toLocaleString("id-ID")??"—"} ONLINE
              </span>
            </div>
            <h1 className="text-[clamp(3rem,13vw,5rem)] font-black leading-[0.9] tracking-tighter mb-4">
              Temukan Duniamu<br/>
              di{" "}
              <span className="bg-clip-text text-transparent"
                style={{backgroundImage:"linear-gradient(130deg,#4FA3D1 0%,#90c8e8 38%,#E8C2A8 72%,#d4a882 100%)",WebkitBackgroundClip:"text"}}>
                Soraku
              </span>
            </h1>
            <div className="h-[2px] w-10 rounded-full mb-4" style={{background:"linear-gradient(90deg,#4FA3D1,#E8C2A8)",opacity:0.5}}/>
            <p className="text-sm text-white/40 leading-relaxed mb-8 max-w-xs">
              Wujudkan imajinasi, asah kreativitas, dan jalin koneksi bermakna bersama komunitas anime Indonesia.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {!isLoggedIn ? (
                <>
                  <Link href="/register"
                    className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white"
                    style={{background:"linear-gradient(135deg,#4FA3D1 0%,#3a8fbe 100%)"}}>
                    Daftar <ArrowRight className="h-3.5 w-3.5"/>
                  </Link>
                  <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-6 py-3 text-sm font-bold text-white/55 hover:bg-white/[0.08] transition-colors">
                    <DiscordIcon className="h-4 w-4 text-indigo-400"/> Join Discord
                  </a>
                </>
              ) : (
                <>
                  <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-6 py-3 text-sm font-bold text-white/55 hover:bg-white/[0.08] transition-colors">
                    <DiscordIcon className="h-4 w-4 text-indigo-400"/> Discord Invite
                  </a>
                  <Link href="/about"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-6 py-3 text-sm font-bold text-white/55 hover:bg-white/[0.08] transition-colors">
                    About
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── DESKTOP HERO — Mascot seamless kanan + teks kiri ── */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_520px] xl:grid-cols-[1fr_580px] min-h-[95vh] items-center relative pt-16">
          {/* Ambient glows */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-0 w-[500px] h-[420px] rounded-full blur-[140px] bg-[#4FA3D1]/10"/>
            <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] rounded-full blur-[120px] bg-[#E8C2A8]/5"/>
          </div>
          {/* LEFT — text */}
          <div className="relative z-10 px-10 xl:px-16 py-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] mb-7">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"/>
              <span className="text-[10px] font-bold tracking-[0.2em] text-white/38 uppercase">
                {discord.loading?"—":discord.presence?.toLocaleString("id-ID")??"—"} ONLINE SEKARANG
              </span>
            </div>
            <h1 className="text-[clamp(3.5rem,6vw,5.5rem)] font-black leading-[0.9] tracking-tighter mb-5">
              Temukan<br/>Duniamu<br/>
              di{" "}
              <span className="bg-clip-text text-transparent"
                style={{backgroundImage:"linear-gradient(130deg,#4FA3D1 0%,#90c8e8 38%,#E8C2A8 72%,#d4a882 100%)",WebkitBackgroundClip:"text"}}>
                Soraku
              </span>
            </h1>
            <div className="h-[2px] w-12 rounded-full mb-5" style={{background:"linear-gradient(90deg,#4FA3D1,#E8C2A8)",opacity:0.45}}/>
            <p className="max-w-md text-base xl:text-lg text-white/35 leading-relaxed mb-10">
              Wujudkan imajinasi, asah kreativitas, dan jalin koneksi bermakna.
              Di sini, setiap langkahmu adalah bagian dari cerita besar kita bersama.
            </p>
            <div className="flex items-center gap-3">
              {!isLoggedIn ? (
                <>
                  <Link href="/register"
                    className="group flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm text-white transition-all hover:scale-[1.02]"
                    style={{background:"linear-gradient(135deg,#4FA3D1 0%,#3a8fbe 100%)"}}>
                    <Sparkles className="h-4 w-4"/>Daftar Gratis
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform"/>
                  </Link>
                  <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm text-white/55 bg-white/[0.04] border border-white/[0.1] hover:bg-white/[0.08] transition-all">
                    <DiscordIcon className="h-4 w-4 text-indigo-400"/> Join Discord
                  </a>
                </>
              ) : (
                <>
                  <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm text-white/55 bg-white/[0.04] border border-white/[0.1] hover:bg-white/[0.08] transition-all">
                    <DiscordIcon className="h-4 w-4 text-indigo-400"/> Discord Invite
                  </a>
                  <Link href="/about"
                    className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm text-white/55 bg-white/[0.04] border border-white/[0.1] hover:bg-white/[0.08] transition-all">
                    About
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* RIGHT — Mascot seamless, NO card, NO border */}
          <div className="relative h-full min-h-[95vh]">
            {/* Glow behind mascot */}
            <div className="absolute inset-0 -z-0">
              <div className="absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/8 blur-[120px]"/>
            </div>
            <Image src="/logo-full.png" alt="Soraku Mascot" fill sizes="100vw"
              className="object-cover object-center" priority/>
            {/* Seamless fades */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#1C1E22] to-transparent z-10"/>
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#1C1E22] via-[#1C1E22]/60 to-transparent z-10"/>
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#1C1E22] to-transparent z-10"/>
            {/* Float badges */}
            <div className="absolute top-[22%] left-4 z-20 float-badge">
              <span className="rounded-full border border-white/10 px-3.5 py-1.5 text-[11px] font-semibold text-white/50 backdrop-blur-md bg-black/20">
                🌸 Komunitas
              </span>
            </div>
            <div className="absolute top-[38%] left-2 z-20 float-badge" style={{animationDelay:"1s"}}>
              <span className="rounded-full border border-white/10 px-3.5 py-1.5 text-[11px] font-semibold text-white/50 backdrop-blur-md bg-black/20">
                🎌 Anime &amp; Manga
              </span>
            </div>
            <div className="absolute top-[55%] left-6 z-20 float-badge" style={{animationDelay:"2s"}}>
              <span className="rounded-full border border-white/10 px-3.5 py-1.5 text-[11px] font-semibold text-white/50 backdrop-blur-md bg-black/20">
                ✨ Non-profit
              </span>
            </div>
            {/* Info overlay bottom */}
            <div className="absolute bottom-6 inset-x-0 z-20 px-5 flex items-end justify-between">
              <div>
                <p className="text-base font-black text-white/70 drop-shadow-lg">Soraku</p>
                <p className="text-[10px] text-white/30">Community · 空</p>
              </div>
              <span className="flex items-center gap-1 text-[9px] font-black text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"/> Live
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CATEGORY MARQUEE ══ */}
      <CategoryMarquee/>

      {/* Features Section */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6E8FA6] mb-3">Apa yang Kamu Dapatkan</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#D9DDE3]">Fitur Soraku</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {FEATURES.map((feature,index)=>{
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="group relative p-5 sm:p-6 rounded-2xl border border-white/[0.06] bg-[#1C1E22]/50 hover:bg-[#1C1E22]/80 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.12]">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0 transition-colors" style={{backgroundColor: `${feature.color}15`}}>
                      <Icon className="h-6 w-6" style={{color: feature.color}}/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-[#D9DDE3] mb-1.5">{feature.title}</h3>
                      <p className="text-xs sm:text-sm text-[#6E8FA6] leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-12 sm:py-16 container mx-auto px-4 sm:px-6">
        <SectionHeader eyebrow="Upcoming" title="Event Komunitas" href="/events"/>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[1,2,3,4].map(i=><div key={i} className="animate-pulse rounded-2xl bg-white/[0.025] aspect-[3/4]"/>)}
          </div>
        ) : data.events.length===0 ? (
          <div className="py-16 text-center"><Calendar className="mx-auto h-8 w-8 text-white/10 mb-3"/><p className="text-sm text-[#6E8FA6]">Belum ada event</p></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {data.events.slice(0, 8).map(e=><EventCard key={e.id} event={e}/>)}
          </div>
        )}
      </section>

      {/* Blog Section */}
      <section className="py-12 sm:py-16 container mx-auto px-4 sm:px-6">
        <SectionHeader eyebrow="Komunitas" title="Artikel & Kreasi" href="/blog"/>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[1,2,3,4].map(i=><div key={i} className="animate-pulse rounded-2xl bg-white/[0.025] aspect-[3/4]"/>)}
          </div>
        ) : data.blogs.length===0 ? (
          <div className="py-16 text-center"><BookOpen className="mx-auto h-8 w-8 text-white/10 mb-3"/><p className="text-sm text-[#6E8FA6]">Belum ada artikel</p></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {data.blogs.slice(0, 8).map(b=><BlogCard key={b.id} blog={b}/>)}
          </div>
        )}
      </section>

      {/* Discord Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 container mx-auto px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2]/5 via-transparent to-[#4FA3D1]/5"/>
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-[#5865F2]/10 blur-3xl"/>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-[#4FA3D1]/10 blur-3xl"/>
        <SectionHeader eyebrow="Real-time" title="Server Discord"/>
        <div className="relative z-10 max-w-4xl mx-auto">
          <DiscordLiveCard discord={discord}/>
          {/* Desktop CTA below card */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-4 mt-6">
            {[
              {icon:"💬", label:"Chat komunitas anime & gaming", color:"#4FA3D1"},
              {icon:"🎭", label:"VTuber fans & fanart", color:"#6EE7B7"},
              {icon:"🗓️", label:"Info event & giveaway", color:"#A78BFA"},
              {icon:"🎵", label:"J-Music & cosplay", color:"#FBBF24"},
            ].map((f,i)=>(
              <div key={i} className="flex items-center gap-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] p-3.5">
                <span className="text-base">{f.icon}</span>
                <span className="text-xs font-medium text-[#6E8FA6]">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsorship */}
      {data.sponsorships.length>0&&(
        <section className="py-12 sm:py-16 container mx-auto px-4 sm:px-6">
          <SectionHeader eyebrow="Dukungan" title="Sponsor"/>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {data.sponsorships.map(p=>(
              <a key={p.id} href={p.website??"#"} target="_blank" rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2.5 transition-all hover:-translate-y-0.5">
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center overflow-hidden rounded-xl bg-white/[0.04] border border-white/[0.06] p-2.5 group-hover:border-amber-500/20 group-hover:bg-amber-500/5 transition-all">
                  {p.logourl ? <Image src={p.logourl} alt={p.name} width={48} height={48} className="object-contain opacity-50 group-hover:opacity-90 transition-opacity duration-300"/> : <Star className="h-5 w-5 text-amber-400/30 group-hover:text-amber-400/60 transition-colors"/>}
                </div>
                <p className="text-[10px] font-bold text-white/25 group-hover:text-white/50 transition-colors uppercase tracking-wide">{p.name}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Partnership */}
      {data.partnerships.length>0&&(
        <section className="py-12 sm:py-16 container mx-auto px-4 sm:px-6">
          <SectionHeader eyebrow="Kolaborasi" title="Partner"/>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {data.partnerships.map(p=>(
              <a key={p.id} href={p.website??"#"} target="_blank" rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2.5 transition-all hover:-translate-y-0.5">
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center overflow-hidden rounded-xl bg-white/[0.04] border border-white/[0.06] p-2.5 group-hover:border-[#4FA3D1]/20 group-hover:bg-[#4FA3D1]/5 transition-all">
                  {p.logourl ? <Image src={p.logourl} alt={p.name} width={48} height={48} className="object-contain opacity-50 group-hover:opacity-90 transition-opacity duration-300"/> : <Handshake className="h-5 w-5 text-white/20 group-hover:text-[#4FA3D1]/40 transition-colors"/>}
                </div>
                <p className="text-[10px] font-bold text-white/25 group-hover:text-white/50 transition-colors uppercase tracking-wide">{p.name}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Social Media Marquee */}
      <div className="relative overflow-hidden py-3 border-t border-white/[0.04]">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-[#1C1E22] to-transparent z-10"/>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-[#1C1E22] to-transparent z-10"/>
        <div className="marquee-track flex gap-3 whitespace-nowrap mb-2">
          {[...Array(4)].map((_,i)=>SOCIAL_LINKS.map(s=>{
            return (
              <a key={`r1-${i}-${s.slug}`} href={s.href} target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-white/[0.05] bg-white/[0.02] px-4 py-2 hover:bg-white/[0.06] transition-all">
                <s.Icon className="h-4 w-4 text-[#6E8FA6] group-hover:text-[#4FA3D1] transition-opacity"/>
                <span className="text-xs font-semibold text-[#6E8FA6] group-hover:text-[#D9DDE3] transition-opacity">{s.name}</span>
              </a>
            );
          }))}
        </div>
        <div className="marquee-track-reverse flex gap-3 whitespace-nowrap">
          {[...Array(4)].map((_,i)=>[...SOCIAL_LINKS].reverse().map(s=>{
            return (
              <a key={`r2-${i}-${s.slug}`} href={s.href} target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-white/[0.05] bg-white/[0.02] px-4 py-2 hover:bg-white/[0.06] transition-all">
                <s.Icon className="h-4 w-4 text-[#6E8FA6] group-hover:text-[#4FA3D1] transition-opacity"/>
                <span className="text-xs font-semibold text-[#6E8FA6] group-hover:text-[#D9DDE3] transition-opacity">{s.name}</span>
              </a>
            );
          }))}
        </div>
      </div>

      {/* Join CTA */}
      {!isLoggedIn && user!=="loading" && (
        <section className="py-20 sm:py-24 container mx-auto px-4 sm:px-6 text-center">
          <div className="text-4xl mb-5">🌸</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-4 text-[#D9DDE3]">
            Jadilah bagian dari <span style={{color: COLORS.primary}}>Soraku</span>
          </h2>
          <p className="text-[#6E8FA6] text-sm sm:text-base leading-relaxed mb-8 max-w-sm mx-auto">Gratis selamanya. Komunitas yang hangat dan penuh semangat.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register"
              className="inline-flex items-center gap-2 rounded-2xl px-8 py-3.5 text-sm font-bold text-[#1C1E22] shadow-xl transition-all hover:scale-[1.02]"
              style={{background: COLORS.primary}}>
              Daftar Gratis <ArrowRight className="h-4 w-4"/>
            </Link>
            <Link href="/about"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.08] px-8 py-3.5 text-sm font-semibold text-[#6E8FA6] hover:border-white/[0.15] hover:text-[#D9DDE3] transition-all">
              Tentang Soraku
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
