import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold border-2 transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary/15 text-primary border-primary/30',
        outline: 'border-white/10 text-muted-foreground bg-transparent',
        secondary: 'bg-secondary text-secondary-foreground border-white/5',
        destructive: 'bg-destructive/15 text-destructive border-destructive/30',
        success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        donatur: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
        vip: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
        vvip: 'bg-amber-500/15 text-amber-400 border-amber-500/30 font-black',
        owner: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
        manager: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
        admin: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        agensi: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
        kreator: 'bg-primary/15 text-primary border-primary/30',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, className }))} {...props} />
}

export { badgeVariants }
