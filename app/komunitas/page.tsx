// app/komunitas/page.tsx — SORAKU v1.0.a3.5
// Komunitas: Discord Hero Card + 6 Feature Glass Cards
'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Radio, Calendar, Mic2, Star, Shield } from 'lucide-react'
import { DiscordHeroCard } from '@/components/community/DiscordHeroCard'

const features = [
  {
    icon: MessageCircle,
    title: 'Diskusi Anime',
    desc: 'Bahas episode terbaru, rekomendasi, dan teori seru bersama ribuan anggota komunitas.',
    color: '#4FA3D1',
  },
  {
    icon: Radio,
    title: 'Discord Aktif',
    desc: 'Server Discord aktif 24/7 dengan berbagai channel topik spesifik untuk setiap genre.',
    color: '#5865F2',
  },
  {
    icon: Mic2,
    title: 'Voice Channel',
    desc: 'Nonton bareng, ngobrol santai, dan karaoke online bersama member kapan saja.',
    color: '#7C9E87',
  },
  {
    icon: Calendar,
    title: 'Event Reguler',
    desc: 'Event online dan offline berkala — cosplay contest, anime quiz, dan banyak lagi.',
    color: '#E8C2A8',
  },
  {
    icon: Star,
    title: 'VTuber Soraku',
    desc: 'Dukung VTuber asli Indonesia dari dalam komunitas Soraku yang terus berkembang.',
    color: '#C9A84C',
  },
  {
    icon: Shield,
    title: 'Komunitas Aman',
    desc: 'Dimoderasi aktif untuk menjaga lingkungan yang ramah, inklusif, dan bebas drama.',
    color: '#9B7FD4',
  },
]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

export default function KomunitasPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14 space-y-12">

        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--text)' }}>
            Komunitas Soraku
          </h1>
          <p className="max-w-lg mx-auto text-sm leading-relaxed" style={{ color: 'var(--text-sub)' }}>
            Bergabunglah bersama ribuan penggemar Anime, Manga, dan Budaya Digital Jepang di Indonesia.
          </p>
        </motion.div>

        {/* Discord Hero Card */}
        <section>
          <DiscordHeroCard />
        </section>

        {/* 6 Feature Glass Cards — 3 × 2 */}
        <section>
          <motion.h2
            className="text-xl font-bold mb-6"
            style={{ color: 'var(--text)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Kenapa Bergabung?
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {features.map((f) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={f.title}
                  variants={cardVariants}
                  className="group relative rounded-2xl border p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-default"
                  style={{
                    background:     'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(20px)',
                    borderColor:    'rgba(255,255,255,0.08)',
                    boxShadow:      '0 4px 20px rgba(0,0,0,0.15)',
                  }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle, ${f.color}22, transparent 70%)`,
                      transform: 'translate(30%, -30%)',
                    }}
                  />
                  {/* Icon */}
                  <div
                    className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${f.color}18`, color: f.color }}
                  >
                    <Icon size={22} />
                  </div>
                  {/* Text */}
                  <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text)' }}>
                    {f.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                    {f.desc}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </section>

        {/* Final CTA */}
        <motion.div
          className="rounded-2xl border p-8 text-center"
          style={{
            background:     'linear-gradient(135deg, rgba(88,101,242,0.1), rgba(79,163,209,0.08))',
            backdropFilter: 'blur(20px)',
            borderColor:    'rgba(88,101,242,0.25)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="text-4xl mb-3">💬</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>
            Siap Bergabung?
          </h2>
          <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--text-sub)' }}>
            Komunitas Discord Soraku terbuka untuk semua penggemar Anime & Manga Indonesia.
          </p>
          <a
            href="https://discord.gg/CJJ7KEJMbg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 hover:scale-105 min-h-[44px]"
            style={{ backgroundColor: '#5865F2', color: '#fff' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.175 13.175 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028z"/>
            </svg>
            Bergabung ke Discord
          </a>
        </motion.div>

      </div>
    </div>
  )
}
