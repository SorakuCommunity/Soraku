export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { DiscordIcon } from '@/components/icons/custom-icons'
import { AboutScrollers, type SocialData } from './scrollers-client'

const SOCIAL_DATA: SocialData[] = [
  { slug:'discord',   name:'Discord',   href:'https://discord.gg/qm3XJvRa6B'              },
  { slug:'instagram', name:'Instagram', href:'https://www.instagram.com/soraku.moe'         },
  { slug:'tiktok',    name:'TikTok',    href:'https://www.tiktok.com/@soraku.id'            },
  { slug:'youtube',   name:'YouTube',   href:'https://youtube.com/@chsoraku'               },
  { slug:'facebook',  name:'Facebook',  href:'https://www.facebook.com/share/1HQs9ZZeCw/'  },
]

const CATEGORIES = [
  '🎌 Anime','📚 Manga','🎵 J-Music','🎭 VTuber','🎨 Fanart',
  '👘 Cosplay','🎮 Gaming','🍜 J-Food','📖 Light Novel',
  '🌸 Budaya Jepang','🎤 Cosplay Contest','🏆 Turnamen','📺 Nonton Bareng',
]

const PILLARS = [
  {
    icon:'🛡️', title:'Manager', role:'MANAGER',
    desc:'Tulang punggung operasional Soraku — moderasi konten, pengelolaan event & blog, supervisi kreator.',
    color:'#a78bfa',
  },
  {
    icon:'🎭', title:'Agensi', role:'AGENSI',
    desc:'Pilar kreativitas — mengelola VTuber & talent lokal Indonesia dari manajemen profil hingga kolaborasi.',
    color:'#4FA3D1',
  },
  {
    icon:'⚙️', title:'Admin', role:'ADMIN',
    desc:'Penjaga ekosistem — moderasi member, kurasi galeri karya, dan memastikan setiap kontribusi diakui.',
    color:'#E8C2A8',
  },
]

const TIMELINE = [
  { year:'2023', label:'Awal',  title:'Lahirnya Sora',             desc:'Dimulai sebagai server Discord kecil — hanya passion, tanpa struktur.',       icon:'🌱', hi:true  },
  { year:'2023', label:'Mid',   title:'Berkembang jadi Soraku',    desc:'"Sora" + "-ku" = Langitku. Ruang ini milik semua anggotanya.',                  icon:'✨', hi:false },
  { year:'2023', label:'Akhir', title:'Event Pertama',             desc:'Nonton bareng online pertama — fondasi tradisi gathering komunitas.',           icon:'🎌', hi:false },
  { year:'2024', label:'Q1',    title:'Platform Web Lahir',        desc:'Tim inti terbentuk. Blog, galeri, event, sistem member pertama hadir.',         icon:'🚀', hi:false },
  { year:'2024', label:'Q2',    title:'Soraku Agensi Berdiri',     desc:'VTuber & talent lokal Indonesia punya ruang untuk berkembang.',                 icon:'🎭', hi:false },
  { year:'2025', label:'Q1',    title:'500+ Member Discord',       desc:'Milestone bersejarah — sistem premium & bot Discord terintegrasi.',             icon:'🏆', hi:false },
  { year:'2026', label:'Now',   title:'v1.0 — Platform Penuh',     desc:'Dibangun ulang dengan Next.js 16, Supabase, dan fitur komunitas yang matang.',  icon:'🌸', hi:true  },
]

