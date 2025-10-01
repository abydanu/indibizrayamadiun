import { type Datel } from "./datel"

export type STO = {
  id: string
  kode_sto: string
  nama: string
  categori: "HERO" | "NON_HERO"
  datel_id: string
  sub_area: "INNER" | "OUTER"
  wilayah: Datel
}