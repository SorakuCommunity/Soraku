import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-[#0f1117] text-[#6E8FA6] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="h-8 w-8 overflow-hidden rounded-lg border border-white/10 bg-[#1a1c20]">
                <Image
                  src="/logo.png"
                  alt="Soraku"
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-lg font-black text-[#D9DDE3] group-hover:text-[#4FA3D1] transition-colors">
                Soraku Stream
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-md">
              Platform streaming anime dan manga dengan berbagai sumber. Tidak
              menyimpan file apa pun, hanya menghubungkan ke layanan pihak
              ketiga.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-[#D9DDE3] mb-4">Navigasi</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/discover"
                  className="hover:text-[#4FA3D1] transition-colors"
                >
                  Discover
                </Link>
              </li>
              <li>
                <Link
                  href="/schedule"
                  className="hover:text-[#4FA3D1] transition-colors"
                >
                  Schedule
                </Link>
              </li>
              <li>
                <Link
                  href="/search/anime"
                  className="hover:text-[#4FA3D1] transition-colors"
                >
                  Anime
                </Link>
              </li>
              <li>
                <Link
                  href="/search/manga"
                  className="hover:text-[#4FA3D1] transition-colors"
                >
                  Manga
                </Link>
              </li>
              <li>
                <Link
                  href="/api-docs"
                  className="hover:text-[#4FA3D1] transition-colors"
                >
                  API Docs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-bold text-[#D9DDE3] mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/dmca"
                  className="hover:text-[#4FA3D1] transition-colors"
                >
                  DMCA
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[#4FA3D1] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/tos"
                  className="hover:text-[#4FA3D1] transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#4FA3D1] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/[0.06] mt-8 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <p>&copy; {year} Soraku Stream. All rights reserved.</p>
            <p className="text-[#4FA3D1]">
              Powered by{" "}
              <a
                href="https://soraku.id"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Soraku Community
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
