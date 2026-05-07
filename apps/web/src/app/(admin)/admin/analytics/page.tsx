'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  BarChart3,
  Users,
  Eye,
  Clock,
  ArrowUpRight,
  RefreshCw,
  Info,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  cn,
} from '@soraku/ui'

interface AnalyticsData {
  total_views: number
  total_visitors: number
  avg_session_duration: number
  top_pages: { path: string; views: number }[]
  daily_stats: { date: string; views: number; visitors: number }[]
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d')

  const load = useCallback(() => {
    setLoading(true)
    fetch(`/api/admin/analytics?period=${period}`)
      .then((r) => r.json())
      .then((d) => setData(d.data ?? null))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [period])

  useEffect(() => {
    load()
  }, [load])

  const METRICS = [
    {
      key: 'total_views',
      label: 'Total Views',
      icon: Eye,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      format: (v: number) => v.toLocaleString('id-ID'),
    },
    {
      key: 'total_visitors',
      label: 'Total Visitors',
      icon: Users,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      format: (v: number) => v.toLocaleString('id-ID'),
    },
    {
      key: 'avg_session_duration',
      label: 'Avg. Duration',
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      format: (v: number) => {
        if (!v) return '0m 0s'
        const mins = Math.floor(v / 60)
        const secs = v % 60
        return `${mins}m ${secs}s`
      },
    },
  ] as const

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Statistik Website</h2>
          <p className="text-muted-foreground">Sistem Analisis & Integrasi Tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border bg-muted/50 p-1">
            {(['7d', '30d', '90d'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  'rounded-sm px-3 py-1.5 text-xs font-medium transition-colors',
                  period === p
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                )}
              >
                {p === '7d' ? '7 Hari' : p === '30d' ? '30 Hari' : '90 Hari'}
              </button>
            ))}
          </div>
          <Button
            onClick={load}
            disabled={loading}
            variant="outline"
            size="icon"
          >
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </Button>
        </div>
      </div>

      {/* Integration Status Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Google Analytics 4
              </CardTitle>
              <Badge variant="default" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">
                <CheckCircle2 className="mr-1 h-3 w-3" /> Aktif
              </Badge>
            </div>
            <CardDescription>
              ID Pengukuran: <span className="font-mono text-xs font-bold text-foreground">G-Y5TB7WK9M8</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground mb-3">
              Tag GA4 sudah terpasang dan berjalan di seluruh halaman website secara otomatis.
            </p>
            <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
              <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer">
                Buka GA4 Dashboard <ExternalLink className="ml-2 h-3 w-3" />
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                TikTok Pixel
              </CardTitle>
              <Badge variant="default" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">
                <CheckCircle2 className="mr-1 h-3 w-3" /> Aktif
              </Badge>
            </div>
            <CardDescription>
              Event Tracking Terpasang
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              TikTok Pixel terintegrasi untuk melacak pendaftaran, konversi donasi, dan tayangan konten.
            </p>
            <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
              <a href="https://ads.tiktok.com/i18n/events_manager/" target="_blank" rel="noopener noreferrer">
                Buka Events Manager <ExternalLink className="ml-2 h-3 w-3" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border bg-amber-500/10 p-4 border-amber-500/20 flex items-start gap-3">
        <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-600 dark:text-amber-400">
          <p className="font-semibold mb-1">Catatan Penting Integrasi</p>
          <p>
            Data statistik yang ditampilkan di bawah ini merupakan data dari server internal Soraku (bukan dari GA4/TikTok). 
            Untuk melihat data yang lebih komprehensif, akurat, dan real-time mengenai demografi, sumber traffic, dan perilaku pengguna, silakan gunakan Dashboard Google Analytics 4 dan TikTok Events Manager yang telah ditautkan di atas.
          </p>
        </div>
      </div>

      {/* Internal Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        {METRICS.map(({ key, label, icon: Icon, color, bgColor, format }) => (
          <Card key={key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <div className={cn("p-2 rounded-full", bgColor)}>
                <Icon className={cn("h-4 w-4", color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <div className="h-8 w-16 animate-pulse bg-muted rounded" />
                ) : (
                  format((data as any)?.[key] ?? 0)
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                Berdasarkan data server internal
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Pages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Halaman Populer</CardTitle>
          <CardDescription>Halaman yang paling banyak dilihat berdasarkan periode yang dipilih.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Halaman</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Views</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b">
                      <td className="p-4 align-middle">
                        <div className="h-4 w-1/2 animate-pulse bg-muted rounded" />
                      </td>
                      <td className="p-4 align-middle text-right">
                        <div className="h-4 w-12 animate-pulse bg-muted rounded ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : !data?.top_pages?.length ? (
                  <tr>
                    <td colSpan={2} className="p-8 text-center text-muted-foreground">
                      Belum ada data
                    </td>
                  </tr>
                ) : (
                  data.top_pages.map((page) => (
                    <tr key={page.path} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className="p-4 align-middle font-medium">
                        {page.path}
                      </td>
                      <td className="p-4 align-middle text-right">
                        {page.views.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
