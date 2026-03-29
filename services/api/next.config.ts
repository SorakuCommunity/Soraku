import type { NextConfig } from "next"

const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS ?? "")
  .split(",").map(o => o.trim()).filter(Boolean)

const nextConfig: NextConfig = {
  // Drizzle + postgres perlu Node.js runtime
  serverExternalPackages: ["postgres", "drizzle-orm"],

  // CORS headers — semua /api/* bisa diakses cross-origin
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: ALLOWED_ORIGINS.length > 0 ? ALLOWED_ORIGINS[0] : "*",
          },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PATCH,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type,Authorization,x-soraku-secret,x-api-key" },
          { key: "Access-Control-Max-Age", value: "86400" },
        ],
      },
    ]
  },
}

export default nextConfig
