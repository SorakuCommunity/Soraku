import Image from 'next/image'
import { Heart, Users, Globe, Sparkles, Star, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Tentang Soraku' }

const TIMELINE = [
  { year: '2023', q: 'Q1', title: 'Soraku Lahir', desc: 'Sekelompok penggemar anime Indonesia mendirikan Soraku dengan impian sederhana: membuat ruang digital yang terasa seperti rumah bagi sesama penggemar.' },
  { year: '2023', q: 'Q2', title: 'Discord Diluncurkan', desc: 'Server Discord Soraku resmi dibuka. Dalam minggu pertama, lebih dari 100 anggota bergabung dan komunitas mulai hidup!' },
  { year: '2023', q: 'Q3', title: 'Event Pertama', desc: 'Soraku mengadakan turnamen kuis anime pertamanya. Antusias luar biasa — lebih dari 50 peserta ikut dan membuktikan semangat komunitas.' },
  { year: '2023', q: 'Q4', title: 'Galeri & Fanart', desc: 'Galeri online diluncurkan. Ratusan karya fanart mulai bermunculan, memperlihatkan betapa kreatifnya komunitas Soraku.' },
  { year: '2024', q: 'Q1', title: 'Platform Web Soraku', desc: 'Website Soraku resmi diluncurkan dengan fitur lengkap: blog, galeri, profil kreator, dan integrasi Discord.' },
  { year: '2024', q: 'Q2', title: '5.000+ Anggota', desc: 'Milestone besar! Komunitas mencapai 5.000 anggota aktif — sebuah bukti nyata bahwa Soraku bukan sekadar impian.' },
  { year: '2024', q: 'Q3', title: 'Komunitas Goes National', desc: 'Event offline pertama Soraku digelar, menyatukan anggota dari berbagai kota Indonesia untuk pertama kalinya.' },
  { year: '2024', q: 'Q4', title: '10.000+ Anggota', desc: 'Soraku terus tumbuh. Dengan lebih dari 10.000 anggota, kami makin yakin bahwa anime menyatukan kita semua.' },
]

const FOUNDERS = [
  {
    name: 'Kairo', role: 'Founder & CEO',
    img: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=300&q=80',
    bio: 'Pecinta anime sejati yang percaya bahwa passion bisa jadi platform. Mendirikan Soraku untuk menyatukan komunitas anime Indonesia.',
  },
  {
    name: 'Tim Soraku', role: 'Co-Founders',
    img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&q=80',
    bio: 'Sekelompok penggemar setia yang bergabung di awal perjalanan Soraku dan membantu membangun fondasi komunitas yang kuat.',
  },
]

export default function TentangPage() {
  return (
    <div className="min-h-screen pt-20 pb-20 overflow-hidden">

      {/* ── Hero Banner ── */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden mb-24">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1600&q=80"
            alt="About Soraku" fill className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-soraku-dark/40 via-soraku-dark/70 to-soraku-dark" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-soraku-gradient flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-2xl font-bold text-white">Soraku</span>
          </div>
          <h1 className="font-display text-6xl md:text-8xl font-bold mb-6 leading-none">
            Tentang<br /><span className="grad-text">Soraku</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl leading-relaxed">
            Dari sebuah impian kecil untuk menyatukan penggemar anime Indonesia,
            kini Soraku tumbuh menjadi ekosistem komunitas yang sesungguhnya.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">

        {/* ── Story ── */}
        <section className="mb-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-4">Kisah Kami</div>
              <h2 className="font-display text-4xl font-bold mb-6">
                Lebih dari Sekadar<br /><span className="grad-text">Komunitas</span>
              </h2>
              <div className="space-y-4 text-soraku-sub text-sm leading-relaxed">
                <p>
                  Soraku lahir dari kesederhanaan — sebuah obrolan di Discord antara beberapa penggemar anime yang frustrasi
                  karena tidak ada tempat yang benar-benar terasa seperti &ldquo;rumah&rdquo; bagi mereka.
                </p>
                <p>
                  Nama &ldquo;Soraku&rdquo; diambil dari harmoni kata Jepang yang mencerminkan semangat kami:
                  langit yang luas (空) dan kegembiraan (楽) — karena kami percaya ekspresi kreativitas
                  seharusnya seluas langit dan selalu membawa kebahagiaan.
                </p>
                <p>
                  Hari ini, Soraku bukan hanya platform — ini adalah keluarga. Setiap karya yang diupload,
                  setiap diskusi yang terjadi, setiap event yang digelar — semuanya dibangun oleh dan untuk komunitas.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['2023', 'Tahun berdiri', 'text-purple-400'],
                ['10K+', 'Anggota aktif', 'text-pink-400'],
                ['5K+', 'Karya di galeri', 'text-cyan-400'],
                ['100+', 'Event digelar', 'text-yellow-400'],
              ].map(([n, l, c]) => (
                <div key={l} className="glass rounded-2xl p-6 text-center border border-soraku-border hover:border-purple-500/30 transition-colors">
                  <div className={`font-display text-3xl font-bold ${c} mb-1`}>{n}</div>
                  <div className="text-soraku-sub text-xs">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Founders ── */}
        <section className="mb-24">
          <div className="text-xs font-semibold uppercase tracking-widest text-pink-400 mb-4">Tim Pendiri</div>
          <h2 className="font-display text-4xl font-bold mb-10">
            Orang di Balik <span className="grad-text">Soraku</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {FOUNDERS.map(f => (
              <div key={f.name} className="glass rounded-2xl overflow-hidden border border-soraku-border hover:border-purple-500/30 transition-colors group">
                <div className="relative h-48 overflow-hidden">
                  <Image src={f.img} alt={f.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-soraku-card to-soraku-card/20" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold mb-1">{f.name}</h3>
                  <div className="text-soraku-primary text-sm font-medium mb-3">{f.role}</div>
                  <p className="text-soraku-sub text-sm leading-relaxed">{f.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Timeline ── */}
        <section className="mb-24">
          <div className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-4">
            <Calendar className="inline w-4 h-4 mr-1" />Perjalanan Kami
          </div>
          <h2 className="font-display text-4xl font-bold mb-10">
            Timeline <span className="grad-text">Soraku</span>
          </h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-pink-500/30 to-transparent" />
            <div className="space-y-8">
              {TIMELINE.map((item, i) => (
                <div key={i} className={`relative flex items-start gap-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-soraku-primary border-2 border-soraku-dark shadow-lg shadow-purple-500/50" />
                  {/* Content */}
                  <div className={`pl-16 md:pl-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}>
                    <div className="glass rounded-2xl p-5 border border-soraku-border hover:border-purple-500/30 transition-colors">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs font-bold text-soraku-primary bg-purple-500/10 px-2 py-0.5 rounded-full">{item.year}</span>
                        <span className="text-xs text-soraku-sub">{item.q}</span>
                      </div>
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <p className="text-soraku-sub text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  {/* Spacer for other side */}
                  <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="mb-16">
          <h2 className="font-display text-4xl font-bold mb-10 text-center">
            Nilai-nilai <span className="grad-text">Kami</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { Icon: Heart,    color: 'text-pink-400',   bg: 'bg-pink-500/10 border-pink-500/20',   title: 'Passion',    desc: 'Didorong oleh kecintaan tulus terhadap anime & manga.' },
              { Icon: Users,    color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', title: 'Komunitas', desc: 'Ruang aman dan inklusif untuk semua penggemar.' },
              { Icon: Globe,    color: 'text-cyan-400',   bg: 'bg-cyan-500/10 border-cyan-500/20',   title: 'Budaya',     desc: 'Merayakan kekayaan budaya digital Jepang.' },
              { Icon: Sparkles, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', title: 'Kreativitas', desc: 'Mendorong setiap orang mengekspresikan diri.' },
            ].map(({ Icon, color, bg, title, desc }) => (
              <div key={title} className={`rounded-2xl p-6 border ${bg} text-center hover:scale-105 transition-transform`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${bg}`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-soraku-sub text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="glass rounded-3xl p-12 text-center border border-purple-500/20">
          <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold mb-3">
            Jadilah Bagian dari <span className="grad-text">Soraku</span>
          </h2>
          <p className="text-soraku-sub mb-6 max-w-md mx-auto text-sm">
            Kisah Soraku belum selesai — kamu adalah bab selanjutnya.
          </p>
          <Link href="/login"
            className="inline-flex items-center gap-2 bg-soraku-gradient text-white px-8 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity">
            Mulai Sekarang <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
