import type { Promo } from './promo'
import type { Prodigi } from './prodigi'

export interface Kategori {
  id: string
  nama: string
}

export interface PromoPaket {
  id: string
  promo_id: string
  paket_id: string
  harga_coret: number | null
  diskon_persen?: string | null
  diskon_nominal?: string | null
  promo: Promo
}

export interface Paket {
  id: string
  kode?: string
  nama: string
  kategori: string
  ratio: string
  jenis_paket: string
  bandwidth: number
  ont_type: string
  harga: string
  harga_psb: string
  total?: string | null
  aktif: boolean
  created_at: string
  updated_at: string
  prodigis: Prodigi[]
  promo_pakets: PromoPaket[]
  effective_harga?: number
  effective_psb?: number
  
  // ?: string[]
}