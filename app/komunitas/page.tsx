// app/komunitas/page.tsx — SORAKU v1.0.a3.4
// Komunitas page: Discord Hero + Filter tabs + Glass post grid
import { createClient } from '@/lib/supabase/server'
import { DiscordHeroCard } from '@/components/discord/DiscordHeroCard'
import { KomunitasClient } from '@/components/komunitas/KomunitasClient'
import { getGitHubDiscussions } from '@/lib/github'

export const metadata = { title: 'Komunitas' }

export default async function KomunitasPage() {
  const supabase = await createClient()

  // Fetch gallery posts for community grid
  const { data: gallery } = await supabase
    .from('gallery')
    .select('id, image_url, caption, created_at, likes, user_id')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(24)

  // Fetch discussions
  const discussions = await getGitHubDiscussions(
    process.env.GITHUB_OWNER ?? 'SorakuCommunity',
    process.env.GITHUB_REPO ?? 'Soraku',
    12,
  ).catch(() => [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Page header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>
            Komunitas Soraku
          </h1>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-sub)' }}>
            Bergabunglah bersama ribuan penggemar Anime dan Manga Indonesia.
          </p>
        </div>

        {/* Discord Hero Card */}
        <DiscordHeroCard />

        {/* Community content with filter tabs */}
        <KomunitasClient
          gallery={gallery ?? []}
          discussions={discussions as Record<string, unknown>[]}
        />
      </div>
    </div>
  )
}
