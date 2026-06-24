import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.soraku.id'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/blog', '/blog/*', '/blog/category/*', '/search'],
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard/',
          '/draft/',
          '/private/',
          '/settings/',
          '/auth/',
          '/login',
          '/register',
          '/gallery/upload',
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  }
}
