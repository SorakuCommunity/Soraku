export const dynamic = 'force-dynamic'
import type { MetadataRoute } from 'next'
import { adminDb } from '@/lib/supabase/admin'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.soraku.id'

const CATEGORIES = ['anime', 'manga', 'cosplay', 'review', 'event', 'vtuber', 'gaming', 'panduan', 'musik', 'list']

const EXTRA_STATIC = ['/search', '/community', '/contact', '/feedback', '/gallery', '/class', '/leaderboard']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: BASE, priority: 1.0 },
    { url: `${BASE}/about`, priority: 0.8 },
    { url: `${BASE}/blog`, priority: 0.9 },
    { url: `${BASE}/events`, priority: 0.9 },
    { url: `${BASE}/gallery`, priority: 0.8 },
    { url: `${BASE}/vtubers`, priority: 0.7 },
    { url: `${BASE}/agensi`, priority: 0.7 },
    { url: `${BASE}/premium`, priority: 0.7 },
    { url: `${BASE}/donate`, priority: 0.7 },
    { url: `${BASE}/donate/leaderboard`, priority: 0.6 },
  ].map((p) => ({
    ...p,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
  }))

  const categoryPages = CATEGORIES.map((cat) => ({
    url: `${BASE}/blog/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const extraStaticPages = EXTRA_STATIC.map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  const { data: posts } = await adminDb()
    .from('posts')
    .select('slug,updatedat')
    .eq('ispublished', true)
    .order('updatedat', { ascending: false })
    .limit(200)

  const blogPages: MetadataRoute.Sitemap = (posts ?? []).map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.updatedat ?? Date.now()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const { data: events } = await adminDb()
    .from('events')
    .select('slug,updatedat,startdate')
    .eq('ispublished', true)
    .order('startdate', { ascending: false })
    .limit(100)

  const eventPages: MetadataRoute.Sitemap = (events ?? []).map((e) => ({
    url: `${BASE}/events/${e.slug}`,
    lastModified: new Date(e.updatedat ?? e.startdate ?? Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const { data: vtubers } = await adminDb()
    .from('vtubers')
    .select('slug,createdat')
    .eq('ispublished', true)
    .limit(50)

  const vtuberPages: MetadataRoute.Sitemap = (vtubers ?? []).map((v) => ({
    url: `${BASE}/vtubers/${v.slug}`,
    lastModified: new Date(v.createdat ?? Date.now()),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...categoryPages, ...extraStaticPages, ...blogPages, ...eventPages, ...vtuberPages]
}
