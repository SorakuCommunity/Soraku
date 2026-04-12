'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  Calendar,
  BookOpen,
  Image as ImageIcon,
  Tv2,
  Users,
  Heart,
  Sparkles,
  ArrowRight,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import SectionBadge from '@/components/ui/section-badge'
import Wrapper from '@/components/ui/wrapper'
import AnimationContainer from '@/components/ui/animation-container'

const FEATURES = [
  {
    icon: Calendar,
    title: 'Events & Tournament',
    description: 'Ikuti event seru, turnamen gaming, nonton bareng, dan aktivitas komunitas.',
    color: '#4FA3D1',
  },
  {
    icon: BookOpen,
    title: 'Blog & Artikel',
    description: 'Baca dan tulis artikel tentang anime, manga, gaming, dan budaya Jepang.',
    color: '#a78bfa',
  },
  {
    icon: ImageIcon,
    title: 'Galeri Karya',
    description: 'Bagikan fanart, cosplay, dan kreasi kamu. Dapatkan apresiasi dari komunitas.',
    color: '#f472b6',
  },
  {
    icon: Tv2,
    title: 'VTuber Komunitas',
    description: 'Dukung VTuber lokal Indonesia. Streaming, fanbase, dan konten kreator virtual.',
    color: '#34d399',
  },
  {
    icon: Users,
    title: 'Komunitas Aktif',
    description:
      'Gabung dengan ribuan member aktif di Discord. Chat 24/7, temukan teman sefrekuensi.',
    color: '#E8C2A8',
  },
  {
    icon: Heart,
    title: 'Dukung Komunitas',
    description: 'Donasi untuk mendukung operasional dan pengembangan platform.',
    color: '#fbbf24',
  },
]

const PLATFORM_LINKS = [
  { label: 'Events', href: '/events', icon: Calendar },
  { label: 'Blog', href: '/blog', icon: BookOpen },
  { label: 'Galeri', href: '/gallery', icon: ImageIcon },
  { label: 'VTuber', href: '/vtubers', icon: Tv2 },
  { label: 'Premium', href: '/premium', icon: Sparkles },
  { label: 'Donasi', href: '/donate', icon: Heart },
]

export default function Hero() {
  return (
    <Wrapper className="relative flex min-h-[90vh] items-center py-20">
      <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Left Content */}
        <div className="flex flex-col items-start gap-6">
          <AnimationContainer animation="fadeUp" delay={0.1}>
            <SectionBadge title="Komunitas Anime & Japanese Culture Indonesia" />
          </AnimationContainer>

          <AnimationContainer animation="fadeUp" delay={0.2}>
            <h1 className="text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">
              <span className="from-foreground to-primary bg-gradient-to-r bg-clip-text text-transparent">
                Soraku
              </span>
              <br />
              <span className="text-foreground">Community</span>
            </h1>
          </AnimationContainer>

          <AnimationContainer animation="fadeUp" delay={0.3}>
            <p className="text-muted-foreground max-w-lg text-lg">
              Ruang digital tanpa batas tempat komunitas, kreator, dan identitas bertemu.
              Terinspirasi dari budaya Jepang: kebebasan, pertumbuhan, dan koneksi.
            </p>
          </AnimationContainer>

          <AnimationContainer animation="fadeUp" delay={0.4}>
            <div className="flex flex-wrap gap-4">
              <Link href="/register">
                <Button size="lg" className="rounded-xl">
                  Gabung Sekarang
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="rounded-xl">
                  About Us
                </Button>
              </Link>
            </div>
          </AnimationContainer>

          <AnimationContainer animation="fadeUp" delay={0.5}>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="border-background bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full border-2"
                  >
                    <span className="text-primary text-xs font-bold">空</span>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground text-sm">
                <span className="text-foreground font-semibold">5,000+</span> member aktif
              </p>
            </div>
          </AnimationContainer>
        </div>

        {/* Right Content - Cards Grid */}
        <AnimationContainer animation="fadeRight" delay={0.3} className="hidden lg:block">
          <div className="grid grid-cols-2 gap-4">
            {PLATFORM_LINKS.map((link, index) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="group bg-card/50 hover:bg-card hover:border-primary/30 relative rounded-2xl border border-white/10 p-6 transition-all hover:-translate-y-1"
                >
                  <div className="flex flex-col items-start gap-3">
                    <div className="bg-primary/10 rounded-xl p-2">
                      <Icon className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-foreground group-hover:text-primary font-semibold transition-colors">
                        {link.label}
                      </h3>
                      <p className="text-muted-foreground mt-1 text-xs">Jelajahi →</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </AnimationContainer>
      </div>

      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-primary/20 absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-[120px]" />
        <div className="bg-accent/10 absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full blur-[100px]" />
      </div>
    </Wrapper>
  )
}

export { FEATURES }
