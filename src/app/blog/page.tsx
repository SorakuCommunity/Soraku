import { supabaseAdmin } from "@/lib/supabase";
import BlogCard from "@/components/BlogCard";

async function getPosts() {
  const { data } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  return data || [];
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-4">
            <span className="gradient-text">Blog</span> Soraku
          </h1>
          <p className="text-light-base/60">Berita, update, dan cerita dari komunitas Soraku</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-light-base/40">
            <p className="text-lg">Belum ada artikel yang dipublikasikan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
