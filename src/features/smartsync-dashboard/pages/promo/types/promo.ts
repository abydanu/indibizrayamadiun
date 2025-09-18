export type Promo = {
  id: string
  namaPromo: string
  jenis: "DISKON" | "CASHBACK" | "GRATIS"
  nilai: any
  deskripsi: string
  mulai: string
  berakhir: string
  isGlobal: boolean
}