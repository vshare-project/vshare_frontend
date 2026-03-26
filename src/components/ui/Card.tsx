import { cn } from '@/utils/cn'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> { glow?: boolean }

export function Card({ className, glow, ...props }: CardProps) {
  return (
    <div className={cn('bg-white border border-gray-100 rounded-2xl shadow-sm', glow && 'glow', className)}
      {...props} />
  )
}
export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pb-0', className)} {...props} />
}
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6', className)} {...props} />
}
