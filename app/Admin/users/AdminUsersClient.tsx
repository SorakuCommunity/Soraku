'use client'
// app/Admin/users/AdminUsersClient.tsx — SORAKU v1.0.a3.4
// Scrollable table: avatar, username, email, role dropdown, created_at
// Pagination below, max 10 rows visible, search bar
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { ROLE_COLORS, ROLE_LABELS, hasRole } from '@/lib/roles'
import type { Role } from '@/lib/roles'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

const ALL_ROLES: Role[] = ['USER', 'DONATE', 'PREMIUM', 'AGENSI', 'ADMIN', 'MANAGER', 'OWNER']

interface UserRow {
  id: string
  username: string
  email: string | null
  role: string
  avatar_url: string | null
  created_at: string
}

interface Props {
  users: UserRow[]
  page: number
  totalPages: number
  total: number
  q: string
  myRole: Role
}

export function AdminUsersClient({ users, page, totalPages, total, q, myRole }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState(q)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [localRoles, setLocalRoles] = useState<Record<string, string>>(
    Object.fromEntries(users.map(u => [u.id, u.role]))
  )
  const [isPending, startTransition] = useTransition()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/Admin/users?q=${encodeURIComponent(search)}&page=1`)
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    // Prevent setting OWNER unless you are OWNER
    if (newRole === 'OWNER' && !hasRole(myRole, 'OWNER')) {
      toast.error('Hanya OWNER yang bisa assign role OWNER')
      return
    }
    setLocalRoles(prev => ({ ...prev, [userId]: newRole }))
    setSavingId(userId)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      })
      if (res.ok) {
        toast.success('Role diperbarui')
      } else {
        const data = await res.json()
        toast.error(data.error ?? 'Gagal memperbarui role')
        // revert
        setLocalRoles(prev => ({ ...prev, [userId]: users.find(u => u.id === userId)?.role ?? prev[userId] }))
      }
    } catch {
      toast.error('Network error')
    }
    setSavingId(null)
  }

  const goPage = (p: number) => {
    router.push(`/Admin/users?q=${encodeURIComponent(search)}&page=${p}`)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Users</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-sub)' }}>
          {total.toLocaleString('id-ID')} pengguna terdaftar
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-sub)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari username..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 min-h-[44px]"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.10)', color: 'var(--text)' }}
          />
        </div>
        <button type="submit" className="px-4 py-2.5 rounded-xl text-sm font-medium text-white min-h-[44px]"
          style={{ backgroundColor: 'var(--color-primary)' }}>
          Cari
        </button>
      </form>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.10)' }}>
        {/* Scrollable tbody area: max 10 rows */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Avatar', 'Username', 'Email', 'Role', 'Bergabung'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-sub)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody style={{ maxHeight: '520px', overflowY: 'auto' }}>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-sm" style={{ color: 'var(--text-sub)' }}>
                    Tidak ada pengguna ditemukan.
                  </td>
                </tr>
              ) : users.map((u, i) => {
                const role = (localRoles[u.id] ?? u.role) as Role
                const roleColor = ROLE_COLORS[role] ?? '#6E8FA6'
                const isSaving = savingId === u.id

                return (
                  <motion.tr key={u.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b transition-colors hover:bg-white/[0.02]"
                    style={{ borderColor: 'rgba(255,255,255,0.05)' }}>

                    {/* Avatar */}
                    <td className="px-4 py-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-white/10 flex items-center justify-center"
                        style={{ backgroundColor: roleColor + '22' }}>
                        {u.avatar_url ? (
                          <Image src={u.avatar_url} alt={u.username} width={36} height={36} className="object-cover" />
                        ) : (
                          <span className="text-sm font-bold" style={{ color: roleColor }}>
                            {u.username[0]?.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Username */}
                    <td className="px-4 py-3">
                      <span className="font-medium text-sm" style={{ color: 'var(--text)' }}>@{u.username}</span>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3">
                      <span className="text-xs" style={{ color: 'var(--text-sub)' }}>{u.email ?? '—'}</span>
                    </td>

                    {/* Role Dropdown */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={role}
                          onChange={e => handleRoleChange(u.id, e.target.value)}
                          disabled={isSaving}
                          className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer transition-all"
                          style={{
                            backgroundColor: roleColor + '18',
                            borderColor: roleColor + '40',
                            color: roleColor,
                          }}
                        >
                          {ALL_ROLES.map(r => (
                            <option key={r} value={r}
                              style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text)' }}>
                              {ROLE_LABELS[r]}
                            </option>
                          ))}
                        </select>
                        {isSaving && <Loader2 size={12} className="animate-spin" style={{ color: 'var(--text-sub)' }} />}
                      </div>
                    </td>

                    {/* Joined */}
                    <td className="px-4 py-3">
                      <span className="text-xs" style={{ color: 'var(--text-sub)' }}>
                        {format(new Date(u.created_at), 'd MMM yyyy', { locale: idLocale })}
                      </span>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: 'var(--text-sub)' }}>
            Halaman {page} dari {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => goPage(page - 1)}
              disabled={page <= 1}
              className="p-2 rounded-xl border text-sm disabled:opacity-30 transition-all hover:bg-white/5"
              style={{ borderColor: 'rgba(255,255,255,0.10)', color: 'var(--text-sub)' }}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p = page <= 4 ? i + 1 : page - 3 + i
              if (p < 1 || p > totalPages) return null
              return (
                <button key={p} onClick={() => goPage(p)}
                  className="w-9 h-9 rounded-xl border text-xs font-medium transition-all"
                  style={{
                    backgroundColor: p === page ? 'var(--color-primary)' : 'transparent',
                    borderColor: p === page ? 'var(--color-primary)' : 'rgba(255,255,255,0.10)',
                    color: p === page ? '#fff' : 'var(--text-sub)',
                  }}>
                  {p}
                </button>
              )
            })}
            <button
              onClick={() => goPage(page + 1)}
              disabled={page >= totalPages}
              className="p-2 rounded-xl border text-sm disabled:opacity-30 transition-all hover:bg-white/5"
              style={{ borderColor: 'rgba(255,255,255,0.10)', color: 'var(--text-sub)' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
