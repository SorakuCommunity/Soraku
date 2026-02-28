import type { Metadata } from "next";
import { MessageSquare, Palette, Star, BookOpen } from "lucide-react";
import DiscordSection from "@/components/community/DiscordSection";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Komunitas",
  description: "Forum diskusi dan komunitas anime, manga, dan kultur digital Jepang.",
};

const CATEGORIES = [
  {
    icon: MessageSquare,
    label: "Diskusi Anime",
    count: "2.4K",
    desc: "Bahas episode terbaru, karakter favorit, dan teori anime.",
    href: "/community?tab=anime",
    color: "from-blue-500/20 to-primary/10",
    iconColor: "text-blue-400",
  },
  {
    icon: BookOpen,
    label: "Diskusi Manga",
    count: "1.8K",
    desc: "Review manga, spoiler discussion, dan rekomendasi terbaik.",
    href: "/community?tab=manga",
    color: "from-primary/20 to-secondary/10",
    iconColor: "text-primary",
  },
  {
    icon: Palette,
    label: "Fan Art",
    count: "3.2K",
    desc: "Showcase dan apresiasi karya seni para seniman komunitas.",
    href: "/community?tab=fanart",
    color: "from-pink-500/20 to-red-500/10",
    iconColor: "text-pink-400",
  },
  {
    icon: Star,
    label: "Review",
    count: "950",
    desc: "Review mendalam anime dan manga dari perspektif komunitas.",
    href: "/community?tab=review",
    color: "from-accent/20 to-yellow-500/10",
    iconColor: "text-accent",
  },
];

const STATS = [
  { label: "Total Member", value: "10,482" },
  { label: "Diskusi Aktif", value: "8,350+" },
  { label: "Fan Art Dibagikan", value: "3,200+" },
  { label: "Review Ditulis", value: "950+" },
];

export default function CommunityPage() {
  return (
    <div className="anime-bg min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(79,163,209,0.2) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/30 text-xs text-primary font-semibold mb-6">
            💬 Komunitas Aktif
          </div>
          <h1 className="font-display text-5xl sm:text-6xl text-white mb-6">
            Forum <span className="gradient-text">Komunitas</span>
          </h1>
          <p className="text-secondary text-lg max-w-xl mx-auto">
            Bergabunglah dalam diskusi seru bersama ribuan penggemar anime, manga, dan kultur digital Jepang.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 pb-12">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map(({ label, value }) => (
            <div key={label} className="glass-card p-5 text-center">
              <div className="font-display text-3xl text-white mb-1">{value}</div>
              <div className="text-secondary text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl text-white mb-6">Kategori Diskusi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CATEGORIES.map(({ icon: Icon, label, count, desc, href, color, iconColor }) => (
              <Link key={label} href={href}>
                <div className="glass-card p-6 flex items-start gap-4 group cursor-pointer">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                  >
                    <Icon size={22} className={iconColor} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold group-hover:text-primary transition-colors">
                        {label}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {count} post
                      </span>
                    </div>
                    <p className="text-secondary text-sm">{desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Discord */}
      <DiscordSection />
    </div>
  );
}
