import Link from 'next/link'
import Image from 'next/image'
import { DiscordIcon, InstagramIcon, FacebookIcon, TikTokIcon, XIcon, YouTubeIcon } from '@/components/icons/custom-icons'

// ─── Config ─────────────────────────────────────────────────────────────────

// Primary Color: #4FA3D1 (cyan biru mata)
// Dark Base: #1C1E22
// Secondary: #6E8FA6
// Light Base: #D9DDE3
// Accent: #E8C2A8

const SOCIAL_LINKS = [
  { href: "https://discord.gg/qm3XJvRa6B", Icon: DiscordIcon, label: "Discord", color: "hover:bg-[#5865F2]/20 hover:border-[#5865F2]/50 hover:text-[#5865F2]" },
  { href: "https://www.tiktok.com/@soraku.id?_r=1&_t=ZS-93VKUIkzmTM", Icon: TikTokIcon, label: "TikTok", color: "hover:bg-white/10 hover:border-white/30 hover:text-white" },
  { href: "https://www.facebook.com/share/1HQs9ZZeCw/", Icon: FacebookIcon, label: "Facebook", color: "hover:bg-[#1877F2]/20 hover:border-[#1877F2]/50 hover:text-[#1877F2]" },
  { href: "https://www.instagram.com/soraku.moe?igsh=MWxpcmNmd2tqZWE3MQ==", Icon: InstagramIcon, label: "Instagram", color: "hover:bg-gradient-to-br hover:from-[#833AB4]/20 hover:via-[#E1306C]/20 hover:to-[#F77737]/20 hover:border-[#E1306C]/50 hover:text-[#E1306C]" },
  { href: "https://twitter.com/@AppSoraa", Icon: XIcon, label: "X", color: "hover:bg-white/10 hover:border-white/30 hover:text-white" },
  { href: "https://youtube.com/@chsoraku?si=kcOs8wWCi7TwwC3P", Icon: YouTubeIcon, label: "YouTube", color: "hover:bg-[#FF0000]/20 hover:border-[#FF0000]/50 hover:text-[#FF0000]" },
]

const GROUP_LINKS = [
  { label: "Facebook Group", href: "https://www.facebook.com/groups/2080754095772347/?ref=share&mibextid=NSMWBT" },
  { label: "WhatsApp Channel", href: "https://whatsapp.com/channel/0029VbBNBA29MF93HdPSMu3E" },
  { label: "LinkedIn", href: "#" },
]

const QUICK_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Events", href: "/events" },
  { label: "Galeri", href: "/gallery" },
  { label: "VTuber", href: "/vtubers" },
]

const INFO_LINKS = [
  { label: "Tentang", href: "/about" },
  { label: "Kontak", href: "/contact" },
  { label: "Feedback", href: "/feedback" },
  { label: "Rekrutmen", href: "/requirements" },
  { label: "Privasi", href: "/privacy" },
  { label: "Ketentuan", href: "/tos" },
  { label: "Lisensi", href: "/license" },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#1C1E22]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        
        {/* ── DESKTOP & TABLET Layout ── */}
        <div className="hidden sm:grid sm:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Column - 5 cols */}
          <div className="sm:col-span-5 lg:col-span-5">
            <div className="mb-4">
              <p className="text-xs text-[#6E8FA6] mb-2">Made with tea by</p>
              <Link href="/" className="group inline-flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-[#1a1c20] flex-shrink-0">
                  <Image src="/logo.png" alt="Soraku" width={48} height={48}
                    className="h-full w-full object-cover object-top transition-transform group-hover:scale-110 duration-300"/>
                </div>
                <span className="text-xl font-black text-[#D9DDE3] group-hover:text-[#4FA3D1] transition-colors">Soraku</span>
              </Link>
            </div>
            <p className="text-sm text-[#6E8FA6] leading-relaxed max-w-sm mb-6">
              Soraku adalah komunitas non-profit budaya pop Jepang di Indonesia yang menyajikan berita, artikel, dan ruang kreatif bagi komunitas anime, manga, game, culture jepang, vtuber dan cosplayer.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({href, Icon, label, color})=> (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" title={label}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/40 transition-all ${color}`}>
                  <Icon className="h-5 w-5"/>
                </a>
              ))}
            </div>
          </div>

          {/* Product Column */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D9DDE3]">Product</p>
              <span className="text-[#6E8FA6]">····</span>
            </div>
            <ul className="space-y-3">
              {QUICK_LINKS.map(l=> (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[#6E8FA6] hover:text-[#4FA3D1] transition-colors flex items-center gap-2">
                    <span className="text-[#6E8FA6]/50">−</span> {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D9DDE3]">Resources</p>
              <span className="text-[#6E8FA6]">····</span>
            </div>
            <ul className="space-y-3">
              {INFO_LINKS.map(l=> (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[#6E8FA6] hover:text-[#4FA3D1] transition-colors flex items-center gap-2">
                    <span className="text-[#6E8FA6]/50">−</span> {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div className="sm:col-span-3 lg:col-span-3">
            <div className="flex items-center gap-2 mb-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D9DDE3]">Community</p>
              <span className="text-[#6E8FA6]">····</span>
            </div>
            <ul className="space-y-3">
              {GROUP_LINKS.map(l=> (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" 
                    className="text-sm text-[#6E8FA6] hover:text-[#4FA3D1] transition-colors flex items-center gap-2">
                    <span className="text-[#6E8FA6]/50">−</span> {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── MOBILE Layout ── */}
        <div className="sm:hidden space-y-8">
          {/* Brand */}
          <div>
            <p className="text-xs text-[#6E8FA6] mb-2">Made with tea by</p>
            <Link href="/" className="group inline-flex items-center gap-3 mb-4">
              <div className="h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-[#1a1c20] flex-shrink-0">
                <Image src="/logo.png" alt="Soraku" width={48} height={48}
                  className="h-full w-full object-cover object-top"/>
              </div>
              <span className="text-xl font-black text-[#D9DDE3]">Soraku</span>
            </Link>
            <p className="text-sm text-[#6E8FA6] leading-relaxed mb-4">
              Soraku adalah komunitas non-profit budaya pop Jepang di Indonesia yang menyajikan berita, artikel, dan ruang kreatif bagi komunitas anime, manga, game, culture jepang, vtuber dan cosplayer.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({href, Icon, label, color})=> (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" title={label}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/40 transition-all ${color}`}>
                  <Icon className="h-5 w-5"/>
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Product */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-[#D9DDE3]">Product</p>
                <span className="text-[#6E8FA6]">····</span>
              </div>
              <ul className="space-y-2">
                {QUICK_LINKS.map(l=> (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-[#6E8FA6] hover:text-[#4FA3D1] transition-colors flex items-center gap-2">
                      <span className="text-[#6E8FA6]/50">−</span> {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-[#D9DDE3]">Resources</p>
                <span className="text-[#6E8FA6]">····</span>
              </div>
              <ul className="space-y-2">
                {INFO_LINKS.map(l=> (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-[#6E8FA6] hover:text-[#4FA3D1] transition-colors flex items-center gap-2">
                      <span className="text-[#6E8FA6]/50">−</span> {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.06] mt-8 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-[#6E8FA6]/60">
            <p>© 2026</p>
            <span className="hidden sm:inline">·</span>
            <Link href="/" className="text-[#4FA3D1] hover:text-[#E8C2A8] transition-colors font-semibold flex items-center gap-1">
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
