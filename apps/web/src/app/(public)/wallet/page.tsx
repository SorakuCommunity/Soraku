import type { Metadata } from 'next'
import Link from 'next/link'
import { Wallet, ArrowRight, Plus, History } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Wallet',
  description: 'Soraku wallet — manage your balance and transactions.',
}

export default function WalletPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="mb-2 text-xs font-bold tracking-widest text-primary/70 uppercase">Wallet</p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Your <span className="text-gradient">Balance</span>
        </h1>
      </div>

      {/* Balance Card */}
      <div className="mb-6 rounded-md border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-card p-8 shadow-[4px_4px_0px_rgba(37,99,235,0.15)]">
        <p className="mb-1 text-xs text-muted-foreground/60">Available Balance</p>
        <p className="mb-5 text-4xl font-black text-foreground">Rp 0</p>
        <div className="flex gap-3">
          <Link href="/donate"
            className="flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-[2px_2px_0px_rgba(37,99,235,0.3)] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px]">
            <Plus className="h-4 w-4" /> Top Up
          </Link>
          <Link href="#"
            className="flex items-center gap-2 rounded-md border-2 border-white/10 px-5 py-2.5 text-xs font-bold text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground">
            <History className="h-4 w-4" /> History
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-md border-2 border-white/[0.07] bg-card p-6 shadow-[3px_3px_0px_rgba(37,99,235,0.1)]">
        <h2 className="mb-2 text-base font-black text-foreground">What is Soraku Wallet?</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Use your wallet to donate to creators, purchase premium features, and support the community.
          Funds can be added via bank transfer or e-wallet.
        </p>
        <Link href="/donate"
          className="inline-flex items-center gap-2 text-xs font-bold text-primary transition-colors hover:underline">
          Learn more <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  )
}
