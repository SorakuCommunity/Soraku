import Link from 'next/link'
import Image from 'next/image'
import { Mail } from 'lucide-react'
import {
  DiscordIcon,
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
  XIcon,
  YouTubeIcon,
} from '@/components/icons/custom-icons'

const MailIcon = Mail

// Contact Emails
const CONTACT_EMAILS = {
  contact: 'contact@soraku.id',
  admin: 'admin@soraku.id',
}

const SOCIAL_LINKS = [
  {
    href: 'https://discord.gg/qm3XJvRa6B',
    Icon: DiscordIcon,
    label: 'Discord',
    color: 'hover:bg-[#5865F2]/20 hover:border-[#5865F2]/50 hover:text-[#5865F2]',
  },
  {
    href: 'https://www.tiktok.com/@soraku.id?_r=1&_t=ZS-93VKUIkzmTM',
    Icon: TikTokIcon,
    label: 'TikTok',
    color: 'hover:bg-white/10 hover:border-white/30 hover:text-white',
  },
  {
    href: 'https://www.facebook.com/share/1HQs9ZZeCw/',
    Icon: FacebookIcon,
    label: 'Facebook',
    color: 'hover:bg-[#1877F2]/20 hover:border-[#1877F2]/50 hover:text-[#1877F2]',
  },
  {
    href: 'https://www.instagram.com/soraku.moe?igsh=MWxpcmNmd2tqZWE3MQ==',
    Icon: InstagramIcon,
    label: 'Instagram',
    color:
      'hover:bg-gradient-to-br hover:from-[#833AB4]/20 hover:via-[#E1306C]/20 hover:to-[#F77737]/20 hover:border-[#E1306C]/50 hover:text-[#E1306C]',
  },
  {
    href: 'https://twitter.com/@AppSoraa',
    Icon: XIcon,
    label: 'X',
    color: 'hover:bg-white/10 hover:border-white/30 hover:text-white',
  },
  {
    href: 'https://youtube.com/@chsoraku?si=kcOs8wWCi7TwwC3P',
    Icon: YouTubeIcon,
    label: 'YouTube',
    color: 'hover:bg-[#FF0000]/20 hover:border-[#FF0000]/50 hover:text-[#FF0000]',
  },
]

const GROUP_LINKS = [
  {
    label: 'Facebook Group',
    href: 'https://www.facebook.com/groups/2080754095772347/?ref=share&mibextid=NSMWBT',
  },
  { label: 'WhatsApp Channel', href: 'https://whatsapp.com/channel/0029VbBNBA29MF93HdPSMu3E' },
  { label: 'LinkedIn', href: '#' },
]

const QUICK_LINKS = [
  { label: 'Events', href: '/events' },
  { label: 'Blog', href: '/blog' },
  { label: 'Galeri', href: '/gallery' },
  { label: 'VTuber', href: '/vtubers' },
  { label: 'Premium', href: '/premium' },
]

