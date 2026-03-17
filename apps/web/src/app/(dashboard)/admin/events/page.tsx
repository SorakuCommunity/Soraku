"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Trash2, Eye, EyeOff, Loader2, RefreshCw, Calendar, Wifi, MapPin, Pencil, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminEvent {
  id:          string;
  slug:        string;
  title:       string;
  startdate:   string;
  enddate:     string | null;
  isonline:    boolean;
  ispublished: boolean;
  tags:        string[];
  gametype:    string | null;
  ispaid:      boolean;
  registrationurl: string | null;
}

export default function AdminEventsPage() {
  const [events,  setEvents]  = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res  = await fetch("/api/admin/events");
    const json = await res.json();
    setEvents(json?.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const togglePublish = async (ev: AdminEvent) => {
    setSaving(ev.id);
    await fetch(`/api/admin/events/${ev.id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ispublished: !ev.ispublished }),
    });
    setEvents(prev => prev.map(e => e.id === ev.id ? { ...e, ispublished: !e.ispublished } : e));
    setSaving(null);
  };

  const del = async (id: string) => {
    if (!confirm("Hapus event ini? Tidak bisa dibatalkan.")) return;
    setSaving(id);
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    setEvents(prev => prev.filter(e => e.id !== id));
    setSaving(null);
  };

  const now        = new Date();
  const upcoming   = events.filter(e => new Date(e.startdate) >= now).length;
  const past       = events.filter(e => new Date(e.startdate) <  now).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary/60 mb-1">Admin Panel</p>
          <h1 className="text-2xl font-black">Event</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40">
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
          <Link href="/admin/events/new"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" /> Event Baru
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total",    value: events.length, color: "text-foreground" },
          { label: "Upcoming", value: upcoming,       color: "text-primary"    },
          { label: "Selesai",  value: past,           color: "text-muted-foreground" },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_140px_80px_80px_120px] gap-4 px-5 py-3 border-b border-border/40 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
          <span>Event</span><span>Tanggal</span><span>Tipe</span><span>Status</span><span className="text-right">Aksi</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" /> Memuat...
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Calendar className="h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Belum ada event</p>
            <Link href="/admin/events/new" className="text-xs text-primary hover:underline">+ Buat sekarang</Link>
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {events.map(ev => {
              const busy    = saving === ev.id;
              const isPast  = new Date(ev.startdate) < now;
              const dateStr = new Date(ev.startdate).toLocaleDateString("id-ID", { day:"2-digit", month:"short", year:"numeric" });
              return (
                <div key={ev.id}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_140px_80px_80px_160px] gap-3 sm:gap-4 px-5 py-4 items-center hover:bg-primary/2 transition-colors">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{ev.title}</p>
                    <p className="text-xs text-muted-foreground/50 font-mono">/events/{ev.slug}</p>
                  </div>
                  <p className={cn("text-xs", isPast ? "text-muted-foreground/50" : "text-foreground")}>{dateStr}</p>
                  <span className={cn(
                    "inline-flex items-center gap-1 text-[10px] font-bold",
                    ev.isonline ? "text-blue-400" : "text-green-400"
                  )}>
                    {ev.isonline ? <Wifi className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                    {ev.isonline ? "Online" : "Offline"}
                  </span>
                  <span className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold",
                    ev.ispublished ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"
                  )}>
                    {ev.ispublished ? "● Publik" : "○ Draft"}
                  </span>
                  <div className="flex items-center gap-1.5 justify-end flex-wrap">
                    {/* Badge free/paid */}
                    {ev.ispaid ? (
                      <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400/80">💰 Bayar</span>
                    ) : (
                      <span className="rounded-full bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-[10px] font-bold text-green-400/70">🎟️ Gratis</span>
                    )}
                    <div className="flex items-center gap-1">
                    {/* Tombol pendaftar - tampil untuk ML event */}
                    {ev.gametype === "ml" && (
                      <Link href={`/admin/events/${ev.id}/registrations`}
                        className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-primary transition-colors"
                        title="Lihat Pendaftar">
                        <Users className="h-3.5 w-3.5" />
                      </Link>
                    )}
                    <Link href={`/admin/events/${ev.id}/edit`}
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-primary transition-colors"
                      title="Edit">
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <button onClick={() => togglePublish(ev)} disabled={busy || isPast}
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
                      title={ev.ispublished ? "Jadikan draft" : "Publish"}>
                      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                             : ev.ispublished ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                    <button onClick={() => del(ev.id)} disabled={busy}
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
                      title="Hapus">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
