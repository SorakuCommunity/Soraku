import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Eye, Heart, Clock, Search, X } from "lucide-react";
import { db } from "@/lib/supabase/server";
import { formatRelativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog — Soraku Community",
  description: "Artikel, review, dan ulasan anime & budaya Jepang dari komunitas Soraku.",
};

const ALL_TAGS = [
  "Semua", "anime", "manga", "cosplay", "review", "list",
  "panduan", "event", "musik", "vtuber", "gaming",
];

type PostItem = {
  id: string; slug: string; title: string; excerpt: string | null;
  coverurl: string | null; tags: string[]; publishedat: string;
  viewcount: number; likecount: number;
  author: { username: string | null; displayname: string | null; avatarurl: string | null } | null;
};

function readingTime(excerpt: string | null) {
  const words = (excerpt ?? "").split(" ").length;
  return Math.max(1, Math.ceil(words / 200));
}

function PostCard({ post, featured }: { post: PostItem; featured?: boolean }) {
  const author = post.author;
  const name   = author?.displayname ?? author?.username ?? "Soraku";

  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`}
        className="group glass-card col-span-3 md:col-span-2 lg:col-span-3 flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-border/50 hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300">
        {/* Cover */}
        <div className="relative h-48 sm:h-auto sm:w-72 lg:w-96 flex-shrink-0 overflow-hidden bg-gradient-to-br from-primary/20 via-accent/10 to-violet-500/15">
          {post.coverurl ? (
            <Image src={post.coverurl} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-7xl font-black text-primary/6 select-none">空</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-transparent" />
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[10px] font-black text-white shadow-md">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Featured
          </div>
        </div>
        {/* Content */}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((t: string) => (
              <span key={t} className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary/80 capitalize">{t}</span>
            ))}
          </div>
          <h2 className="text-xl font-black leading-snug group-hover:text-primary transition-colors line-clamp-3 sm:text-2xl">{post.title}</h2>
          {post.excerpt && <p className="mt-2 text-sm text-muted-foreground/70 line-clamp-2 leading-relaxed flex-1">{post.excerpt}</p>}
          <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-3">
            <div className="flex items-center gap-2">
              {author?.avatarurl ? (
                <Image src={author.avatarurl} alt={name} width={24} height={24} className="rounded-full" unoptimized />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-[10px] font-black text-primary">{name.charAt(0).toUpperCase()}</div>
              )}
              <span className="text-xs text-muted-foreground/60">{name}</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground/40">
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{post.viewcount ?? 0}</span>
              <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{post.likecount ?? 0}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{readingTime(post.excerpt)} min</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`}
      className="group glass-card flex flex-col overflow-hidden rounded-2xl border border-border/50 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
      {/* Cover */}
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-primary/15 via-accent/8 to-violet-500/10">
        {post.coverurl ? (
          <Image src={post.coverurl} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="h-8 w-8 text-primary/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
      </div>
      {/* Content */}
      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="font-bold leading-snug line-clamp-2 text-sm group-hover:text-primary transition-colors flex-1">{post.title}</h3>
        {post.excerpt && (
          <p className="mt-1.5 text-xs text-muted-foreground/60 line-clamp-2 leading-relaxed">{post.excerpt}</p>
        )}
        {/* Author row */}
        <div className="mt-2.5 flex items-center gap-1.5">
          {author?.avatarurl ? (
            <Image src={author.avatarurl} alt={name} width={16} height={16} className="rounded-full flex-shrink-0" unoptimized />
          ) : (
            <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-[8px] font-black text-primary">{name.charAt(0).toUpperCase()}</div>
          )}
          <span className="text-[10px] text-muted-foreground/50 truncate">{name}</span>
          <span className="ml-auto text-[10px] text-muted-foreground/30">{formatRelativeTime(post.publishedat)}</span>
        </div>
        {/* Stats */}
        <div className="mt-2 flex items-center gap-2.5 border-t border-border/20 pt-2 text-[10px] text-muted-foreground/35">
          <span className="flex items-center gap-1"><Eye className="h-2.5 w-2.5" />{post.viewcount ?? 0}</span>
          <span className="flex items-center gap-1"><Heart className="h-2.5 w-2.5" />{post.likecount ?? 0}</span>
          <span className="ml-auto flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{readingTime(post.excerpt)} min</span>
        </div>
        {/* Hashtags di bawah */}
        {post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((t: string) => (
              <span key={t} className="rounded-full bg-muted/30 px-1.5 py-0.5 text-[9px] text-muted-foreground/50 capitalize">#{t}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export default async function BlogPage({ searchParams }: { searchParams?: Promise<{ tag?: string; q?: string }> }) {
  const params    = await searchParams;
  const activeTag = params?.tag ?? "Semua";
  const searchQ   = params?.q ?? "";
  const query     = (await db())
    .from("posts")
    .select("id,slug,title,excerpt,tags,publishedat,coverurl,viewcount,likecount,authorid")
    .eq("ispublished", true)
    .order("publishedat", { ascending: false });

  let filteredQuery = activeTag === "Semua" ? query : query.contains("tags", [activeTag]);
  if (searchQ) filteredQuery = filteredQuery.ilike("title", `%${searchQ}%`);
  const { data: rawPosts } = await filteredQuery;

  // Fetch authors
  const authorIds = [...new Set((rawPosts ?? []).filter(p => p.authorid).map(p => p.authorid!))];
  let authorsMap: Record<string, any> = {};
  if (authorIds.length > 0) {
    const { data: users } = await (await db()).from("users").select("id,username,displayname,avatarurl").in("id", authorIds);
    authorsMap = Object.fromEntries((users ?? []).map(u => [u.id, u]));
  }

  const posts: PostItem[] = (rawPosts ?? []).map(p => ({
    ...p,
    viewcount: p.viewcount ?? 0,
    likecount: p.likecount ?? 0,
    author:    p.authorid ? authorsMap[p.authorid] ?? null : null,
  }));

  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary/70">Komunitas</p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Blog <span className="text-gradient">Soraku</span></h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">Artikel, review anime, tips cosplay, dan cerita dari komunitas Soraku Indonesia.</p>
      </div>

      {/* Search bar */}
      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
        <form action="/blog" method="GET">
          {activeTag !== "Semua" && <input type="hidden" name="tag" value={activeTag} />}
          <input name="q" defaultValue={searchQ} placeholder="Cari artikel..."
            className="w-full rounded-xl border border-border/50 bg-card/30 py-2 pl-9 pr-4 text-sm outline-none placeholder:text-muted-foreground/30 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all" />
        </form>
        {searchQ && (
          <a href={activeTag !== "Semua" ? `/blog?tag=${activeTag}` : "/blog"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors">
            <X className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {/* Tag filters */}
      <div className="mb-8 flex flex-wrap gap-1.5">
        {ALL_TAGS.map(tag => (
          <Link key={tag} href={tag === "Semua" ? "/blog" : `/blog?tag=${tag}`}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-all capitalize ${
              activeTag === tag
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "border border-border/50 text-muted-foreground/70 hover:border-primary/40 hover:text-foreground"
            }`}>
            {tag === "Semua" ? "✨ Semua" : `#${tag}`}
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-muted-foreground">Belum ada artikel dengan tag ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-6">
          {/* Featured — span 3 cols mobile, full width */}
          {featured && <PostCard post={featured} featured />}
          {/* Regular grid — 3 col mobile, 3 col on sm, 6 col on lg (3 per row = 2 articles) */}
          {rest.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  );
}
