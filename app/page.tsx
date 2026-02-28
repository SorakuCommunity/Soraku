// app/page.tsx — SORAKU v1.0.a3.4
// Dashboard with Discord Hero Card + Content Connection Area
import { createClient } from '@/lib/supabase/server'
import { DiscordHeroCard } from '@/components/discord/DiscordHeroCard'
import { DashboardContent } from '@/components/dashboard/DashboardContent'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch blog posts
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, cover_image, published_at')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(4)

  // Fetch events
  const { data: events } = await supabase
    .from('events')
    .select('id, title, description, cover_image, date, status')
    .in('status', ['ongoing', 'upcoming'])
    .order('date', { ascending: true })
    .limit(4)

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Discord Hero Card */}
        <DiscordHeroCard />

        {/* Content grid */}
        <DashboardContent
          posts={posts ?? []}
          events={events ?? []}
        />
      </div>
    </div>
  )
}
