import { Order, OrderDetail } from '../types'

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerName: 'Budi Santoso',
    customerEmail: 'budi.santoso@email.com',
    packageName: 'IndiBiz Gig 1',
    packageType: 'Internet',
    status: 'completed',
    orderDate: '2024-01-15',
    completionDate: '2024-01-20',
    totalAmount: 500000,
    paymentStatus: 'paid',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Instalasi selesai tepat waktu'
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerName: 'Siti Rahayu',
    customerEmail: 'siti.rahayu@company.co.id',
    packageName: 'IndiBiz Gig 2',
    packageType: 'Internet',
    status: 'processing',
    orderDate: '2024-01-18',
    totalAmount: 750000,
    paymentStatus: 'paid',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Menunggu jadwal instalasi'
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customerName: 'Ahmad Wijaya',
    customerEmail: 'ahmad.wijaya@startup.id',
    packageName: 'IndiBiz Gig 3',
    packageType: 'Bundle',
    status: 'pending',
    orderDate: '2024-01-20',
    totalAmount: 1200000,
    paymentStatus: 'unpaid',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution'
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customerName: 'Maya Sari',
    customerEmail: 'maya.sari@gmail.com',
    packageName: 'IndiBiz Voice',
    packageType: 'Voice',
    status: 'cancelled',
    orderDate: '2024-01-12',
    totalAmount: 300000,
    paymentStatus: 'refunded',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Dibatalkan atas permintaan customer'
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    customerName: 'Rudi Hermawan',
    customerEmail: 'rudi.hermawan@bisnis.com',
    packageName: 'IndiBiz Gig 5',
    packageType: 'Internet',
    status: 'processing',
    orderDate: '2024-01-22',
    totalAmount: 2000000,
    paymentStatus: 'partial',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Pembayaran 50% sudah diterima'
  },
  // Additional orders for pagination testing
  {
    id: '6',
    orderNumber: 'ORD-2024-006',
    customerName: 'Dewi Lestari',
    customerEmail: 'dewi.lestari@techcorp.id',
    packageName: 'IndiBiz Gig 2',
    packageType: 'Internet',
    status: 'completed',
    orderDate: '2024-01-25',
    completionDate: '2024-01-30',
    totalAmount: 750000,
    paymentStatus: 'paid',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Customer sangat puas dengan layanan'
  },
  {
    id: '7',
    orderNumber: 'ORD-2024-007',
    customerName: 'Andi Pratama',
    customerEmail: 'andi.pratama@manufacturing.co.id',
    packageName: 'IndiBiz Data Pro',
    packageType: 'Data',
    status: 'processing',
    orderDate: '2024-01-28',
    totalAmount: 950000,
    paymentStatus: 'paid',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Sedang proses instalasi perangkat'
  },
  {
    id: '8',
    orderNumber: 'ORD-2024-008',
    customerName: 'Rina Maharani',
    customerEmail: 'rina.maharani@retailstore.com',
    packageName: 'IndiBiz Bundle Premium',
    packageType: 'Bundle',
    status: 'pending',
    orderDate: '2024-02-01',
    totalAmount: 1800000,
    paymentStatus: 'unpaid',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution'
  },
  {
    id: '9',
    orderNumber: 'ORD-2024-009',
    customerName: 'Fajar Nugroho',
    customerEmail: 'fajar.nugroho@consultancy.id',
    packageName: 'IndiBiz Voice Plus',
    packageType: 'Voice',
    status: 'completed',
    orderDate: '2024-02-03',
    completionDate: '2024-02-08',
    totalAmount: 450000,
    paymentStatus: 'paid',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Instalasi lancar tanpa kendala'
  },
  {
    id: '10',
    orderNumber: 'ORD-2024-010',
    customerName: 'Indira Sari',
    customerEmail: 'indira.sari@healthcare.co.id',
    packageName: 'IndiBiz Gig 4',
    packageType: 'Internet',
    status: 'cancelled',
    orderDate: '2024-02-05',
    totalAmount: 1500000,
    paymentStatus: 'refunded',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Lokasi tidak memungkinkan untuk instalasi'
  },
  {
    id: '11',
    orderNumber: 'ORD-2024-011',
    customerName: 'Bambang Wijaya',
    customerEmail: 'bambang.wijaya@logistics.id',
    packageName: 'IndiBiz Gig 3',
    packageType: 'Internet',
    status: 'processing',
    orderDate: '2024-02-08',
    totalAmount: 1200000,
    paymentStatus: 'partial',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'DP 30% sudah dibayar'
  },
  {
    id: '12',
    orderNumber: 'ORD-2024-012',
    customerName: 'Sari Dewi',
    customerEmail: 'sari.dewi@education.ac.id',
    packageName: 'IndiBiz Bundle Education',
    packageType: 'Bundle',
    status: 'completed',
    orderDate: '2024-02-10',
    completionDate: '2024-02-15',
    totalAmount: 850000,
    paymentStatus: 'paid',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Khusus untuk institusi pendidikan'
  },
  {
    id: '13',
    orderNumber: 'ORD-2024-013',
    customerName: 'Hendra Kusuma',
    customerEmail: 'hendra.kusuma@finance.co.id',
    packageName: 'IndiBiz Data Secure',
    packageType: 'Data',
    status: 'pending',
    orderDate: '2024-02-12',
    totalAmount: 1100000,
    paymentStatus: 'unpaid',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution'
  },
  {
    id: '14',
    orderNumber: 'ORD-2024-014',
    customerName: 'Lina Permata',
    customerEmail: 'lina.permata@creative.studio',
    packageName: 'IndiBiz Gig 1',
    packageType: 'Internet',
    status: 'processing',
    orderDate: '2024-02-14',
    totalAmount: 500000,
    paymentStatus: 'paid',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Untuk studio kreatif'
  },
  {
    id: '15',
    orderNumber: 'ORD-2024-015',
    customerName: 'Agus Setiawan',
    customerEmail: 'agus.setiawan@property.id',
    packageName: 'IndiBiz Voice Enterprise',
    packageType: 'Voice',
    status: 'completed',
    orderDate: '2024-02-16',
    completionDate: '2024-02-21',
    totalAmount: 650000,
    paymentStatus: 'paid',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Untuk kantor properti dengan 50 extension'
  },
  {
    id: '16',
    orderNumber: 'ORD-2024-016',
    customerName: 'Ratna Sari',
    customerEmail: 'ratna.sari@restaurant.co.id',
    packageName: 'IndiBiz Bundle Hospitality',
    packageType: 'Bundle',
    status: 'cancelled',
    orderDate: '2024-02-18',
    totalAmount: 1350000,
    paymentStatus: 'refunded',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Perubahan rencana bisnis'
  },
  {
    id: '17',
    orderNumber: 'ORD-2024-017',
    customerName: 'Doni Prasetyo',
    customerEmail: 'doni.prasetyo@automotive.id',
    packageName: 'IndiBiz Gig 5',
    packageType: 'Internet',
    status: 'processing',
    orderDate: '2024-02-20',
    totalAmount: 2000000,
    paymentStatus: 'partial',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Pembayaran bertahap sesuai kesepakatan'
  },
  {
    id: '18',
    orderNumber: 'ORD-2024-018',
    customerName: 'Wulan Dari',
    customerEmail: 'wulan.dari@fashion.boutique',
    packageName: 'IndiBiz Data Fashion',
    packageType: 'Data',
    status: 'pending',
    orderDate: '2024-02-22',
    totalAmount: 800000,
    paymentStatus: 'unpaid',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution'
  },
  {
    id: '19',
    orderNumber: 'ORD-2024-019',
    customerName: 'Yudi Santoso',
    customerEmail: 'yudi.santoso@construction.co.id',
    packageName: 'IndiBiz Gig 2',
    packageType: 'Internet',
    status: 'completed',
    orderDate: '2024-02-24',
    completionDate: '2024-03-01',
    totalAmount: 750000,
    paymentStatus: 'paid',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Untuk site office konstruksi'
  },
  {
    id: '20',
    orderNumber: 'ORD-2024-020',
    customerName: 'Fitri Handayani',
    customerEmail: 'fitri.handayani@wellness.center',
    packageName: 'IndiBiz Bundle Wellness',
    packageType: 'Bundle',
    status: 'processing',
    orderDate: '2024-02-26',
    totalAmount: 1450000,
    paymentStatus: 'paid',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Paket khusus untuk pusat kesehatan'
  },
  {
    id: '21',
    orderNumber: 'ORD-2024-021',
    customerName: 'Rizki Ramadhan',
    customerEmail: 'rizki.ramadhan@gaming.studio',
    packageName: 'IndiBiz Gig Ultra',
    packageType: 'Internet',
    status: 'pending',
    orderDate: '2024-02-28',
    totalAmount: 3000000,
    paymentStatus: 'unpaid',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution'
  },
  {
    id: '22',
    orderNumber: 'ORD-2024-022',
    customerName: 'Sinta Maharani',
    customerEmail: 'sinta.maharani@legal.firm',
    packageName: 'IndiBiz Voice Legal',
    packageType: 'Voice',
    status: 'completed',
    orderDate: '2024-03-02',
    completionDate: '2024-03-07',
    totalAmount: 550000,
    paymentStatus: 'paid',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Sistem telepon untuk firma hukum'
  },
  {
    id: '23',
    orderNumber: 'ORD-2024-023',
    customerName: 'Bayu Aji',
    customerEmail: 'bayu.aji@media.production',
    packageName: 'IndiBiz Data Media',
    packageType: 'Data',
    status: 'cancelled',
    orderDate: '2024-03-04',
    totalAmount: 1750000,
    paymentStatus: 'refunded',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Proyek media dibatalkan'
  },
  {
    id: '24',
    orderNumber: 'ORD-2024-024',
    customerName: 'Kartika Sari',
    customerEmail: 'kartika.sari@pharmacy.chain',
    packageName: 'IndiBiz Bundle Pharmacy',
    packageType: 'Bundle',
    status: 'processing',
    orderDate: '2024-03-06',
    totalAmount: 1250000,
    paymentStatus: 'partial',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Untuk jaringan apotek'
  },
  {
    id: '25',
    orderNumber: 'ORD-2024-025',
    customerName: 'Eko Prasetyo',
    customerEmail: 'eko.prasetyo@agriculture.co.id',
    packageName: 'IndiBiz Gig 3',
    packageType: 'Internet',
    status: 'completed',
    orderDate: '2024-03-08',
    completionDate: '2024-03-13',
    totalAmount: 1200000,
    paymentStatus: 'paid',
    agencyId: 'AGY-001',
    agencyName: 'PT. Digital Solution',
    notes: 'Untuk smart farming system'
  }
]

