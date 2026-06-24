import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, MapPin, ExternalLink, MessageCircle, AlertTriangle } from 'lucide-react'
import { DiscordIcon } from '@/components/icons/custom-icons'

export const metadata: Metadata = {
  title: 'Kontak | Soraku',
  description: 'Hubungi Soraku. Email, lokasi, dan Discord server.',
}

const CONTACTS = [
  {
    icon: Mail,
    color: 'text-primary',
    bg: 'bg-primary/20',
    border: 'border-primary',
    label: 'Contact Center',
    value: 'contact@soraku.id',
    href: 'mailto:contact@soraku.id',
    desc: 'Untuk sponsor, partner, dan pertanyaan umum.',
  },
  {
    icon: Mail,
    color: 'text-amber-400',
    bg: 'bg-amber-500/20',
    border: 'border-amber-500',
    label: 'Admin Center',
    value: 'admin@soraku.id',
    href: 'mailto:admin@soraku.id',
    desc: 'Untuk pertanyaan teknis, OTP, dan hal admin.',
  },
  {
    icon: DiscordIcon,
    color: 'text-[#5865F2]',
    bg: 'bg-[#5865F2]/20',
    border: 'border-[#5865F2]',
    label: 'Discord Server',
    value: 'Gabung Discord',
    href: 'https://discord.gg/qm3XJvRa6B',
    desc: 'Cara tercepat untuk ngobrol langsung dengan tim dan komunitas.',
    external: true,
  },
  {
    icon: MapPin,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500',
    label: 'Lokasi',
    value: 'Indonesia',
    desc: 'Komunitas online, anggota tersebar di seluruh Indonesia.',
  },
]

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-12 text-center">
        <p className="mb-3 text-[10px] font-bold tracking-widest text-primary uppercase">
          Hubungi Kami
        </p>
        <h1 className="text-3xl font-black tracking-tighter text-foreground sm:text-5xl">
          Kontak
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted">
          Kami ingin sekali mendengar kabar dari kalian! Ada pertanyaan, masukan, atau cuma mau say
          hi? Jangan ragu buat menghubungi kami.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Info cards */}
        <div className="space-y-4">
          {CONTACTS.map((c) => (
            <div
              key={c.label}
              className="rounded-md border-2 border-black bg-surface p-5 shadow-[3px_3px_0px_#000]"
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border-2 border-black ${c.bg}`}>
                  <c.icon className={`h-5 w-5 ${c.color}`} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-foreground">{c.label}</h3>
                  {c.href ? (
                    <a
                      href={c.href}
                      target={c.external ? '_blank' : undefined}
                      rel={c.external ? 'noopener noreferrer' : undefined}
                      className="mt-0.5 inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline"
                    >
                      {c.value}
                      {c.external && <ExternalLink className="h-3 w-3" />}
                    </a>
                  ) : (
                    <p className="mt-0.5 text-sm font-bold text-foreground">{c.value}</p>
                  )}
                  <p className="mt-1 text-xs text-muted">{c.desc}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Feedback link */}
          <Link
            href="/feedback"
            className="flex items-center gap-4 rounded-md border-2 border-black bg-surface p-5 shadow-[3px_3px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#000]"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border-2 border-amber-500 bg-amber-500/20">
              <MessageCircle className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Kirim Masukan</h3>
              <p className="mt-0.5 text-xs text-muted">
                Sampaikan saran, laporan bug, atau request konten.
              </p>
            </div>
          </Link>
        </div>

        {/* Map */}
        <div className="overflow-hidden rounded-md border-2 border-black bg-surface shadow-[3px_3px_0px_#000]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63466.67783929384!2d106.74138094999999!3d-6.208763!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e3469d%3A0x5371bf0fdad786a2!2sJakarta%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '400px' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Soraku"
          />
        </div>
      </div>

      {/* Info section */}
      <div className="mt-8 rounded-md border-2 border-black bg-surface p-6 shadow-[4px_4px_0px_#000] sm:p-8">
        <h2 className="mb-4 text-lg font-black text-foreground">Info & Saran</h2>
        <div className="space-y-4 text-sm leading-relaxed text-muted">
          <p>
            Kalau kalian punya request spesial, kayak update konten anime terbaru, rekomendasi game
            yang seru, atau tips buat nge-boost pengalaman main kalian, jangan malu-malu buat ngasih
            tahu! Kami selalu siap buat bikin konten yang kalian pengen dan kasih info paling
            up-to-date.
          </p>

          <div className="rounded-md border-2 border-amber-500/50 bg-amber-500/10 p-4 shadow-[2px_2px_0px_#000]">
            <p className="mb-2 flex items-center gap-2 text-xs font-bold text-amber-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              Perhatian!
            </p>
            <ul className="space-y-2 text-xs text-muted">
              <li>Pastikan informasi yang kamu masukkan benar dan lengkap agar kami bisa merespons dengan cepat.</li>
              <li>Hindari penggunaan informasi sensitif atau pribadi yang tidak relevan. Kami menghargai privasi kamu.</li>
              <li>Jika tidak ada balasan dalam 1 hari, silakan hubungi lewat Discord server kami.</li>
            </ul>
          </div>

          <div className="flex justify-center">
            <a
              href="https://discord.gg/qm3XJvRa6B"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border-2 border-black bg-[#5865F2] px-6 py-3 text-sm font-bold text-white shadow-[4px_4px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]"
            >
              <DiscordIcon className="h-4 w-4" /> Gabung Discord Soraku
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
