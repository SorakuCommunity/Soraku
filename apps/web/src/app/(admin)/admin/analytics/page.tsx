'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  BarChart3, Users, Eye, Clock, ArrowUpRight, RefreshCw,
  Info, CheckCircle2, ExternalLink, Globe, Monitor,
  Smartphone, Tablet, Cpu, MousePointerClick,
} from 'lucide-react'
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  Button, Badge, cn,
} from '@soraku/ui'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'

interface UmamiData {
  totalViews: number
  totalVisitors: number
  totalVisits: number
  bounceRate: number
  avgDuration: number
  pageviews: { date: string; value: number }[]
  visitors: { date: string; value: number }[]
  unit: string
  topPages: { label: string; value: number }[]
  referrers: { label: string; value: number }[]
  browsers: { label: string; value: number }[]
  os: { label: string; value: number }[]
  devices: { label: string; value: number }[]
  countries: { label: string; value: number }[]
}

const COLORS = ['#4FA3D1', '#6EDCD4', '#E8C2A8', '#F4A7A7', '#A8D8E8', '#B8A8E8', '#F4D8A8', '#A8E8C8', '#E8A8C8', '#C8D8E8']

export default function AnalyticsPage() {
  const [data, setData] = useState<UmamiData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d')
  const [hasToken, setHasToken] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    fetch(`/api/admin/umami?period=${period}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data) setData(d.data)
        else setHasToken(false)
      })
      .catch(() => setHasToken(false))
      .finally(() => setLoading(false))
  }, [period])

  useEffect(() => { load() }, [load])

  const METRICS = [
    { key: 'totalViews', label: 'Total Views', icon: Eye, color: 'text-blue-500', bg: 'bg-blue-500/10', fmt: (v: number) => v.toLocaleString('id-ID') },
    { key: 'totalVisitors', label: 'Unique Visitors', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10', fmt: (v: number) => v.toLocaleString('id-ID') },
    { key: 'totalVisits', label: 'Total Kunjungan', icon: MousePointerClick, color: 'text-violet-500', bg: 'bg-violet-500/10', fmt: (v: number) => v.toLocaleString('id-ID') },
    { key: 'bounceRate', label: 'Bounce Rate', icon: ArrowUpRight, color: 'text-rose-500', bg: 'bg-rose-500/10', fmt: (v: number) => `${v.toFixed(1)}%` },
    { key: 'avgDuration', label: 'Rata-rata Durasi', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', fmt: (v: number) => {
      if (!v) return '0d'
      const m = Math.floor(v / 60)
      const s = v % 60
      return `${m}m ${s}s`
    }},
  ] as const

  const renderBarChart = (title: string, desc: string, data: { label: string; value: number }[], color = '#4FA3D1') => (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle><CardDescription>{desc}</CardDescription></CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-64 animate-pulse bg-muted rounded" />
        ) : !data?.length ? (
          <p className="text-muted-foreground text-sm py-8 text-center">Belum ada data</p>
        ) : (
          <div className="space-y-3">
            {data.slice(0, 8).map((item, i) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="truncate">{item.label || '(direct)'}</span>
                  <span className="font-semibold">{item.value.toLocaleString('id-ID')}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((item.value / Math.max(...data.slice(0, 8).map(d => d.value))) * 100, 100)}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderPie = (title: string, desc: string, data: { label: string; value: number }[]) => (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle><CardDescription>{desc}</CardDescription></CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-64 animate-pulse bg-muted rounded" />
        ) : !data?.length ? (
          <p className="text-muted-foreground text-sm py-8 text-center">Belum ada data</p>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={data.slice(0, 6)} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={90} innerRadius={50}>
                  {data.slice(0, 6).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Statistik Website</h2>
          <p className="text-muted-foreground">Analisis berbasis Umami Analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border bg-muted/50 p-1">
            {(['7d', '30d', '90d'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  'rounded-sm px-3 py-1.5 text-xs font-medium transition-colors',
                  period === p ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                )}
              >{p === '7d' ? '7 Hari' : p === '30d' ? '30 Hari' : '90 Hari'}</button>
            ))}
          </div>
          <Button onClick={load} disabled={loading} variant="outline" size="icon">
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" /> Google Analytics 4
              </CardTitle>
              <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">
                <CheckCircle2 className="mr-1 h-3 w-3" /> Aktif
              </Badge>
            </div>
            <CardDescription>ID: G-Y5TB7WK9M8</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
              <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer">
                Buka GA4 <ExternalLink className="ml-2 h-3 w-3" />
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" /> Umami Analytics
              </CardTitle>
              <Badge className={cn('border', hasToken ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20')}>
                {hasToken ? <><CheckCircle2 className="mr-1 h-3 w-3" /> Aktif</> : 'Belum Dikonfigurasi'}
              </Badge>
            </div>
            <CardDescription>Cloud (cloud.umami.is)</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              {hasToken
                ? 'Data real-time di bawah berasal dari Umami. Atur token di env UMAMI_API_TOKEN.'
                : 'Tambahkan UMAMI_API_TOKEN ke .env untuk mengaktifkan dashboard ini.'}
            </p>
            <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
              <a href="https://cloud.umami.is" target="_blank" rel="noopener noreferrer">
                Buka Umami <ExternalLink className="ml-2 h-3 w-3" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border bg-amber-500/10 p-4 border-amber-500/20 flex items-start gap-3">
        <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-600 dark:text-amber-400">
          <p className="font-semibold mb-1">Data Real-time dari Umami</p>
          <p>Data di bawah bersumber dari Umami Analytics (cloud.umami.is). Tidak seperti GA4, Umami menghormati privasi pengguna dan tidak menggunakan cookie.</p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
        {METRICS.map(({ key, label, icon: Icon, color, bg, fmt }) => (
          <Card key={key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">{label}</CardTitle>
              <div className={cn('p-2 rounded-full', bg)}><Icon className={cn('h-3.5 w-3.5', color)} /></div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {loading ? <div className="h-6 w-16 animate-pulse bg-muted rounded" /> : fmt((data as any)?.[key] ?? 0)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pageviews & Visitors {period === '7d' ? 'Per Jam' : 'Per Hari'}</CardTitle>
          <CardDescription>Grafik pageviews dan unique visitors selama periode yang dipilih.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-72 animate-pulse bg-muted rounded" />
          ) : !data?.pageviews?.length ? null : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.pageviews.map((pv: any, i: number) => ({
                date: pv.date?.split(' ')[0] ?? pv.date ?? `Hari ${i + 1}`,
                pageviews: pv.value ?? 0,
                visitors: data.visitors[i]?.value ?? 0,
              }))}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
                <Tooltip />
                <Line type="monotone" dataKey="pageviews" stroke="#4FA3D1" strokeWidth={2} dot={false} name="Pageviews" />
                <Line type="monotone" dataKey="visitors" stroke="#6EDCD4" strokeWidth={2} dot={false} name="Visitors" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {renderBarChart('Halaman Populer', 'Top 10 halaman dengan kunjungan terbanyak', data?.topPages ?? [])}
        {renderBarChart('Referrer', 'Domain asal pengunjung', data?.referrers ?? [])}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {renderPie('Browser', 'Browser yang digunakan', data?.browsers ?? [])}
        {renderPie('Sistem Operasi', 'OS pengunjung', data?.os ?? [])}
        {renderPie('Perangkat', 'Tipe perangkat', data?.devices ?? [])}
      </div>

      {data?.countries?.length ? (
        <Card>
          <CardHeader><CardTitle>Negara</CardTitle><CardDescription>Distribusi pengunjung berdasarkan negara</CardDescription></CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-48 animate-pulse bg-muted rounded" />
            ) : (
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {data.countries.filter(c => c.label !== 'Unknown').map((c, i) => (
                  <div key={c.label} className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: COLORS[i % COLORS.length] + '20', color: COLORS[i % COLORS.length] }}>
                      {c.label.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{c.label}</p>
                      <p className="text-xs text-muted-foreground">{c.value.toLocaleString('id-ID')} kunjungan</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
