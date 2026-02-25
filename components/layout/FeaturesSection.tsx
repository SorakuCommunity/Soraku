import Link from "next/link";
import { MessageSquare, BookOpen, Palette, Star, Calendar, Image as ImageIcon } from "lucide-react";

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Diskusi Komunitas",
    desc: "Forum diskusi aktif tentang anime, manga, dan budaya Jepang.",
    href: "/community",
    color: "from-blue-500/20 to-primary/10",
    iconColor: "text-blue-400",
  },
  {
    icon: Star,
    title: "Vtuber Content",
    desc: "Follow dan support Vtuber favorit dari generasi berbeda.",
    href: "/vtuber",
    color: "from-purple-500/20 to-pink-500/10",
    iconColor: "text-purple-400",
  },
  {
    icon: BookOpen,
    title: "Blog & Review",
    desc: "Artikel mendalam, review anime & manga dari komunitas.",
    href: "/blog",
    color: "from-primary/20 to-secondary/10",
    iconColor: "text-primary",
  },
  {
    icon: Calendar,
    title: "Events",
    desc: "Event online & offline yang bisa kamu ikuti bersama komunitas.",
    href: "/events",
    color: "from-accent/20 to-yellow-500/10",
    iconColor: "text-accent",
  },
  {
    icon: Palette,
    title: "Fan Art",
    desc: "Showcase karya seni fan art dari para seniman komunitas.",
    href: "/community?tab=fanart",
    color: "from-pink-500/20 to-red-500/10",
    iconColor: "text-pink-400",
  },
  {
    icon: ImageIcon,
    title: "Gallery",
    desc: "Koleksi foto dan karya visual dari seluruh anggota.",
    href: "/gallery",
    color: "from-green-500/20 to-emerald-500/10",
    iconColor: "text-emerald-400",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/30 text-xs text-primary font-semibold mb-4">
            Fitur Unggulan
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-white mb-4">
            Semua Yang Kamu{" "}
            <span className="gradient-text">Butuhkan</span>
          </h2>
          <p className="text-secondary max-w-xl mx-auto">
            Platform lengkap untuk para penggemar anime dan manga. Dari diskusi hingga fan art, semua ada di Soraku.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc, href, color, iconColor }) => (
            <Link key={title} href={href}>
              <div className="glass-card p-6 h-full group cursor-pointer">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={22} className={iconColor} />
                </div>

                <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {title}
                </h3>
                <p className="text-secondary text-sm leading-relaxed">{desc}</p>

                {/* Arrow indicator */}
                <div className="mt-4 flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Jelajahi
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
