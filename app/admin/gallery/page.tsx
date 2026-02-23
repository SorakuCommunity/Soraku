"use client";

import { Check, X, Eye } from "lucide-react";

const MOCK_GALLERY = [
  { id: "1", caption: "Karya fan art Naruto", user: "user_123", status: "pending" },
  { id: "2", caption: "Cosplay Rem Re:Zero", user: "user_456", status: "pending" },
  { id: "3", caption: "Screenshot anime terbaru", user: "user_789", status: "pending" },
];

export default function AdminGalleryPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-white mb-1">Gallery Moderation</h1>
        <p className="text-secondary">Approve atau reject karya yang diupload member.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MOCK_GALLERY.map((item) => (
          <div key={item.id} className="glass-card overflow-hidden">
            {/* Image placeholder */}
            <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/5 flex items-center justify-center">
              <span className="text-5xl opacity-20">🖼️</span>
            </div>

            <div className="p-4">
              <p className="text-white text-sm font-medium mb-1">{item.caption}</p>
              <p className="text-secondary text-xs mb-4">@{item.user}</p>

              <div className="flex items-center justify-between">
                <span className="badge text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  Pending
                </span>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 glass rounded text-secondary hover:text-primary transition-colors">
                    <Eye size={14} />
                  </button>
                  <button className="p-1.5 bg-green-500/20 rounded text-green-400 hover:bg-green-500/30 transition-colors border border-green-500/30">
                    <Check size={14} />
                  </button>
                  <button className="p-1.5 bg-red-500/20 rounded text-red-400 hover:bg-red-500/30 transition-colors border border-red-500/30">
                    <X size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {MOCK_GALLERY.length === 0 && (
        <div className="glass-card p-12 text-center">
          <p className="text-secondary">Tidak ada konten yang menunggu persetujuan.</p>
        </div>
      )}
    </div>
  );
}
