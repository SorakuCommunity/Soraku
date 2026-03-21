'use client'

import { useState } from 'react'
import { ChevronDown, QrCode, DollarSign, Download, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  BCAIcon,
  BRIIcon,
  BTNIcon,
  SeabankIcon,
  DanaIcon,
  QRISIcon,
  GopayIcon,
} from '@/components/icons/custom-icons'

type PaymentMethod = {
  type: 'bank' | 'ewallet' | 'qris'
  bank?: string
  provider?: string
  account?: string
  name?: string
  qrisImageUrl?: string
  qrisUrl?: string
}

const PAYMENT_ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  bca: BCAIcon,
  bri: BRIIcon,
  btn: BTNIcon,
  seabank: SeabankIcon,
  dana: DanaIcon,
  qris: QRISIcon,
  gopay: GopayIcon,
}

function getPaymentKey(m: PaymentMethod): string {
  if (m.type === 'qris') return m.provider?.toLowerCase() ?? 'qris'
  if (m.type === 'bank') return (m.bank ?? '').toLowerCase()
  return (m.provider ?? '').toLowerCase()
}

export function EventPaymentSection({ methods }: { methods: PaymentMethod[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="glass-card mt-6 overflow-hidden rounded-2xl">
      <button
        onClick={() => setOpen((o) => !o)}
        className="hover:bg-primary/4 flex w-full items-center justify-between px-4 py-3.5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <DollarSign className="text-muted-foreground/50 h-4 w-4" />
          <p className="text-sm font-bold">Metode Pembayaran</p>
          <span className="bg-primary/15 text-primary rounded-full px-2 py-0.5 text-[10px] font-bold">
            {methods.length}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'text-muted-foreground/40 h-4 w-4 transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
        <div className="border-border/40 space-y-3 border-t p-4">
          {methods.map((m, i) => {
            const key = getPaymentKey(m)
            const PayIcon = PAYMENT_ICON_MAP[key] as React.FC<{ className?: string }> | undefined

            if (m.type === 'qris')
              return (
                <div
                  key={i}
                  className="border-border/40 bg-card/50 flex items-start gap-3 rounded-xl border p-3"
                >
                  {PayIcon ? (
                    <PayIcon className="h-8 w-8 flex-shrink-0" />
                  ) : (
                    <QrCode className="text-primary h-8 w-8 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">{m.provider ?? 'QRIS'}</p>
                    {m.qrisUrl && (
                      <a
                        href={m.qrisUrl}
                        target="_blank"
                        rel="noopener"
                        className="text-primary mt-0.5 flex items-center gap-1 text-xs hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" /> Buka QRIS
                      </a>
                    )}
                  </div>
                  {m.qrisImageUrl && (
                    <a
                      href={m.qrisImageUrl}
                      download
                      className="border-border/50 text-muted-foreground hover:text-primary flex-shrink-0 rounded-lg border p-1.5 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  )}
                </div>
              )

            return (
              <div
                key={i}
                className="border-border/40 bg-card/50 flex items-center gap-3 rounded-xl border p-3"
              >
                {PayIcon ? (
                  <PayIcon className="h-8 w-8 flex-shrink-0" />
                ) : (
                  <DollarSign className="text-primary h-6 w-6 flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-foreground/80 truncate text-sm font-bold">{m.account}</p>
                  {m.name && (
                    <p className="text-muted-foreground/50 truncate text-[11px]">a/n {m.name}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
