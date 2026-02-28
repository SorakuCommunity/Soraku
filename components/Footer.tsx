// components/Footer.tsx — SORAKU v1.0.a3.2 — Responsive fix
'use client'
import Link from 'next/link'
import { Github, Twitter, Instagram, MessageCircle } from 'lucide-react'

const links = {
  Platform: [
    { label: 'Beranda',   href: '/' },
    { label: 'Blog',      href: '/blog' },
    { label: 'Gallery',   href: '/gallery' },
    { label: 'Komunitas', href: '/komunitas' },
    { label: 'VTuber',    href: '/Vtuber' },
  ],
  Sosial: [
    { label: 'Discord',   href: 'https://discord.gg/CJJ7KEJMbg', external: true },
    { label: 'Twitter/X', href: 'https://x.com/appSora',          external: true },
    { label: 'Instagram', href: 'https://instagram.com/soraku.moe', external: true },
    { label: 'GitHub',    href: 'https://github.com/SorakuCommunity', external: true },
  ],
}

export function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)' }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Grid: 1 col mobile → 3 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <span className="font-bold text-lg" style={{ color: 'var(--color-primary)' }}>
              Soraku
            </span>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-sub)' }}>
              Platform komunitas Anime, Manga, dan Budaya Digital Jepang.
            </p>
            {/* Social icons — centered on mobile */}
            <div className="flex gap-3 mt-4 justify-center sm:justify-start">
              {[
                { icon: <Github size={16} />,       href: 'https://github.com/SorakuCommunity' },
                { icon: <Twitter size={16} />,      href: 'https://x.com/appSora' },
                { icon: <Instagram size={16} />,    href: 'https://instagram.com/soraku.moe' },
                { icon: <MessageCircle size={16} />,href: 'https://discord.gg/CJJ7KEJMbg' },
              ].map((s, i) => (
                <a
                  key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--text-sub)' }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title} className="text-center sm:text-left">
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>{title}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.label}>
                    {'external' in item && item.external ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer"
                        className="text-sm hover:opacity-80 transition-opacity"
                        style={{ color: 'var(--text-sub)' }}>
                        {item.label}
                      </a>
                    ) : (
                      <Link href={item.href}
                        className="text-sm hover:opacity-80 transition-opacity"
                        style={{ color: 'var(--text-sub)' }}>
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t text-sm text-center" style={{ borderColor: 'var(--border)', color: 'var(--text-sub)' }}>
          © {new Date().getFullYear()} Soraku Community. All rights reserved. · v1.0.a3.3
        </div>
      </div>
    </footer>
  )
}
