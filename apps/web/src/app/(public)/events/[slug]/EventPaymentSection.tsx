"use client";

import { useState } from "react";
import { ChevronDown, QrCode, DollarSign, Download, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BCAIcon, BRIIcon, BTNIcon, SeabankIcon, DanaIcon, QRISIcon, GopayIcon,
} from "@/components/icons/custom-icons";

type PaymentMethod = {
  type: "bank" | "ewallet" | "qris";
  bank?: string; provider?: string; account?: string; name?: string;
  qrisImageUrl?: string; qrisUrl?: string;
};

const PAYMENT_ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  bca: BCAIcon, bri: BRIIcon, btn: BTNIcon, seabank: SeabankIcon,
  dana: DanaIcon, qris: QRISIcon, gopay: GopayIcon,
};

function getPaymentKey(m: PaymentMethod): string {
  if (m.type === "qris") return m.provider?.toLowerCase() ?? "qris";
  if (m.type === "bank") return (m.bank ?? "").toLowerCase();
  return (m.provider ?? "").toLowerCase();
}

export function EventPaymentSection({ methods }: { methods: PaymentMethod[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6 glass-card rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between px-4 py-3.5 hover:bg-primary/4 transition-colors"
      >
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground/50" />
          <p className="text-sm font-bold">Metode Pembayaran</p>
          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
            {methods.length}
          </span>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 text-muted-foreground/40 transition-transform duration-200",
          open && "rotate-180"
        )} />
      </button>

      {open && (
        <div className="border-t border-border/40 p-4 space-y-3">
          {methods.map((m, i) => {
            const key     = getPaymentKey(m);
            const PayIcon = PAYMENT_ICON_MAP[key] as React.FC<{ className?: string }> | undefined;

            if (m.type === "qris") return (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-border/40 bg-card/50 p-3">
                {PayIcon ? <PayIcon className="h-8 w-8 flex-shrink-0" /> : <QrCode className="h-8 w-8 flex-shrink-0 text-primary" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold">{m.provider ?? "QRIS"}</p>
                  {m.qrisUrl && (
                    <a href={m.qrisUrl} target="_blank" rel="noopener" className="flex items-center gap-1 text-xs text-primary hover:underline mt-0.5">
                      <ExternalLink className="h-3 w-3" /> Buka QRIS
                    </a>
                  )}
                </div>
                {m.qrisImageUrl && (
                  <a href={m.qrisImageUrl} download
                    className="flex-shrink-0 rounded-lg border border-border/50 p-1.5 text-muted-foreground hover:text-primary transition-colors">
                    <Download className="h-4 w-4" />
                  </a>
                )}
              </div>
            );

            return (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/50 p-3">
                {PayIcon ? <PayIcon className="h-8 w-8 flex-shrink-0" /> : <DollarSign className="h-6 w-6 flex-shrink-0 text-primary" />}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-foreground/80 truncate">{m.account}</p>
                  {m.name && <p className="text-[11px] text-muted-foreground/50 truncate">a/n {m.name}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
