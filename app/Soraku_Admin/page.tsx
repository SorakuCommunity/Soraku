'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminShell, type TabId } from '@/components/admin/AdminShell'
import { hasAdminAccess, getRoleBadgeColor, formatDate, slugify, canManageAnime } from '@/lib/utils'
import { toast } from 'sonner'
import { Shield, TrendingUp, Users, ImageIcon, FileText, CheckCircle, XCircle, Trash2, Edit, Search, Star } from 'lucide-react'
import type { User, GalleryItem, BlogPost, Event, AnimeProfile, SiteSetting, UserRole } from '@/types'

const ALL_ROLES: UserRole[] = ['USER', 'DONATE', 'PREMIUM', 'AGENSI', 'ADMIN', 'MANAGER', 'OWNER']
const cls = 'w-full glass border border-soraku-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 bg-transparent placeholder:text-soraku-sub transition-colors'
const lbl = 'block text-xs font-medium text-soraku-sub mb-1.5'

function StatCard({ Icon, label, value, color }: { Icon: React.ElementType; label: string; value: number | string; color: string }) {
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
  const [stats, setStats] = useState({ users: 0, gallery: 0, pending: 0, posts: 0 })

  const [users, setUsers] = useState<User[]>([])
  const [userSearch, setUserSearch] = useState('')
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [animes, setAnimes] = useState<AnimeProfile[]>([])
  const [settings, setSettings] = useState<SiteSetting[]>([])

  const [blogForm, setBlogForm] = useState({ title: '', slug: '', thumbnail: '', content: '', tags: '', status: 'draft' as const, editId: '' })
  const [eventForm, setEventForm] = useState({ title: '', description: '', banner_url: '', start_date: '', end_date: '', editId: '' })
  const [animeForm, setAnimeForm] = useState({ name: '', slug: '', generation: '', avatar_url: '', cover_url: '', description: '', bio: '', twitter: '', youtube: '', twitch: '', instagram: '', tiktok: '', website: '', tags: '', editId: '' })

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
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
      const { data } = await supabase.from('anime_profiles').select('*').order('created_at', { ascending: false })
      setAnimes((data ?? []) as AnimeProfile[])
    }
    if (tab === 'settings') {
      const { data } = await supabase.from('site_settings').select('*')
      setSettings((data ?? []) as SiteSetting[])
    }
  }, [supabase])

  // Users
  const updateRole = async (uid: string, role: UserRole) => {
    const { error } = await supabase.from('users').update({ role }).eq('id', uid)
    if (error) { toast.error('Gagal'); return }
    toast.success('Role diperbarui!')
    setUsers(prev => prev.map(u => u.id === uid ? { ...u, role } : u))
  }

  // Gallery
  const moderateGallery = async (id: string, status: 'approved' | 'rejected') => {
    await supabase.from('gallery').update({ status }).eq('id', id)
    toast.success(status === 'approved' ? '✅ Disetujui' : '❌ Ditolak')
    setGallery(prev => prev.map(g => g.id === id ? { ...g, status } : g))
  }

  // Blog
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
      if (error) { toast.error('Gagal: ' + error.message); return }
      toast.success('Post dibuat!')
    }
    setBlogForm({ title: '', slug: '', thumbnail: '', content: '', tags: '', status: 'draft', editId: '' })
    loadTab('blog')
  }
  const deleteBlog = async (id: string) => {
    await supabase.from('blog_posts').update({ deleted_at: new Date().toISOString() }).eq('id', id)
    toast.success('Post dihapus'); loadTab('blog')
  }

  // Events
  const saveEvent = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const payload = { title: eventForm.title, description: eventForm.description || null, banner_url: eventForm.banner_url || null, start_date: eventForm.start_date, end_date: eventForm.end_date }
    if (eventForm.editId) {
      await supabase.from('events').update(payload).eq('id', eventForm.editId)
      toast.success('Event diperbarui!')
    } else {
      await supabase.from('events').insert({ ...payload, created_by: user.id })
      fetch('/api/discord/webhook', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: eventForm.title, description: eventForm.description, startDate: eventForm.start_date, endDate: eventForm.end_date }) }).catch(console.error)
      toast.success('Event dibuat & Discord dikirim! 🚀')
    }
    setEventForm({ title: '', description: '', banner_url: '', start_date: '', end_date: '', editId: '' })
    loadTab('events')
  }
  const deleteEvent = async (id: string) => {
    await supabase.from('events').delete().eq('id', id)
    toast.success('Event dihapus'); loadTab('events')
  }

  // Anime / VTuber
  const saveAnime = async () => {
    const tags = animeForm.tags.split(',').map(t => t.trim()).filter(Boolean)
    const payload = {
      name: animeForm.name, slug: animeForm.slug || slugify(animeForm.name),
      generation: animeForm.generation || null, avatar_url: animeForm.avatar_url || null,
      cover_url: animeForm.cover_url || null, description: animeForm.description || null,
      bio: animeForm.bio || null, twitter: animeForm.twitter || null, youtube: animeForm.youtube || null,
      twitch: animeForm.twitch || null, instagram: animeForm.instagram || null,
      tiktok: animeForm.tiktok || null, website: animeForm.website || null, tags,
    }
    if (animeForm.editId) {
      const { error } = await supabase.from('anime_profiles').update(payload).eq('id', animeForm.editId)
      if (error) { toast.error('Gagal: ' + error.message); return }
      toast.success('Profil diperbarui!')
    } else {
      const { error } = await supabase.from('anime_profiles').insert(payload)
      if (error) { toast.error('Gagal: ' + error.message); return }
      toast.success('Profil ditambahkan!')
    }
    setAnimeForm({ name: '', slug: '', generation: '', avatar_url: '', cover_url: '', description: '', bio: '', twitter: '', youtube: '', twitch: '', instagram: '', tiktok: '', website: '', tags: '', editId: '' })
    loadTab('vtubers')
  }
  const deleteAnime = async (id: string) => {
    await supabase.from('anime_profiles').delete().eq('id', id)
    toast.success('Profil dihapus'); loadTab('vtubers')
  }

  // Settings
  const getVal = (key: string, fb = '') => settings.find(s => s.key === key)?.value ?? fb
  const setVal = (key: string, value: string) => setSettings(prev =>
    prev.some(s => s.key === key) ? prev.map(s => s.key === key ? { ...s, value } : s) : [...prev, { key, value }]
  )
  const saveSettings = async () => {
    for (const s of settings) {
      await supabase.from('site_settings').upsert({ key: s.key, value: s.value }, { onConflict: 'key' })
    }
    toast.success('Pengaturan disimpan! ✅')
  }

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!currentUser || !hasAdminAccess(currentUser.role)) return (
    <div className="min-h-screen pt-24 flex items-center justify-center text-center">
      <div><Shield className="w-12 h-12 text-red-400 mx-auto mb-4" /><p className="text-xl font-semibold">Akses Ditolak</p></div>
    </div>
  )

  const renderTab = (tab: TabId) => {
    setTimeout(() => loadTab(tab), 0)

    if (tab === 'dashboard') return (
      <div>
        <h2 className="font-semibold text-xl mb-6">Dashboard</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard Icon={Users} label="Total Pengguna" value={stats.users} color="text-purple-400" />
          <StatCard Icon={FileText} label="Total Posts" value={stats.posts} color="text-blue-400" />
          <StatCard Icon={ImageIcon} label="Total Gallery" value={stats.gallery} color="text-pink-400" />
          <StatCard Icon={TrendingUp} label="Pending Moderasi" value={stats.pending} color="text-yellow-400" />
        </div>
        <div className="glass rounded-2xl p-8 text-center text-soraku-sub">
          <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Gunakan sidebar untuk mengelola konten platform Soraku.</p>
        </div>
      </div>
    )

    if (tab === 'users') return (
      <div>
        <h2 className="font-semibold text-xl mb-6">Manajemen Pengguna</h2>
        <div className="relative mb-5 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soraku-sub" />
          <input value={userSearch} onChange={e => setUserSearch(e.target.value)}
            placeholder="Cari pengguna..." className={`${cls} pl-9`} />
        </div>
        <div className="space-y-2">
          {users.filter(u => !userSearch ||
            u.display_name?.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.email?.toLowerCase().includes(userSearch.toLowerCase())
          ).map(u => (
            <div key={u.id} className="glass rounded-xl p-4 flex items-center gap-4">
              {u.avatar_url
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={u.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                : <div className="w-10 h-10 rounded-full bg-soraku-muted flex items-center justify-center font-bold shrink-0">{(u.display_name ?? 'U')[0]}</div>
              }
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{u.display_name ?? '—'}</p>
                <p className="text-soraku-sub text-xs truncate">@{u.username} · {u.email}</p>
              </div>
              {currentUser.role === 'OWNER' ? (
                <select value={u.role} onChange={e => updateRole(u.id, e.target.value as UserRole)}
                  className="glass border border-soraku-border rounded-lg px-3 py-1.5 text-xs bg-transparent focus:outline-none">
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

    if (tab === 'blog') return (
      <div>
        <h2 className="font-semibold text-xl mb-6">Blog Manager</h2>
        <div className="glass rounded-2xl p-6 mb-6">
          <h3 className="font-semibold mb-4">{blogForm.editId ? '✏️ Edit Post' : '+ Post Baru'}</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div><label className={lbl}>Judul *</label>
              <input value={blogForm.title} onChange={e => setBlogForm(p => ({ ...p, title: e.target.value, slug: slugify(e.target.value) }))} className={cls} /></div>
            <div><label className={lbl}>Slug *</label>
              <input value={blogForm.slug} onChange={e => setBlogForm(p => ({ ...p, slug: e.target.value }))} className={cls} /></div>
            <div><label className={lbl}>Thumbnail URL</label>
              <input value={blogForm.thumbnail} onChange={e => setBlogForm(p => ({ ...p, thumbnail: e.target.value }))} type="url" placeholder="https://..." className={cls} /></div>
            <div><label className={lbl}>Tags (pisah koma)</label>
              <input value={blogForm.tags} onChange={e => setBlogForm(p => ({ ...p, tags: e.target.value }))} placeholder="anime, review" className={cls} /></div>
          </div>
          <div className="mb-4"><label className={lbl}>Konten *</label>
            <textarea value={blogForm.content} onChange={e => setBlogForm(p => ({ ...p, content: e.target.value }))} rows={6} className={`${cls} resize-none`} /></div>
          <div className="flex items-center gap-4 flex-wrap">
            <select value={blogForm.status} onChange={e => setBlogForm(p => ({ ...p, status: e.target.value as 'draft' | 'published' }))}
              className="glass border border-soraku-border rounded-xl px-4 py-2.5 text-sm bg-transparent">
              <option value="draft" className="bg-soraku-card">Draft</option>
              <option value="published" className="bg-soraku-card">Published</option>
            </select>
            <button onClick={saveBlog} className="bg-soraku-gradient text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">
              {blogForm.editId ? 'Update Post' : 'Publish Post'}
            </button>
            {blogForm.editId && <button onClick={() => setBlogForm({ title: '', slug: '', thumbnail: '', content: '', tags: '', status: 'draft', editId: '' })} className="text-soraku-sub text-sm px-4">Batal</button>}
          </div>
        </div>
        <div className="space-y-3">
          {posts.map(p => (
            <div key={p.id} className="glass rounded-xl p-4 flex items-center gap-4">
              {p.thumbnail && <img src={p.thumbnail} alt="" className="w-16 h-12 rounded-lg object-cover shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{p.title}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>{p.status}</span>
              </div>
              <button onClick={() => setBlogForm({ title: p.title, slug: p.slug, thumbnail: p.thumbnail ?? '', content: p.content, tags: p.tags?.join(', ') ?? '', status: p.status, editId: p.id })}
                className="text-soraku-sub hover:text-blue-400 p-1"><Edit className="w-4 h-4" /></button>
              <button onClick={() => deleteBlog(p.id)} className="text-soraku-sub hover:text-red-400 p-1"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
    )

    if (tab === 'events') return (
      <div>
        <h2 className="font-semibold text-xl mb-6">Events Manager</h2>
        <div className="glass rounded-2xl p-6 mb-6">
          <h3 className="font-semibold mb-4">{eventForm.editId ? '✏️ Edit Event' : '+ Event Baru'}</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="sm:col-span-2"><label className={lbl}>Judul *</label><input value={eventForm.title} onChange={e => setEventForm(p => ({ ...p, title: e.target.value }))} className={cls} /></div>
            <div className="sm:col-span-2"><label className={lbl}>Deskripsi</label><textarea value={eventForm.description} onChange={e => setEventForm(p => ({ ...p, description: e.target.value }))} rows={3} className={`${cls} resize-none`} /></div>
            <div className="sm:col-span-2"><label className={lbl}>Banner URL</label><input value={eventForm.banner_url} onChange={e => setEventForm(p => ({ ...p, banner_url: e.target.value }))} type="url" className={cls} /></div>
            <div><label className={lbl}>Mulai *</label><input value={eventForm.start_date} onChange={e => setEventForm(p => ({ ...p, start_date: e.target.value }))} type="datetime-local" className={cls} /></div>
            <div><label className={lbl}>Selesai *</label><input value={eventForm.end_date} onChange={e => setEventForm(p => ({ ...p, end_date: e.target.value }))} type="datetime-local" className={cls} /></div>
          </div>
          <div className="flex gap-3">
            <button onClick={saveEvent} className="bg-soraku-gradient text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">
              {eventForm.editId ? 'Update Event' : '🚀 Buat & Kirim Discord'}
            </button>
            {eventForm.editId && <button onClick={() => setEventForm({ title: '', description: '', banner_url: '', start_date: '', end_date: '', editId: '' })} className="text-soraku-sub text-sm px-4">Batal</button>}
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
                className="text-soraku-sub hover:text-blue-400 p-1"><Edit className="w-4 h-4" /></button>
              <button onClick={() => deleteEvent(e.id)} className="text-soraku-sub hover:text-red-400 p-1"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
    )

    if (tab === 'vtubers') return (
      <div>
        <h2 className="font-semibold text-xl mb-2">Anime / Talent Manager</h2>
        <p className="text-soraku-sub text-xs mb-6">Hanya AGENSI ke atas yang bisa mengelola profil ini.</p>
        {!canManageAnime(currentUser.role) ? (
          <div className="glass rounded-2xl p-8 text-center"><Star className="w-10 h-10 text-soraku-sub/30 mx-auto mb-3" /><p className="text-soraku-sub">Membutuhkan role AGENSI atau lebih tinggi.</p></div>
        ) : (
          <>
            <div className="glass rounded-2xl p-6 mb-6">
              <h3 className="font-semibold mb-4">{animeForm.editId ? '✏️ Edit' : '+ Tambah Talent'}</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div><label className={lbl}>Nama *</label><input value={animeForm.name} onChange={e => setAnimeForm(p => ({ ...p, name: e.target.value, slug: slugify(e.target.value) }))} className={cls} /></div>
                <div><label className={lbl}>Slug *</label><input value={animeForm.slug} onChange={e => setAnimeForm(p => ({ ...p, slug: e.target.value }))} className={cls} /></div>
                <div><label className={lbl}>Generasi</label><input value={animeForm.generation} onChange={e => setAnimeForm(p => ({ ...p, generation: e.target.value }))} placeholder="Gen 1" className={cls} /></div>
                <div><label className={lbl}>Tags (koma)</label><input value={animeForm.tags} onChange={e => setAnimeForm(p => ({ ...p, tags: e.target.value }))} placeholder="VTuber, Gaming" className={cls} /></div>
                <div><label className={lbl}>Avatar URL</label><input value={animeForm.avatar_url} onChange={e => setAnimeForm(p => ({ ...p, avatar_url: e.target.value }))} type="url" className={cls} /></div>
                <div><label className={lbl}>Cover URL</label><input value={animeForm.cover_url} onChange={e => setAnimeForm(p => ({ ...p, cover_url: e.target.value }))} type="url" className={cls} /></div>
                <div><label className={lbl}>Twitter</label><input value={animeForm.twitter} onChange={e => setAnimeForm(p => ({ ...p, twitter: e.target.value }))} type="url" className={cls} /></div>
                <div><label className={lbl}>YouTube</label><input value={animeForm.youtube} onChange={e => setAnimeForm(p => ({ ...p, youtube: e.target.value }))} type="url" className={cls} /></div>
                <div className="sm:col-span-2"><label className={lbl}>Deskripsi Singkat</label><input value={animeForm.description} onChange={e => setAnimeForm(p => ({ ...p, description: e.target.value }))} className={cls} /></div>
                <div className="sm:col-span-2"><label className={lbl}>Bio Lengkap</label><textarea value={animeForm.bio} onChange={e => setAnimeForm(p => ({ ...p, bio: e.target.value }))} rows={3} className={`${cls} resize-none`} /></div>
              </div>
              <div className="flex gap-3">
                <button onClick={saveAnime} className="bg-soraku-gradient text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">
                  {animeForm.editId ? 'Update' : 'Tambah Talent'}
                </button>
                {animeForm.editId && <button onClick={() => setAnimeForm({ name: '', slug: '', generation: '', avatar_url: '', cover_url: '', description: '', bio: '', twitter: '', youtube: '', twitch: '', instagram: '', tiktok: '', website: '', tags: '', editId: '' })} className="text-soraku-sub text-sm px-4">Batal</button>}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {animes.map(a => (
                <div key={a.id} className="glass rounded-xl overflow-hidden">
                  {a.avatar_url && <img src={a.avatar_url} alt={a.name} className="w-full h-32 object-cover" />}
                  <div className="p-4">
                    <p className="font-semibold">{a.name}</p>
                    {a.generation && <p className="text-xs text-soraku-sub mb-3">{a.generation}</p>}
                    <div className="flex gap-2">
                      <button onClick={() => setAnimeForm({ name: a.name, slug: a.slug, generation: a.generation ?? '', avatar_url: a.avatar_url ?? '', cover_url: a.cover_url ?? '', description: a.description ?? '', bio: a.bio ?? '', twitter: a.twitter ?? '', youtube: a.youtube ?? '', twitch: a.twitch ?? '', instagram: a.instagram ?? '', tiktok: a.tiktok ?? '', website: a.website ?? '', tags: a.tags?.join(', ') ?? '', editId: a.id })}
                        className="flex-1 text-xs py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30">Edit</button>
                      <button onClick={() => deleteAnime(a.id)}
                        className="flex-1 text-xs py-1.5 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30">Hapus</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    )

    if (tab === 'gallery') return (
      <div>
        <h2 className="font-semibold text-xl mb-6">Gallery Moderation</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gallery.map(item => (
            <div key={item.id} className={`glass rounded-xl overflow-hidden border ${item.status === 'approved' ? 'border-green-500/30' : item.status === 'rejected' ? 'border-red-500/30' : 'border-yellow-500/30'}`}>
              <div className="relative h-40">
                <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium ${item.status === 'approved' ? 'bg-green-500 text-white' : item.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'}`}>{item.status}</span>
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

    if (tab === 'settings') return (
      <div>
        <h2 className="font-semibold text-xl mb-2">Pengaturan Situs</h2>
        <p className="text-soraku-sub text-sm mb-6">Perubahan tersimpan langsung ke database.</p>
        <div className="space-y-6">
          <section className="glass rounded-2xl p-6">
            <h3 className="font-semibold mb-4">🌐 General</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[['site_name', 'Nama Website'], ['tagline', 'Tagline'], ['logo_url', 'Logo URL']].map(([k, l]) => (
                <div key={k}><label className={lbl}>{l}</label>
                  <input value={getVal(k)} onChange={e => setVal(k, e.target.value)} className={cls} /></div>
              ))}
            </div>
          </section>
          <section className="glass rounded-2xl p-6">
            <h3 className="font-semibold mb-4">🎨 Login Page</h3>
            <div className="space-y-4">
              <div><label className={lbl}>Background Image Login (URL)</label>
                <input value={getVal('login_background_image')} onChange={e => setVal('login_background_image', e.target.value)} type="url" placeholder="https://..." className={cls} /></div>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">Tampilkan Ilustrasi Anime di Login</span>
                <input type="checkbox" checked={getVal('login_illustration_enabled', 'true') !== 'false'} onChange={e => setVal('login_illustration_enabled', String(e.target.checked))} className="w-4 h-4 accent-purple-500" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">Enable Login Spotify</span>
                <input type="checkbox" checked={getVal('oauth_spotify_enabled', 'true') !== 'false'} onChange={e => setVal('oauth_spotify_enabled', String(e.target.checked))} className="w-4 h-4 accent-purple-500" />
              </label>
            </div>
          </section>
          <section className="glass rounded-2xl p-6">
            <h3 className="font-semibold mb-4">⚙️ System</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">Maintenance Mode</span>
                <input type="checkbox" checked={getVal('maintenance_mode') === 'true'} onChange={e => setVal('maintenance_mode', String(e.target.checked))} className="w-4 h-4 accent-purple-500" />
              </label>
              {[['enable_github_discussion', 'GitHub Discussion'], ['enable_spotify', 'Spotify Player'], ['enable_discord_stats', 'Discord Stats']].map(([k, l]) => (
                <label key={k} className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm">{l}</span>
                  <input type="checkbox" checked={getVal(k, 'true') !== 'false'} onChange={e => setVal(k, String(e.target.checked))} className="w-4 h-4 accent-purple-500" />
                </label>
              ))}
            </div>
          </section>
          <button onClick={saveSettings} className="bg-soraku-gradient text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90">💾 Simpan Semua</button>
        </div>
      </div>
    )

    return null
  }

  return (
    <div className="pt-16">
      <div className="bg-soraku-card border-b border-soraku-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold"><span className="grad-text">Soraku</span> Admin Panel</h1>
          <p className="text-soraku-sub text-sm">v1.0.a3 · Halo, {currentUser.display_name}!</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${getRoleBadgeColor(currentUser.role)}`}>{currentUser.role}</span>
      </div>
      <AdminShell role={currentUser.role}>{renderTab}</AdminShell>
    </div>
  )
}