export const mockOrderDetails: Record<string, OrderDetail> = {
  '1': {
    ...mockOrders[0],
    customerPhone: '+62 812-3456-7890',
    customerAddress: 'Jl. Sudirman No. 123, Jakarta Pusat',
    packageDetails: {
      speed: '100 Mbps',
      duration: '12 bulan',
      features: ['Unlimited Internet', 'Static IP', '24/7 Support']
    },
    paymentHistory: [
      {
        date: '2024-01-15',
        amount: 500000,
        method: 'Transfer Bank',
        status: 'Berhasil'
      }
    ]
  },
  '2': {
    ...mockOrders[1],
    customerPhone: '+62 821-9876-5432',
    customerAddress: 'Jl. Thamrin No. 456, Jakarta Pusat',
    packageDetails: {
      speed: '200 Mbps',
      duration: '24 bulan',
      features: ['Unlimited Internet', 'Static IP', 'Priority Support', 'Cloud Storage 100GB']
    },
    paymentHistory: [
      {
        date: '2024-01-18',
        amount: 750000,
        method: 'Credit Card',
        status: 'Berhasil'
      }
    ]
  },
  '3': {
    ...mockOrders[2],
    customerPhone: '+62 813-2468-1357',
    customerAddress: 'Jl. Gatot Subroto No. 789, Jakarta Selatan',
    packageDetails: {
      speed: '500 Mbps',
      duration: '36 bulan',
      features: ['Unlimited Internet', 'Static IP', 'Dedicated Support', 'Cloud Storage 500GB', 'VPN Access']
    },
    paymentHistory: []
  },
  '4': {
    ...mockOrders[3],
    customerPhone: '+62 814-1357-2468',
    customerAddress: 'Jl. Kuningan No. 321, Jakarta Selatan',
    packageDetails: {
      duration: '12 bulan',
      features: ['Unlimited Voice Call', 'SMS Package', 'Conference Call']
    },
    paymentHistory: [
      {
        date: '2024-01-12',
        amount: 300000,
        method: 'Transfer Bank',
        status: 'Refunded'
      }
    ]
  },
  '5': {
    ...mockOrders[4],
    customerPhone: '+62 815-9753-8642',
    customerAddress: 'Jl. Senayan No. 654, Jakarta Pusat',
    packageDetails: {
      speed: '1 Gbps',
      duration: '24 bulan',
      features: ['Unlimited Internet', 'Dedicated Line', 'Premium Support', 'Cloud Storage 1TB', 'Security Package']
    },
    paymentHistory: [
      {
        date: '2024-01-22',
        amount: 1000000,
        method: 'Transfer Bank',
        status: 'Berhasil'
      }
    ]
  }
}
