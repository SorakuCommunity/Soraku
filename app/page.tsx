import Image from 'next/image'
import Link from 'next/link'
import { fetchDiscordStats } from '@/lib/discord'
import { ArrowRight, Users, Wifi, Image as Img, BookOpen, Calendar, Star, Zap } from 'lucide-react'

export default async function HomePage() {
  const discord = await fetchDiscordStats()

  const cards = [
    { title: 'Komunitas', desc: 'Diskusi seru dengan ribuan penggemar anime & manga.', href: '/komunitas', img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&q=80', icon: Users },
    { title: 'Anime & VTuber', desc: 'Koleksi anime pilihan dan profil kreator favorit.', href: '/Vtuber', img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80', icon: Star },
    { title: 'Gallery', desc: 'Fanart dan karya kreatif dari komunitas.', href: '/gallery', img: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&q=80', icon: Img },
    { title: 'Blog', desc: 'Artikel, review, dan ulasan terbaru.', href: '/Blog', img: 'https://images.unsplash.com/photo-1514986888952-8cd320577b68?w=600&q=80', icon: BookOpen },
    { title: 'Events', desc: 'Ikuti event dan kompetisi komunitas.', href: '/komunitas', img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80', icon: Calendar },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920&q=80"
            alt="Hero" fill className="object-cover blur-sm scale-105" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-soraku-dark/80 via-soraku-dark/75 to-soraku-dark" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          {/* Discord stats badge */}
          <div className="inline-flex items-center gap-3 glass px-5 py-2 rounded-full mb-8 border border-purple-500/30">
            {discord.memberCount > 0 ? (
              <>
                <span className="flex items-center gap-1.5 text-sm">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold text-white">{discord.memberCount.toLocaleString()}</span>
                  <span className="text-soraku-sub">anggota</span>
                </span>
                <div className="w-px h-4 bg-soraku-border" />
                <span className="flex items-center gap-1.5 text-sm">
                  <Wifi className="w-4 h-4 text-green-400" />
                  <span className="font-semibold text-green-400">{discord.onlineCount.toLocaleString()}</span>
                  <span className="text-soraku-sub">online</span>
                </span>
              </>
            ) : (
              <span className="text-sm text-soraku-sub flex items-center gap-2">
                <Star className="w-4 h-4 text-purple-400" /> Komunitas Anime & Manga
              </span>
            )}
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Selamat Datang di{' '}
            <span className="grad-text">Soraku</span>
          </h1>
          <p className="text-xl text-soraku-sub mb-10 max-w-2xl mx-auto leading-relaxed">
            Ekosistem komunitas untuk penggemar Anime, Manga, dan Budaya Digital Jepang. Bergabunglah dan ekspresikan kreativitasmu.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/komunitas"
              className="inline-flex items-center gap-2 bg-soraku-gradient text-white px-8 py-3.5 rounded-full font-semibold hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-purple-500/25">
              Bergabung Sekarang <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/gallery"
              className="inline-flex items-center gap-2 glass border border-soraku-border text-soraku-text px-8 py-3.5 rounded-full font-semibold hover:border-purple-500 transition-all">
              Lihat Gallery
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-9 rounded-full border-2 border-soraku-sub/40 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-soraku-sub/40 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">
              Jelajahi <span className="grad-text">Soraku</span>
            </h2>
            <p className="text-soraku-sub max-w-xl mx-auto">Semua yang kamu butuhkan untuk menikmati budaya anime & manga.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map(({ title, desc, href, img, icon: Icon }) => (
              <Link key={href + title} href={href}
                className="glass rounded-2xl overflow-hidden group hover:scale-[1.02] hover:border-purple-500/50 transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <Image src={img} alt={title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-soraku-card via-soraku-card/50 to-transparent" />
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-soraku-gradient flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold mb-2 group-hover:text-soraku-primary transition-colors">{title}</h3>
                  <p className="text-soraku-sub text-sm">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0">
              <Image src="https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=1200&q=80"
                alt="CTA" fill className="object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-r from-soraku-dark via-soraku-dark/90 to-purple-900/50" />
            </div>
            <div className="relative z-10 p-12 md:p-16">
              <Zap className="w-10 h-10 text-yellow-400 mb-5" />
              <h2 className="font-display text-4xl font-bold mb-4">Siap Bergabung?</h2>
              <p className="text-soraku-sub mb-8 max-w-md">Login dengan Discord dan mulai perjalananmu di Soraku hari ini!</p>
              <Link href="/komunitas"
                className="inline-flex items-center gap-2 bg-soraku-gradient text-white px-8 py-3.5 rounded-full font-semibold hover:opacity-90 transition-all">
                Mulai Sekarang <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
