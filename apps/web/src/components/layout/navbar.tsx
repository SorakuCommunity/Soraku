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

const NAV_ITEMS: NavItem[] = [
  { type:"link",  label:"Beranda", href:"/",      Icon:Home    },
  { type:"link",  label:"About",   href:"/about", Icon:Info    },
  { type:"group", group:{ label:"Fitur", Icon:Layers, children:[
    { label:"Blog",    href:"/blog",    Icon:BookOpen,  desc:"Artikel komunitas" },
    { label:"Events",  href:"/events",  Icon:Calendar,  desc:"Turnamen & acara"  },
    { label:"Galeri",  href:"/gallery", Icon:ImageIcon, desc:"Karya anggota"     },
  ]}},
  { type:"group", group:{ label:"Agensi", Icon:Tv2, children:[
    { label:"VTuber",    href:"/vtubers",      Icon:Tv2,      desc:"Virtual YouTuber komunitas"   },
    { label:"Rekrutmen", href:"/requirements", Icon:UserPlus, desc:"Bergabung sebagai kreator"    },
  ]}},
  { type:"group", group:{ label:"Komunitas", Icon:Users, children:[
    { label:"Donasi",    href:"/donate",      Icon:Heart,    desc:"Dukung komunitas kami"         },
    { label:"Premium",   href:"/premium",     Icon:Star,     desc:"Akses eksklusif supporter"    },
  ]}},
  { type:"group", group:{ label:"Informasi", Icon:FileText, children:[
    { label:"Privasi",   href:"/privacy",  Icon:Lock,          desc:"Kebijakan privasi"   },
    { label:"Ketentuan", href:"/tos",      Icon:FileText,       desc:"Syarat penggunaan"  },
    { label:"Masukan",   href:"/feedback", Icon:MessageSquare,  desc:"Kirim saran"        },
    { label:"Lisensi",   href:"/license",  Icon:Shield,         desc:"Lisensi konten"     },
  ]}},
];

const IS_ADMIN = (r:string) => ["OWNER","MANAGER","ADMIN"].includes(r.toUpperCase());

