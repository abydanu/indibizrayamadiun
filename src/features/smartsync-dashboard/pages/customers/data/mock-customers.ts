import { Customer, CustomerDetail } from '../types'

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Budi Santoso',
    email: 'budi.santoso@email.com',
    phone: '+62 812-3456-7890',
    company: 'PT. Maju Bersama',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    registrationDate: '2023-06-15',
    status: 'active',
    totalOrders: 3,
    totalSpent: 2250000,
    lastOrderDate: '2024-01-15',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Customer premium dengan pembayaran tepat waktu'
  },
  {
    id: '2',
    name: 'Siti Rahayu',
    email: 'siti.rahayu@company.co.id',
    phone: '+62 821-9876-5432',
    company: 'CV. Teknologi Masa Depan',
    address: 'Jl. Thamrin No. 456, Jakarta Pusat',
    registrationDate: '2023-08-22',
    status: 'active',
    totalOrders: 2,
    totalSpent: 1500000,
    lastOrderDate: '2024-01-18',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution'
  },
  {
    id: '3',
    name: 'Ahmad Wijaya',
    email: 'ahmad.wijaya@startup.id',
    phone: '+62 813-2468-1357',
    company: 'Startup Innovation Hub',
    address: 'Jl. Gatot Subroto No. 789, Jakarta Selatan',
    registrationDate: '2024-01-10',
    status: 'active',
    totalOrders: 1,
    totalSpent: 1200000,
    lastOrderDate: '2024-01-20',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution'
  },
  {
    id: '4',
    name: 'Maya Sari',
    email: 'maya.sari@gmail.com',
    phone: '+62 814-1357-2468',
    address: 'Jl. Kuningan No. 321, Jakarta Selatan',
    registrationDate: '2023-12-05',
    status: 'inactive',
    totalOrders: 1,
    totalSpent: 0,
    lastOrderDate: '2024-01-12',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Order dibatalkan, perlu follow up'
  },
  {
    id: '5',
    name: 'Rudi Hermawan',
    email: 'rudi.hermawan@bisnis.com',
    phone: '+62 815-9753-8642',
    company: 'Bisnis Digital Indonesia',
    address: 'Jl. Senayan No. 654, Jakarta Pusat',
    registrationDate: '2024-01-20',
    status: 'active',
    totalOrders: 1,
    totalSpent: 1000000,
    lastOrderDate: '2024-01-22',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution'
  },
  {
    id: '6',
    name: 'Lisa Permata',
    email: 'lisa.permata@ecommerce.co.id',
    phone: '+62 816-4567-8901',
    company: 'E-Commerce Solutions',
    address: 'Jl. Kemang No. 987, Jakarta Selatan',
    registrationDate: '2023-09-18',
    status: 'suspended',
    totalOrders: 4,
    totalSpent: 3200000,
    lastOrderDate: '2023-12-28',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Suspended karena tunggakan pembayaran'
  },
  // Additional customers for pagination and filtering testing
  {
    id: '7',
    name: 'Dewi Lestari',
    email: 'dewi.lestari@techcorp.id',
    phone: '+62 817-7777-8888',
    company: 'TechCorp Indonesia',
    address: 'Jl. HR Rasuna Said No. 88, Jakarta Selatan',
    registrationDate: '2024-01-25',
    status: 'active',
    totalOrders: 4,
    totalSpent: 3750000,
    lastOrderDate: '2024-03-01',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Customer enterprise dengan volume tinggi'
  },
  {
    id: '8',
    name: 'Andi Pratama',
    email: 'andi.pratama@manufacturing.co.id',
    phone: '+62 818-9999-0000',
    company: 'PT. Manufacturing Prima',
    address: 'Jl. Jendral Sudirman No. 200, Jakarta Pusat',
    registrationDate: '2024-01-28',
    status: 'active',
    totalOrders: 2,
    totalSpent: 1900000,
    lastOrderDate: '2024-02-28',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution'
  },
  {
    id: '9',
    name: 'Rina Maharani',
    email: 'rina.maharani@retailstore.com',
    phone: '+62 819-1111-2222',
    company: 'Retail Store Chain',
    address: 'Jl. MH Thamrin No. 150, Jakarta Pusat',
    registrationDate: '2024-02-01',
    status: 'pending',
    totalOrders: 1,
    totalSpent: 1800000,
    lastOrderDate: '2024-02-01',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution'
  },
  {
    id: '10',
    name: 'Fajar Nugroho',
    email: 'fajar.nugroho@consultancy.id',
    phone: '+62 820-3333-4444',
    company: 'Consultancy Solutions',
    address: 'Jl. Casablanca No. 75, Jakarta Selatan',
    registrationDate: '2024-02-03',
    status: 'active',
    totalOrders: 3,
    totalSpent: 1350000,
    lastOrderDate: '2024-03-05',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution'
  },
  {
    id: '11',
    name: 'Indira Sari',
    email: 'indira.sari@healthcare.co.id',
    phone: '+62 821-5555-6666',
    company: 'Healthcare Solutions',
    address: 'Jl. Menteng Raya No. 45, Jakarta Pusat',
    registrationDate: '2024-02-05',
    status: 'inactive',
    totalOrders: 1,
    totalSpent: 0,
    lastOrderDate: '2024-02-05',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Order dibatalkan, lokasi tidak memungkinkan'
  },
  {
    id: '12',
    name: 'Bambang Wijaya',
    email: 'bambang.wijaya@logistics.id',
    phone: '+62 822-7777-8888',
    company: 'Logistics Express',
    address: 'Jl. Pancoran No. 120, Jakarta Selatan',
    registrationDate: '2024-02-08',
    status: 'active',
    totalOrders: 2,
    totalSpent: 2400000,
    lastOrderDate: '2024-03-08',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution'
  },
  {
    id: '13',
    name: 'Sari Dewi',
    email: 'sari.dewi@education.ac.id',
    phone: '+62 823-9999-0000',
    company: 'Education Institute',
    address: 'Jl. Salemba Raya No. 30, Jakarta Pusat',
    registrationDate: '2024-02-10',
    status: 'active',
    totalOrders: 3,
    totalSpent: 2550000,
    lastOrderDate: '2024-03-10',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Institusi pendidikan dengan diskon khusus'
  },
  {
    id: '14',
    name: 'Hendra Kusuma',
    email: 'hendra.kusuma@finance.co.id',
    phone: '+62 824-1111-2222',
    company: 'Finance Corporation',
    address: 'Jl. Senayan No. 99, Jakarta Pusat',
    registrationDate: '2024-02-12',
    status: 'pending',
    totalOrders: 1,
    totalSpent: 1100000,
    lastOrderDate: '2024-02-12',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution'
  },
  {
    id: '15',
    name: 'Lina Permata',
    email: 'lina.permata@creative.studio',
    phone: '+62 825-3333-4444',
    company: 'Creative Studio',
    address: 'Jl. Kemang Utara No. 67, Jakarta Selatan',
    registrationDate: '2024-02-14',
    status: 'active',
    totalOrders: 2,
    totalSpent: 1000000,
    lastOrderDate: '2024-03-14',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution'
  },
  {
    id: '16',
    name: 'Agus Setiawan',
    email: 'agus.setiawan@property.id',
    phone: '+62 826-5555-6666',
    company: 'Property Development',
    address: 'Jl. Pondok Indah No. 234, Jakarta Selatan',
    registrationDate: '2024-02-16',
    status: 'active',
    totalOrders: 4,
    totalSpent: 2600000,
    lastOrderDate: '2024-03-16',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution'
  },
  {
    id: '17',
    name: 'Ratna Sari',
    email: 'ratna.sari@restaurant.co.id',
    phone: '+62 827-7777-8888',
    company: 'Restaurant Chain',
    address: 'Jl. Blok M No. 156, Jakarta Selatan',
    registrationDate: '2024-02-18',
    status: 'inactive',
    totalOrders: 1,
    totalSpent: 0,
    lastOrderDate: '2024-02-18',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Perubahan rencana bisnis'
  },
  {
    id: '18',
    name: 'Doni Prasetyo',
    email: 'doni.prasetyo@automotive.id',
    phone: '+62 828-9999-0000',
    company: 'Automotive Solutions',
    address: 'Jl. Tebet Raya No. 89, Jakarta Selatan',
    registrationDate: '2024-02-20',
    status: 'active',
    totalOrders: 3,
    totalSpent: 6000000,
    lastOrderDate: '2024-03-20',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Customer VIP dengan volume transaksi tinggi'
  },
  {
    id: '19',
    name: 'Wulan Dari',
    email: 'wulan.dari@fashion.boutique',
    phone: '+62 829-1111-2222',
    company: 'Fashion Boutique',
    address: 'Jl. Senopati No. 45, Jakarta Selatan',
    registrationDate: '2024-02-22',
    status: 'pending',
    totalOrders: 1,
    totalSpent: 800000,
    lastOrderDate: '2024-02-22',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution'
  },
  {
    id: '20',
    name: 'Yudi Santoso',
    email: 'yudi.santoso@construction.co.id',
    phone: '+62 830-3333-4444',
    company: 'Construction Company',
    address: 'Jl. Cawang No. 178, Jakarta Timur',
    registrationDate: '2024-02-24',
    status: 'active',
    totalOrders: 2,
    totalSpent: 1500000,
    lastOrderDate: '2024-03-24',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution'
  },
  {
    id: '21',
    name: 'Fitri Handayani',
    email: 'fitri.handayani@wellness.center',
    phone: '+62 831-5555-6666',
    company: 'Wellness Center',
    address: 'Jl. Kelapa Gading No. 90, Jakarta Utara',
    registrationDate: '2024-02-26',
    status: 'active',
    totalOrders: 3,
    totalSpent: 4350000,
    lastOrderDate: '2024-03-26',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution'
  },
  {
    id: '22',
    name: 'Rizki Ramadhan',
    email: 'rizki.ramadhan@gaming.studio',
    phone: '+62 832-7777-8888',
    company: 'Gaming Studio',
    address: 'Jl. Pluit Raya No. 123, Jakarta Utara',
    registrationDate: '2024-02-28',
    status: 'pending',
    totalOrders: 1,
    totalSpent: 3000000,
    lastOrderDate: '2024-02-28',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution'
  },
  {
    id: '23',
    name: 'Sinta Maharani',
    email: 'sinta.maharani@legal.firm',
    phone: '+62 833-9999-0000',
    company: 'Legal Firm',
    address: 'Jl. Kota Tua No. 67, Jakarta Barat',
    registrationDate: '2024-03-02',
    status: 'active',
    totalOrders: 2,
    totalSpent: 1100000,
    lastOrderDate: '2024-03-28',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution'
  },
  {
    id: '24',
    name: 'Bayu Aji',
    email: 'bayu.aji@media.production',
    phone: '+62 834-1111-2222',
    company: 'Media Production',
    address: 'Jl. Grogol No. 234, Jakarta Barat',
    registrationDate: '2024-03-04',
    status: 'inactive',
    totalOrders: 1,
    totalSpent: 0,
    lastOrderDate: '2024-03-04',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Proyek media dibatalkan'
  },
  {
    id: '25',
    name: 'Kartika Sari',
    email: 'kartika.sari@pharmacy.chain',
    phone: '+62 835-3333-4444',
    company: 'Pharmacy Chain',
    address: 'Jl. Puri Indah No. 145, Jakarta Barat',
    registrationDate: '2024-03-06',
    status: 'active',
    totalOrders: 2,
    totalSpent: 2500000,
    lastOrderDate: '2024-03-30',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution'
  },
  {
    id: '26',
    name: 'Eko Prasetyo',
    email: 'eko.prasetyo@agriculture.co.id',
    phone: '+62 836-5555-6666',
    company: 'Agriculture Solutions',
    address: 'Jl. Ragunan No. 78, Jakarta Selatan',
    registrationDate: '2024-03-08',
    status: 'active',
    totalOrders: 3,
    totalSpent: 3600000,
    lastOrderDate: '2024-03-31',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Smart farming solutions'
  },
  {
    id: '27',
    name: 'Nurul Hidayah',
    email: 'nurul.hidayah@nonprofit.org',
    phone: '+62 837-7777-8888',
    company: 'Non-Profit Organization',
    address: 'Jl. Pasar Minggu No. 56, Jakarta Selatan',
    registrationDate: '2024-03-10',
    status: 'active',
    totalOrders: 1,
    totalSpent: 500000,
    lastOrderDate: '2024-03-10',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution'
  },
  {
    id: '28',
    name: 'Teguh Santoso',
    email: 'teguh.santoso@transport.co.id',
    phone: '+62 838-9999-0000',
    company: 'Transport Solutions',
    address: 'Jl. Cempaka Putih No. 123, Jakarta Pusat',
    registrationDate: '2024-03-12',
    status: 'pending',
    totalOrders: 1,
    totalSpent: 750000,
    lastOrderDate: '2024-03-12',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution'
  },
  {
    id: '29',
    name: 'Vina Melati',
    email: 'vina.melati@beauty.salon',
    phone: '+62 839-1111-2222',
    company: 'Beauty Salon',
    address: 'Jl. Fatmawati No. 89, Jakarta Selatan',
    registrationDate: '2024-03-14',
    status: 'active',
    totalOrders: 2,
    totalSpent: 900000,
    lastOrderDate: '2024-03-29',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution'
  },
  {
    id: '30',
    name: 'Wahyu Hidayat',
    email: 'wahyu.hidayat@sports.center',
    phone: '+62 840-3333-4444',
    company: 'Sports Center',
    address: 'Jl. Senayan No. 234, Jakarta Pusat',
    registrationDate: '2024-03-16',
    status: 'active',
    totalOrders: 3,
    totalSpent: 2250000,
    lastOrderDate: '2024-04-01',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution'
  }
]

