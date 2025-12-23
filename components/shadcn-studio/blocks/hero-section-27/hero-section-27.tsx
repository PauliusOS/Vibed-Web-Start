import * as motion from 'motion/react-client'

import { ArrowRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { BounceButton } from '@/components/ui/bounce-button'
import { MotionPreset } from '@/components/ui/motion-preset'
import { Marquee } from '@/components/ui/marquee'
import { Magnetic } from '@/components/ui/magnet-effect'

import { cn } from '@/lib/utils'

type AvatarProps = {
  src: string
  fallback: string
  name: string
  duration: number
  className?: string
  sizeClass: string
}

const HeroSection = ({ avatarMotion }: { avatarMotion: AvatarProps[] }) => {
  return (
    <section className='flex-1 overflow-hidden pt-32 pb-8 sm:pb-16 lg:pb-24'>
      <div className='relative mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 sm:gap-16 sm:px-6 lg:gap-24 lg:px-8'>
        {/* Hero Content */}
        <div className='flex max-w-3xl flex-col items-center gap-4 text-center'>
          <MotionPreset fade slide={{ direction: 'down', offset: 50 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
            <Badge variant='outline' className='text-sm font-normal'>
              Check new updates
            </Badge>
          </MotionPreset>

          <MotionPreset
            component='h1'
            fade
            slide={{ direction: 'down', offset: 50 }}
            delay={0.3}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className='text-2xl font-semibold sm:text-3xl lg:text-5xl lg:font-bold'
          >
            Design High-Quality Websites
          </MotionPreset>

          <MotionPreset
            component='p'
            fade
            slide={{ direction: 'down', offset: 50 }}
            delay={0.6}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className='text-muted-foreground max-w-2xl text-xl'
          >
            Craft stunning websites faster with our UI kit. Access polished, fully customisable components and layouts
            for a smooth, visually striking UX.
          </MotionPreset>

          <MotionPreset
            fade
            slide={{ direction: 'down', offset: 50 }}
            delay={0.9}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className='flex flex-wrap items-center gap-4'
          >
            <BounceButton className='z-10 h-10 gap-3 rounded-lg text-base has-[>svg]:px-6'>
              <a href='#' className='flex items-center gap-2'>
                Start Building now <ArrowRightIcon />
              </a>
            </BounceButton>
            <Button size='lg' asChild className='bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-base'>
              <a href='#'>Sign up</a>
            </Button>
          </MotionPreset>

          <MotionPreset
            fade
            slide={{ direction: 'down', offset: 50 }}
            delay={1}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className='bg-background mt-12 flex items-center rounded-full border p-1.5 shadow-sm'
          >
            {' '}
            <div className='flex -space-x-2'>
              <Avatar className='ring-background size-10.5 ring-2'>
                <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png' alt='Olivia Sparks' />
                <AvatarFallback>OS</AvatarFallback>
              </Avatar>
              <Avatar className='ring-background size-10.5 ring-2'>
                <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png' alt='Howard Lloyd' />
                <AvatarFallback>HL</AvatarFallback>
              </Avatar>
              <Avatar className='ring-background size-10.5 ring-2'>
                <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png' alt='Hallie Richards' />
                <AvatarFallback>HR</AvatarFallback>
              </Avatar>
              <Avatar className='ring-background size-10.5 ring-2'>
                <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png' alt='Jenny Wilson' />
                <AvatarFallback>JW</AvatarFallback>
              </Avatar>
            </div>
            <p className='text-muted-foreground px-2 text-xs'>
              Loved by <span className='text-primary'>+23k</span> more people
            </p>
          </MotionPreset>
        </div>
        <div className='relative w-full max-w-5xl'>
          <div className='from-background pointer-events-none absolute inset-y-0 left-0 z-1 w-15 bg-gradient-to-r via-85% to-transparent' />
          <div className='from-background pointer-events-none absolute inset-y-0 right-0 z-1 w-15 bg-gradient-to-l via-85% to-transparent' />
          <MotionPreset fade slide={{ direction: 'down', offset: 50 }} delay={1.1} transition={{ duration: 0.5 }}>
            <Marquee pauseOnHover duration={20} reverse gap={4} className='*:items-center'>
              <img
                src='https://cdn.shadcnstudio.com/ss-assets/brand-logo/um-logo.png'
                alt='University of Mississippi'
                className='h-7.5 w-auto shrink-0 object-contain opacity-60 invert dark:invert-0'
              />
              <img
                src='https://cdn.shadcnstudio.com/ss-assets/brand-logo/star-helth-logo.png'
                alt='Star Health'
                className='h-9 w-auto shrink-0 object-contain opacity-60 invert dark:invert-0'
              />
              <img
                src='https://cdn.shadcnstudio.com/ss-assets/brand-logo/dhl-logo.png'
                alt='DHL'
                className='h-4 w-auto shrink-0 object-contain opacity-60 invert dark:invert-0'
              />
              <img
                src='https://cdn.shadcnstudio.com/ss-assets/brand-logo/sense-arena-logo.png'
                alt='Sense Arena'
                className='h-11 w-auto shrink-0 object-contain opacity-60 invert dark:invert-0'
              />
              <img
                src='https://cdn.shadcnstudio.com/ss-assets/brand-logo/shemaroo-logo.png'
                alt='Shemaroo'
                className='h-10 w-auto shrink-0 object-contain opacity-60 invert dark:invert-0'
              />
              <img
                src='https://cdn.shadcnstudio.com/ss-assets/brand-logo/mercedes-benz-logo.png'
                alt='Mercedes Benz'
                className='h-7.5 w-auto shrink-0 object-contain opacity-60 invert dark:invert-0'
              />
            </Marquee>
          </MotionPreset>
        </div>

        {/* Left Avatars */}
        <MotionPreset fade delay={1.4}>
          {avatarMotion.map((item, index) => (
            <motion.div
              key={index}
              className={cn('max-lg:hidden', item.className)}
              initial={{ scale: 1.2 }}
              animate={{ scale: [1.2, 1.0, 1.2] }}
              transition={{
                duration: 3,
                delay: Math.random() * 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <Magnetic strength={0.5} range={120}>
                <Avatar className={cn('ring-background ring-2', item.sizeClass)}>
                  <AvatarImage src={item.src} alt={item.name} />
                  <AvatarFallback>{item.fallback}</AvatarFallback>
                </Avatar>
              </Magnetic>
            </motion.div>
          ))}
        </MotionPreset>
      </div>
    </section>
  )
}

export default HeroSection
