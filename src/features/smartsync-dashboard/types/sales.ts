

export interface Agency {
  id: string
  nama: string
  created_at: string
  updated_at: string
}

export interface Datel {
  id: string
  kode_sto: string
  nama: string
  categori: string
  wilayah: string
  sub_area: string
  created_at: string
  updated_at: string
}

export interface Sales {
  id: string
  nama: string
  kode_sales: string
  email: string
  status: "ACTIVE" | "DELETED"
  agency_id: string
  datel_id: string
  kat_umur_sa: string
  created_at: string
  updated_at: string
  agency: Agency
  datel: Datel
}

export interface SalesApiResponse {
  success: boolean
  message: string
  result: {
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
    data: Sales[]
  }
}