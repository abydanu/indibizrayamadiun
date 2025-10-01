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

interface BreadcrumbItemType {
  title: string
  href?: string
  isActive?: boolean
}

const breadcrumbMap: Record<string, string> = {
  dashboard: 'Dasbor',
  paket: 'Paket',
  'kategori-paket': 'Kategori Paket',
  promo: 'Promo',
  datel: 'Datel',
  agency: 'Agency',
  sales: 'Sales',
  pelanggan: 'Pelanggan',
  sto: 'STO'
}

export function PageBreadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean).filter(seg => seg !== 'admin')

  let items: BreadcrumbItemType[] = []

  if (segments.length === 0 || (segments.length === 1 && segments[0] === 'dasbor')) {
    items = [{ title: 'Dasbor', isActive: true }]
  } else {
    items = [
      { title: 'Dasbor', href: '/admin/dasbor' },
      ...segments.map((segment, index) => {
        const isLast = index === segments.length - 1
        return {
          title: breadcrumbMap[segment] || segment,
          href: isLast ? undefined : '/' + segments.slice(0, index + 1).join('/'),
          isActive: isLast,
        }
      }),
    ]
  }

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