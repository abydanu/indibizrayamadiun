export type UserType = 'admin' | 'agency'

export interface FormFieldConfig {
  name: string
  label: string
  placeholder: string
  description: string
  type?: 'text' | 'email' | 'password'
  required?: boolean
  visible?: boolean
}

export interface AccountFormConfig {
  title: string
  submitButtonText: string
  fields: {
    name?: FormFieldConfig
    email?: FormFieldConfig
    phone?: FormFieldConfig
    oldPassword: FormFieldConfig
    newPassword: FormFieldConfig
  }
}

export const adminFormConfig: AccountFormConfig = {
  title: 'Pengaturan Akun Admin',
  submitButtonText: 'Simpan Perubahan',
  fields: {
    oldPassword: {
      name: 'oldPassword',
      label: 'Password Lama',
      placeholder: '••••••••',
      description: 'Masukkan password lama untuk verifikasi keamanan.',
      type: 'password',
      required: true,
      visible: true
    },
    newPassword: {
      name: 'newPassword',
      label: 'Password Baru',
      placeholder: '••••••••',
      description: 'Gunakan minimal 8 karakter dengan kombinasi huruf, angka, dan simbol.',
      type: 'password',
      required: true,
      visible: true
    },
  }
}

export const agencyFormConfig: AccountFormConfig = {
  title: 'Pengaturan Akun Agency',
  submitButtonText: 'Update Profil',
  fields: {
    name: {
      name: 'name',
      label: 'Nama Agency',
      placeholder: 'Masukkan nama agency',
      description: 'Nama agency akan tampil di profil dan laporan.',
      required: true,
      visible: true
    },
    email: {
      name: 'email',
      label: 'Email Kontak',
      placeholder: 'agency@example.com',
      description: 'Email untuk komunikasi dan notifikasi bisnis.',
      type: 'email',
      required: true,
      visible: true
    },
    oldPassword: {
      name: 'oldPassword',
      label: 'Password Saat Ini',
      placeholder: '••••••••',
      description: 'Konfirmasi password untuk keamanan akun.',
      type: 'password',
      required: true,
      visible: true
    },
    newPassword: {
      name: 'newPassword',
      label: 'Password Baru',
      placeholder: '••••••••',
      description: 'Minimal 6 karakter untuk keamanan akun agency.',
      type: 'password',
      required: true,
      visible: true
    },
    phone: {
      name: 'phone',
      label: 'Nomor Telepon',
      placeholder: '+62 812-3456-7890',
      description: 'Nomor telepon untuk komunikasi darurat.',
      required: false,
      visible: true
    },
  }
}

export function getFormConfig(userType: UserType): AccountFormConfig {
  switch (userType) {
    case 'admin':
      return adminFormConfig
    case 'agency':
      return agencyFormConfig
    default:
      return adminFormConfig
  }
}
