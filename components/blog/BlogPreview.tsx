import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

const MOCK_POSTS = [
  {
    id: "1",
    title: "10 Anime Terbaik Season Ini yang Wajib Kamu Tonton",
    excerpt: "Lineup anime musim ini benar-benar luar biasa. Dari shounen action hingga slice of life yang mengharukan.",
    cover_image: null,
    tags: ["Anime", "Review"],
    created_at: new Date().toISOString(),
    slug: "10-anime-terbaik-season-ini",
  },
  {
    id: "2",
    title: "Review Manga: Frieren at the Funeral — Perjalanan yang Menyentuh",
    excerpt: "Frieren menceritakan petualangan seorang penyihir elf yang merenungi makna kehidupan manusia yang singkat.",
    cover_image: null,
    tags: ["Manga", "Review"],
    created_at: new Date().toISOString(),
    slug: "review-frieren-manga",
  },
  {
    id: "3",
    title: "Sejarah dan Evolusi Kultur Vtuber di Jepang",
    excerpt: "Virtual YouTuber telah berkembang dari konsep sederhana menjadi industri hiburan bernilai miliaran yen.",
    cover_image: null,
    tags: ["Vtuber", "Kultur"],
    created_at: new Date().toISOString(),
    slug: "sejarah-vtuber-jepang",
  },
];

export default function BlogPreview() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl text-white mb-2">
              Blog & <span className="gradient-text">Artikel</span>
            </h2>
            <p className="text-secondary">Tulisan terbaru dari komunitas Soraku</p>
          </div>
          <Link href="/blog" className="hidden sm:flex items-center gap-2 text-primary text-sm hover:gap-3 transition-all">
            Lihat Semua
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MOCK_POSTS.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <article className="glass-card overflow-hidden h-full flex flex-col group">
                {/* Cover placeholder */}
                <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/5 flex items-center justify-center">
                  <span className="text-5xl opacity-20">📖</span>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  {/* Tags */}
                  <div className="flex gap-2 mb-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                      >
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
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/blog">
            <button className="btn-ghost text-sm">Lihat Semua Artikel</button>
          </Link>
        </div>
      </div>
    </section>
  );
}
