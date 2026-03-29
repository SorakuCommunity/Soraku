import Link from 'next/link'
import Image from 'next/image'
import { DiscordIcon, InstagramIcon, FacebookIcon, TikTokIcon } from '@/components/icons/custom-icons'

// ─── Config ─────────────────────────────────────────────────────────────────

const MOBILE_SOCIALS = [
  { href:"https://discord.gg/qm3XJvRa6B",               Icon:DiscordIcon,   label:"Discord"   },
  { href:"https://www.tiktok.com/@soraku.id",            Icon:TikTokIcon,    label:"TikTok"    },
  { href:"https://www.instagram.com/soraku.moe",         Icon:InstagramIcon, label:"Instagram" },
  { href:"https://www.facebook.com/share/1HQs9ZZeCw/",   Icon:FacebookIcon,  label:"Facebook"  },
]

const COL_KOMUNITAS = [
  { label:"Beranda",  href:"/"        },
  { label:"Blog",     href:"/blog"    },
  { label:"Events",   href:"/events"  },
  { label:"Galeri",   href:"/gallery" },
  { label:"VTuber",   href:"/vtubers" },
  { label:"Tentang",  href:"/about"   },
  { label:"Donasi",   href:"/donate"  },
]

const COL_INFORMASI = [
  { label:"Privasi",   href:"/privacy"      },
  { label:"Ketentuan", href:"/tos"          },
  { label:"Lisensi",   href:"/license"      },
  { label:"Masukan",   href:"/feedback"     },
  { label:"Rekrutmen", href:"/requirements" },
  { label:"Premium",   href:"/premium"      },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] mt-16 sm:mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* ── DESKTOP layout: brand col + 2 link cols ── */}
        <div className="hidden sm:grid sm:grid-cols-4 lg:grid-cols-4 gap-10">
          {/* Brand — 2 cols on sm */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="group inline-flex items-center gap-3 mb-5">
              <div className="h-10 w-10 overflow-hidden rounded-xl border border-white/10 bg-[#1a1c20] flex-shrink-0">
                <Image src="/logo.png" alt="Soraku" width={40} height={40}
                  className="h-full w-full object-cover object-top transition-transform group-hover:scale-110 duration-300"/>
              </div>
              <div>
                <p className="text-base font-black group-hover:text-primary transition-colors">Soraku</p>
                <p className="text-[10px] text-white/30">Community · Est. 2023</p>
              </div>
            </Link>
            <p className="text-sm text-white/35 leading-relaxed max-w-xs mb-6">
              Komunitas non-profit budaya pop Jepang Indonesia. Ruang kreatif untuk pecinta anime, manga, VTuber, dan cosplay.
            </p>
            <div className="flex items-center gap-2">
              {MOBILE_SOCIALS.map(({href,Icon,label})=>(
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" title={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/35 hover:border-primary/35 hover:bg-primary/8 hover:text-white/70 transition-all">
                  <Icon className="h-4 w-4"/>
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Komunitas</p>
            <ul className="space-y-2.5">
              {COL_KOMUNITAS.map(l=>(
                <li key={l.href}><Link href={l.href} className="text-sm text-white/35 hover:text-white/70 transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Informasi</p>
            <ul className="space-y-2.5">
              {COL_INFORMASI.map(l=>(
                <li key={l.href}><Link href={l.href} className="text-sm text-white/35 hover:text-white/70 transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── MOBILE layout: brand on top, then 2 cols ── */}
        <div className="sm:hidden space-y-6">
          {/* 2 col link grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-0">
            <div>
              <p className="mb-3 text-[9px] font-black uppercase tracking-[0.2em] text-white/25">Komunitas</p>
              <ul className="space-y-2.5">
                {COL_KOMUNITAS.map(l=>(
                  <li key={l.href}><Link href={l.href} className="text-sm text-white/40 hover:text-white/70 transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 text-[9px] font-black uppercase tracking-[0.2em] text-white/25">Informasi</p>
              <ul className="space-y-2.5">
                {COL_INFORMASI.map(l=>(
                  <li key={l.href}><Link href={l.href} className="text-sm text-white/40 hover:text-white/70 transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          {/* Brand row — di bawah kolom (sesuai gambar) */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 overflow-hidden rounded-lg border border-white/10 bg-[#1a1c20] flex-shrink-0">
                <Image src="/logo.png" alt="Soraku" width={36} height={36} className="h-full w-full object-cover object-top"/>
              </div>
              <span className="text-sm font-black">Soraku Community</span>
            </Link>
            <div className="flex items-center gap-2">
              {MOBILE_SOCIALS.map(({href,Icon,label})=>(
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" title={label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-white/30 hover:text-white/60 transition-colors">
                  <Icon className="h-4 w-4"/>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.06] mt-8 pt-6 space-y-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-xs text-white/20">
            <p>© 2023–{new Date().getFullYear()} Soraku Community</p>
            <p className="flex items-center gap-1">Dibangun dengan ♥ untuk komunitas</p>
          </div>
          <p className="text-[10px] text-white/12 leading-relaxed">
            Dilindungi oleh{" "}
            <Link href="/license" className="underline underline-offset-2 hover:text-white/25 transition-colors">
              Soraku Community Source License v1.0
            </Link>{" "}
            · Hak Cipta (c) 2023–{new Date().getFullYear()} · Riu (Koordinator) ·{" "}
            <a href="mailto:echo.soraku@gmail.com" className="underline underline-offset-2 hover:text-white/25 transition-colors">
              echo.soraku@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
