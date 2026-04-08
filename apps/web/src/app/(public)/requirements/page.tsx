import type { Metadata } from 'next'
import RequirementsForm from './RequirementsForm'

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
  title: 'Become a Contributor | Soraku Community',
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
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-[#D9DDE3]">Jadi Contributor Soraku</h1>
          <p className="mt-2 text-sm text-[#6E8FA6]">
            Earn额外的收入sambil membangun komunitas anime terbesar di Indonesia
          </p>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-[#D9DDE3]">Benefits</h2>
          <div className="grid grid-cols-2 gap-3">
            {BENEFITS.map((b, i) => (
              <div key={i} className="rounded-lg bg-white/5 p-3">
                <p className="text-sm font-medium text-[#D9DDE3]">{b.title}</p>
                <p className="mt-1 text-xs text-[#6E8FA6]">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-[#D9DDE3]">Posisi Tersedia</h2>
          <div className="space-y-3">
            {POSITIONS.map((pos) => (
              <div key={pos.id} className="rounded-lg border border-white/[0.06] bg-white/5 p-4">
                <div className="mb-2 flex items-center gap-3">
                  <span className="text-xl">{pos.icon}</span>
                  <div>
                    <p className="font-medium text-[#D9DDE3]">{pos.role}</p>
                    <p className="text-xs text-[#6E8FA6]">{pos.desc}</p>
                  </div>
                </div>
                <ul className="mt-2 space-y-1">
                  {pos.tasks.map((task, j) => (
                    <li key={j} className="text-xs text-[#D9DDE3]/60">
                      • {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-[#D9DDE3]">Community Manager</h2>
          <RequirementsForm communityRoles={COMMUNITY_ROLES} />
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-[#D9DDE3]">Persyaratan Umum</h2>
          <ul className="space-y-2">
            {REQUIREMENTS.map((req, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-[#D9DDE3]/70">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4FA3D1]" />
                {req}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3 text-center">
          <a
            href="https://forms.gle/NXwq7v6zpphKLfdKA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-[#4FA3D1] px-6 py-3 text-sm font-semibold text-[#1C1E22]"
          >
            Daftar via Google Form
          </a>
          <p className="text-xs text-[#6E8FA6]">Tanya di Discord: discord.gg/qm3XJvRa6B</p>
        </div>
      </div>
    </main>
  )
}
