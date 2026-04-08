'use client'

import { useEffect, useState } from 'react'
import { CreditCard, Check, Zap, Crown, Star, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Subscription {
  plan: 'free' | 'pro' | 'premium'
  status: 'active' | 'canceled' | 'expired' | null
  current_period_end: string | null
}

const PLANS = [
  {
    id: 'free',
    name: 'Gratis',
    price: 0,
    icon: Zap,
    color: 'text-muted-foreground/60',
    features: [
      'Akses komunitas dasar',
      'Posting blog mingguan',
      'Partisipasi event',
      'Galeri foto',
    ],
    notIncluded: ['Fitur premium', 'Prioritas support', 'Analitik lanjutan'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49000,
    icon: Crown,
    color: 'text-amber-400',
    popular: true,
    features: [
      'Semua fitur Gratis',
      'Akses konten eksklusif',
      'Priority support',
      'Analitik advance',
      'Badge & role khusus',
      'Early access fitur baru',
    ],
    notIncluded: ['Full API access'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 149000,
    icon: Star,
    color: 'text-purple-400',
    features: [
      'Semua fitur Pro',
      'Full API access',
      'Konsultasi bulanan',
      'Private Discord channel',
      'Feature request优先',
      'White-label options',
    ],
    notIncluded: [],
  },
]

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/billing/subscription', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setSubscription(d.data ?? null))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleCheckout = async (planId: string) => {
    setCheckoutLoading(planId)
    try {
      const res = await fetch('/api/admin/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (e) {
      console.error(e)
    }
    setCheckoutLoading(null)
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-primary/40 mb-1 text-[9px] font-black tracking-[0.25em] uppercase">
          Subscription
        </p>
        <h1 className="text-2xl font-black tracking-tight">Billing & Plan</h1>
      </div>

      {/* Separator */}
      <div className="from-primary/20 via-border/25 -mt-4 h-px bg-gradient-to-r to-transparent" />

      {/* Current Plan */}
      {subscription && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground/40 mb-2 text-xs font-semibold tracking-wider uppercase">
                Plan Saat Ini
              </p>
              <div className="flex items-center gap-3">
                {(() => {
                  const plan = PLANS.find((p) => p.id === subscription.plan)
                  return (
                    <>
                      {plan && <plan.icon className={cn('h-5 w-5', plan.color)} />}
                      <span className="text-foreground text-xl font-black">
                        {plan?.name ?? 'Free'}
                      </span>
                    </>
                  )
                })()}
              </div>
              {subscription.status && (
                <p className="text-muted-foreground/40 mt-2 text-sm">
                  Status:{' '}
                  <span
                    className={cn(
                      'capitalize',
                      subscription.status === 'active' && 'text-emerald-400',
                      subscription.status === 'canceled' && 'text-amber-400',
                      subscription.status === 'expired' && 'text-red-400'
                    )}
                  >
                    {subscription.status}
                  </span>
                  {subscription.current_period_end && subscription.status === 'active' && (
                    <> · Berakhir {formatDate(subscription.current_period_end)}</>
                  )}
                </p>
              )}
            </div>
            {subscription.plan !== 'free' && (
              <button className="text-foreground rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/[0.04]">
                Kelola
              </button>
            )}
          </div>
        </div>
      )}

      {/* Plans */}
      <div>
        <p className="text-muted-foreground/30 mb-4 text-[9px] font-black tracking-[0.25em] uppercase">
          Pilih Plan
        </p>
        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => {
            const isCurrent = subscription?.plan === plan.id
            return (
              <div
                key={plan.id}
                className={cn(
                  'relative rounded-2xl border bg-white/[0.02] p-6 transition-all',
                  plan.popular
                    ? 'border-[#4FA3D1]/30 bg-[#4FA3D1]/[0.02]'
                    : 'border-white/[0.06] hover:border-white/[0.1]'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-[#4FA3D1] px-3 py-1 text-[10px] font-black tracking-wider text-white">
                      POPULAR
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="mb-2 flex items-center gap-2">
                    <plan.icon className={cn('h-5 w-5', plan.color)} />
                    <span className="text-foreground text-lg font-black">{plan.name}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-foreground text-3xl font-black">
                      {plan.price.toLocaleString('id-ID')}
                    </span>
                    <span className="text-muted-foreground/40 text-sm">/bulan</span>
                  </div>
                </div>

                <div className="mb-6 space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                      <span className="text-foreground/70 text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <div className="border-muted-foreground/20 h-4 w-4 flex-shrink-0 rounded-full border" />
                      <span className="text-muted-foreground/30 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => !isCurrent && handleCheckout(plan.id)}
                  disabled={isCurrent || checkoutLoading === plan.id}
                  className={cn(
                    'flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all',
                    isCurrent
                      ? 'text-muted-foreground/40 cursor-default bg-white/[0.04]'
                      : plan.popular
                        ? 'bg-[#4FA3D1] text-white hover:bg-[#4FA3D1]/90'
                        : 'text-foreground border border-white/[0.08] hover:bg-white/[0.04]'
                  )}
                >
                  {checkoutLoading === plan.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isCurrent ? (
                    'Plan Aktif'
                  ) : (
                    <>
                      Pilih Plan <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Payment Info */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/10 bg-amber-500/[0.02] p-4">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" />
        <div>
          <p className="text-sm font-semibold text-amber-400/80">Informasi Pembayaran</p>
          <p className="text-muted-foreground/50 mt-1 text-xs">
            Pembayaran diproses melalui Paddle. Metode: Virtual Account, E-Wallet, Kartu Kredit.
          </p>
        </div>
      </div>
    </div>
  )
}
