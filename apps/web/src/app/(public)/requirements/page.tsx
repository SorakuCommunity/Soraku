import Link from "next/link";
import { ArrowRight, ExternalLink, Users, Briefcase, Star } from "lucide-react";

export const metadata = {
  title: "Requirements – Open Recruitment | Soraku Community",
  description: "Soraku Open Recruitment Batch 01 – Bergabung sebagai Writer, Social Media, atau Community Team.",
};

const POSITIONS = [
  {
    id: "01",
    role: "Writer / Editorial Team",
    color: "from-blue-500/15 to-primary/10 border-blue-500/20",
    icon: "✍️",
    desc: "Bertanggung jawab pada produksi konten utama di website Soraku.",
    tasks: [
      "Menulis artikel berita, informasi, dan opini seputar anime dan pop culture Jepang",
      "Melakukan riset informasi dari sumber terpercaya",
      "Menyusun artikel dengan struktur yang jelas dan informatif",
      "Mengoptimasi artikel dengan dasar SEO",
      "Menjaga konsistensi kualitas dan publikasi konten",
    ],
  },
  {
    id: "02",
    role: "Social Media Team",
    color: "from-pink-500/15 to-rose-500/10 border-pink-500/20",
    icon: "📱",
    desc: "Mengelola distribusi konten Soraku di berbagai platform sosial media.",
    tasks: [
      "Mengadaptasi artikel menjadi konten sosial media",
      "Menulis caption yang menarik dan mudah dibagikan",
      "Menjadwalkan posting secara konsisten",
      "Membantu meningkatkan engagement komunitas",
      "Mengamati performa konten dan interaksi audience",
    ],
  },
  {
    id: "03",
    role: "Community Manager (Discord)",
    color: "from-indigo-500/15 to-violet-500/10 border-indigo-500/20",
    icon: "💬",
    desc: "Mengembangkan dan menjaga aktivitas komunitas Soraku di server Discord.",
    tasks: [],
    subs: [
      {
        role: "Discord Moderator",
        tasks: ["Melakukan moderasi server Discord", "Menjaga percakapan tetap sesuai aturan", "Menangani laporan atau pelanggaran dari member", "Membantu menjaga suasana komunitas tetap aman"],
      },
      {
        role: "Event & Community Activity Staff",
        tasks: ["Membuat event komunitas seperti watch party atau game night", "Mengaktifkan channel diskusi komunitas", "Mendorong partisipasi member dalam aktivitas server"],
      },
      {
        role: "Community Support",
        tasks: ["Membantu member baru memahami server Discord", "Menjawab pertanyaan dasar komunitas", "Mengarahkan member ke channel yang sesuai"],
      },
    ],
  },
];

const REQUIREMENTS = [
  "Memiliki minat pada anime, manga, dan pop culture Jepang",
  "Aktif menggunakan internet dan sosial media",
  "Komunikatif dan mampu bekerja dalam tim",
  "Bertanggung jawab terhadap tugas yang diberikan",
  "Konsisten dan memiliki komitmen jangka panjang",
  "Bersedia berkoordinasi melalui Discord",
];

export default function RequirementsPage() {
  return (
    <main className="min-h-screen px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-[11px] font-bold tracking-[0.18em] text-primary/80 uppercase">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/70" />
            Open Recruitment · Batch 01
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Soraku Open<br />
            <span className="text-primary">Recruitment</span>
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-sm text-muted-foreground leading-relaxed">
            Soraku membuka kesempatan bagi individu yang ingin berkembang bersama
            dalam membangun media digital dan komunitas pop culture Jepang yang terstruktur,
            konsisten, dan berdampak.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5">
              Daftar Sekarang <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-2xl border border-indigo-500/30 bg-indigo-500/8 px-6 py-3 text-sm font-semibold text-indigo-300 transition-all hover:-translate-y-0.5">
              Info via Discord <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* About Soraku */}
        <section className="glass-card mb-8 rounded-2xl p-6">
          <h2 className="mb-3 text-lg font-black">Tentang Soraku</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Soraku adalah platform media digital dan komunitas yang berfokus pada anime, manga, dan pop culture Jepang.
            Ekosistem Soraku terdiri dari website berita & artikel, distribusi konten sosial media, server komunitas Discord,
            dan platform diskusi & interaksi antar member.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Tujuan Soraku adalah membangun ruang komunitas yang aktif, kreatif, dan berkelanjutan bagi para penggemar pop culture Jepang.
          </p>
        </section>

        {/* Positions */}
        <section className="mb-8 space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-black">
            <Briefcase className="h-5 w-5 text-primary" /> Posisi yang Dibuka
          </h2>
          {POSITIONS.map((pos) => (
            <div key={pos.id} className={`glass-card rounded-2xl border bg-gradient-to-br p-6 ${pos.color}`}>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-background/60 text-2xl">
                  {pos.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-widest text-muted-foreground/50">POSISI {pos.id}</span>
                  </div>
                  <h3 className="mt-0.5 text-base font-black">{pos.role}</h3>
                  <p className="mt-1 text-sm text-muted-foreground/80">{pos.desc}</p>

                  {pos.tasks.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {pos.tasks.map((t, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-primary/50" />{t}
                        </li>
                      ))}
                    </ul>
                  )}

                  {pos.subs?.map(sub => (
                    <div key={sub.role} className="mt-4 rounded-xl border border-border/40 bg-background/30 p-4">
                      <p className="text-xs font-bold text-foreground/80">{sub.role}</p>
                      <ul className="mt-2 space-y-1">
                        {sub.tasks.map((t, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-primary/50" />{t}
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

        {/* General Requirements */}
        <section className="glass-card mb-8 rounded-2xl p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-black">
            <Star className="h-5 w-5 text-primary" /> Persyaratan Umum
          </h2>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {REQUIREMENTS.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/60" />{r}
              </li>
            ))}
          </ul>
        </section>

        {/* Benefits */}
        <section className="glass-card mb-8 rounded-2xl p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-black">
            <Users className="h-5 w-5 text-primary" /> Benefit Kontributor
          </h2>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[
              "Pengalaman dalam dunia media digital",
              "Portofolio publik dalam penulisan atau pengelolaan komunitas",
              "Pengalaman bekerja dalam tim komunitas kreatif",
              "Networking dengan sesama penggemar pop culture Jepang",
              "Kesempatan berkembang menjadi bagian dari core team Soraku",
            ].map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent/60" />{b}
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
          <p className="text-lg font-black">Soraku bukan sekadar media.</p>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Soraku adalah ekosistem komunitas yang dibangun bersama oleh para penggemar anime dan pop culture Jepang.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <a href="https://discord.gg/qm3XJvRa6B" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
              Baca Requirement Lengkap <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <Link href="/" className="flex items-center gap-2 rounded-2xl border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground">
              Kembali ke Beranda
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
