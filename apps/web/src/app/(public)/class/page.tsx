'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Clock,
  Users,
  Award,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Button,
  cn,
} from '@soraku/ui'

interface ClassItem {
  id: string
  title: string
  description: string
  instructor: string
  duration: string
  level: 'Pemula' | 'Menengah' | 'Lanjutan'
  category: string
  students: number
  isLive: boolean
  startsAt: string
  image: string
}

const MOCK_CLASSES: ClassItem[] = [
  {
    id: '1',
    title: 'Dasar Animasi Digital dengan Procreate',
    description: 'Pelajari dasar-dasar animasi digital menggunakan Procreate, mulai dari sketsa hingga frame animasi sederhana.',
    instructor: 'Rizky Animator',
    duration: '4 minggu',
    level: 'Pemula',
    category: 'Animasi',
    students: 128,
    isLive: true,
    startsAt: '2026-05-15T19:00:00',
    image: '/assets/brand/mascot.png',
  },
  {
    id: '2',
    title: 'Web Development untuk Pemula',
    description: 'Belajar HTML, CSS, dan JavaScript dari nol. Cocok untuk pemula yang ingin terjun ke dunia web development.',
    instructor: 'Budi Dev',
    duration: '6 minggu',
    level: 'Pemula',
    category: 'Web Development',
    students: 245,
    isLive: false,
    startsAt: '2026-05-20T18:00:00',
    image: '/assets/brand/mascot.png',
  },
  {
    id: '3',
    title: 'Character Design Fundamentals',
    description: 'Menguasai teknik dasar desain karakter anime dan manga, termasuk proporsi, ekspresi, dan kostum.',
    instructor: 'Ayu Illust',
    duration: '8 minggu',
    level: 'Menengah',
    category: 'Ilustrasi',
    students: 89,
    isLive: false,
    startsAt: '2026-06-01T17:00:00',
    image: '/assets/brand/logo.png',
  },
  {
    id: '4',
    title: 'Data Science dengan Python',
    description: 'Pelajari analisis data, visualisasi, dan machine learning menggunakan Python dan library populer.',
    instructor: 'Data Sensei',
    duration: '10 minggu',
    level: 'Lanjutan',
    category: 'Data Science',
    students: 67,
    isLive: false,
    startsAt: '2026-06-05T19:00:00',
    image: '/assets/brand/logo.png',
  },
  {
    id: '5',
    title: 'Video Editing untuk Content Creator',
    description: 'Belajar teknik editing video profesional menggunakan software populer untuk kebutuhan YouTube dan TikTok.',
    instructor: 'Edit Master',
    duration: '4 minggu',
    level: 'Pemula',
    category: 'Video',
    students: 156,
    isLive: true,
    startsAt: '2026-05-18T20:00:00',
    image: '/assets/brand/mascot.png',
  },
  {
    id: '6',
    title: 'UI/UX Design Principles',
    description: 'Pelajari prinsip-prinsip desain UI/UX yang user-friendly, termasuk wireframing, prototyping, dan user testing.',
    instructor: 'Design Pro',
    duration: '6 minggu',
    level: 'Menengah',
    category: 'Design',
    students: 94,
    isLive: false,
    startsAt: '2026-06-10T18:00:00',
    image: '/assets/brand/logo.png',
  },
]

const CATEGORIES = ['Semua', 'Animasi', 'Web Development', 'Ilustrasi', 'Data Science', 'Video', 'Design']
const LEVELS = ['Semua', 'Pemula', 'Menengah', 'Lanjutan']

export default function ClassOnlinePage() {
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('Semua')
  const [level, setLevel] = useState('Semua')

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setClasses(MOCK_CLASSES)
      setLoading(false)
    }, 800)
  }, [])

  const filteredClasses = classes.filter((c) => {
    const matchCategory = category === 'Semua' || c.category === category
    const matchLevel = level === 'Semua' || c.level === level
    return matchCategory && matchLevel
  })

  function formatDate(isoStr: string) {
    const d = new Date(isoStr)
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kelas Online</h2>
          <p className="text-muted-foreground mt-1">
            Belajar dari instruktur terbaik, kapan pun dan di mana pun.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-500">Total Kelas</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-xs text-muted-foreground">Kelas tersedia</p>
          </CardContent>
        </Card>

        <Card className="bg-green-500/5 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-500">Siswa Terdaftar</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.reduce((s, c) => s + c.students, 0).toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground">Seluruh siswa</p>
          </CardContent>
        </Card>

        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-500">Kelas Live</CardTitle>
            <div className="relative">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse absolute -top-1 -right-1" />
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.filter((c) => c.isLive).length}</div>
            <p className="text-xs text-muted-foreground">Sedang berlangsung</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-500/5 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-500">Level Tertinggi</CardTitle>
            <Award className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Lanjutan</div>
            <p className="text-xs text-muted-foreground">3 kelas tersedia</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground mr-2">Kategori:</span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-medium transition-all',
              category === cat
                ? 'bg-primary text-white shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground mr-2">Level:</span>
        {LEVELS.map((lvl) => (
          <button
            key={lvl}
            onClick={() => setLevel(lvl)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-medium transition-all',
              level === lvl
                ? 'bg-primary text-white shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Class Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-40 w-full bg-muted rounded-lg mb-4" />
                <div className="h-4 w-3/4 bg-muted rounded mb-2" />
                <div className="h-3 w-1/2 bg-muted rounded" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">Tidak ada kelas</h3>
          <p className="text-sm text-muted-foreground/70">Coba ubah filter kategori atau level di atas.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClasses.map((kelas) => (
            <Card
              key={kelas.id}
              className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={kelas.image}
                  alt={kelas.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <Badge
                    variant={kelas.isLive ? 'destructive' : 'secondary'}
                    className="text-[10px]"
                  >
                    {kelas.isLive ? '🔴 LIVE' : 'Akademik'}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="outline" className="bg-black/50 border-black/50 text-white text-[10px]">
                    {kelas.level}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2 text-base">{kelas.title}</CardTitle>
                <CardDescription className="line-clamp-2">{kelas.description}</CardDescription>
                <div className="mt-3 flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {kelas.students.toLocaleString('id-ID')} siswa
                  </span>
                  <span className="text-muted-foreground/40">•</span>
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{kelas.duration}</span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">📅 Mulai: {formatDate(kelas.startsAt)}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="group-hover:border-primary/50 transition-all"
                    asChild
                  >
                    <Link href={`/class/${kelas.id}`}>
                      Detail
                      <ArrowRight className="ml-1.5 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* CTA */}
      {!loading && filteredClasses.length > 0 && (
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
            <div>
              <CardTitle className="text-lg">Mau Jadi Instruktur?</CardTitle>
              <CardDescription className="mt-1">
                Bagikan pengetahuanmu ke komunitas Soraku. Daftarkan kelasmu sekarang!
              </CardDescription>
            </div>
            <Button asChild>
              <Link href="/contact">
                Daftar Kelas <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}