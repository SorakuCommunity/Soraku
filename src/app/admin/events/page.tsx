"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, Pencil, Trash2, Loader2, Calendar } from "lucide-react";
import { useAuthRole } from "@/hooks/useAuthRole";
import { hasPermission } from "@/lib/roles";
import { formatDate } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  status: string;
  start_date: string;
  end_date: string | null;
}

export default function AdminEventsPage() {
  const { role } = useAuthRole();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState({ title: "", description: "", banner_image: "", start_date: "", end_date: "", status: "upcoming" });
  const [submitting, setSubmitting] = useState(false);

  const fetchEvents = async () => {
    const res = await fetch("/api/events");
    const data = await res.json();
    setEvents(data.events || []);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const method = editing ? "PATCH" : "POST";
      const url = editing ? `/api/events/${editing.id}` : "/api/events";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowForm(false);
        setEditing(null);
        setForm({ title: "", description: "", banner_image: "", start_date: "", end_date: "", status: "upcoming" });
        fetchEvents();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus event ini?")) return;
    await fetch(`/api/events/${id}`, { method: "DELETE" });
    fetchEvents();
  };

  const canCreate = role && hasPermission(role, "event_create");
  const canDelete = role && hasPermission(role, "event_delete");

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-light-base/60 hover:text-primary transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-light-base">Kelola Events</h1>
          </div>
          {canCreate && (
            <button
              onClick={() => { setShowForm(true); setEditing(null); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Event Baru
            </button>
          )}
        </div>

        {showForm && (
          <div className="glass rounded-2xl p-6 border border-white/10 mb-8">
            <h3 className="font-semibold text-light-base mb-4">{editing ? "Edit Event" : "Event Baru"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Judul event *" required value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-dark-3 border border-white/10 text-light-base text-sm focus:outline-none focus:border-primary" />
              <textarea placeholder="Deskripsi event *" required rows={4} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-dark-3 border border-white/10 text-light-base text-sm focus:outline-none focus:border-primary resize-none" />
              <input type="url" placeholder="URL Banner Image" value={form.banner_image}
                onChange={(e) => setForm({ ...form, banner_image: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-dark-3 border border-white/10 text-light-base text-sm focus:outline-none focus:border-primary" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-light-base/60 mb-1">Tanggal Mulai *</label>
                  <input type="datetime-local" required value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-dark-3 border border-white/10 text-light-base text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs text-light-base/60 mb-1">Tanggal Selesai</label>
                  <input type="datetime-local" value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-dark-3 border border-white/10 text-light-base text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-dark-3 border border-white/10 text-light-base text-sm focus:outline-none focus:border-primary">
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="ended">Ended</option>
                </select>
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
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-light-base/40">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Belum ada event</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="glass rounded-xl p-4 border border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-light-base text-sm">{event.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${event.status === "ongoing" ? "bg-green-400/20 text-green-400" : event.status === "upcoming" ? "bg-yellow-400/20 text-yellow-400" : "bg-gray-400/20 text-gray-400"}`}>
                      {event.status}
                    </span>
                    <span className="text-xs text-light-base/40">{formatDate(event.start_date)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {canCreate && (
                    <button onClick={() => { setEditing(event); setShowForm(true); }}
                      className="w-8 h-8 rounded-lg glass flex items-center justify-center text-light-base/60 hover:text-primary transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {canDelete && (
                    <button onClick={() => handleDelete(event.id)}
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
