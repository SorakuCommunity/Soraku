"use client";

import { useAuthRole } from "@/hooks/useAuthRole";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Image,
  Users,
  Play,
  Settings,
  Power,
  ChevronRight,
} from "lucide-react";

const ADMIN_MENU = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/blog", label: "Blog Manager", icon: BookOpen },
  { href: "/admin/events", label: "Events Manager", icon: Calendar },
  { href: "/admin/vtuber", label: "Vtuber Manager", icon: Play },
  { href: "/admin/gallery", label: "Gallery Moderation", icon: Image },
  { href: "/admin/roles", label: "Role Management", icon: Users },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAuthRole();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-base flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-dark-base flex">
      {/* Sidebar */}
      <aside className="w-64 glass-strong fixed top-0 left-0 bottom-0 flex flex-col border-r border-white/5 z-40">
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="font-display text-white text-xs font-bold">S</span>
            </div>
            <span className="font-display text-base text-white">
              SORA<span className="text-primary">KU</span>
            </span>
            <span className="ml-auto text-xs px-1.5 py-0.5 rounded bg-accent/20 text-accent border border-accent/30">
              Admin
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 overflow-y-auto">
          {ADMIN_MENU.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all group ${
                  active
                    ? "bg-primary/15 text-primary border border-primary/20"
                    : "text-secondary hover:text-light-base hover:bg-white/5"
                }`}
              >
                <Icon size={16} className={active ? "text-primary" : ""} />
                {label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/5">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-secondary hover:text-light-base hover:bg-white/5 transition-all"
          >
            <Power size={16} />
            Kembali ke Website
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
