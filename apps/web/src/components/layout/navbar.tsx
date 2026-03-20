"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Menu, X, Moon, Sun, ChevronDown,
  Bell, LogOut, Shield, CheckCheck, User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/use-notifications";
import { NOTIF_CONFIG, type Notification } from "@/lib/notifications";

type NavChild = { label: string; href: string; desc?: string };
type NavItem =
  | { type: "link";     label: string; href: string }
  | { type: "dropdown"; label: string; children: NavChild[] };

interface SessionUser {
  id: string; username: string | null; displayname: string | null;
  avatarurl: string | null; role: string;
}

const NAV_ITEMS: NavItem[] = [
  { type: "link", label: "Beranda", href: "/" },
  { type: "link", label: "Tentang",  href: "/about" },
  {
    type: "dropdown",
    label: "Fitur",
    children: [
      { label: "Events",  href: "/events",  desc: "Acara & gathering komunitas" },
      { label: "Blog",    href: "/blog",    desc: "Artikel & ulasan anime"      },
      { label: "Galeri",  href: "/gallery", desc: "Karya anggota komunitas"     },
    ],
  },
  {
    type: "dropdown",
    label: "Komunitas",
    children: [
      { label: "VTuber",  href: "/vtubers", desc: "Virtual YouTuber Soraku" },
      { label: "Premium", href: "/premium", desc: "Dukung Soraku Community" },
      { label: "Donasi",  href: "/donate",  desc: "Donasi untuk komunitas"  },
    ],
  },
  {
    type: "dropdown",
    label: "Informasi",
    children: [
      { label: "Privasi",   href: "/privacy",      desc: "Kebijakan privasi"    },
      { label: "Ketentuan", href: "/tos",           desc: "Syarat penggunaan"    },
      { label: "Masukan",   href: "/feedback",      desc: "Kirim masukan"        },
      { label: "Lisensi",   href: "/license",       desc: "Lisensi konten"       },
      { label: "Rekrutmen", href: "/requirements",  desc: "Bergabung bersama kami" },
    ],
  },
];

const IS_ADMIN = (r: string) => ["OWNER","MANAGER","ADMIN"].includes(r.toUpperCase());

