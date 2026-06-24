import type { Metadata } from 'next'
import RequirementsForm from './RequirementsForm'
import { BadgeCheck, Sparkles } from 'lucide-react'

interface Role {
  id: string
  role: string
  icon: string
  accent: string
  desc: string
  tasks: string[]
  qualifications: string[]
}

export const metadata: Metadata = {
  title: 'Become a Contributor | Soraku',
  description:
    'Join Soraku as a Contributor - Earn extra income while contributing to the anime & pop culture community.',
}

const COMMUNITY_ROLES: Role[] = [
  {
    id: '03',
    role: 'Admin',
    icon: '👑',
    accent: '',
    desc: 'Mengelola komunitas secara keseluruhan.',
    tasks: [
      'Memoderasi konten yang diposting anggota',
      'Mengelola aktivitas forum dan diskusi',
      'Membantu mengelola server Discord',
    ],
    qualifications: [
      'Pengalaman mengelola komunitas online',
      'Mampu bekerja dengan tim',
      'Komunikasi yang baik',
    ],
  },
  {
    id: '04',
    role: 'Moderator',
    icon: '🛡️',
    accent: '',
    desc: 'Menjaga ketertiban di seluruh platform.',
    tasks: [
      'Memastikan diskusi berjalan sehat',
      'Membantu menjawab pertanyaan komunitas',
      'Menangani konflik dengan bijak',
    ],
    qualifications: [
      'Pengalaman moderasi komunitas online',
      'Memahami anime dan budaya Jepang',
      'Rajin dan konsisten',
    ],
  },
  {
    id: '05',
    role: 'PR Manager',
    icon: '🎙️',
    accent: '',
    desc: 'Membangun hubungan dengan pihak eksternal.',
    tasks: [
      'Berkomunikasi dengan media dan kreator',
      'Mengelola kolaborasi dengan mitra',
      'Mempromosikan event komunitas',
    ],
    qualifications: ['Pengalaman di PR atau marketing', 'Kemampuan komunikasi yang baik'],
  },
  {
    id: '06',
    role: 'Eventer',
    icon: '🎉',
    accent: '',
    desc: 'Merencanakan dan mengelola event komunitas.',
    tasks: [
      'Merencanakan event komunitas',
      'Memastikan event berjalan lancer',
      'Berkordinasi dengan tim dan mitra',
    ],
    qualifications: ['Pengalaman pengelolaan event', 'Kreatif dan mampu merencanakan'],
  },
]

const POSITIONS = [
  {
    id: '01',
    role: 'Writer / Editorial Team',
    icon: '✍️',
    desc: 'Memproduksi konten utama di website.',
    tasks: [
      'Menulis artikel berita dan opini',
      'Melakukan riset informasi',
      'Menyusun artikel dengan struktur jelas',
    ],
  },
  {
    id: '02',
    role: 'Social Media Team',
    icon: '📱',
    desc: 'Mengelola distribusi konten di sosial media.',
    tasks: [
      'Mengadaptasi konten untuk sosial media',
      'Menulis caption menarik',
      'Menjadwalkan posting konsisten',
    ],
  },
]

const REQUIREMENTS = [
  'Minat pada anime, manga, dan pop culture Jepang',
  'Aktif menggunakan internet dan sosial media',
  'Komunikatif dan mampu bekerja dalam tim',
  'Bertanggung jawab terhadap tugas',
  'Konsisten dan memiliki komitmen jangka panjang',
  'Bersedia berkoordinasi melalui Discord',
]

const BENEFITS = [
  { title: 'Cuan Tambahan', desc: 'Income tambahan dari setiap konten' },
  { title: 'Portofolio Publik', desc: 'Portofolio nyata dalam penulisan' },
  { title: 'Networking', desc: 'Connect dengan sesama penggemar' },
  { title: 'Pengembangan Karir', desc: 'Kesempatan menjadi core team' },
]

export default function RequirementsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-10 text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-md border-2 border-black bg-primary px-3 py-1.5 text-[10px] font-bold text-white shadow-[2px_2px_0px_#000]">
          <Sparkles className="h-3 w-3" />
          Join the Team
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tighter text-foreground lg:text-5xl">
          Jadi Contributor Soraku
        </h1>
        <p className="mt-2 text-sm text-muted">
          Dapatkan penghasilan tambahan sambil membangun komunitas anime terbesar di Indonesia
        </p>
      </div>

      {/* Benefits */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-black text-foreground">Benefits</h2>
        <div className="grid grid-cols-2 gap-3">
          {BENEFITS.map((b, i) => (
            <div key={i} className="rounded-md border-2 border-black bg-surface p-4 shadow-[3px_3px_0px_#000]">
              <p className="text-sm font-bold text-foreground">{b.title}</p>
              <p className="mt-1 text-xs text-muted">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Positions */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-black text-foreground">Posisi Tersedia</h2>
        <div className="space-y-3">
          {POSITIONS.map((pos) => (
            <div key={pos.id} className="rounded-md border-2 border-black bg-surface p-4 shadow-[3px_3px_0px_#000]">
              <div className="mb-2 flex items-center gap-3">
                <span className="text-xl">{pos.icon}</span>
                <div>
                  <p className="font-bold text-foreground">{pos.role}</p>
                  <p className="text-xs text-muted">{pos.desc}</p>
                </div>
              </div>
              <ul className="mt-2 space-y-1">
                {pos.tasks.map((task, j) => (
                  <li key={j} className="text-xs text-muted">• {task}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Community Manager */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-black text-foreground">Community Manager</h2>
        <RequirementsForm communityRoles={COMMUNITY_ROLES} />
      </section>

      {/* Requirements */}
      <section className="mb-8 rounded-md border-2 border-black bg-surface p-6 shadow-[4px_4px_0px_#000]">
        <h2 className="mb-4 text-lg font-black text-foreground">Persyaratan Umum</h2>
        <ul className="space-y-2">
          {REQUIREMENTS.map((req, i) => (
            <li key={i} className="flex items-center gap-2 text-sm font-medium text-foreground">
              <BadgeCheck className="h-4 w-4 flex-shrink-0 text-primary" />
              {req}
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <div className="space-y-3 text-center">
        <a
          href="https://forms.gle/NXwq7v6zpphKLfdKA"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border-2 border-black bg-primary px-6 py-3 text-sm font-bold text-white shadow-[4px_4px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]"
        >
          Daftar via Google Form
        </a>
        <p className="text-xs text-muted">Tanya di Discord: discord.gg/qm3XJvRa6B</p>
      </div>
    </div>
  )
}
