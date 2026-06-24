export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, Star, Zap, Crown, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Premium | Soraku',
  description: 'Dukung Soraku dengan membership VIP atau VVIP dan dapatkan benefit eksklusif.',
}

const TIERS = [
  {
    name: 'Donatur',
    icon: Star,
    price: 'Bebas',
    desc: 'Donasi sukarela via Trakteer',
    color: 'border-amber-500/50',
    iconColor: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    badge: '💙',
    benefits: [
      'Badge Donatur di profil',
      'Ucapan terima kasih dari tim',
      'Akses channel Discord khusus donatur',
    ],
    cta: 'Donasi via Trakteer',
    ctaHref: '/donate',
  },
  {
    name: 'VIP',
    icon: Zap,
    price: 'Rp 25.000',
    period: '/bulan',
    desc: 'Membership bulanan untuk supporter setia',
    color: 'border-primary',
    iconColor: 'text-primary',
    bgColor: 'bg-primary/20',
    badge: '💜',
    highlight: true,
    benefits: [
      'Badge VIP di profil & Discord',
      'Akses channel Discord eksklusif VIP',
      'Priority response dari tim',
      'Early access event & konten',
      'Nama di halaman Top Donatur',
    ],
    cta: 'Mulai VIP',
    ctaHref: '#vip',
  },
  {
    name: 'VVIP',
    icon: Crown,
    price: 'Rp 75.000',
    period: '/bulan',
    desc: 'Support tertinggi untuk community builder',
    color: 'border-amber-500',
    iconColor: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    badge: '✨',
    benefits: [
      'Semua benefit VIP',
      'Badge VVIP eksklusif',
      'Role Discord khusus VVIP',
      'Request konten prioritas',
      'Mention spesial di livestream',
      'Cooldown dikitasi 2 digit',
    ],
    cta: 'Jadi VVIP',
    ctaHref: '#vvip',
  },
]

export default function PremiumPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-12 text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-md border-2 border-black bg-primary px-3 py-1.5 text-[10px] font-bold text-white shadow-[2px_2px_0px_#000]">
          <Sparkles className="h-3 w-3" />
          Membership
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tighter text-foreground sm:text-5xl">
          Dukung <span className="text-primary">Soraku</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm text-muted">
          Dukung komunitas dengan membership dan dapatkan benefit eksklusif.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`relative flex flex-col rounded-md border-2 border-black bg-surface p-6 shadow-[4px_4px_0px_#000] ${
              tier.highlight ? 'ring-2 ring-primary' : ''
            }`}
          >
            {tier.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-sm border-2 border-black bg-primary px-3 py-0.5 text-[10px] font-bold text-white shadow-[2px_2px_0px_#000]">
                TERPOPULER
              </span>
            )}
            <div className="mb-4 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-md border-2 border-black ${tier.bgColor} shadow-[2px_2px_0px_#000]`}>
                <tier.icon className={`h-5 w-5 ${tier.iconColor}`} />
              </div>
              <div>
                <h3 className="text-lg font-black text-foreground">{tier.name}</h3>
                <p className="text-xs text-muted">{tier.desc}</p>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-3xl font-black text-foreground">{tier.price}</span>
              {tier.period && (
                <span className="text-xs text-muted">{tier.period}</span>
              )}
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              {tier.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-xs text-foreground">
                  <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                  {b}
                </li>
              ))}
            </ul>

            <Link
              href={tier.ctaHref}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-md border-2 border-black px-4 py-2.5 text-xs font-bold shadow-[3px_3px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#000] ${
                tier.highlight
                  ? 'bg-primary text-white'
                  : 'bg-surface text-foreground'
              }`}
            >
              {tier.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
