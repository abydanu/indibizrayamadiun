export interface Kategori {
  id: string
  nama: string
}

export interface Promo {
  id: string
  nama: string
  deskripsi: string
  jenis: "DISKON" | "CASHBACK" | "GRATIS" | "BUNDLE"
  diskon: string
  mulai: string
  akhir: string
  is_global: boolean
  created_at: string
  updated_at: string
}

export interface PaketCategory {
  id: string
  paket_id: string
  kategori_id: string
  created_at: string
  kategori: Kategori
}

export interface PaketPromo {
  id: string
  paket_id: string
  promo_id: string
  created_at: string
  promo: Promo
}

export interface Paket {
  id: string
  nama: string
  bandwith: number
  price: string
  price_psb: string
  ppn: number
  final_price: string
  created_at: string
  updated_at: string
  is_show: boolean
  paket_categories: PaketCategory[]
  paket_promos: PaketPromo[]
  categories: Kategori[]
  promos: Promo[]
  applied_promos: Promo[]
  promo_type: "specific" | "global" | "none"
}