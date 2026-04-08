import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, MapPin, ExternalLink, MessageCircle } from 'lucide-react'
import { DiscordIcon } from '@/components/icons/custom-icons'

export const metadata: Metadata = {
  title: 'Kontak | Soraku',
  description: 'Hubungi Soraku Community. Email, lokasi, dan Discord server.',
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="mb-12 text-center">
        <p className="text-primary/70 mb-3 text-xs font-bold tracking-widest uppercase">
          Hubungi Kami
        </p>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Kontak</h1>
        <p className="text-muted-foreground/70 mx-auto mt-4 max-w-lg text-sm leading-relaxed">
          Kami ingin sekali mendengar kabar dari kalian! Ada pertanyaan, masukan, atau cuma mau say
          hi? Jangan ragu buat menghubungi kami lewat formulir di bawah ini. Kami senang banget
          kalau bisa ngobrol sama kalian dan pasti bakal berusaha buat bales secepatnya.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Info cards */}
        <div className="space-y-4">
          {/* Contact Center Email */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 border-primary/20 flex h-10 w-10 items-center justify-center rounded-xl border">
                <Mail className="text-primary h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#D9DDE3]">Contact Center</h3>
                <a
                  href="mailto:contact@soraku.id"
                  className="text-primary/70 hover:text-primary text-sm transition-colors"
                >
                  contact@soraku.id
                </a>
                <p className="text-muted-foreground/40 mt-1 text-xs">
                  Untuk sponsor, partner, dan pertanyaan umum.
                </p>
              </div>
            </div>
          </div>

          {/* Admin Email */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
                <Mail className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#D9DDE3]">Admin Center</h3>
                <a
                  href="mailto:admin@soraku.id"
                  className="text-primary/70 hover:text-primary text-sm transition-colors"
                >
                  admin@soraku.id
                </a>
                <p className="text-muted-foreground/40 mt-1 text-xs">
                  Untuk pertanyaan teknis, OTP, dan hal admin.
                </p>
              </div>
            </div>
          </div>

          {/* Discord */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#5865F2]/20 bg-[#5865F2]/10">
                <DiscordIcon className="h-5 w-5 text-[#5865F2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#D9DDE3]">Discord Server</h3>
                <p className="text-muted-foreground/40 mt-1 mb-3 text-xs">
                  Cara tercepat untuk ngobrol langsung dengan tim dan komunitas.
                </p>
                <a
                  href="https://discord.gg/qm3XJvRa6B"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#5865F2] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#5865F2]/90"
                >
                  <DiscordIcon className="h-3.5 w-3.5" /> Gabung Discord
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                <MapPin className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#D9DDE3]">Lokasi</h3>
                <p className="text-muted-foreground/60 text-sm">Indonesia</p>
                <p className="text-muted-foreground/40 mt-1 text-xs">
                  Komunitas online, anggota tersebar di seluruh Indonesia.
                </p>
              </div>
            </div>
          </div>

          {/* Feedback link */}
          <Link
            href="/feedback"
            className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-colors hover:border-white/[0.1]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
              <MessageCircle className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#D9DDE3]">Kirim Masukan</h3>
              <p className="text-muted-foreground/40 mt-0.5 text-xs">
                Sampaikan saran, laporan bug, atau request konten melalui formulir.
              </p>
            </div>
          </Link>
        </div>

        {/* Map */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
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
      <div className="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8">
        <h2 className="mb-4 text-lg font-bold text-[#D9DDE3]">Info & Saran</h2>
        <div className="text-muted-foreground/60 space-y-4 text-sm leading-relaxed">
          <p>
            Kalau kalian punya request spesial, kayak update konten anime terbaru, rekomendasi game
            yang seru, atau tips buat nge-boost pengalaman main kalian, jangan malu-malu buat ngasih
            tahu! Kami selalu siap buat bikin konten yang kalian pengen dan kasih info paling
            up-to-date.
          </p>

          <div className="border-border/20 rounded-xl border bg-white/[0.02] p-4">
            <p className="mb-2 text-xs font-bold text-amber-400/80">Perhatian!</p>
            <ul className="text-muted-foreground/50 space-y-2 text-xs">
              <li>
                Pastikan informasi yang kamu masukkan benar dan lengkap agar kami bisa merespons
                dengan cepat.
              </li>
              <li>
                Hindari penggunaan informasi sensitif atau pribadi yang tidak relevan. Kami
                menghargai privasi kamu.
              </li>
              <li>
                Jika tidak ada balasan dalam 1 hari, silakan hubungi lewat Discord server kami.
              </li>
            </ul>
          </div>

          <div className="flex justify-center">
            <a
              href="https://discord.gg/qm3XJvRa6B"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#5865F2] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#5865F2]/90"
            >
              <DiscordIcon className="h-4 w-4" /> Gabung Discord Soraku
              <ExternalLink className="h-3.5 w-3.5 opacity-60" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
