import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Youtube, Twitter } from "lucide-react";

export const metadata: Metadata = {
  title: "Vtuber",
  description: "Kenali para Vtuber dari berbagai generasi komunitas Soraku.",
};

const GENERATIONS = [
  {
    id: "gen-1",
    label: "Generasi 1",
    subtitle: "Pendiri & Pelopor",
    vtubers: [
      {
        id: "1",
        name: "Sakura Hana",
        bio: "Vtuber idol dengan tema bunga sakura. Suka nyanyi dan main otome game.",
        generation: "gen-1",
        avatar_url: null,
        social_links: { youtube: "#", twitter: "#" },
      },
      {
        id: "2",
        name: "Yuki Arashi",
        bio: "Gaming vtuber yang ahli dalam FPS dan battle royale. Energi tak terbatas!",
        generation: "gen-1",
        avatar_url: null,
        social_links: { youtube: "#", twitter: "#" },
      },
    ],
  },
  {
    id: "gen-2",
    label: "Generasi 2",
    subtitle: "Rising Stars",
    vtubers: [
      {
        id: "3",
        name: "Aoi Tsukimi",
        bio: "Vtuber kucing dengan suara merdu. Streamer ASMR dan cover song favorit.",
        generation: "gen-2",
        avatar_url: null,
        social_links: { youtube: "#", twitter: "#" },
      },
      {
        id: "4",
        name: "Ren Kagami",
        bio: "Vtuber ojou-sama yang anggun. Suka RPG klasik dan visual novel.",
        generation: "gen-2",
        avatar_url: null,
        social_links: { youtube: "#", twitter: "#" },
      },
      {
        id: "5",
        name: "Kiri Sora",
        bio: "Vtuber bertema alam dengan keahlian live drawing dan illustration.",
        generation: "gen-2",
        avatar_url: null,
        social_links: { youtube: "#", twitter: "#" },
      },
    ],
  },
];

const AVATAR_GRADIENTS = [
  "from-pink-400 to-purple-500",
  "from-blue-400 to-cyan-500",
  "from-yellow-400 to-orange-500",
  "from-green-400 to-teal-500",
  "from-red-400 to-pink-500",
];

export default function VtuberPage() {
  return (
    <div className="anime-bg min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(168,85,247,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(79,163,209,0.08) 0%, transparent 50%)",
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-purple-500/30 text-xs text-purple-400 font-semibold mb-6">
            ⭐ Virtual Talents
          </div>
          <h1 className="font-display text-5xl sm:text-6xl text-white mb-6">
            Soraku <span className="gradient-text">Vtuber</span>
          </h1>
          <p className="text-secondary text-lg max-w-xl mx-auto">
            Kenali dan support para Vtuber berbakat dari komunitas Soraku. Setiap generasi membawa warna baru!
          </p>
        </div>
      </section>

      {/* Generations */}
      {GENERATIONS.map((gen, gi) => (
        <section key={gen.id} className="px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            {/* Gen header */}
            <div className="flex items-center gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-2xl text-white">{gen.label}</h2>
                  <span className="text-xs px-3 py-1 rounded-full glass border border-primary/30 text-primary">
                    {gen.vtubers.length} talent
                  </span>
                </div>
                <p className="text-secondary text-sm mt-1">{gen.subtitle}</p>
              </div>
            </div>

            {/* Vtuber cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {gen.vtubers.map((vt, vi) => (
                <Link key={vt.id} href={`/vtuber/${gen.id}/${vt.id}`}>
                  <div className="glass-card p-6 flex flex-col items-center text-center gap-4 group cursor-pointer">
                    {/* Avatar */}
                    <div
                      className={`w-24 h-24 rounded-full bg-gradient-to-br ${
                        AVATAR_GRADIENTS[(gi * 3 + vi) % AVATAR_GRADIENTS.length]
                      } flex items-center justify-center text-white font-display text-3xl group-hover:scale-105 transition-transform glow-primary`}
                    >
                      {vt.name.charAt(0)}
                    </div>

                    {/* Info */}
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                        {vt.name}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 mb-3 inline-block">
                        {gen.label}
                      </span>
                      <p className="text-secondary text-sm line-clamp-2">{vt.bio}</p>
                    </div>

                    {/* Social */}
                    <div className="flex items-center gap-3 mt-auto">
                      {vt.social_links.youtube && (
                        <span className="p-1.5 glass rounded-lg text-red-400 hover:bg-red-400/10 transition-colors">
                          <Youtube size={14} />
                        </span>
                      )}
                      {vt.social_links.twitter && (
                        <span className="p-1.5 glass rounded-lg text-sky-400 hover:bg-sky-400/10 transition-colors">
                          <Twitter size={14} />
                        </span>
                      )}
                      <span className="p-1.5 glass rounded-lg text-secondary hover:text-primary transition-colors">
                        <ExternalLink size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
