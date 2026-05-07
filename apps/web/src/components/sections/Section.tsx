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

export function Section() {
  return (
    <>
      <section className="relative overflow-hidden px-6 pt-16 pb-20 sm:px-10 sm:pt-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-16 left-[8%] h-64 w-64 rounded-full bg-[#4FA3D1]/10 blur-3xl" />
          <div className="absolute right-[6%] bottom-12 h-72 w-72 rounded-full bg-[#7C3AED]/12 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8">
          <div>
            <div className="reveal-up mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white/60">
              <Sparkles className="h-3.5 w-3.5 text-[#4FA3D1]" />
              Ekosistem Belajar & Kreator Berbasis Komunitas
            </div>
            <h1 className="reveal-up reveal-delay-1 mb-5 text-[clamp(2.2rem,8vw,5rem)] leading-[0.9] font-black tracking-tight text-white">
              Komunitas Soraku
            </h1>
            <p className="reveal-up reveal-delay-2 mb-5 max-w-3xl text-lg leading-relaxed text-white/75 sm:text-xl">
              Platform belajar dan kreator berbasis komunitas yang berfokus pada anime, manga, dan
              industri kreatif Jepang.
            </p>
            <p className="reveal-up reveal-delay-3 mb-9 max-w-3xl text-sm leading-relaxed text-white/50 sm:text-base">
              Soraku adalah ruang untuk belajar, berkembang, dan terhubung dengan orang-orang yang
              memiliki minat serupa, dengan pendekatan belajar terstruktur dan interaksi komunitas
              yang aktif.
            </p>
            <div className="reveal-up reveal-delay-4 flex flex-wrap items-center gap-3">
              <a
                href="https://discord.gg/qm3XJvRa6B"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4FA3D1] to-[#3A8FBE] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#4FA3D1]/20 transition-all hover:-translate-y-0.5 hover:brightness-110"
              >
                Gabung Komunitas <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white/80 transition-all hover:bg-white/[0.07]"
              >
                Jelajahi Platform
              </Link>
            </div>
          </div>

           <div className="relative mt-8 lg:mt-0">
             {/* Mascot blending with background */}
             <div className="hidden lg:block lg:absolute lg:top-[20%] lg:right-[-5%] lg:w-[340px] lg:h-[400px] z-[-1]">
               <Image
                 src="/assets/brand/mascot.png"
                 alt="Mascot Soraku"
                 width={340}
                 height={400}
                 className="object-contain opacity-30"
               />
             </div>
             {/* Optional: show mascot on mobile below content */}
             <div className="lg:hidden mt-10 flex justify-center">
               <Image
                 src="/assets/brand/mascot.png"
                 alt="Mascot Soraku"
                 width={200}
                 height={235}
                 className="object-contain opacity-20"
               />
             </div>
           </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm sm:p-10">
          <p className="mb-3 text-xs font-semibold tracking-[0.24em] text-[#4FA3D1] uppercase">
            Tentang Soraku
          </p>
          <p className="text-sm leading-relaxed text-white/70 sm:text-base">
            Komunitas Soraku adalah komunitas belajar dan pengembangan diri yang berfokus pada pop
            culture Jepang, termasuk anime, manga, ilustrasi, dan industri kreatif.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
            Soraku adalah ruang terbuka bagi siapa pun untuk belajar, berkembang, dan terhubung
            dengan orang-orang yang memiliki minat serupa. Dengan pendekatan berbasis komunitas,
            Soraku menggabungkan pembelajaran terstruktur dan interaksi sosial aktif agar proses
            belajar lebih menarik, kolaboratif, dan relevan.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 text-xs font-semibold tracking-[0.24em] text-[#4FA3D1] uppercase">
            Positioning
          </p>
          <h2 className="mb-8 text-3xl leading-tight font-black text-white sm:text-4xl">
            Soraku terinspirasi dari platform belajar modern
          </h2>
          <p className="mb-6 max-w-4xl text-sm leading-relaxed text-white/65 sm:text-base">
            Referensi kami berasal dari standar platform belajar modern, namun Soraku dibangun
            dengan pendekatan yang lebih dekat ke komunitas dan budaya.
          </p>
          <div className="inline-flex items-start gap-2 rounded-2xl border border-[#4FA3D1]/25 bg-[#4FA3D1]/10 px-4 py-3 text-sm leading-relaxed text-white/80 sm:text-base">
            <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#4FA3D1]" />
            Berbeda dari platform lain, Soraku berfokus pada komunitas, interaksi, dan budaya.
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 text-xs font-semibold tracking-[0.24em] text-[#4FA3D1] uppercase">
            Pengalaman Komunitas
          </p>
          <h2 className="mb-8 text-3xl leading-tight font-black text-white sm:text-4xl">
            Hal yang Bisa Kamu Lakukan di Soraku
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {COMMUNITY_EXPERIENCES.map((item) => (
              <div
                key={item}
                className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#4FA3D1]/25 bg-[#4FA3D1]/10">
                  <MessageSquareMore className="h-4 w-4 text-[#4FA3D1]" />
                </div>
                <p className="text-sm leading-relaxed text-white/75 sm:text-base">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 text-xs font-semibold tracking-[0.24em] text-[#4FA3D1] uppercase">
            Pengembangan Skill
          </p>
          <h2 className="mb-8 text-3xl leading-tight font-black text-white sm:text-4xl">
            Pelajari Skill yang Relevan dengan Industri
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SKILLS.map(({ label, Icon }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all hover:-translate-y-0.5 hover:border-[#4FA3D1]/35 hover:bg-[#4FA3D1]/6"
              >
                <div className="mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#4FA3D1]" />
                  <Icon className="h-4 w-4 text-white/60" />
                </div>
                <p className="text-sm leading-relaxed font-medium text-white/80">{label}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-4xl text-sm leading-relaxed text-white/60 sm:text-base">
            Soraku membantu anggota mengembangkan kemampuan nyata yang selaras dengan kebutuhan
            industri saat ini melalui pendekatan belajar yang kolaboratif dan praktis.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-[#22252c] p-8 sm:p-10">
          <p className="mb-3 text-xs font-semibold tracking-[0.24em] text-[#4FA3D1] uppercase">
            Pengalaman Belajar
          </p>
          <p className="text-sm leading-relaxed text-white/70 sm:text-base">
            Belajar di Soraku tidak hanya teoritis, tetapi juga kolaboratif dan praktis. Anggota
            bisa aktif berpartisipasi, membangun proyek nyata, dan berkembang bersama di dalam
            komunitas.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-12">
          <p className="mb-3 text-xs font-semibold tracking-[0.24em] text-[#4FA3D1] uppercase">
            Visi
          </p>
          <h2 className="mb-4 text-3xl leading-tight font-black text-white sm:text-4xl">
            Lebih dari Sekadar Platform Belajar
          </h2>
          <p className="max-w-4xl text-sm leading-relaxed text-white/65 sm:text-base">
            Soraku dirancang sebagai ekosistem digital yang mendukung pertumbuhan pribadi secara
            berkelanjutan, bukan hanya dari sisi pengetahuan dan skill, tetapi juga koneksi sosial
            serta identitas kreatif.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 pt-6 pb-20 sm:pt-8 sm:pb-24">
        <div className="mx-auto max-w-6xl rounded-3xl border border-[#4FA3D1]/30 bg-gradient-to-br from-[#4FA3D1]/14 via-[#2b313c]/70 to-[#7C3AED]/14 p-8 text-center sm:p-12">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06]">
            <Users2 className="h-6 w-6 text-[#4FA3D1]" />
          </div>
          <h2 className="mb-4 text-3xl font-black text-white sm:text-4xl">
            Mulai Perjalananmu Bersama Soraku
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4FA3D1] to-[#3A8FBE] px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
            >
              Gabung Sekarang <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white/80 transition-all hover:bg-white/[0.08]"
            >
              Jelajahi Komunitas
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
