'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

type TopNavProps = {
  links: Array<{
    title: string
    href: string
    isActive?: boolean
    disabled?: boolean
  }>
}

export function TopNav({ links }: TopNavProps) {
  const pathname = usePathname()

  return (
    <nav className='flex items-center space-x-4 lg:space-x-6'>
      {links.map((link) => {
        const isActive = pathname === link.href || link.isActive
        return (
          <Link
            key={link.href}
            href={link.disabled ? '#' : link.href}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              isActive
                ? 'text-black dark:text-white'
                : 'text-muted-foreground',
              link.disabled && 'cursor-not-allowed opacity-80'
            )}
          >
            {link.title}
          </Link>
        )
      })}
    </nav>
  )
}
