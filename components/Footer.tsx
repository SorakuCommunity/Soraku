import Link from 'next/link'
import { Sparkles, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-soraku-border bg-soraku-card/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-soraku-gradient flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-xl grad-text">Soraku</span>
            </Link>
            <p className="text-soraku-sub text-sm leading-relaxed max-w-xs">
              Platform komunitas untuk penggemar Anime, Manga, dan Budaya Digital Jepang.
            </p>
            <p className="text-soraku-sub/50 text-xs mt-3">Version 1.0.a3</p>
          </div>
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-soraku-sub mb-4">Navigasi</h4>
            <ul className="space-y-2">
              {[['/', 'Beranda'], ['/komunitas', 'Komunitas'], ['/Anime', 'Anime'], ['/gallery', 'Gallery']].map(([href, label]) => (
                <li key={href}><Link href={href} className="text-soraku-sub hover:text-soraku-primary transition-colors text-sm">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-soraku-sub mb-4">Info</h4>
            <ul className="space-y-2">
              {[['/Blog', 'Blog'], ['/Tentang', 'Tentang Kami'], ['/gallery/upload', 'Upload Karya'], ['/login', 'Login']].map(([href, label]) => (
                <li key={href}><Link href={href} className="text-soraku-sub hover:text-soraku-primary transition-colors text-sm">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-soraku-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-soraku-sub text-xs">
            © {new Date().getFullYear()} Soraku. Dibuat dengan <Heart className="inline w-3 h-3 text-pink-500" /> untuk komunitas.
          </p>
          <p className="text-soraku-sub text-xs">Next.js 15 · Supabase · Vercel</p>
        </div>
      </div>
    </footer>
  )
}
