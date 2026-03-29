"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Menu, X, Moon, Sun, ChevronDown, ChevronRight,
  Bell, LogOut, Shield, CheckCheck, User, Home,
  Calendar, BookOpen, ImageIcon, Tv2, Info, Heart,
  MessageSquare, Lock, FileText, UserPlus, LayoutDashboard,
  Users, Star, Layers,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/use-notifications";
import { NOTIF_CONFIG } from "@/lib/notifications";
import { DiscordIcon } from "@/components/icons/custom-icons";

interface SessionUser { id:string; username:string|null; displayname:string|null; avatarurl:string|null; role:string; }
type NavChild = { label:string; href:string; desc?:string; Icon:React.FC<{className?:string}> };
type NavGroup = { label:string; Icon:React.FC<{className?:string}>; children:NavChild[] };
type NavItem  = { type:"link"; label:string; href:string; Icon:React.FC<{className?:string}> }
              | { type:"group"; group:NavGroup };

// Color palette
const COLORS = {
  primary: "#4FA3D1",
  dark: "#1C1E22",
  secondary: "#6E8FA6",
  light: "#D9DDE3",
  accent: "#E8C2A8",
};

const NAV_ITEMS: NavItem[] = [
  { type:"link",  label:"Beranda", href:"/",      Icon:Home    },
  { type:"group", group:{ label:"Fitur", Icon:Layers, children:[
    { label:"Blog",    href:"/blog",    Icon:BookOpen,  desc:"Artikel komunitas" },
    { label:"Events",  href:"/events",  Icon:Calendar,  desc:"Turnamen & acara"  },
    { label:"Galeri",  href:"/gallery", Icon:ImageIcon, desc:"Karya anggota"     },
  ]}},
  { type:"group", group:{ label:"Agensi", Icon:Tv2, children:[
    { label:"VTuber",    href:"/vtubers",      Icon:Tv2,      desc:"Virtual YouTuber komunitas"   },
  ]}},
  { type:"group", group:{ label:"Komunitas", Icon:Users, children:[
    { label:"Donasi",    href:"/donate",      Icon:Heart,    desc:"Dukung komunitas kami"         },
    { label:"Premium",   href:"/premium",     Icon:Star,     desc:"Akses eksklusif supporter"    },
  ]}},
  { type:"group", group:{ label:"Informasi", Icon:FileText, children:[
    { label:"Tentang",   href:"/about",        Icon:Info,          desc:"Tentang Soraku dan tim" },
    { label:"Rekrutmen", href:"/requirements", Icon:UserPlus,      desc:"Bergabung sebagai kreator" },
    { label:"Privasi",   href:"/privacy",      Icon:Lock,          desc:"Kebijakan privasi" },
    { label:"Ketentuan", href:"/tos",          Icon:FileText,       desc:"Syarat penggunaan" },
    { label:"Masukan",   href:"/feedback",     Icon:MessageSquare,  desc:"Kirim saran" },
    { label:"Lisensi",   href:"/license",      Icon:Shield,         desc:"Lisensi konten" },
  ]}},
];

const IS_ADMIN = (r:string) => ["OWNER","MANAGER","ADMIN"].includes(r.toUpperCase());

