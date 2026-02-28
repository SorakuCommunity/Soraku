'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminShell } from '@/components/admin/AdminShell'
import { ALL_ROLES, ROLE_LABELS, ROLE_COLORS, hasRole } from '@/lib/roles'
import { toast } from 'sonner'
import {
  Shield, TrendingUp, Users, Image, FileText, CheckCircle,
  XCircle, Trash2, Plus, Edit, Search, X, Settings, Star,
  Calendar,
} from 'lucide-react'
import type { User, GalleryItem, BlogPost, Event, VtuberProfile, SiteSetting, UserRole } from '@/types'

// ─── Utils ───────────────────────────────────────────────────────────────────
function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const inputCls = 'w-full glass border border-soraku-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 bg-transparent placeholder:text-soraku-sub'
const labelCls = 'block text-xs font-medium text-soraku-sub mb-1'

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: number | string; color: string
}) {
  return (
    <div className="glass rounded-2xl p-6">
      <Icon className={`w-8 h-8 ${color} mb-3 opacity-80`} />
      <div className="font-display text-3xl font-bold">{value}</div>
      <div className="text-soraku-sub text-sm mt-1">{label}</div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const supabase = createClient()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Dashboard stats
  const [stats, setStats] = useState({ users: 0, gallery: 0, pending: 0, posts: 0 })

  // Users
  const [users, setUsers] = useState<User[]>([])
  const [userSearch, setUserSearch] = useState('')

  // Gallery
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  // Blog
  const [posts, setPosts] = useState<BlogPost[]>([])
  const BLOG_DEFAULT = { title: '', slug: '', thumbnail: '', content: '', tags: '', status: 'draft' as 'draft' | 'published', editId: '' }
  const [blogForm, setBlogForm] = useState(BLOG_DEFAULT)

  // Events
  const [events, setEvents] = useState<Event[]>([])
  const EVENT_DEFAULT = { title: '', description: '', banner_url: '', start_date: '', end_date: '', editId: '' }
  const [eventForm, setEventForm] = useState(EVENT_DEFAULT)

  // VTubers
  const [vtubers, setVtubers] = useState<VtuberProfile[]>([])
  const VT_DEFAULT = { name: '', generation: '', avatar_url: '', description: '', twitter: '', youtube: '', twitch: '', instagram: '', tiktok: '', editId: '' }
  const [vtForm, setVtForm] = useState(VT_DEFAULT)

  // Settings
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [settingsDirty, setSettingsDirty] = useState(false)

  // ─── Init ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()
      if (profile) setCurrentUser(profile as User)

      const [{ count: uc }, { count: gc }, { count: pc }, { count: bc }] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('gallery').select('*', { count: 'exact', head: true }),
        supabase.from('gallery').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }).is('deleted_at', null),
      ])
      setStats({ users: uc ?? 0, gallery: gc ?? 0, pending: pc ?? 0, posts: bc ?? 0 })
      setLoading(false)
    }
    init()
  }, [supabase])

  // ─── Load tab data ────────────────────────────────────────────────────────

  const loadTab = useCallback(async (tab: string) => {
    if (tab === 'users') {
      const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false })
      setUsers((data ?? []) as User[])
    }
    if (tab === 'gallery') {
      const { data } = await supabase
        .from('gallery')
        .select('*, users(display_name, username, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(60)
      setGallery((data ?? []) as GalleryItem[])
    }
    if (tab === 'blog') {
      const { data } = await supabase
        .from('blog_posts')
        .select('*, users(display_name)')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
      setPosts((data ?? []) as BlogPost[])
    }
    if (tab === 'events') {
      const { data } = await supabase.from('events').select('*').order('start_date', { ascending: false })
      setEvents((data ?? []) as Event[])
    }
    if (tab === 'vtubers') {
      const { data } = await supabase.from('vtubers').select('*').order('created_at', { ascending: false })
      setVtubers((data ?? []) as VtuberProfile[])
    }
    if (tab === 'settings') {
      const { data } = await supabase.from('site_settings').select('*').order('key')
      setSettings((data ?? []) as SiteSetting[])
    }
  }, [supabase])

  // ─── User management ──────────────────────────────────────────────────────

  const updateRole = async (userId: string, role: UserRole) => {
    const { error } = await supabase.from('users').update({ role }).eq('id', userId)
    if (error) { toast.error('Gagal update role: ' + error.message); return }
    toast.success('Role diperbarui')
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u))
  }

  // ─── Gallery moderation ───────────────────────────────────────────────────

  const moderateGallery = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase.from('gallery').update({ status }).eq('id', id)
    if (error) { toast.error('Gagal: ' + error.message); return }
    toast.success(status === 'approved' ? '✅ Disetujui' : '❌ Ditolak')
    setGallery(prev => prev.map(g => g.id === id ? { ...g, status } : g))
  }

  const deleteGallery = async (id: string) => {
    const { error } = await supabase.from('gallery').delete().eq('id', id)
    if (error) { toast.error('Gagal hapus: ' + error.message); return }
    toast.success('Gambar dihapus')
    setGallery(prev => prev.filter(g => g.id !== id))
  }

  // ─── Blog CRUD ────────────────────────────────────────────────────────────

  const saveBlog = async () => {
    if (!blogForm.title.trim()) { toast.error('Judul wajib diisi'); return }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { toast.error('Belum login'); return }

    const tags = blogForm.tags.split(',').map(t => t.trim()).filter(Boolean)
    const payload = {
      title: blogForm.title,
      slug: blogForm.slug || slugify(blogForm.title),
      thumbnail: blogForm.thumbnail || null,
      content: blogForm.content,
      tags,
      status: blogForm.status,
      updated_at: new Date().toISOString(),
    }

    if (blogForm.editId) {
      // FIX: explicit WHERE clause ensures correct row update
      const { error } = await supabase
        .from('blog_posts')
        .update(payload)
        .eq('id', blogForm.editId)
        .select()
        .single()
      if (error) { toast.error('Gagal update: ' + error.message); return }
      toast.success('Post diperbarui!')
    } else {
      const { error } = await supabase
        .from('blog_posts')
        .insert({ ...payload, author_id: user.id })
      if (error) { toast.error('Gagal simpan: ' + error.message); return }
      toast.success('Post dibuat!')
    }

    // Reset form AFTER successful save
    setBlogForm(BLOG_DEFAULT)
    await loadTab('blog')
  }

  const editBlog = (p: BlogPost) => {
    setBlogForm({
      title: p.title,
      slug: p.slug,
      thumbnail: p.thumbnail ?? '',
      content: p.content,
      tags: (p.tags ?? []).join(', '),
      status: p.status,
      editId: p.id,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteBlog = async (id: string) => {
    const { error } = await supabase
      .from('blog_posts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    if (error) { toast.error('Gagal hapus'); return }
    toast.success('Post dihapus')
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  // ─── Event CRUD ───────────────────────────────────────────────────────────

  const saveEvent = async () => {
    if (!eventForm.title.trim() || !eventForm.start_date || !eventForm.end_date) {
      toast.error('Judul, tanggal mulai, dan selesai wajib diisi')
      return
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const payload = {
      title: eventForm.title,
      description: eventForm.description || null,
      banner_url: eventForm.banner_url || null,
      start_date: eventForm.start_date,
      end_date: eventForm.end_date,
    }

    if (eventForm.editId) {
      const { error } = await supabase
        .from('events')
        .update(payload)
        .eq('id', eventForm.editId)
      if (error) { toast.error('Gagal update: ' + error.message); return }
      toast.success('Event diperbarui!')
    } else {
      const { error } = await supabase
        .from('events')
        .insert({ ...payload, created_by: user.id })
      if (error) { toast.error('Gagal buat event: ' + error.message); return }
      // Discord notification via API
      fetch('/api/discord/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: eventForm.title, description: eventForm.description, startDate: eventForm.start_date, endDate: eventForm.end_date }),
      }).catch(() => {})
      toast.success('Event dibuat!')
    }

    setEventForm(EVENT_DEFAULT)
    await loadTab('events')
  }

  const editEvent = (e: Event) => {
    setEventForm({
      title: e.title,
      description: e.description ?? '',
      banner_url: e.banner_url ?? '',
      start_date: e.start_date,
      end_date: e.end_date,
      editId: e.id,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteEvent = async (id: string) => {
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) { toast.error('Gagal hapus'); return }
    toast.success('Event dihapus')
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  // ─── VTuber CRUD ──────────────────────────────────────────────────────────

  const saveVtuber = async () => {
    if (!vtForm.name.trim()) { toast.error('Nama wajib diisi'); return }

    const payload = {
      name: vtForm.name,
      generation: vtForm.generation || null,
      avatar_url: vtForm.avatar_url || null,
      description: vtForm.description || null,
      twitter: vtForm.twitter || null,
      youtube: vtForm.youtube || null,
      twitch: vtForm.twitch || null,
      instagram: vtForm.instagram || null,
      tiktok: vtForm.tiktok || null,
    }

    if (vtForm.editId) {
      const { error } = await supabase
        .from('vtubers')
        .update(payload)
        .eq('id', vtForm.editId)
      if (error) { toast.error('Gagal update: ' + error.message); return }
      toast.success('VTuber diperbarui!')
    } else {
      const { error } = await supabase.from('vtubers').insert(payload)
      if (error) { toast.error('Gagal tambah: ' + error.message); return }
      toast.success('VTuber ditambahkan!')
    }

    setVtForm(VT_DEFAULT)
    await loadTab('vtubers')
  }

  const editVtuber = (v: VtuberProfile) => {
    setVtForm({
      name: v.name,
      generation: v.generation ?? '',
      avatar_url: v.avatar_url ?? '',
      description: v.description ?? '',
      twitter: v.twitter ?? '',
      youtube: v.youtube ?? '',
      twitch: v.twitch ?? '',
      instagram: v.instagram ?? '',
      tiktok: v.tiktok ?? '',
      editId: v.id,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteVtuber = async (id: string) => {
    const { error } = await supabase.from('vtubers').delete().eq('id', id)
    if (error) { toast.error('Gagal hapus'); return }
    toast.success('VTuber dihapus')
    setVtubers(prev => prev.filter(v => v.id !== id))
  }

  // ─── Settings ─────────────────────────────────────────────────────────────

  const getSetting = (key: string, fallback = '') =>
    settings.find(s => s.key === key)?.value ?? fallback

  const updateSetting = (key: string, value: string) => {
    setSettings(prev =>
      prev.some(s => s.key === key)
        ? prev.map(s => s.key === key ? { ...s, value } : s)
        : [...prev, { key, value }]
    )
    setSettingsDirty(true)
  }

  const saveAllSettings = async () => {
    for (const s of settings) {
      await supabase
        .from('site_settings')
        .upsert({ key: s.key, value: s.value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    }
    toast.success('✅ Semua pengaturan disimpan')
    setSettingsDirty(false)
  }

  // ─── Loading state ────────────────────────────────────────────────────────

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="glass rounded-2xl p-8 text-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-soraku-sub">Memuat Admin Panel...</p>
      </div>
    </div>
  )

  if (!currentUser || !hasRole(currentUser.role, 'ADMIN')) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="glass rounded-2xl p-8 text-center">
        <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="font-semibold mb-2">Akses Ditolak</p>
        <p className="text-soraku-sub text-sm">Kamu tidak memiliki izin untuk mengakses halaman ini.</p>
      </div>
    </div>
  )

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen pt-24 pb-16">
      <AdminShell
        user={currentUser}
        onTabChange={loadTab}
        tabs={[
          { key: 'dashboard', label: 'Dashboard', icon: TrendingUp },
          { key: 'users', label: 'Users', icon: Users },
          { key: 'gallery', label: 'Gallery', icon: Image },
          { key: 'blog', label: 'Blog', icon: FileText },
          { key: 'events', label: 'Events', icon: Calendar },
          { key: 'vtubers', label: 'VTuber', icon: Star },
          { key: 'settings', label: 'Pengaturan', icon: Settings },
        ]}
      >
        {(tab) => {

          /* ─── DASHBOARD ─── */
          if (tab === 'dashboard') return (
            <div>
              <h2 className="font-semibold text-xl mb-6">Dashboard</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard icon={Users} label="Total Users" value={stats.users} color="text-blue-400" />
                <StatCard icon={Image} label="Karya Gallery" value={stats.gallery} color="text-pink-400" />
                <StatCard icon={FileText} label="Pending Review" value={stats.pending} color="text-yellow-400" />
                <StatCard icon={FileText} label="Blog Posts" value={stats.posts} color="text-green-400" />
              </div>
              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold mb-2">Soraku v1.0.a3</h3>
                <p className="text-soraku-sub text-sm">RBAC aktif · Redis + BullMQ · RLS production-grade</p>
              </div>
            </div>
          )

          /* ─── USERS ─── */
          if (tab === 'users') return (
            <div>
              <h2 className="font-semibold text-xl mb-6">User Management</h2>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soraku-sub" />
                <input
                  type="text"
                  placeholder="Cari username, email..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className={`${inputCls} pl-9`}
                />
              </div>
              <div className="space-y-2">
                {users
                  .filter(u => !userSearch || u.username?.includes(userSearch) || u.email?.includes(userSearch) || u.display_name?.toLowerCase().includes(userSearch.toLowerCase()))
                  .map(u => (
                    <div key={u.id} className="glass rounded-xl p-4 flex items-center gap-4">
                      {u.avatar_url
                        ? <img src={u.avatar_url} alt="" className="w-9 h-9 rounded-full shrink-0" />
                        : <div className="w-9 h-9 rounded-full bg-purple-500/20 shrink-0" />
                      }
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{u.display_name ?? u.username ?? u.email}</p>
                        <p className="text-soraku-sub text-xs truncate">{u.email}</p>
                      </div>
                      <select
                        value={u.role}
                        onChange={e => updateRole(u.id, e.target.value as UserRole)}
                        disabled={u.id === currentUser?.id}
                        className={`glass border border-soraku-border rounded-lg px-2 py-1 text-xs bg-soraku-dark text-soraku-text focus:outline-none ${u.id === currentUser?.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {ALL_ROLES.map(r => (
                          <option key={r} value={r} className="bg-soraku-card">
                            {ROLE_LABELS[r]}
                          </option>
                        ))}
                      </select>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${ROLE_COLORS[u.role]}`}>
                        {ROLE_LABELS[u.role]}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )

          /* ─── GALLERY ─── */
          if (tab === 'gallery') {
            const filtered = gallery.filter(g => galleryFilter === 'all' ? true : g.status === galleryFilter)
            return (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-xl">Gallery Moderation</h2>
                  <div className="flex gap-2">
                    {(['pending', 'approved', 'rejected', 'all'] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => setGalleryFilter(s)}
                        className={`text-xs px-3 py-1.5 rounded-full border capitalize transition-colors ${
                          galleryFilter === s
                            ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                            : 'glass border-soraku-border text-soraku-sub hover:border-purple-500/50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map(item => (
                    <div key={item.id} className={`glass rounded-xl overflow-hidden border ${
                      item.status === 'approved' ? 'border-green-500/30' :
                      item.status === 'rejected' ? 'border-red-500/30' : 'border-yellow-500/30'
                    }`}>
                      <div className="relative h-36">
                        <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                        <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium ${
                          item.status === 'approved' ? 'bg-green-500 text-white' :
                          item.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'
                        }`}>{item.status}</span>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-soraku-sub line-clamp-1 mb-2">{item.caption ?? 'No caption'}</p>
                        <div className="flex gap-2">
                          {item.status !== 'approved' && (
                            <button onClick={() => moderateGallery(item.id, 'approved')}
                              className="flex-1 flex items-center justify-center gap-1 bg-green-500/20 border border-green-500/30 text-green-400 py-1.5 rounded-lg text-xs hover:bg-green-500/30">
                              <CheckCircle className="w-3 h-3" />OK
                            </button>
                          )}
                          {item.status !== 'rejected' && (
                            <button onClick={() => moderateGallery(item.id, 'rejected')}
                              className="flex-1 flex items-center justify-center gap-1 bg-red-500/20 border border-red-500/30 text-red-400 py-1.5 rounded-lg text-xs hover:bg-red-500/30">
                              <XCircle className="w-3 h-3" />Tolak
                            </button>
                          )}
                          <button onClick={() => deleteGallery(item.id)}
                            className="px-2 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          /* ─── BLOG ─── */
          if (tab === 'blog') return (
            <div>
              <h2 className="font-semibold text-xl mb-6">Blog Manager</h2>
              {/* Form */}
              <div className="glass rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{blogForm.editId ? '✏️ Edit Post' : '+ Post Baru'}</h3>
                  {blogForm.editId && (
                    <button onClick={() => setBlogForm(BLOG_DEFAULT)} className="text-soraku-sub hover:text-soraku-text">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Judul *</label>
                    <input value={blogForm.title} onChange={e => setBlogForm(p => ({
                      ...p, title: e.target.value, slug: p.editId ? p.slug : slugify(e.target.value)
                    }))} placeholder="Judul artikel" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Slug *</label>
                    <input value={blogForm.slug} onChange={e => setBlogForm(p => ({ ...p, slug: e.target.value }))} placeholder="slug-artikel" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Thumbnail URL</label>
                    <input value={blogForm.thumbnail} onChange={e => setBlogForm(p => ({ ...p, thumbnail: e.target.value }))} type="url" placeholder="https://..." className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Tags (pisah koma)</label>
                    <input value={blogForm.tags} onChange={e => setBlogForm(p => ({ ...p, tags: e.target.value }))} placeholder="anime, review, top10" className={inputCls} />
                  </div>
                </div>
                <div className="mb-4">
                  <label className={labelCls}>Konten *</label>
                  <textarea value={blogForm.content} onChange={e => setBlogForm(p => ({ ...p, content: e.target.value }))} rows={6} className={`${inputCls} resize-none`} placeholder="Tulis konten..." />
                </div>
                <div className="flex items-center gap-4">
                  <select value={blogForm.status} onChange={e => setBlogForm(p => ({ ...p, status: e.target.value as 'draft' | 'published' }))}
                    className="glass border border-soraku-border rounded-xl px-4 py-2.5 text-sm bg-soraku-dark text-soraku-text focus:outline-none">
                    <option value="draft" className="bg-soraku-card">Draft</option>
                    <option value="published" className="bg-soraku-card">Published</option>
                  </select>
                  <button onClick={saveBlog} className="bg-soraku-gradient text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">
                    {blogForm.editId ? 'Update Post' : 'Publish Post'}
                  </button>
                </div>
              </div>
              {/* List */}
              <div className="space-y-2">
                {posts.map(p => (
                  <div key={p.id} className="glass rounded-xl p-4 flex items-center gap-4">
                    {p.thumbnail && <img src={p.thumbnail} alt="" className="w-14 h-10 rounded-lg object-cover shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{p.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>{p.status}</span>
                        <span className="text-soraku-sub text-xs">{formatDate(p.created_at)}</span>
                      </div>
                    </div>
                    <button onClick={() => editBlog(p)} className="text-soraku-sub hover:text-blue-400 transition-colors p-1"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => deleteBlog(p.id)} className="text-soraku-sub hover:text-red-400 transition-colors p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          )

          /* ─── EVENTS ─── */
          if (tab === 'events') return (
            <div>
              <h2 className="font-semibold text-xl mb-6">Events Manager</h2>
              <div className="glass rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{eventForm.editId ? '✏️ Edit Event' : '+ Event Baru'}</h3>
                  {eventForm.editId && <button onClick={() => setEventForm(EVENT_DEFAULT)}><X className="w-4 h-4 text-soraku-sub" /></button>}
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Judul *</label>
                    <input value={eventForm.title} onChange={e => setEventForm(p => ({ ...p, title: e.target.value }))} className={inputCls} placeholder="Judul event" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Deskripsi</label>
                    <textarea value={eventForm.description} onChange={e => setEventForm(p => ({ ...p, description: e.target.value }))} rows={2} className={`${inputCls} resize-none`} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Banner URL</label>
                    <input value={eventForm.banner_url} onChange={e => setEventForm(p => ({ ...p, banner_url: e.target.value }))} type="url" className={inputCls} placeholder="https://..." />
                  </div>
                  <div>
                    <label className={labelCls}>Tanggal Mulai *</label>
                    <input value={eventForm.start_date} onChange={e => setEventForm(p => ({ ...p, start_date: e.target.value }))} type="datetime-local" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Tanggal Selesai *</label>
                    <input value={eventForm.end_date} onChange={e => setEventForm(p => ({ ...p, end_date: e.target.value }))} type="datetime-local" className={inputCls} />
                  </div>
                </div>
                <button onClick={saveEvent} className="bg-soraku-gradient text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">
                  {eventForm.editId ? 'Update Event' : '🚀 Buat Event'}
                </button>
              </div>
              <div className="space-y-2">
                {events.map(e => (
                  <div key={e.id} className="glass rounded-xl p-4 flex items-center gap-4">
                    {e.banner_url && <img src={e.banner_url} alt="" className="w-14 h-10 rounded-lg object-cover shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{e.title}</p>
                      <p className="text-soraku-sub text-xs">{formatDate(e.start_date)} → {formatDate(e.end_date)}</p>
                    </div>
                    <button onClick={() => editEvent(e)} className="text-soraku-sub hover:text-blue-400 p-1"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => deleteEvent(e.id)} className="text-soraku-sub hover:text-red-400 p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          )

          /* ─── VTUBERS ─── */
          if (tab === 'vtubers') return (
            <div>
              <h2 className="font-semibold text-xl mb-6">VTuber Manager</h2>
              <div className="glass rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{vtForm.editId ? '✏️ Edit VTuber' : '+ Tambah VTuber'}</h3>
                  {vtForm.editId && <button onClick={() => setVtForm(VT_DEFAULT)}><X className="w-4 h-4 text-soraku-sub" /></button>}
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div><label className={labelCls}>Nama *</label><input value={vtForm.name} onChange={e => setVtForm(p => ({ ...p, name: e.target.value }))} className={inputCls} placeholder="Nama VTuber" /></div>
                  <div><label className={labelCls}>Generasi</label><input value={vtForm.generation} onChange={e => setVtForm(p => ({ ...p, generation: e.target.value }))} className={inputCls} placeholder="Gen 1" /></div>
                  <div><label className={labelCls}>Avatar URL</label><input value={vtForm.avatar_url} onChange={e => setVtForm(p => ({ ...p, avatar_url: e.target.value }))} type="url" className={inputCls} placeholder="https://..." /></div>
                  <div><label className={labelCls}>Twitter</label><input value={vtForm.twitter} onChange={e => setVtForm(p => ({ ...p, twitter: e.target.value }))} type="url" className={inputCls} placeholder="https://twitter.com/..." /></div>
                  <div><label className={labelCls}>YouTube</label><input value={vtForm.youtube} onChange={e => setVtForm(p => ({ ...p, youtube: e.target.value }))} type="url" className={inputCls} /></div>
                  <div><label className={labelCls}>Twitch</label><input value={vtForm.twitch} onChange={e => setVtForm(p => ({ ...p, twitch: e.target.value }))} type="url" className={inputCls} /></div>
                  <div><label className={labelCls}>Instagram</label><input value={vtForm.instagram} onChange={e => setVtForm(p => ({ ...p, instagram: e.target.value }))} type="url" className={inputCls} /></div>
                  <div><label className={labelCls}>TikTok</label><input value={vtForm.tiktok} onChange={e => setVtForm(p => ({ ...p, tiktok: e.target.value }))} type="url" className={inputCls} /></div>
                  <div className="sm:col-span-2"><label className={labelCls}>Deskripsi</label><textarea value={vtForm.description} onChange={e => setVtForm(p => ({ ...p, description: e.target.value }))} rows={2} className={`${inputCls} resize-none`} /></div>
                </div>
                <button onClick={saveVtuber} className="bg-soraku-gradient text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">
                  {vtForm.editId ? 'Update VTuber' : 'Tambah VTuber'}
                </button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {vtubers.map(v => (
                  <div key={v.id} className="glass rounded-xl overflow-hidden">
                    {v.avatar_url && <img src={v.avatar_url} alt={v.name} className="w-full h-32 object-cover" />}
                    <div className="p-4">
                      <p className="font-semibold">{v.name}</p>
                      {v.generation && <p className="text-xs text-soraku-sub mb-3">{v.generation}</p>}
                      <div className="flex gap-2">
                        <button onClick={() => editVtuber(v)} className="flex-1 text-xs py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30">Edit</button>
                        <button onClick={() => deleteVtuber(v.id)} className="flex-1 text-xs py-1.5 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30">Hapus</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )

          /* ─── SETTINGS ─── */
          if (tab === 'settings') return (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-xl">Pengaturan Situs</h2>
                {settingsDirty && (
                  <span className="text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 px-3 py-1 rounded-full">Ada perubahan belum tersimpan</span>
                )}
              </div>

              {/* General */}
              <section className="glass rounded-2xl p-6 mb-6">
                <h3 className="font-semibold mb-4">🌐 General</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[['site_name', 'Nama Website', 'Soraku'], ['tagline', 'Tagline', 'Komunitas Anime & Manga'], ['logo_url', 'Logo URL', ''], ['discord_invite', 'Discord Invite URL', 'https://discord.gg/...']].map(([k, l, ph]) => (
                    <div key={k}>
                      <label className={labelCls}>{l}</label>
                      <input value={getSetting(k, ph)} onChange={e => updateSetting(k, e.target.value)} placeholder={ph} className={inputCls} />
                    </div>
                  ))}
                </div>
              </section>

              {/* Founder */}
              <section className="glass rounded-2xl p-6 mb-6">
                <h3 className="font-semibold mb-4">👑 Founder</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[['founder_name', 'Nama Founder', ''], ['founder_bio', 'Bio Founder', ''], ['founder_avatar', 'Avatar URL Founder', '']].map(([k, l, ph]) => (
                    <div key={k} className={k === 'founder_bio' ? 'sm:col-span-2' : ''}>
                      <label className={labelCls}>{l}</label>
                      <input value={getSetting(k, '')} onChange={e => updateSetting(k, e.target.value)} placeholder={ph} className={inputCls} />
                    </div>
                  ))}
                </div>
              </section>

              {/* Login background */}
              <section className="glass rounded-2xl p-6 mb-6">
                <h3 className="font-semibold mb-4">🎨 Login Page</h3>
                <div>
                  <label className={labelCls}>Background URL (kosong = default)</label>
                  <input value={getSetting('login_bg_url', '')} onChange={e => updateSetting('login_bg_url', e.target.value)} placeholder="https://..." className={inputCls} />
                </div>
              </section>

              {/* Theme */}
              <section className="glass rounded-2xl p-6 mb-6">
                <h3 className="font-semibold mb-4">🎨 Theme</h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  {[['primary_color', 'Primary Color', '#7C3AED'], ['accent_color', 'Accent Color', '#EC4899']].map(([k, l, def]) => (
                    <div key={k}>
                      <label className={labelCls}>{l}</label>
                      <div className="flex gap-2">
                        <input type="color" value={getSetting(k, def)} onChange={e => updateSetting(k, e.target.value)} className="w-10 h-10 rounded-lg border border-soraku-border cursor-pointer bg-transparent" />
                        <input value={getSetting(k, def)} onChange={e => updateSetting(k, e.target.value)} className={`${inputCls} flex-1`} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-6">
                  {[['neon_enabled', 'Neon Glow'], ['enable_glass', 'Glass UI']].map(([k, l]) => (
                    <label key={k} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={getSetting(k, 'true') !== 'false'} onChange={e => updateSetting(k, String(e.target.checked))} className="w-4 h-4 accent-purple-500" />
                      <span className="text-sm">{l}</span>
                    </label>
                  ))}
                </div>
              </section>

              {/* System */}
              <section className="glass rounded-2xl p-6 mb-6">
                <h3 className="font-semibold mb-4">⚙️ System</h3>
                <div className="space-y-4">
                  {[['maintenance_mode', 'Maintenance Mode', 'false'], ['enable_registration', 'Enable Registrasi', 'true']].map(([k, l, def]) => (
                    <label key={k} className="flex items-center justify-between">
                      <span className="text-sm">{l}</span>
                      <input type="checkbox" checked={getSetting(k, def) === 'true'} onChange={e => updateSetting(k, String(e.target.checked))} className="w-4 h-4 accent-purple-500" />
                    </label>
                  ))}
                  {getSetting('maintenance_mode') === 'true' && (
                    <div>
                      <label className={labelCls}>Pesan Maintenance</label>
                      <input value={getSetting('maintenance_message', 'Sedang dalam perbaikan...')} onChange={e => updateSetting('maintenance_message', e.target.value)} className={inputCls} />
                    </div>
                  )}
                </div>
              </section>

              {/* Integrations */}
              <section className="glass rounded-2xl p-6 mb-8">
                <h3 className="font-semibold mb-4">🔌 Integrasi</h3>
                <div className="space-y-3">
                  {[['enable_github_discussion', 'GitHub Discussion'], ['enable_spotify', 'Spotify Player'], ['enable_discord_stats', 'Discord Stats'], ['enable_premium', 'Premium Features']].map(([k, l]) => (
                    <label key={k} className="flex items-center justify-between">
                      <span className="text-sm">{l}</span>
                      <input type="checkbox" checked={getSetting(k, 'true') !== 'false'} onChange={e => updateSetting(k, String(e.target.checked))} className="w-4 h-4 accent-purple-500" />
                    </label>
                  ))}
                </div>
              </section>

              <button onClick={saveAllSettings} className="bg-soraku-gradient text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90">
                💾 Simpan Semua Pengaturan
              </button>
            </div>
          )

          return null
        }}
      </AdminShell>
    </div>
  )
}