export function Navbar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [notifOpen,    setNotifOpen]    = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [user,         setUser]         = useState<SessionUser | null>(null);
  const [mounted,      setMounted]      = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const { notifications, unreadCount, markRead, markAllRead } = useNotifications(!!user);

  useEffect(() => {
    setMounted(true);
    fetch("/api/auth/me", { cache: "no-store" })
      .then(r => r.json())
      .then(d => setUser(d.data ?? null))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotifOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleSignout = async () => {
    await fetch("/api/auth/signout", { method: "POST" }).catch(() => {});
    setUser(null); router.push("/"); router.refresh();
  };

  const displayName = user?.displayname ?? user?.username ?? "";
  const initial     = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="h-8 w-8 overflow-hidden rounded-lg border border-border/60 bg-[#1a1c20]">
            <Image src="/logo.png" alt="Soraku" width={32} height={32}
              className="h-full w-full object-cover object-top transition-transform group-hover:scale-110 duration-300" />
          </div>
          <span className="text-lg font-black tracking-tight group-hover:text-primary transition-colors">
            Soraku
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV_ITEMS.map((item) => {
            if (item.type === "link") {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}
                  className={cn(
                    "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                    active ? "text-foreground bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}>
                  {item.label}
                </Link>
              );
            }

            const isOpen = openDropdown === item.label;
            return (
              <div key={item.label} className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}>
                <button className={cn(
                  "flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  isOpen ? "text-foreground bg-muted/50" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}>
                  {item.label}
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", isOpen && "rotate-180")} />
                </button>

                {/* Dropdown panel */}
                <div className={cn(
                  "absolute left-0 top-full pt-1.5 transition-all duration-150 origin-top-left",
                  isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
                )}>
                  <div className="w-52 overflow-hidden rounded-xl border border-border/60 bg-background/98 shadow-xl backdrop-blur-xl">
                    {(item as { type: "dropdown"; label: string; children: NavChild[] }).children.map(child => (
                      <Link key={child.href} href={child.href}
                        className="block px-4 py-3 transition-colors hover:bg-primary/8"
                        onClick={() => setOpenDropdown(null)}>
                        <p className="text-sm font-semibold text-foreground/90">{child.label}</p>
                        {child.desc && <p className="mt-0.5 text-xs text-muted-foreground/55">{child.desc}</p>}
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

          {/* Theme */}
          {mounted && (
            <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}

          {user ? (<>
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => setNotifOpen(o => !o)}
                className={cn(
                  "relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                  notifOpen ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}>
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-black text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-border/60 bg-background/98 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Bell className="h-3.5 w-3.5 text-primary" />
                      <span className="text-sm font-bold">Notifikasi</span>
                      {unreadCount > 0 && (
                        <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">{unreadCount}</span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button onClick={() => markAllRead()}
                        className="flex items-center gap-1 text-xs text-muted-foreground/60 hover:text-primary transition-colors">
                        <CheckCheck className="h-3 w-3" /> Baca semua
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center">
                        <Bell className="mx-auto mb-2 h-8 w-8 text-muted-foreground/20" />
                        <p className="text-xs text-muted-foreground/40">Tidak ada notifikasi</p>
                      </div>
                    ) : notifications.slice(0, 6).map((n) => {
                      const cfg  = NOTIF_CONFIG[n.type] ?? NOTIF_CONFIG.info;
                      const Icon = cfg.icon;
                      return (
                        <button key={n.id} onClick={() => { markRead(n.id); setNotifOpen(false); }}
                          className={cn(
                            "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-primary/5",
                            !n.isread && "bg-primary/5"
                          )}>
                          <div className={cn("mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border", cfg.bg, cfg.border)}>
                            <Icon className={cn("h-3.5 w-3.5", cfg.color)} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold">{n.title}</p>
                            {n.message && <p className="mt-0.5 text-[11px] text-muted-foreground/60 line-clamp-2">{n.message}</p>}
                          </div>
                          {!n.isread && <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />}
                        </button>
                      );
                    })}
                  </div>

                  <Link href="/notifications" onClick={() => setNotifOpen(false)}
                    className="flex items-center justify-center gap-1.5 border-t border-border/40 py-2.5 text-xs text-muted-foreground/60 hover:text-primary transition-colors">
                    Lihat semua notifikasi
                  </Link>
                </div>
              )}
            </div>

            {/* User avatar dropdown */}
            <div className="relative group">
              <button className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-primary/10 text-primary font-bold text-sm transition-all hover:border-primary/40 hover:ring-2 hover:ring-primary/20">
                {user.avatarurl
                  ? <Image src={user.avatarurl} alt={displayName} width={36} height={36} className="h-full w-full object-cover" />
                  : <span className="text-sm font-black">{initial || <User className="h-4 w-4" />}</span>
                }
              </button>

              <div className="absolute right-0 top-full pt-2 opacity-0 scale-95 origin-top-right pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-150">
                <div className="w-52 overflow-hidden rounded-xl border border-border/60 bg-background/98 shadow-xl backdrop-blur-xl">
                  <div className="border-b border-border/40 px-4 py-3">
                    <p className="text-sm font-semibold truncate">{displayName}</p>
                    <p className="text-xs text-muted-foreground/60 truncate">@{user.username ?? "—"}</p>
                  </div>
                  <div className="py-1">
                    <Link href="/profile/me"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-primary/8 transition-colors">
                      <User className="h-4 w-4" /> Profil Saya
                    </Link>
                    <Link href="/notifications"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-primary/8 transition-colors">
                      <Bell className="h-4 w-4" /> Notifikasi
                      {unreadCount > 0 && <span className="ml-auto rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">{unreadCount}</span>}
                    </Link>
                    {IS_ADMIN(user.role) && (
                      <Link href="/admin"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-primary/8 transition-colors">
                        <Shield className="h-4 w-4" /> Admin Panel
                      </Link>
                    )}
                    <div className="mx-2 my-1 border-t border-border/40" />
                    <button onClick={handleSignout}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-colors">
                      <LogOut className="h-4 w-4" /> Keluar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>) : (
            <Link href="/login"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors">
              Masuk
            </Link>
          )}

          {/* Mobile toggle */}
          <button onClick={() => setMenuOpen(o => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors lg:hidden">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border/40 bg-background/98 backdrop-blur-xl lg:hidden">
          <div className="space-y-0.5 px-4 py-3">
            {NAV_ITEMS.map((item) => {
              if (item.type === "link") {
                return (
                  <Link key={item.href} href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}>
                    {item.label}
                  </Link>
                );
              }
              return (
                <div key={item.label} className="pt-1">
                  <p className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground/35">
                    {item.label}
                  </p>
                  {(item as { type: "dropdown"; label: string; children: NavChild[] }).children.map(child => (
                    <Link key={child.href} href={child.href}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-xl px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                      {child.label}
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
