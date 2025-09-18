'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { OrderDetail } from '../types'
import { formatCurrency, formatDate } from '@/lib/utils'

interface OrderDetailModalProps {
  order: OrderDetail | null
  open: boolean
  onClose: () => void
}

export function OrderDetailModal({ order, open, onClose }: OrderDetailModalProps) {
  if (!order) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'partial': return 'bg-yellow-100 text-yellow-800'
      case 'unpaid': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Order #{order.orderNumber}</DialogTitle>
          <DialogDescription>
            Informasi lengkap pesanan customer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className={getStatusColor(order.status)}>
                {order.status.toUpperCase()}
              </Badge>
              <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                {order.paymentStatus.toUpperCase()}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Order Date: {formatDate(order.orderDate)}
            </div>
          </div>

          <Separator />

          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Informasi Customer</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nama</p>
                <p className="text-sm">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm">{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Telepon</p>
                <p className="text-sm">{order.customerPhone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Alamat</p>
                <p className="text-sm">{order.customerAddress}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Package Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Informasi Paket</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nama Paket</p>
                <p className="text-sm font-semibold">{order.packageName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tipe</p>
                <Badge variant="outline">{order.packageType}</Badge>
              </div>
              {order.packageDetails.speed && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Kecepatan</p>
                  <p className="text-sm">{order.packageDetails.speed}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Durasi</p>
                <p className="text-sm">{order.packageDetails.duration}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">Fitur</p>
              <div className="flex flex-wrap gap-2">
                {order.packageDetails.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Informasi Pembayaran</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                <p className="text-lg font-semibold">{formatCurrency(order.totalAmount)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status Pembayaran</p>
                <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                  {order.paymentStatus.toUpperCase()}
                </Badge>
              </div>
            </div>

            {order.paymentHistory.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Riwayat Pembayaran</p>
                <div className="space-y-2">
                  {order.paymentHistory.map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{formatCurrency(payment.amount)}</p>
                        <p className="text-xs text-muted-foreground">{payment.method} • {formatDate(payment.date)}</p>
                      </div>
                      <Badge variant={payment.status === 'Berhasil' ? 'default' : 'destructive'}>
                        {payment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {order.notes && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Catatan</h3>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
            <Button>
              Edit Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
