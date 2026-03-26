import { cn } from '@/utils/cn'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default'

const variants: Record<BadgeVariant, string> = {
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  danger:  'bg-red-50 text-red-600 border-red-200',
  info:    'bg-blue-50 text-blue-700 border-blue-200',
  default: 'bg-gray-100 text-gray-600 border-gray-200',
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> { variant?: BadgeVariant }

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border', variants[variant], className)}
      {...props} />
  )
}
