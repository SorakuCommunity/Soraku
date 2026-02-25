import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Youtube, Twitter } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ generation: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Vtuber: ${slug}`,
  };
}

export default async function VtuberDetailPage({
  params,
}: {
  params: Promise<{ generation: string; slug: string }>;
}) {
  const { generation, slug } = await params;

  return (
    <div className="anime-bg min-h-screen pt-32 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href={`/vtuber/${generation}`}
          className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Kembali
        </Link>

        <div className="glass-card p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-display text-5xl">
              ?
            </div>
            <div>
              <h1 className="font-display text-3xl text-white mb-2 capitalize">
                {slug.replace(/-/g, " ")}
              </h1>
              <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                {generation.replace(/-/g, " ")}
              </span>
            </div>
          </div>

          <p className="text-secondary mb-8">
            Profil talent ini akan dimuat dari database Supabase. Pastikan koneksi database sudah terkonfigurasi.
          </p>

          <div className="flex gap-3">
            <a href="#" className="btn-ghost text-sm flex items-center gap-2">
              <Youtube size={16} className="text-red-400" />
              YouTube
            </a>
            <a href="#" className="btn-ghost text-sm flex items-center gap-2">
              <Twitter size={16} className="text-sky-400" />
              Twitter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
