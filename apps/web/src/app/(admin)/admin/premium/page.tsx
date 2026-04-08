'use client'

import { useEffect, useState } from 'react'
import { Sparkles, Crown, Zap, Check, ArrowRight, Lock, Star, Gem } from 'lucide-react'
import { cn } from '@/lib/utils'

const BENEFITS = [
  {
    category: 'Konten Eksklusif',
    icon: Star,
    items: [
      'Artikel premium & tutorial',
      'Behind-the-scenes content',
      'Early access ke konten baru',
    ],
  },
  {
    category: 'Fitur Khusus',
    icon: Gem,
    items: ['Analytics dashboard lanjutan', 'Custom profile themes', 'Priority indexing search'],
  },
  {
    category: 'Komunitas',
    icon: Crown,
    items: ['Private Discord channel', 'Direct support dari team', 'Exclusive events & giveaway'],
  },
]

const COMPARISONS = [
  { feature: 'Artikel & Blog', free: true, pro: true, premium: true },
  { feature: 'Event Participation', free: true, pro: true, premium: true },
  { feature: 'Gallery Upload', free: true, pro: true, premium: true },
  { feature: 'Analytics Dashboard', free: false, pro: true, premium: true },
  { feature: 'Custom Profile Theme', free: false, pro: true, premium: true },
  { feature: 'Priority Support', free: false, pro: true, premium: true },
  { feature: 'Private Discord', free: false, pro: false, premium: true },
  { feature: 'API Access', free: false, pro: false, premium: true },
]

export default function PremiumPage() {
  const [userPlan, setUserPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/billing/subscription', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setUserPlan(d.data?.plan ?? 'free'))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center">
        <p className="text-primary/40 mb-1 text-[9px] font-black tracking-[0.25em] uppercase">
          Upgrade
        </p>
        <h1 className="text-3xl font-black tracking-tight">Soraku Premium</h1>
        <p className="text-muted-foreground/60 mx-auto mt-4 max-w-lg text-sm">
          Tingkatkan pengalamanmu dengan fitur eksklusif dan akses premium.
        </p>
      </div>

      {/* Separator */}
      <div className="from-primary/20 via-border/25 h-px bg-gradient-to-r to-transparent" />

      {/* Benefits */}
      {BENEFITS.map((section) => (
        <div key={section.category}>
          <div className="mb-4 flex items-center gap-2">
            <section.icon className="h-4 w-4 text-[#4FA3D1]" />
            <p className="text-sm font-bold text-[#D9DDE3]">{section.category}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {section.items.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
              >
                <Check className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                <span className="text-foreground/70 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Comparison Table */}
      <div>
        <p className="text-muted-foreground/30 mb-4 text-[9px] font-black tracking-[0.25em] uppercase">
          Perbandingan
        </p>
        <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-4 py-3 text-left text-[10px] font-black tracking-[0.15em] text-[#6E8FA6] uppercase">
                  Fitur
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-black tracking-[0.15em] text-[#6E8FA6] uppercase">
                  Free
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-black tracking-[0.15em] text-[#6E8FA6] uppercase">
                  Pro
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-black tracking-[0.15em] text-[#6E8FA6] uppercase">
                  Premium
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISONS.map((row) => (
                <tr key={row.feature} className="border-b border-white/[0.06] last:border-0">
                  <td className="text-foreground/70 px-4 py-3 text-sm">{row.feature}</td>
                  <td className="px-4 py-3 text-center">
                    {row.free ? (
                      <Check className="mx-auto h-4 w-4 text-emerald-400" />
                    ) : (
                      <Lock className="text-muted-foreground/20 mx-auto h-3.5 w-3.5" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.pro ? (
                      <Check className="mx-auto h-4 w-4 text-emerald-400" />
                    ) : (
                      <Lock className="text-muted-foreground/20 mx-auto h-3.5 w-3.5" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.premium ? (
                      <Check className="mx-auto h-4 w-4 text-emerald-400" />
                    ) : (
                      <Lock className="text-muted-foreground/20 mx-auto h-3.5 w-3.5" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA */}
      {!loading && userPlan === 'free' && (
        <div className="rounded-2xl border border-[#4FA3D1]/20 bg-[#4FA3D1]/[0.02] p-6 text-center">
          <Sparkles className="mx-auto mb-3 h-8 w-8 text-[#4FA3D1]" />
          <p className="text-foreground mb-2 text-lg font-bold">Siap untuk upgrade?</p>
          <p className="text-muted-foreground/50 mb-4 text-sm">
            Pilih plan yang sesuai dengan kebutuhanmu.
          </p>
          <a
            href="/admin/billing"
            className="inline-flex items-center gap-2 rounded-xl bg-[#4FA3D1] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#4FA3D1]/90"
          >
            Lihat Plan <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      )}
    </div>
  )
}
