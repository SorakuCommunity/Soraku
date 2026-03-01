'use client'
// app/Admin/gallery/AdminGalleryClient.tsx — SORAKU v1.0.a3.5
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Clock, Images } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface GalleryItem {
  id: string
  image_url: string
  caption: string | null
  approved: boolean
  created_at: string
  users: { username: string; avatar_url: string | null } | null
}

type Tab = 'pending' | 'approved'

export function AdminGalleryClient({
  pending: initialPending,
  approved: initialApproved,
}: {
  pending: unknown[]
  approved: unknown[]
}) {
  const [pending,  setPending]  = useState<GalleryItem[]>(initialPending  as GalleryItem[])
  const [approved, setApproved] = useState<GalleryItem[]>(initialApproved as GalleryItem[])
  const [tab,    setTab]    = useState<Tab>('pending')
  const [acting, setActing] = useState<string | null>(null)
  const supabase = createClient()

  const items = tab === 'pending' ? pending : approved

  const act = async (id: string, approve: boolean) => {
    setActing(id)
    if (approve) {
      const { error } = await supabase.from('gallery').update({ approved: true }).eq('id', id)
      if (error) { toast.error('Gagal approve'); setActing(null); return }
      const item = pending.find(i => i.id === id)
      setPending(p => p.filter(i => i.id !== id))
      if (item) setApproved(p => [{ ...item, approved: true }, ...p])
      toast.success('Diapprove!')
    } else {
      const { error } = await supabase.from('gallery').delete().eq('id', id)
      if (error) { toast.error('Gagal hapus'); setActing(null); return }
      setPending(p => p.filter(i => i.id !== id))
      setApproved(p => p.filter(i => i.id !== id))
      toast.success('Dihapus.')
    }
    setActing(null)
  }

  const tabs = [
    { id: 'pending'  as Tab, label: `Menunggu (${pending.length})`,   icon: <Clock size={13} /> },
    { id: 'approved' as Tab, label: `Disetujui (${approved.length})`, icon: <Check size={13} /> },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Gallery Moderation</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-sub)' }}>Approve atau reject unggahan komunitas.</p>
      </div>

      <div className="flex gap-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              backgroundColor: tab === t.id ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
              color: tab === t.id ? '#fff' : 'var(--text-sub)',
              border: `1px solid ${tab === t.id ? 'transparent' : 'rgba(255,255,255,0.10)'}`,
            }}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <Images size={36} className="mx-auto mb-3 opacity-25" style={{ color: 'var(--text-sub)' }} />
          <p style={{ color: 'var(--text-sub)' }}>
            {tab === 'pending' ? 'Tidak ada unggahan menunggu.' : 'Belum ada gallery disetujui.'}
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image_url} alt={item.caption ?? ''} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex flex-col justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 50%)' }}>
                    {/* Uploader badge */}
                    <div className="self-start bg-black/50 rounded-lg px-2 py-0.5">
                      <span className="text-xs text-white/80">
                        @{(item.users as { username: string } | null)?.username ?? '?'}
                      </span>
                    </div>
                    {/* Action buttons */}
                    <div className="flex gap-1.5 justify-center">
                      {tab === 'pending' && (
                        <button onClick={() => act(item.id, true)} disabled={acting === item.id}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white hover:scale-105 transition-all disabled:opacity-50"
                          style={{ backgroundColor: '#22c55e' }}>
                          <Check size={11} /> OK
                        </button>
                      )}
                      <button onClick={() => act(item.id, false)} disabled={acting === item.id}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white hover:scale-105 transition-all disabled:opacity-50"
                        style={{ backgroundColor: '#ef4444' }}>
                        <X size={11} /> {tab === 'pending' ? 'Reject' : 'Hapus'}
                      </button>
                    </div>
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
  )
}
