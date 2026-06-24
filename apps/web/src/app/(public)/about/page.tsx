'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Code2,
  Database,
  Film,
  MessageSquareMore,
  Palette,
  PenTool,
  Rocket,
  Sparkles,
  Users2,
} from 'lucide-react'

const COMMUNITY_EXPERIENCES = [
  'Ikut diskusi tentang anime dan budaya Jepang',
  'Berbagi pengetahuan, pengalaman, dan karya kreatif',
  'Membangun portofolio serta identitas sebagai kreator',
  'Berkolaborasi dengan anggota komunitas lain',
  'Mendapatkan apresiasi melalui sistem reputasi',
]

const SKILLS = [
  { label: 'Pengembangan Web (Frontend & Backend)', Icon: Code2 },
  { label: 'Pengembangan Full Stack', Icon: Rocket },
  { label: 'DevOps', Icon: Database },
  { label: 'UI/UX & Desain Grafis', Icon: PenTool },
  { label: 'Animation', Icon: Film },
  { label: 'Data Science & Data Analyst', Icon: Palette },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-md border-2 border-black bg-surface p-6 shadow-[4px_4px_0px_#000] lg:p-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="geo-circle absolute -top-20 -right-20 h-80 w-80 opacity-30" />
          <div className="geo-diamond absolute top-40 -left-10 h-32 w-32 opacity-20" />
        </div>
        <div className="relative">
          <span className="mb-4 inline-flex items-center gap-2 rounded-md border-2 border-black bg-primary px-3 py-1.5 text-[10px] font-bold text-white shadow-[2px_2px_0px_#000]">
            <Sparkles className="h-3 w-3" />
            Ekosistem Belajar & Kreator Berbasis Komunitas
          </span>
          <h1 className="mb-4 text-[clamp(2.2rem,8vw,4rem)] leading-[0.9] font-black tracking-tighter text-foreground">
            Komunitas Soraku
          </h1>
          <p className="mb-4 max-w-3xl text-sm leading-relaxed text-muted lg:text-base">
            Platform belajar dan kreator berbasis komunitas yang berfokus pada anime, manga, dan
            industri kreatif Jepang.
          </p>
          <p className="mb-8 max-w-3xl text-sm leading-relaxed text-foreground/70">
            Soraku adalah ruang untuk belajar, berkembang, dan terhubung dengan orang-orang yang
            memiliki minat serupa, dengan pendekatan belajar terstruktur dan interaksi komunitas
            yang aktif.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://discord.gg/qm3XJvRa6B"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border-2 border-black bg-primary px-6 py-3 text-sm font-bold text-white shadow-[4px_4px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]"
            >
              Gabung Komunitas <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md border-2 border-black bg-surface px-6 py-3 text-sm font-bold text-foreground shadow-[4px_4px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]"
            >
              Jelajahi Platform
            </Link>
          </div>
        </div>
      </section>

      {/* Tentang */}
      <section className="mt-8 rounded-md border-2 border-black bg-surface p-6 shadow-[4px_4px_0px_#000] lg:p-8">
        <p className="mb-3 text-[10px] font-bold tracking-wider text-primary uppercase">
          Tentang Soraku
        </p>
        <p className="text-sm leading-relaxed text-muted lg:text-base">
          Komunitas Soraku adalah komunitas belajar dan pengembangan diri yang berfokus pada pop
          culture Jepang, termasuk anime, manga, ilustrasi, dan industri kreatif.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-foreground/70 lg:text-base">
          Soraku adalah ruang terbuka bagi siapa pun untuk belajar, berkembang, dan terhubung
          dengan orang-orang yang memiliki minat serupa. Dengan pendekatan berbasis komunitas,
          Soraku menggabungkan pembelajaran terstruktur dan interaksi sosial aktif agar proses
          belajar lebih menarik, kolaboratif, dan relevan.
        </p>
      </section>

      {/* Positioning */}
      <section className="mt-8">
        <p className="mb-2 text-[10px] font-bold tracking-wider text-primary uppercase">
          Positioning
        </p>
        <h2 className="mb-4 text-3xl font-black tracking-tighter text-foreground lg:text-4xl">
          Soraku terinspirasi dari platform belajar modern
        </h2>
        <p className="mb-6 max-w-4xl text-sm leading-relaxed text-muted lg:text-base">
          Referensi kami berasal dari standar platform belajar modern, namun Soraku dibangun
          dengan pendekatan yang lebih dekat ke komunitas dan budaya.
        </p>
        <div className="inline-flex items-start gap-3 rounded-md border-2 border-black bg-primary/10 p-4 shadow-[3px_3px_0px_#000]">
          <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <span className="text-sm font-bold text-foreground">
            Berbeda dari platform lain, Soraku berfokus pada komunitas, interaksi, dan budaya.
          </span>
        </div>
      </section>

      {/* Pengalaman Komunitas */}
      <section className="mt-12">
        <p className="mb-2 text-[10px] font-bold tracking-wider text-primary uppercase">
          Pengalaman Komunitas
        </p>
        <h2 className="mb-6 text-3xl font-black tracking-tighter text-foreground lg:text-4xl">
          Hal yang Bisa Kamu Lakukan di Soraku
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {COMMUNITY_EXPERIENCES.map((item) => (
            <div
              key={item}
              className="rounded-md border-2 border-black bg-surface p-5 shadow-[3px_3px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#000]"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md border-2 border-black bg-primary/20">
                <MessageSquareMore className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-bold leading-relaxed text-foreground lg:text-base">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="mt-12">
        <p className="mb-2 text-[10px] font-bold tracking-wider text-primary uppercase">
          Pengembangan Skill
        </p>
        <h2 className="mb-6 text-3xl font-black tracking-tighter text-foreground lg:text-4xl">
          Pelajari Skill yang Relevan dengan Industri
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SKILLS.map(({ label, Icon }) => (
            <div
              key={label}
              className="rounded-md border-2 border-black bg-surface p-5 shadow-[3px_3px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#000]"
            >
              <div className="mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <Icon className="h-4 w-4 text-muted" />
              </div>
              <p className="text-sm font-bold text-foreground">{label}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-4xl text-sm leading-relaxed text-muted">
          Soraku membantu anggota mengembangkan kemampuan nyata yang selaras dengan kebutuhan
          industri saat ini melalui pendekatan belajar yang kolaboratif dan praktis.
        </p>
      </section>

      {/* Pengalaman Belajar */}
      <section className="mt-8 rounded-md border-2 border-black bg-surface p-6 shadow-[4px_4px_0px_#000] lg:p-8">
        <p className="mb-3 text-[10px] font-bold tracking-wider text-primary uppercase">
          Pengalaman Belajar
        </p>
        <p className="text-sm leading-relaxed text-muted lg:text-base">
          Belajar di Soraku tidak hanya teoritis, tetapi juga kolaboratif dan praktis. Anggota
          bisa aktif berpartisipasi, membangun proyek nyata, dan berkembang bersama di dalam
          komunitas.
        </p>
      </section>

      {/* Visi */}
      <section className="mt-8 rounded-md border-2 border-black bg-surface p-6 shadow-[4px_4px_0px_#000] lg:p-8">
        <p className="mb-3 text-[10px] font-bold tracking-wider text-primary uppercase">
          Visi
        </p>
        <h2 className="mb-4 text-3xl font-black tracking-tighter text-foreground lg:text-4xl">
          Lebih dari Sekadar Platform Belajar
        </h2>
        <p className="max-w-4xl text-sm leading-relaxed text-muted lg:text-base">
          Soraku dirancang sebagai ekosistem digital yang mendukung pertumbuhan pribadi secara
          berkelanjutan, bukan hanya dari sisi pengetahuan dan skill, tetapi juga koneksi sosial
          serta identitas kreatif.
        </p>
      </section>

      {/* CTA */}
      <section className="mt-8 rounded-md border-2 border-black bg-primary/10 p-8 shadow-[4px_4px_0px_#000] text-center lg:p-10">
        <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md border-2 border-black bg-primary shadow-[2px_2px_0px_#000]">
          <Users2 className="h-6 w-6 text-white" />
        </div>
        <h2 className="mb-4 text-3xl font-black tracking-tighter text-foreground lg:text-4xl">
          Mulai Perjalananmu Bersama Soraku
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-md border-2 border-black bg-primary px-6 py-3 text-sm font-bold text-white shadow-[4px_4px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]"
          >
            Gabung Sekarang <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md border-2 border-black bg-surface px-6 py-3 text-sm font-bold text-foreground shadow-[4px_4px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]"
          >
            Jelajahi Komunitas
          </Link>
        </div>
      </section>
    </div>
  )
}
