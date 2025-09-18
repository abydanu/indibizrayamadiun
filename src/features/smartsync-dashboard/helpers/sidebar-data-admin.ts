import {
  LayoutDashboard,
  Users,
  Settings,
  Building2,
  Layers,
  BadgePercent,
  Blocks,
  ChartBarStacked,
  SmartphoneNfc,
} from 'lucide-react';

import type { SidebarData } from '../types/sidebar';

export const sidebarData: SidebarData = {
  user: {
    name: 'Admin SmartSync',
    email: 'admin@smartsync.com',
    avatar: '/avatars/admin.jpg',
  },
  teams: [
    {
      name: 'SmartSync',
      logo: Building2,
      plan: 'Administrator',
    },
  ],
  navGroups: [
    {
      title: 'Plarform',
      items: [
        {
          title: 'Dasbor',
          url: '/admin/dashboard',
          icon: LayoutDashboard,
        },
        {
          title: 'Daftar Agency',
          url: '/admin/agencies',
          icon: Users,
        },
        {
          title: 'Pengaturan',
          url: '/admin/settings',
          icon: Settings,
        },
      ],
    },
    {
      title: 'Kelola Konten',
      items: [
        {
          title: 'Paket Indibiz',
          icon: Layers,
          items: [
            {
              title: 'Paket',
              url: '/admin/paket',
              icon: Blocks,
            },
            {
              title: 'Kategori Paket',
              url: '/admin/kategori-paket',
              icon: ChartBarStacked,
            },
            {
              title: 'Promo',
              url: '/admin/promo',
              icon: BadgePercent,
            },
          ],
        },
        { 
          title: "Datel",
          url: "/admin/datel",
          icon: SmartphoneNfc,
        },
      ],
    },
  ],
};
