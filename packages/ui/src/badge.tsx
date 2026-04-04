import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "./utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/15 text-primary border border-primary/25",
        outline: "border border-border text-muted-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive/15 text-destructive border border-destructive/25",
        donatur: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
        vip: "bg-violet-500/15 text-violet-400 border border-violet-500/30",
        vvip: "glass-gold text-amber-400 text-gradient-gold font-bold",
        owner: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
        manager: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
        admin: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
        agensi: "bg-teal-500/15 text-teal-400 border border-teal-500/30",
        kreator: "bg-primary/15 text-primary border border-primary/25",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, className }))} {...props} />
}

export { badgeVariants }
