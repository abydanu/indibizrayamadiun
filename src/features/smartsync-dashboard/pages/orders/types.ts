export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  packageName: string
  packageType: 'Internet' | 'Voice' | 'Data' | 'Bundle'
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  orderDate: string
  completionDate?: string
  totalAmount: number
  paymentStatus: 'unpaid' | 'paid' | 'partial' | 'refunded'
  agencyId: string
  agencyName: string
  notes?: string
}

export interface OrderDetail extends Order {
  customerPhone: string
  customerAddress: string
  packageDetails: {
    speed?: string
    duration: string
    features: string[]
  }
  paymentHistory: {
    date: string
    amount: number
    method: string
    status: string
  }[]
}
