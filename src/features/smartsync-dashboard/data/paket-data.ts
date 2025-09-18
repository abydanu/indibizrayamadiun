// Data store untuk mengelola relasi antara Paket, Kategori, dan Promo

export type KategoriPaket = {
  id: string
  nama_kategori: string
  deskripsi_kategori: string
  created_at: string
  updated_at: string
}

export type Promo = {
  id: string
  nama_promo: string
  diskon: string
  tgl_mulai: string
  tgl_selesai: string
  status_promo: "active" | "expired" | "inactive"
  created_at: string
  updated_at: string
}

export type Paket = {
  id: string
  nama_paket: string
  bandwith_paket: string
  harga_psb: string
  harga_paket: string
  harga_pkt_ppn: string
  id_kategori: string
  id_promo: string
  created_at: string
  updated_at: string
}

export type PaketIndibiz = {
  id: string
  id_paket: string
  id_agency: string
  status_paket: "active" | "inactive" | "suspended"
  tgl_aktivasi: string
  tgl_berakhir: string
  created_at: string
  updated_at: string
}

// Data Kategori Paket
export const kategoriPaketData: KategoriPaket[] = [
  {
    id: "1",
    nama_kategori: "Internet Rumahan",
    deskripsi_kategori: "Paket internet untuk kebutuhan rumah tangga",
    created_at: "2024-01-10",
    updated_at: "2024-01-10",
  },
  {
    id: "2",
    nama_kategori: "Internet Bisnis",
    deskripsi_kategori: "Paket internet untuk kebutuhan bisnis dan kantor",
    created_at: "2024-01-11",
    updated_at: "2024-01-11",
  },
  {
    id: "3",
    nama_kategori: "Internet Premium",
    deskripsi_kategori: "Paket internet premium dengan kecepatan tinggi",
    created_at: "2024-01-12",
    updated_at: "2024-01-12",
  },
]

// Data Promo
export const promoData: Promo[] = [
  {
    id: "1",
    nama_promo: "Diskon Akhir Tahun",
    diskon: "25.00",
    tgl_mulai: "2024-12-01",
    tgl_selesai: "2024-12-31",
    status_promo: "active",
    created_at: "2024-01-15",
    updated_at: "2024-01-15",
  },
  {
    id: "2",
    nama_promo: "Promo Ramadan",
    diskon: "15.00",
    tgl_mulai: "2024-03-01",
    tgl_selesai: "2024-04-15",
    status_promo: "expired",
    created_at: "2024-01-20",
    updated_at: "2024-01-20",
  },
  {
    id: "3",
    nama_promo: "Flash Sale Weekend",
    diskon: "30.00",
    tgl_mulai: "2024-11-01",
    tgl_selesai: "2024-11-30",
    status_promo: "active",
    created_at: "2024-02-01",
    updated_at: "2024-02-01",
  },
]

// Data Paket
export const paketData: Paket[] = [
  {
    id: "1",
    nama_paket: "Paket Internet 100 Mbps",
    bandwith_paket: "100",
    harga_psb: "500000",
    harga_paket: "350000",
    harga_pkt_ppn: "385000",
    id_kategori: "1",
    id_promo: "1",
    created_at: "2024-01-15",
    updated_at: "2024-01-15",
  },
  {
    id: "2",
    nama_paket: "Paket Internet 50 Mbps",
    bandwith_paket: "50",
    harga_psb: "300000",
    harga_paket: "250000",
    harga_pkt_ppn: "275000",
    id_kategori: "1",
    id_promo: "2",
    created_at: "2024-01-20",
    updated_at: "2024-01-20",
  },
  {
    id: "3",
    nama_paket: "Paket Internet 200 Mbps",
    bandwith_paket: "200",
    harga_psb: "750000",
    harga_paket: "500000",
    harga_pkt_ppn: "550000",
    id_kategori: "2",
    id_promo: "1",
    created_at: "2024-02-01",
    updated_at: "2024-02-01",
  },
  {
    id: "4",
    nama_paket: "Paket Internet 500 Mbps Premium",
    bandwith_paket: "500",
    harga_psb: "1000000",
    harga_paket: "800000",
    harga_pkt_ppn: "880000",
    id_kategori: "3",
    id_promo: "3",
    created_at: "2024-02-05",
    updated_at: "2024-02-05",
  },
]

// Data Paket Indibiz (contoh data untuk form)
export const paketIndibizData: PaketIndibiz[] = [
  {
    id: "1",
    id_paket: "1",
    id_agency: "1",
    status_paket: "active",
    tgl_aktivasi: "2024-01-20",
    tgl_berakhir: "2025-01-20",
    created_at: "2024-01-20",
    updated_at: "2024-01-20",
  },
  {
    id: "2",
    id_paket: "2",
    id_agency: "2",
    status_paket: "active",
    tgl_aktivasi: "2024-02-01",
    tgl_berakhir: "2025-02-01",
    created_at: "2024-02-01",
    updated_at: "2024-02-01",
  },
]

// Helper functions untuk mendapatkan data relasional
export const getKategoriById = (id: string): KategoriPaket | undefined => {
  return kategoriPaketData.find(kategori => kategori.id === id)
}

export const getPromoById = (id: string): Promo | undefined => {
  return promoData.find(promo => promo.id === id)
}

export const getPaketById = (id: string): Paket | undefined => {
  return paketData.find(paket => paket.id === id)
}

export const getPaketWithRelations = (paket: Paket) => {
  return {
    ...paket,
    kategori: getKategoriById(paket.id_kategori),
    promo: getPromoById(paket.id_promo),
  }
}

export const getAllPaketWithRelations = () => {
  return paketData.map(paket => getPaketWithRelations(paket))
}

// Helper untuk mendapatkan harga final setelah diskon
export const calculateFinalPrice = (paket: Paket): number => {
  const promo = getPromoById(paket.id_promo)
  const basePrice = parseFloat(paket.harga_pkt_ppn)
  
  if (promo && promo.status_promo === 'active') {
    const discount = parseFloat(promo.diskon) / 100
    return basePrice * (1 - discount)
  }
  
  return basePrice
}