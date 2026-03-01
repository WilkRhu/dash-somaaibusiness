export interface Customer {
  id: string;
  establishmentId: string;
  name: string;
  email?: string;
  phone: string;
  cpf?: string;
  birthDate?: string;
  loyaltyPoints: number;
  totalSpent: number;
  purchaseCount: number;
  lastPurchaseDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerDto {
  name: string;
  email?: string;
  phone: string;
  cpf?: string;
  birthDate?: string;
}

export interface UpdateCustomerDto {
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  birthDate?: string;
}
