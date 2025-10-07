export type Datel = {
  id: string
  nama: string
  created_at: string
  updated_at: string
  stos: {
    id: string
    nama: string
    sto: {
      id: string
      name: string
      abbreviation: string
      created_at: string
      updated_at: string
    }
  }[]
}