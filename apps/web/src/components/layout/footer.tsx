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

const CONTACT_EMAILS = {
  contact: 'contact@soraku.id',
  admin: 'admin@soraku.id',
}

const SOCIAL_LINKS = [
  { href: 'https://discord.gg/qm3XJvRa6B', Icon: DiscordIcon, label: 'Discord' },
  { href: 'https://www.tiktok.com/@soraku.id', Icon: TikTokIcon, label: 'TikTok' },
  { href: 'https://www.facebook.com/share/1HQs9ZZeCw/', Icon: FacebookIcon, label: 'Facebook' },
  { href: 'https://www.instagram.com/soraku.moe', Icon: InstagramIcon, label: 'Instagram' },
  { href: 'https://twitter.com/@AppSoraa', Icon: XIcon, label: 'X' },
  { href: 'https://youtube.com/@chsoraku', Icon: YouTubeIcon, label: 'YouTube' },
]

const QUICK_LINKS = [
  { label: 'Events', href: '/events' },
  { label: 'Blog', href: '/blog' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'VTubers', href: '/vtubers' },
  { label: 'Premium', href: '/premium' },
  { label: 'Donate', href: '/donate' },
]

const INFO_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Recruitment', href: '/requirements' },
  { label: 'Feedback', href: '/feedback' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/tos' },
  { label: 'License', href: '/license' },
]

const GROUP_LINKS = [
  { label: 'Facebook Group', href: 'https://www.facebook.com/groups/2080754095772347/' },
  { label: 'WhatsApp Channel', href: 'https://whatsapp.com/channel/0029VbBNBA29MF93HdPSMu3E' },
  { label: 'LinkedIn', href: '#' },
]

export function Footer() {
  return (
    <footer className="border-t-2 border-white/[0.06] bg-[#0B1120] pb-24 lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Desktop */}
        <div className="hidden gap-10 sm:grid sm:grid-cols-12 lg:gap-14">
          <div className="sm:col-span-5 lg:col-span-4">
            <div className="mb-4">
              <p className="mb-3 text-xs font-semibold text-muted-foreground">Built with tea by</p>
              <Link href="/" className="group inline-flex items-center gap-3">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded border-2 border-white/10 bg-[#0B1120]">
                  <Image src="/assets/brand/logo.png" alt="Soraku" width={48} height={48} className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="text-xl font-black text-foreground transition-colors group-hover:text-primary">Soraku</span>
              </Link>
            </div>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Soraku is a global platform blending Japanese pop culture, project-based learning, and creative economy into one integrated ecosystem.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {SOCIAL_LINKS.map(({ href, Icon, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  className="flex h-9 w-9 items-center justify-center rounded border-2 border-white/10 bg-white/[0.02] text-muted-foreground/60 transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-2">
            <p className="mb-4 text-xs font-black tracking-[0.15em] text-muted-foreground uppercase">
              Platform
            </p>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted-foreground/70 transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <p className="mb-4 text-xs font-black tracking-[0.15em] text-muted-foreground uppercase">
              Information
            </p>
            <ul className="space-y-2.5">
              {INFO_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted-foreground/70 transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-3 lg:col-span-3">
            <p className="mb-4 text-xs font-black tracking-[0.15em] text-muted-foreground uppercase">
              Community
            </p>
            <ul className="space-y-2.5">
              {GROUP_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground/70 transition-colors hover:text-primary">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-white/[0.06] pt-4">
              <p className="mb-3 text-xs font-black tracking-[0.15em] text-muted-foreground uppercase">
                Contact
              </p>
              <div className="space-y-2">
                <a href={`mailto:${CONTACT_EMAILS.contact}`} className="flex items-center gap-2 text-sm text-muted-foreground/70 transition-colors hover:text-primary">
                  <MailIcon className="h-4 w-4" />
                  {CONTACT_EMAILS.contact}
                </a>
                <a href={`mailto:${CONTACT_EMAILS.admin}`} className="flex items-center gap-2 text-sm text-muted-foreground/70 transition-colors hover:text-primary">
                  <MailIcon className="h-4 w-4" />
                  {CONTACT_EMAILS.admin}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="space-y-8 sm:hidden">
          <div>
            <p className="mb-2 text-xs text-muted-foreground">Built with tea by</p>
            <Link href="/" className="group mb-4 inline-flex items-center gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded border-2 border-white/10 bg-[#0B1120]">
                <Image src="/assets/brand/logo.png" alt="Soraku" width={48} height={48} className="h-full w-full object-cover object-top" />
              </div>
              <span className="text-xl font-black text-foreground">Soraku</span>
            </Link>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              A global platform blending Japanese pop culture, project-based learning, and creative economy.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {SOCIAL_LINKS.map(({ href, Icon, label }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" title={label}
                  className="flex h-9 w-9 items-center justify-center rounded border-2 border-white/10 bg-white/[0.02] text-muted-foreground/60 transition-all hover:border-primary/30 hover:text-primary">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="mb-3 text-xs font-black tracking-[0.15em] text-muted-foreground uppercase">Platform</p>
              <ul className="space-y-2">
                {QUICK_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-muted-foreground/70 transition-colors hover:text-primary">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <p className="text-xs font-black tracking-[0.15em] text-muted-foreground uppercase">Contact</p>
              <div className="space-y-2">
                <a href={`mailto:${CONTACT_EMAILS.contact}`} className="flex items-center gap-2 text-sm text-muted-foreground/70 transition-colors hover:text-primary">
                  <MailIcon className="h-4 w-4" />
                  {CONTACT_EMAILS.contact}
                </a>
                <a href={`mailto:${CONTACT_EMAILS.admin}`} className="flex items-center gap-2 text-sm text-muted-foreground/70 transition-colors hover:text-primary">
                  <MailIcon className="h-4 w-4" />
                  {CONTACT_EMAILS.admin}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-white/[0.06] pt-6">
          <div className="flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground/60 sm:flex-row">
            <p>&copy; 2026</p>
            <span className="hidden sm:inline">&middot;</span>
            <Link href="/" className="flex items-center gap-1 font-bold text-primary transition-colors hover:text-accent">
              Soraku
            </Link>
            <span className="hidden sm:inline">&middot;</span>
            <p>All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
