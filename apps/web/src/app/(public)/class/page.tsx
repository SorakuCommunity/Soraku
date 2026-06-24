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
  Sparkles,
} from 'lucide-react'

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
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-md border-2 border-black bg-primary px-3 py-1.5 text-[10px] font-bold text-white shadow-[2px_2px_0px_#000]">
          <Sparkles className="h-3 w-3" />
          Kelas Online
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tighter text-foreground sm:text-5xl">
          Belajar dari <span className="text-primary">Instruktur Terbaik</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm text-muted">
          Belajar dari instruktur terbaik, kapan pun dan di mana pun.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-md border-2 border-black bg-surface p-5 shadow-[3px_3px_0px_#000]">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Total Kelas</p>
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-3xl font-black text-foreground">{classes.length}</p>
          <p className="text-xs text-muted">Kelas tersedia</p>
        </div>

        <div className="rounded-md border-2 border-black bg-surface p-5 shadow-[3px_3px_0px_#000]">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Siswa Terdaftar</p>
            <Users className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 text-3xl font-black text-foreground">{classes.reduce((s, c) => s + c.students, 0).toLocaleString('id-ID')}</p>
          <p className="text-xs text-muted">Seluruh siswa</p>
        </div>

        <div className="rounded-md border-2 border-black bg-surface p-5 shadow-[3px_3px_0px_#000]">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Kelas Live</p>
            <div className="relative">
              <span className="absolute -top-1 -right-1 h-2 w-2 animate-pulse rounded-full bg-red-500" />
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-black text-foreground">{classes.filter((c) => c.isLive).length}</p>
          <p className="text-xs text-muted">Sedang berlangsung</p>
        </div>

        <div className="rounded-md border-2 border-black bg-surface p-5 shadow-[3px_3px_0px_#000]">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Level Tertinggi</p>
            <Award className="h-4 w-4 text-purple-400" />
          </div>
          <p className="mt-2 text-3xl font-black text-foreground">Lanjutan</p>
          <p className="text-xs text-muted">3 kelas tersedia</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="mr-2 text-[10px] font-bold text-muted uppercase tracking-wider">Kategori:</span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-md border-2 border-black px-3 py-1.5 text-[10px] font-bold transition-all ${
              category === cat
                ? 'bg-primary text-white shadow-[2px_2px_0px_#000]'
                : 'bg-surface text-foreground hover:bg-muted/20 shadow-[2px_2px_0px_#000]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className="mr-2 text-[10px] font-bold text-muted uppercase tracking-wider">Level:</span>
        {LEVELS.map((lvl) => (
          <button
            key={lvl}
            onClick={() => setLevel(lvl)}
            className={`rounded-md border-2 border-black px-3 py-1.5 text-[10px] font-bold transition-all ${
              level === lvl
                ? 'bg-primary text-white shadow-[2px_2px_0px_#000]'
                : 'bg-surface text-foreground hover:bg-muted/20 shadow-[2px_2px_0px_#000]'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Class Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse rounded-md border-2 border-black bg-surface p-4 shadow-[3px_3px_0px_#000]">
              <div className="mb-4 h-40 w-full rounded-sm bg-muted/30" />
              <div className="mb-2 h-4 w-3/4 rounded bg-muted/30" />
              <div className="h-3 w-1/2 rounded bg-muted/30" />
            </div>
          ))}
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="py-16 text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted" />
          <h3 className="text-sm font-bold text-muted">Tidak ada kelas</h3>
          <p className="text-xs text-muted">Coba ubah filter kategori atau level di atas.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClasses.map((kelas) => (
            <div
              key={kelas.id}
              className="group overflow-hidden rounded-md border-2 border-black bg-surface shadow-[4px_4px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]"
            >
              <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/20 to-violet-500/15">
                <img
                  src={kelas.image}
                  alt={kelas.title}
                  className="h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className={`rounded-sm border-2 border-black px-2 py-0.5 text-[9px] font-bold shadow-[1px_1px_0px_#000] ${
                    kelas.isLive ? 'bg-red-600 text-white' : 'bg-surface text-foreground'
                  }`}>
                    {kelas.isLive ? '🔴 LIVE' : 'Akademik'}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="rounded-sm border-2 border-black bg-black px-2 py-0.5 text-[9px] font-bold text-white shadow-[1px_1px_0px_#000]">
                    {kelas.level}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="line-clamp-2 text-sm font-bold text-foreground">{kelas.title}</h3>
                <p className="mt-1 line-clamp-2 text-[10px] text-muted">{kelas.description}</p>
                <div className="mt-3 flex items-center gap-2 text-[10px] text-muted">
                  <Users className="h-3 w-3" />
                  <span>{kelas.students.toLocaleString('id-ID')} siswa</span>
                  <span className="text-muted/40">•</span>
                  <Clock className="h-3 w-3" />
                  <span>{kelas.duration}</span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t-2 border-black pt-3">
                  <span className="text-[9px] text-muted">📅 Mulai: {formatDate(kelas.startsAt)}</span>
                  <Link
                    href={`/class/${kelas.id}`}
                    className="inline-flex items-center gap-1 rounded-sm border-2 border-black bg-surface px-2.5 py-1 text-[10px] font-bold text-foreground shadow-[2px_2px_0px_#000] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000]"
                  >
                    Detail <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      {!loading && filteredClasses.length > 0 && (
        <div className="mt-8 rounded-md border-2 border-black bg-gradient-to-br from-primary/10 to-surface p-6 shadow-[4px_4px_0px_#000] sm:p-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <h3 className="text-lg font-black text-foreground">Mau Jadi Instruktur?</h3>
              <p className="mt-1 text-sm text-muted">Bagikan pengetahuanmu ke komunitas Soraku.</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md border-2 border-black bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-[3px_3px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#000]"
            >
              Daftar Kelas <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}