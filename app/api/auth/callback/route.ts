// app/api/auth/callback/route.ts — SORAKU v1.0.a3.3
// Redirect alias → primary callback at /auth/callback

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  // Forward to canonical auth callback
  const target = new URL(`${origin}/auth/callback`)
  if (code) target.searchParams.set('code', code)
  target.searchParams.set('next', next)

  return NextResponse.redirect(target.toString())
}
