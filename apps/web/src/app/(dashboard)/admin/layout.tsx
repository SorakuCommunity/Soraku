"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutDashboard, BookOpen, Calendar, Image, Users, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { href: "/",             label: "Beranda",   icon: Home           },
  { href: "/admin",        label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/blog",   label: "Blog",      icon: BookOpen        },
  { href: "/admin/events", label: "Event",     icon: Calendar        },
  { href: "/admin/gallery",label: "Galeri",    icon: Image           },
  { href: "/admin/users",  label: "Pengguna",  icon: Users           },
];

export default function DashAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-8 sm:px-6 lg:px-8 gap-8">
      {/* Sidebar */}
      <aside className="hidden w-52 flex-shrink-0 lg:block">
        <div className="sticky top-24 glass-card p-4 border-primary/20">

          <div className="mb-4 flex items-center gap-2 pb-4 border-b border-border/50">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold">Admin</p>
              <p className="text-xs text-muted-foreground/50">Panel</p>
            </div>
          </div>

          <nav className="space-y-0.5">
            {ADMIN_NAV.map(({ href, label, icon: Icon }) => {
              const active = href === "/" ? pathname === "/"
                : href === "/admin" ? pathname === "/admin"
                : pathname.startsWith(href);
              return (
                <Link key={href} href={href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-primary/8 hover:text-foreground"
                  )}>
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
