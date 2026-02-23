import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowRight } from "lucide-react";
import { formatDate, truncate } from "@/lib/utils";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  author_name: string | null;
  status: string;
  created_at: string;
}

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group glass rounded-2xl overflow-hidden border border-white/10 hover:border-primary/30 card-hover transition-all duration-300">
      {/* Featured image */}
      <div className="aspect-video relative overflow-hidden bg-dark-3">
        {post.featured_image ? (
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
            <div className="text-4xl opacity-20">📝</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-2/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-light-base group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-sm text-light-base/60 line-clamp-3 mb-4">
            {truncate(post.excerpt, 120)}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3 text-xs text-light-base/40">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(post.created_at)}
            </span>
            {post.author_name && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {post.author_name}
              </span>
            )}
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="flex items-center gap-1 text-xs text-primary font-medium hover:gap-2 transition-all"
          >
            Baca <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}
