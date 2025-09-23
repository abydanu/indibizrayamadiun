"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Label } from "@/shared/ui/label"
import { Input } from "@/shared/ui/input"
import { Textarea } from "@/shared/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { Checkbox } from "@/shared/ui/checkbox"

export interface FormField {
  id: string
  label: string
  type: 'text' | 'number' | 'textarea' | 'select' | 'checkbox' | 'custom'
  value?: any
  onChange?: (value: any) => void
  placeholder?: string
  required?: boolean
  options?: Array<{ value: string; label: string }>
  min?: number
  max?: number
  step?: number
  customComponent?: React.ReactNode
  className?: string
  disabled?: boolean
}

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  fields: FormField[]
  onSubmit: () => void
  onCancel?: () => void
  submitText?: string
  cancelText?: string
  isSubmitting?: boolean
  maxWidth?: string
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
  onSubmit,
  onCancel,
  submitText = "Simpan",
  cancelText = "Batal",
  isSubmitting = false,
  maxWidth = "sm:max-w-[425px]"
}: FormDialogProps) {
  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            id={field.id}
            value={field.value || ''}
            onChange={(e) => field.onChange?.(e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            className={field.className || "col-span-3"}
          />
        )
      
      case 'number':
        return (
          <Input
            id={field.id}
            type="number"
            value={field.value || ''}
            onChange={(e) => field.onChange?.(field.step ? parseFloat(e.target.value) : parseInt(e.target.value) || 0)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            className={field.className || "col-span-3"}
            min={field.min}
            max={field.max}
            step={field.step}
          />
        )
      
      case 'textarea':
        return (
          <Textarea
            id={field.id}
            value={field.value || ''}
            onChange={(e) => field.onChange?.(e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            className={field.className || "col-span-3"}
          />
        )
      
      case 'select':
        return (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className={field.className || "col-span-3 w-full"}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      
      case 'checkbox':
        return (
          <div className={field.className || "col-span-3"}>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.id}
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={field.disabled}
              />
              <Label htmlFor={field.id} className="text-sm font-normal">
                {field.placeholder || field.label}
              </Label>
            </div>
          </div>
        )
      
      case 'custom':
        return field.customComponent
      
      default:
        return (
          <Input
            id={field.id}
            value={field.value || ''}
            onChange={(e) => field.onChange?.(e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            className={field.className || "col-span-3"}
          />
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={maxWidth}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {fields.map((field) => (
            <div key={field.id} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.id} className="text-right">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {renderField(field)}
            </div>
          ))}
        </div>
        
        <DialogFooter>
          {onCancel && (
            <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              {cancelText}
            </Button>
          )}
          <Button type="submit" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : submitText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
