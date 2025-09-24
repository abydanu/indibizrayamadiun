'use client'

import { cn } from '@/lib/utils'
import { SidebarInset, SidebarProvider } from '@/shared/ui/sidebar'
import { AppSidebar } from '@/features/indibizrayamadiun-dashboard/components/app-sidebar'

type AdminLayoutProps = {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const defaultOpen = false

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset
        className={cn(
          '@container/content',
          'has-[[data-layout=fixed]]:h-svh',
          'peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-(var(--spacing)*4))]'
        )}
      >
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
