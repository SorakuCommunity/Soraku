// components/Footer.tsx — SORAKU v1.0.a3.5
// Footer: Glass panel + Logo + Quick Links + Social icons
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Twitter, Instagram, Youtube, Globe } from 'lucide-react'

const QUICK_LINKS = [
  { label: 'Beranda',   href: '/' },
  { label: 'Blog',      href: '/blog' },
  { label: 'Events',    href: '/events' },
  { label: 'Komunitas', href: '/komunitas' },
  { label: 'Gallery',   href: '/gallery' },
  { label: 'VTuber',   href: '/Vtuber' },
]

const SOCIALS = [
  {
    label: 'Discord',
    href: 'https://discord.gg/CJJ7KEJMbg',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028z"/>
      </svg>
    ),
    color: '#5865F2',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/soraku.moe',
    icon: <Instagram size={18} />,
    color: '#E1306C',
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@soraku',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z"/>
      </svg>
    ),
    color: '#69C9D0',
  },
  {
    label: 'Twitter',
    href: 'https://x.com/appSora',
    icon: <Twitter size={18} />,
    color: '#1DA1F2',
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@SorakuCommunity',
    icon: <Youtube size={18} />,
    color: '#FF0000',
  },
  {
    label: 'Website',
    href: 'https://soraku.vercel.app',
    icon: <Globe size={18} />,
    color: '#4FA3D1',
  },
]

export function Footer() {
  return (
    <footer className="mt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
      {/* Glass top panel */}
      <div
        style={{
          background:     'rgba(255,255,255,0.025)',
          backdropFilter: 'blur(20px)',
          borderBottom:   '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">

            {/* Left: Logo + Description + Socials */}
            <div>
              <motion.div
                className="mb-3"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <span className="font-black text-xl" style={{ color: 'var(--color-primary)' }}>
                  Soraku
                </span>
                <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded font-medium align-middle"
                  style={{ backgroundColor: 'rgba(79,163,209,0.12)', color: 'var(--color-primary)' }}>
                  v1.0.a3.5
                </span>
              </motion.div>
              <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-sub)' }}>
                Platform komunitas Anime, Manga, dan Budaya Digital Jepang untuk para penggemar Indonesia.
              </p>

              {/* Social Icon Row */}
              <div className="flex flex-wrap gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="p-2.5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent min-h-[40px] min-w-[40px] flex items-center justify-center"
                    style={{
                      borderColor: 'rgba(255,255,255,0.08)',
                      color:       'var(--text-sub)',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                    }}
                    onMouseEnter={e => {
                      ;(e.currentTarget as HTMLElement).style.color = s.color
                      ;(e.currentTarget as HTMLElement).style.backgroundColor = `${s.color}18`
                    }}
                    onMouseLeave={e => {
                      ;(e.currentTarget as HTMLElement).style.color = 'var(--text-sub)'
                      ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.04)'
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Middle: Quick Links */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-sub)', opacity: 0.6 }}>
                Quick Links
              </h4>
              <ul className="space-y-2.5">
                {QUICK_LINKS.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:opacity-80"
                      style={{ color: 'var(--text-sub)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Community Info */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-sub)', opacity: 0.6 }}>
                Komunitas
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 p-3 rounded-xl"
                  style={{ backgroundColor: 'rgba(88,101,242,0.08)', borderColor: 'rgba(88,101,242,0.15)', border: '1px solid' }}>
                  <div style={{ color: '#5865F2', flexShrink: 0, marginTop: 2 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>Discord Soraku</p>
                    <a href="https://discord.gg/CJJ7KEJMbg" target="_blank" rel="noopener noreferrer"
                      className="text-xs hover:opacity-70 transition-opacity"
                      style={{ color: '#5865F2' }}>
                      discord.gg/CJJ7KEJMbg
                    </a>
                  </div>
                </div>

                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-sub)', opacity: 0.6 }}>
                  Bergabung dan temukan teman sesama penggemar Anime & Manga Indonesia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <p className="text-center text-xs" style={{ color: 'var(--text-sub)', opacity: 0.4 }}>
          © {new Date().getFullYear()} Soraku Community. All rights reserved. · Platform Anime & Manga Indonesia.
        </p>
      </div>
    </footer>
  )
}
