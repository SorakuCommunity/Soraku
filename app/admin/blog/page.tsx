"use client";

import { Plus, Edit, Trash2, Eye } from "lucide-react";

const MOCK_POSTS = [
  { id: "1", title: "10 Anime Terbaik Season Ini", published: true, tags: ["Anime"], created_at: new Date().toISOString() },
  { id: "2", title: "Review Manga Frieren", published: true, tags: ["Manga"], created_at: new Date().toISOString() },
  { id: "3", title: "Draft: Tutorial Fan Art", published: false, tags: ["Art"], created_at: new Date().toISOString() },
];

export default function AdminBlogPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-white mb-1">Blog Manager</h1>
          <p className="text-secondary">Kelola artikel dan konten blog Soraku.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} />
          Tulis Artikel
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left p-4 text-secondary text-sm font-medium">Judul</th>
              <th className="text-left p-4 text-secondary text-sm font-medium">Status</th>
              <th className="text-left p-4 text-secondary text-sm font-medium">Tags</th>
              <th className="text-left p-4 text-secondary text-sm font-medium">Tanggal</th>
              <th className="text-left p-4 text-secondary text-sm font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_POSTS.map((post) => (
              <tr key={post.id} className="border-b border-white/5 hover:bg-white/2">
                <td className="p-4 text-white text-sm font-medium">{post.title}</td>
                <td className="p-4">
                  <span className={`badge text-xs ${post.published ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-secondary/20 text-secondary border-secondary/30"}`}>
                    {post.published ? "Dipublish" : "Draft"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-1.5">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">{tag}</span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-secondary text-sm">
                  {new Date(post.created_at).toLocaleDateString("id-ID")}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 glass rounded text-secondary hover:text-primary transition-colors">
                      <Eye size={14} />
                    </button>
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
