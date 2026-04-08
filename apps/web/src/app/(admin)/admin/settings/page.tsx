'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { User, Mail, Shield, Bell, Key, Save, Loader2, Check, Camera } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserProfile {
  id: string
  username: string
  displayname: string | null
  email: string
  avatarurl: string | null
  role: string
  createdat: string
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    displayname: '',
    avatarurl: '',
  })

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d.data) {
          setUser(d.data)
          setForm({
            displayname: d.data.displayname || '',
            avatarurl: d.data.avatarurl || '',
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (e) {
      console.error(e)
    }
    setSaving(false)
  }

  const initial = user?.displayname?.[0]?.toUpperCase() ?? user?.username?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="max-w-3xl space-y-10">
      {/* Header */}
      <div>
        <p className="text-primary/40 mb-1 text-[9px] font-black tracking-[0.25em] uppercase">
          Pengaturan
        </p>
        <h1 className="text-2xl font-black tracking-tight">Akun & Profil</h1>
      </div>

      {/* Separator */}
      <div className="from-primary/20 via-border/25 -mt-4 h-px bg-gradient-to-r to-transparent" />

      {/* Profile Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-[#4FA3D1]" />
          <p className="text-sm font-bold text-[#D9DDE3]">Informasi Profil</p>
        </div>

        <div className="space-y-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#4FA3D1]/10">
                {user?.avatarurl ? (
                  <Image
                    src={user.avatarurl}
                    alt={user.displayname || user.username}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-black text-[#4FA3D1]">{initial}</span>
                )}
              </div>
              <button className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#4FA3D1] text-white shadow-lg transition-transform hover:scale-110">
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div>
              <p className="text-foreground text-sm font-semibold">{user?.username}</p>
              <p className="text-muted-foreground/40 text-xs">Username tidak dapat diubah</p>
            </div>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <label className="text-muted-foreground/60 text-xs font-semibold tracking-wider uppercase">
              Nama Tampilan
            </label>
            <input
              type="text"
              value={form.displayname}
              onChange={(e) => setForm((f) => ({ ...f, displayname: e.target.value }))}
              className="text-foreground placeholder:text-muted-foreground/30 w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-sm focus:border-[#4FA3D1]/50 focus:ring-1 focus:ring-[#4FA3D1]/20 focus:outline-none"
              placeholder="Masukkan nama tampilan"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-muted-foreground/60 text-xs font-semibold tracking-wider uppercase">
              Email
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5">
              <Mail className="text-muted-foreground/40 h-4 w-4" />
              <span className="text-foreground/60 text-sm">{user?.email}</span>
            </div>
            <p className="text-muted-foreground/30 text-[10px]">
              Email terkait akun, hubungi admin untuk mengubah
            </p>
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label className="text-muted-foreground/60 text-xs font-semibold tracking-wider uppercase">
              Role
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5">
              <Shield className="h-4 w-4 text-[#4FA3D1]" />
              <span className="text-foreground/80 text-sm font-medium capitalize">
                {user?.role || 'user'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            'flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all',
            saved
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-[#4FA3D1] text-white hover:bg-[#4FA3D1]/90'
          )}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <Check className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saved ? 'Tersimpan' : saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      {/* Danger Zone */}
      <div className="space-y-4 pt-6">
        <div className="h-px bg-gradient-to-r from-red-500/10 via-transparent to-transparent" />
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-red-400" />
          <p className="text-sm font-bold text-red-400/80">Zona Berbahaya</p>
        </div>
        <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.02] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground text-sm font-semibold">Hapus Akun</p>
              <p className="text-muted-foreground/40 mt-1 text-xs">
                Tindakan ini tidak dapat dibatalkan
              </p>
            </div>
            <button className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 transition-colors hover:bg-red-500/20">
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
