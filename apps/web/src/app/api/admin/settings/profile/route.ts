import { getSession, isStaff } from '@/lib/auth'
import { ok, FORBIDDEN, SERVER_ERROR, BAD_REQUEST } from '@/lib/api'

// PUT /api/admin/settings/profile — update user profile
export async function PUT(request: Request) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()

    const body = await request.json()
    const { displayname, avatarurl } = body

    if (!displayname) {
      return BAD_REQUEST('Display name is required')
    }

    // In a real app, we'd update the database here
    // For now, we'll just return success

    return ok({ success: true })
  } catch {
    return SERVER_ERROR()
  }
}
