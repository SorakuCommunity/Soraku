import Link from 'next/link'
import Image from 'next/image'
import { SORAKU_SOCIALS } from '@/components/icons/custom-icons'

const FOOTER_LINKS = [
  {
    title: 'Platform',
    links: [
      { label: 'Beranda', href: '/' },
      { label: 'Blog', href: '/blog' },
      { label: 'Events', href: '/events' },
      { label: 'Galeri', href: '/gallery' },
      { label: 'Premium', href: '/premium' },
    ],
  },
  {
    title: 'Komunitas',
    links: [
      { label: 'Tentang', href: '/about' },
      { label: 'Donasi', href: '/donate' },
      { label: 'VTuber', href: '/vtubers' },
    ],
  },
  {
    title: 'Informasi',
    links: [
      { label: 'Privasi', href: '/privacy' },
      { label: 'Ketentuan', href: '/tos' },
      { label: 'Lisensi', href: '/license' },
      { label: 'Masukan', href: '/feedback' },
      { label: 'Rekrutmen', href: '/requirements' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-border/40 mt-20 border-t">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="group mb-5 inline-flex items-center gap-3">
              <div className="border-border/60 h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border bg-[#1a1c20]">
                <Image
                  src="/logo.png"
                  alt="Soraku"
                  width={48}
                  height={48}
                  className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span className="group-hover:text-primary text-xl font-black tracking-tight transition-colors">
                Soraku
              </span>
            </Link>

            <p className="text-muted-foreground/60 mb-5 max-w-xs text-sm leading-relaxed">
              Komunitas non-profit budaya pop Jepang Indonesia. Ruang kreatif untuk pecinta anime,
              manga, VTuber, dan cosplay.
            </p>

            <div className="flex items-center gap-2">
              {SORAKU_SOCIALS.map(({ slug, name, href, icon: Icon }) => (
                <a
                  key={slug}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  title={name}
                  className="border-border/50 bg-card/30 text-muted-foreground/60 hover:border-primary/40 hover:bg-primary/8 hover:text-foreground flex h-9 w-9 items-center justify-center rounded-xl border transition-all"
                >
                  <Icon className="h-[17px] w-[17px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <p className="text-muted-foreground/40 mb-4 text-[11px] font-black tracking-widest uppercase">
                {section.title}
              </p>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground/60 hover:text-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-border/30 text-muted-foreground/35 mt-12 flex flex-col items-start justify-between gap-3 border-t pt-6 text-xs sm:flex-row sm:items-center">
          <p>© 2023 – {new Date().getFullYear()} Soraku Community · Non-profit Indonesia</p>
          <p className="flex items-center gap-1">
            Dibangun dengan <span className="text-rose-400/60">♥</span> untuk komunitas
          </p>
        </div>
      </div>
    </footer>
  )
}
