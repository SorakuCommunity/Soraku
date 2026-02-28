'use client'
// app/Admin/gallery/page.tsx — SORAKU v1.0.a3.4
// Gallery moderation: approve / reject uploads
// Rendered as client for inline approve/reject without page refresh
import { useState, useEffect } from 'react'
import { AdminShell } from '@/components/admin/AdminShell'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Eye, Clock, Images } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { useUser } from '@/hooks/useUser'
import { hasRole } from '@/lib/roles'
import type { Role } from '@/lib/roles'

interface GalleryItem {
  id: string
  image_url: string
  caption: string | null
  approved: boolean
  created_at: string
  user_id: string
  users: { username: string; avatar_url: string | null } | null
}

type Tab = 'pending' | 'approved'

export default function AdminGalleryPage() {
  const { user, role } = useUser()
  const [items, setItems]     = useState<GalleryItem[]>([])
  const [tab, setTab]         = useState<Tab>('pending')
  const [loading, setLoading] = useState(true)
  const [acting, setActing]   = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    setLoading(true)
    supabase
      .from('gallery')
      .select('id, image_url, caption, approved, created_at, user_id, users:user_id(username, avatar_url)')
      .eq('approved', tab === 'approved')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => { setItems((data as unknown as GalleryItem[]) ?? []); setLoading(false) })
  }, [tab])

  const act = async (id: string, approve: boolean) => {
    setActing(id)
    if (approve) {
      const { error } = await supabase.from('gallery').update({ approved: true }).eq('id', id)
      if (error) { toast.error('Gagal approve'); setActing(null); return }
      toast.success('Diapprove!')
    } else {
      const { error } = await supabase.from('gallery').delete().eq('id', id)
      if (error) { toast.error('Gagal reject'); setActing(null); return }
      toast.success('Dihapus.')
    }
    setItems(prev => prev.filter(i => i.id !== id))
    setActing(null)
  }

  if (!role || !hasRole(role as Role, 'ADMIN')) {
    return <div className="p-8 text-center" style={{ color: 'var(--text-sub)' }}>Akses ditolak.</div>
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'pending',  label: 'Menunggu',  icon: <Clock size={14} /> },
    { id: 'approved', label: 'Disetujui', icon: <Check size={14} /> },
  ]

  return (
    <AdminShell userRole={role as Role} username={user?.email?.split('@')[0] ?? 'Admin'}>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Gallery Moderation</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-sub)' }}>Approve atau reject unggahan komunitas.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: tab === t.id ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                color: tab === t.id ? '#fff' : 'var(--text-sub)',
                border: `1px solid ${tab === t.id ? 'transparent' : 'rgba(255,255,255,0.10)'}`,
              }}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl animate-pulse" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <Images size={36} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-sub)' }} />
            <p style={{ color: 'var(--text-sub)' }}>
              {tab === 'pending' ? 'Tidak ada unggahan menunggu.' : 'Tidak ada gallery disetujui.'}
            </p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {items.map(item => (
                <motion.div key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative rounded-xl overflow-hidden border"
                  style={{ borderColor: 'rgba(255,255,255,0.10)' }}>
                  <div className="aspect-square relative">
                    <Image src={item.image_url} alt={item.caption ?? ''} fill className="object-cover" sizes="25vw" />
                    {/* Overlay with actions */}
                    <div className="absolute inset-0 flex flex-col justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)' }}>
                      {/* Uploader */}
                      <div className="flex items-center gap-1.5 self-start bg-black/40 rounded-lg px-2 py-1">
                        <span className="text-xs text-white/80">
                          @{(item.users as { username: string } | null)?.username ?? '?'}
                        </span>
                      </div>

                      {/* Actions */}
                      {tab === 'pending' && (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => act(item.id, true)}
                            disabled={acting === item.id}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:scale-105 disabled:opacity-50"
                            style={{ backgroundColor: '#22c55e' }}>
                            <Check size={12} /> Approve
                          </button>
                          <button
                            onClick={() => act(item.id, false)}
                            disabled={acting === item.id}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:scale-105 disabled:opacity-50"
                            style={{ backgroundColor: '#ef4444' }}>
                            <X size={12} /> Reject
                          </button>
                        </div>
                      )}
                      {tab === 'approved' && (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => act(item.id, false)}
                            disabled={acting === item.id}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:scale-105 disabled:opacity-50"
                            style={{ backgroundColor: '#ef4444' }}>
                            <X size={12} /> Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {item.caption && (
                    <div className="px-2 py-1.5" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                      <p className="text-xs truncate" style={{ color: 'var(--text-sub)' }}>{item.caption}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </AdminShell>
  )
}
