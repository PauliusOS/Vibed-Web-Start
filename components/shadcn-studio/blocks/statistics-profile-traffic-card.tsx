'use client'

import { Bar, BarChart, XAxis } from 'recharts'

import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

import { cn } from '@/lib/utils'

// Profile traffic chart data
const profileTrafficChartData = [
  { index: '01', traffic: 150 },
  { index: '02', traffic: 250 },
  { index: '03', traffic: 190 },
  { index: '04', traffic: 290 },
  { index: '05', traffic: 220 },
  { index: '06', traffic: 350 },
  { index: '07', traffic: 250 }
]

const profileTrafficChartConfig = {
  traffic: {
    label: 'Traffic'
  }
} satisfies ChartConfig

const StatisticsCardData = {
  title: '2.84k',
  description: 'Average Profile Traffic',
  children: (
    <>
      <ChartContainer config={profileTrafficChartConfig} className='h-28.75 w-full px-2.75'>
        <BarChart
          accessibilityLayer
          data={profileTrafficChartData}
          barSize={12}
          margin={{
            left: -8,
            right: -8
          }}
        >
          <XAxis
            dataKey='index'
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={value => value.slice(0, 3)}
            className='text-muted-foreground text-sm'
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Bar dataKey='traffic' fill='var(--primary)' radius={12} />
        </BarChart>
      </ChartContainer>
    </>
  ),
  changePercentage: 15
}

const StatisticsProfileTrafficCard = ({ className }: { className?: string }) => {
  return (
    <Card className={cn('gap-6', className)}>
      <CardHeader className='gap-1'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-2xl font-semibold'>{StatisticsCardData.title}</CardTitle>
          <Badge className='bg-primary/10 text-primary rounded-sm'>
            {StatisticsCardData.changePercentage > 0 ? '+' : '-'}
            {StatisticsCardData.changePercentage}%
          </Badge>
        </div>
        <CardDescription className='text-muted-foreground'>{StatisticsCardData.description}</CardDescription>
      </CardHeader>
      {StatisticsCardData.children}
    </Card>
  )
}

export default StatisticsProfileTrafficCard
