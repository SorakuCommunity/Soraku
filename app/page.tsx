// app/page.tsx — SORAKU v1.0.a3.5
// Dashboard: Discord Hero Card + Latest Blog + Latest Events + Komunitas CTA
// Server Component → fetches data, passes to client DashboardContent
import { createClient } from '@/lib/supabase/server'
import { DiscordHeroCard } from '@/components/discord/DiscordHeroCard'
import { DashboardContent } from '@/components/dashboard/DashboardContent'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, cover_image, published_at')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(4)

  const { data: events } = await supabase
    .from('events')
    .select('id, title, description, cover_image, date, status')
    .in('status', ['ongoing', 'upcoming'])
    .order('date', { ascending: true })
    .limit(4)

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">
        <DiscordHeroCard />
        <DashboardContent posts={posts ?? []} events={events ?? []} />
      </div>
    </div>
  )
}
