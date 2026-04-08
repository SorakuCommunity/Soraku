import { getSession, isStaff } from '@/lib/auth'
import { ok, FORBIDDEN, SERVER_ERROR } from '@/lib/api'

// GET /api/admin/bot/status
export async function GET() {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()

    return ok({
      online: true,
      uptime: 86400 * 7,
      servers: 0,
      users: 0,
      commands_used: 0,
      latency: 45,
    })
  } catch {
    return SERVER_ERROR()
  }
}
