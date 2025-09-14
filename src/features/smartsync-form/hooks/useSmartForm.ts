import { useForm } from "react-hook-form"

export interface SmartFormData {
  nama_usaha: string
  datel_pemesanan: string
  hp1: string
  hp2?: string
  alamat_pemasangan: string
  koordinat_alamat: string
  foto_lokasi: File | null
  bukti_usaha: File | null
  bukti_nib_npwp: File | null
  nama_pic: string
  ttl_pic: string
  nomor_ktp: string
  email: string
  foto_ktp: File | null
  foto_ktp_selfie: File | null
  paket_indibiz: string
  nama_sales: string
  kode_sales: string
  agency: string
  asal_datel: string
}

export const useSmartForm = () => {
  return useForm<SmartFormData>({
    mode: "onChange",
    defaultValues: {
      nama_usaha: '',
      datel_pemesanan: '',
      hp1: '',
      hp2: '',
      alamat_pemasangan: '',
      koordinat_alamat: '',
      foto_lokasi: null,
      bukti_usaha: null,
      bukti_nib_npwp: null,
      nama_pic: '',
      ttl_pic: '',
      nomor_ktp: '',
      email: '',
      foto_ktp: null,
      foto_ktp_selfie: null,
      paket_indibiz: '',
      nama_sales: '',
      kode_sales: '',
      agency: '',
      asal_datel: '',
    }
  })
}
