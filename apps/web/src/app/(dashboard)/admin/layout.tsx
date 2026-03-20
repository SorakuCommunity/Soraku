"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, LayoutDashboard, BookOpen, Calendar,
  Image, Users, Shield, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { href: "/",              label: "Beranda",   icon: Home,            group: null    },
  { href: "/admin",         label: "Dashboard", icon: LayoutDashboard, group: null    },
  { href: "/admin/blog",    label: "Blog",      icon: BookOpen,        group: "Konten" },
  { href: "/admin/events",  label: "Event",     icon: Calendar,        group: "Konten" },
  { href: "/admin/gallery", label: "Galeri",    icon: Image,           group: "Konten" },
  { href: "/admin/users",   label: "Pengguna",  icon: Users,           group: "Sistem" },
];

export default function DashAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-8 sm:px-6 lg:px-8 gap-8">

      {/* Sidebar — minimalist, borderless */}
      <aside className="hidden w-48 flex-shrink-0 lg:block">
        <div className="sticky top-24">

          {/* Admin badge */}
          <div className="mb-6 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
              <Shield className="h-4 w-4 text-primary/70" />
            </div>
            <div>
              <p className="text-sm font-black leading-none">Admin</p>
              <p className="text-[10px] text-muted-foreground/40 mt-0.5">Soraku Panel</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="space-y-0.5">
            {(() => {
              let lastGroup: string | null = undefined as any;
              return ADMIN_NAV.map(({ href, label, icon: Icon, group }) => {
                const showGroup = group !== lastGroup;
                lastGroup = group;
                const active = href === "/" ? pathname === "/"
                  : href === "/admin" ? pathname === "/admin"
                  : pathname.startsWith(href);

                return (
                  <div key={href}>
                    {showGroup && group && (
                      <p className="mt-4 mb-1.5 px-2 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/25">
                        {group}
                      </p>
                    )}
                    <Link href={href}
                      className={cn(
                        "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground/60 hover:bg-muted/20 hover:text-foreground"
                      )}>
                      <span className="flex items-center gap-2.5">
                        <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                        {label}
                      </span>
                      {active && <ChevronRight className="h-3 w-3 opacity-40" />}
                    </Link>
                  </div>
                );
              });
            })()}
          </nav>

          {/* Bottom separator */}
          <div className="mt-8 h-px bg-gradient-to-r from-border/20 to-transparent" />
          <p className="mt-4 px-2 text-[9px] text-muted-foreground/20 font-semibold uppercase tracking-wider">
            Soraku v1.0
          </p>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0 pb-12">{children}</main>
    </div>
  );
}
