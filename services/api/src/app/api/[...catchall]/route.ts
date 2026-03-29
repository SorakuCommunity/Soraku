/**
 * Global OPTIONS handler — preflight CORS untuk semua /api/* endpoints.
 * Browser kirim OPTIONS sebelum POST/PATCH/DELETE cross-origin.
 */
import { NextResponse } from "next/server"

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin":  "*",
      "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization,x-soraku-secret,x-api-key",
      "Access-Control-Max-Age":       "86400",
    },
  })
}
