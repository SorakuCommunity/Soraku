import { NextRequest, NextResponse } from 'next/server'

const UMAMI_BASE = 'https://cloud.umami.is/api'
const UMAMI_TOKEN = process.env.UMAMI_API_TOKEN ?? ''
const WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ?? 'ba55e75f-b8b7-4f68-807f-77f7073bc23f'

async function umamiFetch(path: string, params: Record<string, string> = {}) {
  if (!UMAMI_TOKEN) return null
  const qs = new URLSearchParams(params).toString()
  const url = `${UMAMI_BASE}${path}?${qs}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${UMAMI_TOKEN}` },
    next: { revalidate: 60 },
  })
  if (!res.ok) return null
  return res.json()
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const period = searchParams.get('period') ?? '30d'
  const now = new Date()
  const days = period === '7d' ? 7 : period === '90d' ? 90 : 30
  const startAt = new Date(now.getTime() - days * 86400000).getTime()
  const endAt = now.getTime()
  const unit = days <= 7 ? 'hour' : days <= 30 ? 'day' : 'month'

  const [statsRes, pageviewsRes, urlsRes, referrersRes, browsersRes, osRes, devicesRes, countriesRes] = await Promise.all([
    umamiFetch(`/websites/${WEBSITE_ID}/stats`, {
      startAt: String(startAt),
      endAt: String(endAt),
    }),
    umamiFetch(`/websites/${WEBSITE_ID}/pageviews`, {
      startAt: String(startAt),
      endAt: String(endAt),
      unit,
    }),
    umamiFetch(`/websites/${WEBSITE_ID}/metrics`, {
      startAt: String(startAt),
      endAt: String(endAt),
      type: 'url',
    }),
    umamiFetch(`/websites/${WEBSITE_ID}/metrics`, {
      startAt: String(startAt),
      endAt: String(endAt),
      type: 'referrer',
    }),
    umamiFetch(`/websites/${WEBSITE_ID}/metrics`, {
      startAt: String(startAt),
      endAt: String(endAt),
      type: 'browser',
    }),
    umamiFetch(`/websites/${WEBSITE_ID}/metrics`, {
      startAt: String(startAt),
      endAt: String(endAt),
      type: 'os',
    }),
    umamiFetch(`/websites/${WEBSITE_ID}/metrics`, {
      startAt: String(startAt),
      endAt: String(endAt),
      type: 'screen',
    }),
    umamiFetch(`/websites/${WEBSITE_ID}/metrics`, {
      startAt: String(startAt),
      endAt: String(endAt),
      type: 'country',
    }),
  ])

  const stats = statsRes ?? { pageviews: { value: 0 }, visitors: { value: 0 }, visits: { value: 0 }, bouncerate: 0, totaltime: 0 }
  const pageviews = pageviewsRes ?? { pageviews: [], visitors: [] }

  const formatMetric = (data: any[]) =>
    (data ?? []).map((d: any) => ({ label: d.x ?? d.label ?? 'Unknown', value: d.y ?? d.value ?? 0 })).sort((a: any, b: any) => b.value - a.value).slice(0, 10)

  return NextResponse.json({
    success: true,
    data: {
      totalViews: stats.pageviews?.value ?? 0,
      totalVisitors: stats.visitors?.value ?? 0,
      totalVisits: stats.visits?.value ?? 0,
      bounceRate: stats.bouncerate ?? 0,
      avgDuration: stats.totaltime && stats.visits ? Math.round(stats.totaltime / stats.visits) : 0,
      pageviews: pageviews.pageviews ?? [],
      visitors: pageviews.visitors ?? [],
      unit,
      topPages: formatMetric(urlsRes),
      referrers: formatMetric(referrersRes),
      browsers: formatMetric(browsersRes),
      os: formatMetric(osRes),
      devices: formatMetric(devicesRes),
      countries: formatMetric(countriesRes),
    },
  })
}
