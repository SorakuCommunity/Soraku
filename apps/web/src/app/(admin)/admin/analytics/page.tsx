'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Calendar,
} from 'lucide-react'
import { cn } from '@/lib/utils'

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
      format: (v: number) => v.toLocaleString('id-ID'),
    },
    {
      key: 'total_visitors',
      label: 'Total Visitors',
      icon: Users,
      format: (v: number) => v.toLocaleString('id-ID'),
    },
    {
      key: 'avg_session_duration',
      label: 'Avg. Duration',
      icon: Clock,
      format: (v: number) => {
        const mins = Math.floor(v / 60)
        const secs = v % 60
        return `${mins}m ${secs}s`
      },
    },
  ] as const

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-primary/40 mb-1 text-[9px] font-black tracking-[0.25em] uppercase">
            Analytics
          </p>
          <h1 className="text-2xl font-black tracking-tight">Statistik Website</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
            {(['7d', '30d', '90d'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                  period === p
                    ? 'bg-[#4FA3D1]/10 text-[#4FA3D1]'
                    : 'text-[#6E8FA6]/60 hover:text-[#D9DDE3]'
                )}
              >
                {p === '7d' ? '7 Hari' : p === '30d' ? '30 Hari' : '90 Hari'}
              </button>
            ))}
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="text-muted-foreground/50 hover:text-foreground hover:bg-muted/20 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs transition-all disabled:opacity-30"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
          </button>
        </div>
      </div>

      {/* Separator */}
      <div className="from-primary/20 via-border/25 -mt-4 h-px bg-gradient-to-r to-transparent" />

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {METRICS.map(({ key, label, icon: Icon, format }) => (
          <div
            key={key}
            className="group relative flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300 hover:bg-white/[0.04]"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4FA3D1]/10">
                <Icon className="h-5 w-5 text-[#4FA3D1]" />
              </div>
              <ArrowUpRight className="text-muted-foreground/20 h-3.5 w-3.5" />
            </div>
            <div>
              <div
                className={cn(
                  'text-3xl font-black tracking-tighter',
                  loading ? 'text-muted-foreground/20 animate-pulse' : 'text-foreground'
                )}
              >
                {loading ? '—' : format((data as any)?.[key] ?? 0)}
              </div>
              <p className="text-muted-foreground/40 mt-0.5 text-[11px] font-semibold">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Top Pages */}
      <div>
        <p className="text-muted-foreground/30 mb-4 text-[9px] font-black tracking-[0.25em] uppercase">
          Halaman Populer
        </p>
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="px-4 py-3 text-left text-[10px] font-black tracking-[0.15em] text-[#6E8FA6] uppercase">
                  Halaman
                </th>
                <th className="px-4 py-3 text-right text-[10px] font-black tracking-[0.15em] text-[#6E8FA6] uppercase">
                  Views
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b border-white/[0.06]">
                    <td className="px-4 py-3">
                      <div className="bg-muted/12 h-3 w-1/2 animate-pulse rounded" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="bg-muted/12 ml-auto h-3 w-12 animate-pulse rounded" />
                    </td>
                  </tr>
                ))
              ) : !data?.top_pages?.length ? (
                <tr>
                  <td
                    colSpan={2}
                    className="text-muted-foreground/30 px-4 py-8 text-center text-sm"
                  >
                    Belum ada data
                  </td>
                </tr>
              ) : (
                data.top_pages.map((page, i) => (
                  <tr
                    key={page.path}
                    className="border-b border-white/[0.06] transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3">
                      <span className="text-foreground/70 text-sm font-medium">{page.path}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-foreground/50 text-sm font-semibold">
                        {page.views.toLocaleString('id-ID')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
