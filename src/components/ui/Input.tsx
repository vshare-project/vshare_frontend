import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 font-display tracking-wide uppercase">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{leftIcon}</div>
        )}
        <input
          className={cn(
            'w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400',
            'focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-colors',
            leftIcon && 'pl-10',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-100',
            className
          )}
          ref={ref} {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'
export { Input }
