'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/shared/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { Eye, EyeOff } from 'lucide-react'
import { UserType, getFormConfig, AccountFormConfig } from './account-form-config'

type AccountFormValues = {
  name: string
  email: string
  oldPassword: string
  newPassword: string
  phone?: string
  company?: string
  role?: string
}

interface AccountFormProps {
  userType: UserType
  onSubmit?: (data: AccountFormValues) => void
  initialValues?: Partial<AccountFormValues>
}

export function AccountForm({ 
  userType, 
  onSubmit: onSubmitProp,
  initialValues = {} 
}: AccountFormProps) {
  const config = getFormConfig(userType)
  const form = useForm<AccountFormValues>({
    defaultValues: {
      name: initialValues.name || '',
      email: initialValues.email || '',
      oldPassword: '',
      newPassword: '',
      phone: initialValues.phone || '',
      company: initialValues.company || '',
      role: initialValues.role || '',
    },
  })

  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)

  function onSubmit(data: AccountFormValues) {
    if (onSubmitProp) {
      onSubmitProp(data)
    } else {
      console.log(`${userType} account form submitted:`, data)
      // Default behavior - kirim ke API / backend di sini
    }
  }

  const renderFormField = (fieldKey: keyof AccountFormConfig['fields']) => {
    const fieldConfig = config.fields[fieldKey]
    if (!fieldConfig || !fieldConfig.visible) return null

    const isPasswordField = fieldConfig.type === 'password'
    const showPasswordState = fieldKey === 'oldPassword' ? showOld : showNew
    const setShowPasswordState = fieldKey === 'oldPassword' ? setShowOld : setShowNew

    return (
      <FormField
        key={fieldKey}
        control={form.control}
        name={fieldKey as keyof AccountFormValues}
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>{fieldConfig.label}</FormLabel>
            <FormControl>
              {isPasswordField ? (
                <div className="relative">
                  <Input
                    type={showPasswordState ? 'text' : 'password'}
                    placeholder={fieldConfig.placeholder}
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPasswordState(!showPasswordState)}
                  >
                    {showPasswordState ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
              ) : (
                <Input
                  type={fieldConfig.type || 'text'}
                  placeholder={fieldConfig.placeholder}
                  {...field}
                />
              )}
            </FormControl>
            <FormDescription>
              {fieldConfig.description}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{config.title}</h3>
        <p className="text-sm text-muted-foreground">
          Kelola informasi akun {userType === 'admin' ? 'administrator' : 'agency'} Anda
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {renderFormField('name')}
          {renderFormField('email')}
          {renderFormField('phone')}
          {renderFormField('oldPassword')}
          {renderFormField('newPassword')}

          <Button type="submit" className="w-full">
            {config.submitButtonText}
          </Button>
        </form>
      </Form>
    </div>
  )
}
