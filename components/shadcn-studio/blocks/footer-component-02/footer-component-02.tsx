import { ArrowRightIcon, GithubIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import Logo from '@/components/shadcn-studio/logo'

const Footer = () => {
  return (
    <footer>
      <div className='mx-auto grid max-w-7xl grid-cols-6 gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-16 md:py-24'>
        <div className='col-span-full flex flex-col items-start gap-4 lg:col-span-2'>
          <a href='#'>
            <Logo className='gap-3' />
          </a>
          <p className='text-muted-foreground'>
            An open-source collection of copy-and-paste shadcn components, blocks, and templates - paired with a
            powerful theme generator to craft, customize, and ship faster.
          </p>
          <Separator className='!w-35' />
          <div className='flex items-center gap-4'>
            <a href='#' target='#'>
              <GithubIcon className='size-5' />
            </a>
            <a href='#' target='#'>
              <InstagramIcon className='size-5 text-sky-600 dark:text-sky-400' />
            </a>
            <a href='#' target='#'>
              <TwitterIcon className='size-5 text-amber-600 dark:text-amber-400' />
            </a>
            <a href='#' target='#'>
              <YoutubeIcon className='text-destructive size-5' />
            </a>
          </div>
        </div>
        <div className='col-span-full grid grid-cols-2 gap-6 sm:grid-cols-4 lg:col-span-4 lg:gap-8'>
          <div className='flex flex-col gap-5'>
            <div className='text-lg font-medium'>Company</div>
            <ul className='text-muted-foreground space-y-3'>
              <li>
                <a href='#'>About</a>
              </li>
              <li>
                <a href='#'>Features</a>
              </li>
              <li>
                <a href='#'>Works</a>
              </li>
              <li>
                <a href='#'>Career</a>
              </li>
            </ul>
          </div>
          <div className='flex flex-col gap-5'>
            <div className='text-lg font-medium'>Help</div>
            <ul className='text-muted-foreground space-y-3'>
              <li>
                <a href='#'>Customer Support</a>
              </li>
              <li>
                <a href='#'>Delivery Details</a>
              </li>
              <li>
                <a href='#'>Terms & Conditions</a>
              </li>
              <li>
                <a href='#'>Privacy Policy</a>
              </li>
            </ul>
          </div>
          <div className='col-span-full flex flex-col gap-5 sm:col-span-2'>
            <div>
              <p className='mb-3 text-lg font-medium'>Subscribe to newsletter</p>
              <div className='flex gap-2'>
                <Input type='email' placeholder='Your email...' />
                <Button size='icon' type='submit' className='rounded-lg'>
                  <ArrowRightIcon />
                </Button>
              </div>
            </div>
            <Separator />

            <div className='flex flex-wrap gap-4'>
              <img
                src='https://cdn.shadcnstudio.com/ss-assets/brand-logo/bestofjs-logo-bw.png'
                alt='bestofjs'
                className='h-5'
              />
              <img
                src='https://cdn.shadcnstudio.com/ss-assets/brand-logo/product-hunt-logo-bw.png'
                alt='producthunt'
                className='h-5'
              />
              <img
                src='https://cdn.shadcnstudio.com/ss-assets/brand-logo/reddit-logo-bw.png'
                alt='reddit'
                className='h-5'
              />
              <img
                src='https://cdn.shadcnstudio.com/ss-assets/brand-logo/medium-logo-bw.png'
                alt='medium'
                className='h-5'
              />
              <img
                src='https://cdn.shadcnstudio.com/ss-assets/brand-logo/ycombinator-logo-bw.png'
                alt='ycombinator'
                className='h-5'
              />
              <img
                src='https://cdn.shadcnstudio.com/ss-assets/brand-logo/launchtory-logo-bw.png'
                alt='launchtory'
                className='h-5'
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className='mx-auto flex max-w-7xl justify-center px-4 py-6 sm:px-6'>
        <p className='text-center font-medium text-balance'>
          {`©${new Date().getFullYear()}`} <a href='#'>Shadcn/studio</a>, Made with ❤️ for better web.
        </p>
      </div>
    </footer>
  )
}

export default Footer
