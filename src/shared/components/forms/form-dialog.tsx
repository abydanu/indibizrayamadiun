'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Checkbox } from '@/shared/ui/checkbox';

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'checkbox' | 'custom';
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: any; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  customComponent?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  fields: FormField[];
  onSubmit: () => void;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  isSubmitting?: boolean;
  maxWidth?: string;
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
  onSubmit,
  onCancel,
  submitText = 'Simpan',
  cancelText = 'Batal',
  isSubmitting = false,
  maxWidth = 'sm:max-w-[425px]',
}: FormDialogProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

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
            className={field.className || 'w-full'}
          />
        );

      case 'number':
        return (
          <Input
            id={field.id}
            type="number"
            value={field.value || ''}
            onChange={(e) =>
              field.onChange?.(
                field.step
                  ? parseFloat(e.target.value)
                  : parseInt(e.target.value) || 0
              )
            }
            placeholder={field.placeholder}
            disabled={field.disabled}
            className={field.className || 'w-full'}
            min={field.min}
            max={field.max}
            step={field.step}
          />
        );

      case 'textarea':
        return (
          <Textarea
            id={field.id}
            value={field.value || ''}
            onChange={(e) => field.onChange?.(e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            className={field.className || 'w-full'}
          />
        );

      case 'select':
        return (
          <Select value={String(field.value)} onValueChange={(v) => {
            const parsed = v === 'true' ? true : v === 'false' ? false : v;
            field.onChange?.(parsed);
          }}>
            <SelectTrigger className={field.className || 'w-full'}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={String(option.value)} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className={field.className || 'col-span-3'}>
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
        );

      case 'custom':
        return field.customComponent;

      default:
        return (
          <Input
            id={field.id}
            value={field.value || ''}
            onChange={(e) => field.onChange?.(e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            className={field.className || 'w-full'}
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${maxWidth} w-[95vw] sm:w-auto max-w-[95vw] sm:max-w-none sm:rounded-lg rounded-lg sm:h-auto max-h-[90vh] p-0 sm:p-6 overflow-hidden flex flex-col`}>
        {/* Header - Fixed */}
        <DialogHeader className="p-4 pb-3 sm:p-0 sm:pb-6 border-b sm:border-0 flex-shrink-0">
          <DialogTitle className="text-lg sm:text-xl">{title}</DialogTitle>
          {description && <DialogDescription className="text-sm text-muted-foreground mt-2">{description}</DialogDescription>}
        </DialogHeader>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-0 py-2 sm:py-0">
          <div className="grid gap-4 sm:gap-6">
            {fields.map((field) => (
              <div
                key={field.id}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4"
              >
                <Label 
                  htmlFor={field.id} 
                  className="w-full sm:w-36 lg:w-40 text-left sm:text-right flex-shrink-0 font-medium"
                >
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <div className="flex-1 min-w-0">{renderField(field)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer - Fixed */}
        <DialogFooter className="p-4 pt-3 sm:p-0 sm:pt-6 border-t sm:border-0 flex-shrink-0 bg-background/95 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none">
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto sm:justify-end">
            {onCancel && (
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                {cancelText}
              </Button>
            )}
            <Button 
              type="submit" 
              onClick={onSubmit} 
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              {isSubmitting ? 'Menyimpan...' : submitText}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}