import type { ReactNode } from 'react'
import Link from 'next/link'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Statistics card data type
type StatisticsCardProps = {
  icon: ReactNode
  value: string
  title: string
  changePercentage?: string
  changeLabel?: string
  isPositive?: boolean
  className?: string
  href?: string
  colorScheme?: 'default' | 'green' | 'blue' | 'purple' | 'orange' | 'red'
}

const colorVariants = {
  default: 'bg-primary/10 text-primary',
  green: 'bg-green-500/10 text-green-500',
  blue: 'bg-blue-500/10 text-blue-500',
  purple: 'bg-purple-500/10 text-purple-500',
  orange: 'bg-orange-500/10 text-orange-500',
  red: 'bg-red-500/10 text-red-500',
}

const StatisticsCard = ({
  icon,
  value,
  title,
  changePercentage,
  changeLabel = 'vs last month',
  isPositive = true,
  className,
  href,
  colorScheme = 'default'
}: StatisticsCardProps) => {
  const content = (
    <Card className={cn(
      'gap-4 transition-all duration-200',
      href && 'hover:bg-muted/50 hover:shadow-md cursor-pointer',
      className
    )}>
      <CardHeader className='flex items-center'>
        <div className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-lg',
          colorVariants[colorScheme]
        )}>
          {icon}
        </div>
        <span className='text-2xl font-bold'>{value}</span>
      </CardHeader>
      <CardContent className='flex flex-col gap-1'>
        <span className='font-medium text-muted-foreground'>{title}</span>
        {changePercentage && (
          <p className='flex items-center gap-1.5'>
            <span className={cn(
              'text-sm font-medium',
              isPositive ? 'text-green-500' : 'text-red-500'
            )}>
              {isPositive ? '+' : ''}{changePercentage}
            </span>
            <span className='text-muted-foreground text-xs'>{changeLabel}</span>
          </p>
        )}
      </CardContent>
    </Card>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}

export default StatisticsCard
