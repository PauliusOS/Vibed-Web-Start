import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full glass-dark border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="text-2xl font-semibold text-black hover:opacity-70 transition-opacity">
          OPA
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          <Link href="#features" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
            How It Works
          </Link>
          <Link href="#timeline" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
            Timeline
          </Link>
          <Link href="#testimonials" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
            Testimonials
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-gray-700 hover:text-black hover:bg-gray-50"
          >
            Sign In
          </Button>
          <Button className="bg-[#007AFF] hover:bg-[#0051D5] text-white rounded-full px-6 transition-all">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  )
}
