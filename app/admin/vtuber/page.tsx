"use client";

import { Plus, Edit, Trash2 } from "lucide-react";

const MOCK_VTUBERS = [
  { id: "1", name: "Sakura Hana", generation: "gen-1", avatar_url: null },
  { id: "2", name: "Yuki Arashi", generation: "gen-1", avatar_url: null },
  { id: "3", name: "Aoi Tsukimi", generation: "gen-2", avatar_url: null },
];

export default function AdminVtuberPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-white mb-1">Vtuber Manager</h1>
          <p className="text-secondary">Kelola talent Vtuber dari setiap generasi.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} />
          Tambah Vtuber
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_VTUBERS.map((vt) => (
          <div key={vt.id} className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-display text-lg shrink-0">
              {vt.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium truncate">{vt.name}</div>
              <div className="text-secondary text-xs capitalize">{vt.generation.replace("-", " ")}</div>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="p-1.5 glass rounded text-secondary hover:text-primary transition-colors">
                <Edit size={14} />
              </button>
              <button className="p-1.5 glass rounded text-secondary hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {/* Add new card */}
        <button className="glass border-2 border-dashed border-white/10 rounded-xl p-5 flex items-center justify-center gap-3 text-secondary hover:text-primary hover:border-primary/30 transition-all">
          <Plus size={20} />
          Tambah Talent Baru
        </button>
      </div>
    </div>
  );
}
