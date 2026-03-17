"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, CheckCircle2, XCircle, Loader2, Clock,
  Users, Shield, ExternalLink, RefreshCw, DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Player { name: string; role?: string; nickname?: string }

interface Registration {
  id:             string;
  teamname:       string;
  teamlogourl:    string | null;
  activeplayers:  Player[];
  reserveplayers: Player[];
  contactname:    string | null;
  contactdiscord: string | null;
  status:         "pending" | "approved" | "rejected";
  paymentstatus:  "none" | "pending" | "confirmed" | "rejected";
  paymentproof:   string | null;
  rejectreason:   string | null;
  notes:          string | null;
  createdat:      string;
}

interface EventInfo { id: string; title: string }

const STATUS_BADGE: Record<string, { cls: string; label: string; icon: React.ElementType }> = {
  pending:  { cls: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30", label: "Menunggu", icon: Clock },
  approved: { cls: "text-green-400 bg-green-400/10 border-green-400/30",   label: "Diterima", icon: CheckCircle2 },
  rejected: { cls: "text-red-400 bg-red-400/10 border-red-400/30",         label: "Ditolak",  icon: XCircle },
}

export default function EventRegistrationsPage() {
  const params  = useParams();
  const eventId = params.id as string;

  const [event, setEvent]       = useState<EventInfo | null>(null);
  const [regs,  setRegs]        = useState<Registration[]>([]);
  const [loading, setLoading]   = useState(true);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ id: string; teamname: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    // Cari slug event berdasarkan id
    const evRes  = await fetch("/api/admin/events");
    const evData = await evRes.json();
    const ev     = (evData?.data ?? []).find((e: any) => e.id === eventId);
    if (!ev) { setLoading(false); return; }
    setEvent(ev);

    const res  = await fetch(`/api/events/${ev.slug}/register`);
    const json = await res.json();
    setRegs(json?.data?.registrations ?? []);
    setLoading(false);
  }, [eventId]);

  useEffect(() => { load(); }, [load]);

  // slug di-cache dari event state
  const getSlug = () => (event as any)?.slug ?? "";

  const review = async (regId: string, status: "approved" | "rejected", reason?: string) => {
    setReviewing(regId);
    const slug = getSlug();
    await fetch(`/api/events/${slug}/register/${regId}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ status, rejectreason: reason }),
    });
    setRegs(prev => prev.map(r => r.id === regId ? { ...r, status } : r));
    setReviewing(null);
    setRejectModal(null);
    setRejectReason("");
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
    </div>
  );

  const counts = { total: regs.length, approved: regs.filter(r => r.status === "approved").length, pending: regs.filter(r => r.status === "pending").length, rejected: regs.filter(r => r.status === "rejected").length };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/events"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Pendaftaran</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{event?.title}</p>
          </div>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: counts.total, cls: "text-foreground" },
          { label: "Menunggu", value: counts.pending,  cls: "text-yellow-400" },
          { label: "Diterima", value: counts.approved, cls: "text-green-400" },
          { label: "Ditolak",  value: counts.rejected, cls: "text-red-400" },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-2xl px-4 py-3 text-center">
            <p className={cn("text-2xl font-black", s.cls)}>{s.value}</p>
            <p className="text-xs text-muted-foreground/50">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Reject modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-sm rounded-2xl p-6 space-y-4">
            <h2 className="font-bold">Tolak Pendaftaran</h2>
            <p className="text-sm text-muted-foreground/70">Tim: <span className="font-semibold text-foreground">{rejectModal.teamname}</span></p>
            <textarea
              value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              placeholder="Alasan penolakan (opsional)..."
              rows={3} maxLength={300}
              className="w-full resize-none rounded-xl border border-border/60 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/40 transition-all"
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setRejectModal(null)} className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                Batal
              </button>
              <button
                onClick={() => review(rejectModal.id, "rejected", rejectReason)}
                disabled={!!reviewing}
                className="flex items-center gap-1.5 rounded-xl bg-red-500/80 px-4 py-2 text-xs font-bold text-white hover:bg-red-500 transition-colors disabled:opacity-50">
                {reviewing === rejectModal.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                Tolak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {regs.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-muted-foreground/50 text-sm">Belum ada pendaftar</p>
        </div>
      ) : (
        <div className="space-y-3">
          {regs.map((reg, idx) => {
            const badge = STATUS_BADGE[reg.status];
            return (
              <div key={reg.id} className="glass-card rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  {/* Team info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-black text-primary">
                      {idx + 1}
                    </span>
                    {reg.teamlogourl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={reg.teamlogourl} alt="" className="h-8 w-8 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="font-bold truncate">{reg.teamname}</p>
                      <p className="text-[11px] text-muted-foreground/50">
                        {reg.contactname}{reg.contactdiscord ? ` · ${reg.contactdiscord}` : ""}
                      </p>
                    </div>
                  </div>

                  {/* Status + Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={cn("flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold", badge.cls)}>
                      <badge.icon className="h-3 w-3" /> {badge.label}
                    </span>
                    {reg.status === "pending" && (
                      <>
                        <button
                          onClick={() => review(reg.id, "approved")}
                          disabled={!!reviewing}
                          className="flex items-center gap-1 rounded-xl bg-green-500/15 border border-green-500/30 px-3 py-1.5 text-xs font-bold text-green-400 hover:bg-green-500/25 transition-colors disabled:opacity-50">
                          {reviewing === reg.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                          Terima
                        </button>
                        <button
                          onClick={() => setRejectModal({ id: reg.id, teamname: reg.teamname })}
                          disabled={!!reviewing}
                          className="flex items-center gap-1 rounded-xl bg-red-500/15 border border-red-500/30 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/25 transition-colors disabled:opacity-50">
                          <XCircle className="h-3 w-3" /> Tolak
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Players + Payment */}
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/50 mb-1.5">
                      Pemain Aktif ({reg.activeplayers?.length ?? 0})
                    </p>
                    <div className="space-y-0.5">
                      {(reg.activeplayers ?? []).map((p, i) => (
                        <p key={i} className="text-xs text-foreground/70">
                          <span className="text-primary/50">{i+1}.</span> {p.name}
                          {p.nickname ? ` "${p.nickname}"` : ""}
                          {p.role ? <span className="text-foreground/30"> — {p.role}</span> : ""}
                        </p>
                      ))}
                    </div>
                    {(reg.reserveplayers ?? []).length > 0 && (
                      <>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-500/50 mb-1.5 mt-2">
                          Cadangan ({reg.reserveplayers.length})
                        </p>
                        {reg.reserveplayers.map((p, i) => (
                          <p key={i} className="text-xs text-foreground/60">C{i+1}. {p.name}{p.role ? ` — ${p.role}` : ""}</p>
                        ))}
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    {reg.notes && (
                      <div className="rounded-xl border border-border/30 bg-card/20 px-3 py-2">
                        <p className="text-[10px] text-muted-foreground/40 mb-0.5">Catatan</p>
                        <p className="text-xs text-foreground/60">{reg.notes}</p>
                      </div>
                    )}
                    {reg.paymentproof && (
                      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2">
                        <p className="flex items-center gap-1 text-[10px] text-amber-400/60 mb-1">
                          <DollarSign className="h-3 w-3" /> Bukti Bayar
                        </p>
                        <a href={reg.paymentproof} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors">
                          Lihat Bukti <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                    {reg.rejectreason && (
                      <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2">
                        <p className="text-[10px] text-red-400/60 mb-0.5">Alasan Tolak</p>
                        <p className="text-xs text-red-400/80">{reg.rejectreason}</p>
                      </div>
                    )}
                    <p className="text-[10px] text-muted-foreground/25 text-right font-mono">
                      ID: {reg.id.slice(0,8).toUpperCase()} · {new Date(reg.createdat).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
