"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, ArrowLeft, CheckCheck, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/use-notifications";
import { NOTIF_CONFIG, type Notification } from "@/lib/notifications";

export default function NotificationsPage() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then(r => r.json())
      .then(d => { setUser(d.data ?? null); setAuthed(!!d.data); })
      .catch(() => { setUser(null); setAuthed(false); });
  }, []);

  const { notifications, unreadCount, markRead, markAllRead, loading } = useNotifications(!!user);

  if (authed === null) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="space-y-3 animate-pulse">
          <div className="h-4 w-24 rounded bg-muted/30" />
          <div className="h-8 w-48 rounded bg-muted/30" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-muted/20" />
          ))}
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-border/40 bg-muted/15">
          <Bell className="h-7 w-7 text-muted-foreground/30" />
        </div>
        <h1 className="text-xl font-black">Masuk untuk melihat notifikasi</h1>
        <p className="mt-2 text-sm text-muted-foreground/60">Kamu perlu masuk untuk mengakses halaman ini.</p>
        <Link href="/login" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
          Masuk Sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors group w-fit">
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" /> Beranda
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Notifikasi</h1>
            {unreadCount > 0 && (
              <p className="mt-1 text-sm text-muted-foreground/60">
                {unreadCount} belum dibaca
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={() => markAllRead()}
              className="flex items-center gap-1.5 rounded-xl border border-border/50 px-3.5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
              <CheckCheck className="h-3.5 w-3.5" /> Tandai semua dibaca
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted/20" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/40 bg-muted/15">
            <Bell className="h-7 w-7 text-muted-foreground/25" />
          </div>
          <h2 className="text-base font-bold text-foreground/70">Belum ada notifikasi</h2>
          <p className="mt-1.5 text-sm text-muted-foreground/50">Notifikasi akan muncul di sini.</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {notifications.map((n) => {
            const cfg  = NOTIF_CONFIG[n.type] ?? NOTIF_CONFIG.info;
            const Icon = cfg.icon;
            const timeAgo = (() => {
              const diff = Date.now() - new Date(n.createdat).getTime();
              if (diff < 60_000)   return "Baru saja";
              if (diff < 3600_000) return `${Math.floor(diff/60_000)} mnt lalu`;
              if (diff < 86400_000) return `${Math.floor(diff/3600_000)} jam lalu`;
              return `${Math.floor(diff/86400_000)} hari lalu`;
            })();

            return (
              <button key={n.id} onClick={() => markRead([n.id])}
                className={cn(
                  "flex w-full items-start gap-4 rounded-2xl px-5 py-4 text-left transition-colors hover:bg-primary/5",
                  !n.isread ? "bg-primary/5 border border-primary/10" : "border border-transparent"
                )}>
                <div className={cn(
                  "mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border",
                  cfg.bg, cfg.border
                )}>
                  <Icon className={cn("h-4 w-4", cfg.color)} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground leading-snug">{n.title}</p>
                    <span className="flex-shrink-0 text-[10px] text-muted-foreground/40 mt-0.5">{timeAgo}</span>
                  </div>
                  {n.message && (
                    <p className="mt-1 text-sm text-muted-foreground/60 leading-relaxed">{n.message}</p>
                  )}
                </div>
                {!n.isread && (
                  <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
