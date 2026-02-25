import Image from 'next/image'
import { Heart, Users, Globe, Sparkles } from 'lucide-react'

export const metadata = { title: 'Tentang Kami' }

export default function TentangPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden mb-16">
          <Image src="https://images.unsplash.com/photo-1535016120720-40c646be5580?w=1200&q=80" alt="About" width={1200} height={400} className="w-full h-72 object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-soraku-dark via-soraku-dark/85 to-transparent flex items-center px-12">
            <div>
              <h1 className="font-display text-5xl font-bold mb-4">Tentang <span className="grad-text">Soraku</span></h1>
              <p className="text-soraku-sub text-lg max-w-lg">Platform komunitas untuk penggemar Anime, Manga, dan Budaya Digital Jepang.</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold mb-6">Kisah Kami</h2>
            <div className="space-y-4 text-soraku-sub leading-relaxed text-sm">
              <p>Soraku lahir dari impian sederhana: menciptakan ruang digital di mana penggemar anime dan manga dapat berkumpul, berbagi, dan tumbuh bersama.</p>
              <p>Nama "Soraku" terinspirasi dari harmoni bahasa Jepang — mencerminkan nilai inti platform ini: kreativitas, komunitas, dan semangat berbagi.</p>
              <p>Kami percaya setiap penggemar memiliki cerita yang layak didengar dan setiap kreator berhak mendapat tempat untuk berkarya.</p>
            </div>
          </div>
          <div className="glass rounded-2xl p-8 border border-purple-500/20">
            <div className="grid grid-cols-2 gap-6">
              {[['2024', 'Tahun Berdiri'], ['10K+', 'Anggota'], ['5K+', 'Karya'], ['∞', 'Semangat']].map(([n, l]) => (
                <div key={l} className="text-center">
                  <div className="font-display text-3xl font-bold grad-text">{n}</div>
                  <div className="text-soraku-sub text-sm mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Heart, title: 'Passion', desc: 'Didorong kecintaan terhadap anime & manga.' },
            { icon: Users, title: 'Komunitas', desc: 'Ruang aman dan inklusif bagi semua.' },
            { icon: Globe, title: 'Budaya', desc: 'Merayakan keindahan budaya digital Jepang.' },
            { icon: Sparkles, title: 'Kreativitas', desc: 'Mendorong ekspresi kreatif seluruh komunitas.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass rounded-2xl p-6 text-center hover:border-purple-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-soraku-sub text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