export const metadata: Metadata = {
  title: 'Tentang — Soraku Community',
  description: 'Kenali visi, pilar, dan perjalanan Soraku Community sejak 2023.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#1C1E22] text-foreground overflow-x-hidden">

      {/* ══════════════════════════════════════════════
          HERO — Mascot seamless desktop, teks left
          ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">

        {/* Mobile hero — text only */}
        <div className="lg:hidden px-6 pt-28 pb-16 relative">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[400px] rounded-full bg-primary/8 blur-[120px]"/>
          </div>
          <div className="relative z-10">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/50 mb-3">Tentang</p>
            <h1 className="text-[clamp(3rem,13vw,5rem)] font-black leading-[0.88] tracking-tighter mb-4">
              Langitku,<br/>
              <span className="bg-clip-text text-transparent"
                style={{backgroundImage:"linear-gradient(130deg,#4FA3D1 0%,#90c8e8 40%,#E8C2A8 75%,#d4a882 100%)",WebkitBackgroundClip:"text"}}>
                Soraku
              </span>
            </h1>
            <div className="h-[1.5px] w-10 mb-4 rounded-full" style={{background:"linear-gradient(90deg,#4FA3D1,#E8C2A8)",opacity:0.5}}/>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Komunitas non-profit terbuka untuk semua pecinta anime & budaya Jepang di Indonesia.
              Ruang untuk tumbuh bersama — sejak 2023.
            </p>
          </div>
        </div>

        {/* Desktop hero — mascot kanan, teks kiri */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_540px] min-h-[80vh] items-center">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-0 h-[400px] w-[400px] rounded-full bg-primary/8 blur-[130px]"/>
          </div>
          {/* Left text */}
          <div className="relative z-10 px-12 xl:px-20 py-20">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/50 mb-4">Tentang Soraku</p>
            <h1 className="text-[clamp(3.5rem,6vw,6rem)] font-black leading-[0.88] tracking-tighter mb-5">
              Langitku,<br/>
              <span className="bg-clip-text text-transparent"
                style={{backgroundImage:"linear-gradient(130deg,#4FA3D1 0%,#90c8e8 40%,#E8C2A8 75%,#d4a882 100%)",WebkitBackgroundClip:"text"}}>
                Soraku
              </span>
            </h1>
            <div className="h-[2px] w-12 mb-5 rounded-full" style={{background:"linear-gradient(90deg,#4FA3D1,#E8C2A8)",opacity:0.45}}/>
            <p className="max-w-md text-base xl:text-lg text-white/35 leading-relaxed mb-8">
              Komunitas non-profit terbuka untuk semua pecinta anime & budaya Jepang di Indonesia.
              Ruang untuk tumbuh, berkreasi, dan menemukan teman sefrekuensi — sejak 2023.
            </p>
            <div className="flex items-center gap-3">
              <Link href="/register"
                className="inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-bold text-white"
                style={{background:"linear-gradient(135deg,#4FA3D1 0%,#3a8fbe 100%)"}}>
                Bergabung <ArrowRight className="h-4 w-4"/>
              </Link>
              <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-7 py-3.5 text-sm font-bold text-white/50 hover:bg-white/[0.07] transition-colors">
                <DiscordIcon className="h-4 w-4 text-indigo-400"/> Discord
              </a>
            </div>
          </div>
          {/* Right mascot */}
          <div className="relative h-full min-h-[80vh]">
            <div className="absolute right-0 top-0 h-full w-full">
              <div className="absolute inset-0 -z-0">
                <div className="absolute right-0 top-1/4 h-[450px] w-[450px] rounded-full bg-primary/6 blur-[100px]"/>
              </div>
              <Image src="/logo-full.png" alt="Soraku" fill className="object-cover object-center" priority/>
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#1C1E22] to-transparent z-10"/>
              <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#1C1E22] via-[#1C1E22]/60 to-transparent z-10"/>
              <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#1C1E22] to-transparent z-10"/>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          NAMA & FILOSOFI — Typography statement
          ══════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* The name */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/45 mb-4">Makna Nama</p>
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-[clamp(3.5rem,8vw,6rem)] font-black leading-none tracking-tighter"
                  style={{backgroundImage:"linear-gradient(130deg,#4FA3D1,#E8C2A8)",WebkitBackgroundClip:"text",backgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                  空
                </span>
                <div>
                  <p className="text-2xl font-black text-white/90">Sora</p>
                  <p className="text-sm text-white/35">langit · kebebasan · tak terbatas</p>
                </div>
              </div>
              <p className="text-sm text-white/40 leading-relaxed">
                <strong className="text-white/70">Sora</strong> (空) artinya langit dalam bahasa Jepang —
                simbol kebebasan, keluasan, dan kemungkinan tanpa batas.{" "}
                <strong className="text-white/70">-ku</strong> dalam bahasa Indonesia berarti
                <em className="not-italic font-semibold text-white/60"> milikku</em>.
              </p>
            </div>
            <div className="border-l border-white/[0.06] pl-10 lg:pl-12">
              <p className="text-2xl sm:text-3xl font-black text-white/90 leading-snug mb-5">
                "Langit yang tidak membatasi, tapi justru{" "}
                <span className="text-primary">mengangkat</span>."
              </p>
              <p className="text-sm text-white/35 leading-relaxed">
                Soraku adalah ruang untuk bermimpi, belajar, berkarya, dan berkembang —
                milik semua anggotanya, bukan satu orang. Sebuah ekosistem tempat ide berkembang
                dan individu bisa naik setinggi yang mereka mampu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CATEGORY SCROLLERS ══ */}
      <AboutScrollers categories={CATEGORIES} socials={SOCIAL_DATA}/>

      {/* ══════════════════════════════════════════════
          TIMELINE — perjalanan Soraku
          ══════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/45 mb-2">Perjalanan</p>
          <h2 className="text-2xl font-black sm:text-3xl text-white/90 mb-12">Dari Sora ke Soraku</h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-primary/15 to-transparent"/>

            <div className="space-y-0">
              {TIMELINE.map((item,i)=>(
                <div key={i} className="relative pl-16 pb-10 last:pb-0">
                  {/* Dot */}
                  <div className={`absolute left-[18px] top-1 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border text-sm
                    ${item.hi ? 'border-primary/40 bg-primary/15' : 'border-white/10 bg-white/[0.03]'}`}>
                    {item.icon}
                  </div>
                  {/* Content */}
                  <div className="flex items-baseline gap-3 mb-1.5">
                    <span className={`text-xs font-black ${item.hi?'text-primary':'text-white/30'}`}>{item.year}</span>
                    <span className="text-[10px] text-white/20 uppercase tracking-wide">{item.label}</span>
                  </div>
                  <h3 className="text-base font-black text-white/85 mb-1">{item.title}</h3>
                  <p className="text-sm text-white/38 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PILAR KOMUNITAS — 3 roles
          ══════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 border-t border-white/[0.05]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/45 mb-2">Struktur</p>
            <h2 className="text-2xl font-black sm:text-3xl text-white/90">Pilar Komunitas</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {PILLARS.map((p,i)=>(
              <div key={i} className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-7 group hover:border-white/[0.1] transition-colors">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{background:`radial-gradient(circle at 50% 0%,${p.color}12,transparent 65%)`}}/>
                <div className="text-2xl mb-4">{p.icon}</div>
                <p className="text-xs font-black uppercase tracking-wider mb-1" style={{color:p.color}}>{p.role}</p>
                <h3 className="text-lg font-black text-white/90 mb-3">{p.title}</h3>
                <p className="text-sm text-white/35 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          VISI — full-width statement
          ══════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-primary/5 blur-3xl"/>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10 max-w-3xl">
          <p className="block mb-4 text-2xl sm:text-3xl text-[#E8C2A8]/50"
            style={{fontFamily:"var(--font-script,'Style Script',cursive)"}}>
            Belajar dan Berkembang
          </p>
          <h2 className="text-[clamp(2.5rem,7vw,5.5rem)] font-black leading-[0.92] tracking-tighter text-white mb-6">
            Dari penggemar,<br/>
            untuk{" "}
            <span className="bg-clip-text text-transparent"
              style={{backgroundImage:"linear-gradient(130deg,#4FA3D1 0%,#90c8e8 40%,#E8C2A8 75%,#d4a882 100%)",WebkitBackgroundClip:"text"}}>
              penggemar
            </span>
          </h2>
          <p className="text-base sm:text-lg text-white/30 leading-relaxed max-w-xl mx-auto mb-10">
            Soraku bukan sekadar komunitas — ini adalah ruang di mana imajinasi menemukan bentuknya,
            kreativitas dihargai, dan setiap anggota punya tempat untuk tumbuh.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register"
              className="inline-flex items-center gap-2 rounded-2xl px-8 py-3.5 text-sm font-bold text-white"
              style={{background:"linear-gradient(135deg,#4FA3D1 0%,#3a8fbe 100%)"}}>
              Bergabung Sekarang <ArrowRight className="h-4 w-4"/>
            </Link>
            <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.08] px-8 py-3.5 text-sm font-bold text-white/45 hover:border-white/[0.15] hover:text-white/65 transition-colors">
              <DiscordIcon className="h-4 w-4 text-indigo-400"/> Gabung Discord <ExternalLink className="h-3.5 w-3.5"/>
            </a>
          </div>
        </div>
      </section>

    </main>
  )
}
