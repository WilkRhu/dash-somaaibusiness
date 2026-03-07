export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  cpf?: string;
  birthDate?: string;
  avatar?: string;
  loyaltyPoints: number;
  totalSpent: number;
  purchaseCount: number;
  lastPurchaseDate?: string;
  isActive: boolean;
  establishmentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerDto {
  name: string;
  email?: string;
  phone: string;
  cpf?: string;
  birthDate?: string;
  avatar?: string;
}

export interface UpdateCustomerDto {
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  birthDate?: string;
  avatar?: string;
}

export interface CustomerPurchase {
  id: string;
  saleNumber: string;
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

export interface CustomerLoyalty {
  customerId: string;
  customerName: string;
  currentPoints: number;
  totalEarned: number;
  totalRedeemed: number;
}

export interface CustomersListResponse {
  data?: Customer[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}
