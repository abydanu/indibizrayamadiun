import {
  LayoutDashboard,
  Users,
  UserStar,
  Building2,
  Layers,
  BadgePercent,
  Blocks,
  ChartBarStacked,
  SmartphoneNfc,
  User,
  Radar
} from 'lucide-react';

import type { SidebarData } from '../types/sidebar';

export const sidebarData: SidebarData = {
  user: {
    name: 'ADMINISTRATOR',
    email: 'admin@smartsync.com',
    avatar: '',
  },
  teams: [
    {
      name: 'Indibiz Madiun Raya',
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
          url: '/admin/dasbor',
          icon: LayoutDashboard,
        },
        {
          title: 'Pelanggan',
          url: '/admin/pelanggan',
          icon: User,
        },
        {
          title: 'Daftar Sales',
          url: '/admin/sales',
          icon: Users,
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
          icon: Radar,
        },
        { 
          title: "STO",
          url: "/admin/sto",
          icon: SmartphoneNfc,
        },
        { 
          title: "Agensi",
          url: "/admin/agency",
          icon: UserStar,
        },
      ],
    },
  ],
};
