import Link from "next/link";
import { useState, useEffect } from "react";
import { GithubIcon, DiscordIcon, KofiIcon } from '@/components/shared/icons';

function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-primary text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo and Description */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white mb-4 transition-all duration-300 hover:text-purple-400">1Anime</h2>
            <p className="text-sm leading-relaxed">
              This site does not store any files on our server. We only link
              to media hosted on 3rd party services.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-8">
            <QuickLinks
              title="Explore"
              links={[
                { href: "/search/anime", label: "Popular Anime" },
                { href: "/search/manga", label: "Popular Manga" },
                { href: "/donate", label: "Donate" },
              ]}
            />
            <QuickLinks
              title="More"
              links={[
                { href: "/search/anime?format=MOVIE", label: "Movies" },
                { href: "/search/anime?format=TV", label: "TV Shows" },
                { href: "/dmca", label: "DMCA" },
              ]}
            />
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-end space-y-6">
            <div className="flex space-x-6">
              <SocialIcon href="/github" icon={GithubIcon} />
              <SocialIcon href="/discord" icon={DiscordIcon} />
              <SocialIcon href="/donate" icon={KofiIcon} />
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-secondary bg-opacity-50 py-4">
        <div className="container mx-auto px-4 text-sm text-center">
          &copy; {year} 1Anime.co | All Rights Reserved
          <span className="font-bold"> 1Anime Limited Inc.</span>
        </div>
      </div>
    </footer>
  );
}

function QuickLinks({ title, links }: { title: string, links: { href: string, label: string }[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <Link href={link.href} className="hover:text-white transition-colors duration-200">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ href, icon: Icon }: { href: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }) {
  return (
    <Link href={href} className="text-gray-400 hover:text-white transition-colors duration-200">
      <Icon className="w-6 h-6" />
    </Link>
  );
}

export default Footer;
