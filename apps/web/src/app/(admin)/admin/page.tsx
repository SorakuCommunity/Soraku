'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  BookOpen,
  Calendar,
  ImageIcon,
  Users,
  Plus,
  Clock,
  CheckCircle,
  Eye,
  RefreshCw,
  ArrowUpRight,
  Pencil,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  cn,
} from '@soraku/ui'

interface AdminStats {
  blog_count: number
  event_count: number
  gallery_pending: number
  member_count: number
  recent_posts: { id: string; title: string; slug: string; ispublished: boolean }[]
  pending_gallery: { id: string; title: string | null; imageurl: string; tags: string[] }[]
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => setStats(d.data ?? null))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const METRICS = [
    {
      key: 'blog_count',
      label: 'Artikel',
      icon: BookOpen,
      href: '/admin/blog',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      key: 'event_count',
      label: 'Event',
      icon: Calendar,
      href: '/admin/events',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      key: 'gallery_pending',
      label: 'Review Galeri',
      icon: ImageIcon,
      href: '/admin/gallery',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      key: 'member_count',
      label: 'Member',
      icon: Users,
      href: '/admin/users',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ] as const

  const QUICK = [
    {
      label: 'Artikel Baru',
      href: '/admin/blog/new',
      icon: BookOpen,
    },
    {
      label: 'Event Baru',
      href: '/admin/events/new',
      icon: Calendar,
    },
    {
      label: 'Review Galeri',
      href: '/admin/gallery',
      icon: ImageIcon,
    },
    {
      label: 'Kelola Users',
      href: '/admin/users',
      icon: Users,
    },
  ]

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome to the Soraku admin panel.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={load} disabled={loading} variant="outline" size="sm" className="hidden sm:flex">
            <RefreshCw className={cn('mr-2 h-4 w-4', loading && 'animate-spin')} />
            Refresh
          </Button>
          <Button onClick={load} disabled={loading} variant="outline" size="icon" className="sm:hidden">
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {METRICS.map(({ key, label, icon: Icon, href, color, bgColor }) => (
          <Link key={key} href={href}>
            <Card className="hover:bg-muted/50 transition-colors">
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
                    ((stats as any)?.[key] ?? 0).toLocaleString('id-ID')
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  Total records <ArrowUpRight className="ml-1 h-3 w-3" />
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {QUICK.map(({ label, href, icon: Icon }) => (
          <Button key={href} variant="outline" className="h-20 flex-col gap-2" asChild>
            <Link href={href}>
              <Icon className="h-5 w-5 text-muted-foreground" />
              <span>{label}</span>
            </Link>
          </Button>
        ))}
      </div>

      {/* Recent Content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent blog posts */}
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Artikel Terbaru</CardTitle>
              <CardDescription>
                Artikel terbaru yang diterbitkan.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
               <Link href="/admin/blog">Semua <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-3/4 animate-pulse bg-muted rounded" />
                      <div className="h-3 w-1/4 animate-pulse bg-muted rounded" />
                    </div>
                  </div>
                ))
              ) : !stats?.recent_posts?.length ? (
                <div className="text-center py-6 text-sm text-muted-foreground">Belum ada artikel</div>
              ) : (
                stats.recent_posts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{post.title}</p>
                      <div className="flex items-center gap-2">
                         {post.ispublished ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-500">
                            <CheckCircle className="h-3 w-3" />
                            Publik
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            Draft
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" asChild>
                         <Link href={`/blog/${post.slug}`}>
                            <Eye className="h-4 w-4" />
                         </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                         <Link href={`/admin/blog/${post.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                         </Link>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending gallery */}
        <Card className="col-span-3">
           <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Galeri Pending</CardTitle>
              <CardDescription>
                Menunggu untuk di-review.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
               <Link href="/admin/gallery">Review <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
               {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-10 w-10 animate-pulse bg-muted rounded-md" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-1/2 animate-pulse bg-muted rounded" />
                      <div className="h-3 w-1/4 animate-pulse bg-muted rounded" />
                    </div>
                  </div>
                ))
              ) : !stats?.pending_gallery?.length ? (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  <CheckCircle className="mx-auto mb-2 h-6 w-6 text-emerald-500/50" />
                  Semua galeri sudah diproses
                </div>
              ) : (
                stats.pending_gallery.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                      <Image
                        src={item.imageurl}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {item.title || 'Tanpa judul'}
                      </p>
                      {item.tags.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {item.tags.slice(0, 2).join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="font-medium text-xs text-amber-500">
                      Pending
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
