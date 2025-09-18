export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  address: string
  registrationDate: string
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  totalOrders: number
  totalSpent: number
  lastOrderDate?: string
  agencyId: string
  agencyName: string
  notes?: string
}

export interface CustomerDetail extends Customer {
  orders: {
    id: string
    orderNumber: string
    packageName: string
    status: string
    orderDate: string
    amount: number
  }[]
  paymentMethods: {
    type: string
    details: string
    isDefault: boolean
  }[]
}
