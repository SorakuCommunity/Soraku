'use client'
// app/Admin/blogs/AdminBlogsClient.tsx — SORAKU v1.0.a3.4
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Eye, EyeOff, Trash2, X, Save, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  published: boolean
  published_at: string | null
  created_at: string
  cover_image: string | null
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const inputClass = 'w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 min-h-[44px]'
const inputStyle = { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }

export function AdminBlogsClient({ posts: initial, authorId }: { posts: Post[]; authorId: string }) {
  const [posts, setPosts]   = useState(initial)
  const [editing, setEditing] = useState<Partial<Post> | null>(null)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const openNew = () => setEditing({ title: '', slug: '', excerpt: '', published: false, cover_image: '' })
  const openEdit = (p: Post) => setEditing({ ...p })

  const handleSave = async () => {
    if (!editing?.title?.trim() || !editing?.slug?.trim()) {
      toast.error('Title dan slug wajib diisi')
      return
    }
    setSaving(true)
    const isNew = !editing.id
    const payload = {
      title:       editing.title,
      slug:        editing.slug,
      excerpt:     editing.excerpt || null,
      cover_image: editing.cover_image || null,
      published:   editing.published ?? false,
      published_at: editing.published ? (editing.published_at || new Date().toISOString()) : null,
      author_id:   authorId,
    }
    if (isNew) {
      const { data, error } = await supabase.from('blog_posts').insert(payload).select().single()
      if (error) { toast.error(error.message); setSaving(false); return }
      setPosts(prev => [data as Post, ...prev])
      toast.success('Artikel dibuat!')
    } else {
      const { data, error } = await supabase.from('blog_posts').update(payload).eq('id', editing.id!).select().single()
      if (error) { toast.error(error.message); setSaving(false); return }
      setPosts(prev => prev.map(p => p.id === editing.id ? data as Post : p))
      toast.success('Artikel diperbarui!')
    }
    setEditing(null)
    setSaving(false)
  }

  const togglePublish = async (post: Post) => {
    const newVal = !post.published
    const { error } = await supabase.from('blog_posts').update({
      published: newVal,
      published_at: newVal ? new Date().toISOString() : null,
    }).eq('id', post.id)
    if (error) { toast.error(error.message); return }
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, published: newVal } : p))
    toast.success(newVal ? 'Dipublish!' : 'Disembunyikan.')
  }

  const deletePost = async (id: string) => {
    if (!confirm('Hapus artikel ini?')) return
    const { error } = await supabase.from('blog_posts').delete().eq('id', id)
    if (error) { toast.error(error.message); return }
    setPosts(prev => prev.filter(p => p.id !== id))
    toast.success('Artikel dihapus.')
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Blog</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-sub)' }}>{posts.length} artikel</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
          style={{ backgroundColor: 'var(--color-primary)' }}>
          <Plus size={15} /> Artikel Baru
        </button>
      </div>

      {/* Post List */}
      {posts.length === 0 ? (
        <div className="text-center py-20">
          <FileText size={36} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-sub)' }} />
          <p style={{ color: 'var(--text-sub)' }}>Belum ada artikel.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map(post => (
            <div key={post.id}
              className="flex items-center gap-3 p-4 rounded-xl border transition-all hover:bg-white/[0.02]"
              style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${post.published ? 'bg-green-400' : 'bg-yellow-400'}`} />
                  <p className="font-medium text-sm truncate" style={{ color: 'var(--text)' }}>{post.title}</p>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
                  /{post.slug} · {format(new Date(post.created_at), 'd MMM yyyy', { locale: idLocale })}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => togglePublish(post)} title={post.published ? 'Sembunyikan' : 'Publish'}
                  className="p-2 rounded-lg transition-all hover:bg-white/10"
                  style={{ color: post.published ? '#22c55e' : '#eab308' }}>
                  {post.published ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button onClick={() => openEdit(post)} title="Edit"
                  className="p-2 rounded-lg transition-all hover:bg-white/10"
                  style={{ color: 'var(--text-sub)' }}>
                  <Edit2 size={15} />
                </button>
                <button onClick={() => deletePost(post.id)} title="Hapus"
                  className="p-2 rounded-lg transition-all hover:bg-red-500/10"
                  style={{ color: '#ef4444' }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {editing !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
            onClick={() => !saving && setEditing(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-lg rounded-2xl border p-6 space-y-4"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'rgba(255,255,255,0.12)' }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h2 className="font-bold" style={{ color: 'var(--text)' }}>
                  {editing.id ? 'Edit Artikel' : 'Artikel Baru'}
                </h2>
                <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-white/10"
                  style={{ color: 'var(--text-sub)' }}><X size={16} /></button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-sub)' }}>Judul *</label>
                  <input value={editing.title ?? ''} onChange={e => setEditing(prev => ({
                    ...prev!, title: e.target.value,
                    slug: prev?.id ? prev.slug : slugify(e.target.value),
                  }))} placeholder="Judul artikel" className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-sub)' }}>Slug *</label>
                  <input value={editing.slug ?? ''} onChange={e => setEditing(p => ({ ...p!, slug: e.target.value }))}
                    placeholder="url-artikel" className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-sub)' }}>Excerpt</label>
                  <textarea value={editing.excerpt ?? ''} onChange={e => setEditing(p => ({ ...p!, excerpt: e.target.value }))}
                    placeholder="Ringkasan singkat..." rows={2} className={inputClass + ' resize-none'} style={{ ...inputStyle, minHeight: 'auto' }} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-sub)' }}>Cover Image URL</label>
                  <input value={editing.cover_image ?? ''} onChange={e => setEditing(p => ({ ...p!, cover_image: e.target.value }))}
                    placeholder="https://..." className={inputClass} style={inputStyle} />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editing.published ?? false}
                    onChange={e => setEditing(p => ({ ...p!, published: e.target.checked }))}
                    className="w-4 h-4 accent-[var(--color-primary)]" />
                  <span className="text-sm" style={{ color: 'var(--text)' }}>Langsung publish</span>
                </label>
              </div>

              <div className="flex gap-2 pt-1">
                <button onClick={() => setEditing(null)} disabled={saving}
                  className="flex-1 py-2.5 rounded-xl border text-sm font-medium"
                  style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text-sub)' }}>
                  Batal
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                  style={{ backgroundColor: 'var(--color-primary)' }}>
                  {saving ? <div className="w-4 h-4 border-2 rounded-full animate-spin border-white border-t-transparent" />
                    : <><Save size={14} /> Simpan</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
