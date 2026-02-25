'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminShell } from '@/components/admin/AdminShell'
import { hasAdminAccess, getRoleBadgeColor, formatDate, slugify } from '@/lib/utils'
import { toast } from 'sonner'
import { Shield, TrendingUp, Users, Image, FileText, CheckCircle, XCircle, Trash2, Plus, Edit, Search } from 'lucide-react'
import type { User, GalleryItem, BlogPost, Event, VtuberProfile, SiteSetting, UserRole } from '@/types'

const ALL_ROLES: UserRole[] = ['USER', 'AGENSI', 'ADMIN', 'MANAGER', 'OWNER']

const inputCls = "w-full glass border border-soraku-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 bg-transparent placeholder:text-soraku-sub"
const labelCls = "block text-xs font-medium text-soraku-sub mb-1"

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number | string; color: string }) {
  return (
    <div className="glass rounded-2xl p-6">
      <Icon className={`w-8 h-8 ${color} mb-3 opacity-80`} />
      <div className="font-display text-3xl font-bold">{value}</div>
      <div className="text-soraku-sub text-sm mt-1">{label}</div>
    </div>
  )
}

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

  // Blog
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [blogForm, setBlogForm] = useState({ title: '', slug: '', thumbnail: '', content: '', tags: '', status: 'draft' as 'draft' | 'published', editId: '' })

  // Events
  const [events, setEvents] = useState<Event[]>([])
  const [eventForm, setEventForm] = useState({ title: '', description: '', banner_url: '', start_date: '', end_date: '', editId: '' })

  // VTubers
  const [vtubers, setVtubers] = useState<VtuberProfile[]>([])
  const [vtForm, setVtForm] = useState({ name: '', generation: '', avatar_url: '', description: '', twitter: '', youtube: '', twitch: '', instagram: '', tiktok: '', editId: '' })

  // Settings
  const [settings, setSettings] = useState<SiteSetting[]>([])

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

  const loadTab = useCallback(async (tab: string) => {
    if (tab === 'users') {
      const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false })
      setUsers((data ?? []) as User[])
    }
    if (tab === 'gallery') {
      const { data } = await supabase.from('gallery').select('*, users(display_name,username)').order('created_at', { ascending: false })
      setGallery((data ?? []) as GalleryItem[])
    }
    if (tab === 'blog') {
      const { data } = await supabase.from('blog_posts').select('*, users(display_name)').is('deleted_at', null).order('created_at', { ascending: false })
      setPosts((data ?? []) as BlogPost[])
    }
    if (tab === 'events') {
      const { data } = await supabase.from('events').select('*').order('start_date', { ascending: true })
      setEvents((data ?? []) as Event[])
    }
    if (tab === 'vtubers') {
      const { data } = await supabase.from('vtubers').select('*').order('created_at', { ascending: false })
      setVtubers((data ?? []) as VtuberProfile[])
    }
    if (tab === 'settings') {
      const { data } = await supabase.from('site_settings').select('*')
      setSettings((data ?? []) as SiteSetting[])
    }
  }, [supabase])

  const updateRole = async (userId: string, role: UserRole) => {
    const { error } = await supabase.from('users').update({ role }).eq('id', userId)
    if (error) { toast.error('Gagal update role'); return }
    toast.success('Role diperbarui')
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u))
  }

  const moderateGallery = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase.from('gallery').update({ status }).eq('id', id)
    if (error) { toast.error('Gagal'); return }
    toast.success(status === 'approved' ? '✅ Disetujui' : '❌ Ditolak')
    setGallery(prev => prev.map(g => g.id === id ? { ...g, status } : g))
  }

  const saveBlog = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const tags = blogForm.tags.split(',').map(t => t.trim()).filter(Boolean)
    const payload = { title: blogForm.title, slug: blogForm.slug || slugify(blogForm.title), thumbnail: blogForm.thumbnail || null, content: blogForm.content, tags, status: blogForm.status }

    if (blogForm.editId) {
      const { error } = await supabase.from('blog_posts').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', blogForm.editId)
      if (error) { toast.error('Gagal update'); return }
      toast.success('Post diperbarui!')
    } else {
      const { error } = await supabase.from('blog_posts').insert({ ...payload, author_id: user.id })
      if (error) { toast.error('Gagal simpan'); return }
      toast.success('Post dibuat!')
    }
    setBlogForm({ title: '', slug: '', thumbnail: '', content: '', tags: '', status: 'draft', editId: '' })
    loadTab('blog')
  }

  const deleteBlog = async (id: string) => {
    await supabase.from('blog_posts').update({ deleted_at: new Date().toISOString() }).eq('id', id)
    toast.success('Post dihapus'); loadTab('blog')
  }

  const saveEvent = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const payload = { title: eventForm.title, description: eventForm.description || null, banner_url: eventForm.banner_url || null, start_date: eventForm.start_date, end_date: eventForm.end_date }

    if (eventForm.editId) {
      const { error } = await supabase.from('events').update(payload).eq('id', eventForm.editId)
      if (error) { toast.error('Gagal'); return }
      toast.success('Event diperbarui!')
    } else {
      const { error } = await supabase.from('events').insert({ ...payload, created_by: user.id })
      if (error) { toast.error('Gagal'); return }
      // Discord webhook
      if (process.env.NEXT_PUBLIC_SITE_URL) {
        fetch('/api/discord/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: eventForm.title, description: eventForm.description, startDate: eventForm.start_date, endDate: eventForm.end_date }),
        }).catch(console.error)
      }
      toast.success('Event dibuat & Discord dikirim!')
    }
    setEventForm({ title: '', description: '', banner_url: '', start_date: '', end_date: '', editId: '' })
    loadTab('events')
  }

  const deleteEvent = async (id: string) => {
    await supabase.from('events').delete().eq('id', id)
    toast.success('Event dihapus'); loadTab('events')
  }

  const saveVtuber = async () => {
    const payload = {
      name: vtForm.name, generation: vtForm.generation || null, avatar_url: vtForm.avatar_url || null,
      description: vtForm.description || null, twitter: vtForm.twitter || null,
      youtube: vtForm.youtube || null, twitch: vtForm.twitch || null,
      instagram: vtForm.instagram || null, tiktok: vtForm.tiktok || null,
    }
    if (vtForm.editId) {
      await supabase.from('vtubers').update(payload).eq('id', vtForm.editId)
      toast.success('VTuber diperbarui!')
    } else {
      await supabase.from('vtubers').insert(payload)
      toast.success('VTuber ditambahkan!')
    }
    setVtForm({ name: '', generation: '', avatar_url: '', description: '', twitter: '', youtube: '', twitch: '', instagram: '', tiktok: '', editId: '' })
    loadTab('vtubers')
  }

  const deleteVtuber = async (id: string) => {
    await supabase.from('vtubers').delete().eq('id', id)
    toast.success('VTuber dihapus'); loadTab('vtubers')
  }

  const saveSetting = async (key: string, value: string) => {
    await supabase.from('site_settings').upsert({ key, value }, { onConflict: 'key' })
    toast.success('Pengaturan disimpan')
  }

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!currentUser || !hasAdminAccess(currentUser.role)) return (
    <div className="min-h-screen pt-24 flex items-center justify-center text-center">
      <div>
        <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-xl font-semibold">Akses Ditolak</p>
        <p className="text-soraku-sub mt-2">Kamu tidak memiliki izin.</p>
      </div>
    </div>
  )

  return (
    <div className="pt-16">
      <div className="bg-soraku-card border-b border-soraku-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold"><span className="grad-text">Soraku</span> Admin</h1>
          <p className="text-soraku-sub text-sm">Halo, {currentUser.display_name}!</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${getRoleBadgeColor(currentUser.role)}`}>{currentUser.role}</span>
      </div>

      <AdminShell role={currentUser.role}>
        {(tab) => {
          // Load data on tab change
          if (typeof window !== 'undefined') setTimeout(() => loadTab(tab), 0)

          /* ─── DASHBOARD ─── */
          if (tab === 'dashboard') return (
            <div>
              <h2 className="font-semibold text-xl mb-6">Dashboard</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard icon={Users} label="Total Pengguna" value={stats.users} color="text-purple-400" />
                <StatCard icon={FileText} label="Total Posts" value={stats.posts} color="text-blue-400" />
                <StatCard icon={Image} label="Total Gallery" value={stats.gallery} color="text-pink-400" />
                <StatCard icon={TrendingUp} label="Pending Moderasi" value={stats.pending} color="text-yellow-400" />
              </div>
              <div className="glass rounded-2xl p-8 text-center text-soraku-sub">
                <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>Analytics lebih lengkap akan hadir segera. Gunakan sidebar untuk mengelola konten.</p>
              </div>
            </div>
          )

          /* ─── USERS ─── */
          if (tab === 'users') return (
            <div>
              <h2 className="font-semibold text-xl mb-6">Manajemen Pengguna</h2>
              <div className="relative mb-5 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soraku-sub" />
                <input value={userSearch} onChange={e => setUserSearch(e.target.value)}
                  placeholder="Cari pengguna..." className={`${inputCls} pl-9`} />
              </div>
              <div className="space-y-2">
                {users.filter(u =>
                  !userSearch || u.display_name?.toLowerCase().includes(userSearch.toLowerCase())
                    || u.username?.toLowerCase().includes(userSearch.toLowerCase())
                    || u.email?.toLowerCase().includes(userSearch.toLowerCase())
                ).map(u => (
                  <div key={u.id} className="glass rounded-xl p-4 flex items-center gap-4">
                    {u.avatar_url
                      ? <img src={u.avatar_url} alt="" className="w-10 h-10 rounded-full shrink-0" />
                      : <div className="w-10 h-10 rounded-full bg-soraku-muted flex items-center justify-center font-bold shrink-0">{(u.display_name ?? 'U')[0]}</div>
                    }
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{u.display_name ?? 'No Name'}</p>
                      <p className="text-soraku-sub text-xs">@{u.username} · {u.email}</p>
                    </div>
                    {currentUser.role === 'OWNER' ? (
                      <select value={u.role} onChange={e => updateRole(u.id, e.target.value as UserRole)}
                        className="glass border border-soraku-border rounded-lg px-3 py-1.5 text-xs bg-transparent focus:outline-none focus:border-purple-500">
                        {ALL_ROLES.map(r => <option key={r} value={r} className="bg-soraku-card">{r}</option>)}
                      </select>
                    ) : (
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getRoleBadgeColor(u.role)}`}>{u.role}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )

          /* ─── BLOG ─── */
          if (tab === 'blog') return (
            <div>
              <h2 className="font-semibold text-xl mb-6">Blog Manager</h2>
              <div className="glass rounded-2xl p-6 mb-6">
                <h3 className="font-semibold mb-4">{blogForm.editId ? '✏️ Edit Post' : '+ Post Baru'}</h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelCls}>Judul *</label>
                    <input value={blogForm.title} onChange={e => setBlogForm(p => ({ ...p, title: e.target.value, slug: slugify(e.target.value) }))}
                      placeholder="Judul artikel" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Slug *</label>
                    <input value={blogForm.slug} onChange={e => setBlogForm(p => ({ ...p, slug: e.target.value }))}
                      placeholder="slug-artikel" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Thumbnail URL</label>
                    <input value={blogForm.thumbnail} onChange={e => setBlogForm(p => ({ ...p, thumbnail: e.target.value }))}
                      type="url" placeholder="https://..." className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Tags (pisah koma)</label>
                    <input value={blogForm.tags} onChange={e => setBlogForm(p => ({ ...p, tags: e.target.value }))}
                      placeholder="anime, review, top10" className={inputCls} />
                  </div>
                </div>
                <div className="mb-4">
                  <label className={labelCls}>Konten *</label>
                  <textarea value={blogForm.content} onChange={e => setBlogForm(p => ({ ...p, content: e.target.value }))}
                    rows={6} placeholder="Tulis konten artikel..." className={`${inputCls} resize-none`} />
                </div>
                <div className="flex items-center gap-4">
                  <select value={blogForm.status} onChange={e => setBlogForm(p => ({ ...p, status: e.target.value as 'draft' | 'published' }))}
                    className="glass border border-soraku-border rounded-xl px-4 py-2.5 text-sm bg-transparent focus:outline-none">
                    <option value="draft" className="bg-soraku-card">Draft</option>
                    <option value="published" className="bg-soraku-card">Published</option>
                  </select>
                  <button onClick={saveBlog}
                    className="bg-soraku-gradient text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">
                    {blogForm.editId ? 'Update Post' : 'Publish Post'}
                  </button>
                  {blogForm.editId && (
                    <button onClick={() => setBlogForm({ title: '', slug: '', thumbnail: '', content: '', tags: '', status: 'draft', editId: '' })}
                      className="text-soraku-sub hover:text-soraku-text text-sm px-4 py-2.5">Batal</button>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                {posts.map(p => (
                  <div key={p.id} className="glass rounded-xl p-4 flex items-center gap-4">
                    {p.thumbnail && <img src={p.thumbnail} alt="" className="w-16 h-12 rounded-lg object-cover shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{p.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>{p.status}</span>
                        <span className="text-soraku-sub text-xs">{formatDate(p.created_at)}</span>
                        {p.tags?.map(t => <span key={t} className="text-xs text-soraku-primary bg-purple-500/10 px-1.5 py-0.5 rounded-full">#{t}</span>)}
                      </div>
                    </div>
                    <button onClick={() => setBlogForm({ title: p.title, slug: p.slug, thumbnail: p.thumbnail ?? '', content: p.content, tags: p.tags?.join(', ') ?? '', status: p.status, editId: p.id })}
                      className="text-soraku-sub hover:text-blue-400 transition-colors"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => deleteBlog(p.id)} className="text-soraku-sub hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
                <h3 className="font-semibold mb-4">{eventForm.editId ? '✏️ Edit Event' : '+ Event Baru'}</h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Judul *</label>
                    <input value={eventForm.title} onChange={e => setEventForm(p => ({ ...p, title: e.target.value }))}
                      placeholder="Judul event" className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Deskripsi</label>
                    <textarea value={eventForm.description} onChange={e => setEventForm(p => ({ ...p, description: e.target.value }))}
                      rows={3} placeholder="Deskripsi event..." className={`${inputCls} resize-none`} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Banner URL</label>
                    <input value={eventForm.banner_url} onChange={e => setEventForm(p => ({ ...p, banner_url: e.target.value }))}
                      type="url" placeholder="https://..." className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Tanggal Mulai *</label>
                    <input value={eventForm.start_date} onChange={e => setEventForm(p => ({ ...p, start_date: e.target.value }))}
                      type="datetime-local" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Tanggal Selesai *</label>
                    <input value={eventForm.end_date} onChange={e => setEventForm(p => ({ ...p, end_date: e.target.value }))}
                      type="datetime-local" className={inputCls} />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={saveEvent}
                    className="bg-soraku-gradient text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">
                    {eventForm.editId ? 'Update Event' : '🚀 Buat & Kirim ke Discord'}
                  </button>
                  {eventForm.editId && (
                    <button onClick={() => setEventForm({ title: '', description: '', banner_url: '', start_date: '', end_date: '', editId: '' })}
                      className="text-soraku-sub text-sm px-4 py-2.5">Batal</button>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                {events.map(e => (
                  <div key={e.id} className="glass rounded-xl p-4 flex items-center gap-4">
                    {e.banner_url && <img src={e.banner_url} alt="" className="w-16 h-12 rounded-lg object-cover shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{e.title}</p>
                      <p className="text-soraku-sub text-xs">{formatDate(e.start_date)} → {formatDate(e.end_date)}</p>
                    </div>
                    <button onClick={() => setEventForm({ title: e.title, description: e.description ?? '', banner_url: e.banner_url ?? '', start_date: e.start_date, end_date: e.end_date, editId: e.id })}
                      className="text-soraku-sub hover:text-blue-400"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => deleteEvent(e.id)} className="text-soraku-sub hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
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
                <h3 className="font-semibold mb-4">{vtForm.editId ? '✏️ Edit VTuber' : '+ Tambah VTuber'}</h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div><label className={labelCls}>Nama *</label><input value={vtForm.name} onChange={e => setVtForm(p => ({ ...p, name: e.target.value }))} placeholder="Nama VTuber" className={inputCls} /></div>
                  <div><label className={labelCls}>Generasi</label><input value={vtForm.generation} onChange={e => setVtForm(p => ({ ...p, generation: e.target.value }))} placeholder="Gen 1" className={inputCls} /></div>
                  <div><label className={labelCls}>Avatar URL</label><input value={vtForm.avatar_url} onChange={e => setVtForm(p => ({ ...p, avatar_url: e.target.value }))} type="url" placeholder="https://..." className={inputCls} /></div>
                  <div><label className={labelCls}>Twitter</label><input value={vtForm.twitter} onChange={e => setVtForm(p => ({ ...p, twitter: e.target.value }))} type="url" placeholder="https://twitter.com/..." className={inputCls} /></div>
                  <div><label className={labelCls}>YouTube</label><input value={vtForm.youtube} onChange={e => setVtForm(p => ({ ...p, youtube: e.target.value }))} type="url" placeholder="https://youtube.com/..." className={inputCls} /></div>
                  <div><label className={labelCls}>Twitch</label><input value={vtForm.twitch} onChange={e => setVtForm(p => ({ ...p, twitch: e.target.value }))} type="url" placeholder="https://twitch.tv/..." className={inputCls} /></div>
                  <div className="sm:col-span-2"><label className={labelCls}>Deskripsi</label><textarea value={vtForm.description} onChange={e => setVtForm(p => ({ ...p, description: e.target.value }))} rows={2} className={`${inputCls} resize-none`} /></div>
                </div>
                <div className="flex gap-3">
                  <button onClick={saveVtuber} className="bg-soraku-gradient text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">{vtForm.editId ? 'Update' : 'Tambah VTuber'}</button>
                  {vtForm.editId && <button onClick={() => setVtForm({ name: '', generation: '', avatar_url: '', description: '', twitter: '', youtube: '', twitch: '', instagram: '', tiktok: '', editId: '' })} className="text-soraku-sub text-sm px-4">Batal</button>}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {vtubers.map(v => (
                  <div key={v.id} className="glass rounded-xl overflow-hidden">
                    {v.avatar_url && <img src={v.avatar_url} alt={v.name} className="w-full h-32 object-cover" />}
                    <div className="p-4">
                      <p className="font-semibold">{v.name}</p>
                      {v.generation && <p className="text-xs text-soraku-sub mb-3">{v.generation}</p>}
                      <div className="flex gap-2">
                        <button onClick={() => setVtForm({ name: v.name, generation: v.generation ?? '', avatar_url: v.avatar_url ?? '', description: v.description ?? '', twitter: v.twitter ?? '', youtube: v.youtube ?? '', twitch: v.twitch ?? '', instagram: v.instagram ?? '', tiktok: v.tiktok ?? '', editId: v.id })}
                          className="flex-1 text-xs py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-colors">Edit</button>
                        <button onClick={() => deleteVtuber(v.id)}
                          className="flex-1 text-xs py-1.5 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors">Hapus</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )

          /* ─── GALLERY MODERATION ─── */
          if (tab === 'gallery') return (
            <div>
              <h2 className="font-semibold text-xl mb-6">Gallery Moderation</h2>
              <div className="flex gap-3 mb-5">
                {(['all', 'pending', 'approved', 'rejected'] as const).map(s => (
                  <button key={s} className="text-xs px-3 py-1.5 glass rounded-full border border-soraku-border hover:border-purple-500/50 capitalize transition-colors">{s}</button>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {gallery.map(item => (
                  <div key={item.id} className={`glass rounded-xl overflow-hidden border ${
                    item.status === 'approved' ? 'border-green-500/30' :
                    item.status === 'rejected' ? 'border-red-500/30' : 'border-yellow-500/30'
                  }`}>
                    <div className="relative h-40">
                      <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          item.status === 'approved' ? 'bg-green-500 text-white' :
                          item.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'
                        }`}>{item.status}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm line-clamp-1 mb-3">{item.caption ?? 'No caption'}</p>
                      {item.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => moderateGallery(item.id, 'approved')}
                            className="flex-1 flex items-center justify-center gap-1 bg-green-500/20 border border-green-500/30 text-green-400 py-1.5 rounded-lg text-xs hover:bg-green-500/30">
                            <CheckCircle className="w-3.5 h-3.5" />Setuju
                          </button>
                          <button onClick={() => moderateGallery(item.id, 'rejected')}
                            className="flex-1 flex items-center justify-center gap-1 bg-red-500/20 border border-red-500/30 text-red-400 py-1.5 rounded-lg text-xs hover:bg-red-500/30">
                            <XCircle className="w-3.5 h-3.5" />Tolak
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )

          /* ─── SETTINGS ─── */
          if (tab === 'settings') {
            const getSetting = (key: string, fallback = '') => settings.find(s => s.key === key)?.value ?? fallback
            const updateSetting = (key: string, value: string) =>
              setSettings(prev => prev.some(s => s.key === key) ? prev.map(s => s.key === key ? { ...s, value } : s) : [...prev, { key, value }])

            return (
              <div>
                <h2 className="font-semibold text-xl mb-6">Pengaturan Situs</h2>
                <p className="text-soraku-sub text-sm mb-6">Pengaturan ini tersimpan di database dan bisa diubah kapan saja.</p>

                {/* General */}
                <section className="glass rounded-2xl p-6 mb-6">
                  <h3 className="font-semibold mb-4">🌐 General</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[['site_name', 'Nama Website', 'Soraku'], ['tagline', 'Tagline', 'Komunitas Anime & Manga'], ['logo_url', 'Logo URL', '']].map(([k, l, ph]) => (
                      <div key={k}>
                        <label className={labelCls}>{l}</label>
                        <input value={getSetting(k, ph)} onChange={e => updateSetting(k, e.target.value)} placeholder={ph} className={inputCls} />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Theme */}
                <section className="glass rounded-2xl p-6 mb-6">
                  <h3 className="font-semibold mb-4">🎨 Theme</h3>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    {[['primary_color', 'Primary Color'], ['accent_color', 'Accent Color']].map(([k, l]) => (
                      <div key={k}>
                        <label className={labelCls}>{l}</label>
                        <div className="flex gap-2">
                          <input type="color" value={getSetting(k, '#7C3AED')} onChange={e => updateSetting(k, e.target.value)} className="w-10 h-10 rounded-lg border border-soraku-border cursor-pointer" />
                          <input value={getSetting(k, '#7C3AED')} onChange={e => updateSetting(k, e.target.value)} className={`${inputCls} flex-1`} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-6">
                    {[['neon_enabled', 'Neon Glow'], ['enable_glass', 'Glass UI']].map(([k, l]) => (
                      <label key={k} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={getSetting(k) === 'true'} onChange={e => updateSetting(k, String(e.target.checked))} className="w-4 h-4 accent-purple-500" />
                        <span className="text-sm">{l}</span>
                      </label>
                    ))}
                  </div>
                </section>

                {/* System */}
                <section className="glass rounded-2xl p-6 mb-6">
                  <h3 className="font-semibold mb-4">⚙️ System</h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <span className="text-sm">Maintenance Mode</span>
                      <input type="checkbox" checked={getSetting('maintenance_mode') === 'true'} onChange={e => updateSetting('maintenance_mode', String(e.target.checked))} className="w-4 h-4 accent-purple-500" />
                    </label>
                    {getSetting('maintenance_mode') === 'true' && (
                      <div>
                        <label className={labelCls}>Pesan Maintenance</label>
                        <input value={getSetting('maintenance_message')} onChange={e => updateSetting('maintenance_message', e.target.value)} placeholder="Sedang dalam perbaikan..." className={inputCls} />
                      </div>
                    )}
                    <label className="flex items-center justify-between">
                      <span className="text-sm">Enable Registrasi</span>
                      <input type="checkbox" checked={getSetting('enable_registration', 'true') !== 'false'} onChange={e => updateSetting('enable_registration', String(e.target.checked))} className="w-4 h-4 accent-purple-500" />
                    </label>
                  </div>
                </section>

                {/* Integrations */}
                <section className="glass rounded-2xl p-6 mb-6">
                  <h3 className="font-semibold mb-4">🔌 Integrasi</h3>
                  <div className="space-y-3">
                    {[['enable_github_discussion', 'GitHub Discussion'], ['enable_spotify', 'Spotify Player'], ['enable_discord_stats', 'Discord Stats']].map(([k, l]) => (
                      <label key={k} className="flex items-center justify-between">
                        <span className="text-sm">{l}</span>
                        <input type="checkbox" checked={getSetting(k, 'true') !== 'false'} onChange={e => updateSetting(k, String(e.target.checked))} className="w-4 h-4 accent-purple-500" />
                      </label>
                    ))}
                  </div>
                </section>

                <button onClick={async () => {
                  for (const s of settings) await saveSetting(s.key, s.value)
                }} className="bg-soraku-gradient text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90">
                  💾 Simpan Semua Pengaturan
                </button>
              </div>
            )
          }

          return null
        }}
      </AdminShell>
    </div>
  )
}
