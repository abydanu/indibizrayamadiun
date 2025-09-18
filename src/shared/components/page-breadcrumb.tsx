'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/ui/breadcrumb'

interface BreadcrumbItem {
  title: string
  href?: string
  isActive?: boolean
}

interface PageBreadcrumbProps {
  items: BreadcrumbItem[]
}

export function PageBreadcrumb({ items }: PageBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            <BreadcrumbItem>
              {item.isActive || !item.href ? (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.title}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

// Helper function to generate breadcrumb items based on pathname
export function generateBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const items: BreadcrumbItem[] = []

  // Always start with Dashboard
  if (segments.includes('admin')) {
    items.push({ title: 'Dashboard', href: '/admin/dashboard' })
  } else if (segments.includes('agency')) {
    items.push({ title: 'Dashboard', href: '/agency/dashboard' })
  }

  // Add specific page items based on path
  if (segments.includes('orders')) {
    items.push({ title: 'Orders', isActive: true })
  } else if (segments.includes('customers')) {
    items.push({ title: 'Customers', isActive: true })
  } else if (segments.includes('kategori-paket')) {
    items.push({ title: 'Kategori Paket', isActive: true })
  } else if (segments.includes('agencies')) {
    items.push({ title: 'Agencies', isActive: true })
  } else if (segments.includes('settings')) {
    items.push({ title: 'Settings', isActive: true })
  } else if (segments.includes('dashboard')) {
    items.push({ title: 'Dashboard', isActive: true })
  }

  return items
}
