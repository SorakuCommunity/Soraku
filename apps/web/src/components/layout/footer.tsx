import Link from 'next/link'
import Image from 'next/image'
import { Mail } from 'lucide-react'
import {
  DiscordIcon,
  GitHubIcon,
  XIcon,
  LinkedInIcon,
  InstagramIcon,
  YouTubeIcon,
} from '@/components/icons/custom-icons'

const SOCIAL_LINKS = [
  { href: 'https://discord.gg/qm3XJvRa6B', Icon: DiscordIcon, label: 'Discord' },
  { href: 'https://github.com/soraku', Icon: GitHubIcon, label: 'GitHub' },
  { href: 'https://twitter.com/@AppSora', Icon: XIcon, label: 'X' },
  { href: 'https://linkedin.com/company/soraku', Icon: LinkedInIcon, label: 'LinkedIn' },
  { href: 'https://www.instagram.com/soraku.moe', Icon: InstagramIcon, label: 'Instagram' },
  { href: 'https://youtube.com/@soraku', Icon: YouTubeIcon, label: 'YouTube' },
]

const ECOSYSTEM_LINKS = [
  { label: 'Soraku Studio', tagline: 'Creative Agency', href: '#' },
  { label: 'Rynex', tagline: 'Enterprise Solutions', href: '#' },
  { label: 'Soraku Community', tagline: 'Community Platform', href: '#' },
]

const COMPANY_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'News', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

const RESOURCE_LINKS = [
  { label: 'Documentation', href: '/docs' },
  { label: 'Downloads', href: '/docs/resources' },
  { label: 'Brand Assets', href: '/docs/brand' },
  { label: 'Media Kit', href: '/docs/resources' },
  { label: 'Status', href: '#' },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/tos' },
  { label: 'License', href: '/license' },
  { label: 'Security', href: '/security' },
  { label: 'Cookie Policy', href: '/cookie' },
]

const BOTTOM_LEGAL = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms', href: '/tos' },
  { label: 'License', href: '/license' },
  { label: 'Status', href: '#' },
]

const CONTACT_EMAILS = {
  contact: 'contact@soraku.id',
  admin: 'admin@soraku.id',
}