export const mockCustomerDetails: Record<string, CustomerDetail> = {
  '1': {
    ...mockCustomers[0],
    orders: [
      {
        id: '1',
        orderNumber: 'ORD-2024-001',
        packageName: 'IndiBiz Gig 1',
        status: 'completed',
        orderDate: '2024-01-15',
        amount: 500000
      },
      {
        id: '7',
        orderNumber: 'ORD-2023-045',
        packageName: 'IndiBiz Gig 2',
        status: 'completed',
        orderDate: '2023-11-20',
        amount: 750000
      },
      {
        id: '8',
        orderNumber: 'ORD-2023-032',
        packageName: 'IndiBiz Gig 1',
        status: 'completed',
        orderDate: '2023-08-15',
        amount: 1000000
      }
    ],
    paymentMethods: [
      {
        type: 'Transfer Bank',
        details: 'BCA - 1234567890',
        isDefault: true
      },
      {
        type: 'Credit Card',
        details: '**** **** **** 1234',
        isDefault: false
      }
    ]
  },
  '2': {
    ...mockCustomers[1],
    orders: [
      {
        id: '2',
        orderNumber: 'ORD-2024-002',
        packageName: 'IndiBiz Gig 2',
        status: 'processing',
        orderDate: '2024-01-18',
        amount: 750000
      },
      {
        id: '9',
        orderNumber: 'ORD-2023-067',
        packageName: 'IndiBiz Gig 1',
        status: 'completed',
        orderDate: '2023-10-10',
        amount: 750000
      }
    ],
    paymentMethods: [
      {
        type: 'Credit Card',
        details: '**** **** **** 5678',
        isDefault: true
      }
    ]
  },
  '3': {
    ...mockCustomers[2],
    orders: [
      {
        id: '3',
        orderNumber: 'ORD-2024-003',
        packageName: 'IndiBiz Gig 3',
        status: 'pending',
        orderDate: '2024-01-20',
        amount: 1200000
      }
    ],
    paymentMethods: [
      {
        type: 'Transfer Bank',
        details: 'Mandiri - 9876543210',
        isDefault: true
      }
    ]
  },
  '4': {
    ...mockCustomers[3],
    orders: [
      {
        id: '4',
        orderNumber: 'ORD-2024-004',
        packageName: 'IndiBiz Voice',
        status: 'cancelled',
        orderDate: '2024-01-12',
        amount: 300000
      }
    ],
    paymentMethods: [
      {
        type: 'Transfer Bank',
        details: 'BNI - 5555666677',
        isDefault: true
      }
    ]
  },
  '5': {
    ...mockCustomers[4],
    orders: [
      {
        id: '5',
        orderNumber: 'ORD-2024-005',
        packageName: 'IndiBiz Gig 5',
        status: 'processing',
        orderDate: '2024-01-22',
        amount: 2000000
      }
    ],
    paymentMethods: [
      {
        type: 'Transfer Bank',
        details: 'BRI - 1111222233',
        isDefault: true
      }
    ]
  },
  '6': {
    ...mockCustomers[5],
    orders: [
      {
        id: '10',
        orderNumber: 'ORD-2023-089',
        packageName: 'IndiBiz Gig 3',
        status: 'completed',
        orderDate: '2023-12-28',
        amount: 800000
      },
      {
        id: '11',
        orderNumber: 'ORD-2023-078',
        packageName: 'IndiBiz Gig 2',
        status: 'completed',
        orderDate: '2023-11-15',
        amount: 800000
      },
      {
        id: '12',
        orderNumber: 'ORD-2023-065',
        packageName: 'IndiBiz Gig 2',
        status: 'completed',
        orderDate: '2023-10-20',
        amount: 800000
      },
      {
        id: '13',
        orderNumber: 'ORD-2023-052',
        packageName: 'IndiBiz Gig 2',
        status: 'completed',
        orderDate: '2023-09-25',
        amount: 800000
      }
    ],
    paymentMethods: [
      {
        type: 'Transfer Bank',
        details: 'BCA - 9999888877',
        isDefault: true
      }
    ]
  }
}
