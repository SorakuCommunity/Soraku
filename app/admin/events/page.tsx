"use client";

import { Plus, Edit, Trash2 } from "lucide-react";

const MOCK_EVENTS = [
  { id: "1", title: "Soraku Watch Party", status: "upcoming", start_date: new Date(Date.now() + 7 * 86400000).toISOString() },
  { id: "2", title: "Fan Art Contest", status: "upcoming", start_date: new Date(Date.now() + 14 * 86400000).toISOString() },
  { id: "3", title: "Manga Reading Club", status: "completed", start_date: new Date(Date.now() - 3 * 86400000).toISOString() },
];

const STATUS_STYLES = {
  upcoming: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  ongoing: "bg-green-500/20 text-green-400 border-green-500/30",
  completed: "bg-secondary/20 text-secondary border-secondary/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function AdminEventsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-white mb-1">Events Manager</h1>
          <p className="text-secondary">Buat dan kelola event komunitas.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} />
          Buat Event
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left p-4 text-secondary text-sm font-medium">Event</th>
              <th className="text-left p-4 text-secondary text-sm font-medium">Status</th>
              <th className="text-left p-4 text-secondary text-sm font-medium">Tanggal</th>
              <th className="text-left p-4 text-secondary text-sm font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_EVENTS.map((event) => (
              <tr key={event.id} className="border-b border-white/5 hover:bg-white/2">
                <td className="p-4 text-white text-sm font-medium">{event.title}</td>
                <td className="p-4">
                  <span className={`badge text-xs ${STATUS_STYLES[event.status as keyof typeof STATUS_STYLES]}`}>
                    {event.status}
                  </span>
                </td>
                <td className="p-4 text-secondary text-sm">
                  {new Date(event.start_date).toLocaleDateString("id-ID")}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 glass rounded text-secondary hover:text-primary transition-colors">
                      <Edit size={14} />
                    </button>
                    <button className="p-1.5 glass rounded text-secondary hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
