import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Calendar, User } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";

interface Props {
  params: { slug: string };
}

async function getPost(slug: string) {
  const { data } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data;
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-light-base/60 hover:text-primary mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Kembali ke Blog
        </Link>

        <article className="glass rounded-2xl border border-white/10 overflow-hidden">
          {post.featured_image && (
            <div className="aspect-video relative">
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="p-8">
            <h1 className="text-3xl font-black text-light-base mb-4">{post.title}</h1>

            <div className="flex items-center gap-4 text-sm text-light-base/40 mb-8 pb-6 border-b border-white/10">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(post.created_at)}
              </span>
              {post.author_name && (
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {post.author_name}
                </span>
              )}
            </div>

            <div
              className="prose-dark space-y-4 text-light-base/80 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br/>") }}
            />
          </div>
        </article>
      </div>
    </div>
  );
}
