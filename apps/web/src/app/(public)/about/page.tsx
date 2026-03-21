export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Users, ExternalLink } from 'lucide-react'
import { DiscordIcon } from '@/components/icons/custom-icons'

// Serializable social data (no React.FC inside) — safe to pass to Client Component
const SOCIAL_DATA = [
  { slug: 'discord', name: 'Discord', href: 'https://discord.gg/qm3XJvRa6B' },
  { slug: 'instagram', name: 'Instagram', href: 'https://www.instagram.com/soraku.moe' },
  { slug: 'facebook', name: 'Facebook', href: 'https://www.facebook.com/share/1HQs9ZZeCw/' },
  { slug: 'x', name: 'X / Twitter', href: 'https://twitter.com/@AppSora' },
  { slug: 'tiktok', name: 'TikTok', href: 'https://www.tiktok.com/@soraku.id' },
  { slug: 'youtube', name: 'YouTube', href: 'https://youtube.com/@chsoraku' },
  { slug: 'bluesky', name: 'Bluesky', href: 'https://bsky.app/profile/soraku.id' },
]
import { AboutStatsClient } from './stats-client'
import { AboutScrollers, type SocialData } from './scrollers-client'

export const metadata: Metadata = {
  title: 'Tentang Kami — Soraku Community',
  description:
    '空 (Sora) = langit. Kenali visi, pilar, tim, dan perjalanan Soraku Community sejak 2023.',
}

// ─── Static data ─────────────────────────────────────────────────────────────

const CATEGORIES = [
  '🎌 Anime',
  '📚 Manga',
  '🎵 J-Music',
  '🎭 VTuber',
  '🎨 Fanart',
  '👘 Cosplay',
  '🎮 Gaming',
  '🍜 J-Food',
  '📖 Light Novel',
  '🌸 Budaya Jepang',
  '🎤 Cosplay Contest',
  '🏆 Turnamen',
  '📺 Nonton Bareng',
]

// 3 Pilar — Manager, Agensi, Admin
const PILLARS = [
  {
    role: 'MANAGER',
    icon: '🛡️',
    title: 'Manager',
    desc: 'Tulang punggung operasional Soraku. Manager bertanggung jawab atas moderasi konten, pengelolaan event & blog, serta memastikan platform berjalan sesuai visi komunitas.',
    duties: ['Moderasi konten & blog', 'Kelola event & gathering', 'Supervisi kreator'],
    gradient: 'from-violet-500/15 to-purple-500/8',
    border: 'border-violet-500/20',
    accent: 'text-violet-300',
    bg: 'bg-violet-500/10',
  },
  {
    role: 'AGENSI',
    icon: '🎭',
    title: 'Agensi',
    desc: 'Pilar kreativitas Soraku. Tim Agensi mengelola VTuber & talent lokal — dari manajemen profil, jadwal stream, kolaborasi, hingga pengembangan karier kreator Indonesia.',
    duties: ['Kelola profil VTuber & talent', 'Jadwal & kolaborasi stream', 'Pengembangan kreator'],
    gradient: 'from-primary/15 to-blue-500/8',
    border: 'border-primary/20',
    accent: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    role: 'ADMIN',
    icon: '⚙️',
    title: 'Admin',
    desc: 'Penjaga ekosistem komunitas. Admin mengurus moderasi member, kuasi galeri karya, dan memastikan setiap kontribusi anggota mendapat tempat yang layak di Soraku.',
    duties: ['Moderasi member & galeri', 'Review & approve karya', 'Kelola agensi & talent'],
    gradient: 'from-accent/15 to-yellow-500/8',
    border: 'border-accent/20',
    accent: 'text-accent',
    bg: 'bg-accent/10',
  },
]

