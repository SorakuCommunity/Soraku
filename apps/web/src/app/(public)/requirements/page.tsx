import Link from 'next/link'
import {
  ArrowRight,
  ExternalLink,
  Users,
  Briefcase,
  Star,
  Gift,
  TrendingUp,
  Zap,
} from 'lucide-react'

export const metadata = {
  title: 'Become a Contributor | Soraku Community',
  description:
    'Join Soraku as a Contributor - Earn extra income while contributing to the anime & pop culture community.',
}

const POSITIONS = [
  {
    id: '01',
    role: 'Writer / Editorial Team',
    color: 'from-blue-500/15 to-primary/10 border-blue-500/20',
    icon: '✍️',
    desc: 'Bertanggung jawab pada produksi konten utama di website Soraku.',
    tasks: [
      'Menulis artikel berita, informasi, dan opini seputar anime dan pop culture Jepang',
      'Melakukan riset informasi dari sumber terpercaya',
      'Menyusun artikel dengan struktur yang jelas dan informatif',
      'Mengoptimasi artikel dengan dasar SEO',
      'Menjaga konsistensi kualitas dan publikasi konten',
    ],
  },
  {
    id: '02',
    role: 'Social Media Team',
    color: 'from-pink-500/15 to-rose-500/10 border-pink-500/20',
    icon: '📱',
    desc: 'Mengelola distribusi konten Soraku di berbagai platform sosial media.',
    tasks: [
      'Mengadaptasi artikel menjadi konten sosial media',
      'Menulis caption yang menarik dan mudah dibagikan',
      'Menjadwalkan posting secara konsisten',
      'Membantu meningkatkan engagement komunitas',
      'Mengamati performa konten dan interaksi audience',
    ],
  },
  {
    id: '03',
    role: 'Community Manager (Discord)',
    color: 'from-indigo-500/15 to-violet-500/10 border-indigo-500/20',
    icon: '💬',
    desc: 'Mengembangkan dan menjaga aktivitas komunitas Soraku di server Discord.',
    tasks: [],
    subs: [
      {
        role: 'Discord Moderator',
        tasks: [
          'Melakukan moderasi server Discord',
          'Menjaga percakapan tetap sesuai aturan',
          'Menangani laporan atau pelanggaran dari member',
          'Membantu menjaga suasana komunitas tetap aman',
        ],
      },
      {
        role: 'Event & Community Activity Staff',
        tasks: [
          'Membuat event komunitas seperti watch party atau game night',
          'Mengaktifkan channel diskusi komunitas',
          'Mendorong partisipasi member dalam aktivitas server',
        ],
      },
      {
        role: 'Community Support',
        tasks: [
          'Membantu member baru memahami server Discord',
          'Menjawab pertanyaan dasar komunitas',
          'Mengarahkan member ke channel yang sesuai',
        ],
      },
    ],
  },
]

const REQUIREMENTS = [
  'Memiliki minat pada anime, manga, dan pop culture Jepang',
  'Aktif menggunakan internet dan sosial media',
  'Komunikatif dan mampu bekerja dalam tim',
  'Bertanggung jawab terhadap tugas yang diberikan',
  'Konsisten dan memiliki komitmen jangka panjang',
  'Bersedia berkoordinasi melalui Discord',
]

const BENEFITS = [
  {
    icon: '💰',
    title: 'Cuan Tambahan',
    desc: 'Dapatkan income tambahan dari setiap konten yang kamu hasilkan',
  },
  {
    icon: '📈',
    title: 'Portofolio Publik',
    desc: 'Hasilkan portofolio nyata dalam penulisan & pengelolaan komunitas',
  },
  {
    icon: '🤝',
    title: 'Networking',
    desc: 'Connect dengan sesama penggemar pop culture Jepang',
  },
  {
    icon: '🚀',
    title: 'Pengembangan Karir',
    desc: 'Kesempatan berkembang jadi core team Soraku',
  },
  {
    icon: '🎮',
    title: 'Akses Eksklusif',
    desc: 'Nikmati benefit khusus untuk contributor aktif',
  },
  {
    icon: '🌟',
    title: 'Komunitas Aktif',
    didesc: 'Join komunitas kreatif yang selalu bergerak',
  },
]

