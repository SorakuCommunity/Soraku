import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="anime-bg min-h-screen pt-32 px-4 pb-20">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Kembali ke Blog
        </Link>

        <article className="glass-card overflow-hidden">
          {/* Cover */}
          <div className="h-64 bg-gradient-to-br from-primary/10 to-secondary/5 flex items-center justify-center">
            <span className="text-8xl opacity-20">📖</span>
          </div>

          <div className="p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {["Anime", "Review"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1"
                >
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-display text-3xl text-white mb-4 leading-tight capitalize">
              {slug.replace(/-/g, " ")}
            </h1>

            <div className="flex items-center gap-1.5 text-secondary text-sm mb-8">
              <Clock size={14} />
              <span>
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-secondary leading-relaxed">
                Konten artikel ini akan dimuat dari database Supabase. 
                Pastikan koneksi database sudah terkonfigurasi dan data artikel sudah ditambahkan melalui admin panel.
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