// Timeline Soraku dari 2023
const TIMELINE = [
  {
    year: '2023',
    month: 'Awal',
    title: 'Lahirnya "Sora"',
    desc: 'Komunitas dimulai dengan nama sederhana: Sora — hanya server Discord kecil dengan beberapa orang yang sama-sama suka anime. Tidak ada website, tidak ada struktur. Hanya passion.',
    icon: '🌱',
    highlight: true,
  },
  {
    year: '2023',
    month: 'Mid',
    title: 'Berkembang jadi Soraku',
    desc: 'Seiring berkembangnya anggota, nama berubah menjadi Soraku — "Langitku". Ditambahkan sufiks -ku sebagai simbol bahwa langit ini milik semua anggotanya, bukan satu orang.',
    icon: '✨',
    highlight: false,
  },
  {
    year: '2023',
    month: 'Akhir',
    title: 'Event Pertama',
    desc: 'Event perdana Soraku digelar — nonton bareng online yang sederhana, tapi menjadi pondasi tradisi gathering rutin komunitas hingga sekarang.',
    icon: '🎌',
    highlight: false,
  },
  {
    year: '2024',
    month: 'Q1',
    title: 'Platform Web Lahir',
    desc: 'Tim inti terbentuk: Riu, Sora, Bubu, Kaizo. Platform web Soraku mulai dibangun dari nol — blog, galeri, event, dan sistem member pertama kali hadir.',
    icon: '🚀',
    highlight: false,
  },
  {
    year: '2024',
    month: 'Q2',
    title: 'Agensi Soraku Berdiri',
    desc: 'Soraku Agensi resmi terbentuk, membuka jalur bagi VTuber dan talent lokal Indonesia untuk berkembang di bawah naungan komunitas.',
    icon: '🎭',
    highlight: false,
  },
  {
    year: '2025',
    month: 'Q1',
    title: '500+ Member Discord',
    desc: 'Milestone bersejarah — server Discord Soraku menembus 500 anggota aktif. Platform makin lengkap dengan sistem premium, donatur, dan bot Discord terintegrasi.',
    icon: '🏆',
    highlight: false,
  },
  {
    year: '2026',
    month: 'Now',
    title: 'v1.0 — Platform Penuh',
    desc: 'Soraku terus tumbuh. Platform dibangun ulang dari nol dengan stack modern — Next.js 16, Supabase, sistem notifikasi, dan banyak fitur baru untuk komunitas.',
    icon: '🌸',
    highlight: true,
  },
]

