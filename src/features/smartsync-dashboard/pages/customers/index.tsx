'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Header } from '@/features/smartsync-dashboard/components/header'
import { Main } from '@/features/smartsync-dashboard/components/main'
import { Separator } from '@/shared/ui/separator'
import { ThemeSwitch } from '@/shared/components/theme-switch'
import { PageBreadcrumb, generateBreadcrumbItems } from '@/shared/components/page-breadcrumb'
import { CustomersTable } from './components/customers-table'
import { mockCustomers } from './data/mock-customers'

export default function CustomersPage() {
  const pathname = usePathname()

  // Detect user type from URL path
  const userType = pathname.includes('/agency/') ? 'agency' : 'admin'
  
  // Generate breadcrumb items
  const breadcrumbItems = generateBreadcrumbItems(pathname)

  const handleViewDetail = (customerId: string) => {
    console.log('View customer detail:', customerId)
    // TODO: Implement customer detail view
  }

  return (
    <>
      <Header fixed>
        <div className="flex items-center justify-between w-full">
          <PageBreadcrumb items={breadcrumbItems} />
          <div className="ms-auto flex items-center space-x-4">
            <ThemeSwitch />
          </div>
        </div>
      </Header>
      <Main>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
            Manajemen Customers
          </h1>
          <p className="text-muted-foreground">
            Kelola dan pantau semua customer {userType === 'agency' ? 'agency' : 'admin'} Anda.
          </p>
        </div>
        <Separator className="my-4 lg:my-6" />
        
        <CustomersTable 
          customers={mockCustomers}
          onViewDetail={handleViewDetail}
        />
      </Main>
    </>
  )
}

const adminTopNav = [
  {
    title: 'Dasbor',
    href: '/admin/dashboard',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Agen',
    href: '/admin/agencies',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Customers',
    href: '/admin/customers',
    isActive: true,
    disabled: true,
  },
  {
    title: 'Pengaturan',
    href: '/admin/settings',
    isActive: false,
    disabled: false,
  },
]

const agencyTopNav = [
  {
    title: 'Dasbor',
    href: '/agency/dashboard',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Orders',
    href: '/agency/orders',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Customers',
    href: '/agency/customers',
    isActive: true,
    disabled: true,
  },
  {
    title: 'Kategori Paket',
    href: '/agency/kategori-paket',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Pengaturan',
    href: '/agency/settings',
    isActive: false,
    disabled: false,
  },
]
