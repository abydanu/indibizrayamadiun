'use client'

import { AccountForm } from './account-form'

interface AgencyAccountFormProps {
  initialData?: {
    name?: string
    email?: string
    phone?: string
    company?: string
  }
  onSave?: (data: any) => void
}

export function AgencyAccountForm({ initialData, onSave }: AgencyAccountFormProps) {
  const handleSubmit = (data: any) => {
    // Agency-specific logic
    console.log('Agency account update:', data)
    
    // Call API untuk update agency account
    // await updateAgencyAccount(data)
    
    if (onSave) {
      onSave(data)
    }
  }

  return (
    <AccountForm
      userType="agency"
      initialValues={initialData}
      onSubmit={handleSubmit}
    />
  )
}
