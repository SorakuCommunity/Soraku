import type { Metadata } from "next";
import Link from "next/link";
import { Upload, ImageIcon, ZoomIn } from "lucide-react";
import { MOCK_GALLERY } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Galeri — Soraku Community",
  description: "Galeri karya anggota komunitas Soraku — fanart, cosplay, digital art, dan foto.",
};

const CATEGORIES = [
  { slug: "Semua",   emoji: "✨" },
  { slug: "fanart",  emoji: "🎨" },
  { slug: "cosplay", emoji: "👘" },
  { slug: "digital", emoji: "💻" },
  { slug: "foto",    emoji: "📷" },
  { slug: "lainnya", emoji: "🌸" },
];

const COLORS = [
  "from-pink-500/20 to-rose-400/15",
  "from-violet-500/20 to-purple-400/15",
  "from-blue-500/20 to-cyan-400/15",
  "from-amber-500/20 to-yellow-400/15",
  "from-green-500/20 to-emerald-400/15",
  "from-primary/20 to-accent/15",
];

export default function GalleryPage({ searchParams }: { searchParams?: { category?: string } }) {
  const activeCategory = searchParams?.category ?? "Semua";
  const items = activeCategory === "Semua"
    ? MOCK_GALLERY
    : MOCK_GALLERY.filter((i) => i.category === activeCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

      {/* ── Header ── */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary/70">Komunitas</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Galeri <span className="text-gradient">Karya</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Fanart, cosplay, dan karya kreatif dari anggota Soraku.
          </p>
        </div>
        <Link href="/gallery/upload"
          className="flex items-center gap-2 self-start rounded-2xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-primary/30 sm:self-auto flex-shrink-0">
          <Upload className="h-4 w-4" /> Upload Karya
        </Link>
      </div>

      {/* ── Filter ── */}
      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map(({ slug, emoji }) => (
          <Link key={slug}
            href={slug === "Semua" ? "/gallery" : `/gallery?category=${slug}`}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-all ${
              activeCategory === slug
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "border border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground hover:-translate-y-0.5"
            }`}>
            <span>{emoji}</span>
            <span>{slug}</span>
          </Link>
        ))}
      </div>

      {/* ── Masonry grid ── */}
      {items.length > 0 ? (
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
          {items.map((item, idx) => (
            <div key={item.id}
              className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-border/50 bg-card/40 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/8 cursor-pointer">

              {/* Colored placeholder (swap with <Image> when real data) */}
              <div className={`w-full bg-gradient-to-br ${COLORS[idx % COLORS.length]} flex items-center justify-center ${
                idx % 3 === 0 ? "h-52" : idx % 3 === 1 ? "h-36" : "h-44"
              }`}>
                <ImageIcon className="h-8 w-8 text-foreground/10" />
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/70 opacity-0 transition-opacity backdrop-blur-sm group-hover:opacity-100 rounded-2xl">
                <ZoomIn className="h-6 w-6 text-foreground/80" />
                <span className="text-xs font-semibold text-foreground/70">Lihat</span>
              </div>

              {/* Category badge */}
              <div className="absolute top-2 left-2">
                <span className="rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-semibold text-foreground/70 capitalize backdrop-blur-sm">
                  {item.category}
                </span>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="truncate text-xs font-semibold">{item.title}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground/60 capitalize">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-4xl mb-3">🖼️</p>
          <p className="text-muted-foreground">Belum ada karya di kategori ini.</p>
          <Link href="/gallery/upload" className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline">
            Upload karya pertama <Upload className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