export default function RequirementsPage() {
  return (
    <main className="min-h-screen px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        {/* Hero Header */}
        <div className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-br from-violet-900/40 via-indigo-900/30 to-purple-900/40 p-8 sm:p-12">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="bg-primary/20 absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-rose-500/20 blur-3xl" />

          <div className="relative text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.18em] text-amber-400 uppercase">
              <Zap className="h-3.5 w-3.5" />
              Buka Setiap Bulan
            </div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Jadi{' '}
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                Contributor
              </span>
              <br />
              Soraku
            </h1>
            <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-base leading-relaxed">
              Bergabung dengan Soraku dan{' '}
              <span className="font-semibold text-amber-400">hasilkan cuan tambahan</span> sambil
              membangun komunitas anime & pop culture Jepang terbesar di Indonesia.
            </p>

            {/* Stats */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
              <div className="text-center">
                <p className="text-3xl font-black text-white">50+</p>
                <p className="text-muted-foreground text-xs">Kontributor Aktif</p>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div className="text-center">
                <p className="text-3xl font-black text-white">1000+</p>
                <p className="text-muted-foreground text-xs">Konten Dibuat</p>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div className="text-center">
                <p className="text-3xl font-black text-white">50K+</p>
                <p className="text-muted-foreground text-xs">Pengikut</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://forms.gle/NXwq7v6zpphKLfdKA"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                Daftar Sekarang{' '}
                <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="https://discord.gg/qm3XJvRa6B"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
              >
                Tanya di Discord <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Why Join Soraku */}
        <section className="mb-8">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-black">
            <Gift className="h-5 w-5 text-amber-400" /> Mengapa Jadi Contributor?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((benefit, i) => (
              <div
                key={i}
                className="group glass-card relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-white/0 p-5 transition-all hover:border-amber-500/30"
              >
                <div className="absolute -top-4 -right-4 text-5xl opacity-10 transition-transform group-hover:scale-110 group-hover:rotate-12">
                  {benefit.icon}
                </div>
                <div className="relative">
                  <h3 className="text-base font-bold text-white">{benefit.title}</h3>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Income Info */}
        <section className="glass-card mb-8 overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-orange-500/5 p-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-3xl">
              💵
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-black text-white">Sistem Pendapatan Contributor</h3>
              <p className="text-muted-foreground text-sm">
                Setiap konten yang kamu hasilkan berpotensi menghasilkan income. Semakin banyak
                berkualitas, semakin besar kesempatan earningmu!
              </p>
            </div>
          </div>
        </section>

        {/* Positions */}
        <section className="mb-8 space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-black">
            <Briefcase className="text-primary h-5 w-5" /> Posisi yang Tersedia
          </h2>
          {POSITIONS.map((pos) => (
            <div
              key={pos.id}
              className={`glass-card rounded-2xl border bg-gradient-to-br p-6 ${pos.color}`}
            >
              <div className="flex items-start gap-4">
                <div className="bg-background/60 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-2xl">
                  {pos.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground/50 text-[10px] font-bold tracking-widest">
                      POSISI {pos.id}
                    </span>
                  </div>
                  <h3 className="mt-0.5 text-base font-black">{pos.role}</h3>
                  <p className="text-muted-foreground/80 mt-1 text-sm">{pos.desc}</p>

                  {pos.tasks.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {pos.tasks.map((t, i) => (
                        <li
                          key={i}
                          className="text-muted-foreground flex items-start gap-2 text-xs"
                        >
                          <span className="bg-primary/50 mt-1 h-1 w-1 flex-shrink-0 rounded-full" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}

                  {pos.subs?.map((sub) => (
                    <div
                      key={sub.role}
                      className="border-border/40 bg-background/30 mt-4 rounded-xl border p-4"
                    >
                      <p className="text-foreground/80 text-xs font-bold">{sub.role}</p>
                      <ul className="mt-2 space-y-1">
                        {sub.tasks.map((t, i) => (
                          <li
                            key={i}
                            className="text-muted-foreground flex items-start gap-2 text-xs"
                          >
                            <span className="bg-primary/50 mt-1 h-1 w-1 flex-shrink-0 rounded-full" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Requirements */}
        <section className="glass-card mb-8 rounded-2xl p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-black">
            <Star className="text-primary h-5 w-5" /> Persyaratan Umum
          </h2>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {REQUIREMENTS.map((r, i) => (
              <li key={i} className="text-muted-foreground flex items-start gap-2 text-sm">
                <span className="bg-primary/60 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                {r}
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <div className="glass-card relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-900/20 to-indigo-900/10 p-8 text-center">
          <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative">
            <p className="text-2xl font-black text-white">Siap Mulai Earn Sekarang?</p>
            <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
              Daftar sekarang dan mulai menghasilkan dari passionmu!
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://forms.gle/NXwq7v6zpphKLfdKA"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary flex items-center gap-2 rounded-2xl px-8 py-3 text-sm font-bold text-white transition-all hover:-translate-y-1"
              >
                Daftar via Google Form <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="https://discord.gg/qm3XJvRa6B"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/10"
              >
                Tanya di Discord
              </a>
            </div>
            <p className="text-muted-foreground/50 mt-4 text-xs">
              Punya pertanyaan? Silakan langsung tanyakan di server Discord Soraku
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
