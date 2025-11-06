export type Promo = {
  id: string
  nama: string
  deskripsi: string | null
  tipe_promo: 'DISKON_PERSEN' | 'DISKON_NOMINAL' | 'DISKON_PSB' | 'COMBO'
  harga_khusus?: string | null
  diskon_persen: string | null
  diskon_nominal: string | null
  psb_normal: string | null
  psb_diskon_persen: string | null
  psb_setelah_diskon: string | null
  tanggal_mulai: string
  tanggal_selesai: string
  aktif: boolean
  is_global?: boolean
  created_at: string
  updated_at: string
}