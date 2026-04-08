import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Tag, Calendar } from "lucide-react";
import { MOCK_POSTS } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = MOCK_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Artikel tidak ditemukan" };
  return { title: `${post.title} — Soraku Blog`, description: post.excerpt ?? undefined };
}

export async function generateStaticParams() {
  return MOCK_POSTS.map((p) => ({ slug: p.slug }));
}

const MOCK_CONTENT = `
Ini adalah konten artikel yang akan diambil dari database setelah Kaizo selesai setup API. 
Konten artikel akan berupa Markdown yang dirender menjadi HTML.

## Tentang Artikel Ini

Konten lengkap akan tersedia setelah integrasi dengan Supabase selesai. 
Saat ini halaman ini sudah siap dengan layout, metadata, dan struktur yang benar.

## Fitur yang Sudah Siap

- Layout artikel yang responsif
- Metadata SEO yang lengkap
- Related posts di bawah
- Navigation kembali ke blog listing
- Author info section

*— Bubu, Front-end Developer Soraku*
`;

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = MOCK_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = MOCK_POSTS.filter((p) => p.id !== post.id && p.tags.some((t) => post.tags.includes(t))).slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Back */}
      <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Blog
      </Link>

      {/* Cover */}
      <div className="mb-8 h-56 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-violet-500/15 flex items-center justify-center sm:h-72">
        <span className="text-8xl opacity-10">空</span>
      </div>

      {/* Meta */}
      <div className="mb-6 flex flex-wrap gap-3">
        {post.tags.map((t) => (
          <Link key={t} href={`/blog?tag=${t}`}
            className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
            <Tag className="h-2.5 w-2.5" />{t}
          </Link>
        ))}
        <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />{post.read_time} menit baca
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">{post.title}</h1>

      {/* Author */}
      <div className="mt-5 flex items-center gap-3 pb-6 border-b border-border/50">
        <div className="h-9 w-9 rounded-xl bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
          {(post.author.display_name ?? post.author.username).charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium">{post.author.display_name ?? post.author.username}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />{formatDate(post.published_at)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-sm mt-8 max-w-none text-muted-foreground prose-headings:text-foreground prose-headings:font-bold prose-strong:text-foreground prose-a:text-primary">
        {MOCK_CONTENT.split("\n").map((line, i) => {
          if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-foreground mt-8 mb-4">{line.slice(3)}</h2>;
          if (line.startsWith("*")) return <p key={i} className="italic text-muted-foreground/70 mt-6">{line.replace(/\*/g, "")}</p>;
          if (line.trim() === "") return null;
          return <p key={i} className="mt-4 leading-relaxed">{line}</p>;
        })}
      </div>

      {/* Tags */}
      <div className="mt-12 flex flex-wrap gap-2 pt-6 border-t border-border/50">
        <span className="text-sm text-muted-foreground">Tags:</span>
        {post.tags.map((t) => (
          <Link key={t} href={`/blog?tag=${t}`}
            className="rounded-full border border-border px-3 py-0.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
            {t}
          </Link>
        ))}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-lg font-bold mb-5">Artikel Terkait</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`}
                className="glass-card p-4 hover:-translate-y-1 hover:border-primary/30 transition-all group">
                <p className="text-xs text-primary mb-2">{p.tags[0]}</p>
                <h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">{p.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground/60">{formatDate(p.published_at)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
