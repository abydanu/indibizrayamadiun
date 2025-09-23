export type Promo = {
  id: string
  nama: string
  deskripsi: string
  jenis: "DISKON" | "CASHBACK" | "BONUS" | "DLL"
  diskon: any
  mulai: string
  akhir: string
  is_global: boolean
}