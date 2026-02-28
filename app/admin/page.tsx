import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminClient } from './AdminClient'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/admin')

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
  const role = profile?.role as string | null
  if (!role || !['ADMIN', 'MANAGER', 'OWNER'].includes(role)) redirect('/')

  return <AdminClient userRole={role} />
}
