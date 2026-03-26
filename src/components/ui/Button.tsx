import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium font-display transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        default:   'bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-green-200',
        outline:   'border border-brand-600 bg-transparent text-brand-600 hover:bg-brand-50',
        ghost:     'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        danger:    'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100',
        secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      },
      size: {
        sm:   'h-8 px-3 text-xs',
        md:   'h-10 px-4',
        lg:   'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref}
        disabled={loading || props.disabled} {...props}>
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        )}
        {children}
      </Comp>
    )
  }
)
Button.displayName = 'Button'
export { Button, buttonVariants }