// Team
const TEAM = [
  {
    name: 'Riu',
    role: 'Owner & Koordinator',
    desc: 'Pemimpin komunitas & pemegang visi Soraku. Semua keputusan besar melewati Riu.',
    emoji: '👑',
    badge: 'OWNER',
    color: 'from-yellow-400/20 to-amber-500/8',
    bcolor: 'bg-yellow-400/15 text-yellow-300 border-yellow-400/25',
  },
  {
    name: 'Sora',
    role: 'Core / Full Stack Lead',
    desc: 'Arsitek platform — backend, infrastruktur, dan semua yang ada di balik layar.',
    emoji: '⚙️',
    badge: 'FULL STACK',
    color: 'from-primary/20 to-blue-500/8',
    bcolor: 'bg-primary/15 text-primary border-primary/20',
  },
  {
    name: 'Bubu',
    role: 'Front-end Developer',
    desc: 'Wajah visual Soraku — setiap animasi, spacing, dan komponen yang kamu lihat.',
    emoji: '🎨',
    badge: 'FRONT-END',
    color: 'from-pink-500/20 to-rose-500/8',
    bcolor: 'bg-pink-500/15 text-pink-300 border-pink-500/20',
  },
  {
    name: 'Kaizo',
    role: 'Back-end Developer',
    desc: 'Fondasi data Soraku — API, database, auth, dan semua integrasi layanan.',
    emoji: '🔧',
    badge: 'BACK-END',
    color: 'from-violet-500/20 to-purple-500/8',
    bcolor: 'bg-violet-500/15 text-violet-300 border-violet-500/20',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      {/* ══════════════ HERO ══════════════ */}
      <section className="relative overflow-hidden">
        {/* Atmosphere */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="animate-blob bg-primary/9 absolute -top-48 -left-24 h-[600px] w-[600px] rounded-full blur-[160px]" />
          <div className="animate-blob animation-delay-2000 bg-accent/6 absolute top-0 right-0 h-[500px] w-[500px] rounded-full blur-[140px]" />
          <div className="animate-blob animation-delay-4000 bg-primary/5 absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full blur-[130px]" />
          <svg
            className="absolute inset-0 h-full w-full opacity-[0.016]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="abgrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#4FA3D1" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#abgrid)" />
          </svg>
        </div>

        <div className="mx-auto max-w-7xl px-4 pt-12 pb-4 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
          <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[1fr_400px] lg:items-center lg:gap-14">
            {/* ── Copy ── */}
            <div>
              <div className="border-primary/20 bg-primary/8 text-primary/70 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] uppercase">
                <span className="bg-primary/70 h-1.5 w-1.5 animate-pulse rounded-full" />
                Tentang Soraku Community
              </div>

              {/* Giant kanji + wordmark */}
              <div className="mb-5 flex items-end gap-5">
                <span
                  className="text-gradient leading-none font-black select-none"
                  style={{ fontSize: 'clamp(5rem,15vw,10rem)', lineHeight: 0.85 }}
                >
                  空
                </span>
                <div className="pb-1">
                  <p className="text-foreground/90 text-2xl leading-none font-black tracking-tight">
                    Soraku
                  </p>
                  <p className="text-muted-foreground/50 mt-1 text-sm">Community</p>
                </div>
              </div>

              <h1 className="text-foreground/90 text-[clamp(1.4rem,3.5vw,2.4rem)] leading-tight font-black tracking-tight">
                Langit yang <span className="text-gradient">milik semua</span>
              </h1>

              <blockquote className="border-primary/40 mt-5 border-l-2 pl-5">
                <p className="text-muted-foreground/75 text-sm leading-relaxed font-medium italic sm:text-base">
                  "Langit tidak membatasi siapa yang boleh memandangnya."
                </p>
                <footer className="text-muted-foreground/35 mt-1.5 text-[10px] font-bold tracking-widest uppercase">
                  — Filosofi Soraku Community
                </footer>
              </blockquote>

              <p className="text-muted-foreground mt-5 max-w-lg text-sm leading-relaxed">
                Platform komunitas non-profit Indonesia untuk pecinta anime, manga, J-Music, VTuber,
                cosplay, dan semesta budaya Jepang. Berdiri sejak 2023, gratis selamanya.
              </p>
            </div>

            {/* ── Mascot ── */}
            <div className="hidden lg:flex lg:justify-center">
              <div className="relative">
                <div className="bg-primary/6 absolute inset-0 -m-8 rounded-3xl blur-3xl" />
                <div className="glass-card relative h-[460px] w-[350px] overflow-hidden rounded-[2rem] p-0">
                  <Image
                    src="/logo-full.png"
                    alt="Soraku mascot"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                  <div className="from-background/50 absolute inset-x-0 top-0 h-20 bg-gradient-to-b to-transparent" />
                  <div className="from-background/95 via-background/60 absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent px-5 pt-12 pb-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-black">Soraku Community</p>
                        <p className="text-muted-foreground/55 mt-0.5 text-xs">
                          空 · Indonesia · Est. 2023
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-[10px] font-bold text-green-400">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                        Live
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ CATEGORY MARQUEE ══════════════ */}
      <section className="border-border/40 mt-8 overflow-hidden border-y py-4">
        <div className="marquee-track text-muted-foreground/35 flex gap-10 text-[11px] font-semibold tracking-widest whitespace-nowrap uppercase">
          {[...Array(4)].map((_, i) => CATEGORIES.map((c) => <span key={`${i}-${c}`}>{c}</span>))}
        </div>
      </section>

      {/* ══════════════ STATS REAL-TIME ══════════════ */}
      <AboutStatsClient />

      {/* ══════════════ KENAPA NAMA SORAKU ══════════════ */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="border-primary/15 from-primary/8 via-card/60 to-card/40 relative overflow-hidden rounded-3xl border bg-gradient-to-br p-8 backdrop-blur-sm sm:p-10 lg:p-12">
            {/* Watermark */}
            <div
              className="text-primary/4 pointer-events-none absolute top-1/2 right-6 -translate-y-1/2 leading-none font-black select-none"
              style={{ fontSize: '12rem' }}
              aria-hidden
            >
              空
            </div>

            <div className="relative">
              <p className="text-primary/60 mb-3 text-xs font-bold tracking-widest uppercase">
                Asal Nama
              </p>
              <h2 className="mb-6 text-3xl font-black tracking-tight sm:text-4xl">
                Kenapa <span className="text-gradient">"Soraku"</span>?
              </h2>

              <div className="grid gap-8 lg:grid-cols-3">
                {/* 空 */}
                <div className="border-primary/20 bg-primary/8 rounded-2xl border p-5">
                  <div className="text-gradient mb-3 text-5xl leading-none font-black">空</div>
                  <p className="text-primary/60 mb-2 text-xs font-bold tracking-widest uppercase">
                    Kanji
                  </p>
                  <p className="text-foreground font-bold">Sora = "Langit"</p>
                  <p className="text-muted-foreground/70 mt-1.5 text-sm leading-relaxed">
                    Simbol kebebasan, keluasan, dan kemungkinan tanpa batas. Langit tidak punya
                    dinding.
                  </p>
                </div>
                {/* -ku */}
                <div className="border-accent/20 bg-accent/8 rounded-2xl border p-5">
                  <div className="text-accent/80 mb-3 text-5xl leading-none font-black">-ku</div>
                  <p className="text-accent/60 mb-2 text-xs font-bold tracking-widest uppercase">
                    Sufiks Jepang
                  </p>
                  <p className="text-foreground font-bold">Possesif = "Milikku"</p>
                  <p className="text-muted-foreground/70 mt-1.5 text-sm leading-relaxed">
                    Sufiks possesif bahasa Jepang. Menegaskan kepemilikan bersama — ini langit kita
                    semua.
                  </p>
                </div>
                {/* Soraku */}
                <div className="border-border/50 bg-card/60 rounded-2xl border p-5">
                  <div className="text-foreground/90 mb-3 text-4xl leading-none font-black">
                    Soraku
                  </div>
                  <p className="text-muted-foreground/50 mb-2 text-xs font-bold tracking-widest uppercase">
                    Nama Komunitas
                  </p>
                  <p className="text-foreground font-bold">"Langitku"</p>
                  <p className="text-muted-foreground/70 mt-1.5 text-sm leading-relaxed">
                    Ruang yang dimiliki setiap anggota. Bukan milik satu orang — milik komunitas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ 3 PILAR: MANAGER, AGENSI, ADMIN ══════════════ */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-primary/60 mb-3 text-xs font-bold tracking-[0.25em] uppercase">
              Struktur
            </p>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              3 Pilar <span className="text-gradient">Soraku</span>
            </h2>
            <p className="text-muted-foreground mt-3 text-sm">
              Tiga peran kunci yang menjaga Soraku tetap berjalan dan berkembang
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {PILLARS.map(({ role, icon, title, desc, duties, gradient, border, accent, bg }) => (
              <div
                key={role}
                className={`group relative overflow-hidden rounded-3xl border ${border} bg-gradient-to-br ${gradient} p-7 backdrop-blur-sm transition-all hover:-translate-y-1.5`}
              >
                {/* Watermark */}
                <span className="pointer-events-none absolute -right-2 -bottom-3 text-[6rem] leading-none opacity-[0.06] select-none">
                  {icon}
                </span>

                {/* Badge */}
                <span
                  className={`mb-4 inline-block rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase ${bg} border ${border} ${accent}`}
                >
                  {role}
                </span>

                <div className="mb-3 text-3xl">{icon}</div>
                <h3 className="mb-3 text-xl font-black tracking-tight">{title}</h3>
                <p className="text-muted-foreground/75 mb-5 text-sm leading-relaxed">{desc}</p>

                {/* Duties */}
                <ul className="space-y-1.5">
                  {duties.map((d) => (
                    <li
                      key={d}
                      className="text-muted-foreground/65 flex items-center gap-2 text-xs"
                    >
                      <span
                        className={`h-1 w-1 flex-shrink-0 rounded-full ${bg.replace('bg-', 'bg-')}`}
                        style={{ backgroundColor: 'currentColor' }}
                      />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ TIMELINE ══════════════ */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <p className="text-primary/60 mb-3 text-xs font-bold tracking-[0.25em] uppercase">
              Perjalanan
            </p>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Timeline <span className="text-gradient">Soraku</span>
            </h2>
            <p className="text-muted-foreground mt-3 text-sm">
              Dari server kecil bernama Sora, menjadi komunitas yang terus tumbuh
            </p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="from-primary/50 via-primary/20 absolute top-4 bottom-4 left-[27px] w-0.5 bg-gradient-to-b to-transparent sm:left-[35px]" />

            <div className="space-y-6">
              {TIMELINE.map(({ year, month, title, desc, icon, highlight }) => (
                <div key={`${year}-${month}`} className="flex gap-5 sm:gap-6">
                  {/* Node */}
                  <div className="relative flex flex-shrink-0 flex-col items-center">
                    <div
                      className={`z-10 flex h-14 w-14 items-center justify-center rounded-2xl border text-xl ${
                        highlight
                          ? 'border-primary/40 bg-primary/15 shadow-primary/15 shadow-lg'
                          : 'border-border/50 bg-card/60'
                      }`}
                    >
                      {icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div
                    className={`mb-1 flex-1 rounded-2xl border px-5 py-4 transition-all hover:-translate-x-0.5 ${
                      highlight
                        ? 'border-primary/25 bg-primary/6 shadow-primary/5 shadow-md'
                        : 'border-border/40 bg-card/40'
                    }`}
                  >
                    <div className="mb-1.5 flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black tracking-widest uppercase ${highlight ? 'text-primary' : 'text-muted-foreground/50'}`}
                      >
                        {year} · {month}
                      </span>
                      {highlight && (
                        <span className="bg-primary/15 border-primary/20 text-primary rounded-full border px-2 py-0.5 text-[9px] font-bold">
                          KEY
                        </span>
                      )}
                    </div>
                    <p className="text-foreground text-sm leading-snug font-bold">{title}</p>
                    <p className="text-muted-foreground/65 mt-1.5 text-xs leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ TEAM ══════════════ */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="text-primary/60 mb-3 text-xs font-bold tracking-[0.25em] uppercase">
              Tim Inti
            </p>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Di balik layar</h2>
            <p className="text-muted-foreground mt-3 text-sm">
              4 orang yang membangun Soraku dari nol
            </p>
            <span className="mt-2 inline-block rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
              Draft — Foto profil segera hadir
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map(({ name, role, desc, emoji, badge, color, bcolor }) => (
              <div
                key={name}
                className={`group border-border/40 relative overflow-hidden rounded-3xl border bg-gradient-to-br ${color} p-6 transition-all hover:-translate-y-1.5`}
              >
                <span className="pointer-events-none absolute -right-1 -bottom-2 text-[5rem] leading-none opacity-[0.07] select-none">
                  {emoji}
                </span>
                <div className="border-border/40 bg-background/50 mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border text-3xl">
                  {emoji}
                </div>
                <span
                  className={`mb-3 inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-black tracking-wider uppercase ${bcolor}`}
                >
                  {badge}
                </span>
                <p className="text-lg leading-none font-black">{name}</p>
                <p className="text-muted-foreground/65 mt-1 text-xs font-semibold">{role}</p>
                <p className="text-muted-foreground/50 mt-2 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ DISCORD CTA ══════════════ */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="via-background/60 to-primary/8 relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 p-8 sm:p-12">
            <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="bg-primary/8 pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full blur-2xl" />

            <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-3xl border border-indigo-500/30 bg-indigo-500/15">
                <DiscordIcon className="h-10 w-10 text-indigo-300" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black tracking-tight sm:text-3xl">
                  Gabung server Discord kami
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  500+ member aktif, channel anime · manga · cosplay · game · VTuber, event rutin,
                  dan komunitas yang hangat untuk semua kalangan.
                </p>
              </div>
              <a
                href="https://discord.gg/qm3XJvRa6B"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-shrink-0 items-center gap-2.5 rounded-2xl bg-indigo-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 hover:bg-indigo-400"
              >
                <DiscordIcon className="h-4 w-4" />
                Gabung Sekarang
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ SOSIAL MEDIA SCROLLING ══════════════ */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto mb-8 max-w-6xl px-4">
          <div className="text-center">
            <p className="text-primary/60 mb-3 text-xs font-bold tracking-[0.25em] uppercase">
              Temukan Kami
            </p>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              Soraku di <span className="text-gradient">Sosial Media</span>
            </h2>
          </div>
        </div>
        {/* Client component: scrolling sosmed cards */}
        <AboutScrollers type="social" socials={SOCIAL_DATA} />
      </section>

      {/* ══════════════ PARTNERSHIP SCROLLING ══════════════ */}
      <section className="border-border/30 border-t py-14 sm:py-16">
        <div className="mx-auto mb-8 max-w-6xl px-4">
          <div className="text-center">
            <p className="text-primary/60 mb-3 text-xs font-bold tracking-[0.25em] uppercase">
              Kolaborasi
            </p>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              Partnership <span className="text-gradient">& Sponsor</span>
            </h2>
            <p className="text-muted-foreground/40 mt-2 text-xs">Dikelola melalui Admin Panel</p>
          </div>
        </div>
        {/* Client component: scrolling partnership */}
        <AboutScrollers type="partner" />
      </section>

      {/* ══════════════ FINAL CTA ══════════════ */}
      <section className="px-4 py-16 pb-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="glass-card px-8 py-12 sm:px-12">
            <div className="mb-4 flex justify-center gap-2 text-3xl">🌸🎌✨</div>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              Siap menemukan <span className="text-gradient">langitmu?</span>
            </h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Gratis selamanya. Komunitas anime & budaya Jepang Indonesia yang hangat & inklusif.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="group bg-primary shadow-primary/20 inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5"
              >
                Daftar Gratis{' '}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="https://discord.gg/qm3XJvRa6B"
                target="_blank"
                rel="noopener noreferrer"
                className="border-border text-muted-foreground hover:border-primary/40 hover:text-foreground inline-flex items-center gap-2 rounded-2xl border px-7 py-3.5 text-sm font-medium transition-colors"
              >
                <DiscordIcon className="h-4 w-4" />
                Discord <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
