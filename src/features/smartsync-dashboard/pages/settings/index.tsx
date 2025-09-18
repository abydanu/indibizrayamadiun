'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/features/smartsync-dashboard/components/header'
import { Main } from '@/features/smartsync-dashboard/components/main'
import { Separator } from '@/shared/ui/separator'
import { ThemeSwitch } from '@/shared/components/theme-switch'
import { PageBreadcrumb, generateBreadcrumbItems } from '@/shared/components/page-breadcrumb';
import { AccountForm } from './components/account-form';
import type { UserType } from './components/account-form-config';

export default function SettingsAccount() {
  const pathname = usePathname();
  
  // Detect user type from URL path
  const userType: UserType = pathname.includes('/agency/') ? 'agency' : 'admin';
  
  // Generate breadcrumb items
  const breadcrumbItems = generateBreadcrumbItems(pathname);
  
  const handleAccountSubmit = (data: any) => {
    console.log(`${userType} account updated:`, data);
    // TODO: Implement API call based on user type
    if (userType === 'agency') {
      // Call agency API
      // await updateAgencyAccount(data);
    } else {
      // Call admin API  
      // await updateAdminAccount(data);
    }
  };

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
            Pengaturan {userType === 'agency' ? 'Agency' : 'Admin'}
          </h1>
          <p className="text-muted-foreground">
            Kelola pengaturan akun {userType === 'agency' ? 'agency' : 'administrator'} Anda dan tetapkan preferensi.
          </p>
        </div>
        <Separator className="my-4 lg:my-6" />
        <div className="w-full">
          <AccountForm 
            userType={userType}
            onSubmit={handleAccountSubmit}
          />
        </div>
      </Main>
    </>
  );
}