import Link from "next/link";
import Image from "next/image";
import { SORAKU_SOCIALS } from "@/components/icons/custom-icons";

const FOOTER_LINKS = [
  {
    title: "Platform",
    links: [
      { label: "Beranda",  href: "/" },
      { label: "Blog",     href: "/blog" },
      { label: "Events",   href: "/events" },
      { label: "Galeri",   href: "/gallery" },
      { label: "Premium",  href: "/premium" },
    ],
  },
  {
    title: "Komunitas",
    links: [
      { label: "Tentang",   href: "/about" },
      { label: "Donasi",    href: "/donate" },
      { label: "VTuber",    href: "/vtubers" },
    ],
  },
  {
    title: "Informasi",
    links: [
      { label: "Privasi",   href: "/privacy" },
      { label: "Ketentuan", href: "/tos" },
      { label: "Lisensi",   href: "/license" },
      { label: "Masukan",   href: "/feedback" },
      { label: "Rekrutmen", href: "/requirements" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-5 inline-flex items-center gap-3 group">
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-[#1a1c20] border border-border/60">
                <Image src="/logo.png" alt="Soraku" width={48} height={48}
                  className="h-full w-full object-cover object-top transition-transform group-hover:scale-110 duration-300" />
              </div>
              <span className="text-xl font-black tracking-tight group-hover:text-primary transition-colors">
                Soraku
              </span>
            </Link>

            <p className="mb-5 text-sm leading-relaxed text-muted-foreground/60 max-w-xs">
              Komunitas non-profit budaya pop Jepang Indonesia. Ruang kreatif untuk pecinta anime, manga, VTuber, dan cosplay.
            </p>

            <div className="flex items-center gap-2">
              {SORAKU_SOCIALS.map(({ slug, name, href, icon: Icon }) => (
                <a key={slug} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={name} title={name}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/50 bg-card/30 text-muted-foreground/60 transition-all hover:border-primary/40 hover:bg-primary/8 hover:text-foreground">
                  <Icon className="h-[17px] w-[17px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {FOOTER_LINKS.map(section => (
            <div key={section.title}>
              <p className="mb-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground/40">
                {section.title}
              </p>
              <ul className="space-y-2.5">
                {section.links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href}
                      className="text-sm text-muted-foreground/60 hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border/30 pt-6 text-xs text-muted-foreground/35 sm:flex-row sm:items-center">
          <p>© 2023 – {new Date().getFullYear()} Soraku Community · Non-profit Indonesia</p>
          <p className="flex items-center gap-1">
            Dibangun dengan <span className="text-rose-400/60">♥</span> untuk komunitas
          </p>
        </div>
      </div>
    </footer>
  );
}
