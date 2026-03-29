import { getSession } from '@/lib/auth'
import { ok } from '@/lib/api'

export const dynamic = 'force-dynamic'

// GET /api/auth/me
export async function GET() {
  const session = await getSession()
  return ok(session)
}
