import Link from "next/link";
import { ArrowRight, Star, Users, Zap, MessageCircle } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { supabaseAdmin } from "@/lib/supabase";
import BlogCard from "@/components/BlogCard";
import EventCard from "@/components/EventCard";

async function getRecentPosts() {
  const { data } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(3);
  return data || [];
}

async function getUpcomingEvents() {
  const { data } = await supabaseAdmin
    .from("events")
    .select("*")
    .in("status", ["upcoming", "ongoing"])
    .order("start_date", { ascending: true })
    .limit(3);
  return data || [];
}

export default async function HomePage() {
  const [posts, events] = await Promise.all([getRecentPosts(), getUpcomingEvents()]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background effects */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 text-sm text-primary mb-8">
            <Star className="w-3.5 h-3.5" />
            Platform Komunitas VTuber Indonesia
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight">
            Selamat Datang di{" "}
            <span className="gradient-text">Soraku</span>
          </h1>

          <p className="text-xl text-light-base/60 max-w-2xl mx-auto mb-10">
            Rumah bagi para penggemar VTuber Indonesia. Dukung, pantau, dan nikmati konten para virtual idol favorit kamu bersama komunitas yang solid.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/vtuber"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/80 text-white rounded-xl font-semibold transition-all duration-200 glow-hover"
            >
              Jelajahi VTuber <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://discord.gg/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 glass border border-white/20 hover:border-primary/40 text-light-base rounded-xl font-semibold transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4 text-[#5865F2]" />
              Join Discord
            </a>
          </div>

          {/* Floating stats */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { icon: <Users className="w-5 h-5 text-primary" />, label: "Anggota Aktif", value: "1,000+" },
              { icon: <Zap className="w-5 h-5 text-accent" />, label: "VTuber Debut", value: "12+" },
              { icon: <Star className="w-5 h-5 text-yellow-400" />, label: "Event Digelar", value: "50+" },
            ].map((stat, i) => (
              <div key={i} className="glass rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-light-base">{stat.value}</p>
                    <p className="text-xs text-light-base/50">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-light-base/30">
          <span className="text-xs">Scroll</span>
          <div className="w-0.5 h-8 bg-gradient-to-b from-primary/50 to-transparent rounded-full" />
        </div>
      </section>

      {/* Discord Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-sm mx-auto">
            <StatsCard />
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      {posts.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-light-base">Blog Terbaru</h2>
              <Link href="/blog" className="text-sm text-primary hover:underline flex items-center gap-1">
                Lihat Semua <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post: any) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-light-base">Events</h2>
              <Link href="/events" className="text-sm text-primary hover:underline flex items-center gap-1">
                Lihat Semua <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event: any) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">
                Bergabung dengan Komunitas{" "}
                <span className="gradient-text">Soraku</span>
              </h2>
              <p className="text-light-base/60 mb-8 max-w-xl mx-auto">
                Jadilah bagian dari komunitas VTuber Indonesia yang terus berkembang. Ikuti event, baca blog, dan dukung para talent favoritmu!
              </p>
              <a
                href="https://discord.gg/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#5865F2] hover:bg-[#4f59d9] text-white rounded-xl font-semibold transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Join Discord Server
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
