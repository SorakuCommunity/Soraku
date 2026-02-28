import Link from "next/link";
import { Github, Twitter, Youtube, MessageSquare } from "lucide-react";

const LINKS = {
  komunitas: [
    { href: "/community", label: "Forum Diskusi" },
    { href: "/vtuber", label: "Vtuber" },
    { href: "/blog", label: "Blog & Artikel" },
    { href: "/events", label: "Events" },
    { href: "/gallery", label: "Gallery" },
  ],
  tentang: [
    { href: "#", label: "Tentang Soraku" },
    { href: "#", label: "Kebijakan Privasi" },
    { href: "#", label: "Syarat & Ketentuan" },
    { href: "#", label: "Hubungi Kami" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 mt-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="font-display text-white text-sm font-bold">S</span>
              </div>
              <span className="font-display text-xl text-white tracking-wider">
                SORA<span className="text-primary">KU</span>
              </span>
            </div>
            <p className="text-secondary text-sm leading-relaxed max-w-xs">
              Komunitas anime, manga, dan kultur digital Jepang terbesar di Indonesia. 
              Tempat para penggemar berkumpul, berdiskusi, dan berkreasi.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="#"
                className="p-2 glass rounded-lg text-secondary hover:text-primary hover:border-primary/40 transition-all border border-white/10"
                aria-label="Discord"
              >
                <MessageSquare size={16} />
              </a>
              <a
                href="#"
                className="p-2 glass rounded-lg text-secondary hover:text-primary hover:border-primary/40 transition-all border border-white/10"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
              <a
                href="#"
                className="p-2 glass rounded-lg text-secondary hover:text-primary hover:border-primary/40 transition-all border border-white/10"
                aria-label="Youtube"
              >
                <Youtube size={16} />
              </a>
              <a
                href="#"
                className="p-2 glass rounded-lg text-secondary hover:text-primary hover:border-primary/40 transition-all border border-white/10"
                aria-label="Github"
              >
                <Github size={16} />
              </a>
            </div>
          </div>

          {/* Komunitas */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 font-display tracking-wider">
              KOMUNITAS
            </h4>
            <ul className="space-y-2.5">
              {LINKS.komunitas.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-secondary text-sm hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tentang */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 font-display tracking-wider">
              TENTANG
            </h4>
            <ul className="space-y-2.5">
              {LINKS.tentang.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-secondary text-sm hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-secondary text-xs">
            © {new Date().getFullYear()} Soraku Community. All rights reserved.
          </p>
          <p className="text-secondary text-xs">
            Made with ❤️ for anime fans in Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
