"use client";
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, User, BookOpen, ImageIcon, Settings, LogOut, Shield } from "lucide-react";

interface SessionUser {
  id: string; username: string | null; displayname: string | null;
  avatarurl: string | null; role: string;
}

const SIDEBAR_LINKS = [
  { href: "/profile/me",              label: "Beranda",    icon: LayoutDashboard },
  { href: "/profile/me",   label: "Profil",     icon: User },
  { href: "/posts",        label: "Postingan",  icon: BookOpen },
  { href: "/gallery/upload",      label: "Galeri",     icon: ImageIcon },
  { href: "/settings",     label: "Pengaturan", icon: Settings },
];

const IS_ADMIN = (r: string) => ["OWNER","MANAGER","ADMIN"].includes(r.toUpperCase());

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then(r => r.json())
      .then(d => setUser(d.data ?? null))
      .catch(() => setUser(null));
  }, []);

  const handleSignout = async () => {
    await fetch("/api/auth/signout", { method: "POST" }).catch(() => {});
    router.push("/");
    router.refresh();
  };

  const displayName = user?.displayname ?? user?.username ?? "Member";
  const initial     = displayName.charAt(0).toUpperCase();

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-8 sm:px-6 lg:px-8 gap-8 pb-24">
      <aside className="hidden w-56 flex-shrink-0 lg:block">
        <div className="sticky top-24 glass-card p-4">
          {/* User info */}
          <div className="mb-4 flex items-center gap-3 pb-4 border-b border-border/50">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden flex-shrink-0">
              {user?.avatarurl ? (
                <Image src={user.avatarurl} alt={displayName} width={40} height={40} className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm font-black">{initial}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground/60 truncate">@{user?.username ?? "—"}</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="space-y-0.5">
            {SIDEBAR_LINKS.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === href || pathname.startsWith(href + "/")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-primary/8 hover:text-foreground"
                }`}>
                <Icon className="h-4 w-4" />{label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border/50 mt-2">
              {user && IS_ADMIN(user.role) && (
                <Link href="/admin"
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    pathname.startsWith("/admin") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-primary/8 hover:text-foreground"
                  }`}>
                  <Shield className="h-4 w-4" />Admin Panel
                </Link>
              )}
              <button onClick={handleSignout}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                <LogOut className="h-4 w-4" />Keluar
              </button>
            </div>
          </nav>
        </div>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