export function Navbar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [menuOpen,     setMenuOpen]     = useState(false);
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
  useEffect(()=>{ setMenuOpen(false); },[pathname]);

  const handleSignout = async () => {
    await fetch("/api/auth/signout",{method:"POST"}).catch(()=>{});
    setUser(null); router.push("/"); router.refresh();
  };

  const displayName = user?.displayname??user?.username??"";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#1C1E22]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="h-8 w-8 overflow-hidden rounded-lg border border-white/10 bg-[#1a1c20]">
              <Image src="/logo.png" alt="Soraku" width={32} height={32}
                className="h-full w-full object-cover object-top transition-transform group-hover:scale-110 duration-300"/>
            </div>
            <span className="text-base font-black tracking-tight group-hover:text-primary transition-colors">Soraku</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {NAV_ITEMS.map((item,idx)=>{
              if(item.type==="link") return (
                <Link key={item.href} href={item.href}
                  className={cn("flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    pathname===item.href ? "text-foreground bg-white/8" : "text-white/45 hover:text-white/80 hover:bg-white/6")}>
                  <item.Icon className="h-3.5 w-3.5 opacity-70"/>{item.label}
                </Link>
              );
              const g = (item as any).group as NavGroup;
              const isOpen = openGroup===g.label;
              return (
                <div key={g.label} className="relative"
                  onMouseEnter={()=>setOpenGroup(g.label)} onMouseLeave={()=>setOpenGroup(null)}>
                  <button className={cn("flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isOpen?"text-white/80 bg-white/6":"text-white/45 hover:text-white/80 hover:bg-white/6")}>
                    <g.Icon className="h-3.5 w-3.5 opacity-70"/>{g.label}
                    <ChevronDown className={cn("h-3 w-3 transition-transform duration-200",isOpen&&"rotate-180")}/>
                  </button>
                  <div className={cn("absolute left-0 top-full pt-2 transition-all duration-150 origin-top-left z-50",
                    isOpen?"opacity-100 scale-100 pointer-events-auto":"opacity-0 scale-95 pointer-events-none")}>
                    <div className="w-52 overflow-hidden rounded-xl border border-white/[0.08] bg-[#1C1E22]/98 shadow-xl backdrop-blur-xl">
                      {g.children.map(c=>(
                        <Link key={c.href} href={c.href} onClick={()=>setOpenGroup(null)}
                          className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white/5">
                          <c.Icon className="h-4 w-4 mt-0.5 text-primary/55 flex-shrink-0"/>
                          <div>
                            <p className="text-sm font-semibold text-white/80">{c.label}</p>
                            {c.desc&&<p className="mt-0.5 text-xs text-white/30">{c.desc}</p>}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {mounted&&(
              <button onClick={()=>setTheme(resolvedTheme==="dark"?"light":"dark")}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white/40 hover:text-white/70 hover:bg-white/6 transition-colors">
                {resolvedTheme==="dark"?<Sun className="h-4 w-4"/>:<Moon className="h-4 w-4"/>}
              </button>
            )}

            {user?(<>
              {/* Notif */}
              <div className="relative" ref={notifRef}>
                <button onClick={()=>setNotifOpen(o=>!o)}
                  className={cn("relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                    notifOpen?"bg-primary/15 text-primary":"text-white/40 hover:text-white/70 hover:bg-white/6")}>
                  <Bell className="h-4 w-4"/>
                  {unreadCount>0&&(
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-black text-white">
                      {unreadCount>9?"9+":unreadCount}
                    </span>
                  )}
                </button>
                {notifOpen&&(
                  <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1C1E22]/98 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Bell className="h-3.5 w-3.5 text-primary"/>
                        <span className="text-sm font-bold">Notifikasi</span>
                        {unreadCount>0&&<span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">{unreadCount}</span>}
                      </div>
                      {unreadCount>0&&(
                        <button onClick={()=>markAllRead()} className="flex items-center gap-1 text-xs text-white/30 hover:text-primary transition-colors">
                          <CheckCheck className="h-3 w-3"/> Baca semua
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length===0?(
                        <div className="py-8 text-center"><Bell className="mx-auto mb-2 h-8 w-8 text-white/15"/><p className="text-xs text-white/30">Tidak ada notifikasi</p></div>
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
                              <p className="text-xs font-semibold text-white/80">{n.title}</p>
                              {n.body&&<p className="mt-0.5 text-[11px] text-white/35 line-clamp-2">{n.body}</p>}
                            </div>
                            {!n.isread&&<span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"/>}
                          </button>
                        );
                      })}
                    </div>
                    <Link href="/notifications" onClick={()=>setNotifOpen(false)}
                      className="flex items-center justify-center gap-1.5 border-t border-white/[0.06] py-2.5 text-xs text-white/30 hover:text-primary transition-colors">
                      Lihat semua
                    </Link>
                  </div>
                )}
              </div>

              {/* Avatar desktop */}
              <div className="relative group hidden lg:block">
                <button className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all hover:border-primary/40 hover:ring-2 hover:ring-primary/20">
                  {user.avatarurl
                    ? <Image src={user.avatarurl} alt={displayName} width={36} height={36} className="h-full w-full object-cover"/>
                    : <span className="text-sm font-black text-primary">{initial||<User className="h-4 w-4"/>}</span>
                  }
                </button>
                <div className="absolute right-0 top-full pt-2 opacity-0 scale-95 origin-top-right pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-150">
                  <div className="w-52 overflow-hidden rounded-xl border border-white/[0.08] bg-[#1C1E22]/98 shadow-xl backdrop-blur-xl">
                    <div className="border-b border-white/[0.06] px-4 py-3">
                      <p className="text-sm font-semibold text-white/80 truncate">{displayName}</p>
                      <p className="text-xs text-white/35 truncate">@{user.username??"—"}</p>
                    </div>
                    <div className="py-1">
                      <Link href="/profile/me" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors"><User className="h-4 w-4"/> Profil</Link>
                      <Link href="/notifications" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors">
                        <Bell className="h-4 w-4"/> Notifikasi
                        {unreadCount>0&&<span className="ml-auto rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">{unreadCount}</span>}
                      </Link>
                      {IS_ADMIN(user.role)&&<Link href="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors"><Shield className="h-4 w-4"/> Admin Panel</Link>}
                      <div className="mx-2 my-1 border-t border-white/[0.06]"/>
                      <button onClick={handleSignout} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/8 transition-colors"><LogOut className="h-4 w-4"/> Keluar</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile — avatar opens drawer */}
              <button onClick={()=>setMenuOpen(o=>!o)}
                className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-white/10 lg:hidden">
                {user.avatarurl
                  ? <Image src={user.avatarurl} alt={displayName} width={36} height={36} className="h-full w-full object-cover"/>
                  : <span className="text-sm font-black text-primary">{initial||<User className="h-4 w-4"/>}</span>
                }
              </button>
            </>):(
              <>
                <Link href="/login" className="hidden lg:inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">Masuk</Link>
                <button onClick={()=>setMenuOpen(o=>!o)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-white/40 hover:text-white/70 hover:bg-white/6 transition-colors lg:hidden">
                  {menuOpen?<X className="h-5 w-5"/>:<Menu className="h-5 w-5"/>}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer (Image 3 style) ─────────────────────────────────── */}
      {menuOpen&&(
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={()=>setMenuOpen(false)}/>
          <div className="absolute inset-x-0 top-0 flex flex-col max-h-[100dvh] overflow-y-auto bg-[#1a1c20] border-b border-white/[0.08]">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <Link href="/" onClick={()=>setMenuOpen(false)} className="flex items-center gap-2.5">
                <div className="h-8 w-8 overflow-hidden rounded-lg border border-white/10 bg-[#1a1c20]">
                  <Image src="/logo.png" alt="Soraku" width={32} height={32} className="h-full w-full object-cover object-top"/>
                </div>
                <span className="text-base font-black">Soraku</span>
              </Link>
              <button onClick={()=>setMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] text-white/40 hover:text-white/70 transition-colors">
                <X className="h-4 w-4"/>
              </button>
            </div>

            <div className="px-4 py-5 space-y-6">

              {/* User card */}
              {user&&(
                <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                    {user.avatarurl
                      ? <Image src={user.avatarurl} alt={displayName} width={48} height={48} className="h-full w-full object-cover"/>
                      : <div className="flex h-full w-full items-center justify-center text-lg font-black text-primary">{initial}</div>
                    }
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-white/90 truncate">{displayName}</p>
                    <p className="text-xs text-white/35 truncate">@{user.username??"—"}</p>
                  </div>
                  {unreadCount>0&&<span className="rounded-full bg-primary text-white text-[9px] font-black px-2 py-0.5">{unreadCount}</span>}
                </div>
              )}

              {/* JELAJAHI — 2 column grid with icons */}
              <div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/25">Jelajahi</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {label:"Beranda", href:"/",        Icon:Home      },
                    {label:"Events",  href:"/events",  Icon:Calendar  },
                    {label:"Blog",    href:"/blog",    Icon:BookOpen  },
                    {label:"Galeri",  href:"/gallery", Icon:ImageIcon },
                    {label:"VTuber",  href:"/vtubers", Icon:Tv2       },
                  ].map(item=>(
                    <Link key={item.href} href={item.href} onClick={()=>setMenuOpen(false)}
                      className={cn("flex items-center gap-2.5 rounded-xl border p-3.5 transition-colors",
                        (pathname===item.href||(item.href!=="/"&&pathname.startsWith(item.href)))
                          ? "border-primary/30 bg-primary/8 text-primary"
                          : "border-white/[0.07] text-white/50 hover:border-white/[0.14] hover:bg-white/[0.04] hover:text-white/80")}>
                      <item.Icon className="h-4 w-4 flex-shrink-0"/>
                      <span className="text-sm font-semibold">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* AKUN — only if logged in */}
              {user&&(
                <div>
                  <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/25">Akun</p>
                  <div className="space-y-2">
                    <Link href="/profile/me" onClick={()=>setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl border border-white/[0.07] px-4 py-3 text-sm font-semibold text-white/55 hover:border-white/[0.14] hover:bg-white/[0.04] hover:text-white/80 transition-all">
                      <User className="h-4 w-4 flex-shrink-0"/> Profil
                    </Link>
                    <Link href="/notifications" onClick={()=>setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl border border-white/[0.07] px-4 py-3 text-sm font-semibold text-white/55 hover:border-white/[0.14] hover:bg-white/[0.04] hover:text-white/80 transition-all">
                      <Bell className="h-4 w-4 flex-shrink-0"/> Notifikasi
                      {unreadCount>0&&<span className="ml-auto rounded-full bg-primary text-white text-[9px] font-black px-1.5 py-0.5">{unreadCount}</span>}
                    </Link>
                    {IS_ADMIN(user.role)&&(
                      <Link href="/admin" onClick={()=>setMenuOpen(false)}
                        className="flex items-center gap-3 rounded-xl border border-white/[0.07] px-4 py-3 text-sm font-semibold text-white/55 hover:border-white/[0.14] hover:bg-white/[0.04] hover:text-white/80 transition-all">
                        <LayoutDashboard className="h-4 w-4 flex-shrink-0"/> Dashboard
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* INFORMASI — 2 column grid */}
              <div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/25">Informasi</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {label:"Tentang",   href:"/about",        Icon:Info          },
                    {label:"Privasi",   href:"/privacy",      Icon:Lock          },
                    {label:"Ketentuan", href:"/tos",          Icon:FileText      },
                    {label:"Masukan",   href:"/feedback",     Icon:MessageSquare },
                    {label:"Rekrutmen", href:"/requirements", Icon:UserPlus      },
                    {label:"Lisensi",   href:"/license",      Icon:Shield        },
                  ].map(item=>(
                    <Link key={item.href} href={item.href} onClick={()=>setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl border border-white/[0.07] px-3 py-2.5 text-xs font-medium text-white/40 hover:text-white/70 hover:border-white/[0.12] hover:bg-white/[0.04] transition-colors">
                      <item.Icon className="h-3.5 w-3.5 flex-shrink-0"/> {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Auth */}
              {user?(
                <div className="pt-1">
                  <button onClick={handleSignout}
                    className="flex w-full items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3.5 text-sm font-semibold text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                    <LogOut className="h-4 w-4 flex-shrink-0"/> Keluar
                  </button>
                </div>
              ):(
                <div className="flex flex-col gap-2 pt-1">
                  <Link href="/login" onClick={()=>setMenuOpen(false)}
                    className="flex items-center justify-center rounded-2xl bg-primary py-3.5 text-sm font-bold text-white hover:bg-primary/90 transition-all">
                    Masuk ke Soraku
                  </Link>
                  <Link href="/register" onClick={()=>setMenuOpen(false)}
                    className="flex items-center justify-center rounded-2xl border border-white/[0.08] py-3.5 text-sm font-semibold text-white/40 hover:border-white/[0.15] hover:text-white/65 transition-all">
                    Daftar Gratis
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
