import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Eye } from "lucide-react";
import { db } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import BlogDetailClient from "./BlogDetailClient";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
<<<<<<< HEAD
  try {
    const { data } = await (await db()).from("posts").select("title,excerpt,coverurl").eq("slug", slug).eq("ispublished", true).single();
    if (!data) return { title: "Artikel tidak ditemukan" };
    return {
      title:       `${data.title} — Soraku Blog`,
      description: data.excerpt ?? undefined,
      openGraph:   { images: data.coverurl ? [data.coverurl] : undefined },
    };
  } catch { return { title: "Soraku Blog" }; }
=======
  const { data } = await (await db()).from("posts").select("title,excerpt,coverurl").eq("slug", slug).eq("ispublished", true).single();
  if (!data) return { title: "Artikel tidak ditemukan" };
  return {
    title:       `${data.title} — Soraku Blog`,
    description: data.excerpt ?? undefined,
    openGraph:   { images: data.coverurl ? [data.coverurl] : undefined },
  };
>>>>>>> 1170e9e (feat(blog): full overhaul - grid, markdown, likes, comments, share, views, Discord, services/api)
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;

<<<<<<< HEAD
  let post: any = null;
  try {
    const { data } = await (await db())
      .from("posts")
      .select("id,slug,title,excerpt,content,tags,publishedat,coverurl,authorid,viewcount,likecount")
      .eq("slug", slug).eq("ispublished", true).single();
    post = data;
  } catch { notFound(); }

  if (!post) notFound();

  let author: any = null;
  try {
    if (post.authorid) {
      const { data } = await (await db()).from("users").select("username,displayname,avatarurl").eq("id", post.authorid).single();
      author = data;
    }
  } catch {}

  let related: any[] = [];
  try {
    const { data: relatedRaw } = await (await db())
      .from("posts")
      .select("id,slug,title,excerpt,coverurl,tags,publishedat,viewcount,likecount")
      .eq("ispublished", true)
      .neq("id", post.id)
      .order("publishedat", { ascending: false })
      .limit(3);
    related = relatedRaw ?? [];
  } catch {}

  const authorName = author?.displayname ?? author?.username ?? "Soraku Team";
  const readMins   = Math.max(1, Math.ceil(((post.content ?? "").split(" ").length) / 200));
  const tags       = Array.isArray(post.tags) ? post.tags : [];
=======
  const { data: post } = await (await db())
    .from("posts")
    .select("id,slug,title,excerpt,content,tags,publishedat,coverurl,authorid,viewcount,likecount")
    .eq("slug", slug).eq("ispublished", true).single();

  if (!post) notFound();

  const { data: author } = post.authorid
    ? await (await db()).from("users").select("username,displayname,avatarurl").eq("id", post.authorid).single()
    : { data: null };

  const { data: relatedRaw } = await (await db())
    .from("posts")
    .select("id,slug,title,excerpt,coverurl,tags,publishedat,viewcount,likecount")
    .eq("ispublished", true)
    .neq("id", post.id)
    .order("publishedat", { ascending: false })
    .limit(3);
>>>>>>> 1170e9e (feat(blog): full overhaul - grid, markdown, likes, comments, share, views, Discord, services/api)

  const related = relatedRaw ?? [];
  const authorName = author?.displayname ?? author?.username ?? "Soraku Team";
  const readMins   = Math.max(1, Math.ceil(((post.content ?? "").split(" ").length) / 200));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/blog" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Blog
      </Link>

<<<<<<< HEAD
      {/* Cover + view overlay */}
=======
      {/* Cover — real time view overlay */}
>>>>>>> 1170e9e (feat(blog): full overhaul - grid, markdown, likes, comments, share, views, Discord, services/api)
      <div className="relative mb-6 h-52 sm:h-72 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-violet-500/15">
        {post.coverurl ? (
          <Image src={post.coverurl} alt={post.title} fill className="object-cover" priority unoptimized />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="h-16 w-16 text-primary/15" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
<<<<<<< HEAD
=======
        {/* View count overlay */}
>>>>>>> 1170e9e (feat(blog): full overhaul - grid, markdown, likes, comments, share, views, Discord, services/api)
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm text-xs text-white/80">
          <Eye className="h-3.5 w-3.5" />
          <span>{(post.viewcount ?? 0).toLocaleString()} views</span>
        </div>
<<<<<<< HEAD
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm text-xs text-white/80">
          {readMins} min baca
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">{post.title}</h1>

      {/* Author + date */}
      <div className="mt-4 flex items-center gap-3 pb-5 border-b border-border/40">
        {author?.avatarurl ? (
          <Image src={author.avatarurl} alt={authorName} width={36} height={36} className="rounded-xl" unoptimized />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-sm font-black text-primary">
            {authorName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold">{authorName}</p>
          <p className="text-xs text-muted-foreground/50">
            {post.publishedat ? formatDate(post.publishedat) : ""} · {readMins} min baca
          </p>
        </div>
      </div>

=======
        {/* Read time overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm text-xs text-white/80">
          {readMins} min baca
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">{post.title}</h1>

      {/* Author + date */}
      <div className="mt-4 flex items-center gap-3 pb-5 border-b border-border/40">
        {author?.avatarurl ? (
          <Image src={author.avatarurl} alt={authorName} width={36} height={36} className="rounded-xl" unoptimized />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-sm font-black text-primary">
            {authorName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold">{authorName}</p>
          <p className="text-xs text-muted-foreground/50">{formatDate(post.publishedat)} · {readMins} min baca</p>
        </div>
      </div>

      {/* Client part: content, likes, share, comments + real-time view increment */}
>>>>>>> 1170e9e (feat(blog): full overhaul - grid, markdown, likes, comments, share, views, Discord, services/api)
      <BlogDetailClient
        slug={post.slug}
        content={post.content ?? ""}
        likecount={post.likecount ?? 0}
<<<<<<< HEAD
        siteUrl={process.env.NEXT_PUBLIC_SITE_URL ?? "https://soraku.vercel.app"}
        title={post.title}
        tags={tags}
=======
        commentcount={0}
        siteUrl={process.env.NEXT_PUBLIC_SITE_URL ?? "https://soraku.vercel.app"}
        title={post.title}
        tags={post.tags}
>>>>>>> 1170e9e (feat(blog): full overhaul - grid, markdown, likes, comments, share, views, Discord, services/api)
        related={related}
      />
    </div>
  );
}
