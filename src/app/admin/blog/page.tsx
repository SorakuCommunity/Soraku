"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, Pencil, Trash2, Loader2, FileText } from "lucide-react";
import { useAuthRole } from "@/hooks/useAuthRole";
import { hasPermission } from "@/lib/roles";
import { formatDate } from "@/lib/utils";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  author_name: string | null;
  created_at: string;
}

export default function AdminBlogPage() {
  const { role } = useAuthRole();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState({ title: "", content: "", excerpt: "", featured_image: "", status: "draft" });
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = async () => {
    const res = await fetch("/api/blog?status=all");
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const method = editing ? "PATCH" : "POST";
      const url = editing ? `/api/blog/${editing.id}` : "/api/blog";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowForm(false);
        setEditing(null);
        setForm({ title: "", content: "", excerpt: "", featured_image: "", status: "draft" });
        fetchPosts();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus artikel ini?")) return;
    await fetch(`/api/blog/${id}`, { method: "DELETE" });
    fetchPosts();
  };

  const canCreate = role && hasPermission(role, "blog_create");
  const canDelete = role && hasPermission(role, "blog_delete");

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-light-base/60 hover:text-primary transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-light-base">Kelola Blog</h1>
          </div>
          {canCreate && (
            <button
              onClick={() => { setShowForm(true); setEditing(null); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Artikel Baru
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="glass rounded-2xl p-6 border border-white/10 mb-8">
            <h3 className="font-semibold text-light-base mb-4">
              {editing ? "Edit Artikel" : "Artikel Baru"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Judul artikel *"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-dark-3 border border-white/10 text-light-base text-sm focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder="Excerpt (ringkasan)"
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-dark-3 border border-white/10 text-light-base text-sm focus:outline-none focus:border-primary"
              />
              <input
                type="url"
                placeholder="URL Featured Image"
                value={form.featured_image}
                onChange={(e) => setForm({ ...form, featured_image: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-dark-3 border border-white/10 text-light-base text-sm focus:outline-none focus:border-primary"
              />
              <textarea
                placeholder="Konten artikel *"
                required
                rows={8}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-dark-3 border border-white/10 text-light-base text-sm focus:outline-none focus:border-primary resize-none"
              />
              <div className="flex items-center gap-3">
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-dark-3 border border-white/10 text-light-base text-sm focus:outline-none focus:border-primary"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 glass border border-white/10 text-light-base/60 rounded-lg text-sm hover:text-light-base transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Post list */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-light-base/40">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Belum ada artikel</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="glass rounded-xl p-4 border border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-light-base text-sm">{post.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${post.status === "published" ? "bg-green-400/20 text-green-400" : "bg-gray-400/20 text-gray-400"}`}>
                      {post.status}
                    </span>
                    <span className="text-xs text-light-base/40">{formatDate(post.created_at)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {canCreate && (
                    <button
                      onClick={() => { setEditing(post); setForm({ title: post.title, content: "", excerpt: "", featured_image: "", status: post.status }); setShowForm(true); }}
                      className="w-8 h-8 rounded-lg glass flex items-center justify-center text-light-base/60 hover:text-primary transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="w-8 h-8 rounded-lg glass flex items-center justify-center text-light-base/60 hover:text-red-400 transition-colors"
                    >
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
