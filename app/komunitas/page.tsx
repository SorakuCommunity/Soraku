import { fetchDiscussions } from '@/lib/github'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { MessageSquare, ThumbsUp, Clock, Hash, Mic, Video, Calendar, Users, ExternalLink } from 'lucide-react'
import { DiscordIcon } from '@/components/icons'

export const revalidate = 60
export const metadata = { title: 'Komunitas' }

export default async function KomunitasPage() {
  const discussions = await fetchDiscussions()

  return (
    <div className="min-h-screen pt-24 pb-16">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden border-b border-soraku-border mb-12">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1400&q=80"
            alt="Komunitas" fill className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-soraku-dark/60 to-soraku-dark" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 border border-[#5865F2]/30">
            <DiscordIcon className="w-5 h-5 text-[#5865F2]" />
            <span className="text-sm font-semibold">Soraku Community</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
            Komunitas <span className="grad-text">Soraku</span>
          </h1>
          <p className="text-soraku-sub text-lg max-w-2xl mx-auto">
            Tempat berkumpul, berbagi cerita, dan bertumbuh bersama ribuan penggemar anime & manga.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">

        {/* ── Discord Community Description ── */}
        <section className="mb-16">
          <div className="glass rounded-3xl overflow-hidden border border-[#5865F2]/20">
            <div className="bg-gradient-to-r from-[#5865F2]/20 to-purple-900/20 p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <DiscordIcon className="w-8 h-8 text-[#5865F2]" />
                <h2 className="font-display text-2xl font-bold">Seru Banget di Discord Soraku!</h2>
              </div>
              <p className="text-soraku-sub mb-8 leading-relaxed max-w-3xl">
                Discord Soraku adalah rumah utama komunitas kami. Dari obrolan santai sehari-hari,
                diskusi mendalam soal anime terbaru, sampai event seru bareng — semua ada di sini!
                Bergabunglah dan rasakan kehangatan komunitas yang sesungguhnya.
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { Icon: MessageSquare, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20',
                    title: 'Text Chat', desc: 'Ratusan channel diskusi: anime, manga, gaming, fanart, meme, dan banyak lagi!' },
                  { Icon: Mic, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20',
                    title: 'Voice Chat', desc: 'Ngobrol langsung bareng member lain di voice channel. Nonton bareng, karaoke anime, dll!' },
                  { Icon: Video, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20',
                    title: 'Nonton Bareng', desc: 'Watch party anime bareng komunitas tiap minggu. Seru, rame, dan penuh reaksi lucu!' },
                  { Icon: Calendar, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20',
                    title: 'Event & Giveaway', desc: 'Kuis anime, lomba fanart, cosplay, giveaway merch — setiap bulan ada event keren!' },
                ].map(({ Icon, color, bg, title, desc }) => (
                  <div key={title} className={`glass rounded-2xl p-5 border ${bg}`}>
                    <Icon className={`w-7 h-7 ${color} mb-3`} />
                    <h3 className="font-semibold mb-2 text-sm">{title}</h3>
                    <p className="text-soraku-sub text-xs leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <a href="https://discord.gg/CJJ7KEJMbg" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-lg shadow-indigo-600/30">
                  <DiscordIcon className="w-5 h-5" />
                  Join Discord Gratis
                  <ExternalLink className="w-4 h-4" />
                </a>
                <div className="flex items-center gap-3 glass px-6 py-4 rounded-2xl border border-soraku-border">
                  <Users className="w-5 h-5 text-soraku-sub" />
                  <span className="text-sm text-soraku-sub">Lebih dari <span className="text-white font-bold">10,000+</span> anggota aktif</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── GitHub Discussions ── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-soraku-muted flex items-center justify-center">
              <Hash className="w-4 h-4 text-soraku-primary" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold">Forum Diskusi</h2>
              <p className="text-soraku-sub text-xs">Ditenagai oleh GitHub Discussions</p>
            </div>
          </div>

          {discussions.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center border border-dashed border-soraku-border">
              <MessageSquare className="w-12 h-12 text-soraku-sub/30 mx-auto mb-4" />
              <p className="text-soraku-sub mb-2">Forum diskusi belum aktif.</p>
              <p className="text-soraku-sub/60 text-sm">
                Sementara itu, gabung langsung ke{' '}
                <a href="https://discord.gg/CJJ7KEJMbg" target="_blank" rel="noopener noreferrer"
                  className="text-purple-400 hover:underline">Discord Soraku</a>{' '}
                untuk berdiskusi!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {discussions.map((d) => (
                <Link key={d.id} href={`/komunitas/${d.number}`}
                  className="glass rounded-2xl p-6 block group hover:border-purple-500/50 transition-all">
                  <div className="flex gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={d.author.avatarUrl} alt={d.author.login}
                      className="w-10 h-10 rounded-full shrink-0 object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-soraku-sub bg-soraku-muted/50 px-2 py-0.5 rounded-full">
                          {d.category.emoji} {d.category.name}
                        </span>
                      </div>
                      <h3 className="font-semibold group-hover:text-purple-400 transition-colors line-clamp-2 mb-2">
                        {d.title}
                      </h3>
                      <p className="text-soraku-sub text-sm line-clamp-2 mb-3">{d.body}</p>
                      <div className="flex items-center gap-4 text-xs text-soraku-sub flex-wrap">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />{d.comments.totalCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />{d.upvoteCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />{formatDate(d.createdAt)}
                        </span>
                        <span>oleh {d.author.login}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