const INFO_LINKS = [
  { label: 'Tentang Soraku', href: '/about' },
  { label: 'Rekrutmen', href: '/requirements' },
  { label: 'Masukan', href: '/feedback' },
  { label: 'Privasi', href: '/privacy' },
  { label: 'Ketentuan', href: '/tos' },
  { label: 'Lisensi', href: '/license' },
]

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#1C1E22]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Desktop Layout */}
        <div className="hidden gap-8 sm:grid sm:grid-cols-12 lg:gap-12">
          {/* Brand Column */}
          <div className="sm:col-span-5 lg:col-span-5">
            <div className="mb-4">
              <p className="mb-2 text-xs text-[#6E8FA6]">Made with tea by</p>
              <Link href="/" className="group inline-flex items-center gap-3">
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#1a1c20]">
                  <Image
                    src="/logo.png"
                    alt="Soraku"
                    width={48}
                    height={48}
                    className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <span className="text-xl font-black text-[#D9DDE3] transition-colors group-hover:text-[#4FA3D1]">
                  Soraku
                </span>
              </Link>
            </div>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-[#6E8FA6]">
              Soraku adalah komunitas non-profit budaya pop Jepang di Indonesia yang menyajikan
              berita, artikel, dan ruang kreatif bagi komunitas anime, manga, game, culture jepang,
              vtuber dan cosplayer.
            </p>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ href, Icon, label, color }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/40 transition-all ${color}`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Column */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <p className="text-xs font-black tracking-[0.2em] text-[#D9DDE3] uppercase">
                Platform
              </p>
              <span className="text-[#6E8FA6]">····</span>
            </div>
            <ul className="space-y-3">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="flex items-center gap-2 text-sm text-[#6E8FA6] transition-colors hover:text-[#4FA3D1]"
                  >
                    <span className="text-[#6E8FA6]/50">−</span> {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Komunitas Column */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <p className="text-xs font-black tracking-[0.2em] text-[#D9DDE3] uppercase">
                Komunitas
              </p>
              <span className="text-[#6E8FA6]">····</span>
            </div>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/donate"
                  className="flex items-center gap-2 text-sm text-[#6E8FA6] transition-colors hover:text-[#4FA3D1]"
                >
                  <span className="text-[#6E8FA6]/50">−</span> Donasi
                </Link>
              </li>
              <li>
                <Link
                  href="/agensi"
                  className="flex items-center gap-2 text-sm text-[#6E8FA6] transition-colors hover:text-[#4FA3D1]"
                >
                  <span className="text-[#6E8FA6]/50">−</span> Agensi
                </Link>
              </li>
            </ul>
          </div>

          {/* Informasi Column */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <p className="text-xs font-black tracking-[0.2em] text-[#D9DDE3] uppercase">
                Informasi
              </p>
              <span className="text-[#6E8FA6]">····</span>
            </div>
            <ul className="space-y-3">
              {INFO_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="flex items-center gap-2 text-sm text-[#6E8FA6] transition-colors hover:text-[#4FA3D1]"
                  >
                    <span className="text-[#6E8FA6]/50">−</span> {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community & Contact Column */}
          <div className="sm:col-span-3 lg:col-span-3">
            <div className="mb-4 flex items-center gap-2">
              <p className="text-xs font-black tracking-[0.2em] text-[#D9DDE3] uppercase">
                Community
              </p>
              <span className="text-[#6E8FA6]">····</span>
            </div>
            <ul className="space-y-3">
              {GROUP_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[#6E8FA6] transition-colors hover:text-[#4FA3D1]"
                  >
                    <span className="text-[#6E8FA6]/50">−</span> {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t border-white/[0.06] pt-4">
              <p className="mb-3 text-xs font-black tracking-[0.15em] text-[#D9DDE3] uppercase">
                Contact
              </p>
              <div className="space-y-2">
                <a
                  href={`mailto:${CONTACT_EMAILS.contact}`}
                  className="flex items-center gap-2 text-sm text-[#6E8FA6] transition-colors hover:text-[#4FA3D1]"
                >
                  <MailIcon className="h-4 w-4" />
                  <span>{CONTACT_EMAILS.contact}</span>
                </a>
                <a
                  href={`mailto:${CONTACT_EMAILS.admin}`}
                  className="flex items-center gap-2 text-sm text-[#6E8FA6] transition-colors hover:text-[#4FA3D1]"
                >
                  <MailIcon className="h-4 w-4" />
                  <span>{CONTACT_EMAILS.admin}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="space-y-8 sm:hidden">
          <div>
            <p className="mb-2 text-xs text-[#6E8FA6]">Made with tea by</p>
            <Link href="/" className="group mb-4 inline-flex items-center gap-3">
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#1a1c20]">
                <Image
                  src="/logo.png"
                  alt="Soraku"
                  width={48}
                  height={48}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <span className="text-xl font-black text-[#D9DDE3]">Soraku</span>
            </Link>
            <p className="mb-4 text-sm leading-relaxed text-[#6E8FA6]">
              Soraku adalah komunitas non-profit budaya pop Jepang di Indonesia.
            </p>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ href, Icon, label, color }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/40 transition-all ${color}`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Platform */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <p className="text-xs font-black tracking-[0.15em] text-[#D9DDE3] uppercase">
                  Platform
                </p>
              </div>
              <ul className="space-y-2">
                {QUICK_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="flex items-center gap-2 text-sm text-[#6E8FA6] transition-colors hover:text-[#4FA3D1]"
                    >
                      <span className="text-[#6E8FA6]/50">−</span> {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lainnya */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <p className="text-xs font-black tracking-[0.15em] text-[#D9DDE3] uppercase">
                  Lainnya
                </p>
              </div>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/donate"
                    className="flex items-center gap-2 text-sm text-[#6E8FA6] transition-colors hover:text-[#4FA3D1]"
                  >
                    <span className="text-[#6E8FA6]/50">−</span> Donasi
                  </Link>
                </li>
                {INFO_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="flex items-center gap-2 text-sm text-[#6E8FA6] transition-colors hover:text-[#4FA3D1]"
                    >
                      <span className="text-[#6E8FA6]/50">−</span> {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/[0.06] pt-4">
            <p className="mb-3 text-xs font-black tracking-[0.15em] text-[#D9DDE3] uppercase">
              Contact
            </p>
            <div className="space-y-2">
              <a
                href={`mailto:${CONTACT_EMAILS.contact}`}
                className="flex items-center gap-2 text-sm text-[#6E8FA6] transition-colors hover:text-[#4FA3D1]"
              >
                <MailIcon className="h-4 w-4" />
                <span>{CONTACT_EMAILS.contact}</span>
              </a>
              <a
                href={`mailto:${CONTACT_EMAILS.admin}`}
                className="flex items-center gap-2 text-sm text-[#6E8FA6] transition-colors hover:text-[#4FA3D1]"
              >
                <MailIcon className="h-4 w-4" />
                <span>{CONTACT_EMAILS.admin}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-white/[0.06] pt-6">
          <div className="flex flex-col items-center justify-center gap-2 text-xs text-[#6E8FA6]/60 sm:flex-row">
            <p>© 2026</p>
            <span className="hidden sm:inline">·</span>
            <Link
              href="/"
              className="flex items-center gap-1 font-semibold text-[#4FA3D1] transition-colors hover:text-[#E8C2A8]"
            >
              Soraku <span className="text-[10px]">✦</span>
            </Link>
            <span className="hidden sm:inline">·</span>
            <p>All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