export function Footer() {
  return (
    <footer className="dark border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_50%_0%,rgba(59,130,246,0.04)_0%,transparent_70%)]">
        {/* Desktop: 4-column */}
        <div className="hidden gap-12 lg:grid lg:grid-cols-12">
          {/* Col 1 — Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="group mb-4 inline-flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded border border-border">
                <Image
                  src="/assets/brand/logo.png"
                  alt="Soraku"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div>
                <span className="text-base font-bold text-foreground">Soraku</span>
                <p className="text-[11px] text-muted-foreground/60">Technology Ecosystem</p>
              </div>
            </Link>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-muted-foreground/70">
              Building meaningful technology through creativity, engineering, and community.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {SOCIAL_LINKS.map(({ href, Icon, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  className="flex h-8 w-8 items-center justify-center rounded border border-border text-muted-foreground/50 transition-colors hover:border-primary/30 hover:text-primary"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
            <div className="mt-6 space-y-2">
              <a
                href="mailto:contact@soraku.id"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground/70 transition-colors hover:text-primary"
              >
                <Mail className="h-3.5 w-3.5" />
                contact@soraku.id
              </a>
              <br />
              <a
                href="mailto:admin@soraku.id"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground/70 transition-colors hover:text-primary"
              >
                <Mail className="h-3.5 w-3.5" />
                admin@soraku.id
              </a>
            </div>
          </div>

          {/* Col 2 — Ecosystem */}
          <div className="lg:col-span-2">
            <p className="mb-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Ecosystem
            </p>
            <ul className="space-y-4">
              {ECOSYSTEM_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="group block text-sm transition-colors hover:text-primary">
                    <span className="font-medium text-foreground">{l.label}</span>
                    <span className="block text-xs text-muted-foreground/50">{l.tagline}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Company */}
          <div className="lg:col-span-2">
            <p className="mb-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Company
            </p>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground/70 transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Resources */}
          <div className="lg:col-span-2">
            <p className="mb-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Resources
            </p>
            <ul className="space-y-3">
              {RESOURCE_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground/70 transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tablet: 2-column */}
        <div className="hidden sm:grid sm:grid-cols-2 sm:gap-10 lg:hidden">
          <div>
            <Link href="/" className="group mb-4 inline-flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded border border-border">
                <Image
                  src="/assets/brand/logo.png"
                  alt="Soraku"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div>
                <span className="text-base font-bold text-foreground">Soraku</span>
                <p className="text-[11px] text-muted-foreground/60">Technology Ecosystem</p>
              </div>
            </Link>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-muted-foreground/70">
              Building meaningful technology through creativity, engineering, and community.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {SOCIAL_LINKS.map(({ href, Icon, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  className="flex h-8 w-8 items-center justify-center rounded border border-border text-muted-foreground/50 transition-colors hover:border-primary/30 hover:text-primary"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
            <div className="mt-6 space-y-2">
              <a
                href="mailto:contact@soraku.id"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground/70 transition-colors hover:text-primary"
              >
                <Mail className="h-3.5 w-3.5" />
                contact@soraku.id
              </a>
              <br />
              <a
                href="mailto:admin@soraku.id"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground/70 transition-colors hover:text-primary"
              >
                <Mail className="h-3.5 w-3.5" />
                admin@soraku.id
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="mb-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">Ecosystem</p>
              <ul className="space-y-4">
                {ECOSYSTEM_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="group block text-sm transition-colors hover:text-primary">
                      <span className="font-medium text-foreground">{l.label}</span>
                      <span className="block text-xs text-muted-foreground/50">{l.tagline}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">Company</p>
              <ul className="space-y-3">
                {COMPANY_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-muted-foreground/70 transition-colors hover:text-primary">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">Resources</p>
              <ul className="space-y-3">
                {RESOURCE_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-muted-foreground/70 transition-colors hover:text-primary">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile: single-column */}
        <div className="space-y-10 sm:hidden">
          <div>
            <Link href="/" className="group mb-4 inline-flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded border border-border">
                <Image
                  src="/assets/brand/logo.png"
                  alt="Soraku"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div>
                <span className="text-base font-bold text-foreground">Soraku</span>
                <p className="text-[11px] text-muted-foreground/60">Technology Ecosystem</p>
              </div>
            </Link>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-muted-foreground/70">
              Building meaningful technology through creativity, engineering, and community.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {SOCIAL_LINKS.map(({ href, Icon, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  className="flex h-8 w-8 items-center justify-center rounded border border-border text-muted-foreground/50 transition-colors hover:border-primary/30 hover:text-primary"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
            <div className="mt-6 space-y-2">
              <a
                href="mailto:contact@soraku.id"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground/70 transition-colors hover:text-primary"
              >
                <Mail className="h-3.5 w-3.5" />
                contact@soraku.id
              </a>
              <br />
              <a
                href="mailto:admin@soraku.id"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground/70 transition-colors hover:text-primary"
              >
                <Mail className="h-3.5 w-3.5" />
                admin@soraku.id
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="mb-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">Ecosystem</p>
              <ul className="space-y-4">
                {ECOSYSTEM_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="group block text-sm transition-colors hover:text-primary">
                      <span className="font-medium text-foreground">{l.label}</span>
                      <span className="block text-xs text-muted-foreground/50">{l.tagline}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">Company</p>
              <ul className="space-y-3">
                {COMPANY_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-muted-foreground/70 transition-colors hover:text-primary">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">Resources</p>
              <ul className="space-y-3">
                {RESOURCE_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-muted-foreground/70 transition-colors hover:text-primary">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">Legal</p>
              <ul className="space-y-3">
                {LEGAL_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-muted-foreground/70 transition-colors hover:text-primary">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-2 border-t border-border pt-6">
            <a
              href={`mailto:${CONTACT_EMAILS.contact}`}
              className="flex items-center gap-2 text-sm text-muted-foreground/70 transition-colors hover:text-primary"
            >
              <Mail className="h-3.5 w-3.5" />
              {CONTACT_EMAILS.contact}
            </a>
            <a
              href={`mailto:${CONTACT_EMAILS.admin}`}
              className="flex items-center gap-2 text-sm text-muted-foreground/70 transition-colors hover:text-primary"
            >
              <Mail className="h-3.5 w-3.5" />
              {CONTACT_EMAILS.admin}
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground/60 sm:flex-row">
          <div className="text-center sm:text-left">
            <p>&copy; 2026 Soraku. Technology Ecosystem.</p>
            <p className="mt-0.5">Made with care for creators, developers, and innovators.</p>
          </div>
          <div className="flex items-center gap-4">
            {BOTTOM_LEGAL.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="transition-colors hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
