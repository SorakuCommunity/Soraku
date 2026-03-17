"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Plus, Trash2, Eye, EyeOff, Loader2, RefreshCw, Calendar,
  Wifi, MapPin, Pencil, Users, Lock, Unlock, DollarSign, Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminEvent {
  id:               string;
  slug:             string;
  title:            string;
  startdate:        string;
  enddate:          string | null;
  isonline:         boolean;
  ispublished:      boolean;
  tags:             string[];
  gametype:         string | null;
  ispaid:           boolean;
  registrationopen: boolean;
  registrationurl:  string | null;
}

interface Registration {
  id:            string;
  teamname:      string;
  teamlogourl:   string | null;
  contactname:   string | null;
  contactdiscord:string | null;
  status:        "pending" | "approved" | "rejected";
  paymentproof:  string | null;
  rejectreason:  string | null;
  createdat:     string;
}

type Tab = "events" | "pendaftaran";

export default function AdminEventsPage() {
  const [tab,     setTab]     = useState<Tab>("events");
  const [events,  setEvents]  = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState<string | null>(null);

  // Pendaftaran tab state
  const [selEvent,  setSelEvent]  = useState<AdminEvent | null>(null);
  const [regs,      setRegs]      = useState<Registration[]>([]);
  const [regsLoad,  setRegsLoad]  = useState(false);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ id: string; teamname: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res  = await fetch("/api/admin/events");
    const json = await res.json();
    setEvents(json?.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Saat pilih event di tab pendaftaran
  const loadRegs = useCallback(async (ev: AdminEvent) => {
    setSelEvent(ev);
    setRegsLoad(true);
    setRegs([]);
    const res  = await fetch(`/api/events/${ev.slug}/register`);
    const json = await res.json();
    setRegs(json?.data?.registrations ?? []);
    setRegsLoad(false);
  }, []);

  const togglePublish = async (ev: AdminEvent) => {
    setSaving(ev.id);
    await fetch(`/api/admin/events/${ev.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ispublished: !ev.ispublished }),
    });
    setEvents(prev => prev.map(e => e.id === ev.id ? { ...e, ispublished: !e.ispublished } : e));
    setSaving(null);
  };

  const toggleRegOpen = async (ev: AdminEvent) => {
    setSaving(`reg_${ev.id}`);
    await fetch(`/api/admin/events/${ev.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registrationopen: !ev.registrationopen }),
    });
    const updated = { ...ev, registrationopen: !ev.registrationopen };
    setEvents(prev => prev.map(e => e.id === ev.id ? updated : e));
    if (selEvent?.id === ev.id) setSelEvent(updated);
    setSaving(null);
  };

  const del = async (id: string) => {
    if (!confirm("Hapus event ini? Tidak bisa dibatalkan.")) return;
    setSaving(id);
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    setEvents(prev => prev.filter(e => e.id !== id));
    setSaving(null);
  };

  const review = async (regId: string, status: "approved" | "rejected", reason?: string) => {
    if (!selEvent) return;
    setReviewing(regId);
    await fetch(`/api/events/${selEvent.slug}/register/${regId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, rejectreason: reason }),
    });
    setRegs(prev => prev.map(r => r.id === regId ? { ...r, status } : r));
    setReviewing(null);
    setRejectModal(null);
    setRejectReason("");
  };

  const now = new Date();
  const mlEvents = events.filter(e => e.gametype === "ml");
  const counts  = {
    total:    events.length,
    upcoming: events.filter(e => new Date(e.startdate) >= now).length,
    past:     events.filter(e => new Date(e.startdate) <  now).length,
  };
  const regCounts = {
    total:    regs.length,
    pending:  regs.filter(r => r.status === "pending").length,
    approved: regs.filter(r => r.status === "approved").length,
    rejected: regs.filter(r => r.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* ── Header dengan Tab Navbar ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary/60 mb-1">Admin Panel</p>
            <h1 className="text-2xl font-black">Event</h1>
          </div>
          {/* Tab pills — sesuai konsep Riu (mirip profile page) */}
          <div className="flex gap-1 rounded-2xl border border-border/50 bg-card/30 p-1 backdrop-blur-sm">
            <button
              onClick={() => setTab("events")}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200",
                tab === "events"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/30"
              )}>
              <Calendar className="h-3.5 w-3.5" /> Event
            </button>
            <button
              onClick={() => setTab("pendaftaran")}
              className={cn(
                "relative flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200",
                tab === "pendaftaran"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/30"
              )}>
              <Users className="h-3.5 w-3.5" /> Pendaftaran
              {mlEvents.length > 0 && (
                <span className={cn(
                  "rounded-full px-1.5 py-0.5 text-[9px] font-black",
                  tab === "pendaftaran" ? "bg-white/20" : "bg-primary/20 text-primary"
                )}>
                  {mlEvents.length}
                </span>
              )}
            </button>
          </div>
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

      {/* ════════════ TAB: EVENTS ════════════ */}
      {tab === "events" && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total",    value: counts.total,    color: "text-foreground" },
              { label: "Upcoming", value: counts.upcoming, color: "text-primary" },
              { label: "Selesai",  value: counts.past,     color: "text-muted-foreground" },
            ].map(s => (
              <div key={s.label} className="glass-card p-4 text-center">
                <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="hidden sm:grid grid-cols-[1fr_130px_80px_80px_80px_160px] gap-4 px-5 py-3 border-b border-border/40 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
              <span>Event</span><span>Tanggal</span><span>Tipe</span><span>Status</span><span>Daftar</span><span className="text-right">Aksi</span>
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
                  const busy   = saving === ev.id || saving === `reg_${ev.id}`;
                  const isPast = new Date(ev.startdate) < now;
                  const dateStr = new Date(ev.startdate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
                  return (
                    <div key={ev.id} className="grid grid-cols-1 sm:grid-cols-[1fr_130px_80px_80px_80px_160px] gap-3 sm:gap-4 px-5 py-4 items-center hover:bg-primary/2 transition-colors">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-sm truncate">{ev.title}</p>
                          {ev.ispaid ? (
                            <span className="flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400/80">
                              <DollarSign className="h-2.5 w-2.5" /> Bayar
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 rounded-full bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-[10px] font-bold text-green-400/70">
                              <Tag className="h-2.5 w-2.5" /> Gratis
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground/40 font-mono">/events/{ev.slug}</p>
                      </div>
                      <p className={cn("text-xs", isPast ? "text-muted-foreground/50" : "text-foreground")}>{dateStr}</p>
                      <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold", ev.isonline ? "text-blue-400" : "text-green-400")}>
                        {ev.isonline ? <Wifi className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                        {ev.isonline ? "Online" : "Offline"}
                      </span>
                      <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold",
                        ev.ispublished ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400")}>
                        {ev.ispublished ? "● Publik" : "○ Draft"}
                      </span>
                      {/* Toggle buka/tutup pendaftaran */}
                      <button
                        onClick={() => toggleRegOpen(ev)}
                        disabled={busy || isPast}
                        title={ev.registrationopen ? "Tutup Pendaftaran" : "Buka Pendaftaran"}
                        className={cn(
                          "flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-black transition-all",
                          ev.registrationopen
                            ? "border-green-500/40 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                            : "border-border/50 bg-muted/20 text-muted-foreground/50 hover:border-primary/30 hover:text-foreground"
                        )}>
                        {busy && saving === `reg_${ev.id}`
                          ? <Loader2 className="h-3 w-3 animate-spin" />
                          : ev.registrationopen ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                        {ev.registrationopen ? "Buka" : "Tutup"}
                      </button>
                      <div className="flex items-center gap-1 justify-end">
                        {ev.gametype === "ml" && (
                          <button
                            onClick={() => { setTab("pendaftaran"); loadRegs(ev); }}
                            className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-primary transition-colors"
                            title="Lihat Pendaftar">
                            <Users className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <Link href={`/admin/events/${ev.id}/edit`}
                          className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-primary transition-colors"
                          title="Edit">
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                        <button onClick={() => togglePublish(ev)} disabled={busy || isPast}
                          className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
                          title={ev.ispublished ? "Jadikan draft" : "Publish"}>
                          {busy && saving === ev.id
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : ev.ispublished ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                        <button onClick={() => del(ev.id)} disabled={busy}
                          className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
                          title="Hapus">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* ════════════ TAB: PENDAFTARAN ════════════ */}
      {tab === "pendaftaran" && (
        <div className="space-y-5">
          {/* Pilih event */}
          <div className="glass-card rounded-2xl p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50 mb-3">Pilih Event</p>
            {mlEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground/50">Belum ada event dengan game type ML.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {mlEvents.map(ev => (
                  <button key={ev.id} onClick={() => loadRegs(ev)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all",
                      selEvent?.id === ev.id
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    )}>
                    ⚔️ {ev.title}
                    {ev.registrationopen && (
                      <span className="rounded-full bg-green-500/20 px-1.5 py-0.5 text-[9px] font-black text-green-400">BUKA</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selEvent && (
            <>
              {/* Stats pendaftaran + toggle buka/tutup */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Total",    value: regCounts.total,    cls: "text-foreground" },
                    { label: "Tunggu",   value: regCounts.pending,  cls: "text-yellow-400" },
                    { label: "Diterima", value: regCounts.approved, cls: "text-green-400" },
                    { label: "Ditolak",  value: regCounts.rejected, cls: "text-red-400" },
                  ].map(s => (
                    <div key={s.label} className="glass-card rounded-xl px-4 py-3 text-center">
                      <p className={cn("text-xl font-black", s.cls)}>{s.value}</p>
                      <p className="text-[11px] text-muted-foreground/40">{s.label}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => toggleRegOpen(selEvent)}
                  disabled={!!saving}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-bold transition-all",
                    selEvent.registrationopen
                      ? "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      : "border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                  )}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" />
                    : selEvent.registrationopen ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                  {selEvent.registrationopen ? "Tutup Pendaftaran" : "Buka Pendaftaran"}
                </button>
              </div>

              {/* Reject modal */}
              {rejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                  <div className="glass-card w-full max-w-sm rounded-2xl p-6 space-y-4 border border-border/60">
                    <h2 className="font-bold">Tolak Pendaftaran</h2>
                    <p className="text-sm text-muted-foreground/70">Tim: <span className="font-semibold text-foreground">{rejectModal.teamname}</span></p>
                    <textarea
                      value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                      placeholder="Alasan penolakan (opsional)..." rows={3} maxLength={300}
                      className="w-full resize-none rounded-xl border border-border/60 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/40 transition-all" />
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setRejectModal(null)} className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Batal
                      </button>
                      <button onClick={() => review(rejectModal.id, "rejected", rejectReason)} disabled={!!reviewing}
                        className="flex items-center gap-1.5 rounded-xl bg-red-500/80 px-4 py-2 text-xs font-bold text-white hover:bg-red-500 transition-colors disabled:opacity-50">
                        Tolak
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* List pendaftar */}
              {regsLoad ? (
                <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" /> Memuat pendaftaran...
                </div>
              ) : regs.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <p className="text-3xl mb-3">📋</p>
                  <p className="text-sm text-muted-foreground/50">Belum ada yang mendaftar</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {regs.map((reg, idx) => {
                    const statusCfg = {
                      pending:  { cls: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30", label: "Menunggu" },
                      approved: { cls: "text-green-400 bg-green-400/10 border-green-400/30",   label: "Diterima" },
                      rejected: { cls: "text-red-400 bg-red-400/10 border-red-400/30",         label: "Ditolak"  },
                    }[reg.status];
                    return (
                      <div key={reg.id} className="glass-card rounded-2xl p-5 space-y-4">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-3">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-black text-primary">{idx + 1}</span>
                            {reg.teamlogourl && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={reg.teamlogourl} alt="" className="h-8 w-8 rounded-lg object-cover" />
                            )}
                            <div>
                              <p className="font-bold">{reg.teamname}</p>
                              {(reg.contactname || reg.contactdiscord) && (
                                <p className="text-xs text-muted-foreground/50">
                                  {[reg.contactname, reg.contactdiscord].filter(Boolean).join(" · ")}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={cn("flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold", statusCfg.cls)}>
                              {statusCfg.label}
                            </span>
                            {reg.status === "pending" && (
                              <>
                                <button onClick={() => review(reg.id, "approved")} disabled={!!reviewing}
                                  className="flex items-center gap-1 rounded-xl bg-green-500/15 border border-green-500/30 px-3 py-1.5 text-xs font-bold text-green-400 hover:bg-green-500/25 transition-colors disabled:opacity-50">
                                  {reviewing === reg.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "✓"} Terima
                                </button>
                                <button onClick={() => setRejectModal({ id: reg.id, teamname: reg.teamname })} disabled={!!reviewing}
                                  className="flex items-center gap-1 rounded-xl bg-red-500/15 border border-red-500/30 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/25 transition-colors disabled:opacity-50">
                                  ✕ Tolak
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        {/* Payment proof */}
                        {reg.paymentproof && (
                          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 flex items-center justify-between gap-3">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400/60 mb-1">Bukti Pembayaran</p>
                              <p className="text-xs text-foreground/60 truncate max-w-xs">{reg.paymentproof}</p>
                            </div>
                            <a href={reg.paymentproof} target="_blank" rel="noopener noreferrer"
                              className="flex-shrink-0 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-colors">
                              Lihat ↗
                            </a>
                          </div>
                        )}
                        {reg.rejectreason && (
                          <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5">
                            <p className="text-[10px] text-red-400/60 mb-0.5">Alasan Tolak</p>
                            <p className="text-xs text-red-400/80">{reg.rejectreason}</p>
                          </div>
                        )}
                        <p className="text-[10px] text-muted-foreground/25 text-right font-mono">
                          {reg.id.slice(0, 8).toUpperCase()} · {new Date(reg.createdat).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
