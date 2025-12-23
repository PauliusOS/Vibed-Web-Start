'use client'

import { useEffect, useRef } from 'react'
import { ThemeProvider } from 'next-themes'

interface ClientBodyProps {
  className?: string
  children: React.ReactNode
}

export default function ClientBody({ className, children }: ClientBodyProps) {
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Apply the className to the actual body element after hydration
    if (className) {
      document.body.className = className
    }

    // Clean up any browser extension attributes that might cause hydration issues
    const extensionAttributes = ['cz-shortcut-listen']
    extensionAttributes.forEach(attr => {
      if (document.body.hasAttribute(attr)) {
        document.body.removeAttribute(attr)
      }
    })
  }, [className])

  // Return a div that will contain the app content
  // This avoids hydration issues with the body element
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div ref={bodyRef}>{children}</div>
    </ThemeProvider>
  )
}