import { NextResponse } from 'next/server'

type Meta = { total?: number; page?: number; limit?: number }

export function ok<T>(data: T, status = 200, meta?: Meta) {
  return NextResponse.json({ data, error: null, ...(meta ? { meta } : {}) }, { status })
}

export function err(message: string, status = 400, code?: string) {
  return NextResponse.json(
    { data: null, error: { message, ...(code ? { code } : {}) } },
    { status }
  )
}

// ⚠ Gunakan FUNGSI bukan konstanta.
// NextResponse body adalah single-use ReadableStream — jika Lambda Vercel
// dipakai ulang (warm instance), konstanta yang sama di-return lagi
// padahal body stream sudah consumed → response body kosong
// → client .json() throws → "Koneksi gagal"
export const UNAUTHORIZED = () => err('Unauthorized', 401)
export const FORBIDDEN = () => err('Forbidden', 403)
export const NOT_FOUND = () => err('Not found', 404)
export const SERVER_ERROR = () => err('Internal server error', 500)
