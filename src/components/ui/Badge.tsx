import { cn } from '@/lib/utils'

type BadgeVariant = 'rose' | 'pink' | 'green' | 'yellow' | 'blue' | 'purple' | 'gray'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  rose: 'bg-rose-100 text-rose-700',
  pink: 'bg-pink-100 text-pink-700',
  green: 'bg-emerald-100 text-emerald-700',
  yellow: 'bg-amber-100 text-amber-700',
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  gray: 'bg-gray-100 text-gray-600',
}

export function Badge({ children, variant = 'rose', className }: BadgeProps) {
  return (
    <span className={cn('badge', variants[variant], className)}>
      {children}
    </span>
  )
}
