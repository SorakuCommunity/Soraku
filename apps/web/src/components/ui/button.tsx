import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-bold transition-all border-2 border-black/10 press-effect focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-[3px_3px_0px_rgba(37,99,235,0.3)] hover:shadow-[5px_5px_0px_rgba(37,99,235,0.4)] hover:translate-x-[-1px] hover:translate-y-[-1px]',
        outline:
          'bg-transparent text-foreground border-white/10 hover:bg-white/5 hover:border-white/20 shadow-[3px_3px_0px_rgba(0,0,0,0.3)] hover:shadow-[5px_5px_0px_rgba(0,0,0,0.4)] hover:translate-x-[-1px] hover:translate-y-[-1px]',
        ghost:
          'border-transparent bg-transparent hover:bg-white/5 shadow-none',
        destructive:
          'bg-destructive text-white border-destructive/30 shadow-[3px_3px_0px_rgba(239,68,68,0.3)] hover:shadow-[5px_5px_0px_rgba(239,68,68,0.4)]',
        gold:
          'bg-amber-500 text-white border-amber-600/30 shadow-[3px_3px_0px_rgba(245,158,11,0.3)] hover:shadow-[5px_5px_0px_rgba(245,158,11,0.4)]',
        link: 'text-primary underline-offset-4 hover:underline p-0 h-auto border-0 shadow-none',
      },
      size: {
        sm: 'h-8 px-4 text-xs rounded',
        md: 'h-10 px-5 text-sm rounded-md',
        lg: 'h-12 px-7 text-base rounded-md',
        icon: 'h-10 w-10 rounded-md',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { buttonVariants }