export function Navbar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [notifOpen,    setNotifOpen]    = useState(false);
  const [openGroup,    setOpenGroup]    = useState<string|null>(null);
  const [user,         setUser]         = useState<SessionUser|null>(null);
  const [mounted,      setMounted]      = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications(!!user);

  useEffect(()=>{
    setMounted(true);
    fetch("/api/auth/me",{cache:"no-store"}).then(r=>r.json()).then(d=>setUser(d.data??null)).catch(()=>setUser(null));
  },[]);
  useEffect(()=>{
    const h=(e:MouseEvent)=>{ if(notifRef.current&&!notifRef.current.contains(e.target as Node)) setNotifOpen(false); };
    document.addEventListener("mousedown",h);
    return ()=>document.removeEventListener("mousedown",h);
  },[]);
  useEffect(()=>{ setMenuOpen(false); setProfileOpen(false); },[pathname]);

  const handleSignout = async () => {
    await fetch("/api/auth/signout",{method:"POST"}).catch(()=>{});
    setUser(null); router.push("/"); router.refresh();
  };

  const displayName = user?.displayname??user?.username??"";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════════
          DESKTOP & MOBILE NAVBAR
          ═══════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#1C1E22]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="h-8 w-8 overflow-hidden rounded-lg border border-white/10 bg-[#1a1c20]">
              <Image src="/logo.png" alt="Soraku" width={32} height={32}
                className="h-full w-full object-cover object-top transition-transform group-hover:scale-110 duration-300"/>
            </div>
            <span className="text-base font-black tracking-tight text-[#D9DDE3] group-hover:text-[#4FA3D1] transition-colors">Soraku</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {NAV_ITEMS.map((item,idx)=>{
              if(item.type==="link") return (
                <Link key={item.href} href={item.href}
                  className={cn("flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    pathname===item.href 
                      ? "text-[#4FA3D1] bg-[#4FA3D1]/10" 
                      : "text-[#6E8FA6] hover:text-[#D9DDE3] hover:bg-white/5")}>
                  <item.Icon className="h-3.5 w-3.5 opacity-70"/>{item.label}
                </Link>
              );
              const g = (item as any).group as NavGroup;
              const isOpen = openGroup===g.label;
              return (
                <div key={g.label} className="relative"
                  onMouseEnter={()=>setOpenGroup(g.label)} onMouseLeave={()=>setOpenGroup(null)}>
                  <button className={cn("flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isOpen?"text-[#D9DDE3] bg-white/5":"text-[#6E8FA6] hover:text-[#D9DDE3] hover:bg-white/5")}>
                    <g.Icon className="h-3.5 w-3.5 opacity-70"/>{g.label}
                    <ChevronDown className={cn("h-3 w-3 transition-transform duration-200",isOpen&&"rotate-180")}/>
                  </button>
                  <div className={cn("absolute left-0 top-full pt-2 transition-all duration-150 origin-top-left z-50",
                    isOpen?"opacity-100 scale-100 pointer-events-auto":"opacity-0 scale-95 pointer-events-none")}>
                    <div className="w-56 overflow-hidden rounded-xl border border-white/[0.08] bg-[#1C1E22]/98 shadow-xl backdrop-blur-xl">
                      {g.children.map(c=>{
                        const isActive = pathname===c.href || pathname.startsWith(c.href+'/');
                        return (
                          <Link key={c.href} href={c.href} onClick={()=>setOpenGroup(null)}
                            className={cn("flex items-start gap-3 px-4 py-3 transition-colors",
                              isActive ? "bg-[#4FA3D1]/10 text-[#4FA3D1]" : "hover:bg-white/5")}>
                            <c.Icon className={cn("h-4 w-4 mt-0.5 flex-shrink-0", isActive ? "text-[#4FA3D1]" : "text-[#6E8FA6]")}/>
                            <div>
                              <p className={cn("text-sm font-semibold", isActive ? "text-[#4FA3D1]" : "text-[#D9DDE3]")}>{c.label}</p>
                              {c.desc&&<p className="mt-0.5 text-xs text-[#6E8FA6]/70">{c.desc}</p>}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Right actions - Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {mounted&&(
              <button onClick={()=>setTheme(resolvedTheme==="dark"?"light":"dark")}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6E8FA6] hover:text-[#D9DDE3] hover:bg-white/5 transition-colors">
                {resolvedTheme==="dark"?<Sun className="h-4 w-4"/>:<Moon className="h-4 w-4"/>}
              </button>
            )}

            {user?(<>
              {/* Notif */}
              <div className="relative" ref={notifRef}>
                <button onClick={()=>setNotifOpen(o=>!o)}
                  className={cn("relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                    notifOpen?"bg-[#4FA3D1]/15 text-[#4FA3D1]":"text-[#6E8FA6] hover:text-[#D9DDE3] hover:bg-white/5")}>
                  <Bell className="h-4 w-4"/>
                  {unreadCount>0&&(
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#E8C2A8] px-1 text-[9px] font-black text-[#1C1E22]">
                      {unreadCount>9?"9+":unreadCount}
                    </span>
                  )}
                </button>
                {notifOpen&&(
                  <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1C1E22]/98 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Bell className="h-3.5 w-3.5 text-[#4FA3D1]"/>
                        <span className="text-sm font-bold text-[#D9DDE3]">Notifikasi</span>
                        {unreadCount>0&&<span className="rounded-full bg-[#4FA3D1]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#4FA3D1]">{unreadCount}</span>}
                      </div>
                      {unreadCount>0&&(
                        <button onClick={()=>markAllRead()} className="flex items-center gap-1 text-xs text-[#6E8FA6] hover:text-[#4FA3D1] transition-colors">
                          <CheckCheck className="h-3 w-3"/> Baca semua
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length===0?(
                        <div className="py-8 text-center"><Bell className="mx-auto mb-2 h-8 w-8 text-white/15"/><p className="text-xs text-[#6E8FA6]">Tidak ada notifikasi</p></div>
                      ):notifications.slice(0,8).map(n=>{
                        const cfg=(NOTIF_CONFIG as any)[n.type]??(NOTIF_CONFIG as any).info;
                        const NIcon=cfg.icon as React.ElementType|undefined;
                        return (
                          <button key={n.id} onClick={()=>{markRead([n.id]);setNotifOpen(false);}}
                            className={cn("flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-white/5",!n.isread&&"bg-white/[0.03]")}>
                            <div className={cn("mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border",cfg.bg)}>
                              {NIcon?<NIcon className={cn("h-3.5 w-3.5",cfg.color)}/>:<span className="text-sm">{cfg.emoji}</span>}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-[#D9DDE3]">{n.title}</p>
                              {n.body&&<p className="mt-0.5 text-[11px] text-[#6E8FA6]/70 line-clamp-2">{n.body}</p>}
                            </div>
                            {!n.isread&&<span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#4FA3D1]"/>}
                          </button>
                        );
                      })}
                    </div>
                    <Link href="/notifications" onClick={()=>setNotifOpen(false)}
                      className="flex items-center justify-center gap-1.5 border-t border-white/[0.06] py-2.5 text-xs text-[#6E8FA6] hover:text-[#4FA3D1] transition-colors">
                      Lihat semua
                    </Link>
                  </div>
                )}
              </div>

              {/* Avatar desktop */}
              <div className="relative group">
                <button className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all hover:border-[#4FA3D1]/40 hover:ring-2 hover:ring-[#4FA3D1]/20">
                  {user.avatarurl
                    ? <Image src={user.avatarurl} alt={displayName} width={36} height={36} className="h-full w-full object-cover"/>
                    : <span className="text-sm font-black text-[#4FA3D1]">{initial||<User className="h-4 w-4"/>}</span>
                  }
                </button>
                <div className="absolute right-0 top-full pt-2 opacity-0 scale-95 origin-top-right pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-150">
                  <div className="w-52 overflow-hidden rounded-xl border border-white/[0.08] bg-[#1C1E22]/98 shadow-xl backdrop-blur-xl">
                    <div className="border-b border-white/[0.06] px-4 py-3">
                      <p className="text-sm font-semibold text-[#D9DDE3] truncate">{displayName}</p>
                      <p className="text-xs text-[#6E8FA6] truncate">@{user.username??"—"}</p>
                    </div>
                    <div className="py-1">
                      <Link href="/profile/me" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#6E8FA6] hover:text-[#D9DDE3] hover:bg-white/5 transition-colors"><User className="h-4 w-4"/> Profil</Link>
                      <Link href="/notifications" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#6E8FA6] hover:text-[#D9DDE3] hover:bg-white/5 transition-colors">
                        <Bell className="h-4 w-4"/> Notifikasi
                        {unreadCount>0&&<span className="ml-auto rounded-full bg-[#4FA3D1]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#4FA3D1]">{unreadCount}</span>}
                      </Link>
                      {IS_ADMIN(user.role)&&<Link href="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#6E8FA6] hover:text-[#D9DDE3] hover:bg-white/5 transition-colors"><Shield className="h-4 w-4"/> Admin Panel</Link>}
                      <div className="mx-2 my-1 border-t border-white/[0.06]"/>
                      <button onClick={handleSignout} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/8 transition-colors"><LogOut className="h-4 w-4"/> Keluar</button>
                    </div>
                  </div>
                </div>
              </div>
            </>):(
              <Link href="/login" className="hidden lg:inline-flex items-center gap-2 rounded-xl bg-[#4FA3D1] px-4 py-2 text-sm font-semibold text-[#1C1E22] hover:bg-[#4FA3D1]/90 transition-colors">Masuk</Link>
            )}
          </div>

          {/* Mobile actions */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Theme toggle */}
            {mounted&&(
              <button onClick={()=>setTheme(resolvedTheme==="dark"?"light":"dark")}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6E8FA6] hover:text-[#D9DDE3] hover:bg-white/5 transition-colors">
                {resolvedTheme==="dark"?<Sun className="h-4 w-4"/>:<Moon className="h-4 w-4"/>}
              </button>
            )}

            {/* Profile button - separate from menu */}
            {user ? (
              <button onClick={()=>setProfileOpen(o=>!o)}
                className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
                {user.avatarurl
                  ? <Image src={user.avatarurl} alt={displayName} width={36} height={36} className="h-full w-full object-cover"/>
                  : <span className="text-sm font-black text-[#4FA3D1]">{initial||<User className="h-4 w-4"/>}</span>
                }
              </button>
            ) : (
              <Link href="/login" className="flex items-center gap-2 rounded-lg bg-[#4FA3D1] px-3 py-1.5 text-xs font-semibold text-[#1C1E22]">
                Masuk
              </Link>
            )}

            {/* Menu button */}
            <button onClick={()=>setMenuOpen(o=>!o)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6E8FA6] hover:text-[#D9DDE3] hover:bg-white/5 transition-colors">
              {menuOpen?<X className="h-5 w-5"/>:<Menu className="h-5 w-5"/>}
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════
          MOBILE PROFILE DRAWER
          ═══════════════════════════════════════════════════════════════════════ */}
      {profileOpen && user && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={()=>setProfileOpen(false)}/>
          <div className="absolute right-0 top-16 w-64 bg-[#1C1E22] border-l border-b border-white/[0.08] rounded-bl-2xl shadow-2xl">
            {/* User info */}
            <div className="p-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  {user.avatarurl
                    ? <Image src={user.avatarurl} alt={displayName} width={48} height={48} className="h-full w-full object-cover"/>
                    : <span className="flex h-full w-full items-center justify-center text-lg font-black text-[#4FA3D1]">{initial}</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#D9DDE3] truncate">{displayName}</p>
                  <p className="text-xs text-[#6E8FA6] truncate">@{user.username??"—"}</p>
                </div>
              </div>
            </div>
            {/* Profile links */}
            <div className="p-2">
              <Link href="/profile/me" onClick={()=>setProfileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#6E8FA6] hover:bg-white/5 hover:text-[#D9DDE3] transition-colors">
                <User className="h-4 w-4"/> Profil
              </Link>
              <Link href="/notifications" onClick={()=>setProfileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#6E8FA6] hover:bg-white/5 hover:text-[#D9DDE3] transition-colors">
                <Bell className="h-4 w-4"/> Notifikasi
                {unreadCount>0&&<span className="ml-auto rounded-full bg-[#4FA3D1]/15 px-2 py-0.5 text-[10px] font-bold text-[#4FA3D1]">{unreadCount}</span>}
              </Link>
              {IS_ADMIN(user.role)&&(
                <Link href="/admin" onClick={()=>setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#6E8FA6] hover:bg-white/5 hover:text-[#D9DDE3] transition-colors">
                  <Shield className="h-4 w-4"/> Admin Panel
                </Link>
              )}
              <div className="my-2 border-t border-white/[0.06]"/>
              <button onClick={handleSignout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400/60 hover:bg-red-500/5 hover:text-red-400 transition-colors">
                <LogOut className="h-4 w-4"/> Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          MOBILE NAVIGATION DRAWER - Dropdown Style
          ═══════════════════════════════════════════════════════════════════════ */}
      {menuOpen&&(
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={()=>setMenuOpen(false)}/>
          <div className="absolute inset-x-0 top-16 flex flex-col max-h-[calc(100dvh-4rem)] overflow-y-auto bg-[#1C1E22] border-b border-white/[0.08]">

            <div className="px-4 py-5 space-y-4">
              
              {/* Navigation Dropdowns */}
              {NAV_ITEMS.map((item, idx) => {
                if (item.type === "link") {
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.href} href={item.href} onClick={()=>setMenuOpen(false)}
                      className={cn("flex items-center gap-3 rounded-xl px-4 py-3 transition-colors",
                        isActive 
                          ? "bg-[#4FA3D1]/10 text-[#4FA3D1] border border-[#4FA3D1]/20" 
                          : "bg-white/[0.02] text-[#D9DDE3] border border-white/[0.06] hover:bg-white/5")}>
                      <item.Icon className={cn("h-5 w-5", isActive ? "text-[#4FA3D1]" : "text-[#6E8FA6]")}/>
                      <span className="text-sm font-semibold">{item.label}</span>
                      {isActive && <ChevronRight className="h-4 w-4 ml-auto opacity-50"/>}
                    </Link>
                  );
                }
                
                // Group dropdown
                const g = item.group;
                const isGroupOpen = openGroup === g.label;
                const hasActiveChild = g.children.some(c => pathname === c.href || pathname.startsWith(c.href + '/'));
                
                return (
                  <div key={g.label} className="border border-white/[0.06] rounded-xl overflow-hidden bg-white/[0.02]">
                    <button onClick={()=>setOpenGroup(isGroupOpen ? null : g.label)}
                      className={cn("flex items-center gap-3 w-full px-4 py-3 transition-colors",
                        hasActiveChild ? "text-[#4FA3D1]" : "text-[#D9DDE3]")}>
                      <g.Icon className={cn("h-5 w-5", hasActiveChild ? "text-[#4FA3D1]" : "text-[#6E8FA6]")}/>
                      <span className="text-sm font-semibold flex-1 text-left">{g.label}</span>
                      <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isGroupOpen && "rotate-180")}/>
                    </button>
                    
                    {isGroupOpen && (
                      <div className="border-t border-white/[0.06] bg-white/[0.01]">
                        {g.children.map(c => {
                          const isActive = pathname === c.href || pathname.startsWith(c.href + '/');
                          return (
                            <Link key={c.href} href={c.href} onClick={()=>setMenuOpen(false)}
                              className={cn("flex items-center gap-3 px-4 py-3 transition-colors border-l-2",
                                isActive 
                                  ? "bg-[#4FA3D1]/5 text-[#4FA3D1] border-l-[#4FA3D1]" 
                                  : "text-[#6E8FA6] border-l-transparent hover:bg-white/5 hover:text-[#D9DDE3]")}>
                              <c.Icon className="h-4 w-4"/>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{c.label}</p>
                                {c.desc && <p className="text-[10px] text-[#6E8FA6]/60">{c.desc}</p>}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Discord CTA */}
              <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
                onClick={()=>setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 bg-[#5865F2]/10 border border-[#5865F2]/30 text-[#D9DDE3] hover:bg-[#5865F2]/20 transition-colors">
                <DiscordIcon className="h-5 w-5 text-[#5865F2]"/>
                <span className="text-sm font-semibold">Join Discord</span>
                <ChevronRight className="h-4 w-4 ml-auto opacity-50"/>
              </a>

              {/* Auth buttons for non-logged in users */}
              {!user && (
                <div className="flex gap-3 pt-2">
                  <Link href="/login" onClick={()=>setMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#4FA3D1] py-3 text-sm font-bold text-[#1C1E22] hover:bg-[#4FA3D1]/90 transition-all">
                    Masuk
                  </Link>
                  <Link href="/register" onClick={()=>setMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] py-3 text-sm font-semibold text-[#D9DDE3]/60 hover:border-white/[0.15] hover:text-[#D9DDE3] transition-all">
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
