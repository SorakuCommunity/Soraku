import * as React from 'react'
import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'border-2 border-white/10 bg-background text-foreground placeholder:text-muted-foreground/50 flex h-10 w-full rounded-md px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:border-primary focus-visible:shadow-[0_0_0_1px_var(--primary)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-colors',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
