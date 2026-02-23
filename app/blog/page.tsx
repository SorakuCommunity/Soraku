import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Tag } from "lucide-react";
import SpotifyPlayer from "@/components/blog/SpotifyPlayer";

export const metadata: Metadata = {
  title: "Blog",
  description: "Artikel, review, dan cerita dari komunitas Soraku.",
};

const MOCK_POSTS = [
  {
    id: "1",
    title: "10 Anime Terbaik Season Ini yang Wajib Kamu Tonton",
    excerpt: "Lineup anime musim ini benar-benar luar biasa. Dari shounen action hingga slice of life yang mengharukan.",
    tags: ["Anime", "Review", "Season"],
    created_at: new Date().toISOString(),
    slug: "10-anime-terbaik-season-ini",
    spotify_track_id: null,
  },
  {
    id: "2",
    title: "Review Manga: Frieren at the Funeral",
    excerpt: "Frieren menceritakan petualangan seorang penyihir elf yang merenungi makna kehidupan manusia yang singkat.",
    tags: ["Manga", "Review"],
    created_at: new Date().toISOString(),
    slug: "review-frieren-manga",
    spotify_track_id: null,
  },
  {
    id: "3",
    title: "Sejarah dan Evolusi Kultur Vtuber di Jepang",
    excerpt: "Virtual YouTuber telah berkembang dari konsep sederhana menjadi industri hiburan bernilai miliaran yen.",
    tags: ["Vtuber", "Kultur", "Sejarah"],
    created_at: new Date().toISOString(),
    slug: "sejarah-vtuber-jepang",
    spotify_track_id: null,
  },
  {
    id: "4",
    title: "Top 5 Opening Anime yang Viral di 2024",
    excerpt: "Deretan opening anime yang bukan hanya enak didengar, tapi juga viral di media sosial.",
    tags: ["Anime", "Musik", "Top 5"],
    created_at: new Date().toISOString(),
    slug: "top-5-opening-anime-2024",
    spotify_track_id: null,
  },
  {
    id: "5",
    title: "Fan Art: Cara Memulai Ilustrasi Anime Digital",
    excerpt: "Panduan lengkap untuk pemula yang ingin mulai berkarya di dunia seni digital anime.",
    tags: ["Fan Art", "Tutorial"],
    created_at: new Date().toISOString(),
    slug: "cara-mulai-ilustrasi-anime-digital",
    spotify_track_id: null,
  },
  {
    id: "6",
    title: "Rekomendasi Light Novel untuk Penggemar Isekai",
    excerpt: "Kamu suka isekai? Berikut list light novel yang wajib ada di koleksimu.",
    tags: ["Light Novel", "Isekai", "Rekomendasi"],
    created_at: new Date().toISOString(),
    slug: "rekomendasi-light-novel-isekai",
    spotify_track_id: null,
  },
];

const ALL_TAGS = ["Semua", "Anime", "Manga", "Vtuber", "Fan Art", "Review", "Kultur", "Musik"];

export default function BlogPage() {
  return (
    <div className="anime-bg min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-12 px-4 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(79,163,209,0.15) 0%, transparent 55%)",
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative">
          <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">
            Blog & <span className="gradient-text">Artikel</span>
          </h1>
          <p className="text-secondary text-lg">
            Cerita, review, dan perspektif dari komunitas Soraku.
          </p>
        </div>
      </section>

      {/* Spotify Player Section */}
      <section className="px-4 pb-10">
        <div className="max-w-5xl mx-auto">
          <SpotifyPlayer />
        </div>
      </section>

      {/* Tag Filter */}
      <section className="px-4 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                className={`text-sm px-4 py-1.5 rounded-full border transition-all ${
                  tag === "Semua"
                    ? "bg-primary/20 text-primary border-primary/40"
                    : "glass border-white/10 text-secondary hover:text-primary hover:border-primary/30"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MOCK_POSTS.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <article className="glass-card overflow-hidden flex flex-col h-full group">
                {/* Cover */}
                <div className="h-44 bg-gradient-to-br from-primary/10 to-secondary/5 flex items-center justify-center">
                  <span className="text-5xl opacity-20">📖</span>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1"
                      >
                        <Tag size={10} />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-white font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-secondary text-sm flex-1 line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-1.5 text-secondary text-xs mt-auto">
                    <Clock size={12} />
                    <span>
                      {new Date(post.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
