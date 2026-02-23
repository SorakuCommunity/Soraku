import Link from "next/link";
import { Zap, Twitter, Youtube, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-dark-base mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl gradient-text">Soraku</span>
            </Link>
            <p className="text-light-base/60 text-sm max-w-xs">
              Platform komunitas VTuber Indonesia. Tempat berkumpul, berbagi, dan mendukung para virtual idol favorit kamu.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://discord.gg/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-light-base/60 hover:text-primary transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-light-base/60 hover:text-primary transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-light-base/60 hover:text-primary transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-light-base mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-light-base/60">
              {[
                { href: "/vtuber", label: "VTuber" },
                { href: "/blog", label: "Blog" },
                { href: "/events", label: "Events" },
                { href: "/gallery", label: "Gallery" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-light-base mb-4">Info</h4>
            <ul className="space-y-2 text-sm text-light-base/60">
              {[
                { href: "/about", label: "Tentang" },
                { href: "/community", label: "Komunitas" },
                { href: "/admin", label: "Admin Panel" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-light-base/40 text-sm">
            © {new Date().getFullYear()} Soraku Community. All rights reserved.
          </p>
          <p className="text-light-base/40 text-sm">
            Made with ❤️ for the VTuber community
          </p>
        </div>
      </div>
    </footer>
  );
}
