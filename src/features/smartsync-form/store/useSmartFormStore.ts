import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SmartFormData } from '../hooks/useSmartForm'

interface SmartFormStore {
  formData: Partial<SmartFormData>
  currentStep: number
  setFormData: (data: Partial<SmartFormData>) => void
  updateFormField: (field: keyof SmartFormData, value: any) => void
  setCurrentStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  resetForm: () => void
}

const initialFormData: Partial<SmartFormData> = {
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

export const useSmartFormStore = create<SmartFormStore>()(
  persist(
    (set, get) => ({
      formData: initialFormData,
      currentStep: 1,

      setFormData: (data) => {
        set((state) => ({
          formData: { ...state.formData, ...data }
        }))
      },

      updateFormField: (field, value) => {
        set((state) => ({
          formData: { ...state.formData, [field]: value }
        }))
      },

      setCurrentStep: (step) => {
        set({ currentStep: step })
      },

      nextStep: () => {
        const currentStep = get().currentStep
        if (currentStep < 3) {
          set({ currentStep: currentStep + 1 })
        }
      },

      prevStep: () => {
        const currentStep = get().currentStep
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 })
        }
      },

      resetForm: () => {
        set({
          formData: initialFormData,
          currentStep: 1
        })
      },
    }),
    {
      name: 'smart-form-storage',
      skipHydration: true,
    }
  )
)
