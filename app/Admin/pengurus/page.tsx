export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminShell } from '@/components/admin/AdminShell'
import { hasRole, ROLE_COLORS, ROLE_LABELS } from '@/lib/roles'
import type { Role } from '@/lib/roles'
import Image from 'next/image'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Pengurus – Admin' }

const STAFF_ROLES: Role[] = ['OWNER', 'MANAGER', 'ADMIN', 'AGENSI']

export default async function AdminPengurusPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/Admin/pengurus')

  const { data: profile } = await supabase
    .from('users').select('username, role').eq('id', user.id).single()
  if (!profile || !hasRole(profile.role as Role, 'ADMIN')) redirect('/?error=unauthorized')

  const { data: staff } = await supabase
    .from('users')
    .select('id, username, email, role, avatar_url, created_at')
    .in('role', STAFF_ROLES)
    .order('role', { ascending: false })

  // Group by role
  const grouped: Record<string, typeof staff> = {}
  for (const r of STAFF_ROLES) {
    grouped[r] = (staff ?? []).filter(s => s.role === r)
  }

  return (
    <AdminShell userRole={profile.role as Role} username={profile.username ?? 'Admin'}>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Pengurus</h1>
          <p className="text-sm mt-0.5 text-muted-foreground">
            Daftar staff dan pengurus komunitas Soraku.
          </p>
        </div>

        {STAFF_ROLES.map(role => {
          const members = grouped[role] ?? []
          const color   = ROLE_COLORS[role]
          const label   = ROLE_LABELS[role]
          return (
            <div key={role}>
              <div className="flex items-center gap-2 mb-3">
                <span 
                  className="w-2.5 h-2.5 rounded-full inline-block" 
                  style={{ backgroundColor: color }} 
                />
                <h2 className="font-semibold text-sm" style={{ color }}>
                  {label} <span style={{ color: 'var(--text-sub)', fontWeight: 400 }}>({members.length})</span>
                </h2>
              </div>

              {members.length === 0 ? (
                <p className="text-xs italic px-1 text-muted-foreground">Tidak ada {label}</p>
              ) : (
                <div className="rounded-2xl border overflow-hidden border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ backgroundColor: color + '10', borderBottom: `1px solid ${color}30` }}>
                        {['Avatar', 'Username', 'Email', 'Bergabung'].map(h => (
                          <th 
                            key={h} 
                            className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider"
                            style={{ color }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m, i) => (
                        <tr 
                          key={m.id}
                          className="border-b transition-colors hover:bg-muted/50 border-border"
                        >
                          {/* ✅ FIXED: ringColor → borderColor */}
                          <td className="px-4 py-3">
                            <div 
                              className="w-8 h-8 rounded-full overflow-hidden border-2 flex items-center justify-center shadow-sm relative"
                              style={{ 
                                backgroundColor: `${color}22`,
                                borderColor: `${color}40`
                              }}
                            >
                              {m.avatar_url ? (
                                <Image 
                                  src={m.avatar_url} 
                                  alt={m.username || 'Avatar'} 
                                  width={32} 
                                  height={32} 
                                  className="w-full h-full object-cover rounded-full" 
                                />
                              ) : (
                                <span 
                                  className="text-xs font-bold flex items-center justify-center w-full h-full"
                                  style={{ color }}
                                >
                                  {m.username?.[0]?.toUpperCase()}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-medium text-foreground">@{m.username}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-muted-foreground">{m.email ?? '—'}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(m.created_at), 'd MMM yyyy', { locale: idLocale })}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </AdminShell>
  )
}
