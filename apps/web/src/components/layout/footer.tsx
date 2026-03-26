import Link from 'next/link'
import Image from 'next/image'
import { SORAKU_SOCIALS } from '@/components/icons/custom-icons'

// 2 kolom di mobile: Komunitas | Informasi
const FOOTER_COLS = [
  {
    title: 'Komunitas',
    links: [
      { label: 'Beranda',   href: '/'            },
      { label: 'Blog',      href: '/blog'         },
      { label: 'Events',    href: '/events'       },
      { label: 'Galeri',    href: '/gallery'      },
      { label: 'VTuber',    href: '/vtubers'      },
      { label: 'Tentang',   href: '/about'        },
      { label: 'Donasi',    href: '/donate'       },
    ],
  },
  {
    title: 'Informasi',
    links: [
      { label: 'Privasi',   href: '/privacy'      },
      { label: 'Ketentuan', href: '/tos'          },
      { label: 'Lisensi',   href: '/license'      },
      { label: 'Masukan',   href: '/feedback'     },
      { label: 'Rekrutmen', href: '/requirements' },
      { label: 'Premium',   href: '/premium'      },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border/30 mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Top — Brand + 2 kolom links */}
        <div className="grid grid-cols-3 gap-8 sm:grid-cols-4 lg:grid-cols-4">
          {/* Brand — hidden on mobile, 1 col on sm+ */}
          <div className="hidden sm:block sm:col-span-2 lg:col-span-2">
            <Link href="/" className="group mb-5 inline-flex items-center gap-3">
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl border border-border/60 bg-[#1a1c20]">
                <Image src="/logo.png" alt="Soraku" width={40} height={40}
                  className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-110"/>
              </div>
              <span className="text-lg font-black tracking-tight group-hover:text-primary transition-colors">Soraku</span>
            </Link>
            <p className="text-muted-foreground/55 mb-5 max-w-xs text-sm leading-relaxed">
              Komunitas non-profit budaya pop Jepang Indonesia. Ruang kreatif untuk pecinta anime, manga, VTuber, dan cosplay.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {SORAKU_SOCIALS.map(({ slug, name, href, icon: Icon }) => (
                <a key={slug} href={href} target="_blank" rel="noopener noreferrer" aria-label={name} title={name}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/45 bg-card/25 text-muted-foreground/55 hover:border-primary/35 hover:bg-primary/8 hover:text-foreground transition-all">
                  <Icon className="h-[15px] w-[15px]"/>
                </a>
              ))}
            </div>
          </div>

          {/* 2 kolom links — grid-cols-2 di mobile */}
          {FOOTER_COLS.map(col=>(
            <div key={col.title}>
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map(link=>(
                  <li key={link.href}>
                    <Link href={link.href}
                      className="text-sm text-muted-foreground/55 hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile brand row */}
        <div className="mt-8 flex items-center gap-3 sm:hidden border-t border-border/25 pt-6">
          <div className="h-8 w-8 overflow-hidden rounded-lg border border-border/60 bg-[#1a1c20] flex-shrink-0">
            <Image src="/logo.png" alt="Soraku" width={32} height={32} className="h-full w-full object-cover object-top"/>
          </div>
          <span className="font-black text-sm">Soraku Community</span>
          <div className="ml-auto flex items-center gap-1.5">
            {SORAKU_SOCIALS.slice(0,4).map(({ slug, name, href, icon: Icon }) => (
              <a key={slug} href={href} target="_blank" rel="noopener noreferrer" aria-label={name}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/40 text-muted-foreground/45 hover:text-foreground transition-colors">
                <Icon className="h-3.5 w-3.5"/>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/25 mt-8 pt-6 space-y-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-muted-foreground/30">
            <p>© 2023 – {new Date().getFullYear()} Soraku Community</p>
            <p className="flex items-center gap-1">
              Dibangun dengan <span className="text-rose-400/55">♥</span> untuk komunitas
            </p>
          </div>
          <p className="text-[10px] text-muted-foreground/18 leading-relaxed">
            Dilindungi oleh{" "}
            <Link href="/license" className="underline underline-offset-2 hover:text-muted-foreground/35 transition-colors">
              Soraku Community Source License v1.0
            </Link>{" "}
            · Hak Cipta (c) 2023–{new Date().getFullYear()} Soraku Community · Riu (Koordinator) ·{" "}
            <a href="mailto:echo.soraku@gmail.com" className="underline underline-offset-2 hover:text-muted-foreground/35 transition-colors">
              echo.soraku@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
