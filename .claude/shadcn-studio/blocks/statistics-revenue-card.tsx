'use client'

import { Bar, BarChart, XAxis } from 'recharts'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

// Revenue chart data
const revenueChartData = [
  { day: 'Monday', revenue: 150, fill: 'color-mix(in oklab, var(--primary) 20%, transparent)' },
  { day: 'Tuesday', revenue: 250, fill: 'color-mix(in oklab, var(--primary) 20%, transparent)' },
  { day: 'Wednesday', revenue: 190, fill: 'color-mix(in oklab, var(--primary) 20%, transparent)' },
  { day: 'Thursday', revenue: 290 },
  { day: 'Friday', revenue: 220, fill: 'color-mix(in oklab, var(--primary) 20%, transparent)' },
  { day: 'Saturday', revenue: 350, fill: 'color-mix(in oklab, var(--primary) 20%, transparent)' },
  { day: 'Sunday', revenue: 250, fill: 'color-mix(in oklab, var(--primary) 20%, transparent)' }
]

const revenueChartConfig = {
  revenue: {
    label: 'Revenue'
  }
} satisfies ChartConfig

const StatisticsCardData = {
  title: 'Revenue Growth',
  amount: '$3,234',
  changePercentage: 15,
  children: (
    <>
      <ChartContainer config={revenueChartConfig} className='size-full'>
        <BarChart
          accessibilityLayer
          data={revenueChartData}
          barSize={12}
          margin={{
            left: -8,
            right: -8
          }}
        >
          <XAxis
            dataKey='day'
            tickLine={false}
            tickMargin={5.5}
            axisLine={false}
            tickFormatter={value => value.slice(0, 1)}
            className='text-muted-foreground text-sm'
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Bar dataKey='revenue' fill='var(--primary)' radius={12} />
        </BarChart>
      </ChartContainer>
    </>
  )
}

const StatisticsRevenueCard = ({ className }: { className?: string }) => {
  return (
    <Card className={className}>
      <CardContent className='flex justify-between gap-6 max-sm:flex-col sm:items-center'>
        <div className='flex shrink-0 grow flex-col gap-6'>
          <div className='flex flex-col gap-1'>
            <span className='font-semibold'>{StatisticsCardData.title}</span>
            <span className='text-muted-foreground text-sm'>Weekly Report</span>
          </div>
          <div className='flex flex-col gap-2'>
            <span className='text-2xl font-semibold'>{StatisticsCardData.amount}</span>
            <Badge className='bg-primary/10 text-primary rounded-sm'>
              {StatisticsCardData.changePercentage > 0 ? '+' : '-'}
              {StatisticsCardData.changePercentage}%
            </Badge>
          </div>
        </div>
        <div className='h-37.5 sm:pl-6'>{StatisticsCardData.children}</div>
      </CardContent>
    </Card>
  )
}

export default StatisticsRevenueCard
