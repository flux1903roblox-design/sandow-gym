import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
  interactive?: boolean
}

export function Card({ className, interactive, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-card border border-border/70 bg-surface shadow-card',
        interactive && 'transition-transform active:scale-[0.98] cursor-pointer',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
