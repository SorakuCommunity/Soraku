import { getSession, isStaff } from '@/lib/auth'
import { ok, FORBIDDEN, SERVER_ERROR } from '@/lib/api'

// POST /api/admin/billing/checkout — create Paddle checkout session
export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()

    const body = await request.json()
    const { plan } = body

    // In production, this would create a Paddle checkout session
    // For now, we'll return a placeholder URL
    // TODO: Integrate with Paddle SDK

    const checkoutUrl = `https://checkout.paddle.com/checkout/${plan}`

    return ok({ url: checkoutUrl })
  } catch {
    return SERVER_ERROR()
  }
}
