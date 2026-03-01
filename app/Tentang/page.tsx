export const dynamic = 'force-dynamic'

import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Heart, Users, Globe, Sparkles, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Tentang Kami — Soraku' }
export const revalidate = 3600

const TIMELINE = [
  {
    year: '2023',
    month: 'Awal Tahun',
    title: 'Lahirnya Ide',
    desc: 'Soraku bermula dari diskusi kecil antara penggemar anime yang ingin punya ruang digital tersendiri.',
    accent: 'border-purple-500 text-purple-400',
  },
  {
    year: '2023',
    month: 'Pertengahan',
    title: 'Discord Pertama',
    desc: 'Server Discord Soraku resmi dibuka. Anggota pertama mulai berdatangan dari berbagai daerah.',
    accent: 'border-pink-500 text-pink-400',
  },
  {
    year: '2024',
    month: 'Awal Tahun',
    title: 'Platform Web',
    desc: 'Soraku.vercel.app diluncurkan — dengan Gallery, Blog, dan integrasi Spotify.',
    accent: 'border-blue-500 text-blue-400',
  },
  {
    year: '2024',
    month: 'Pertengahan',
    title: 'Komunitas Berkembang',
    desc: 'Ribuan anggota aktif. Events offline perdana digelar. VTuber dan kreator lokal bergabung.',
    accent: 'border-cyan-500 text-cyan-400',
  },
  {
    year: '2025',
    month: 'Sekarang',
    title: 'Soraku v1.0.a3',
    desc: 'Platform diperkuat dengan RBAC, Premium features, Redis, dan upgrade UI menyeluruh.',
    accent: 'border-yellow-500 text-yellow-400',
  },
]

const VALUES = [
  { icon: Heart, title: 'Passion', desc: 'Didorong kecintaan terhadap anime & manga.', color: 'text-pink-400 bg-pink-400/10 border-pink-400/20' },
  { icon: Users, title: 'Komunitas', desc: 'Ruang aman dan inklusif bagi semua.', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  { icon: Globe, title: 'Budaya', desc: 'Merayakan keindahan budaya digital Jepang.', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  { icon: Sparkles, title: 'Kreativitas', desc: 'Mendorong ekspresi kreatif seluruh komunitas.', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
]

export default async function TentangPage() {
  const supabase = await createClient()

  // Fetch founder settings
  const { data: settings } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['founder_name', 'founder_bio', 'founder_avatar', 'site_name', 'tagline'])

  const s = Object.fromEntries((settings ?? []).map(r => [r.key, r.value]))

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* ─── Hero Banner ──────────────────────────────────────────── */}
        <div className="relative rounded-3xl overflow-hidden mb-16">
          <Image
            src="https://images.unsplash.com/photo-1535016120720-40c646be5580?w=1200&q=80"
            alt="Tentang Soraku"
            width={1200}
            height={400}
            className="w-full h-72 object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-soraku-dark via-soraku-dark/85 to-transparent flex items-center px-12">
            <div>
              <h1 className="font-display text-5xl font-bold mb-4">
                Tentang <span className="grad-text">Soraku</span>
              </h1>
              <p className="text-soraku-sub text-lg max-w-lg">{s.tagline ?? 'Platform komunitas untuk penggemar Anime, Manga, dan Budaya Digital Jepang.'}</p>
            </div>
          </div>
        </div>

        {/* ─── Story ────────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold mb-6">Kisah Kami</h2>
            <div className="space-y-4 text-soraku-sub leading-relaxed text-sm">
              <p>
                Soraku lahir dari impian sederhana: menciptakan ruang digital di mana penggemar anime dan manga
                dapat berkumpul, berbagi, dan tumbuh bersama.
              </p>
              <p>
                Nama &ldquo;Soraku&rdquo; terinspirasi dari harmoni bahasa Jepang — mencerminkan nilai inti
                platform ini: kreativitas, komunitas, dan semangat berbagi.
              </p>
              <p>
                Kami percaya setiap penggemar memiliki cerita yang layak didengar dan setiap kreator berhak
                mendapat tempat untuk berkarya.
              </p>
            </div>
          </div>
          <div className="glass rounded-2xl p-8 border border-purple-500/20">
            <div className="grid grid-cols-2 gap-6">
              {[['2023', 'Tahun Berdiri'], ['10K+', 'Anggota'], ['5K+', 'Karya'], ['∞', 'Semangat']].map(([n, l]) => (
                <div key={l} className="text-center">
                  <div className="font-display text-3xl font-bold grad-text">{n}</div>
                  <div className="text-soraku-sub text-sm mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Founder Section ──────────────────────────────────────── */}
        {s.founder_name && (
          <div className="mb-16">
            <h2 className="font-display text-2xl font-bold mb-8 text-center">
              Founder & <span className="grad-text">Tim</span>
            </h2>
            <div className="glass rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-8 border border-yellow-500/20">
              {s.founder_avatar ? (
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden shrink-0">
                  <Image src={s.founder_avatar} alt={s.founder_name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                  <Star className="w-10 h-10 text-yellow-400" />
                </div>
              )}
              <div>
                <div className="inline-block text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full mb-2">
                  Founder
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">{s.founder_name}</h3>
                {s.founder_bio && (
                  <p className="text-soraku-sub text-sm leading-relaxed">{s.founder_bio}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── Timeline ─────────────────────────────────────────────── */}
        <div className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-10 text-center">
            Perjalanan <span className="grad-text">Soraku</span>
          </h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-soraku-border to-transparent" />

            <div className="space-y-8">
              {TIMELINE.map((item, i) => (
                <div key={i} className="flex gap-6 items-start">
                  {/* Dot */}
                  <div className={`relative z-10 w-4 h-4 rounded-full border-2 ${item.accent.split(' ')[0]} bg-soraku-dark mt-1 shrink-0 ml-6`} />
                  {/* Card */}
                  <div className="glass rounded-2xl p-5 flex-1 hover:border-purple-500/30 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-bold ${item.accent.split(' ')[1]}`}>{item.year}</span>
                      <span className="text-xs text-soraku-sub">{item.month}</span>
                    </div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-soraku-sub text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Values ───────────────────────────────────────────────── */}
        <div className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-8 text-center">Nilai Kami</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="glass rounded-2xl p-6 text-center hover:border-purple-500/40 transition-colors">
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mx-auto mb-4 border`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-soraku-sub text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── CTA ──────────────────────────────────────────────────── */}
        <div className="text-center">
          <Link
            href="/komunitas"
            className="inline-flex items-center gap-2 bg-soraku-gradient text-white px-8 py-3.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Bergabung dengan Komunitas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
