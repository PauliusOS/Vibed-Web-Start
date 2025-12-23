import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { Cursor, CursorFollow, CursorProvider } from '@/components/ui/cursor'
import { MotionPreset } from '@/components/ui/motion-preset'

type Features = {
  title: string
  subtitle: string
  image: string
  imageAlt: string
  cursorText: string
  description: string
}[]

const Features = ({ featuresData }: { featuresData: Features }) => {
  return (
    <section className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-12 space-y-4 text-center sm:mb-16 lg:mb-24'>
          <MotionPreset fade blur slide={{ direction: 'up', offset: 50 }} transition={{ duration: 0.5 }}>
            <Badge className='text-sm font-normal' variant='outline'>
              Best features
            </Badge>
          </MotionPreset>

          <MotionPreset
            component='h2'
            className='text-2xl font-semibold md:text-3xl lg:text-4xl'
            fade
            blur
            slide={{ direction: 'up', offset: 50 }}
            delay={0.3}
            transition={{ duration: 0.5 }}
          >
            Meet shadcn/studio, the most sleek & powerful UI Kit
          </MotionPreset>
        </div>

        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {featuresData.map((item, index) => (
            <MotionPreset
              key={index}
              fade
              blur
              slide={{ direction: 'up', offset: 40 }}
              delay={0.6 + index * 0.15}
              transition={{ duration: 0.7 }}
            >
              <Card className='group hover:border-primary transition-all duration-300 max-lg:last:col-span-full'>
                <CardHeader className='gap-3'>
                  <CardTitle className='group-hover:text-primary text-lg font-semibold transition-colors duration-300'>
                    {item.title}
                  </CardTitle>
                  <CardDescription className='text-base'>{item.subtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='bg-primary flex h-59 w-full items-center justify-center rounded-md px-9'>
                    <img src={item.image} alt={item.imageAlt} className='max-h-52 w-full object-contain dark:hidden' />
                    <img
                      src={`${item.image.replace('.png', '-dark.png')}`}
                      alt={item.imageAlt}
                      className='hidden max-h-52 w-full object-contain dark:inline-block'
                    />

                    <CursorProvider>
                      <Cursor>
                        <svg
                          className='size-6 text-sky-600 dark:text-sky-400'
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 40 40'
                        >
                          <path
                            fill='currentColor'
                            d='M1.8 4.4 7 36.2c.3 1.8 2.6 2.3 3.6.8l3.9-5.7c1.7-2.5 4.5-4.1 7.5-4.3l6.9-.5c1.8-.1 2.5-2.4 1.1-3.5L5 2.5c-1.4-1.1-3.5 0-3.3 1.9Z'
                          />
                        </svg>
                      </Cursor>
                      <CursorFollow>
                        <div className='rounded-lg bg-sky-600 px-2 py-1 text-sm text-white shadow-lg dark:bg-sky-400'>
                          {item.cursorText}
                        </div>
                      </CursorFollow>
                    </CursorProvider>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className='text-muted-foreground'>{item.description}</p>
                </CardFooter>
              </Card>
            </MotionPreset>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
