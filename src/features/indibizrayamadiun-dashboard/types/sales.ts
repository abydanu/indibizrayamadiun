import type { AgencyDisplay } from "./agency"
import type { Datel } from "./datel"
import type { STO } from "./sto"

export interface Sales {
  id: string
  nama: string
  kode_sales: string
  email: string
  status: "ACTIVE" | "DELETED"
  agency_id: string
  wilayah_id: string
  sto_id: string
  kat_umur_sa: string
  tgl_reg: string
  created_at: string
  updated_at: string
  agency: AgencyDisplay
  wilayah: Datel
  sto: STO
}