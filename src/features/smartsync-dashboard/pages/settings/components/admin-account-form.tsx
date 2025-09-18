'use client'

import { AccountForm } from './account-form'

interface AdminAccountFormProps {
  initialData?: {
    name?: string
    email?: string
    role?: string
  }
  onSave?: (data: any) => void
}

export function AdminAccountForm({ initialData, onSave }: AdminAccountFormProps) {
  const handleSubmit = (data: any) => {
    // Admin-specific logic
    console.log('Admin account update:', data)
    
    // Call API untuk update admin account
    // await updateAdminAccount(data)
    
    if (onSave) {
      onSave(data)
    }
  }

  return (
    <AccountForm
      userType="admin"
      initialValues={initialData}
      onSubmit={handleSubmit}
    />
  )
}
