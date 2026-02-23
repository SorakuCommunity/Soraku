"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Plus, Pencil, Trash2, Loader2, Users2 } from "lucide-react";
import { useAuthRole } from "@/hooks/useAuthRole";
import { hasPermission } from "@/lib/roles";
import type { Vtuber } from "@/components/VtuberCard";

export default function AdminVtuberPage() {
  const { role } = useAuthRole();
  const [vtubers, setVtubers] = useState<Vtuber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Vtuber | null>(null);
  const [form, setForm] = useState({ name: "", bio: "", avatar_url: "", generation: 1, agency: "", social_links: "{}" });
  const [submitting, setSubmitting] = useState(false);

  const fetchVtubers = async () => {
    const res = await fetch("/api/vtuber");
    const data = await res.json();
    setVtubers(data.vtubers || []);
    setLoading(false);
  };

  useEffect(() => { fetchVtubers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let social_links = {};
      try { social_links = JSON.parse(form.social_links); } catch {}
      const method = editing ? "PATCH" : "POST";
      const url = editing ? `/api/vtuber/${editing.id}` : "/api/vtuber";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, social_links }),
      });
      if (res.ok) {
        setShowForm(false);
        setEditing(null);
        setForm({ name: "", bio: "", avatar_url: "", generation: 1, agency: "", social_links: "{}" });
        fetchVtubers();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus VTuber ini?")) return;
    await fetch(`/api/vtuber/${id}`, { method: "DELETE" });
    fetchVtubers();
  };

  const canCreate = role && hasPermission(role, "vtuber_create");
  const canDelete = role && hasPermission(role, "vtuber_delete");

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-light-base/60 hover:text-primary transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-light-base">Kelola VTuber</h1>
          </div>
          {canCreate && (
            <button onClick={() => { setShowForm(true); setEditing(null); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-xl text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" /> Tambah VTuber
            </button>
          )}
        </div>

        {showForm && (
          <div className="glass rounded-2xl p-6 border border-white/10 mb-8">
            <h3 className="font-semibold text-light-base mb-4">{editing ? "Edit VTuber" : "Tambah VTuber"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Nama VTuber *" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-dark-3 border border-white/10 text-light-base text-sm focus:outline-none focus:border-primary" />
                <input type="number" placeholder="Generasi" min={1} max={10} value={form.generation}
                  onChange={(e) => setForm({ ...form, generation: parseInt(e.target.value) })}
                  className="px-3 py-2 rounded-lg bg-dark-3 border border-white/10 text-light-base text-sm focus:outline-none focus:border-primary" />
              </div>
              <input type="url" placeholder="URL Avatar" value={form.avatar_url}
                onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-dark-3 border border-white/10 text-light-base text-sm focus:outline-none focus:border-primary" />
              <input type="text" placeholder="Agensi (opsional)" value={form.agency}
                onChange={(e) => setForm({ ...form, agency: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-dark-3 border border-white/10 text-light-base text-sm focus:outline-none focus:border-primary" />
              <textarea placeholder="Bio VTuber" rows={3} value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-dark-3 border border-white/10 text-light-base text-sm focus:outline-none focus:border-primary resize-none" />
              <div>
                <label className="block text-xs text-light-base/60 mb-1">Social Links (JSON format)</label>
                <input type="text" placeholder='{"twitter":"https://...","youtube":"https://..."}'
                  value={form.social_links}
                  onChange={(e) => setForm({ ...form, social_links: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-dark-3 border border-white/10 text-light-base text-sm focus:outline-none focus:border-primary" />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={submitting}
                  className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2 glass border border-white/10 text-light-base/60 rounded-lg text-sm hover:text-light-base transition-colors">
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : vtubers.length === 0 ? (
          <div className="text-center py-20 text-light-base/40">
            <Users2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Belum ada VTuber</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {vtubers.map((vtuber) => (
              <div key={vtuber.id} className="glass rounded-xl p-4 border border-white/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-dark-3 flex-shrink-0">
                  {vtuber.avatar_url ? (
                    <Image src={vtuber.avatar_url} alt={vtuber.name} width={48} height={48} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-white font-bold">
                      {vtuber.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-light-base text-sm truncate">{vtuber.name}</h3>
                  <p className="text-xs text-primary">Generasi {vtuber.generation}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {canCreate && (
                    <button onClick={() => { setEditing(vtuber); setForm({ name: vtuber.name, bio: vtuber.bio || "", avatar_url: vtuber.avatar_url || "", generation: vtuber.generation, agency: vtuber.agency || "", social_links: JSON.stringify(vtuber.social_links || {}) }); setShowForm(true); }}
                      className="w-8 h-8 rounded-lg glass flex items-center justify-center text-light-base/60 hover:text-primary transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {canDelete && (
                    <button onClick={() => handleDelete(vtuber.id)}
                      className="w-8 h-8 rounded-lg glass flex items-center justify-center text-light-base/60 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
