import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Tag, ArrowRight, Search } from "lucide-react";
import { MOCK_POSTS } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog — Soraku Community",
  description: "Artikel, review, dan ulasan anime & budaya Jepang dari komunitas Soraku.",
};

const ALL_TAGS = [
  { slug: "Semua", emoji: "✨" },
  { slug: "anime",   emoji: "🎌" },
  { slug: "manga",   emoji: "📚" },
  { slug: "cosplay", emoji: "👘" },
  { slug: "review",  emoji: "⭐" },
  { slug: "list",    emoji: "📋" },
  { slug: "panduan", emoji: "📖" },
  { slug: "event",   emoji: "🗓️" },
  { slug: "musik",   emoji: "🎵" },
];

export default function BlogPage({ searchParams }: { searchParams?: { tag?: string } }) {
  const activeTag = searchParams?.tag ?? "Semua";
  const posts = activeTag === "Semua"
    ? MOCK_POSTS
    : MOCK_POSTS.filter((p) => p.tags.includes(activeTag));
  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

      {/* ── Header ── */}
      <div className="mb-10">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary/70">Komunitas</p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Blog <span className="text-gradient">Soraku</span>
          </h1>
          {/* Search placeholder */}
          <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/50 px-4 py-2.5 text-sm text-muted-foreground/50 sm:w-56">
            <Search className="h-4 w-4 flex-shrink-0" />
            <span>Cari artikel...</span>
          </div>
        </div>
        <p className="mt-3 max-w-xl text-muted-foreground text-sm">
          Artikel, review anime, tips cosplay, dan cerita dari komunitas Soraku Indonesia.
        </p>
      </div>

      {/* ── Tags filter ── */}
      <div className="mb-10 flex flex-wrap gap-2">
        {ALL_TAGS.map(({ slug, emoji }) => (
          <Link key={slug}
            href={slug === "Semua" ? "/blog" : `/blog?tag=${slug}`}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              activeTag === slug
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "border border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground hover:-translate-y-0.5"
            }`}>
            <span className="text-[13px]">{emoji}</span>
            <span className="capitalize">{slug}</span>
          </Link>
        ))}
      </div>

      {/* ── Featured post ── */}
      {featured && (
        <Link href={`/blog/${featured.slug}`}
          className="group glass-card mb-8 grid overflow-hidden lg:grid-cols-[420px_1fr] hover:border-primary/30 hover:-translate-y-0.5 transition-all">
          {/* Cover */}
          <div className="relative h-52 overflow-hidden bg-gradient-to-br from-primary/20 via-accent/10 to-violet-500/15 lg:h-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[6rem] font-black text-primary/8 select-none">空</span>
            </div>
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1 text-[10px] font-bold text-white shadow-md">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              Featured
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col p-6 lg:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {featured.tags.slice(0, 3).map((t) => (
                <span key={t} className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/8 px-2.5 py-0.5 text-[11px] font-semibold text-primary/80">
                  <Tag className="h-2.5 w-2.5" />{t}
                </span>
              ))}
              <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground/50">
                <Clock className="h-3 w-3" />{featured.read_time} menit
              </span>
            </div>

            <h2 className="text-xl font-black leading-snug tracking-tight group-hover:text-primary transition-colors sm:text-2xl lg:text-3xl">
              {featured.title}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
              {featured.excerpt}
            </p>

            <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4">
              <span className="text-xs text-muted-foreground/50">{formatDate(featured.published_at)}</span>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                Baca selengkapnya <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </Link>
      )}

      {/* ── Post grid ── */}
      {rest.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}
              className="glass-card group flex flex-col overflow-hidden hover:-translate-y-1 hover:border-primary/30 transition-all">
              {/* Cover */}
              <div className="h-40 relative overflow-hidden bg-gradient-to-br from-primary/15 via-accent/8 to-violet-500/12">
                <span className="absolute inset-0 flex items-center justify-center text-[4rem] font-black text-primary/6 select-none">空</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 2).map((t) => (
                    <span key={t} className="rounded-full border border-primary/20 bg-primary/8 px-2 py-0.5 text-[10px] font-semibold text-primary/70 capitalize">
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2 flex-1">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground/50 border-t border-border/30 pt-3">
                  <span>{formatDate(post.published_at)}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.read_time} mnt</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {posts.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-muted-foreground">Belum ada artikel dengan tag ini.</p>
        </div>
      )}
    </div>
  );
}
