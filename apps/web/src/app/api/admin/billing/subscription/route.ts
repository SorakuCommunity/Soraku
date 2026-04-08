import { getSession, isStaff } from '@/lib/auth'
import { ok, FORBIDDEN, SERVER_ERROR } from '@/lib/api'

// GET /api/admin/billing/subscription
export async function GET() {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()

    return ok({
      plan: 'free',
      status: null,
      current_period_end: null,
    })
  } catch {
    return SERVER_ERROR()
  }
}
