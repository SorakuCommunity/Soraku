import Link from 'next/link'
import {
  ArrowRight,
  ExternalLink,
  Users,
  Briefcase,
  Star,
  Gift,
  Zap,
  Rocket,
  Crown,
  Sparkles,
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
    color: 'glass-card-violet',
    icon: '✍️',
    accent: 'from-violet-500 to-purple-500',
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
    color: 'glass-card-rose',
    icon: '📱',
    accent: 'from-pink-500 to-rose-500',
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
    role: 'Community Manager',
    color: 'glass-card-emerald',
    icon: '💬',
    accent: 'from-emerald-500 to-teal-500',
    desc: 'Mengembangkan dan menjaga aktivitas komunitas Soraku di server Discord.',
    tasks: [
      'Melakukan moderasi server Discord',
      'Membuat event komunitas seperti watch party atau game night',
      'Membantu member baru memahami server Discord',
      'Menjagapercakapan tetap sesuai aturan',
      'Mendorong partisipasi member dalam aktivitas server',
    ],
  },
]

const REQUIREMENTS = [
  { icon: '🎌', text: 'Memiliki minat pada anime, manga, dan pop culture Jepang' },
  { icon: '📱', text: 'Aktif menggunakan internet dan sosial media' },
  { icon: '💬', text: 'Komunikatif dan mampu bekerja dalam tim' },
  { icon: '⚡', text: 'Bertanggung jawab terhadap tugas yang diberikan' },
  { icon: '🔥', text: 'Konsisten dan memiliki komitmen jangka panjang' },
  { icon: '🎮', text: 'Bersedia berkoordinasi melalui Discord' },
]

const BENEFITS = [
  {
    icon: '💰',
    title: 'Cuan Tambahan',
    desc: 'Dapatkan income tambahan dari setiap konten yang kamu hasilkan',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: '📈',
    title: 'Portofolio Publik',
    desc: 'Hasilkan portofolio nyata dalam penulisan & pengelolaan komunitas',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: '🤝',
    title: 'Networking',
    desc: 'Connect dengan sesama penggemar pop culture Jepang',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: '🚀',
    title: 'Pengembangan Karir',
    desc: 'Kesempatan berkembang jadi core team Soraku',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: '🎮',
    title: 'Akses Eksklusif',
    desc: 'Nikmati benefit khusus untuk contributor aktif',
    gradient: 'from-rose-500 to-red-500',
  },
  {
    icon: '✨',
    title: 'Komunitas Aktif',
    desc: 'Join komunitas kreatif yang selalu bergerak',
    gradient: 'from-violet-500 to-purple-500',
  },
]

