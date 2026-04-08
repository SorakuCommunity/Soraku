export const dynamic = 'force-dynamic'

import { getSession, isStaff } from '@/lib/auth'
import { ok, FORBIDDEN, SERVER_ERROR } from '@/lib/api'

// GET /api/admin/analytics — analytics data
export async function GET(request: Request) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'

    const days = period === '7d' ? 7 : period === '90d' ? 90 : 30
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    return ok({
      total_views: 0,
      total_visitors: 0,
      avg_session_duration: 0,
      top_pages: [],
      daily_stats: [],
    })
  } catch {
    return SERVER_ERROR()
  }
}
