'use client'

import { Label, Pie, PieChart } from 'recharts'

import { Card, CardContent } from '@/components/ui/card'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

// Lead chart data
const leadChartData = [
  { month: 'january', sales: 340, fill: 'var(--color-january)' },
  { month: 'february', sales: 200, fill: 'var(--color-february)' },
  { month: 'march', sales: 200, fill: 'var(--color-march)' }
]

const leadChartConfig = {
  sales: {
    label: 'Sales'
  },
  january: {
    label: 'January',
    color: 'color-mix(in oklab, var(--primary) 60%, transparent)'
  },
  february: {
    label: 'February',
    color: 'var(--primary)'
  },
  march: {
    label: 'March',
    color: 'color-mix(in oklab, var(--primary) 20%, transparent)'
  }
} satisfies ChartConfig

const StatisticsCardData = {
  title: 'Generated leads',
  amount: '4,350',
  changePercentage: 18.2,
  children: (
    <>
      <ChartContainer config={leadChartConfig} className='h-37.5 w-full px-4.5'>
        <PieChart margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={leadChartData}
            dataKey='sales'
            nameKey='month'
            innerRadius={55}
            strokeWidth={20}
            outerRadius={75}
            paddingAngle={3}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' dominantBaseline='middle'>
                      <tspan x={viewBox.cx} y={viewBox.cy} className='fill-foreground text-xl font-medium'>
                        $23K
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </>
  )
}

const StatisticsLeadCard = ({ className }: { className?: string }) => {
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
            <span className='text-primary text-sm'>
              {StatisticsCardData.changePercentage > 0 ? '+' : '-'}
              {StatisticsCardData.changePercentage}%
            </span>
          </div>
        </div>
        <div className='h-37.5 sm:pl-6'>{StatisticsCardData.children}</div>
      </CardContent>
    </Card>
  )
}

export default StatisticsLeadCard