export default function RequirementsPage() {
  return (
    <main className="min-h-screen px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        {/* Hero Header - Stunning Visual */}
        <div className="relative mb-16 overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 p-8 sm:p-16">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-violet-500/20 blur-[100px]" />
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-amber-500/20 blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-[120px]" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
          </div>

          {/* Floating Elements */}
          <div className="absolute top-8 left-8 animate-pulse text-4xl">✨</div>
          <div className="absolute top-12 right-12 animate-bounce text-3xl">🚀</div>
          <div className="absolute right-16 bottom-8 animate-pulse text-2xl delay-500">💫</div>

          <div className="relative text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-6 py-2 text-xs font-bold tracking-[0.2em] text-amber-400 uppercase shadow-lg shadow-amber-500/20">
              <Sparkles className="h-4 w-4" />
              Buka Setiap Bulan
            </div>

            {/* Main Title - Big Typography */}
            <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              <span className="text-white">Jadi </span>
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                Contributor
              </span>
              <br />
              <span className="text-white">Soraku</span>
            </h1>

            {/* Subtitle */}
            <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-relaxed">
              Bergabung dengan Soraku dan{' '}
              <span className="font-bold text-amber-400">hasilkan cuan tambahan</span> sambil
              membangun komunitas anime & pop culture Jepang terbesar di Indonesia.
            </p>

            {/* Stats - Visual Cards */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              {[
                { num: '50+', label: 'Kontributor', icon: '👥' },
                { num: '1000+', label: 'Konten', icon: '📝' },
                { num: '50K+', label: 'Pengikut', icon: '🔥' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="glass-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-8 py-4 transition-all hover:scale-105 hover:border-amber-500/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                  <div className="relative flex items-center gap-3">
                    <span className="text-2xl">{stat.icon}</span>
                    <div className="text-left">
                      <p className="text-2xl font-black text-white">{stat.num}</p>
                      <p className="text-muted-foreground text-xs">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://forms.gle/NXwq7v6zpphKLfdKA"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-amber-500/30 transition-all hover:scale-105 hover:shadow-2xl"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Daftar Sekarang{' '}
                  <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
              <a
                href="https://discord.gg/qm3XJvRa6B"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition-all hover:scale-105 hover:border-violet-500/30"
              >
                Tanya di Discord{' '}
                <ArrowRight className="inline h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Benefits Section - Grid of Glass Cards */}
        <section className="mb-12">
          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-bold tracking-widest text-violet-400 uppercase">
              <Crown className="h-3.5 w-3.5" /> Benefits
            </div>
            <h2 className="text-3xl font-black text-white sm:text-4xl">
              Mengapa <span className="text-gradient">Bergabung?</span>
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((benefit, i) => (
              <div
                key={i}
                className="glass-card group relative overflow-hidden rounded-2xl border border-white/5 p-6 transition-all hover:-translate-y-2"
              >
                {/* Gradient Accent */}
                <div
                  className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-r ${benefit.gradient}`}
                />

                {/* Icon Background */}
                <div className="absolute -top-4 -right-4 text-7xl opacity-5 transition-transform duration-500 group-hover:scale-150 group-hover:rotate-12">
                  {benefit.icon}
                </div>

                <div className="relative">
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${benefit.gradient} text-2xl shadow-lg`}
                  >
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white">{benefit.title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>

                {/* Hover Glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Income Info - Highlight Card */}
        <section className="mb-12">
          <div className="glass-card-glow relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-950/50 via-amber-900/30 to-orange-950/50 p-8 sm:p-10">
            {/* Animated Elements */}
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-amber-500/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-orange-500/20 blur-3xl" />

            <div className="relative flex flex-col items-center gap-6 sm:flex-row">
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 text-4xl shadow-xl shadow-amber-500/30">
                💵
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-black text-white">Sistem Pendapatan Contributor</h3>
                <p className="text-muted-foreground mt-2 max-w-xl text-base">
                  Setiap konten yang kamu hasilkan berpotensi menghasilkan income.
                  <span className="font-semibold text-amber-400">
                    {' '}
                    Semakin banyak dan berkualitas, semakin besar kesempatan earningmu!
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Positions - Detailed Cards */}
        <section className="mb-12 space-y-6">
          <div className="mb-8 text-center">
            <div className="border-primary/20 bg-primary/10 text-primary mb-3 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold tracking-widest uppercase">
              <Briefcase className="h-3.5 w-3.5" /> Open Positions
            </div>
            <h2 className="text-3xl font-black text-white sm:text-4xl">
              Posisi yang <span className="text-primary">Tersedia</span>
            </h2>
          </div>

          {POSITIONS.map((pos, i) => (
            <div
              key={pos.id}
              className={`${pos.color} group relative overflow-hidden rounded-3xl border border-white/5 p-6 transition-all hover:-translate-y-1`}
            >
              {/* Accent Line */}
              <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${pos.accent}`} />

              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                {/* Icon */}
                <div
                  className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${pos.accent} text-3xl shadow-lg`}
                >
                  {pos.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground/50 text-xs font-bold tracking-[0.2em]">
                      {pos.id}
                    </span>
                    <span
                      className={`rounded-full bg-gradient-to-r ${pos.accent} px-3 py-0.5 text-[10px] font-bold text-white uppercase`}
                    >
                      {pos.role.split(' ')[0]}
                    </span>
                  </div>

                  <h3 className="mt-2 text-xl font-black text-white">{pos.role}</h3>
                  <p className="text-muted-foreground mt-2 text-sm">{pos.desc}</p>

                  {/* Tasks */}
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {pos.tasks.map((task, j) => (
                      <div
                        key={j}
                        className="flex items-start gap-2 rounded-lg bg-white/5 px-3 py-2"
                      >
                        <span
                          className={`mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-r ${pos.accent}`}
                        />
                        <span className="text-muted-foreground text-xs">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <a
                  href="https://forms.gle/NXwq7v6zpphKLfdKA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${pos.accent} px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl`}
                >
                  Daftar <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </section>

        {/* Requirements - Clean List */}
        <section className="mb-12">
          <div className="glass-card rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-white/0 p-8">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-black text-white">
              <div className="bg-primary/20 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                <Star className="h-5 w-5" />
              </div>
              Persyaratan Umum
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              {REQUIREMENTS.map((req, i) => (
                <div
                  key={i}
                  className="group hover:border-primary/30 flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 px-4 py-3 transition-all hover:bg-white/10"
                >
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 text-lg transition-transform group-hover:scale-110">
                    {req.icon}
                  </span>
                  <span className="text-muted-foreground text-sm">{req.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA - Final */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-900 via-indigo-900 to-purple-900 p-10 sm:p-16">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-violet-500/20 blur-[100px]" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-500/20 blur-[100px]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
          </div>

          <div className="relative text-center">
            <div className="mb-4 text-5xl">🎯</div>
            <p className="text-3xl font-black text-white sm:text-4xl">
              Siap{' '}
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Mulai Earn
              </span>{' '}
              Sekarang?
            </p>
            <p className="text-muted-foreground mx-auto mt-4 max-w-lg text-lg">
              Daftar sekarang dan mulai menghasilkan dari passionmu!
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://forms.gle/NXwq7v6zpphKLfdKA"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-violet-900 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
              >
                <Rocket className="h-5 w-5" />
                Daftar via Google Form
              </a>
              <a
                href="https://discord.gg/qm3XJvRa6B"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-semibold text-white transition-all hover:bg-white/20"
              >
                Tanya di Discord
              </a>
            </div>

            <p className="text-muted-foreground/50 mt-6 text-sm">
              Punya pertanyaan? Langsung tanyakan di server Discord Soraku
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
